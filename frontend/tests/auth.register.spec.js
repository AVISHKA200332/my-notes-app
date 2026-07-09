import { test, expect } from '@playwright/test';
import { uniqueEmail, TEST_PASSWORD } from './helpers.js';

test.describe('Register page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // ── UI Rendering ────────────────────────────────────────────────────────────

  test('shows branding and form elements', async ({ page }) => {
    await expect(page.getByText('MyNotes', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('"Sign in" link navigates to /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  test('shows error when passwords do not match', async ({ page }) => {
    await page.getByLabel('Full name').fill('Test User');
    await page.getByLabel('Email address').fill(uniqueEmail());
    await page.getByLabel('Password', { exact: true }).fill('Test@1234');
    await page.getByLabel('Confirm password').fill('Different99');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('alert')).toContainText('Passwords do not match');
  });

  test('shows inline mismatch hint on confirm field', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('Test@1234');
    await page.getByLabel('Confirm password').fill('Mismatch1');
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test('shows error for password shorter than 6 characters', async ({ page }) => {
    await page.getByLabel('Full name').fill('Test User');
    await page.getByLabel('Email address').fill(uniqueEmail());
    await page.getByLabel('Password', { exact: true }).fill('abc');
    await page.getByLabel('Confirm password').fill('abc');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('alert')).toContainText('at least 6 characters');
  });

  test('shows password strength indicator when typing', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('weak');
    await expect(page.getByTestId('strength-indicator')).toBeVisible();
  });

  // ── Success flow ────────────────────────────────────────────────────────────

  test('registers successfully and redirects to /dashboard', async ({ page }) => {
    const email = uniqueEmail();
    await page.getByLabel('Full name').fill('Playwright User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();

    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('stores token in localStorage after registration', async ({ page }) => {
    const email = uniqueEmail();
    await page.getByLabel('Full name').fill('Token Test');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  // ── Duplicate email ─────────────────────────────────────────────────────────

  test('shows error when registering with an already-used email', async ({ page }) => {
    // Register once
    const email = uniqueEmail();
    await page.getByLabel('Full name').fill('First User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Log out and try to register again with same email
    await page.evaluate(() => { localStorage.clear(); });
    await page.goto('/register');
    await page.getByLabel('Full name').fill('Second User');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('alert')).toContainText('already exists', { timeout: 10000 });
  });

  // ── Already logged-in redirect ──────────────────────────────────────────────

  test('redirects to /dashboard if already logged in', async ({ page }) => {
    const email = uniqueEmail();
    await page.getByLabel('Full name').fill('Redirect Test');
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Try to navigate back to /register while still logged in
    await page.goto('/register');
    await expect(page).toHaveURL(/\/dashboard/);
  });

});
