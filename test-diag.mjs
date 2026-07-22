import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[pageerror]', err.message));
page.on('requestfailed', req => console.log('[requestfailed]', req.url(), req.failure()?.errorText));
page.on('response', res => {
  if (!res.ok()) console.log('[response]', res.status(), res.url());
});

await page.goto('http://localhost:5173/#/admin');
await page.waitForTimeout(2000);

const pwInput = page.locator('input[type="password"]');
if (await pwInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  await pwInput.fill('biravan2026');
  await page.keyboard.press('Enter');
}

await page.waitForTimeout(6000);

console.log('Still loading:', await page.locator('text=Loading dashboard').isVisible().catch(() => false));

await browser.close();
