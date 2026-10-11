// Phase 5b: before/after comparison of the vehicle models (headless Chrome + SwiftShader).
// Usage: node tests/phase5b-compare.mjs <beforeURL> <afterURL>
// <beforeURL> serves the Phase 5 build (commit 098e945) with the same test-only garageHold/carStats hooks.
import { chromium } from 'playwright';
import fs from 'node:fs';
const [BEFORE, AFTER] = [process.argv[2] || 'http://127.0.0.1:4174/', process.argv[3] || 'http://127.0.0.1:4173/'];
const OUT = new URL('../screenshots/phase5b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
async function open(url, preset) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await ctx.addInitScript((p) => localStorage.setItem('owf.settings.v1', JSON.stringify({ preset: p, intro: false })), preset);
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 }); await page.waitForTimeout(1200);
  return { ctx, page, errors };
}
const fps = async (page, ms) => { const a = (await page.evaluate(() => window.__game.state().fpsHistory)).length; await page.waitForTimeout(ms); const h = (await page.evaluate(() => window.__game.state().fpsHistory)).slice(a); return h.length ? h.reduce((x, y) => x + y, 0) / h.length : 0; };
const result = {};
for (const [label, url] of [['before', BEFORE], ['after', AFTER]]) {
  result[label] = {};
  for (const preset of ['high', 'low']) {
    const { ctx, page, errors } = await open(url, preset);
    await page.click('#btn-garage'); await page.evaluate(() => window.__game.garageHold(1.0));
    const ids = await page.evaluate(() => window.__game.vehicles); const stats = {};
    for (let i = 0; i < ids.length; i++) {
      await page.waitForTimeout(1200);
      stats[ids[i]] = await page.evaluate(() => { const s = window.__game.carStats(); return { draws: s.draws, tris: s.tris }; });
      if (preset === 'high' && label === 'before') await page.screenshot({ path: `${OUT}before-garage-desktop-${i + 1}-${ids[i]}.png` });
      await page.click('#g-next');
    }
    // garage FPS (Scout) + gameplay FPS in the mud basin (Scout, part throttle, light steer)
    while ((await page.evaluate(() => window.__game.vehicle.id)) !== 'scout') await page.click('#g-next');
    await page.waitForTimeout(800);
    const garageFps = await fps(page, 5000);
    await page.click('#g-back'); await page.click('#btn-play'); await page.waitForTimeout(500);
    if (await page.locator('#btn-skip').isVisible()) await page.click('#btn-skip');
    await page.waitForFunction(() => window.__game.phase === 'playing');
    await page.evaluate(() => { window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.2, handbrake: false }); });
    await page.waitForTimeout(1500);
    const mudFps = await fps(page, 5000);
    const r = await page.evaluate(() => window.__game.state().renderer);
    result[label][preset] = { vehicles: stats, garageFps: +garageFps.toFixed(1), mudFps: +mudFps.toFixed(1), sceneDrawCallsInMud: r.calls, sceneTrianglesInMud: r.triangles, errors: errors.length };
    console.log(label, preset, JSON.stringify(result[label][preset]));
    await ctx.close();
  }
}
fs.writeFileSync(OUT + 'perf-before-after.json', JSON.stringify({ note: 'headless Chrome + SwiftShader (CPU software GL) on the build box; relative comparison only, not representative of real GPUs/phones. draws = visible car meshes (draw calls per render pass); shadow pass adds the same for shadow-casting meshes.', ...result }, null, 2));
await browser.close();
