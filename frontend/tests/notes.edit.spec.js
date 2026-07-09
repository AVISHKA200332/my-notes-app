import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

/** Create a note and return its title so tests can reference it */
async function createNote(page, title, content = 'Original content') {
  await page.getByPlaceholder('Give it a title').fill(title);
  await page.getByPlaceholder('Write down the details').fill(content);
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.waitForSelector(`.note-card:has-text("${title}")`);
}

test.describe('Edit note', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, 'Edit Note Test User');
    await page.waitForSelector('.create-note');
  });

  // ── Modal open/close ────────────────────────────────────────────────────────

  test('clicking Edit opens the modal pre-filled with note data', async ({ page }) => {
    const title = `Pre-fill Test ${Date.now()}`;
    await createNote(page, title, 'Pre-fill content');

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Update your note' })).toBeVisible();

    // Input fields should be pre-filled with original values
    const titleInput = page.locator('[role="dialog"] input').first();
    await expect(titleInput).toHaveValue(title);
    const contentArea = page.locator('[role="dialog"] textarea').first();
    await expect(contentArea).toHaveValue('Pre-fill content');
  });

  test('Cancel button closes the modal without saving', async ({ page }) => {
    const title = `Cancel Test ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Original title should still be on the card
    await expect(page.locator('.note-card').filter({ hasText: title })).toBeVisible();
  });

  test('pressing Escape closes the modal', async ({ page }) => {
    const title = `Escape Test ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('clicking the overlay backdrop closes the modal', async ({ page }) => {
    const title = `Backdrop Test ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click the overlay (outside the modal box)
    await page.locator('.modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Close ✕ button closes the modal', async ({ page }) => {
    const title = `Close Btn Test ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  // ── Validation in modal ─────────────────────────────────────────────────────

  test('shows error when saving with empty title', async ({ page }) => {
    const title = `Empty Title Test ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    const titleInput = page.locator('[role="dialog"] input').first();
    await titleInput.clear();
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.locator('.modal__error')).toContainText('cannot be empty');
  });

  // ── Successful edit ─────────────────────────────────────────────────────────

  test('saves updated title and content and shows in card', async ({ page }) => {
    const originalTitle = `Original ${Date.now()}`;
    const updatedTitle  = `Updated ${Date.now()}`;
    await createNote(page, originalTitle, 'Original content');

    await page.getByRole('button', { name: `Edit note: ${originalTitle}` }).click();

    // Update title
    const titleInput = page.locator('[role="dialog"] input').first();
    await titleInput.clear();
    await titleInput.fill(updatedTitle);

    // Update content
    const contentArea = page.locator('[role="dialog"] textarea').first();
    await contentArea.clear();
    await contentArea.fill('Updated content');

    await page.getByRole('button', { name: 'Save changes' }).click();

    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });

    // Card should show new title
    await expect(
      page.locator('.note-card').filter({ hasText: updatedTitle })
    ).toBeVisible({ timeout: 10000 });

    // Old title should no longer be on any card
    await expect(
      page.locator('.note-card').filter({ hasText: originalTitle })
    ).not.toBeVisible();
  });

  test('updates note tag via the modal select', async ({ page }) => {
    const title = `Tag Edit ${Date.now()}`;
    await createNote(page, title, 'Tag content');

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    await page.locator('[role="dialog"] select').selectOption('Work');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
    const card = page.locator('.note-card').filter({ hasText: title });
    await expect(card).toBeVisible();
  });

  test('note count stays the same after editing', async ({ page }) => {
    const title = `Count Edit ${Date.now()}`;
    await createNote(page, title);

    const counter = page.locator('.dashboard__stat-card').first().locator('.dashboard__stat-value');
    await expect(counter).toHaveText('1');

    await page.getByRole('button', { name: `Edit note: ${title}` }).click();
    const titleInput = page.locator('[role="dialog"] input').first();
    await titleInput.clear();
    await titleInput.fill(`Edited ${title}`);
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });

    // Count should still be 1
    await expect(counter).toHaveText('1');
  });

});
