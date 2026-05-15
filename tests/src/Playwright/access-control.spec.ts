import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

test.describe('Access Control', () => {
  test('Anonymous user cannot access subscriber admin list', async ({ page }) => {
    await page.goto('/admin/config/webnewsletter/emails');
    await expect(page.getByText('Access denied')).toBeVisible();
  });

  test('Anonymous user cannot add subscribers via admin form', async ({ page }) => {
    await page.goto('/admin/config/webnewsletter/email/add');
    await expect(page.getByText('Access denied')).toBeVisible();
  });

  test('Anonymous user can access public subscribe form', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await expect(page.getByRole('heading', { name: 'Newsletter Subscribe' })).toBeVisible();
    await expect(page.locator('input[value="Subscribe"]')).toBeVisible();
  });

  test('Admin user can access subscriber list', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/config/webnewsletter/emails');
    await expect(page.getByRole('heading', { name: 'Web Newsletter Emails' })).toBeVisible();
  });
});
