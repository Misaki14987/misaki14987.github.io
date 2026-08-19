// @ts-check
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const isLearningSite = process.env.SITE_VARIANT === 'learning';
const site = process.env.SITE_URL ?? (
  isLearningSite
    ? 'https://learn.yodelist.icu'
    : 'https://blog.yodelist.icu'
);

// https://astro.build/config
export default defineConfig({
  site,
  outDir: isLearningSite ? './dist-learning' : './dist',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
