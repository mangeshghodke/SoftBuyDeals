import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const { title, category } = await request.json();

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const systemPrompt = 'You output ONLY bullet points starting with "- ". Never write paragraphs or sentences. Each bullet is one short line.';

  const userPrompt = `List 5 reasons to buy this product. Each reason must start with "- " and be on its own line.
No paragraphs. No sentences before or after the list. Only bullet points.
Title: ${title}
Category: ${category || 'General'}
Use "we" voice (e.g. "We recommend", "We think").
Keep claims general. No specific specs unless obvious from the title.
Focus on quality, value, design, user experience.

Example format:
- We recommend this for its excellent build quality.
- The design is sleek and modern.
- It offers great value for the price.
- We think the user experience is outstanding.
- This is a reliable choice for everyday use.`;

  try {
    const ai = env.AI as any;
    const result = await ai.run('@cf/zai-org/glm-4.7-flash', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const text = (result as any)?.choices?.[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ review: text }), {
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
