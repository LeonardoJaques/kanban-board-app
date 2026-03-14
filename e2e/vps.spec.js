// @ts-check
const { test, expect } = require('@playwright/test');

const VPS_URL = 'https://jaquesprojetos.com.br/kanban';
const USER = 'leo';
const PASS = '***REDACTED***';

// Helper: URL with basic auth embedded
const authUrl = (path = '') =>
  `https://${USER}:${PASS}@jaquesprojetos.com.br/kanban${path}`;

test.describe('VPS - Kanban em produção', () => {
  test('401 sem credenciais', async ({ request }) => {
    const resp = await request.get(VPS_URL);
    expect(resp.status()).toBe(401);
  });

  test('200 com credenciais corretas', async ({ request }) => {
    const resp = await request.get(VPS_URL, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64'),
      },
    });
    expect(resp.status()).toBe(200);
  });

  test('API /all acessível com auth', async ({ request }) => {
    const resp = await request.get(`${VPS_URL}/api/all`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64'),
      },
    });
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('API rejeita UUID inválido', async ({ request }) => {
    const resp = await request.get(`${VPS_URL}/api/boards/not-valid`, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64'),
      },
    });
    expect(resp.status()).toBe(400);
  });

  test('outros serviços não afetados', async ({ request }) => {
    const prompts = await request.get('https://jaquesprojetos.com.br/prompt/');
    expect(prompts.ok()).toBeTruthy();

    const main = await request.get('https://jaquesprojetos.com.br/');
    expect(main.ok()).toBeTruthy();
  });

  test('carrega o app no browser e faz screenshot', async ({ page }) => {
    // Basic auth via URL
    await page.goto(authUrl('/'));
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title.toLowerCase()).toContain('kanban');

    // Should show some UI content
    await expect(page.locator('body')).toBeVisible();

    // No JS errors
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);

    await page.screenshot({ path: 'e2e/screenshot-vps.png', fullPage: true });
  });
});
