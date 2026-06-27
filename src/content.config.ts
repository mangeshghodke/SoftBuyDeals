import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: reference('authors'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/*.{json,yaml,md}", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    bio: z.string(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'authors': authorCollection,
};
