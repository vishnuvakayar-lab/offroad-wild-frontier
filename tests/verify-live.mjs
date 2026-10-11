// Verifies the deployed GitHub Pages builds in headless Chrome (SwiftShader). Not a real device.
// node tests/verify-live.mjs  -> screenshots/rework/live/ + live-verify.json
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = 'https://vishnuvakayar-lab.github.io/offroad-wild-frontier/';
const OUT = new URL('../screenshots/rework/live/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const res = {};
const watch = (page) => { const errors = [], failed = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message)); page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); }); return { errors, failed }; };
for (const [label, opts] of [['preview-desktop', { viewport: { width: 1280, height: 720 } }], ['preview-iphone-portrait', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA }], ['preview-iphone-landscape', { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA }]]) {
  const ctx = await browser.newContext(opts); const page = await ctx.newPage(); const w = watch(page); const touch = !!opts.hasTouch;
  const t0 = Date.now(); await page.goto(BASE + 'preview/', { waitUntil: 'load' });
  await page.waitForFunction(() => ['menu', 'opening'].includes(window.__game?.phase), null, { timeout: 120000 });
  const r = { loadMs: Date.now() - t0, build: (await page.textContent('body')).match(/Build [0-9.]+/)?.[0], firstPhase: await page.evaluate(() => window.__game.phase) };
  await page.waitForTimeout(2500); await page.screenshot({ path: `${OUT}${label}-opening.png` });
  // skip the opening the way a user does (tap / click), then start Free Roam from the menu
  if ((await page.evaluate(() => window.__game.phase)) === 'opening') { if (touch) await page.tap('#btn-oskip'); else await page.click('#btn-oskip'); }
  await page.waitForFunction(() => window.__game.phase === 'menu', null, { timeout: 30000 }); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}${label}-menu.png` });
  if (touch) await page.tap('#btn-play'); else await page.click('#btn-play');
  await page.waitForTimeout(600); await page.evaluate(() => window.__game.skipIntro?.());
  await page.waitForFunction(() => window.__game.phase === 'playing', null, { timeout: 30000 }); await page.waitForTimeout(500);
  r.controls = await page.evaluate(() => window.__game.controls().setting);
  const p0 = await page.evaluate(() => window.__game.pose());
  if (touch) { // default touch halves: the car drives forward by itself; hold the right half to steer right
    const z = await page.locator('#tzones .tz.r').boundingBox();
    await page.dispatchEvent('#tzones .tz.r', 'pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true, bubbles: true, clientX: z.x + z.width / 2, clientY: z.y + z.height / 2 });
    await page.waitForTimeout(3000);
    await page.dispatchEvent('#tzones .tz.r', 'pointerup', { pointerId: 1, pointerType: 'touch', isPrimary: true, bubbles: true });
  } else { await page.keyboard.down('KeyW'); await page.waitForTimeout(3000); await page.keyboard.up('KeyW'); }
  const p1 = await page.evaluate(() => window.__game.pose());
  r.moved = +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1); r.kmh = +(p1.speed * 3.6).toFixed(1);
  r.ui = await page.evaluate(() => { const v = (id) => document.getElementById(id).getClientRects().length > 0; return { zones: v('tzones'), wheel: v('wheel'), pedals: v('pedals'), hud: v('hud') }; });
  await page.screenshot({ path: `${OUT}${label}-driving.png` });
  r.errors = w.errors; r.failedRequests = w.failed; res[label] = r; console.log(label, JSON.stringify(r)); await ctx.close();
}
{ // root must still be the old v0.4.1 build
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } }); const page = await ctx.newPage(); const w = watch(page);
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(8000);
  const r = await page.evaluate(() => ({ build: document.body.textContent.match(/Build [0-9.]+/)?.[0], hasOpening: !!document.getElementById('opening'), hasCockpit: !!document.getElementById('cockpit'), scripts: [...document.scripts].map((s) => s.src.split('/').pop()) }));
  await page.screenshot({ path: `${OUT}root-desktop.png` });
  r.errors = w.errors; r.failedRequests = w.failed; res.root = r; console.log('root', JSON.stringify(r)); await ctx.close();
}
fs.writeFileSync(OUT + 'live-verify.json', JSON.stringify(res, null, 1));
await browser.close();
