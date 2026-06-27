import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCollection } from 'astro:content';
import { getProducts } from '../lib/db';

export const GET: APIRoute = async () => {
  const db = env.DB;
  const blog = await getCollection('blog');
  const products = await getProducts(db);

  const searchIndex = [
    ...blog.map(post => ({
      title: post.data.title,
      description: post.data.description,
      slug: `/blog/${post.id}`,
      url: `/blog/${post.id}/`,
      type: 'Blog Post'
    })),
    ...products.map(product => ({
      title: product.title,
      description: `${product.price}${product.originalPrice ? ` (was ${product.originalPrice})` : ''} — ${product.description?.slice(0, 120) || ''}`,
      slug: '/products/',
      url: `/products/${product.id}/`,
      type: 'Product',
      category: product.category,
      image: product.imageUrl,
    }))
  ];

  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' }
  });
};
