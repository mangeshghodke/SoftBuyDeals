import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const { title, category } = await request.json();

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const systemPrompt = 'You write concise, compelling product descriptions. 2-3 short paragraphs max. No markdown. No bullet points. Plain text only.';

  const userPrompt = `Write a short compelling product description for the following product.
Title: ${title}
Category: ${category || 'General'}

Write 2-3 short paragraphs describing:
- What the product is and its main purpose
- Key features and benefits
- Who it's for and why it's a great choice

Keep it natural and persuasive. Plain text only. No markdown.`;

  try {
    const ai = env.AI as any;
    const result = await ai.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const text = (result as any)?.choices?.[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ description: text }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      error: 'AI generation failed',
      message: err?.message || 'Unknown error'
    }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};