// Acceptance tests for Phases 1-3. Run against `npm run preview` (http://127.0.0.1:4173).
import { chromium } from 'playwright';
import fs from 'node:fs';

const APP_URL = process.env.URL || 'http://127.0.0.1:4173/';
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function openPage(ctxOpts, label) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  const t0 = Date.now();
  await page.goto(APP_URL);
  await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1200); // loading screen fade
  return { ctx, page, errors, loadMs, label };
}
const st = (page) => page.evaluate(() => window.__game.state());
const area = async (page, sel) => {
  const b = await page.locator(sel).boundingBox(); const v = page.viewportSize();
  if (!b) return 0;
  const w = Math.max(0, Math.min(b.x + b.width, v.width) - Math.max(0, b.x));
  const h = Math.max(0, Math.min(b.y + b.height, v.height) - Math.max(0, b.y));
  return (w * h) / (v.width * v.height);
};
async function fpsSample(page, ms) {
  const before = (await st(page)).fpsHistory.length;
  await page.waitForTimeout(ms);
  const h = (await st(page)).fpsHistory.slice(before);
  return h.length ? h.reduce((a, b) => a + b, 0) / h.length : (await st(page)).fps;
}

// ---------------- Desktop 1280x720 ----------------
{
  const { ctx, page, errors, loadMs } = await openPage({ viewport: { width: 1280, height: 720 } }, 'desktop');
  const gl = await page.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'); const d = g.getExtension('WEBGL_debug_renderer_info'); return g.getParameter(d.UNMASKED_RENDERER_WEBGL); });
  ok('desktop: game loads to main menu', true, `load ${loadMs} ms, renderer: ${gl}`);
  const menuA = await area(page, '#menu');
  ok('desktop: menu panel does not cover whole game', menuA < 0.6, `covers ${(menuA * 100).toFixed(0)}% of viewport`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-menu.png' });
  await page.click('#btn-settings'); await page.waitForTimeout(500);
  const drA = await area(page, '#drawer');
  ok('desktop: settings drawer partial', drA < 0.6, `covers ${(drA * 100).toFixed(0)}%`);
  await page.click('#seg-preset button[data-v="medium"]');
  const preset = (await st(page)).preset;
  ok('desktop: graphics preset switch works', preset === 'medium', `preset=${preset}`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-settings.png' });
  await page.click('#seg-preset button[data-v="high"]');
  await page.click('#btn-close-drawer'); await page.waitForTimeout(400);

  await page.click('#btn-play'); await page.waitForTimeout(800);
  const s0 = await st(page);
  // real keyboard input path: hold W
  await page.keyboard.down('KeyW'); await sleep(4000); await page.keyboard.up('KeyW');
  const s1 = await st(page);
  const moved = Math.hypot(s1.x - s0.x, s1.z - s0.z);
  ok('desktop: W key drives vehicle forward (real-time)', moved > 3 && s1.speed > 1, `moved ${moved.toFixed(2)} m, speed ${(s1.speed * 3.6).toFixed(1)} km/h (render-paced)`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-gameplay.png' });
  // steering: W + A
  const y0 = (await st(page)).yaw;
  await page.keyboard.down('KeyW'); await page.keyboard.down('KeyA'); await sleep(2500);
  await page.keyboard.up('KeyA'); await page.keyboard.up('KeyW');
  const y1 = (await st(page)).yaw;
  const dyaw = Math.atan2(Math.sin(y1 - y0), Math.cos(y1 - y0));
  ok('desktop: A key steers (heading changes)', Math.abs(dyaw) > 0.2, `heading change ${(dyaw * 180 / Math.PI).toFixed(1)} deg`);
  // pause via Escape
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  const ph = await page.evaluate(() => window.__game.phase);
  const pauseA = await area(page, '#pause');
  ok('desktop: Esc pauses; pause panel is partial', ph === 'paused' && pauseA < 0.5, `phase=${ph}, covers ${(pauseA * 100).toFixed(0)}%`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-paused.png' });
  await page.keyboard.press('Escape');

  // ---- deterministic traction test (fixed 60 Hz physics steps, render-independent) ----
  const lanes = { ground: [-32, 0], mud: [-102, 40], sand: [66, -55] };
  const traction = {};
  for (const [surf, [x, z]] of Object.entries(lanes)) {
    const r = await page.evaluate(([x, z]) => {
      const g = window.__game;
      g.teleport(x, z, Math.PI / 2); // face +X
      g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: true }, 1.5); // settle
      return g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 3);
    }, [x, z]);
    traction[surf] = r;
    const sp = r.trace.map((p) => `${p.t.toFixed(1)}s:${(p.speed * 3.6).toFixed(1)}`).join(' ');
    console.log(`   ${surf.padEnd(6)} surfaces=[${[...new Set(r.trace.map((p) => p.surface))]}] dist3s=${r.distance.toFixed(2)}m v3s=${(r.finalSpeed * 3.6).toFixed(1)}km/h  ${sp}`);
  }
  const allOnSurface = Object.entries(traction).every(([s, r]) => r.trace.every((p) => p.surface === s));
  ok('traction: each lane stays on its intended surface', allOnSurface);
  const vG = traction.ground.finalSpeed, vS = traction.sand.finalSpeed, vM = traction.mud.finalSpeed;
  ok('traction: ground > sand > mud (speed after 3 s full throttle)', vG > vS && vS > vM,
    `ground ${(vG * 3.6).toFixed(1)} / sand ${(vS * 3.6).toFixed(1)} / mud ${(vM * 3.6).toFixed(1)} km/h`);
  // braking
  const br = await page.evaluate(() => {
    const g = window.__game; g.teleport(-32, 0, Math.PI / 2);
    g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: false }, 1);
    const a = g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 2.5);
    const b = g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 1.5);
    return { v0: a.finalSpeed, v1: b.finalSpeed, d: b.distance };
  });
  const decel = (br.v0 - br.v1) / 1.5;
  ok('brakes decelerate strongly (>= 7 m/s^2)', decel >= 7, `from ${(br.v0 * 3.6).toFixed(1)} to ${(br.v1 * 3.6).toFixed(1)} km/h in 1.5 s = ${decel.toFixed(1)} m/s^2 (${(decel / 9.81).toFixed(2)} g), ${br.d.toFixed(1)} m`);
  const rev = await page.evaluate(() => { const g = window.__game; return g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 2.5).finalSpeed; });
  ok('holding brake at standstill reverses', rev < -1, `${(rev * 3.6).toFixed(1)} km/h`);
  const upright = (await st(page)).up;
  ok('vehicle stays upright through tests', upright > 0.9, `up.y=${upright.toFixed(3)}`);

  // FPS while driving in the mud for the screenshot
  await page.evaluate(() => { window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.3, handbrake: false }); });
  const tr0 = (await st(page)).tracks;
  const fpsHigh = await fpsSample(page, 5000);
  const tr1 = (await st(page)).tracks;
  ok('tyre tracks laid while driving in mud (real-time)', tr1 - tr0 > 20, `${tr1 - tr0} track decals in 5 s`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-gameplay-mud.png' });
  await page.evaluate(() => { window.__game.teleport(70, -62, 1.5); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-gameplay-sand.png' });
  await page.evaluate(() => window.__game.setInput(null));
  // low preset FPS
  await page.keyboard.press('Escape'); await page.click('#btn-settings2'); await page.click('#seg-preset button[data-v="low"]');
  await page.click('#btn-close-drawer'); await page.click('#btn-resume');
  await page.evaluate(() => { window.__game.teleport(-32, 0, Math.PI / 2); window.__game.setInput({ throttle: 0.6, brake: 0, steer: 0.2, handbrake: false }); });
  const fpsLow = await fpsSample(page, 5000);
  ok('FPS measured (desktop, SwiftShader software GL)', fpsHigh > 0, `High preset ${fpsHigh.toFixed(1)} fps, Low preset ${fpsLow.toFixed(1)} fps`);
  ok('desktop: no console errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  await ctx.close();
}

// ---------------- Mobile (portrait + landscape) ----------------
for (const [label, w, h] of [['mobile-portrait-390x844', 390, 844], ['mobile-landscape-844x390', 844, 390]]) {
  const { ctx, page, errors, loadMs } = await openPage({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' }, label);
  ok(`${label}: loads to menu`, true, `load ${loadMs} ms`);
  const menuA = await area(page, '#menu');
  ok(`${label}: menu panel partial`, menuA < 0.7, `covers ${(menuA * 100).toFixed(0)}%`);
  await page.screenshot({ path: `${SHOTS}${label}-menu.png` });
  await page.tap('#btn-settings'); await page.waitForTimeout(500);
  const drA = await area(page, '#drawer');
  ok(`${label}: settings drawer partial`, drA < 0.8, `covers ${(drA * 100).toFixed(0)}%`);
  await page.screenshot({ path: `${SHOTS}${label}-settings.png` });
  await page.tap('#btn-close-drawer'); await page.waitForTimeout(400);
  await page.tap('#btn-play'); await page.waitForTimeout(800);
  const vis = await page.locator('#touch').isVisible();
  const btns = await page.locator('#touch .tbtn').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { k: e.dataset.k, w: r.width, h: r.height, in: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; }));
  ok(`${label}: touch controls visible, >=48px, on-screen`, vis && btns.length === 5 && btns.every((b) => b.w >= 48 && b.h >= 48 && b.in), btns.map((b) => `${b.k}:${Math.round(b.w)}x${Math.round(b.h)}`).join(' '));
  // hold GAS + steer via pointer events (multi-touch: two pointer ids)
  const s0 = await st(page);
  await page.dispatchEvent('#touch .gas', 'pointerdown', { pointerId: 11, pointerType: 'touch', isPrimary: true, bubbles: true });
  await sleep(3000);
  await page.dispatchEvent('#touch [data-k="left"]', 'pointerdown', { pointerId: 12, pointerType: 'touch', bubbles: true });
  await sleep(1200);
  await page.screenshot({ path: `${SHOTS}${label}-gameplay.png` });
  const s1 = await st(page);
  await page.dispatchEvent('#touch [data-k="left"]', 'pointerup', { pointerId: 12, pointerType: 'touch', bubbles: true });
  await page.dispatchEvent('#touch .gas', 'pointerup', { pointerId: 11, pointerType: 'touch', bubbles: true });
  const moved = Math.hypot(s1.x - s0.x, s1.z - s0.z);
  const dyaw = Math.atan2(Math.sin(s1.yaw - s0.yaw), Math.cos(s1.yaw - s0.yaw));
  ok(`${label}: touch GAS + steer drives and turns`, moved > 2 && Math.abs(dyaw) > 0.05, `moved ${moved.toFixed(2)} m, heading change ${(dyaw * 180 / Math.PI).toFixed(1)} deg`);
  const fps = await fpsSample(page, 4000);
  ok(`${label}: FPS (SwiftShader)`, fps > 0, `${fps.toFixed(1)} fps @ preset ${(await st(page)).preset}`);
  await page.tap('#btn-pause'); await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}${label}-paused.png` });
  // rotation / resize handling
  await page.setViewportSize({ width: h, height: w }); await page.waitForTimeout(600);
  const cv = await page.evaluate(() => { const c = document.getElementById('game'); const r = c.getBoundingClientRect(); return { cw: r.width, ch: r.height, iw: innerWidth, ih: innerHeight, bw: c.width, bh: c.height }; });
  ok(`${label}: rotation -> canvas resizes to new viewport`, Math.abs(cv.cw - cv.iw) < 1 && Math.abs(cv.ch - cv.ih) < 1 && cv.bw / cv.bh > 0 && Math.abs(cv.bw / cv.bh - cv.iw / cv.ih) < 0.02, JSON.stringify(cv));
  ok(`${label}: no console errors`, errors.length === 0, errors.slice(0, 5).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.pass);
fs.writeFileSync(new URL('../screenshots/test-results.json', import.meta.url), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
