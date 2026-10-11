// Acceptance tests for Phases 1-3. Run against `npm run preview` (http://127.0.0.1:4173).
import { chromium } from 'playwright';
import fs from 'node:fs';

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
  const a0 = (await st(page)).audio.state;
  ok('audio: no AudioContext before any user gesture', a0 === 'none', `state=${a0}`);
  const menuA = await area(page, '#menu');
  ok('desktop: menu panel does not cover whole game', menuA < 0.6, `covers ${(menuA * 100).toFixed(0)}% of viewport`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-menu.png' });
  await page.click('#btn-settings'); await page.waitForTimeout(500);
  const a1 = (await st(page)).audio.state;
  ok('audio: AudioContext created and running after first click', a1 === 'running', `state=${a1}`);
  const drA = await area(page, '#drawer');
  ok('desktop: settings drawer partial', drA < 0.6, `covers ${(drA * 100).toFixed(0)}%`);
  await page.click('#seg-preset button[data-v="medium"]');
  const preset = (await st(page)).preset;
  ok('desktop: graphics preset switch works', preset === 'medium', `preset=${preset}`);
  await page.screenshot({ path: SHOTS + 'desktop-1280x720-settings.png' });
  await page.click('#seg-preset button[data-v="high"]');
  await page.click('#btn-close-drawer'); await page.waitForTimeout(400);

  await page.click('#btn-play'); await page.waitForTimeout(1200);
  const ph0 = await page.evaluate(() => window.__game.phase);
  await page.screenshot({ path: SHOTS4 + 'desktop-intro-flyover.png' });
  const tSkip = Date.now();
  await page.click('#btn-skip');
  await page.waitForFunction(() => window.__game.phase === 'playing', null, { timeout: 3000 });
  ok('intro: Play starts the intro and Skip ends it', ph0 === 'intro', `phase after Play=${ph0}, skip->playing in ${Date.now() - tSkip} ms`);
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
  await page.tap('#btn-play'); await page.waitForTimeout(900);
  const iph = await page.evaluate(() => window.__game.phase);
  await page.tap('#btn-skip'); await page.waitForTimeout(300);
  const iph2 = await page.evaluate(() => window.__game.phase);
  ok(`${label}: intro plays and tap on Skip ends it`, iph === 'intro' && iph2 === 'playing', `${iph} -> ${iph2}`);
  const au = (await st(page)).audio.state;
  ok(`${label}: audio running after tap`, au === 'running', `state=${au}`);
  const vis = await page.locator('#touch').isVisible();
  const btns = await page.locator('#touch .tbtn').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { k: e.dataset.k, w: r.width, h: r.height, in: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; }));
  ok(`${label}: touch controls visible, >=48px, on-screen`, vis && btns.length === 5 && btns.every((b) => b.w >= 48 && b.h >= 48 && b.in), btns.map((b) => `${b.k}:${Math.round(b.w)}x${Math.round(b.h)}`).join(' '));
  // hold GAS + steer via pointer events (multi-touch: two pointer ids)
  const s0 = await st(page);
  await page.dispatchEvent('#touch .gas', 'pointerdown', { pointerId: 11, pointerType: 'touch', isPrimary: true, bubbles: true });
  // steer while still on the flat start area (from ~35 m out the route crosses bumps where the 4x4 can get airborne)
  await sleep(2000);
  await page.dispatchEvent('#touch [data-k="left"]', 'pointerdown', { pointerId: 12, pointerType: 'touch', bubbles: true });
  let air = 0;
  for (let k = 0; k < 6; k++) { await sleep(250); if ((await st(page)).wheels.every((w) => w === null)) air++; }
  await page.screenshot({ path: `${SHOTS}${label}-gameplay.png` });
  const s1 = await st(page);
  await page.dispatchEvent('#touch [data-k="left"]', 'pointerup', { pointerId: 12, pointerType: 'touch', bubbles: true });
  await page.dispatchEvent('#touch .gas', 'pointerup', { pointerId: 11, pointerType: 'touch', bubbles: true });
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
  await page.click('#btn-play'); await page.waitForTimeout(500); await page.click('#btn-skip');
  await page.waitForFunction(() => window.__game.phase === 'playing');
  const drive = (i) => page.evaluate((i) => window.__game.setInput(i), i);
  const window_ = async (setup, ms) => {
    await page.evaluate(setup);
    const a = (await st(page)).particles.spawned; await page.waitForTimeout(ms); const b = await st(page);
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
  let wet = false, splashMax = 0, minY = 99;
  for (let k = 0; k < 30; k++) {
    await page.waitForTimeout(150);
    const s = await st(page); wet ||= s.puddle.some(Boolean); splashMax = Math.max(splashMax, s.particles.splash);
    if (s.puddle.some(Boolean)) minY = Math.min(minY, s.y);
    if (splashMax > 40) { await page.screenshot({ path: SHOTS4 + 'desktop-puddle-splash.png' }); break; }
  }
  ok('puddles: vehicle drives through a deep puddle and it splashes', wet && splashMax > 0, `wheels in water=${wet}, peak splash particles ${splashMax}, chassis y in puddle ${minY.toFixed(2)} vs water level ${pud.level.toFixed(2)}`);
  await drive(null);
  const tr = (await st(page)).tracks;
  ok('tracks: continuous ribbon segments laid', tr > 50, `${tr} ribbon segments`);

  // camera: speed-based FOV and obstacle avoidance
  await page.evaluate(() => window.__game.teleport(-32, 0, Math.PI / 2)); await page.waitForTimeout(1500);
  const fov0 = (await st(page)).camera.fov;
  await drive(G); await page.waitForTimeout(3000); const fov1 = (await st(page)).camera.fov; await drive(null);
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
    await page.click(`#seg-weather button[data-v="${w}"]`); await page.click('#btn-close-drawer'); await page.click('#btn-resume');
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
    await page.click(`#seg-preset button[data-v="${p}"]`); await page.click('#btn-close-drawer'); await page.click('#btn-resume');
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
await browser.close();
const failed = results.filter((r) => !r.pass);
fs.writeFileSync(new URL('../screenshots/test-results.json', import.meta.url), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
