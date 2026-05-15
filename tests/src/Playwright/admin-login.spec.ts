import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

test.describe('Admin Login', () => {
  test('Admin can log in successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'admin' })).toBeVisible();
  });
});
