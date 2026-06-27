import type { APIRoute } from 'astro';
import { validateSession, validateCsrfToken } from '../../lib/session';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../lib/data';
import type { Product } from '../../lib/data';

function isFormSubmit(request: Request): boolean {
  return request.headers.get('Accept') !== 'application/json';
}

function formatRating(rating: string | undefined): string | undefined {
  if (!rating) return rating;
  const num = parseFloat(rating);
  if (!isNaN(num) && rating === num.toString()) {
    return `${num} out of 5.0`;
  }
  return rating;
}

const VALID_CATEGORIES = [
  'Electronics', 'Home & Kitchen', 'Books', 'Fashion',
  'Beauty', 'Sports', 'Toys', 'Automotive', 'Groceries',
  'Health', 'Office', 'Music', 'Uncategorized',
];

function checkAuth(cookies: any): { authed: boolean; token?: string } {
  const sessionToken = cookies.get('session')?.value;
  if (!sessionToken || !validateSession(sessionToken)) {
    return { authed: false };
  }
  return { authed: true, token: sessionToken };
}

function validateProductInput(data: Record<string, string | undefined>): string[] {
  const errors: string[] = [];
  if (data.title && data.title.length > 200) errors.push('Title exceeds 200 characters');
  if (data.title && data.title.trim().length === 0) errors.push('Title cannot be empty');
  if (data.price && !/^[₹$]?\s?[\d,]+(\.\d{1,2})?\s?$/.test(data.price.trim())) errors.push('Invalid price format');
  if (data.imageUrl && !data.imageUrl.startsWith('http')) errors.push('Image URL must start with http');
  if (data.amazonUrl && !data.amazonUrl.startsWith('http')) errors.push('Amazon URL must start with http');
  if (data.affiliateUrl && !data.affiliateUrl.startsWith('http')) errors.push('Affiliate URL must start with http');
  if (data.amazonUrl && !data.amazonUrl.includes('amazon')) errors.push('Amazon URL must contain amazon');
  if (data.category && !VALID_CATEGORIES.includes(data.category) && data.category !== 'Uncategorized') {
    const suggestion = VALID_CATEGORIES.find(c => c.toLowerCase() === data.category!.toLowerCase());
    if (!suggestion) errors.push(`Invalid category. Use one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (data.rating && data.rating.length > 50) errors.push('Rating too long');
  if (data.description && data.description.length > 2000) errors.push('Description exceeds 2000 characters');
  return errors;
}

export const GET: APIRoute = async ({ url }) => {
  const singleId = url.searchParams.get('id');
  if (singleId) {
    const product = getProductById(singleId);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(product), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  const products = getProducts();
  return new Response(JSON.stringify({ products }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { authed, token } = checkAuth(cookies);
  if (!authed) return redirect('/admin/login/');

  const formData = await request.formData();
  const isJson = request.headers.get('Accept') === 'application/json';

  const csrfToken = formData.get('_csrf')?.toString();
  if (!csrfToken || !validateCsrfToken(csrfToken, token!)) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/products/add/?error=Invalid+CSRF+token.+Please+try+again.');
  }

  const existingId = formData.get('id')?.toString();

  const rawRating = formData.get('rating')?.toString();

  const fields: Record<string, string | undefined> = {
    title: formData.get('title')?.toString(),
    price: formData.get('price')?.toString(),
    originalPrice: formData.get('originalPrice')?.toString(),
    imageUrl: formData.get('imageUrl')?.toString(),
    amazonUrl: formData.get('amazonUrl')?.toString(),
    affiliateUrl: formData.get('affiliateUrl')?.toString(),
    description: formData.get('description')?.toString(),
    rating: formatRating(rawRating),
    category: formData.get('category')?.toString(),
  };

  const errors = validateProductInput(fields);
  if (errors.length > 0) {
    if (isJson) {
      return new Response(JSON.stringify({ error: errors.join('; ') }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect(`/admin/products/add/?error=${encodeURIComponent(errors.join('; '))}`);
  }

  if (existingId) {
    const existing = getProductById(existingId);
    if (!existing) {
      if (isJson) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404, headers: { 'Content-Type': 'application/json' }
        });
      }
      return redirect('/admin/dashboard/?error=Product+not+found');
    }

    const updated: Partial<Product> = {};
    for (const key of ['title', 'price', 'originalPrice', 'imageUrl', 'amazonUrl', 'affiliateUrl', 'description', 'rating', 'category'] as const) {
      if (fields[key]) (updated as Record<string, string>)[key] = fields[key]!;
    }
    updateProduct(existingId, updated);

    if (isJson) {
      return new Response(JSON.stringify({ ...existing, ...updated }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/dashboard/');
  }

  const newProduct: Product = {
    id: crypto.randomUUID(),
    title: fields.title || '',
    price: fields.price || '',
    originalPrice: fields.originalPrice || '',
    imageUrl: fields.imageUrl || '',
    amazonUrl: fields.amazonUrl || '',
    affiliateUrl: fields.affiliateUrl || '',
    description: fields.description || '',
    rating: fields.rating || '',
    category: fields.category || 'Uncategorized',
    createdAt: new Date().toISOString(),
  };

  createProduct(newProduct);

  if (isJson) {
    return new Response(JSON.stringify(newProduct), {
      status: 201, headers: { 'Content-Type': 'application/json' }
    });
  }
  return redirect('/admin/dashboard/');
};

export const PUT: APIRoute = async ({ request, cookies, redirect }) => {
  const { authed, token } = checkAuth(cookies);
  if (!authed) return redirect('/admin/login/');

  const formData = await request.formData();
  const isJson = request.headers.get('Accept') === 'application/json';

  const csrfToken = formData.get('_csrf')?.toString();
  if (!csrfToken || !validateCsrfToken(csrfToken, token!)) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/dashboard/?error=Invalid+CSRF+token');
  }

  const id = formData.get('id')?.toString();
  if (!id) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Product ID required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/dashboard/?error=Product+ID+required');
  }

  const existing = getProductById(id);
  if (!existing) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/dashboard/?error=Product+not+found');
  }

  const rawRating = formData.get('rating')?.toString();

  const fields: Record<string, string | undefined> = {
    title: formData.get('title')?.toString(),
    price: formData.get('price')?.toString(),
    originalPrice: formData.get('originalPrice')?.toString(),
    imageUrl: formData.get('imageUrl')?.toString(),
    amazonUrl: formData.get('amazonUrl')?.toString(),
    affiliateUrl: formData.get('affiliateUrl')?.toString(),
    description: formData.get('description')?.toString(),
    rating: formatRating(rawRating),
    category: formData.get('category')?.toString(),
  };

  const errors = validateProductInput(fields);
  if (errors.length > 0) {
    if (isJson) {
      return new Response(JSON.stringify({ error: errors.join('; ') }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect(`/admin/products/edit/${id}/?error=${encodeURIComponent(errors.join('; '))}`);
  }

  const updated: Partial<Product> = {};
  for (const key of ['title', 'price', 'originalPrice', 'imageUrl', 'amazonUrl', 'affiliateUrl', 'description', 'rating', 'category'] as const) {
    if (fields[key]) (updated as Record<string, string>)[key] = fields[key]!;
  }
  updateProduct(id, updated);

  if (isJson) {
    return new Response(JSON.stringify({ ...existing, ...updated }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }
  return redirect('/admin/dashboard/');
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const { authed, token } = checkAuth(cookies);
  if (!authed) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  const csrfToken = request.headers.get('x-csrf-token');
  if (!csrfToken || !validateCsrfToken(csrfToken, token!)) {
    return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Product ID required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteProduct(id);
  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};