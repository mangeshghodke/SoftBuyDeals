import type { APIRoute } from 'astro';
import { createSession } from '../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  const adminEmail = import.meta.env.ADMIN_EMAIL || 'admin@softbuydeals.com';
  const adminPassword = import.meta.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    const token = createSession(email!);
    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    return redirect('/admin/dashboard/');
  }

  return redirect('/admin/login/?error=Invalid credentials');
};
