import { defineMiddleware } from 'astro:middleware';
import { validateSession } from './lib/session';

const ADMIN_ROUTES = ['/admin/dashboard', '/admin/products'];
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://formsubmit.co",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self' https://formsubmit.co",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  if (isAdminRoute) {
    const secret = context.locals.runtime.env.SESSION_SECRET as string;
    const sessionToken = context.cookies.get('session')?.value;
    if (!sessionToken || !validateSession(sessionToken, secret)) {
      return context.redirect('/admin/login/');
    }
  }

  const response = await next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  response.headers.set('Content-Security-Policy', CSP);

  if (import.meta.env.PROD) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
});
