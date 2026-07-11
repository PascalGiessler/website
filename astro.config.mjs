import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'https://pascal-giessler.de',
  // GitHub Pages serves directory-style URLs (/posts/ from /posts/index.html) and
  // 301-redirects the no-slash form. Enforcing 'always' keeps every internal link,
  // canonical, and sitemap entry on the trailing-slash form so crawlers never hit a
  // redirect (avoids GSC "Page with redirect / not indexed").
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          de: 'de',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
