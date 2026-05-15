import type { Page } from '@playwright/test';

export async function loginAsAdmin(page: Page): Promise<void> {
  const password = process.env.DRUPAL_ADMIN_PASSWORD || 'd';
  await page.goto('/user/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill(password);
  await page.locator('input[value="Log in"]').click();
  await page.waitForURL(/\/user\/\d+/);
}

export async function logout(page: Page): Promise<void> {
  await page.goto('/user/logout');
}
