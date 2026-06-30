import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../config';
import { getProducts } from '../lib/data';

type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

const staticEntries: SitemapEntry[] = [
  { path: '/' },
  { path: '/products/' },
  { path: '/blog/' },
  { path: '/about/' },
  { path: '/contact/' },
  { path: '/privacy/' },
  { path: '/terms/' },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  const products = await getProducts(env.DB);
  const entries = [
    ...staticEntries,
    ...posts.map((post) => ({
      path: `/blog/${post.id}/`,
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    })),
    ...products.map((product) => ({
      path: `/products/${product.id}/`,
      lastmod: product.createdAt ? new Date(product.createdAt) : undefined,
    })),
  ];

  const urls = entries
    .map((entry) => {
      const loc = new URL(entry.path, SITE_URL).href;
      const lastmod = entry.lastmod ? `\n    <lastmod>${formatDate(entry.lastmod)}</lastmod>` : '';

      return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
  </url>`;
    })
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
