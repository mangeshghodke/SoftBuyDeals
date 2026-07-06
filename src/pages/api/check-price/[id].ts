import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import * as cheerio from 'cheerio';
import { getProductById, updateProduct, recordPrice } from '../../../lib/data';
import { validateSession } from '../../../lib/session';
import { checkRateLimit } from '../../../lib/rate-limit';

async function fetchPrice(url: string): Promise<{ price: string; originalPrice: string } | null> {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgents[attempt],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8',
          'DNT': '1',
        }
      });

      clearTimeout(timeout);
      if (!response.ok) continue;

      const html = await response.text();
      if (!html || html.length < 1000 || html.includes('captcha') || html.includes('verify')) continue;

      const $ = cheerio.load(html);
      const price = $('.a-price .a-offscreen').first().text().trim()
        || $('#corePrice_desktop .a-price .a-offscreen').first().text().trim()
        || '';
      const originalPrice = $('span.a-price.a-text-price .a-offscreen').first().text().trim()
        || '';

      if (price) return { price, originalPrice };
    } catch {
      continue;
    }
  }
  return null;
}

export const POST: APIRoute = async ({ params, request, cookies, clientAddress }) => {
  const db = env.DB;
  const secret = env.SESSION_SECRET as string;

  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  const limited = await checkRateLimit(db, `check:${ip}`, 20, 60000);
  if (limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429, headers: { 'Content-Type': 'application/json' }
    });
  }

  const sessionToken = cookies.get('session')?.value;
  if (!sessionToken || !validateSession(sessionToken, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const product = await getProductById(db, id);
  if (!product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!product.amazonUrl) {
    return new Response(JSON.stringify({ error: 'No Amazon URL for this product' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await fetchPrice(product.amazonUrl);
  if (!result) {
    return new Response(JSON.stringify({ error: 'Could not fetch price from Amazon' }), {
      status: 502, headers: { 'Content-Type': 'application/json' }
    });
  }

  await updateProduct(db, id, { price: result.price, originalPrice: result.originalPrice });
  await recordPrice(db, id, result.price);

  return new Response(JSON.stringify({
    price: result.price,
    originalPrice: result.originalPrice,
  }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
