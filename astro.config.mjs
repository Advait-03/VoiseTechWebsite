// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.voisetech.com';

// Pages that must stay out of the XML sitemap.
const NOINDEX = ['/thank-you/', '/404/'];

export default defineConfig({
  site: SITE,
  // WordPress served every URL with a trailing slash; keep that so no URL changes.
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Every page is prerendered; only the form endpoints in src/pages/api run on the server.
  output: 'static',
  // Vercel serverless functions run the form API and redirects; everything else is static.
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)),
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 2048 },
  },
});
