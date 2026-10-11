// Standalone runner for the Phase 6b block (the full suite runs it via tests/acceptance.mjs).
import { chromium } from 'playwright';
import { runPhase6b } from './phase6b-block.mjs';
const APP_URL = process.env.URL || 'http://127.0.0.1:4173/';
const results = []; const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
async function openPage(ctxOpts, label, query = '') {
  const ctx = await browser.newContext(ctxOpts); const page = await ctx.newPage(); const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(APP_URL + query); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 }); await page.waitForTimeout(1200);
  return { ctx, page, errors, label };
}
const area = async (page, sel) => { const b = await page.locator(sel).boundingBox(); const v = page.viewportSize(); if (!b) return 0;
  const w = Math.max(0, Math.min(b.x + b.width, v.width) - Math.max(0, b.x)); const h = Math.max(0, Math.min(b.y + b.height, v.height) - Math.max(0, b.y)); return (w * h) / (v.width * v.height); };
const m = await runPhase6b({ openPage, ok, area });
await browser.close();
console.log(JSON.stringify(m, null, 1));
const failed = results.filter((r) => !r.pass); console.log(`\n${results.length - failed.length}/${results.length} phase 6b checks passed`); process.exit(failed.length ? 1 : 0);
