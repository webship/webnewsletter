import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth.js';

test.describe('Admin Subscriber Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Admin can view subscribers list', async ({ page }) => {
    await page.goto('/admin/config/webnewsletter/emails');
    await expect(page.getByRole('heading', { name: 'Web Newsletter Emails' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Subscribed' })).toBeVisible();
  });

  test('Admin can add a subscriber manually', async ({ page }) => {
    await page.goto('/admin/config/webnewsletter/email/add');
    await expect(page.getByRole('heading', { name: 'Add web newsletter emails' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Status' })).toBeVisible();

    await page.locator('input[type="email"]').fill('rajabn@gmail.com');
    await page.locator('input[name="name[0][value]"]').fill('Rajab N');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('h1')).toContainText('rajabn@gmail.com');
    await expect(page).toHaveURL(/webnewsletter\/email/);
  });

  test('Admin can edit a subscriber', async ({ page }) => {
    // Create subscriber
    await page.goto('/admin/config/webnewsletter/email/add');
    await page.locator('input[type="email"]').fill('info@webship.co');
    await page.locator('input[name="name[0][value]"]').fill('Webship');
    await page.getByRole('button', { name: 'Save' }).click();
    // After save, we're on the entity view — click the Edit tab directly
    await page.getByRole('navigation', { name: 'Primary tabs' }).getByRole('link', { name: 'Edit' }).click();
    await page.locator('input[name="name[0][value]"]').fill('Webship Team');
    await page.getByRole('button', { name: 'Save' }).click();

    // After save, verify the updated name appears in the entity view
    await expect(page.locator('main')).toContainText('Webship Team');
  });

  test('Admin can delete a subscriber', async ({ page }) => {
    // Create subscriber
    await page.goto('/admin/config/webnewsletter/email/add');
    await page.locator('input[type="email"]').fill('info@webship.co');
    await page.locator('input[name="name[0][value]"]').fill('Test Delete');
    await page.getByRole('button', { name: 'Save' }).click();

    // Delete
    await page.getByRole('link', { name: 'Delete' }).click();
    await page.locator('input[value="Delete"]').click();

    await expect(page.getByRole('heading', { name: 'Web Newsletter Emails' })).toBeVisible();
    await expect(page.getByText('Test Delete')).not.toBeVisible();
  });

  test('Admin can deactivate a subscriber', async ({ page }) => {
    // Create subscriber
    await page.goto('/admin/config/webnewsletter/email/add');
    await page.locator('input[type="email"]').fill('rajabn@gmail.com');
    await page.locator('input[name="name[0][value]"]').fill('Rajab N');
    await page.getByRole('button', { name: 'Save' }).click();

    // After save, we're on the entity view — click the Edit tab directly
    await page.getByRole('navigation', { name: 'Primary tabs' }).getByRole('link', { name: 'Edit' }).click();
    await page.getByRole('checkbox', { name: 'Status' }).uncheck();
    await page.getByRole('button', { name: 'Save' }).click();

    // Navigate to list to verify Inactive status
    await page.goto('/admin/config/webnewsletter/emails');
    await expect(page.getByRole('cell', { name: 'Inactive' }).first()).toBeVisible();
  });

  test('Admin settings page is accessible', async ({ page }) => {
    await page.goto('/admin/structure/webnewsletter-emails');
    await expect(page.getByRole('heading', { name: 'Web Newsletter Emails' })).toBeVisible();
  });
});
