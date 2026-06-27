import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false, slowMo: 350 });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', err => errors.push(err.message));

const SNAP = p => page.screenshot({
  path: `C:/Users/HP/AppData/Local/Temp/claude/C--Users-HP-OneDrive-Desktop-biravan-handoff/2ac22089-e363-47cc-bb1a-c3b0c52fb581/scratchpad/${p}`
});

await page.goto('http://localhost:5173/#/admin');
await page.waitForTimeout(2000);

// Login
const pwInput = page.locator('input[type="password"]');
if (await pwInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  await pwInput.fill('biravan2025');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);
}
await SNAP('01-dashboard.png');

// Go to Products
for (const btn of await page.locator('button').all()) {
  const txt = await btn.innerText().catch(() => '');
  if (/^products$/i.test(txt.trim())) { await btn.click(); break; }
}
await page.waitForTimeout(1500);
await SNAP('02-products-page.png');

// Click Add Product
for (const btn of await page.locator('button').all()) {
  const txt = await btn.innerText().catch(() => '');
  if (/add product/i.test(txt)) { await btn.click(); break; }
}
await page.waitForTimeout(800);

// Fill the form
await page.locator('input[placeholder*="Tailored"]').fill('Test Jacket');
const numInputs = page.locator('input[type="number"]');
await numInputs.nth(0).fill('55000');
await numInputs.nth(1).fill('5');
await page.locator('textarea').fill('A sleek test jacket added via automation.');
await SNAP('03-form-filled.png');

// Inject an image URL directly into React state via the upload slot
// We simulate a completed upload by dispatching a fake file drop with a hosted image URL
// Instead, use page.evaluate to bypass the file picker and set image URL in the DOM
// The ImageSlot component stores value in React state via onChange prop
// The easiest way: use page.evaluate to trigger the React onChange on the hidden input's parent
// Actually, we'll use a workaround: intercept the Cloudinary API call
await page.route('**/cloudinary.com/**/image/upload', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      secure_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'
    })
  });
});

// Trigger the file upload flow by clicking the upload area
const uploadArea = page.locator('text=Click to upload').first();
await uploadArea.click();

// Create a fake file and dispatch it to the hidden input
await page.locator('input[type="file"]').first().setInputFiles({
  name: 'jacket.jpg',
  mimeType: 'image/jpeg',
  buffer: Buffer.from('fake-image-data'),
});
await page.waitForTimeout(2000);
await SNAP('04-image-uploaded.png');

// Submit
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);
await SNAP('05-after-submit.png');

// Check result
const modalStillOpen = await page.locator('text=Add New Product').isVisible().catch(() => false);
const redErrors = await page.locator('.text-red-400').allInnerTexts();
const savingText = await page.locator('text=Saving').isVisible().catch(() => false);

console.log('Modal still open:', modalStillOpen);
console.log('Red error messages:', redErrors);
console.log('Still saving:', savingText);
console.log('Console errors:', errors.slice(0, 6));

await browser.close();
