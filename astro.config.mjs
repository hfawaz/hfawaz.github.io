import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hfawaz.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
});
