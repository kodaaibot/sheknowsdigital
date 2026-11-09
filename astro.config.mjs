import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.sheknowsdigital.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
