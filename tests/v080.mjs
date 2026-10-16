// 0.8.0 checks: camera system, driving profiles (measured), 4L rule, shared input layer (keyboard / touch / SIMULATED gamepad),
// touch release on cancel/blur, pause on focus loss, layout, PWA (manifest + service worker scope), console errors.
// Env: BR=chromium|webkit|firefox  DEV=desktop|iphone|iphone-land|ipad|pixel  URL=...  All device runs are EMULATION (not real hardware).
import { chromium, webkit, firefox, devices } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const BR = process.env.BR || 'chromium', DEV = process.env.DEV || 'desktop', FULL = process.env.FULL !== '0';
const OUT = new URL(`../screenshots/v080/${BR}-${DEV}/`, import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const CH = { executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
const res = []; const ok = (n, p, d = '') => { res.push({ n, p: !!p, d }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${d}`); };
const frames = (page, n) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);
const shot = (page, f) => page.screenshot({ path: OUT + f }).catch(() => {});
const DEVS = { desktop: { viewport: { width: 1280, height: 720 } }, iphone: devices['iPhone 13 Pro Max'], 'iphone-land': devices['iPhone 13 Pro Max landscape'], ipad: devices['iPad (gen 7)'], pixel: devices['Pixel 7'] };
const ctxOpt = { ...DEVS[DEV] }; if (BR === 'firefox') delete ctxOpt.isMobile;
const mobile = DEV !== 'desktop';
const B = { chromium, webkit, firefox }[BR];
const browser = await B.launch(BR === 'chromium' ? CH : {});
const ctx = await browser.newContext(ctxOpt);
// SIMULATED gamepad: navigator.getGamepads mock driven by window.__pad (standard mapping)
await ctx.addInitScript(() => {
  const pad = { id: 'SIMULATED Standard Gamepad (mock)', index: 0, connected: false, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0],
    buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })), vibrationActuator: { type: 'dual-rumble', calls: 0, playEffect(t, p) { this.calls++; window.__rumble = p; return Promise.resolve('complete'); } } };
  window.__pad = pad;
  window.__padSet = (o) => { pad.connected = true; if (o.axes) pad.axes = o.axes; if (o.buttons) for (const [i, v] of Object.entries(o.buttons)) pad.buttons[i] = { pressed: v > 0.5, touched: v > 0, value: v }; pad.timestamp++; };
  window.__padClear = () => { pad.axes = [0, 0, 0, 0]; pad.buttons.forEach((b, i) => pad.buttons[i] = { pressed: false, touched: false, value: 0 }); pad.timestamp++; };
  navigator.getGamepads = () => [pad.connected ? pad : null, null, null, null];
});
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
    move(id, x, y) { const a = act.get(id); if (!a) return; a.t = mk(id, a.tgt, x, y); act.set(id, a); fire('touchmove', a.t, a.tgt); },
    cancel(id) { const a = act.get(id); if (!a) return; act.delete(id); fire('touchcancel', a.t, a.tgt); },
    up(id) { const a = act.get(id); if (!a) return; act.delete(id); fire('touchend', a.t, a.tgt); },
  };
});
const page = await ctx.newPage();
const errors = [], warns = [];
page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const t0 = Date.now();
await page.goto(APP + '?noopening&dev=1'); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 240000 });
const loadS = ((Date.now() - t0) / 1000).toFixed(1);
ok('boots to menu, Build 0.8.0', /Build 0\.8\.0/.test(await page.textContent('body')), `load ${loadS} s`);
await page.evaluate(() => { window.__noAutoPause = true; });
await shot(page, 'menu.png');
const nos = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: innerWidth, sh: document.documentElement.scrollHeight, ch: innerHeight }));
ok('menu: no page scroll', nos.sw <= nos.cw + 1 && nos.sh <= nos.ch + 1, JSON.stringify(nos));

// ---- PWA ----
const man = await page.evaluate(async () => { const h = document.querySelector('link[rel=manifest]').href; const j = await (await fetch(h)).json(); return { h, start: j.start_url, scope: j.scope, icons: j.icons.map((i) => i.src) }; });
ok('manifest: relative start_url/scope/icons (stays inside the deploy folder)', man.start === './' && man.scope === './' && man.icons.every((s) => !s.startsWith('/')), JSON.stringify(man));
const swTxt = await page.evaluate(async () => { const r = await fetch('./sw.js'); return r.ok ? (await r.text()).slice(0, 4000) : null; });
ok('service worker file built with precache list + version cache', !!swTxt && /owf-0\.8\.0/.test(swTxt) && /assets\//.test(swTxt), swTxt ? 'sw.js present' : 'missing');
const swReg = await page.evaluate(async () => { if (!('serviceWorker' in navigator)) return 'unsupported'; for (let i = 0; i < 30; i++) { const r = await navigator.serviceWorker.getRegistration(); if (r) return r.scope; await new Promise((r) => setTimeout(r, 200)); } return 'not registered'; });
ok('service worker registration scope = this folder (or unsupported/http)', swReg === 'unsupported' || swReg === 'not registered' ? !APP.startsWith('https') && !/localhost/.test(APP) : new URL(swReg).pathname === new URL(APP).pathname, swReg);

// ---- start driving ----
await page.evaluate(() => { const g = window.__game; g.setPreset('low'); g.setVehicle('scout'); g.play(); g.skipIntro?.(); });
await page.waitForFunction(() => window.__game.phase === 'playing'); await frames(page, 30);
const S = await page.evaluate(() => window.__game.state());

// ---- cameras: stationary + driving, height above terrain, screenshots ----
const modes = await page.evaluate(() => window.__game.camModes);
const camRows = [];
for (const m of modes) {
  await page.evaluate(([m, S]) => { const g = window.__game; g.teleport(S.x, S.z, S.yaw); g.setInput(null); g.cam(m); }, [m, S]);
  await frames(page, 70);
  const st = await page.evaluate(() => window.__game.camInfo()); await shot(page, `cam-${m}-stationary.png`);
  await page.evaluate(() => window.__game.setInput({ throttle: 1, brake: 0, steer: 0.25, handbrake: false }));
  await frames(page, 90); const dr = await page.evaluate(() => window.__game.camInfo()); await shot(page, `cam-${m}-driving.png`);
  await page.evaluate(() => window.__game.setInput(null));
  camRows.push({ m, stAbove: +st.aboveGround.toFixed(2), drAbove: +dr.aboveGround.toFixed(2), dist: +dr.distToCar.toFixed(1) });
  ok(`camera ${m}: active, above terrain stationary + driving`, st.mode === m && st.aboveGround > 0.25 && dr.aboveGround > 0.25, `above ${st.aboveGround.toFixed(2)} / ${dr.aboveGround.toFixed(2)} m, dist ${dr.distToCar.toFixed(1)} m`);
}
// cycle via C key / button, blend, session memory, reset, look back
await page.evaluate(() => window.__game.cam('pro')); await frames(page, 5);
if (!mobile) { await page.keyboard.press('KeyC'); } else { await page.tap('#btn-cam'); }
await frames(page, 4);
const cy = await page.evaluate(() => ({ m: window.__game.camMode, blend: window.__game.camInfo().blend, ses: sessionStorage.getItem('owf.cam.session') }));
ok('camera cycles (C key / camera button), smooth blend starts, choice stored for session', cy.m === 'far' && cy.blend < 1 && cy.ses === 'far', JSON.stringify(cy));
await page.evaluate(() => window.__game.lookBack(true)); await frames(page, 40);
const lb = await page.evaluate(() => window.__game.camInfo().lookBackK); await page.evaluate(() => window.__game.lookBack(false));
ok('look back engages', lb > 0.8, `k ${lb.toFixed(2)}`);
await page.evaluate(() => window.__game.cam('cockpit')); await frames(page, 5);
await page.click('#btn-camreset').catch(() => page.evaluate(() => window.__game.resetCam())); await frames(page, 5);
ok('one-tap camera reset -> Pro Chase', (await page.evaluate(() => window.__game.camMode)) === 'pro');

// ---- profiles: measured ----
const prof = await page.evaluate((S) => {
  const g = window.__game; const out = {};
  for (const id of g.profileIds) {
    g.profile(id); g.setGear?.('A');
    g.teleport(S.x, S.z, S.yaw); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: false }, 1);
    let t = 0; while (g.state().speed * 3.6 < 50 && t < 20) { g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 0.05); t += 0.05; }
    const a = g.state(); let d = 0, px = a.x, pz = a.z, tb = 0;
    while (g.state().speed > 0.3 && tb < 15) { g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 0.05); tb += 0.05; const s = g.state(); d += Math.hypot(s.x - px, s.z - pz); px = s.x; pz = s.z; }
    g.teleport(S.x, S.z, S.yaw); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: false }, 0.5);
    let tt = 0; while (g.state().speed * 3.6 < 30 && tt < 10) { g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 0.05); tt += 0.05; }
    const y0 = g.state().yaw; g.simulate({ throttle: 0.4, brake: 0, steer: 1, handbrake: false }, 1.5); const y1 = g.state().yaw;
    let dy = y1 - y0; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    out[id] = { t0_50: t >= 20 ? null : +t.toFixed(2), stop50m: +d.toFixed(1), turnDegS: +Math.abs(dy * 180 / Math.PI / 1.5).toFixed(1), up: +g.state().up.toFixed(2) };
  }
  g.profile('pro'); return out;
}, S);
console.log('   profile | 0-50 km/h | stop from 50 | turn rate @30 km/h full lock');
for (const [k, v] of Object.entries(prof)) console.log(`   ${k} | ${v.t0_50 ?? '>20'} s | ${v.stop50m} m | ${v.turnDegS} deg/s`);
const P = Object.values(prof); const uniq = (f) => new Set(P.map(f)).size;
ok('profiles all reach 50 km/h, stop, stay upright', P.every((p) => p.t0_50 !== null && p.stop50m > 1 && p.up > 0.6), JSON.stringify(prof));
ok('profiles measurably different (0-50, stopping, turn rate)', uniq((p) => p.t0_50) >= 3 && uniq((p) => p.stop50m) >= 3 && uniq((p) => p.turnDegS) >= 3);
ok('ARCADE stops shorter than SIMULATION', prof.arcade.stop50m < prof.sim.stop50m, `${prof.arcade.stop50m} vs ${prof.sim.stop50m} m`);

// ---- drive / brake / reverse ----
const dbr = await page.evaluate((S) => { const g = window.__game; g.teleport(S.x, S.z, S.yaw); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 3); const f = g.state().speed;
  let b = 99; for (let i = 0; i < 120 && b > 0.3; i++) { g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 0.05); b = g.state().speed; } g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 3); const r = g.state().speed; return { f, b, r }; }, S);
ok('drive forward, brake to stop, reverse on held brake', dbr.f > 5 && Math.abs(dbr.b) < 2.5 && dbr.r < -0.8, `fwd ${(dbr.f * 3.6).toFixed(0)} km/h, after brake ${(dbr.b * 3.6).toFixed(1)}, reverse ${(dbr.r * 3.6).toFixed(1)} km/h`);
// ---- 4L rule ----
const lr = await page.evaluate((S) => { const g = window.__game; g.teleport(S.x, S.z, S.yaw); g.setTransfer('4H'); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 3);
  const a = g.setTransfer('4L'); const kmh = g.drive().kmh; g.simulate({ throttle: 0, brake: 1, steer: 0, handbrake: false }, 2.5); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.3); const b = g.setTransfer('4L'); g.setTransfer('4H'); return { a: a.ok, msg: a.msg, kmh, b: b.ok }; }, S);
ok('4L rejected above 8 km/h with message, accepted when stopped', !lr.a && /8 km\/h/.test(lr.msg) && lr.b, `${lr.kmh.toFixed(0)} km/h -> "${lr.msg}"`);

// ---- input arbitration + SIMULATED gamepad ----
await page.evaluate(() => { window.__game.teleport(0, 0, 0); });
await page.evaluate(() => window.__padSet({ axes: [-1, 0, 0, 0], buttons: { 7: 1 } })); await frames(page, 6);
const gp = await page.evaluate(() => ({ dev: window.__game.input.last, i: window.__game.readInput() }));
ok('SIMULATED gamepad: left stick left = steer left (+), RT throttles, device = pad', gp.dev === 'pad' && gp.i.steer > 0.8 && gp.i.throttle > 0.9, JSON.stringify(gp));
await page.evaluate(() => window.__padSet({ axes: [0.08, 0, 0, 0], buttons: { 7: 0 } })); await frames(page, 4);
const dz = await page.evaluate(() => window.__game.readInput().steer);
ok('gamepad dead zone filters small stick drift', Math.abs(dz) < 0.01, `steer ${dz}`);
await page.evaluate(() => window.__padSet({ axes: [-1, 0, 0, 0] })); await frames(page, 3);
await page.keyboard.down('KeyD'); await frames(page, 15);
const ar = await page.evaluate(() => ({ dev: window.__game.input.last, i: window.__game.readInput() }));
await page.keyboard.up('KeyD');
ok('last active device wins, inputs not summed (keyboard D overrides pad left stick)', ar.dev === 'keys' && ar.i.steer < -0.3, JSON.stringify(ar));
await page.evaluate(() => window.__padClear()); await frames(page, 3);
const cam0 = await page.evaluate(() => window.__game.camMode);
await page.evaluate(() => window.__padSet({ buttons: { 3: 1 } })); await frames(page, 3); await page.evaluate(() => window.__padSet({ buttons: { 3: 0 } })); await frames(page, 3);
ok('gamepad Y cycles camera', (await page.evaluate(() => window.__game.camMode)) !== cam0);
await page.evaluate(() => { window.__game.cam('pro'); window.__padSet({ buttons: { 9: 1 } }); }); await frames(page, 3); await page.evaluate(() => window.__padSet({ buttons: { 9: 0 } })); await frames(page, 3);
const pz = await page.evaluate(() => window.__game.phase);
await page.evaluate(() => window.__padSet({ buttons: { 13: 1 } })); await frames(page, 3); await page.evaluate(() => window.__padSet({ buttons: { 13: 0 } })); await frames(page, 3);
const foc = await page.evaluate(() => document.querySelectorAll('.pad-focus').length);
ok('gamepad Start pauses; D-pad moves menu focus', pz === 'paused' && foc > 0, `phase ${pz}, focused ${foc}`);
await shot(page, 'pause-pad-focus.png');
await page.evaluate(() => window.__padSet({ buttons: { 1: 1 } })); await frames(page, 3); await page.evaluate(() => window.__padSet({ buttons: { 1: 0 } })); await frames(page, 6);
ok('gamepad B resumes from pause', (await page.evaluate(() => window.__game.phase)) === 'playing');
// rebinding
const rb = await page.evaluate(() => { const g = window.__game; const before = g.input.bindings().up; g.input.setBinding('up', ['KeyI']); return before; });
await page.keyboard.down('KeyI'); await frames(page, 4); const rbi = await page.evaluate(() => window.__game.readInput().throttle); await page.keyboard.up('KeyI');
const persisted = await page.evaluate(() => localStorage.getItem('owf.bindings.v1')); await page.evaluate(() => window.__game.input.resetBindings());
ok('configurable bindings: throttle rebound to I works + persisted, reset restores', rbi > 0.9 && /KeyI/.test(persisted || '') && (await page.evaluate(() => window.__game.input.bindings().up.join())) === rb.join(), `default ${rb.join('/')}`);

// ---- touch hold / cancel / blur (mobile) ----
if (mobile) {
  await page.evaluate(() => window.__game.setControls('wheel'));
  const box = await page.locator('#pd-gas').boundingBox().catch(() => null);
  await touchInit(page); const hasT = await page.evaluate(() => !!window.__touch);
  if (hasT && box) {
    const cx = box.x + box.width / 2, cy2 = box.y + box.height / 2;
    await page.evaluate(([x, y]) => window.__touch.down(1, x, y), [cx, cy2]); await frames(page, 4);
    const h = await page.evaluate(() => window.__game.readInput().throttle);
    await page.evaluate(() => window.__touch.cancel(1)); await frames(page, 3);
    const c = await page.evaluate(() => window.__game.readInput().throttle);
    await page.evaluate(([x, y]) => window.__touch.down(2, x, y), [cx, cy2]); await frames(page, 3);
    await page.evaluate(() => window.dispatchEvent(new Event('blur'))); await frames(page, 3);
    const b = await page.evaluate(() => window.__game.readInput().throttle);
    await page.evaluate(() => window.__touch.up?.(2));
    ok('touch GAS hold -> throttle; touchcancel releases; blur releases', h > 0.9 && c === 0 && b === 0, `hold ${h}, after cancel ${c}, after blur ${b}`);
  } else ok('touch GAS hold/cancel/blur', false, `touch helper ${hasT}, gas box ${!!box}`);
  const lay = await page.evaluate(() => { const els = [...document.querySelectorAll('#hud button, #cockpit .wheel, #cockpit .pedal, #selbar .sel-chip')].filter((e) => e.offsetParent); const bad = els.filter((e) => { const r = e.getBoundingClientRect(); return r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1; }).map((e) => e.id || e.className); return { n: els.length, bad, sw: document.documentElement.scrollWidth, w: innerWidth }; });
  ok('mobile HUD: every control on-screen, no horizontal scroll', lay.bad.length === 0 && lay.sw <= lay.w + 1, JSON.stringify(lay));
}
// pause on focus loss
await page.evaluate(() => { window.__noAutoPause = false; window.dispatchEvent(new Event('blur')); }); await frames(page, 3);
ok('window blur pauses (single player)', (await page.evaluate(() => window.__game.phase)) === 'paused');
await page.evaluate(() => { window.__noAutoPause = true; document.getElementById('btn-resume')?.click(); }); await frames(page, 5);
// HUD chips
const hud = await page.evaluate(() => ({ trac: document.getElementById('hud-trac')?.textContent, cam: document.getElementById('cam-chip')?.textContent, prof: document.getElementById('prof-chip')?.textContent }));
ok('HUD shows camera + profile selectors and traction chip', !!hud.trac && !!hud.cam && !!hud.prof, JSON.stringify(hud));
await shot(page, 'hud-driving.png');
ok('no console errors / page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const fps = await page.evaluate(() => window.__game.state().fps);
const pass = res.filter((r) => r.p).length;
console.log(`\nv080 ${BR}/${DEV}: ${pass}/${res.length} PASS  load ${loadS} s  fps ${fps?.toFixed?.(0)}`);
fs.writeFileSync(OUT + 'result.json', JSON.stringify({ BR, DEV, pass, total: res.length, loadS, fps, prof, camRows, res }, null, 1));
await browser.close(); process.exit(pass === res.length ? 0 : 1);
