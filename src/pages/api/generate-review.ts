import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const ai = env.AI as any;

  const { title, category } = await request.json();

  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const systemPrompt = 'You are a helpful product reviewer who writes compelling Amazon product recommendations. Write in plain text only. No markdown, no formatting, no asterisks, no bullet points. Write 6-8 sentences. Use "we" and "our" voice (e.g. "We recommend...", "We think..."). Do not mention specific technical specifications you are unsure about. Keep it persuasive but honest.';

  const userPrompt = `Write a detailed product review (6-8 sentences) for this product:\n\nTitle: ${title}\nCategory: ${category || 'General'}\n\nThe review should highlight why someone would want to buy this product. Keep it general enough that the claims are plausible for any product in this category. Do not mention specific features like battery life, camera megapixels, processor specs, or dimensions unless they are obvious from the title. Focus on quality, value, design, and user experience.`;

  try {
    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const text = (result as any).response?.trim() || '';

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
