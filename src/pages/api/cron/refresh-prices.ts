import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request }) => {
  const secret = env.CRON_SECRET as string;
  if (!secret || request.headers.get('Authorization') !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = env.DB;
  const { results } = await db.prepare(
    "SELECT id, amazonUrl, price FROM products WHERE amazonUrl != '' AND amazonUrl IS NOT NULL"
  ).all();

  return new Response(JSON.stringify({ products: results || [] }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const secret = env.CRON_SECRET as string;
  if (!secret || request.headers.get('Authorization') !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  const { id, price, originalPrice } = body;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const db = env.DB;
  await db.prepare('UPDATE products SET price = ?, originalPrice = ? WHERE id = ?')
    .bind(price || '', originalPrice || '', id).run();

  if (price) {
    await db.prepare('CREATE TABLE IF NOT EXISTS price_history (id TEXT PRIMARY KEY, product_id TEXT NOT NULL, price TEXT NOT NULL, created_at TEXT NOT NULL)').run();
    const pid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    await db.prepare('INSERT INTO price_history (id, product_id, price, created_at) VALUES (?, ?, ?, ?)')
      .bind(pid, id, price, new Date().toISOString()).run();
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
