import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const name = form.get('name')?.toString() || 'Anonymous';
    const email = form.get('email')?.toString() || '';
    const message = form.get('message')?.toString() || '';

    if (!email || !message) {
      return new Response(JSON.stringify({ error: 'Email and message are required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = env.RESEND_API_KEY as string;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SoftBuyDeals <onboarding@resend.dev>',
        to: 'ghodke.mangesh2@gmail.com',
        reply_to: email,
        subject: `Contact form: ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('contact form error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
