import type { Product } from './data';

function parsePrice(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s.replace(/[₹,]/g, ''));
  return isNaN(n) ? null : n;
}

function fmtPrice(s: string | undefined): string {
  if (!s) return '';
  return s.startsWith('₹') ? s : `₹${s}`;
}

async function sendTelegram(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`Telegram ${method} failed:`, err);
    }
    return res.ok;
  } catch (err) {
    console.error(`Telegram ${method} error:`, err);
    return false;
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function notifyProduct(
  product: Product,
  botToken: string,
  channelId: string,
): Promise<void> {
  const offer = parsePrice(product.price);
  const mrp = parsePrice(product.originalPrice);
  const savings = offer !== null && mrp !== null ? mrp - offer : null;

  const lines: string[] = [
    `🎯 <b>${esc(product.title)}</b>`,
    ``,
    `💰 <b>Offer Price:</b> ${fmtPrice(product.price)}`,
  ];

  if (product.originalPrice) {
    lines.push(`🏷️ <b>MRP:</b> <s>${fmtPrice(product.originalPrice)}</s>`);
  }

  if (savings !== null && savings > 0) {
    const pct = Math.round((savings / mrp!) * 100);
    lines.push(`🔥 <b>Savings:</b> ₹${savings.toLocaleString('en-IN')} (${pct}% off)`);
  }

  if (product.category) {
    lines.push(`📂 <b>Category:</b> ${esc(product.category)}`);
  }

  lines.push(``, `⬇️ Click below to grab the deal!`, `#softbuydeals`);

  const caption = lines.join('\n');

  const reply_markup = product.affiliateUrl
    ? {
        inline_keyboard: [
          [
            {
              text: '🛒 Checkout Here',
              url: product.affiliateUrl,
            },
          ],
        ],
      }
    : undefined;

  if (product.imageUrl?.startsWith('http')) {
    const ok = await sendTelegram(botToken, 'sendPhoto', {
      chat_id: channelId,
      photo: product.imageUrl,
      caption,
      parse_mode: 'HTML',
      reply_markup,
    });
    if (ok) return;
  }

  await sendTelegram(botToken, 'sendMessage', {
    chat_id: channelId,
    text: caption,
    parse_mode: 'HTML',
    reply_markup,
  });
}
