import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    titleTag: z.string().optional(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    modified: z.coerce.date().optional(),
    categories: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    ogImage: z.string().optional(),
    needsContent: z.boolean().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
});

export const collections = { posts, legal };
