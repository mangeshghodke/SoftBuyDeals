import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { SITE_URL } from '../config';
import { getProducts } from '../lib/data';
import { CATEGORY_GUIDES } from '../lib/categories';

type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

const staticEntries: SitemapEntry[] = [
  { path: '/' },
  { path: '/products/' },
  { path: '/guides/' },
  ...Object.keys(CATEGORY_GUIDES).map(name => ({ path: `/guides/${encodeURIComponent(name.toLowerCase())}/` as string })),
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
  const products = await getProducts(env.DB);
  const entries = [
    ...staticEntries,
    ...products.map((product) => ({
      path: `/p/${product.id}/`,
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
