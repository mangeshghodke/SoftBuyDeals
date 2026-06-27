// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://softbuydeals.com',
  base: '/',
  trailingSlash: 'always',

  output: 'server',
  adapter: cloudflare(),

  build: {
    inlineStylesheets: 'always'
  },

  image: {
    service: passthroughImageService(),
    domains: ['i.pravatar.cc', 'images-eu.ssl-images-amazon.com', 'm.media-amazon.com']
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});
