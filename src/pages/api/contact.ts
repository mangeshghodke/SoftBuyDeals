import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

function isAjax(request: Request): boolean {
  const accept = request.headers.get('accept') || '';
  return !accept.includes('text/html');
}

export const GET: APIRoute = ({ redirect }) => redirect('/contact/');

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const form = await request.formData();
    const name = form.get('name')?.toString() || 'Anonymous';
    const email = form.get('email')?.toString() || '';
    const message = form.get('message')?.toString() || '';
    const ajax = isAjax(request);

    if (!email || !message) {
      if (ajax) {
        return new Response(JSON.stringify({ error: 'Email and message are required' }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
      return redirect('/contact/?error=Email+and+message+are+required');
    }

    const apiKey = env.RESEND_API_KEY as string;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured');
      if (ajax) {
        return new Response(JSON.stringify({ error: 'Server configuration error' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      return redirect('/contact/?error=Server+configuration+error');
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SoftBuyDeals <support@softbuydeals.in>',
        to: 'ghodke.mangesh2@gmail.com',
        reply_to: email,
        subject: `Contact form: ${name}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">
<tr><td style="background:#7c3aed;padding:28px 32px;text-align:center">
<h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.3px">SoftBuyDeals</h1>
<p style="margin:4px 0 0;font-size:13px;color:#c4b5fd">New Contact Form Submission</p>
</td></tr>
<tr><td style="padding:32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 0"><span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Name</span><p style="margin:4px 0 0;font-size:15px;color:#1e293b;font-weight:500">${name}</p></td></tr>
<tr><td style="padding:12px 0"><span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Email</span><p style="margin:4px 0 0;font-size:15px;color:#1e293b;font-weight:500"><a href="mailto:${email}" style="color:#7c3aed;text-decoration:none">${email}</a></p></td></tr>
<tr><td style="border-top:1px solid #e2e8f0;padding:16px 0 0"><span style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Message</span><p style="margin:8px 0 0;font-size:14px;color:#334155;line-height:1.7">${message.replace(/\n/g, '<br>')}</p></td></tr>
</table>
</td></tr>
<tr><td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0">
<p style="margin:0;font-size:12px;color:#94a3b8">SoftBuyDeals &mdash; Curated Amazon.in deals</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error('resend error:', data);
      if (ajax) {
        return new Response(JSON.stringify({ error: data.error || data.message || 'Failed to send' }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      return redirect('/contact/?error=Failed+to+send+message');
    }

    if (ajax) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    return redirect('/contact/?sent=1');
  } catch (err) {
    console.error('contact form error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
