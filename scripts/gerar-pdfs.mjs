import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { bonuses } from './bonus-data.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const output = new URL('../bonus-entrega/', import.meta.url);
await mkdir(output, { recursive:true });
const browser = await chromium.launch({ executablePath:process.env.BROWSER_PATH || undefined });
try {
  const page = await browser.newPage();
  for (const item of bonuses) {
    await page.goto(new URL('../bonus/'+item.id+'/index.html', import.meta.url).href);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path:fileURLToPath(new URL(item.id+'.pdf',output)), preferCSSPageSize:true, printBackground:true });
  }
} finally { await browser.close(); }

