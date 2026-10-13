// Acceptance tests for Phases 1-6 (+5b detailed models, 6 missions/progression). Run against `npm run preview` (http://127.0.0.1:4173).
import { chromium } from 'playwright';
import fs from 'node:fs';
import { runPhase6 } from './phase6-block.mjs';
import { runPhase6b } from './phase6b-block.mjs';
import { runRework } from './rework-block.mjs';
import { runDrive } from './drive-block.mjs';
import { runLayout } from './layout-block.mjs';

const APP_URL = process.env.URL || 'http://127.0.0.1:4173/';
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
const SHOTS4 = SHOTS + 'phase4/';
fs.mkdirSync(SHOTS4, { recursive: true });
const results = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function openPage(ctxOpts, label, query = '', o = {}) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  const t0 = Date.now();
  await page.goto(APP_URL + query);
  await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 });
  if (!o.keepOpening) await page.evaluate(() => window.__game.skipOpening()); // the opening cinematic has its own check (drive-block)
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1200); // loading screen fade
  return { ctx, page, errors, loadMs, label };
}
const st = (page) => page.evaluate(() => window.__game.state());
const area = async (page, sel) => {
  // measure the settled layout: wait for finite CSS transitions (e.g. the drawer slide-in) on the element to finish
  await page.evaluate((sel) => { const e = document.querySelector(sel); return e && Promise.all(e.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))); }, sel);
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
  const a0 = (await st(page)).audio.state;
  ok('audio: no AudioContext before any user gesture', a0 === 'none', `state=${a0}`);
  const menuA = await area(page, '#menu');
  ok('desktop: menu panel does not cover whole game', menuA < 0.6, `covers ${(menuA * 100).toFixed(0)}% of viewport`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-menu.png' });
  await page.click('#btn-settings'); await page.waitForTimeout(500);
  const a1 = (await st(page)).audio.state;
  ok('audio: AudioContext created and running after first click', a1 === 'running', `state=${a1}`);
  const drA = await area(page, '#drawer');
  ok('desktop: settings drawer partial', drA > 0.05 && drA < 0.6, `covers ${(drA * 100).toFixed(0)}%`);
  await page.click('#seg-preset button[data-v="medium"]');
  const preset = (await st(page)).preset;
  ok('desktop: graphics preset switch works', preset === 'medium', `preset=${preset}`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-settings.png' });
  await page.click('#seg-preset button[data-v="high"]');
  await page.click('#btn-close-drawer'); await page.waitForTimeout(400);

  const tPlay = Date.now(); await page.click('#btn-play');
  await page.waitForFunction(() => window.__game.phase === 'playing', null, { timeout: 3000 });
  ok('Free Roam: Play is drivable at once (no fly-over intro blocking input)', true, `phase playing ${Date.now() - tPlay} ms after the click`);
  await page.waitForTimeout(1500);
  const hzIdle = await page.evaluate(() => window.__game.measureEngineHz());
  const sIdle = await st(page);
  const s0 = sIdle;
  // real keyboard input path: hold W
  await page.keyboard.down('KeyW'); await sleep(4000);
  const hzGas = await page.evaluate(() => window.__game.measureEngineHz());
  const s1 = await st(page);
  await page.keyboard.up('KeyW');
  ok('audio: engine pitch rises with throttle (FFT of engine bus)', hzGas > hzIdle * 1.5,
    `idle: ${hzIdle.toFixed(1)} Hz measured / ${sIdle.audio.engineHz.toFixed(1)} Hz set, ${sIdle.rpm.toFixed(0)} rpm -> throttle: ${hzGas.toFixed(1)} Hz measured / ${s1.audio.engineHz.toFixed(1)} Hz set, ${s1.rpm.toFixed(0)} rpm (gear ${s1.gear})`);
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
  await page.click('#btn-close-drawer'); await page.waitForFunction(() => window.__game.phase === 'playing'); /* closing Settings opened from Pause resumes play */
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
  ok(`${label}: settings drawer partial`, drA > 0.05 && drA < 0.8, `covers ${(drA * 100).toFixed(0)}%`);
  await page.screenshot({ path: `${SHOTS}${label}-settings.png` });
  await page.tap('#btn-close-drawer'); await page.waitForTimeout(400);
  await page.tap('#btn-play'); await page.waitForTimeout(400);
  const iph = await page.evaluate(() => window.__game.phase), iset = await page.evaluate(() => window.__game.controls());
  ok(`${label}: Free Roam tap -> drivable at once with the default ◀ ▶ + GAS buttons`, iph === 'playing' && iset.setting === 'buttons' && iset.touchActive, `phase ${iph}, controls ${iset.setting}, touchActive ${iset.touchActive}`);
  await page.evaluate(() => window.__game.setControls('buttons', false)); // ◀ ▶ buttons + pedals (default wheel + pedals, tilt and halves are tested in drive-block / rework-block)
  const au = (await st(page)).audio.state;
  ok(`${label}: audio running after tap`, au === 'running', `state=${au}`);
  const vis = await page.locator('#pedals').isVisible();
  const btns = await page.locator('#sb-l, #sb-r, #pd-gas, #pd-brake').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { k: e.id, w: r.width, h: r.height, in: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; }));
  ok(`${label}: touch controls visible, >=48px, on-screen`, vis && btns.length === 4 && btns.every((b) => b.w >= 48 && b.h >= 48 && b.in), btns.map((b) => `${b.k}:${Math.round(b.w)}x${Math.round(b.h)}`).join(' '));
  // hold GAS + steer via pointer events (multi-touch: two pointer ids)
  const s0 = await st(page);
  await page.dispatchEvent('#pd-gas', 'pointerdown', { pointerId: 11, pointerType: 'touch', isPrimary: true, bubbles: true });
  // steer while still on the flat start area (from ~35 m out the route crosses bumps where the 4x4 can get airborne)
  await sleep(2000);
  await page.dispatchEvent('#sb-l', 'pointerdown', { pointerId: 12, pointerType: 'touch', bubbles: true });
  let air = 0;
  for (let k = 0; k < 6; k++) { await sleep(250); if ((await st(page)).wheels.every((w) => w === null)) air++; }
  await page.screenshot({ path: `${SHOTS}${label}-gameplay.png` });
  const s1 = await st(page);
  await page.dispatchEvent('#sb-l', 'pointerup', { pointerId: 12, pointerType: 'touch', bubbles: true });
  await page.dispatchEvent('#pd-gas', 'pointerup', { pointerId: 11, pointerType: 'touch', bubbles: true });
  const moved = Math.hypot(s1.x - s0.x, s1.z - s0.z);
  const dyaw = Math.atan2(Math.sin(s1.yaw - s0.yaw), Math.cos(s1.yaw - s0.yaw));
  ok(`${label}: touch GAS + steer drives and turns`, moved > 2 && Math.abs(dyaw) > 0.05, `moved ${moved.toFixed(2)} m, heading change ${(dyaw * 180 / Math.PI).toFixed(1)} deg, airborne samples ${air}/6`);
  if (label.includes('portrait')) {
    await page.evaluate(() => { window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.25, handbrake: false }); });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: SHOTS4 + 'mobile-portrait-390x844-gameplay-mud.png' });
    await page.evaluate(() => window.__game.setInput(null));
  }
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
// ---------------- Phase 4: particles, puddles, weather, camera, AA, FPS per preset ----------------
{
  const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase4');
  await page.click('#btn-play'); await page.waitForTimeout(500);
  await page.waitForFunction(() => window.__game.phase === 'playing');
  const drive = (i) => page.evaluate((i) => window.__game.setInput(i), i);
  const window_ = async (setup, ms) => {
    await page.evaluate(setup);
    const a = (await st(page)).particles.spawned;
    // wall-clock window, but never fewer than 20 rendered frames (the reworked scene renders fewer frames/s on SwiftShader)
    await page.evaluate(async (ms) => { const t0 = performance.now(); let n = 0; while (performance.now() - t0 < ms || n < 20) { await new Promise((r) => requestAnimationFrame(r)); n++; } }, ms);
    const b = await st(page);
    return { spawned: b.particles.spawned - a, active: b.particles, slip: b.slip.reduce((x, y) => x + y, 0) / 4, surface: b.surface, kmh: b.speed * 3.6 };
  };
  const G = { throttle: 1, brake: 0, steer: 0, handbrake: false };
  await drive(G);
  const pGround = await window_(() => window.__game.teleport(-32, 0, Math.PI / 2), 2500);
  const pMud = await window_(() => window.__game.teleport(-102, 40, Math.PI / 2), 2500);
  await page.screenshot({ path: SHOTS4 + 'desktop-mud-particles.png' });
  const pSand = await window_(() => window.__game.teleport(66, -55, Math.PI / 2), 2500);
  await page.screenshot({ path: SHOTS4 + 'desktop-sand-dust.png' });
  await drive(null);
  const fmt = (p) => `${p.spawned} spawned/2.5s, avg slip ${p.slip.toFixed(2)}, ${p.kmh.toFixed(0)} km/h on ${p.surface}`;
  console.log(`   ground: ${fmt(pGround)}\n   mud:    ${fmt(pMud)} (mud droplets active ${pMud.active.mud})\n   sand:   ${fmt(pSand)} (dust active ${pSand.active.dust})`);
  ok('particles: mud and sand emit more than dirt under full throttle', pMud.spawned > pGround.spawned * 2 && pSand.spawned > pGround.spawned * 2 && pMud.slip > pGround.slip && pSand.slip > pGround.slip,
    `dirt ${pGround.spawned} / mud ${pMud.spawned} / sand ${pSand.spawned}; slip dirt ${pGround.slip.toFixed(2)} / mud ${pMud.slip.toFixed(2)} / sand ${pSand.slip.toFixed(2)}`);
  // puddle drive-through
  const pud = await page.evaluate(() => window.__game.puddles.find((p) => p.x > -30));
  await page.evaluate((p) => { window.__game.teleport(p.x + 18, p.z, -Math.PI / 2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0, handbrake: false }); }, pud);
  let wet = false, splashMax = 0, minY = 99, k_ = 0;
  // physics is render-paced under software GL, so the budget is distance-based (car 30 m past the start = beyond the puddle), capped at 30 s wall-clock
  for (let k = 0; k < 200; k++) {
    await page.waitForTimeout(150);
    const s = await st(page); wet ||= s.puddle.some(Boolean); splashMax = Math.max(splashMax, s.particles.splash);
    if (s.puddle.some(Boolean)) minY = Math.min(minY, s.y);
    k_ = k; if (splashMax > 40) { await page.screenshot({ path: SHOTS4 + 'desktop-puddle-splash.png' }); break; }
    const ps = await page.evaluate(() => window.__game.pose()); if (Math.hypot(ps.x - pud.x - 18, ps.z - pud.z) > 30) break;
  }
  ok('puddles: vehicle drives through a deep puddle and it splashes', wet && splashMax > 0, `t=${(k_ * 0.15).toFixed(2)} s, wheels in water=${wet}, peak splash particles ${splashMax}, chassis y in puddle ${minY.toFixed(2)} vs water level ${pud.level.toFixed(2)}`);
  await drive(null);
  const tr = (await st(page)).tracks;
  ok('tracks: continuous ribbon segments laid', tr > 50, `${tr} ribbon segments`);

  // camera: speed-based FOV and obstacle avoidance
  await page.evaluate(() => window.__game.teleport(-32, 0, Math.PI / 2)); await page.waitForTimeout(1500);
  const fov0 = (await st(page)).camera.fov;
  await drive(G); // render-paced physics: wait (max 8 s wall clock) until the car is actually at speed
  for (let t = 0; t < 8000 && (await st(page)).speed < 15; t += 250) await page.waitForTimeout(250);
  await page.waitForTimeout(500); const fov1 = (await st(page)).camera.fov; await drive(null);
  ok('camera: FOV widens with speed', fov1 > fov0 + 3, `${fov0.toFixed(1)} deg at rest -> ${fov1.toFixed(1)} deg at speed`);
  const cam = await page.evaluate(async () => {
    const g = window.__game;
    // put the vehicle 3 m in front of a tree, facing away from it, so the normal camera spot is inside/behind the tree
    const t = g.trees.find((t) => Math.abs(g.heightAt(t.x, t.z) - g.heightAt(t.x + 3, t.z)) < 0.4 && Math.abs(t.x) < 100 && Math.abs(t.z) < 100);
    g.teleport(t.x + 3.2, t.z, Math.PI / 2);
    g.setInput({ throttle: 0, brake: 0, steer: 0, handbrake: true });
    await new Promise((r) => setTimeout(r, 2500));
    const s = g.state(); g.setInput(null);
    const dCar = Math.hypot(s.camera.x - s.x, s.camera.z - s.z);
    return { tree: t, dCar, camX: s.camera.x, treeX: t.x, aboveGround: s.camera.y - g.heightAt(s.camera.x, s.camera.z) };
  });
  ok('camera: pulled in front of an obstacle behind the vehicle (no clipping through tree)', cam.camX > cam.treeX + 0.3 && cam.dCar < 4, `camera ${cam.dCar.toFixed(2)} m behind car (normal 7.4 m), cam x ${cam.camX.toFixed(2)} vs tree x ${cam.treeX.toFixed(2)}, ${cam.aboveGround.toFixed(2)} m above ground`);

  // weather: quick toggle + every preset, screenshots + FPS
  const w0 = (await st(page)).weather;
  await page.click('#btn-weather'); await page.waitForTimeout(300);
  const w1 = (await st(page)).weather;
  await page.keyboard.press('KeyT'); await page.waitForTimeout(300);
  const w2 = (await st(page)).weather;
  ok('weather: HUD quick toggle and T key cycle presets', w0 !== w1 && w1 !== w2, `${w0} -> ${w1} -> ${w2}`);
  const spots = { clear: [-32, 0, 1.2], sunset: [60, -60, 1.6], fog: [-100, 30, 1.2], rain: [-100, 30, 1.2], night: [-100, 30, 1.2] };
  const wfps = {};
  for (const w of ['clear', 'sunset', 'fog', 'rain', 'night']) {
    const e0 = errors.length;
    await page.keyboard.press('Escape'); await page.click('#btn-settings2');
    await page.click(`#seg-weather button[data-v="${w}"]`); await page.click('#btn-close-drawer'); await page.waitForFunction(() => window.__game.phase === 'playing'); /* closing Settings opened from Pause resumes play */
    const [x, z, yaw] = spots[w];
    await page.evaluate(([x, z, yaw]) => { window.__game.teleport(x, z, yaw); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.2, handbrake: false }); }, [x, z, yaw]);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${SHOTS4}desktop-weather-${w}.png` });
    wfps[w] = await fpsSample(page, 3000);
    const s = await st(page);
    ok(`weather: ${w} loads without console errors`, s.weather === w && errors.length === e0, `${wfps[w].toFixed(1)} fps (High)${errors.length > e0 ? ' errors: ' + errors.slice(e0).join(' | ') : ''}`);
  }
  await drive(null);

  // graphics presets: AA switches without reload, FPS per preset (clear weather)
  await page.evaluate(() => window.__game.setWeather('clear'));
  const pf = {}, aa = {};
  for (const p of ['low', 'medium', 'high']) {
    const e0 = errors.length;
    await page.keyboard.press('Escape'); await page.click('#btn-settings2');
    await page.click(`#seg-preset button[data-v="${p}"]`); await page.click('#btn-close-drawer'); await page.waitForFunction(() => window.__game.phase === 'playing'); /* closing Settings opened from Pause resumes play */
    await page.evaluate(() => { window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.2, handbrake: false }); });
    await page.waitForTimeout(1500);
    const f0 = (await st(page)).renderer.frame;
    pf[p] = await fpsSample(page, 4000);
    const s = await st(page);
    aa[p] = s.aa;
    ok(`preset ${p}: renders after switch, AA=${s.aa}`, s.renderer.frame > f0 && s.aa === (p !== 'low') && errors.length === e0, `${pf[p].toFixed(1)} fps, ${s.renderer.calls} draw calls, ${s.renderer.triangles} tris, particles ${JSON.stringify(s.particles)}`);
  }
  await drive(null);
  const reloads = await page.evaluate(() => performance.getEntriesByType('navigation').length);
  ok('AA toggled without page reload', reloads === 1 && aa.low === false && aa.high === true, `navigations=${reloads}`);
  const boot = await page.evaluate(() => window.__boot);
  console.log(`   boot timing: entry->game+rapier downloaded ${(boot.downloaded - boot.t0).toFixed(0)} ms, ready ${(boot.ready - boot.t0).toFixed(0)} ms`);
  ok('phase4: no console errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  fs.writeFileSync(SHOTS4 + 'fps.json', JSON.stringify({ note: 'headless Chrome + SwiftShader (CPU software GL); not representative of real GPUs', weatherHigh: wfps, presetsClearMud: pf }, null, 2));
  await ctx.close();
}
// ---------------- Phase 5: garage, vehicle roster, tuning, persistence, night visibility ----------------
{
  const SHOTS5 = SHOTS + 'phase5/'; fs.mkdirSync(SHOTS5, { recursive: true });
  // Phase 6 adjustment: vehicles/paints are now unlocked by progression, so the Phase 5 roster/garage checks run with the dev override (?dev=1)
  const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase5', '?dev=1');
  // Physics per vehicle (deterministic fixed-step simulate, independent of render FPS)
  const rows = await page.evaluate(() => {
    const g = window.__game, out = [];
    const I = (t, b, s, h) => ({ throttle: t, brake: b, steer: s, handbrake: h });
    const z = g.zones;
    for (const id of g.vehicles) {
      g.setVehicle(id);
      const r = { id, name: g.vehicle.name };
      // spawn + settle at the real spawn point
      g.teleport(0, -8, Math.atan2(z.sand.x, z.sand.z + 8)); g.simulate(I(0, 0, 0, true), 2);
      let s = g.state(); r.spawnUp = s.up; r.spawnClear = s.y - g.heightAt(s.x, s.z);
      // scripted drive: full throttle over the rolling ground toward the dunes (bumps), then a hard turn
      let minUp = 1, air = 0, n = 0, maxDist = 0; const p0 = { x: s.x, z: s.z };
      for (let k = 0; k < 60; k++) { g.simulate(I(1, 0, 0, false), 0.1); s = g.state(); minUp = Math.min(minUp, s.up); n++; if (s.wheels.filter(Boolean).length < 2) air++; }
      const yawA = g.state().yaw;
      for (let k = 0; k < 25; k++) { g.simulate(I(0.7, 0, 0.8, false), 0.1); s = g.state(); minUp = Math.min(minUp, s.up); n++; if (s.wheels.filter(Boolean).length < 2) air++; }
      g.simulate(I(0, 0.6, 0, false), 1.5); s = g.state();
      let dy = s.yaw - yawA; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      r.driveDist = Math.hypot(s.x - p0.x, s.z - p0.z); r.driveMinUp = minUp; r.driveFinalUp = s.up; r.driveAirPct = 100 * air / n; r.driveTurnDeg = Math.abs(dy * 180 / Math.PI); r.driveSurfaceEnd = s.surface;
      // 0-60 km/h
      g.teleport(-32, 0, Math.PI / 2); g.simulate(I(0, 0, 0, true), 1);
      let t = 0; r.t60 = null; while (t < 10) { g.simulate(I(1, 0, 0, false), 0.05); t += 0.05; if (g.state().speed >= 16.667) { r.t60 = +t.toFixed(2); break; } }
      // top speed reached in 7 s on the flat proving-ground strip
      g.teleport(-100, 100, Math.PI / 2); g.simulate(I(0, 0, 0, true), 1);
      let vmax = 0; for (let k = 0; k < 70; k++) { g.simulate(I(1, 0, 0, false), 0.1); vmax = Math.max(vmax, g.state().speed); }
      r.top7 = vmax * 3.6;
      // turning rate at 50 km/h (full steer, part throttle, 1.5 s)
      g.teleport(-32, 0, Math.PI / 2); g.simulate(I(0, 0, 0, true), 1);
      for (let k = 0; k < 200 && g.state().speed < 13.9; k++) g.simulate(I(1, 0, 0, false), 0.05);
      const y0 = g.state().yaw; r.turnV = g.state().speed * 3.6; let tu = 1;
      for (let k = 0; k < 15; k++) { g.simulate(I(0.4, 0, 1, false), 0.1); tu = Math.min(tu, g.state().up); }
      let d = g.state().yaw - y0; d = Math.atan2(Math.sin(d), Math.cos(d));
      r.turnRate = Math.abs(d * 180 / Math.PI / 1.5); r.turnMinUp = tu;
      // mud basin: settle, then full throttle 3 s (Phase 3 protocol)
      g.teleport(-102, 40, Math.PI / 2); g.simulate(I(0, 1, 0, true), 1.5);
      r.mud3 = g.simulate(I(1, 0, 0, false), 3).finalSpeed * 3.6;
      out.push(r);
    }
    return out;
  });
  for (const r of rows) {
    ok(`vehicle ${r.id}: spawns upright`, r.spawnUp > 0.98 && r.spawnClear > 0.4 && r.spawnClear < 2.2, `up ${r.spawnUp.toFixed(3)}, body ${r.spawnClear.toFixed(2)} m above ground`);
    ok(`vehicle ${r.id}: stays upright through scripted drive (bumps + turn)`, r.driveMinUp > 0.6 && r.driveFinalUp > 0.95 && r.driveDist > 40 && r.driveTurnDeg > 30,
      `${r.driveDist.toFixed(0)} m, turned ${r.driveTurnDeg.toFixed(0)}°, min up ${r.driveMinUp.toFixed(2)}, final up ${r.driveFinalUp.toFixed(2)}, airborne ${r.driveAirPct.toFixed(0)}% of samples, ended on ${r.driveSurfaceEnd}`);
    console.log(`   ${r.id.padEnd(9)} 0-60 ${r.t60}s | top in 7s ${r.top7.toFixed(1)} km/h | turn ${r.turnRate.toFixed(1)} deg/s @${r.turnV.toFixed(0)} km/h | mud 3s ${r.mud3.toFixed(1)} km/h`);
  }
  const spread = (k) => { const v = rows.map((r) => r[k]); return { min: Math.min(...v), max: Math.max(...v) }; };
  const s60 = spread('t60'), sTop = spread('top7'), sTurn = spread('turnRate'), sMud = spread('mud3');
  const distinct = (k, eps) => rows.every((a, i) => rows.every((b, j) => i === j || ['t60', 'top7', 'turnRate', 'mud3'].some((kk) => Math.abs(a[kk] - b[kk]) > ({ t60: 0.15, top7: 2, turnRate: 1, mud3: 1 })[kk])));
  ok('vehicles: performance differs (0-60, top speed, turn rate, mud)', s60.max / s60.min > 1.8 && sTop.max - sTop.min > 30 && sTurn.max - sTurn.min > 10 && sMud.max - sMud.min > 8 && distinct(),
    `0-60 ${s60.min}-${s60.max}s, top ${sTop.min.toFixed(0)}-${sTop.max.toFixed(0)} km/h, turn ${sTurn.min.toFixed(1)}-${sTurn.max.toFixed(1)} deg/s, mud ${sMud.min.toFixed(1)}-${sMud.max.toFixed(1)} km/h; every pair differs`);
  const R = Object.fromEntries(rows.map((r) => [r.id, r]));
  const HEAVY = ['recovery', 'cargo6', 'mrap']; // 0.7.2: the heavy military trucks are as slow as the recovery truck
  ok('vehicles: character matches class', R.rally.t60 === s60.min && R.rally.top7 === sTop.max && R.rally.mud3 === sMud.min && HEAVY.some((h) => R[h]?.top7 === sTop.min) && HEAVY.some((h) => R[h]?.t60 === s60.max),
    'rally quickest/fastest but worst in mud; a heavy truck (recovery / 6x6 / MRAP) slowest');
  // Steering lightening at speed (Scout): baseline vs Phase 5
  const steer = await page.evaluate(() => {
    const g = window.__game; g.setVehicle('scout');
    const sp = g.spec, keep = { sh: sp.steerHigh, as: sp.assist };
    const run = (v) => { g.teleport(-100, 100, Math.PI / 2); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 1);
      for (let k = 0; k < 300 && g.state().speed < v; k++) g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 0.05);
      const y0 = g.state().yaw; let mu = 1, mw = 4; for (let k = 0; k < 10; k++) { g.simulate({ throttle: 0.5, brake: 0, steer: 1, handbrake: false }, 0.1); const s = g.state(); mu = Math.min(mu, s.up); mw = Math.min(mw, s.wheels.filter(Boolean).length); }
      let d = g.state().yaw - y0; d = Math.atan2(Math.sin(d), Math.cos(d)); return { rate: Math.abs(d * 180 / Math.PI), minUp: mu, minWheels: mw }; };
    const out = {};
    sp.steerHigh = 0.18; sp.assist = 0; out.before = [run(13.9), run(22.2)];
    sp.steerHigh = keep.sh; sp.assist = keep.as; out.after = [run(13.9), run(22.2)];
    return out;
  });
  ok('steering lighter at speed without losing stability', steer.after[1].rate > steer.before[1].rate * 1.12 && steer.after.every((x) => x.minUp > 0.95 && x.minWheels >= 3),
    `Scout full-lock yaw @50/@80 km/h: before ${steer.before.map((x) => x.rate.toFixed(1)).join('/')} -> after ${steer.after.map((x) => x.rate.toFixed(1)).join('/')} deg/s; min up ${steer.after.map((x) => x.minUp.toFixed(2)).join('/')}, min wheels ${steer.after.map((x) => x.minWheels).join('/')}`);
  await page.evaluate(() => window.__game.setVehicle('scout'));

  // Garage UI: per-vehicle desktop screenshots + coverage
  await page.click('#btn-garage'); await page.waitForFunction(() => window.__game.phase === 'garage'); await page.waitForTimeout(800);
  const gDesk = await area(page, '#garage');
  ok('garage desktop: panel leaves the showcase visible', gDesk > 0.15 && gDesk < 0.5, `panel covers ${(gDesk * 100).toFixed(0)}% of 1280x720`);
  const ids = await page.evaluate(() => window.__game.vehicles);
  const seen = [];
  for (let i = 0; i < ids.length; i++) {
    const v = await page.evaluate(() => window.__game.vehicle);
    seen.push(v.id);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${SHOTS5}garage-desktop-${i + 1}-${v.id}.png` });
    await page.click('#g-next'); await page.waitForTimeout(300);
  }
  ok('garage: cycles through all vehicles', new Set(seen).size === ids.length && ids.length >= 5, seen.join(', '));
  // choose Pickup in Rescue Red via the UI, then reload
  while ((await page.evaluate(() => window.__game.vehicle.id)) !== 'pickup') await page.click('#g-next');
  await page.click('#g-colors button[title="Rescue Red"]'); await page.waitForTimeout(300);
  const chosen = await page.evaluate(() => window.__game.vehicle);
  await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 });
  await page.evaluate(() => window.__game.skipOpening()); await page.waitForTimeout(1200); // opening cinematic has its own check (drive-block)
  const after = await page.evaluate(() => ({ v: window.__game.vehicle, label: document.getElementById('menu-vehicle').textContent }));
  await page.click('#btn-play'); await page.waitForFunction(() => window.__game.phase === 'playing');
  const inPlay = await page.evaluate(() => window.__game.vehicle);
  ok('garage: selection + colour persist across reload and are used in Free Roam', chosen.id === 'pickup' && chosen.paint === 0xb3261e && after.v.id === 'pickup' && after.v.paint === 0xb3261e && inPlay.id === 'pickup' && inPlay.paint === 0xb3261e,
    `chosen ${chosen.id}/#${chosen.paint.toString(16)}, after reload ${after.v.id}/#${after.v.paint.toString(16)} (menu shows "${after.label}"), in play ${inPlay.id}`);

  // Night visibility: fill/rim light on vs off (default Scout in its default tan, comparable to Phase 4 shots)
  await page.evaluate(() => { window.__game.setInput(null); window.__game.setVehicle('scout'); window.__game.setWeather('night'); window.__game.teleport(-32, 0, Math.PI / 2); });
  await page.waitForTimeout(1800);
  const offL = await page.evaluate(() => { window.__game.setFill(false); return window.__game.carLuma(0.04); });
  await page.screenshot({ path: SHOTS5 + 'night-before-fill-off.png' });
  const onL = await page.evaluate(() => { window.__game.setFill(true); return window.__game.carLuma(0.04); });
  await page.screenshot({ path: SHOTS5 + 'night-after-fill-on.png' });
  const clr = await page.evaluate(() => { window.__game.setWeather('clear'); window.__game.setFill(false); const a = window.__game.carLuma(0.04); window.__game.setFill(true); return [a, window.__game.carLuma(0.04)]; });
  ok('night: car body visibility improved by fill/rim light', onL - offL > 20 && onL > offL * 1.4 && Math.abs(clr[0] - clr[1]) < 2,
    `mean luma around car (0-255): night ${offL.toFixed(1)} -> ${onL.toFixed(1)}; clear ${clr[0].toFixed(1)} vs ${clr[1].toFixed(1)} (fill disabled in daylight)`);
  await page.evaluate(() => { window.__game.setWeather('night'); window.__game.teleport(-60, 20, 0.6); window.__game.setInput({ throttle: 0.8, brake: 0, steer: 0.15, handbrake: false }); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SHOTS5 + 'night-gameplay.png' });
  await page.evaluate(() => { window.__game.setInput(null); window.__game.setWeather('clear'); });
  ok('phase5 desktop: no console errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  fs.writeFileSync(SHOTS5 + 'vehicles.json', JSON.stringify({ rows, steer, nightLuma: { off: offL, on: onL } }, null, 2));
  await ctx.close();

  // Garage layout coverage: portrait + landscape phones
  for (const [label, vp] of [['portrait', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }]]) {
    const o = await openPage({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, 'garage-' + label);
    await o.page.tap('#btn-garage'); await o.page.waitForFunction(() => window.__game.phase === 'garage'); await o.page.waitForTimeout(1000);
    const a = await area(o.page, '#garage');
    const fits = await o.page.evaluate(() => { const ids = ['g-prev', 'g-next', 'g-drive', 'g-back']; return ids.every((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1; }); });
    await o.page.screenshot({ path: `${SHOTS5}garage-${label}.png` });
    await o.page.tap('#g-next'); await o.page.waitForTimeout(300);
    const v = await o.page.evaluate(() => window.__game.vehicle.id);
    ok(`garage ${label}: panel sized, controls reachable`, a > 0.2 && a < 0.62 && fits && v !== 'scout', `panel covers ${(a * 100).toFixed(0)}% of ${vp.width}x${vp.height}; buttons on-screen ${fits}; tap next -> ${v}`);
    ok(`garage ${label}: no console errors`, o.errors.length === 0, o.errors.slice(0, 5).join(' | '));
    await o.ctx.close();
  }
}
// ---------------- Phase 5b: detailed vehicle models (LOD, budgets, animated wheels/suspension, paint scope) ----------------
{
  const SH = SHOTS + 'phase5b/'; fs.mkdirSync(SH, { recursive: true });
  const BUDGET = { high: { draws: 32, tris: 35000 }, low: { draws: 24, tris: 6000 } };
  const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase5b');
  const ids = await page.evaluate(() => window.__game.vehicles);
  // garage shots at the fixed Phase-5 comparison angle (garage orbit time 1.0 s), High preset
  await page.click('#btn-garage'); await page.evaluate(() => window.__game.garageHold(1.0));
  const hi = {};
  for (let i = 0; i < ids.length; i++) {
    await page.waitForTimeout(1200);
    hi[ids[i]] = await page.evaluate(() => { const s = window.__game.carStats(); return { draws: s.draws, tris: s.tris, lod: window.__game.vehicle.lod }; });
    await page.screenshot({ path: `${SH}garage-desktop-${i + 1}-${ids[i]}.png` });
    await page.click('#g-next');
  }
  // wheel close-ups (Scout, Sahara front-left wheel); garage panel hidden so the label can't mismatch the hook-selected car
  await page.evaluate(() => { document.getElementById('garage').style.visibility = 'hidden'; });
  await page.evaluate(() => { window.__game.setVehicle('scout'); window.__game.camOverride([[2.3, -0.25, 2.5], [0.95, -0.55, 1.42]]); });
  await page.waitForTimeout(1500); await page.screenshot({ path: SH + 'wheel-closeup-scout.png' });
  await page.evaluate(() => { window.__game.setVehicle('sahara'); window.__game.camOverride([[2.4, -0.25, 2.6], [1.0, -0.6, 1.55]]); });
  await page.waitForTimeout(1500); await page.screenshot({ path: SH + 'wheel-closeup-sahara.png' });
  await page.evaluate(() => { window.__game.camOverride(null); window.__game.garageHold(null); window.__game.setVehicle('scout'); document.getElementById('garage').style.visibility = ''; });
  // paint applies to body panels only
  const paintChk = await page.evaluate(() => {
    const g = window.__game, before = g.carStats().parts; g.setPaint(0x00ff00); const after = g.carStats().parts; g.setPaint(0xb8823a);
    const changed = after.filter((p, i) => p.color !== before[i].color);
    const paintParts = after.filter((p) => p.mat === 'paint');
    const tyre = after.find((p) => p.name === 'wheel:tyre'), rim = after.find((p) => p.name === 'wheel:rim'), glass = after.find((p) => p.mat === 'glass');
    return { changed: changed.map((p) => p.name + '/' + p.mat), paintParts: paintParts.map((p) => p.name), paintTris: paintParts.reduce((a, p) => a + p.tris, 0), others: after.length - paintParts.length,
      wheelsUnpainted: tyre.mat === 'rubber' && rim.mat === 'alloy' && glass.color !== 0x00ff00 };
  });
  ok('paint colour applies to body panels only', paintChk.changed.length > 0 && paintChk.changed.every((n) => n.endsWith('/paint')) && paintChk.paintParts.every((n) => n === 'static:paint') && paintChk.wheelsUnpainted,
    `changed: ${paintChk.changed.join(', ')} (${paintChk.paintTris} tris); ${paintChk.others} other meshes (tyres, rims, glass, trim, lamps, suspension) unchanged`);
  await page.click('#g-back');
  // wheel + suspension animation over bumps (deterministic simulate)
  const anim = await page.evaluate(() => {
    const g = window.__game, z = g.zones, out = {};
    for (const id of g.vehicles) {
      g.setVehicle(id); g.teleport(0, -8, Math.atan2(z.sand.x, z.sand.z + 8)); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 1.5);
      const S = [];
      for (let k = 0; k < 40; k++) { g.simulate({ throttle: 1, brake: 0, steer: k > 20 ? 0.8 : 0, handbrake: false }, 0.1); S.push(g.suspSample()); }
      const rng = (f) => { const v = S.map(f); return Math.max(...v) - Math.min(...v); };
      out[id] = {
        hubTravel: Math.max(...[0, 1, 2, 3].map((i) => rng((s) => s.hubs[i][1]))),
        spin: rng((s) => s.hubs[0][4]) > 0 || S.some((s, k) => k && s.hubs[0][4] !== S[k - 1].hubs[0][4]),
        steerFront: rng((s) => s.hubs[0][3]), steerRear: rng((s) => s.hubs[2][3]),
        damperStretch: rng((s) => s.inst[0][3]), linkMove: Math.max(...S[0].inst.map((_, j) => rng((s) => s.inst[j][1] + s.inst[j][4]))),
        instances: S[0].inst.length,
      };
    }
    g.setVehicle('scout'); return out;
  });
  for (const id of ids) {
    const a = anim[id];
    ok(`model ${id}: wheels spin/steer and suspension parts animate`, a.hubTravel > 0.02 && a.spin && a.steerFront > 0.1 && a.steerRear === 0 && a.damperStretch > 0.02 && a.linkMove > 0.01,
      `hub travel ${(a.hubTravel * 100).toFixed(1)} cm, front steer range ${a.steerFront.toFixed(2)} rad, damper length range ${(a.damperStretch * 100).toFixed(1)} cm, axle/arm motion ${(a.linkMove * 100).toFixed(1)} cm, ${a.instances} instanced parts; High: ${hi[id].draws} draws / ${hi[id].tris} tris`);
  }
  // Low preset LOD: switch via settings UI (live), physics untouched
  await page.click('#btn-play'); await page.waitForFunction(() => window.__game.phase === 'playing');
  const p0 = await st(page);
  await page.click('#btn-pause'); await page.click('#btn-settings2'); await page.click('#seg-preset button[data-v="low"]'); await page.click('#btn-close-drawer'); await page.waitForFunction(() => window.__game.phase === 'playing'); /* closing Settings opened from Pause resumes play */
  await page.waitForTimeout(600);
  const low = {}; let lodOk = true;
  for (const id of ids) {
    low[id] = await page.evaluate((id) => { window.__game.setVehicle(id); const s = window.__game.carStats(); return { draws: s.draws, tris: s.tris, lod: window.__game.vehicle.lod }; }, id);
    lodOk = lodOk && low[id].lod === 0;
  }
  for (const id of ids) ok(`model ${id}: draw-call / triangle budgets (High ≤${BUDGET.high.draws}/${BUDGET.high.tris}, Low ≤${BUDGET.low.draws}/${BUDGET.low.tris})`,
    hi[id].lod === 1 && low[id].lod === 0 && hi[id].draws <= BUDGET.high.draws && hi[id].tris <= BUDGET.high.tris && low[id].draws <= BUDGET.low.draws && low[id].tris <= BUDGET.low.tris,
    `High/Medium: ${hi[id].draws} draws, ${hi[id].tris} tris; Low: ${low[id].draws} draws, ${low[id].tris} tris`);
  ok('Low preset swaps to simplified model live (no reload)', lodOk && (await page.evaluate(() => performance.getEntriesByType('navigation').length)) === 1, `lod=0 for all six after switching preset; scout at switch time y=${p0.y.toFixed(2)}`);
  await page.click('#btn-pause'); await page.click('#btn-settings2'); await page.click('#seg-preset button[data-v="high"]'); await page.click('#btn-close-drawer'); await page.waitForFunction(() => window.__game.phase === 'playing'); /* closing Settings opened from Pause resumes play */
  await page.evaluate(() => window.__game.setVehicle('scout'));
  // mud build-up + gameplay shots
  await page.evaluate(() => { window.__game.setDirt(0); window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.25, handbrake: false }); });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__game.simulate({ throttle: 1, brake: 0, steer: 0.25, handbrake: false }, 6));
  const dirt = await page.evaluate(() => window.__game.vehicle.dirt);
  await page.evaluate(() => { window.__game.teleport(-98, 36, 1.45); window.__game.setInput({ throttle: 0.7, brake: 0, steer: 0.1, handbrake: false }); });
  await page.waitForTimeout(2600);
  const mudShot = await st(page);
  await page.screenshot({ path: SH + 'gameplay-mud.png' });
  console.log(`   mud screenshot: surface ${mudShot.surface}, ${(mudShot.speed * 3.6).toFixed(0)} km/h`);
  ok('mud builds up on the body in the mud basin (cosmetic)', dirt > 0.2, `dirt level ${dirt.toFixed(2)} after ~6 s in mud`);
  await page.evaluate(() => { window.__game.setInput(null); window.__game.setDirt(0); window.__game.setWeather('night'); window.__game.teleport(-60, 20, 0.6); window.__game.setInput({ throttle: 0.8, brake: 0, steer: 0.15, handbrake: false }); });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SH + 'gameplay-night.png' });
  await page.evaluate(() => { window.__game.setInput(null); window.__game.setWeather('clear'); });
  ok('phase5b desktop: no console errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  fs.writeFileSync(SH + 'model-stats.json', JSON.stringify({ high: hi, low, anim, budget: BUDGET }, null, 2));
  await ctx.close();
  // portrait garage
  const o = await openPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, 'phase5b-portrait');
  await o.page.tap('#btn-garage'); await o.page.evaluate(() => window.__game.garageHold(1.0)); await o.page.waitForTimeout(1500);
  await o.page.screenshot({ path: SH + 'garage-portrait.png' });
  const pv = await o.page.evaluate(() => ({ v: window.__game.vehicle, s: window.__game.carStats() }));
  ok('phase5b portrait: garage renders detailed model (Medium preset on touch)', pv.v.lod === 1 && o.errors.length === 0, `${pv.v.id}: ${pv.s.draws} draws, ${pv.s.tris} tris; errors ${o.errors.length}`);
  await o.ctx.close();
}
// ---------------- Phase 6: missions, results, progression, upgrades, save migration ----------------
await runPhase6({ openPage, ok, area });
await runPhase6b({ openPage, ok, area });
await runRework({ openPage, ok, area });
console.log('\n== Drive controls: cockpit wheel + pedals, transmission, transfer case, opening ==');
await runDrive({ openPage, ok });
await runLayout({ openPage, ok });
await browser.close();
const failed = results.filter((r) => !r.pass);
fs.writeFileSync(new URL('../screenshots/test-results.json', import.meta.url), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
