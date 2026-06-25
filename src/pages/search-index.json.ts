import { getCollection } from 'astro:content';
import { readFileSync, existsSync } from 'fs';

const DATA_FILE = 'src/data/products.json';

function getProducts() {
  try {
    if (!existsSync(DATA_FILE)) return [];
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8')).products || [];
  } catch { return []; }
}

export async function GET() {
  const blog = await getCollection('blog');
  const changelog = await getCollection('changelog');
  const products = getProducts();

  const searchIndex = [
    ...blog.map(post => ({
      title: post.data.title,
      description: post.data.description,
      slug: `/blog/${post.id}`,
      url: `/blog/${post.id}/`,
      type: 'Blog Post'
    })),
    ...changelog.map(entry => ({
      title: `${entry.data.version}: ${entry.data.title}`,
      description: 'Product update and changelog entry.',
      slug: '/changelog',
      url: '/changelog/',
      type: 'Changelog'
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
