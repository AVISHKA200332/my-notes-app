# Playwright E2E Tests

Full end-to-end test suite for the My Notes App using [Playwright](https://playwright.dev/).

## What's tested

| File | Coverage |
|------|----------|
| `auth.register.spec.js` | Registration form validation, duplicate email checks, token storage, redirect behavior |
| `auth.login.spec.js` | Login form validation, invalid credentials, token persistence, redirect behavior |
| `auth.guard.spec.js` | Protected route guards, logout, session persistence |
| `dashboard.spec.js` | Dashboard layout, stats, empty state, logout |
| `notes.create.spec.js` | Create form validation, success flow, category selection, counter updates |
| `notes.edit.spec.js` | Edit modal open/close, validation, save changes, keyboard shortcuts |
| `notes.delete.spec.js` | Delete confirmation modal, cancel behavior, successful deletion, counter updates |
| `notes.filter.spec.js` | Category filters, search by title/content, empty states, case-insensitivity |

**Total:** 71 tests across 8 spec files

---

## Prerequisites

1. **Both servers must be runnable** — Playwright starts them automatically:
   - Backend: `cd backend && npm run dev` → http://localhost:5000
   - Frontend: `cd frontend && npm run dev` → http://localhost:5173

2. **MongoDB must be accessible** — the backend `.env` must have a working `MONGO_URI`.

3. **Chromium browser** is already installed via `npx playwright install chromium`.

---

## Running tests

### Run all tests (headless)
```bash
cd frontend
npm test
```

### Run tests in UI mode (interactive, debuggable)
```bash
npm run test:ui
```

### Run a specific test file
```bash
npx playwright test auth.login.spec.js
```

### Run in headed mode (see the browser)
```bash
npx playwright test --headed
```

### View last test report
```bash
npm run test:report
```

---

## How it works

1. **`playwright.config.js`** defines:
   - Test directory: `./tests`
   - Base URL: `http://localhost:5173`
   - Auto-starts both frontend (`npm run dev`) and backend (`npm run dev`) before tests run
   - Single worker (sequential execution) to avoid race conditions in MongoDB

2. **`helpers.js`** provides:
   - `uniqueEmail()` — generates a fresh email for every test run
   - `registerAndLogin(page, name)` — registers a user and lands on `/dashboard`
   - `loginViaUI(page, email, password)` — logs in via the UI
   - `createNoteViaUI(page, {...})` — creates a note and waits for it to appear

3. **Test structure:**
   - Each spec uses `test.describe()` to group related tests
   - `test.beforeEach()` sets up common state (e.g., register + login)
   - Tests are **isolated** — each gets a fresh browser context

---

## Key patterns

### Registration + login
```js
import { registerAndLogin } from './helpers.js';

test('some test', async ({ page }) => {
  await registerAndLogin(page, 'Test User');
  // Now on /dashboard with a logged-in session
});
```

### Creating test data
```js
await page.getByPlaceholder('Give it a title').fill('My Note');
await page.getByPlaceholder('Write down the details').fill('Content');
await page.getByRole('button', { name: 'Add Note' }).click();
await page.waitForSelector('.note-card:has-text("My Note")');
```

### Modal interactions
```js
await page.getByRole('button', { name: 'Edit note: My Note' }).click();
await expect(page.getByRole('dialog')).toBeVisible();
await page.keyboard.press('Escape');
await expect(page.getByRole('dialog')).not.toBeVisible();
```

---

## Debugging

### Debug mode (pauses on failure)
```bash
npx playwright test --debug
```

### Trace viewer (after failure)
```bash
npx playwright show-trace test-results/.../trace.zip
```

### Screenshots & videos
On failure, screenshots are saved to `test-results/`. Videos are retained only on failure.

---

## CI/CD integration

Set `CI=true` to enable:
- 2 retries on failure
- Disallow `.only()` in tests
- Never reuse existing dev servers

```bash
CI=true npx playwright test
```

---

## Troubleshooting

**Tests fail with "No server found"**
→ Manually start both servers in separate terminals first, then re-run tests.

**Duplicate email errors**
→ Each test run creates new users — if MongoDB isn't cleared between runs, you'll see duplicates. Use unique timestamps in emails to avoid this (already handled by `uniqueEmail()`).

**Tests timeout**
→ Increase timeout in `playwright.config.js` under `use: { timeout: 60000 }` or per-test with `test.setTimeout(90000);`.

**Flaky tests**
→ All tests use `waitForSelector` / `waitForURL` to ensure the UI is ready before assertions. If flakiness persists, check network conditions or increase `timeout` in config.

---

## Adding new tests

1. Create a new `.spec.js` file in `tests/`
2. Import helpers: `import { registerAndLogin } from './helpers.js';`
3. Use `test.describe()` to group, `test.beforeEach()` for setup
4. Write assertions with `await expect(page.locator('...')).toBeVisible();`
5. Run: `npx playwright test your-new.spec.js`
