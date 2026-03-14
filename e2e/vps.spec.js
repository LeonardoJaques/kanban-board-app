// @ts-check
const { test, expect } = require('@playwright/test');

// Credentials loaded from environment variables — never hardcode in source
const VPS_URL = process.env.KANBAN_URL || 'https://jaquesprojetos.com.br/kanban';
const USER = process.env.KANBAN_USER;
const PASS = process.env.KANBAN_PASS;

if (!USER || !PASS) {
  throw new Error(
    'Set KANBAN_USER and KANBAN_PASS environment variables before running VPS tests.\n' +
    'Example: KANBAN_USER=leo KANBAN_PASS=secret npx playwright test e2e/vps.spec.js'
  );
}

const authHeader = () => ({
  Authorization: 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64'),
});

test.describe('VPS - Kanban em produção', () => {
  test('401 sem credenciais', async ({ request }) => {
    const resp = await request.get(VPS_URL);
    expect(resp.status()).toBe(401);
  });

  test('200 com credenciais corretas', async ({ request }) => {
    const resp = await request.get(VPS_URL, { headers: authHeader() });
    expect(resp.status()).toBe(200);
  });

  test('API /all acessível com auth', async ({ request }) => {
    const resp = await request.get(`${VPS_URL}/api/all`, { headers: authHeader() });
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('API rejeita UUID inválido', async ({ request }) => {
    const resp = await request.get(`${VPS_URL}/api/boards/not-valid`, { headers: authHeader() });
    expect(resp.status()).toBe(400);
  });

  test('outros serviços não afetados', async ({ request }) => {
    const prompts = await request.get('https://jaquesprojetos.com.br/prompt/');
    expect(prompts.ok()).toBeTruthy();

    const main = await request.get('https://jaquesprojetos.com.br/');
    expect(main.ok()).toBeTruthy();
  });

  test('carrega o app no browser e faz screenshot', async ({ page }) => {
    await page.goto(`https://${USER}:${PASS}@jaquesprojetos.com.br/kanban/`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toBeVisible();

    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);

    await page.screenshot({ path: 'e2e/screenshot-vps.png', fullPage: true });
  });
});
