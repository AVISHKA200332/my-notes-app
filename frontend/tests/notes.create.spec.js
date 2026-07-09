import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

test.describe('Create note', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, 'Create Note Test User');
    // Wait for the dashboard to finish loading notes
    await page.waitForSelector('.create-note');
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  test('shows error when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Note' }).click();
    await expect(page.locator('.create-note__error')).toContainText(
      'Title and content are required'
    );
  });

  test('shows error when title is empty', async ({ page }) => {
    await page.getByPlaceholder('Write down the details').fill('Some content');
    await page.getByRole('button', { name: 'Add Note' }).click();
    await expect(page.locator('.create-note__error')).toBeVisible();
  });

  test('shows error when content is empty', async ({ page }) => {
    await page.getByPlaceholder('Give it a title').fill('Some title');
    await page.getByRole('button', { name: 'Add Note' }).click();
    await expect(page.locator('.create-note__error')).toBeVisible();
  });

  // ── Success flow ────────────────────────────────────────────────────────────

  test('creates a note and shows it in the list', async ({ page }) => {
    const title   = `My Test Note ${Date.now()}`;
    const content = 'This is the note content written by Playwright.';

    await page.getByPlaceholder('Give it a title').fill(title);
    await page.getByPlaceholder('Write down the details').fill(content);
    await page.getByRole('button', { name: 'Add Note' }).click();

    await expect(page.locator('.note-card').filter({ hasText: title })).toBeVisible({
      timeout: 10000,
    });
  });

  test('new note appears with correct content', async ({ page }) => {
    const title   = `Content Check ${Date.now()}`;
    const content = 'Playwright content verification.';

    await page.getByPlaceholder('Give it a title').fill(title);
    await page.getByPlaceholder('Write down the details').fill(content);
    await page.getByRole('button', { name: 'Add Note' }).click();

    const card = page.locator('.note-card').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toContainText(content);
  });

  test('clears the form after successful creation', async ({ page }) => {
    await page.getByPlaceholder('Give it a title').fill(`Clear Test ${Date.now()}`);
    await page.getByPlaceholder('Write down the details').fill('Some content');
    await page.getByRole('button', { name: 'Add Note' }).click();

    // Wait for note to appear then check inputs are cleared
    await page.waitForSelector('.note-card');
    await expect(page.getByPlaceholder('Give it a title')).toHaveValue('');
    await expect(page.getByPlaceholder('Write down the details')).toHaveValue('');
  });

  test('saved notes counter increments after creation', async ({ page }) => {
    // Wait for initial load to complete (count = 0)
    await page.waitForSelector('.dashboard__stat-value');
    const counter = page.locator('.dashboard__stat-card').first().locator('.dashboard__stat-value');
    await expect(counter).toHaveText('0');

    await page.getByPlaceholder('Give it a title').fill(`Counter Note ${Date.now()}`);
    await page.getByPlaceholder('Write down the details').fill('Counter test');
    await page.getByRole('button', { name: 'Add Note' }).click();
    await page.waitForSelector('.note-card');

    await expect(counter).toHaveText('1');
  });

  test('creates a note with a selected category', async ({ page }) => {
    const title = `Work Note ${Date.now()}`;
    await page.getByPlaceholder('Give it a title').fill(title);
    await page.getByPlaceholder('Write down the details').fill('Work related content');
    await page.getByRole('combobox').first().selectOption('Work');
    await page.getByRole('button', { name: 'Add Note' }).click();

    const card = page.locator('.note-card').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 10000 });
  });

  test('creates multiple notes and all appear in the list', async ({ page }) => {
    const notes = [
      { title: `Note A ${Date.now()}`, content: 'Content A' },
      { title: `Note B ${Date.now()}`, content: 'Content B' },
    ];

    for (const note of notes) {
      await page.getByPlaceholder('Give it a title').fill(note.title);
      await page.getByPlaceholder('Write down the details').fill(note.content);
      await page.getByRole('button', { name: 'Add Note' }).click();
      await page.waitForSelector(`.note-card:has-text("${note.title}")`);
    }

    for (const note of notes) {
      await expect(page.locator('.note-card').filter({ hasText: note.title })).toBeVisible();
    }
  });

});
