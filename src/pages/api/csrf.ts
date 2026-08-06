import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { validateSession, getCsrfToken } from '../../lib/session';

export const GET: APIRoute = async ({ cookies }) => {
  const secret = env.SESSION_SECRET as string;
  const sessionToken = cookies.get('session')?.value;
  if (!sessionToken || !validateSession(sessionToken, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }
  const csrfToken = getCsrfToken(sessionToken, secret);
  return new Response(JSON.stringify({ csrfToken }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};
