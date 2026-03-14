// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:3001';

// --- Backend API tests ---

test.describe('Backend API', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const resp = await request.get(`${API_URL}/health`);
    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.status).toBe('ok');
  });

  test('rejects invalid UUID in board route', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/boards/not-a-uuid`);
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toContain('Invalid board ID');
  });

  test('rejects invalid UUID format in POST /api/boards', async ({ request }) => {
    const resp = await request.post(`${API_URL}/api/boards`, {
      data: { _id: 'bad-id', name: 'Test' },
    });
    expect(resp.status()).toBe(400);
  });

  test('rejects record without boardId', async ({ request }) => {
    const resp = await request.post(`${API_URL}/api/records`, {
      data: { description: 'orphan task' },
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toContain('boardId');
  });

  test('creates and deletes a board', async ({ request }) => {
    // Create
    const create = await request.post(`${API_URL}/api/boards`, {
      data: { name: 'E2E Test Board', taskStatuses: [], teamOrStories: [], tags: [] },
    });
    expect(create.ok()).toBeTruthy();
    const board = await create.json();
    expect(board.id).toBeTruthy();
    expect(board.name).toBe('E2E Test Board');

    // Delete
    const del = await request.delete(`${API_URL}/api/boards/${board.id}`);
    expect(del.ok()).toBeTruthy();
    const delBody = await del.json();
    expect(delBody.success).toBe(true);
  });

  test('security headers are present (helmet)', async ({ request }) => {
    const resp = await request.get(`${API_URL}/health`);
    expect(resp.headers()['x-content-type-options']).toBe('nosniff');
    expect(resp.headers()['x-frame-options']).toBe('SAMEORIGIN');
    expect(resp.headers()['content-security-policy']).toBeTruthy();
  });

  test('CORS blocks unauthorized origin', async ({ request }) => {
    const resp = await request.get(`${API_URL}/api/all`, {
      headers: { Origin: 'http://malicious.com' },
    });
    const allowOrigin = resp.headers()['access-control-allow-origin'];
    expect(allowOrigin).not.toBe('http://malicious.com');
    expect(allowOrigin).not.toBe('*');
  });
});

// --- Frontend UI tests ---

test.describe('Frontend UI', () => {
  test('loads the app', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/kanban/i);
  });

  test('shows a kanban board', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // App should render a main element or board container
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Should not show a blank error page
    const errorText = await page.locator('text=Error').count();
    expect(errorText).toBe(0);
  });

  test('navigation drawer is accessible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Look for a menu/hamburger button or nav
    const menuButton = page.locator('[aria-label="menu"], button[title="menu"], .MuiIconButton-root').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('no JavaScript errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('screenshot of the app', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshot-home.png', fullPage: true });
  });
});
