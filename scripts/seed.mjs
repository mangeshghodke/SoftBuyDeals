import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, '..', 'src', 'data', 'products.json');
const sqlPath = join(__dirname, 'seed.sql');

const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
const products = data.products || [];

const lines = [
  'CREATE TABLE IF NOT EXISTS products (',
  '  id TEXT PRIMARY KEY,',
  '  title TEXT NOT NULL,',
  '  price TEXT NOT NULL DEFAULT \'\',',
  '  originalPrice TEXT NOT NULL DEFAULT \'\',',
  '  imageUrl TEXT NOT NULL DEFAULT \'\',',
  '  amazonUrl TEXT NOT NULL DEFAULT \'\',',
  '  affiliateUrl TEXT NOT NULL DEFAULT \'\',',
  '  description TEXT NOT NULL DEFAULT \'\',',
  '  rating TEXT NOT NULL DEFAULT \'\',',
  '  category TEXT NOT NULL DEFAULT \'Uncategorized\',',
  '  createdAt TEXT NOT NULL',
  ');',
  '',
];

function esc(s) {
  return (s || '').replace(/'/g, "''");
}

for (const p of products) {
  lines.push(
    `INSERT INTO products (id, title, price, originalPrice, imageUrl, amazonUrl, affiliateUrl, description, rating, category, createdAt) ` +
    `VALUES ('${esc(p.id)}', '${esc(p.title)}', '${esc(p.price)}', '${esc(p.originalPrice)}', ` +
    `'${esc(p.imageUrl)}', '${esc(p.amazonUrl)}', '${esc(p.affiliateUrl)}', '${esc(p.description)}', ` +
    `'${esc(p.rating)}', '${esc(p.category)}', '${esc(p.createdAt)}');`
  );
}

writeFileSync(sqlPath, lines.join('\n'), 'utf-8');
console.log(`Generated seed.sql with ${products.length} products`);
