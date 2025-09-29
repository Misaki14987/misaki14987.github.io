// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.yodelist.icu',
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
});
