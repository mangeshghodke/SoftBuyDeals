import * as cheerio from 'cheerio';

const WORKER_URL = process.env.WORKER_URL || 'https://softbuydeals.ghodke-mangesh2.workers.dev';
const CRON_SECRET = process.env.CRON_SECRET;

if (!CRON_SECRET) {
  console.error('CRON_SECRET environment variable required');
  process.exit(1);
}

const headers = { 'Authorization': `Bearer ${CRON_SECRET}`, 'Content-Type': 'application/json' };
function extractAsin(url) {
  const m = url.match(/\/dp\/([A-Z0-9]{10})/);
  return m ? m[1] : null;
}

function isCaptchaPage(html) {
  const lower = html.toLowerCase();
  const antiBot = [
    'sorry, we just need to make sure',
    'enter the characters you see',
    'type the characters you see',
    'please verify you\'re a human',
    'please verify you are a human',
    'to discuss automated access',
    'automated access to amazon',
    'are you a robot',
    'robot check',
    'your request has been blocked',
    'something about your browser',
    'enable javascript to continue',
    'captcha-bot',
  ];
  for (const phrase of antiBot) {
    if (lower.includes(phrase)) return true;
  }
  return false;
}

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
];

async function fetchPrice(url) {
  const asin = extractAsin(url);
  const fetchUrl = asin ? `https://www.amazon.in/dp/${asin}` : url;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': userAgents[attempt % userAgents.length],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8,hi;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
        }
      });
      clearTimeout(timeout);
      if (!response.ok) continue;

      const html = await response.text();
      if (!html || html.length < 1000) continue;
      if (isCaptchaPage(html)) continue;

      const $ = cheerio.load(html);
      const price = $('.a-price .a-offscreen').first().text().trim()
        || $('#corePrice_desktop .a-price .a-offscreen').first().text().trim()
        || $('span.a-price[data-a-size="xl"] .a-offscreen').text().trim()
        || $('span.a-price[data-a-size="l"] .a-offscreen').text().trim()
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

async function main() {
  console.log('Fetching products from Worker...');
  const res = await fetch(`${WORKER_URL}/api/cron/refresh-prices/`, { headers });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to fetch products: ${res.status} ${text}`);
    process.exit(1);
  }
  const { products } = await res.json();
  console.log(`Found ${products.length} products with Amazon URLs`);

  let updated = 0;
  let failed = 0;

  for (const product of products) {
    process.stdout.write(`Checking ${product.id.slice(0, 8)}... `);
    const result = await fetchPrice(product.amazonUrl);
    if (result) {
      const updateRes = await fetch(`${WORKER_URL}/api/cron/refresh-prices/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ id: product.id, price: result.price, originalPrice: result.originalPrice }),
      });
      if (updateRes.ok) {
        console.log(`₹${result.price}${result.originalPrice ? ` (was ₹${result.originalPrice})` : ''}`);
        updated++;
      } else {
        console.log('update failed');
        failed++;
      }
    } else {
      console.log('Amazon blocked');
      failed++;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone: ${updated} updated, ${failed} failed`);
}

main().catch(err => { console.error(err); process.exit(1); });
