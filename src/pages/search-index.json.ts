import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getProducts } from '../lib/db';

export const GET: APIRoute = async () => {
  const db = env.DB;
  const products = await getProducts(db);

  const searchIndex = [
    ...products.map(product => ({
      title: product.title,
      description: `${product.price}${product.originalPrice ? ` (was ${product.originalPrice})` : ''} — ${product.description?.slice(0, 120) || ''}`,
      slug: '/p/',
      url: `/p/${product.id}/`,
      type: 'Product',
      category: product.category,
      image: product.imageUrl,
    }))
  ];

  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' }
  });
};
