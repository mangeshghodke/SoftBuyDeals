import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getProducts } from '../lib/db';
import { CATEGORY_GUIDES } from '../lib/categories';

export const GET: APIRoute = async () => {
  const db = env.DB;
  const products = await getProducts(db);

  const searchIndex = [
    ...Object.entries(CATEGORY_GUIDES).map(([name, guide]) => ({
      title: `${name} Buying Guide`,
      description: guide.guideIntro,
      slug: '/guides/',
      url: `/guides/${encodeURIComponent(name.toLowerCase())}/`,
      type: 'Guide',
      category: name,
    })),
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
