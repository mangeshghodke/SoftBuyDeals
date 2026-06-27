import type { APIRoute } from 'astro';
import { createSession } from '../../lib/session';
import { scryptSync, timingSafeEqual } from 'node:crypto';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ACCOUNT_LOCKOUT_MAX = 10;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const accountLockouts = new Map<string, { count: number; lockedUntil: number }>();

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

function isAccountLocked(email: string): boolean {
  const now = Date.now();
  const lockout = accountLockouts.get(email);
  if (!lockout) return false;
  if (now > lockout.lockedUntil) {
    accountLockouts.delete(email);
    return false;
  }
  return true;
}

function recordFailedAttempt(email: string): void {
  const now = Date.now();
  const lockout = accountLockouts.get(email) || { count: 0, lockedUntil: 0 };
  lockout.count++;
  if (lockout.count >= ACCOUNT_LOCKOUT_MAX) {
    lockout.lockedUntil = now + 30 * 60 * 1000;
  }
  accountLockouts.set(email, lockout);
}

function verifyPassword(password: string, hashEnv: string): boolean {
  const parts = hashEnv.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, storedHash] = parts;
  const derivedHash = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(derivedHash), Buffer.from(storedHash));
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

  if (isAccountLocked(email)) {
    return redirect('/admin/login/?error=Account temporarily locked. Try again later.');
  }

  const adminEmail = import.meta.env.ADMIN_EMAIL;
  const adminPasswordHash = import.meta.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured');
    return redirect('/admin/login/?error=Server configuration error');
  }

  if (email !== adminEmail) {
    recordFailedAttempt(email);
    return redirect('/admin/login/?error=Invalid credentials');
  }

  if (!verifyPassword(password, adminPasswordHash)) {
    recordFailedAttempt(email);
    return redirect('/admin/login/?error=Invalid credentials');
  }

  accountLockouts.delete(email);

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
