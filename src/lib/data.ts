import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const DATA_FILE = 'src/data/products.json';

export interface Product {
  id: string; title: string; price: string; originalPrice: string;
  imageUrl: string; amazonUrl: string; affiliateUrl: string;
  description: string; rating: string; category: string; createdAt: string;
}

export function getProducts(): Product[] {
  try {
    if (!existsSync(DATA_FILE)) {
      writeFileSync(DATA_FILE, '{"products":[]}');
      return [];
    }
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8')).products || [];
  } catch {
    return [];
  }
}
