import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

/**
 * Create a note and wait for its card to appear.
 * Always clicks 'All' filter first so the card is visible regardless of active filter.
 */
async function createNote(page, title, content, category) {
  // Always reset to 'All' before creating so the new card is visible after submit
  await page.locator('.dashboard__filters').getByRole('button', { name: 'All', exact: true }).click();

  await page.getByPlaceholder('Give it a title').fill(title);
  await page.getByPlaceholder('Write down the details').fill(content);
  if (category) await page.getByRole('combobox').first().selectOption(category);
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.waitForSelector(`.note-card:has-text("${title}")`);
}

/** Click a filter button safely — scoped to the filter bar only */
function filterBtn(page, name) {
  return page.locator('.dashboard__filters').getByRole('button', { name, exact: true });
}

test.describe('Filter & search', () => {

  let titlePersonal, titleWork, titleSchool;

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, 'Filter Test User');
    await page.waitForSelector('.create-note');

    titlePersonal = `Personal Note ${Date.now()}`;
    await createNote(page, titlePersonal, 'Personal content', 'Personal');

    titleWork = `Work Note ${Date.now()}`;
    await createNote(page, titleWork, 'Work content', 'Work');

    titleSchool = `School Note ${Date.now()}`;
    await createNote(page, titleSchool, 'School content', 'School');

    // Ensure all 3 cards are visible under 'All' filter before each test
    await filterBtn(page, 'All').click();
    await expect(page.locator('.note-card')).toHaveCount(3, { timeout: 10000 });
  });

  // ── Category filters ────────────────────────────────────────────────────────

  test('"All" filter shows all notes', async ({ page }) => {
    await filterBtn(page, 'All').click();
    await expect(page.locator('.note-card')).toHaveCount(3);
  });

  test('Personal filter shows only personal notes', async ({ page }) => {
    await filterBtn(page, 'Personal').click();
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(page.locator('.note-card').first()).toContainText('Personal');
  });

  test('Work filter shows only work notes', async ({ page }) => {
    await filterBtn(page, 'Work').click();
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(page.locator('.note-card').first()).toContainText('Work');
  });

  test('active filter button is highlighted', async ({ page }) => {
    const btn = filterBtn(page, 'Work');
    await btn.click();
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(btn).toHaveClass(/dashboard__filter-btn--active/);
  });

  test('filter with no matching notes shows empty state', async ({ page }) => {
    await filterBtn(page, 'Campus').click();
    await expect(
      page.getByText('No notes here yet. Create your first one above')
    ).toBeVisible({ timeout: 5000 });
  });

  // ── Search ──────────────────────────────────────────────────────────────────

  test('search narrows down notes by title', async ({ page }) => {
    await page.getByPlaceholder('Search notes…').fill('Work Note');
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(page.locator('.note-card').first()).toContainText('Work');
  });

  test('search narrows down notes by content', async ({ page }) => {
    await page.getByPlaceholder('Search notes…').fill('Personal content');
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(page.locator('.note-card').first()).toContainText('Personal');
  });

  test('search with no match shows empty state', async ({ page }) => {
    await page.getByPlaceholder('Search notes…').fill('zzznomatch999');
    await expect(
      page.getByText('No notes here yet. Create your first one above')
    ).toBeVisible({ timeout: 5000 });
  });

  test('clearing search restores all notes', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search notes…');
    await searchInput.fill('Work Note');
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await searchInput.clear();
    await expect(page.locator('.note-card')).toHaveCount(3, { timeout: 5000 });
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.getByPlaceholder('Search notes…').fill('SCHOOL');
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
  });

  // ── Active filter stat card ─────────────────────────────────────────────────

  test('active filter stat card updates when filter changes', async ({ page }) => {
    const statCard = page
      .locator('.dashboard__stat-card')
      .nth(1)
      .locator('.dashboard__stat-value');

    await expect(statCard).toHaveText('All');

    await filterBtn(page, 'Work').click();
    await expect(page.locator('.note-card')).toHaveCount(1, { timeout: 5000 });
    await expect(statCard).toHaveText('Work');
  });

});
