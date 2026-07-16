import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const { title, category } = await request.json();

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const systemPrompt = 'You are a helpful product reviewer who writes compelling Amazon product recommendations. Use "we" and "our" voice (e.g. "We recommend...", "We think..."). Do not mention specific technical specifications you are unsure about. Keep it persuasive but honest. Output only bullet points, one per line, starting with "- ".';

  const userPrompt = `Write a product review as 5-6 bullet points for this product:\n\nTitle: ${title}\nCategory: ${category || 'General'}\n\nEach bullet point should highlight a reason someone would want to buy it. Keep claims general enough to be plausible. Do not mention specific specs like battery life, camera megapixels, processor speed, or dimensions unless obvious from the title. Focus on quality, value, design, and user experience. Use "- " at the start of each line. No paragraphs or extra text before or after the list.`;

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
