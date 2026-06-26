import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { validateSession } from '../../lib/session';

const DATA_FILE = 'src/data/products.json';

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  amazonUrl: string;
  affiliateUrl: string;
  description: string;
  rating: string;
  category: string;
  createdAt: string;
}

function getProducts(): Product[] {
  try {
    if (!existsSync(DATA_FILE)) {
      writeFileSync(DATA_FILE, '{"products":[]}');
      return [];
    }
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    return data.products || [];
  } catch {
    return [];
  }
}

function saveProducts(products: Product[]): void {
  writeFileSync(DATA_FILE, JSON.stringify({ products }, null, 2));
}

function checkAuth(cookies: any): boolean {
  const sessionToken = cookies.get('session')?.value;
  return !!sessionToken && !!validateSession(sessionToken);
}

export const GET: APIRoute = async ({ url, cookies }) => {
  const isAdmin = checkAuth(cookies);
  const products = getProducts();

  const singleId = url.searchParams.get('id');
  if (singleId) {
    const product = products.find(p => p.id === singleId);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(product), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ products }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!checkAuth(cookies)) {
    return redirect('/admin/login/');
  }

  const formData = await request.formData();
  const products = getProducts();
  const existingId = formData.get('id')?.toString();

  if (existingId) {
    const index = products.findIndex(p => p.id === existingId);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' }
      });
    }

    products[index] = {
      ...products[index],
      title: formData.get('title')?.toString() || products[index].title,
      price: formData.get('price')?.toString() || products[index].price,
      originalPrice: formData.get('originalPrice')?.toString() || products[index].originalPrice,
      imageUrl: formData.get('imageUrl')?.toString() || products[index].imageUrl,
      amazonUrl: formData.get('amazonUrl')?.toString() || products[index].amazonUrl,
      affiliateUrl: formData.get('affiliateUrl')?.toString() || products[index].affiliateUrl,
      description: formData.get('description')?.toString() || products[index].description,
      rating: formData.get('rating')?.toString() || products[index].rating,
      category: formData.get('category')?.toString() || products[index].category,
    };

    saveProducts(products);

    if (request.headers.get('Accept') === 'application/json') {
      return new Response(JSON.stringify(products[index]), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    return redirect('/admin/dashboard/');
  }

  const newProduct: Product = {
    id: crypto.randomUUID(),
    title: formData.get('title')?.toString() || '',
    price: formData.get('price')?.toString() || '',
    originalPrice: formData.get('originalPrice')?.toString() || '',
    imageUrl: formData.get('imageUrl')?.toString() || '',
    amazonUrl: formData.get('amazonUrl')?.toString() || '',
    affiliateUrl: formData.get('affiliateUrl')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    rating: formData.get('rating')?.toString() || '',
    category: formData.get('category')?.toString() || 'Uncategorized',
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  saveProducts(products);

  if (request.headers.get('Accept') === 'application/json') {
    return new Response(JSON.stringify(newProduct), {
      status: 201, headers: { 'Content-Type': 'application/json' }
    });
  }

  return redirect('/admin/dashboard/');
};

export const PUT: APIRoute = async ({ request, cookies, redirect }) => {
  if (!checkAuth(cookies)) {
    return redirect('/admin/login/');
  }

  const formData = await request.formData();
  const id = formData.get('id')?.toString();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404, headers: { 'Content-Type': 'application/json' }
    });
  }

  products[index] = {
    ...products[index],
    title: formData.get('title')?.toString() || products[index].title,
    price: formData.get('price')?.toString() || products[index].price,
    originalPrice: formData.get('originalPrice')?.toString() || products[index].originalPrice,
    imageUrl: formData.get('imageUrl')?.toString() || products[index].imageUrl,
    amazonUrl: formData.get('amazonUrl')?.toString() || products[index].amazonUrl,
    affiliateUrl: formData.get('affiliateUrl')?.toString() || products[index].affiliateUrl,
    description: formData.get('description')?.toString() || products[index].description,
    rating: formData.get('rating')?.toString() || products[index].rating,
    category: formData.get('category')?.toString() || products[index].category,
  };

  saveProducts(products);

  if (request.headers.get('Accept') === 'application/json') {
    return new Response(JSON.stringify(products[index]), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  return redirect('/admin/dashboard/');
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!checkAuth(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  let products = getProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
