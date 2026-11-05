import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'session-integration.spec.ts',
  workers: 1,
  timeout: 120_000,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: [
    {
      command: 'node security-tests/mock-auth-server.cjs',
      cwd: process.cwd(),
      url: 'http://127.0.0.1:3217/health',
      reuseExistingServer: false,
    },
    {
      command: 'node node_modules/next/dist/bin/next dev -p 3216',
      cwd: process.cwd(),
      env: { OCOP_API_URL: 'http://127.0.0.1:3217' },
      url: 'http://localhost:3216/api/ocop/cart',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
