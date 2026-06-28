import type { Product } from './data';

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

export async function notifyProduct(
  product: Product,
  botToken: string,
  channelId: string,
): Promise<void> {
  const caption = [
    `<b>${product.title}</b>`,
    product.price ? `\n💰 ${product.price}` : '',
    product.originalPrice ? ` <s>${product.originalPrice}</s>` : '',
    product.category ? `\n🏷️ ${product.category}` : '',
    product.affiliateUrl ? `\n\n<a href="${product.affiliateUrl}">🛒 Buy on Amazon</a>` : '',
    `\n\n#softbuydeals`,
  ].filter(Boolean).join('');

  if (product.imageUrl?.startsWith('http')) {
    const ok = await sendTelegram(botToken, 'sendPhoto', {
      chat_id: channelId,
      photo: product.imageUrl,
      caption,
      parse_mode: 'HTML',
    });
    if (ok) return;
  }

  await sendTelegram(botToken, 'sendMessage', {
    chat_id: channelId,
    text: caption,
    parse_mode: 'HTML',
  });
}
