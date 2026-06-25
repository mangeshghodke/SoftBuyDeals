import type { APIRoute } from 'astro';
import { destroySession } from '../../lib/session';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const sessionToken = cookies.get('session')?.value;
  if (sessionToken) {
    destroySession(sessionToken);
  }
  cookies.delete('session', { path: '/' });
  return redirect('/admin/login/');
};
