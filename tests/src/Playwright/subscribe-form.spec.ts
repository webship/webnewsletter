import { test, expect } from '@playwright/test';

test.describe('Newsletter Subscribe Form', () => {
  test('Anonymous user can access the subscribe form', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await expect(page.getByRole('heading', { name: 'Newsletter Subscribe' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.locator('input[value="Subscribe"]')).toBeVisible();
  });

  test('Anonymous user can subscribe with valid data', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Name').fill('Webship Team');
    await page.getByLabel('Email').fill('info@webship.co');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('Thank you for joining us')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('Duplicate email subscription is silently accepted', async ({ page }) => {
    // First subscription
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Name').fill('Webship Team');
    await page.getByLabel('Email').fill('info@webship.co');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('Thank you for joining us')).toBeVisible();

    // Second subscription with same email
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Name').fill('Another Name');
    await page.getByLabel('Email').fill('info@webship.co');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('Thank you for joining us')).toBeVisible();
  });

  test('Subscribe form requires email', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Name').fill('Test User');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('field is required')).toBeVisible();
  });

  test('Subscribe form requires name', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Email').fill('rajabn@gmail.com');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('field is required')).toBeVisible();
  });

  test('Subscribe form validates email format', async ({ page }) => {
    await page.goto('/newsletter/subscribe');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('not-a-valid-email');
    await page.locator('input[value="Subscribe"]').click();
    await expect(page.getByText('not-a-valid-email')).toBeVisible();
  });
});
