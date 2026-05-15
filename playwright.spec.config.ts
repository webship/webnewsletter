import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/src/Playwright',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: process.env.CI
    ? [
        ['junit', { outputFile: 'tests/reports/playwright-junit.xml' }],
        ['html', { outputFolder: 'tests/reports/playwright-html', open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'tests/reports/playwright-html', open: 'never' }],
      ],
  use: {
    baseURL: process.env.DRUPAL_TEST_BASE_URL || process.env.LAUNCH_URL || 'http://localhost',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
});
