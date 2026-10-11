// Standalone runner for the drive-control block (the full suite runs it via tests/acceptance.mjs).
import { chromium } from 'playwright';
import { runDrive } from './drive-block.mjs';
import fs from 'node:fs';
const APP_URL = process.env.URL || 'http://127.0.0.1:4173/';
const results = []; const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
async function openPage(ctxOpts, label, query = '', o = {}) {
  const ctx = await browser.newContext(ctxOpts); const page = await ctx.newPage(); const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(APP_URL + query); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 });
  if (!o.keepOpening) { await page.evaluate(() => window.__game.skipOpening()); await page.waitForTimeout(1200); }
  return { ctx, page, errors, label };
}
const m = await runDrive({ openPage, ok });
await browser.close();
fs.writeFileSync(new URL('../screenshots/rework/drive-metrics.json', import.meta.url), JSON.stringify(m, null, 1));
console.log(JSON.stringify(m, null, 1));
const failed = results.filter((r) => !r.pass); console.log(`\n${results.length - failed.length}/${results.length} drive checks passed`); process.exit(failed.length ? 1 : 0);
