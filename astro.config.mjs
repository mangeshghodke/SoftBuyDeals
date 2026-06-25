// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://softbuydeals.com',
  base: '/',
  trailingSlash: 'always',

  output: 'server',
  adapter: node({ mode: 'standalone' }),

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
