import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import * as cheerio from 'cheerio';
import { validateSession } from '../../lib/session';
import { checkRateLimit } from '../../lib/rate-limit';

function extractAmazonProductId(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchWithRetry(url: string, retries = 2): Promise<string | null> {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

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

      const text = await response.text();
      if (text && text.length > 1000 && !text.includes('captcha') && !text.includes('verify')) {
        return text;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const db = env.DB;
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';

  const limited = await checkRateLimit(db, `fetch:${ip}`, 10, 60000);
  if (limited) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' }
    });
  }

  const sessionToken = cookies.get('session')?.value;
  const secret = env.SESSION_SECRET as string;
  if (!sessionToken || !validateSession(sessionToken, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !url.includes('amazon')) {
      return new Response(JSON.stringify({ error: 'Valid Amazon URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const productId = extractAmazonProductId(url);
    const affiliateUrl = (url.includes('tag=') ? url : url + (url.includes('?') ? '&' : '?') + 'tag=softbuydeals-21');

    const html = await fetchWithRetry(url);

    if (!html) {
      return new Response(JSON.stringify({
        title: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        rating: '',
        description: '',
        affiliateUrl,
        amazonUrl: url,
        productId,
        notice: 'Could not auto-fetch from Amazon. Please fill in details manually. Amazon blocks automated requests.',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const $ = cheerio.load(html);

    const title = $('#productTitle').text().trim()
      || $('meta[property="og:title"]').attr('content')
      || $('title').text().replace(/^Amazon\.in:\s*/i, '').trim()
      || '';

    const imageUrl = $('#landingImage').attr('src')
      || $('meta[property="og:image"]').attr('content')
      || $('img#imgBlkFront').attr('src')
      || $('div.imgTagWrapper img').first().attr('src')
      || $('img[data-old-hires]').attr('data-old-hires')
      || '';

    const price = $('.a-price .a-offscreen').first().text().trim()
      || $('#corePrice_desktop .a-price .a-offscreen').first().text().trim()
      || $('span.a-price[data-a-size="xl"] .a-offscreen').text().trim()
      || $('span.a-price[data-a-size="l"] .a-offscreen').text().trim()
      || $('span.a-price[data-a-size="large"] .a-offscreen').text().trim()
      || '';

    const originalPrice = $('span.a-price.a-text-price .a-offscreen').first().text().trim()
      || $('.a-price.a-text-price span.a-offscreen').text().trim()
      || '';

    const rating = $('i.a-icon-star span.a-icon-alt').first().text().trim()
      || $('span#acrPopover').attr('title')
      || '';

    const description = $('#productDescription p').text().trim()
      || $('#feature-bullets ul li').map((_, el) => $(el).text().trim()).get().join(' ')
      || $('meta[name="description"]').attr('content')
      || '';

    const highResImage = imageUrl
      ? imageUrl.replace(/\._AC_UL\d+_\./g, '.')
          .replace(/\._SX\d+_\./g, '.')
          .replace(/\._SY\d+_\./g, '.')
          .replace(/\._SL\d+_\./g, '.')
          .replace(/\._SS\d+_\./g, '.')
      : '';

    return new Response(JSON.stringify({
      title,
      price,
      originalPrice,
      imageUrl: highResImage || imageUrl,
      rating,
      description,
      affiliateUrl,
      amazonUrl: url,
      productId,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    console.error('fetch-amazon failed');
    return new Response(JSON.stringify({
      error: 'Failed to fetch product details from Amazon',
      notice: 'Amazon blocks automated requests. Please fill in the product details manually.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
