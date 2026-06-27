import type { APIRoute } from 'astro';
import { createSession } from '../../lib/session';
import { timingSafeEqual } from 'node:crypto';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': '900' },
    });
  }

  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return redirect('/admin/login/?error=Email and password are required');
  }

  const adminEmail = import.meta.env.ADMIN_EMAIL || 'admin@softbuydeals.com';
  const adminPassword = import.meta.env.ADMIN_PASSWORD || 'admin123';

  if (email !== adminEmail) return redirect('/admin/login/?error=Invalid credentials');

  const passwordMatch = constantTimeCompare(password, adminPassword);
  if (!passwordMatch) return redirect('/admin/login/?error=Invalid credentials');

  const token = createSession(email);
  cookies.set('session', token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
  });

  return redirect('/admin/dashboard/');
};

function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
