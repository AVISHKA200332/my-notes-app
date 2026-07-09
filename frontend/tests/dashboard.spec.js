import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

test.describe('Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, 'Dashboard Test User');
  });

  // ── Layout ──────────────────────────────────────────────────────────────────

  test('shows hero section with user first name', async ({ page }) => {
    await expect(page.locator('.dashboard__title')).toContainText('Welcome back');
    await expect(page.locator('.dashboard__title')).toContainText('Dashboard');
  });

  test('shows stat cards', async ({ page }) => {
    await expect(page.getByText('Saved notes')).toBeVisible();
    await expect(page.getByText('Active filter')).toBeVisible();
    await expect(page.getByText('Most recent')).toBeVisible();
  });

  test('shows Create Note form', async ({ page }) => {
    await expect(page.getByText('Capture your next idea')).toBeVisible();
    await expect(page.getByPlaceholder('Give it a title')).toBeVisible();
    await expect(page.getByPlaceholder('Write down the details')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Note' })).toBeVisible();
  });

  test('shows category filter buttons', async ({ page }) => {
    for (const cat of ['All', 'General', 'Personal', 'School', 'Campus', 'Work']) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('shows search input', async ({ page }) => {
    await expect(page.getByPlaceholder('Search notes…')).toBeVisible();
  });

  test('shows tag summary section', async ({ page }) => {
    await expect(page.locator('.dashboard__category-summary')).toBeVisible();
  });

  // ── Empty state ─────────────────────────────────────────────────────────────

  test('shows empty state message when no notes exist', async ({ page }) => {
    await expect(
      page.getByText('No notes here yet. Create your first one above')
    ).toBeVisible({ timeout: 10000 });
  });

  test('stat card shows 0 notes initially', async ({ page }) => {
    await page.waitForSelector('.dashboard__stat-value');
    const statValue = page.locator('.dashboard__stat-card').first().locator('.dashboard__stat-value');
    await expect(statValue).toHaveText('0');
  });

  // ── Logout ──────────────────────────────────────────────────────────────────

  test('logout button redirects to /login', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

});
