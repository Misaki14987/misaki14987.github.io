import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      author: z.string().default('M1saK1'),
      category: z.string().optional(),
      description: z.string().default(''),
      cover: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { posts };
