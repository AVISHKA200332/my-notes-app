/**
 * Shared test helpers for Playwright tests.
 */

/** Generate a unique email so every test run registers a fresh account */
export const uniqueEmail = () =>
  `testuser_${Date.now()}@playwright.test`;

/** Default test password used across all tests */
export const TEST_PASSWORD = 'Test@1234';

/**
 * Register a brand-new user via the UI and land on /dashboard.
 * Returns the credentials used so later tests can log in with them.
 */
export async function registerAndLogin(page, name) {
  const email = uniqueEmail();

  await page.goto('/register');
  await page.getByLabel('Full name').fill(name ?? 'Playwright User');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
  await page.getByLabel('Confirm password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.waitForURL('**/dashboard');

  return { email, password: TEST_PASSWORD, name: name ?? 'Playwright User' };
}

/**
 * Log in via the UI and land on /dashboard.
 */
export async function loginViaUI(page, email, password) {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password ?? TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

/**
 * Inject auth tokens directly into localStorage and reload —
 * faster than going through the login UI for tests that just need
 * to start on the dashboard.
 */
export async function seedAuthStorage(page, userData) {
  await page.goto('/login');
  await page.evaluate((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }, userData);
  await page.goto('/dashboard');
  await page.waitForURL('**/dashboard');
}

/**
 * Create a note via the dashboard UI form.
 * Waits for the card to appear before returning.
 */
export async function createNoteViaUI(page, { title, content, category }) {
  await page.getByPlaceholder('Give it a title').fill(title);
  await page.getByPlaceholder('Write down the details').fill(content);
  if (category) {
    await page.getByRole('combobox').first().selectOption(category);
  }
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.waitForSelector(`.note-card:has-text("${title}")`);
}
