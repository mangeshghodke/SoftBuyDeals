import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import * as cheerio from 'cheerio';
import { getProductById, updateProduct, recordPrice } from '../../../lib/data';
import { validateSession } from '../../../lib/session';
import { checkRateLimit } from '../../../lib/rate-limit';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

async function fetchPrice(url: string): Promise<{ price: string; originalPrice: string } | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgents[attempt % userAgents.length],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8,hi;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Cache-Control': 'max-age=0',
        }
      });

      clearTimeout(timeout);
      if (!response.ok) continue;

      const html = await response.text();
      if (!html || html.length < 1000 || html.includes('captcha') || html.includes('verify')) continue;

      const $ = cheerio.load(html);
      const price = $('.a-price .a-offscreen').first().text().trim()
        || $('#corePrice_desktop .a-price .a-offscreen').first().text().trim()
        || $('span.a-price[data-a-size="xl"] .a-offscreen').text().trim()
        || $('span.a-price[data-a-size="l"] .a-offscreen').text().trim()
        || $('span.a-price[data-a-size="large"] .a-offscreen').text().trim()
        || '';
      const originalPrice = $('span.a-price.a-text-price .a-offscreen').first().text().trim()
        || $('.a-price.a-text-price span.a-offscreen').text().trim()
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
    return new Response(JSON.stringify({
      error: 'Amazon blocked the automated request',
      notice: 'Cloudflare Workers IPs are often blocked by Amazon. Try checking the price manually on Amazon, or use the "Fetch from URL" option when editing the product.',
    }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
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
