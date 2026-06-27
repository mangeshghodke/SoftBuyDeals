import type { APIRoute } from 'astro';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ghodke.mangesh2@gmail.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const origin = request.headers.get('origin') || 'https://softbuydeals.com';

    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Origin': origin,
        'Referer': `${origin}/`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
