import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createSession } from '../../lib/session';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { checkRateLimit, getAccountLockout, recordFailedAttempt, clearAccountLockout } from '../../lib/rate-limit';

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ACCOUNT_LOCKOUT_MAX = 10;
const ACCOUNT_LOCKOUT_DURATION = 30 * 60 * 1000;

function verifyPassword(password: string, hashEnv: string): boolean {
  const parts = hashEnv.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, storedHash] = parts;
  const derivedHash = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(derivedHash), Buffer.from(storedHash));
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const db = env.DB;
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  const isJson = request.headers.get('Accept') === 'application/json';

  const limited = await checkRateLimit(db, `login:ip:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
  if (limited) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Too many attempts. Try again later.' }), {
        status: 429, headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(null, {
      status: 429,
      headers: { 'Retry-After': '900' },
    });
  }

  const contentType = request.headers.get('Content-Type') || '';
  let email: string | undefined;
  let password: string | undefined;
  if (contentType.includes('application/json')) {
    const data = await request.json().catch(() => ({})) as Record<string, unknown>;
    email = data.email?.toString();
    password = data.password?.toString();
  } else {
    const formData = await request.formData();
    email = formData.get('email')?.toString();
    password = formData.get('password')?.toString();
  }

  if (!email || !password) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/login/?error=Email and password are required');
  }

  const { locked: accountLocked } = await getAccountLockout(db, email);
  if (accountLocked) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Account temporarily locked. Try again later.' }), {
        status: 403, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/login/?error=Account temporarily locked. Try again later.');
  }

  const adminEmail = env.ADMIN_EMAIL as string;
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH as string;
  const secret = env.SESSION_SECRET as string;

  if (!adminEmail || !adminPasswordHash) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured');
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/login/?error=Server configuration error');
  }

  const isInvalid = email !== adminEmail || !verifyPassword(password, adminPasswordHash);

  if (isInvalid) {
    await recordFailedAttempt(db, email, ACCOUNT_LOCKOUT_MAX, ACCOUNT_LOCKOUT_DURATION);
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/admin/login/?error=Invalid credentials');
  }

  await clearAccountLockout(db, email);

  const token = createSession(email, secret);
  cookies.set('session', token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
  });

  if (isJson) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }

  return redirect('/admin/dashboard/');
};
