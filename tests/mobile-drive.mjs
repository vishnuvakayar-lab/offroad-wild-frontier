// Mobile driving check with REAL hit-testing and native TouchEvents (touchstart/touchend with per-finger identifiers),
// in Playwright WebKit (iPhone 13 profile) + Chromium (iPhone 13 profile) + Chromium desktop (keyboard).
// Emulation only — NOT a real iPhone. Usage: URL=... node tests/mobile-drive.mjs [webkit|chromium|desktop ...]
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const OUT = new URL('../screenshots/rework/mobile-drive/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
// primary: the user's phone (iPhone 13 Pro Max, Safari) in WebKit, portrait + landscape; secondary: Chromium Pro Max / iPhone 13, desktop
const ALL = ['webkit:iPhone 13 Pro Max', 'webkit:iPhone 13 Pro Max landscape', 'chromium:iPhone 13 Pro Max', 'chromium:iPhone 13 Pro Max landscape', 'chromium:iPhone 13', 'desktop'];
const which = process.argv.slice(2).length ? process.argv.slice(2) : ALL;
const tag = process.env.TAG || 'local';
const results = []; const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`); };
const CH = { executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
const metrics = {};

const center = (page, sel) => page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel);
/** finger down/up at a screen point: the target is whatever is really on top there (overlays included) */
const touchInit = (page) => page.evaluate(() => {
  const act = new Map();
  // Chromium: real Touch/TouchEvent constructors. Desktop WebKit (Playwright) has no Touch constructor ("Illegal constructor"),
  // so there the event is an Event of the same type carrying the same touches/changedTouches/targetTouches lists.
  let native = true; try { new Touch({ identifier: 0, target: document.body }); } catch { native = false; }
  window.__touchNative = native;
  const mk = (id, tgt, x, y) => native ? new Touch({ identifier: id, target: tgt, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y, radiusX: 10, radiusY: 10, force: 1 }) : { identifier: id, target: tgt, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y };
  const fire = (type, t, tgt) => { const all = [...act.values()].map((a) => a.t); const tt = all.filter((x) => x.target === tgt);
    if (native) return tgt.dispatchEvent(new TouchEvent(type, { touches: all, targetTouches: tt, changedTouches: [t], bubbles: true, cancelable: true, composed: true }));
    const e = new Event(type, { bubbles: true, cancelable: true, composed: true });
    Object.defineProperties(e, { touches: { value: all }, targetTouches: { value: tt }, changedTouches: { value: [t] } });
    return tgt.dispatchEvent(e); };
  window.__touch = {
    down(id, x, y) { const tgt = document.elementFromPoint(x, y); const t = mk(id, tgt, x, y); act.set(id, { t, tgt }); fire('touchstart', t, tgt); return tgt.id || tgt.tagName; },
    up(id) { const a = act.get(id); if (!a) return; act.delete(id); fire('touchend', a.t, a.tgt); },
  };
});
const down = async (page, id, sel) => { const [x, y] = await center(page, sel); return page.evaluate(([id, x, y]) => window.__touch.down(id, x, y), [id, x, y]); };
const up = (page, id) => page.evaluate((id) => window.__touch.up(id), id);
const pose = (page) => page.evaluate(() => window.__game.pose());
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const frames = (page, n) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);
/** hold for at least ms wall-clock AND n rendered frames (physics is render-paced under software GL) */
const hold = async (page, ms, n = 20) => { const t0 = Date.now(); await frames(page, n); const left = ms - (Date.now() - t0); if (left > 0) await page.waitForTimeout(left); };

for (const spec of which) {
  const desk = spec === 'desktop'; const [w, dev] = desk ? ['desktop', null] : spec.split(':');
  const browser = w === 'webkit' ? await webkit.launch() : await chromium.launch(CH);
  const ctx = await browser.newContext(desk ? { viewport: { width: 1280, height: 720 } } : { ...devices[dev] });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const L = `${tag} ${w}${desk ? '' : ' ' + dev}`; const fileTag = `${tag}-${spec.replace(/[^a-z0-9]+/gi, '-')}`; const m = {};
  await page.goto(APP); await page.waitForFunction(() => ['menu', 'opening'].includes(window.__game?.phase), null, { timeout: 180000 });
  m.build = (await page.textContent('body')).match(/Build [0-9.]+/)?.[0];
  m.js = await page.evaluate(() => [...document.scripts].map((s) => s.src.split('/').pop()).join(','));
  // skip the opening with a real tap in the middle of the screen -> must land on the main menu (no tap-through)
  await page.waitForTimeout(1500);
  const vp = page.viewportSize(); if (desk) await page.mouse.click(640, 360); else await page.touchscreen.tap(vp.width / 2, vp.height / 2);
  await page.waitForTimeout(1500);
  m.afterSkip = await page.evaluate(() => window.__game.phase);
  ok(`${L}: a tap skips the opening and lands on the main menu (no tap-through into a menu button)`, m.afterSkip === 'menu', `phase after skip tap: ${m.afterSkip}`);
  if (m.afterSkip !== 'menu') await page.evaluate(() => { const g = window.__game; g.endMission?.(); }), await page.evaluate(() => document.getElementById('lv-back')?.click());
  // Free Roam via a real tap/click -> immediately playable
  const [px, py] = await center(page, '#btn-play');
  const tPlay = Date.now(); if (desk) await page.mouse.click(px, py); else await page.touchscreen.tap(px, py);
  await page.waitForFunction(() => window.__game.phase === 'playing', null, { timeout: 15000 }).catch(() => {});
  m.playPhase = await page.evaluate(() => window.__game.phase); m.toPlayingMs = Date.now() - tPlay;
  const gl = await page.evaluate(() => { const c = document.getElementById('game'); const g = c.getContext('webgl2') || c.getContext('webgl'); return { ok: !!g && !g.isContextLost(), lostOverlay: !document.getElementById('gl-lost').classList.contains('hidden') }; });
  m.gl = gl;
  const ctl = await page.evaluate(() => { const c = window.__game.controls(); const W = innerWidth, H = innerHeight; const cs = getComputedStyle(document.documentElement);
    const ids = ['sb-l', 'sb-r', 'pd-gas', 'pd-brake', 'ck-rec'];
    const R = Object.fromEntries(ids.map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [id, { vis: r.width > 0 && r.height > 0, l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }]; }));
    return { setting: c.setting, scheme: c.scheme, touchActive: c.touchActive, W, H, R, sa: ['--sat', '--sab', '--sal', '--sar'].map((v) => cs.getPropertyValue(v).trim()) }; });
  m.controls = ctl;
  ok(`${L}: Free Roam starts playable at once (phase playing), WebGL context OK`, m.playPhase === 'playing' && gl.ok && !gl.lostOverlay, `phase ${m.playPhase} after ${m.toPlayingMs} ms, webgl ok ${gl.ok}, lost overlay ${gl.lostOverlay}`);
  if (!desk) {
    const inside = Object.values(ctl.R).every((r) => r.vis && r.l >= 0 && r.t >= 0 && r.r <= ctl.W && r.b <= ctl.H);
    const land = ctl.W > ctl.H;
    const R = ctl.R;
    ok(`${L}: default controls = ◀ ▶ bottom-left, big GAS + BRAKE/REV bottom-right, Reset; visible and inside the screen / safe area`,
      ctl.setting === 'buttons' && ctl.touchActive && inside && R['sb-l'].r < ctl.W / 2 && R['pd-gas'].l > ctl.W / 2 && R['sb-l'].b > ctl.H * (land ? 0.55 : 0.7) && R['pd-gas'].w >= 80 && R['pd-gas'].h >= 100 && R['sb-l'].w >= 64,
      `setting ${ctl.setting}, touchActive ${ctl.touchActive}, inside ${inside}, GAS ${Math.round(R['pd-gas'].w)}x${Math.round(R['pd-gas'].h)} px, ◀ ${Math.round(R['sb-l'].w)} px, safe-area vars ${ctl.sa.join('/')}`);
    // safe areas: emulators report 0 insets, so simulate iPhone notch/home-indicator insets through the same CSS variables env() feeds
    const sa = await page.evaluate(async () => { const land = innerWidth > innerHeight, ins = land ? { t: 0, b: 21, l: 47, r: 47 } : { t: 47, b: 34, l: 0, r: 0 };
      const st = document.documentElement.style; st.setProperty('--sat', ins.t + 'px'); st.setProperty('--sab', ins.b + 'px'); st.setProperty('--sal', ins.l + 'px'); st.setProperty('--sar', ins.r + 'px');
      await new Promise((r) => requestAnimationFrame(r));
      const bad = ['sb-l', 'sb-r', 'pd-gas', 'pd-brake', 'ck-rec', 'btn-pause', 'hud-speed'].filter((id) => { const q = document.getElementById(id).getBoundingClientRect(); return q.left < ins.l - 0.5 || q.right > innerWidth - ins.r + 0.5 || q.top < ins.t - 0.5 || q.bottom > innerHeight - ins.b + 0.5; });
      const ov = []; const ids = ['sb-l', 'sb-r', 'pd-gas', 'pd-brake', 'ck-rec', 'ck-hb', 'drv-chip']; const R = ids.map((id) => document.getElementById(id).getBoundingClientRect());
      for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], b = R[j]; if (a.width && b.width && !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top)) ov.push(ids[i] + '/' + ids[j]); }
      return { ins, bad, ov }; });
    m.safeArea = sa;
    ok(`${L}: with simulated notch/home-indicator insets every control stays inside the safe area, no overlaps`, sa.bad.length === 0 && sa.ov.length === 0, `insets ${JSON.stringify(sa.ins)}, outside [${sa.bad}], overlaps [${sa.ov}]`);
    await touchInit(page); m.touchEvents = (await page.evaluate(() => window.__touchNative)) ? 'native TouchEvent' : 'Event with touch lists (no Touch constructor in desktop WebKit)';
  }
  await page.screenshot({ path: `${OUT}${fileTag}-start.png` });
  await page.evaluate(() => window.__game.teleport(6, -6, Math.atan2(45, -29))); await page.waitForTimeout(600); await frames(page, 5);
  const press = async (key, sel, id) => desk ? page.keyboard.down(key) : down(page, id, sel);
  const release = async (key, id) => desk ? page.keyboard.up(key) : up(page, id);
  // GAS
  const p0 = await pose(page); const gHit = await press('KeyW', '#pd-gas', 1); await hold(page, 2500, 40);
  const p1 = await pose(page); const inG = await page.evaluate(() => window.__game.readInput());
  m.gas = { hitTarget: gHit, moved: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1), kmh: +(p1.speed * 3.6).toFixed(1), throttle: +inG.throttle.toFixed(2) };
  ok(`${L}: hold GAS -> drives forward`, m.gas.moved > 3 && p1.speed > 2, `touch target ${gHit}, moved ${m.gas.moved} m, ${m.gas.kmh} km/h, throttle ${m.gas.throttle}`);
  // LEFT then RIGHT while moving (gas still held = multi-touch steer + gas)
  // each turn starts from the same open stretch (after the 2.5 s GAS run the car can be near rocks/trees), GAS still held
  const restart = async () => { await page.evaluate(() => window.__game.teleport(6, -6, Math.atan2(45, -29))); await hold(page, 1200, 15); };
  await restart();
  const a0 = await pose(page); const lHit = await press('KeyA', '#sb-l', 2); await hold(page, 1200, 20); const inL = await page.evaluate(() => window.__game.readInput()); const a1 = await pose(page); await release('KeyA', 2);
  await restart();
  const b0 = await pose(page); const rHit = await press('KeyD', '#sb-r', 3); await hold(page, 1200, 20); const inR = await page.evaluate(() => window.__game.readInput()); const b1 = await pose(page); await release('KeyD', 3);
  m.left = { hit: lHit, dyawDeg: +(wrap(a1.yaw - a0.yaw) * 180 / Math.PI).toFixed(1), steer: +inL.steer.toFixed(2), throttle: +inL.throttle.toFixed(2) };
  m.right = { hit: rHit, dyawDeg: +(wrap(b1.yaw - b0.yaw) * 180 / Math.PI).toFixed(1), steer: +inR.steer.toFixed(2), throttle: +inR.throttle.toFixed(2) };
  ok(`${L}: LEFT and RIGHT turn the car in opposite directions while GAS is held (multi-touch steer + gas)`,
    m.left.dyawDeg > 3 && m.right.dyawDeg < -3 && m.left.steer > 0.5 && m.right.steer < -0.5 && m.left.throttle > 0.5 && m.right.throttle > 0.5,
    `left: yaw ${m.left.dyawDeg}° steer ${m.left.steer} thr ${m.left.throttle} (target ${lHit}); right: yaw ${m.right.dyawDeg}° steer ${m.right.steer} thr ${m.right.throttle} (target ${rHit})`);
  await release('KeyW', 1);
  // BRAKE from speed
  await press('KeyW', '#pd-gas', 4); await hold(page, 1500, 20); await release('KeyW', 4);
  const c0 = await pose(page); const bHit = await press('KeyS', '#pd-brake', 5); await hold(page, 1000, 15); const c1 = await pose(page);
  m.brake = { hit: bHit, fromKmh: +(c0.speed * 3.6).toFixed(1), toKmh: +(c1.speed * 3.6).toFixed(1) };
  // keep holding at a standstill -> reverse
  await hold(page, 3500, 50); const c2 = await pose(page); await release('KeyS', 5);
  m.reverse = { kmh: +(c2.speed * 3.6).toFixed(1) };
  ok(`${L}: BRAKE decelerates; holding BRAKE at a standstill reverses`, m.brake.toKmh < m.brake.fromKmh - 5 && c2.speed < -0.5, `brake ${m.brake.fromKmh} -> ${m.brake.toKmh} km/h in 1 s (target ${bHit}); after holding ${m.reverse.kmh} km/h`);
  // release really releases
  await hold(page, 300, 4); const inN = await page.evaluate(() => window.__game.readInput());
  ok(`${L}: releasing every control zeroes the input (nothing stuck)`, inN.throttle === 0 && inN.brake === 0 && Math.abs(inN.steer) < 0.3, JSON.stringify({ thr: inN.throttle, brk: inN.brake, steer: +inN.steer.toFixed(2) }));
  await page.screenshot({ path: `${OUT}${fileTag}-driving.png` });
  ok(`${L}: no console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  metrics[L] = m;
  await browser.close();
}
fs.writeFileSync(`${OUT}${tag}-metrics.json`, JSON.stringify(metrics, null, 1));
const failed = results.filter((r) => !r.pass); console.log(`\n${results.length - failed.length}/${results.length} mobile-drive checks passed`); process.exit(failed.length ? 1 : 0);
