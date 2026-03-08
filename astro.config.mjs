// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
// https://astro.build/config
export default defineConfig({
  site: 'https://blog.yodelist.icu',
  integrations: [preact()],
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'preact',
    },
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom/server': 'preact/compat/server',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
  },
});
