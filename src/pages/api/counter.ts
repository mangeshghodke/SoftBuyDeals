import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCounter, incrementCounter } from '../../lib/data';

export const GET: APIRoute = async () => {
  const count = await getCounter(env.DB);
  return new Response(JSON.stringify({ count }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async () => {
  const count = await incrementCounter(env.DB);
  return new Response(JSON.stringify({ count }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
