import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

test.describe('Auth guards & routing', () => {

  test('unauthenticated user is redirected to /login from /', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated user is redirected to /login from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unknown routes redirect to /login', async ({ page }) => {
    await page.goto('/some-unknown-route');
    await expect(page).toHaveURL(/\/login/);
  });

  test('logging out clears localStorage and redirects to /login', async ({ page }) => {
    await registerAndLogin(page, 'Logout Test User');

    // Confirm we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login/);

    // Token should be gone from localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('dashboard is accessible after login', async ({ page }) => {
    await registerAndLogin(page, 'Access Test User');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('session persists on page reload', async ({ page }) => {
    await registerAndLogin(page, 'Persist Test User');
    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard')).toBeVisible();
  });

});
