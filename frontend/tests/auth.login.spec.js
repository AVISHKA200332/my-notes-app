import { test, expect } from '@playwright/test';
import { registerAndLogin, TEST_PASSWORD } from './helpers.js';

test.describe('Login page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // ── UI Rendering ────────────────────────────────────────────────────────────

  test('shows branding and form elements', async ({ page }) => {
    await expect(page.getByText('MyNotes', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create one free' })).toBeVisible();
  });

  test('"Create one free" link navigates to /register', async ({ page }) => {
    await page.getByRole('link', { name: 'Create one free' }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  // ── Invalid credentials ─────────────────────────────────────────────────────

  test('shows error for invalid email format', async ({ page }) => {
    await page.getByLabel('Email address').fill('invalid-email');
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    // Backend should reject it if frontend doesn't — just check an error appears
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
  });

  test('shows error for non-existent user', async ({ page }) => {
    await page.getByLabel('Email address').fill('nobody@example.com');
    await page.getByLabel('Password').fill('WrongPass99');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 10000 });
  });

  test('shows error for wrong password', async ({ page, browser }) => {
    // Register a user in a separate context so it doesn't conflict
    const newContext = await browser.newContext();
    const registerPage = await newContext.newPage();
    const { email } = await registerAndLogin(registerPage, 'Login Test User');
    await newContext.close();

    // Now try logging in with wrong password
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill('WrongPassword99');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('alert')).toContainText('Invalid', { timeout: 10000 });
  });

  // ── Success flow ────────────────────────────────────────────────────────────

  test('logs in successfully and redirects to /dashboard', async ({ page, browser }) => {
    // Register a user first
    const newContext = await browser.newContext();
    const registerPage = await newContext.newPage();
    const { email } = await registerAndLogin(registerPage, 'Success Login Test');
    await newContext.close();

    // Now log in
    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('stores token in localStorage after login', async ({ page, browser }) => {
    const newContext = await browser.newContext();
    const registerPage = await newContext.newPage();
    const { email } = await registerAndLogin(registerPage, 'LocalStorage Test');
    await newContext.close();

    await page.getByLabel('Email address').fill(email);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  // ── Already logged-in redirect ──────────────────────────────────────────────

  test('redirects to /dashboard if already logged in', async ({ page }) => {
    await registerAndLogin(page, 'Redirect Test');
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });

});
