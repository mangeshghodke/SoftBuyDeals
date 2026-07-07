export interface Product {
  id: string; title: string; price: string; originalPrice: string;
  imageUrl: string; amazonUrl: string; affiliateUrl: string;
  description: string; rating: string; category: string; createdAt: string;
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

let _initialized = false;

async function ensureTable(db: any): Promise<void> {
  if (!_initialized) {
    await db.prepare(`
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
    `).run();
    _initialized = true;
  }
}

export async function getProducts(db: any): Promise<Product[]> {
  await ensureTable(db);
  const { results } = await db.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
  return (results || []).map(rowToProduct);
}

export async function getProductById(db: any, id: string): Promise<Product | undefined> {
  await ensureTable(db);
  const row = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
  return row ? rowToProduct(row as Record<string, unknown>) : undefined;
}

export async function createProduct(db: any, product: Product): Promise<void> {
  await ensureTable(db);
  await db.prepare(`
    INSERT INTO products (id, title, price, originalPrice, imageUrl, amazonUrl, affiliateUrl, description, rating, category, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    product.id, product.title, product.price, product.originalPrice,
    product.imageUrl, product.amazonUrl, product.affiliateUrl,
    product.description, product.rating, product.category, product.createdAt
  ).run();
}

export async function updateProduct(db: any, id: string, product: Partial<Product>): Promise<void> {
  await ensureTable(db);
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, value] of Object.entries(product)) {
    if (key !== 'id' && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length > 0) {
    values.push(id);
    await db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  }
}

export async function deleteProduct(db: any, id: string): Promise<void> {
  await ensureTable(db);
  await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
}

async function ensureCounterTable(db: any): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS visitor_counter (
      id INTEGER PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `).run();
  await db.prepare('INSERT OR IGNORE INTO visitor_counter (id, count) VALUES (1, 0)').run();
}

export async function getCounter(db: any): Promise<number> {
  await ensureCounterTable(db);
  const row = await db.prepare('SELECT count FROM visitor_counter WHERE id = 1').first();
  return (row?.count as number) || 0;
}

export async function incrementCounter(db: any): Promise<number> {
  await ensureCounterTable(db);
  await db.prepare('UPDATE visitor_counter SET count = count + 1 WHERE id = 1').run();
  const row = await db.prepare('SELECT count FROM visitor_counter WHERE id = 1').first();
  return (row?.count as number) || 0;
}



