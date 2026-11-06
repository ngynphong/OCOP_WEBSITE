import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.OCOP_TEST_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'seller-mobile.spec.ts',
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 1,
  use: { baseURL, ...devices['iPhone X'], screenshot: 'only-on-failure' },
  projects: [{ name: 'iphone-webkit' }],
  reporter: 'list',
  webServer: { command: 'npm run dev', url: baseURL, reuseExistingServer: true, timeout: 120000 },
});
