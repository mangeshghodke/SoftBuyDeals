import type { Product } from './data';
import { SITE_URL } from '../config';

const API_VERSION = 'v1.0';
const API_BASE = `https://graph.threads.net/${API_VERSION}`;

function parsePrice(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(/[₹,]/g, ''));
  return isNaN(n) ? null : n;
}

function fmtPrice(s: string | undefined): string {
  if (!s) return '';
  return s.startsWith('₹') ? s : `₹${s}`;
}

function buildCaption(product: Product): string {
  const offer = parsePrice(product.price);
  const mrp = parsePrice(product.originalPrice);
  const savings = offer !== null && mrp !== null ? mrp - offer : null;

  const parts: string[] = [];
  parts.push(`🎯 ${product.title}`);
  parts.push('');
  parts.push(`Offer Price: ${fmtPrice(product.price)} ✅`);

  if (mrp !== null && mrp > (offer ?? 0)) {
    parts.push(`MRP: ${fmtPrice(product.originalPrice)} ❌`);
  }

  if (savings !== null && savings > 0) {
    const pct = Math.round((savings / mrp!) * 100);
    parts.push(`Save ₹${savings.toLocaleString('en-IN')} (${pct}% off) 🔥`);
  }

  if (product.category) {
    parts.push(`${product.category} 📂`);
  }

  parts.push('');

  parts.push(`${SITE_URL.replace(/\/$/, '')}/products/${product.id}/`);

  parts.push('');
  parts.push('#softbuydeals #amazonfinds #deals');

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

export async function postThread(
  product: Product,
  accessToken: string,
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const text = buildCaption(product);

  async function tryPost(mediaType: 'TEXT' | 'IMAGE', imageUrl?: string): Promise<{ ok: boolean; error?: string }> {
    const params: Record<string, string> = { media_type: mediaType, text };
    if (imageUrl) params.image_url = imageUrl;

    const createRes = await apiFetch(`${userId}/threads`, params, accessToken);
    if (!createRes.ok) {
      const err = await createRes.text();
      return { ok: false, error: `create container (${mediaType}): ${err}` };
    }

    const { id: creationId } = await createRes.json() as { id: string };

    const publishRes = await apiFetch(
      `${userId}/threads_publish`,
      { creation_id: creationId },
      accessToken,
    );

    if (!publishRes.ok) {
      const err = await publishRes.text();
      return { ok: false, error: `publish (${mediaType}): ${err}` };
    }

    console.log(`Threads: posted ${creationId} (${mediaType})`);
    return { ok: true };
  }

  // Try IMAGE first if product has an image; fall back to TEXT on failure
  if (product.imageUrl?.startsWith('http')) {
    const result = await tryPost('IMAGE', product.imageUrl);
    if (result.ok) return result;
    console.error('Threads: IMAGE attempt failed, falling back to TEXT:', result.error);
  }

  return tryPost('TEXT');
}
