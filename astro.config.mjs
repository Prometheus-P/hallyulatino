// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hallyulatino.com',
  output: 'static',
  trailingSlash: 'never',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-MX',
          pt: 'pt-BR',
        },
      },
    }),
  ],

  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },

  compressHTML: true,
});
