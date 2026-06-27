import { getCollection } from 'astro:content';
import { getProducts } from '../lib/db';

export async function GET() {
  const blog = await getCollection('blog');
  const products = getProducts();

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
}
