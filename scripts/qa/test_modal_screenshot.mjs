import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3000/tools/bangla-converter');
  await page.waitForTimeout(1500);
  const btn = await page.$('button:has-text("সহজ বাংলায় গাইড দেখুন")');
  if (btn) {
    console.log('Clicking button...');
    await btn.click();
    await page.waitForTimeout(600);
  } else {
    console.log('Button not found');
  }
  await page.screenshot({ path: 'scripts/qa/bangla_modal_current.png' });
  await browser.close();
  console.log('Done');
}

run().catch(console.error);
