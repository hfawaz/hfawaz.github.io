import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
  ...config,
  use: { ...config.use, baseURL: 'http://127.0.0.1:4323' },
  webServer: {
    command: 'npm run dev -- --port 4323',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: !process.env.CI,
  },
});
