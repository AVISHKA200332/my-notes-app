import { test, expect } from '@playwright/test';
import { registerAndLogin } from './helpers.js';

async function createNote(page, title, content = 'Some content') {
  await page.getByPlaceholder('Give it a title').fill(title);
  await page.getByPlaceholder('Write down the details').fill(content);
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.waitForSelector(`.note-card:has-text("${title}")`);
}

test.describe('Delete note', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, 'Delete Note Test User');
    await page.waitForSelector('.create-note');
  });

  // ── Confirmation modal ──────────────────────────────────────────────────────

  test('clicking Delete shows confirmation modal with note title', async ({ page }) => {
    const title = `Delete Confirm ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();

    await expect(page.getByRole('alertdialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Delete note?' })).toBeVisible();
    await expect(page.getByRole('alertdialog')).toContainText(title);
  });

  test('Cancel dismisses the modal without deleting', async ({ page }) => {
    const title = `Cancel Delete ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();

    await page.getByRole('alertdialog').getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('alertdialog')).not.toBeVisible();

    // Note still present
    await expect(page.locator('.note-card').filter({ hasText: title })).toBeVisible();
  });

  test('pressing Escape dismisses the confirmation modal', async ({ page }) => {
    const title = `Escape Delete ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('alertdialog')).not.toBeVisible();

    // Note still present
    await expect(page.locator('.note-card').filter({ hasText: title })).toBeVisible();
  });

  test('clicking outside the modal dismisses it without deleting', async ({ page }) => {
    const title = `Backdrop Delete ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();

    await page.locator('.modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('alertdialog')).not.toBeVisible();

    await expect(page.locator('.note-card').filter({ hasText: title })).toBeVisible();
  });

  // ── Confirmed delete ────────────────────────────────────────────────────────

  test('confirming delete removes the note from the list', async ({ page }) => {
    const title = `Delete Me ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    await expect(
      page.locator('.note-card').filter({ hasText: title })
    ).not.toBeVisible({ timeout: 10000 });
  });

  test('note count decrements after deletion', async ({ page }) => {
    const title = `Count Delete ${Date.now()}`;
    await createNote(page, title);

    const counter = page.locator('.dashboard__stat-card').first().locator('.dashboard__stat-value');
    await expect(counter).toHaveText('1');

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();
    await expect(
      page.locator('.note-card').filter({ hasText: title })
    ).not.toBeVisible({ timeout: 10000 });

    await expect(counter).toHaveText('0');
  });

  test('empty state message appears after deleting last note', async ({ page }) => {
    const title = `Last Note ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    await expect(
      page.getByText('No notes here yet. Create your first one above')
    ).toBeVisible({ timeout: 10000 });
  });

  test('deletes one of multiple notes, others remain', async ({ page }) => {
    const titleA = `Keep Note ${Date.now()}`;
    const titleB = `Delete Note ${Date.now()}`;

    await createNote(page, titleA, 'Keep this one');
    await createNote(page, titleB, 'Delete this one');

    await page.getByRole('button', { name: `Delete note: ${titleB}` }).click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    await expect(
      page.locator('.note-card').filter({ hasText: titleB })
    ).not.toBeVisible({ timeout: 10000 });

    await expect(
      page.locator('.note-card').filter({ hasText: titleA })
    ).toBeVisible();
  });

  test('modal is gone after successful delete', async ({ page }) => {
    const title = `Modal Gone ${Date.now()}`;
    await createNote(page, title);

    await page.getByRole('button', { name: `Delete note: ${title}` }).click();
    await page.getByRole('button', { name: 'Yes, delete' }).click();

    await expect(page.getByRole('alertdialog')).not.toBeVisible({ timeout: 10000 });
  });

});
