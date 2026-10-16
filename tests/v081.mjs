// 0.8.1 checks: cockpit head motion + vibration, hood rig, cinematic low side tracking shot, per-mode default shake,
// SIMULATION high-speed consequence (understeer + roll). Desktop Chromium, software WebGL (SIMULATED, not real hardware).
import { chromium } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const OUT = new URL('../screenshots/v081/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const res = []; const ok = (n, p, d = '') => { res.push({ n, p: !!p, d }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${d}`); };
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const fr = (n) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);
await page.goto(APP + '?noopening&dev=1'); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 180000 });
ok('Build 0.8.1+', /Build 0\.8\.1/.test(await page.textContent('body')));
await page.evaluate(() => { const g = window.__game; g.setPreset('low'); g.setVehicle('f110'); g.play(); g.skipIntro?.(); }); await page.waitForFunction(() => window.__game.phase === 'playing'); await fr(20);
const S = await page.evaluate(() => window.__game.state());
// cockpit head motion while accelerating hard, vibration at speed
await page.evaluate(() => window.__game.cam('cockpit'));
const c0 = await page.evaluate(() => window.__game.camInfo()); await page.evaluate(() => window.__game.setInput({ throttle: 1, brake: 0, steer: 0.6, handbrake: false })); await fr(60);
const c1 = await page.evaluate(() => window.__game.camInfo()); await page.screenshot({ path: OUT + 'cockpit-driving.png' });
ok('cockpit: head leans with acceleration (subtle, <= 7 cm) and vibrates at speed', Math.hypot(c1.head.x, c1.head.z) > 0.004 && Math.abs(c1.head.x) <= 0.071 && c1.vib > 0, `head ${JSON.stringify(c1.head)} vib ${c1.vib.toFixed(4)} (rest vib ${c0.vib.toFixed(4)})`);
await page.evaluate(() => window.__game.cam('hood')); await fr(30); const hd = await page.evaluate(() => window.__game.camInfo()); await page.screenshot({ path: OUT + 'hood.png' });
ok('hood: low forward rig, above terrain', hd.aboveGround > 0.3 && hd.aboveGround < 2.2, `above ${hd.aboveGround.toFixed(2)} m, ${hd.distToCar.toFixed(2)} m from car origin`);
await page.evaluate(() => window.__game.cam('cinematic')); let side = null;
for (let i = 0; i < 40 && !side; i++) { await fr(10); const c = await page.evaluate(() => window.__game.camInfo()); if (c.cineSide) side = c; }
await fr(20); side = side && await page.evaluate(() => window.__game.camInfo()); await page.screenshot({ path: OUT + 'cinematic-side.png' });
ok('cinematic: low side tracking shot reached (wheel height, close)', side && side.cineSide && side.aboveGround < 1.2 && side.distToCar < 6, side ? `above ${side.aboveGround.toFixed(2)} m, ${side.distToCar.toFixed(1)} m` : 'never');
await page.evaluate(() => { window.__game.setInput(null); window.__game.cam('pro'); });
// default shake per mode (no user override)
const sh = await page.evaluate(() => { const out = {}; const g = window.__game; for (const id of ['arcade', 'sim', 'offroad', 'pro']) { g.profile(id); out[id] = document.querySelector('#seg-shake button.on')?.dataset.v; } return out; });
ok('default shake per drive mode: PRO/SIM/OFF-ROAD medium, ARCADE low', sh.pro === 'medium' && sh.sim === 'medium' && sh.offroad === 'medium' && sh.arcade === 'low', JSON.stringify(sh));
// SIMULATION high-speed consequence
const hs = await page.evaluate((S) => { const g = window.__game, out = {};
  for (const id of ['pro', 'sim']) { g.profile(id); const PAD = g.testPad(); g.place(PAD.x, PAD.y + 1.2, PAD.z, 0); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: false }, 0.5);
    let t = 0; while (g.state().speed * 3.6 < 52 && t < 25) { g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 0.1); t += 0.1; }
    const v0 = g.state().speed * 3.6, y0 = g.state().yaw; let minUp = 1;
    for (let i = 0; i < 15; i++) { g.simulate({ throttle: 0.5, brake: 0, steer: 0.5, handbrake: false }, 0.1); minUp = Math.min(minUp, g.state().up); }
    let dy = g.state().yaw - y0; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    out[id] = { kmh: +v0.toFixed(0), yawDegS: +(Math.abs(dy) * 180 / Math.PI / 1.5).toFixed(1), maxRollDeg: +(Math.acos(Math.min(1, minUp)) * 180 / Math.PI).toFixed(1) }; }
  g.profile('pro'); return out; }, S);
ok('SIMULATION at speed: turns less (understeer) and rolls more than PRO in the same corner', hs.sim.yawDegS < hs.pro.yawDegS && hs.sim.maxRollDeg > hs.pro.maxRollDeg, JSON.stringify(hs));
ok('no page errors', errs.length === 0, errs[0] || '');
const pass = res.filter((r) => r.p).length; console.log(`\nv081: ${pass}/${res.length} PASS`);
fs.writeFileSync(OUT + 'result.json', JSON.stringify({ res, hs, sh }, null, 1)); await b.close(); process.exit(pass === res.length ? 0 : 1);
