import type { Product } from './data';

async function sendTelegram(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // fire and forget
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

  if (product.imageUrl) {
    await sendTelegram(botToken, 'sendPhoto', {
      chat_id: channelId,
      photo: product.imageUrl,
      caption,
      parse_mode: 'HTML',
    });
  } else {
    await sendTelegram(botToken, 'sendMessage', {
      chat_id: channelId,
      text: caption,
      parse_mode: 'HTML',
    });
  }
}
