import { defineMiddleware } from 'astro:middleware';
import { validateSession } from './lib/session';

const ADMIN_ROUTES = ['/admin/dashboard', '/admin/products', '/admin/login'];
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some(route => pathname === route);

  if (isAdminRoute && !isPublicAdminRoute) {
    const sessionToken = context.cookies.get('session')?.value;
    if (!sessionToken || !validateSession(sessionToken)) {
      return context.redirect('/admin/login/');
    }
  }

  return next();
});
