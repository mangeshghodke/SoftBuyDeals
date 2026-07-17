import type { Product } from './data';
import { SITE_URL } from '../config';

const API_VERSION = 'v1.0';
const API_BASE = `https://graph.threads.net/${API_VERSION}`;

const REFRESH_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;

function buildCaption(product: Product): string {
  const parts: string[] = [];
  parts.push(`🎯 ${product.title}`);
  parts.push('');

  if (product.category) {
    parts.push(`${product.category} 📂`);
  }

  if (product.price) {
    parts.push(`💰 ${product.price}`);
  }

  parts.push('');

  parts.push(`${SITE_URL.replace(/\/$/, '')}/p/${product.id}/`);

  parts.push('');
  parts.push(`Join our Telegram channel for more deals: https://t.me/softbuydeals`);
  parts.push('');
  parts.push('#softbuydeals #amazonfinds #deals #ad');

  return parts.join('\n');
}

async function apiFetch(
  path: string,
  params: Record<string, string>,
  accessToken: string,
): Promise<Response> {
  const url = new URL(`${API_BASE}/${path}`);

  const body = new URLSearchParams();
  body.set('access_token', accessToken);
  for (const [k, v] of Object.entries(params)) {
    body.set(k, v);
  }

  return fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    signal: AbortSignal.timeout(30000),
  });
}

async function refreshToken(token: string): Promise<string | null> {
  const url = new URL(`${API_BASE}/refresh_access_token`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('grant_type', 'th_refresh_token');

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Threads: token refresh failed:', err);
      return null;
    }
    const data = await res.json() as { access_token: string };
    console.log('Threads: token refreshed successfully');
    return data.access_token;
  } catch (e) {
    console.error('Threads: token refresh error:', e);
    return null;
  }
}

async function resolveToken(envToken: string, db: any): Promise<string> {
  if (!db) return envToken;

  await db.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run();
  const storedToken = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('threads_access_token').first();
  const lastUpdated = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('threads_token_updated').first();

  const currentToken = (storedToken?.value as string) || envToken;
  const updated = lastUpdated?.value as string | undefined;

  if (updated) {
    const age = Date.now() - new Date(updated).getTime();
    if (age < REFRESH_THRESHOLD_MS) {
      return currentToken;
    }
  }

  const newToken = await refreshToken(currentToken);
  if (newToken) {
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind('threads_access_token', newToken).run();
    await db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind('threads_token_updated', new Date().toISOString()).run();
    return newToken;
  }

  return currentToken;
}

export async function postThread(
  product: Product,
  accessToken: string,
  userId: string,
  db?: any,
): Promise<{ ok: boolean; error?: string }> {
  const token = db ? await resolveToken(accessToken, db) : accessToken;
  const text = buildCaption(product);

  async function tryPost(mediaType: 'TEXT' | 'IMAGE', imageUrl?: string): Promise<{ ok: boolean; error?: string }> {
    const params: Record<string, string> = { media_type: mediaType, text };
    if (imageUrl) params.image_url = imageUrl;

    const createRes = await apiFetch(`${userId}/threads`, params, token);
    if (!createRes.ok) {
      const err = await createRes.text();
      return { ok: false, error: `create container (${mediaType}): ${err}` };
    }

    const { id: creationId } = await createRes.json() as { id: string };

    const publishRes = await apiFetch(
      `${userId}/threads_publish`,
      { creation_id: creationId },
      token,
    );

    if (!publishRes.ok) {
      const err = await publishRes.text();
      return { ok: false, error: `publish (${mediaType}): ${err}` };
    }

    console.log(`Threads: posted ${creationId} (${mediaType})`);
    return { ok: true };
  }

  if (product.imageUrl?.startsWith('http')) {
    const result = await tryPost('IMAGE', product.imageUrl);
    if (result.ok) return result;
    console.error('Threads: IMAGE attempt failed, falling back to TEXT:', result.error);
  }

  return tryPost('TEXT');
}