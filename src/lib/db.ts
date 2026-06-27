import Database from 'better-sqlite3';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface Product {
  id: string; title: string; price: string; originalPrice: string;
  imageUrl: string; amazonUrl: string; affiliateUrl: string;
  description: string; rating: string; category: string; createdAt: string;
}

const DB_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DB_DIR, 'products.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    migrate(_db);
    const count = (_db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
    if (count === 0) {
      const jsonPath = join(process.cwd(), 'src/data/products.json');
      if (existsSync(jsonPath)) {
        importFromJson(jsonPath);
      }
    }
  }
  return _db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price TEXT NOT NULL DEFAULT '',
      originalPrice TEXT NOT NULL DEFAULT '',
      imageUrl TEXT NOT NULL DEFAULT '',
      amazonUrl TEXT NOT NULL DEFAULT '',
      affiliateUrl TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      rating TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Uncategorized',
      createdAt TEXT NOT NULL
    )
  `);
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    title: row.title as string,
    price: row.price as string,
    originalPrice: row.originalPrice as string,
    imageUrl: row.imageUrl as string,
    amazonUrl: row.amazonUrl as string,
    affiliateUrl: row.affiliateUrl as string,
    description: row.description as string,
    rating: row.rating as string,
    category: row.category as string,
    createdAt: row.createdAt as string,
  };
}

export function getProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all() as Record<string, unknown>[];
  return rows.map(rowToProduct);
}

export function getProductById(id: string): Product | undefined {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function createProduct(product: Product): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO products (id, title, price, originalPrice, imageUrl, amazonUrl, affiliateUrl, description, rating, category, createdAt)
    VALUES (@id, @title, @price, @originalPrice, @imageUrl, @amazonUrl, @affiliateUrl, @description, @rating, @category, @createdAt)
  `).run(product);
}

export function updateProduct(id: string, product: Partial<Product>): void {
  const db = getDb();
  const fields: string[] = [];
  const values: Record<string, unknown> = { id };
  for (const [key, value] of Object.entries(product)) {
    if (key !== 'id' && value !== undefined) {
      fields.push(`${key} = @${key}`);
      (values as Record<string, unknown>)[key] = value;
    }
  }
  if (fields.length > 0) {
    db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = @id`).run(values);
  }
}

export function deleteProduct(id: string): void {
  const db = getDb();
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function importFromJson(jsonPath: string): number {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (count.count > 0) return 0;

  if (!existsSync(jsonPath)) return 0;
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const products: Product[] = data.products || [];

  const insert = db.prepare(`
    INSERT INTO products (id, title, price, originalPrice, imageUrl, amazonUrl, affiliateUrl, description, rating, category, createdAt)
    VALUES (@id, @title, @price, @originalPrice, @imageUrl, @amazonUrl, @affiliateUrl, @description, @rating, @category, @createdAt)
  `);

  const tx = db.transaction((items: Product[]) => {
    for (const item of items) insert.run(item);
  });
  tx(products);

  return products.length;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}
