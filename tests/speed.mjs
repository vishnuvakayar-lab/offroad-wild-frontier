// 0.8.1 pace measurements (deterministic fixed-step physics via __game.simulate; SIMULATED, software WebGL box).
// 0-30 / 0-50, flat top speed per drive mode + speed limit + transfer, steepest downhill top speed vs cap,
// stopping distance from 50, coast-down decel, reverse top speed, sand + steepest-climb behaviour.
import { chromium } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await b.newContext({ viewport: { width: 1000, height: 600 } })).newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(APP + '?noopening&dev=1'); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 180000 });
const res = []; const ok = (n, p, d = '') => { res.push({ n, p: !!p, d }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${d}`); };
const VEH = (process.env.VEH || 'scout,f110,sahara,mrap').split(',');
const R = await page.evaluate((VEH) => {
  const g = window.__game; g.setPreset('low'); g.play(); g.skipIntro?.();
  const I = (t, br = 0, st = 0, hb = false) => ({ throttle: t, brake: br, steer: st, handbrake: hb });
  const S = g.state(), T = g.trail; const kmh = () => { const s = g.state(); return Math.hypot(s.hspeed, 0) * 3.6; };
  let bi = 0, best = 0; for (let i = 3; i < T.length - 8; i++) { const d = Math.hypot(T[i + 6].x - T[i].x, T[i + 6].z - T[i].z); const gr = (T[i + 6].h - T[i].h) / d; if (gr > best) { best = gr; bi = i; } }
  const F = null;
  const S0 = S; const PAD = g.testPad(); const toPad = () => g.place(PAD.x, PAD.y + 1.2, PAD.z, 0);
  const setT = (m) => { g.simulate(I(0, 0, 0, true), 0.5); g.setGear('N'); g.setTransfer(m); g.setGear('A'); };
  const run = (id, prof, spd, tr) => {
    g.setVehicle(id); g.profile(prof); g.speedMode(spd); toPad(); g.simulate(I(0), 0.6); setT(tr);
    let t = 0, t30 = null, t50 = null, vmax = 0;
    while (t < 25) { g.simulate(I(1), 0.05); t += 0.05; const v = kmh(); vmax = Math.max(vmax, v); if (t30 === null && v >= 30) t30 = t; if (t50 === null && v >= 50) t50 = t; }
    return { t30: t30 && +t30.toFixed(1), t50: t50 && +t50.toFixed(1), top: +vmax.toFixed(1), cap: +g.capKmh.toFixed(1) };
  };
  const out = { grade: +(best * 100).toFixed(0), flat: F, veh: {} };
  for (const id of VEH) {
    const r = {};
    for (const prof of ['pro', 'offroad', 'sim', 'arcade']) r[prof] = run(id, prof, 'normal', '4H');
    r.low = run(id, 'pro', 'low', '4H'); r.has4L = g.drive().modes?.includes('4L') ?? true; r['4L'] = run(id, 'pro', 'normal', '4L');
    // stopping from 50 (or from top if lower), coast-down from 40
    g.profile('pro'); g.speedMode('normal'); toPad(); g.simulate(I(0), 0.6); setT('4H');
    for (let k = 0; k < 600 && kmh() < 50; k++) g.simulate(I(1), 0.05);
    const v0 = kmh(), p0 = g.pose(); for (let k = 0; k < 400 && kmh() > 0.5; k++) g.simulate(I(0, 1), 1 / 60); const p1 = g.pose();
    r.stop = { fromKmh: +v0.toFixed(0), m: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1) };
    toPad(); g.simulate(I(0), 0.6); for (let k = 0; k < 600 && kmh() < 40; k++) g.simulate(I(1), 0.05);
    const c0 = kmh(); g.simulate(I(0), 3); const c1 = kmh(); r.coast = { from: +c0.toFixed(0), after3s: +c1.toFixed(0), decel: +((c0 - c1) / 3.6 / 3).toFixed(2) };
    toPad(); g.simulate(I(0), 0.6); let rv = 0; for (let k = 0; k < 160; k++) { g.simulate(I(0, 1), 0.05); rv = Math.min(rv, g.state().speed * 3.6); } r.reverse = +rv.toFixed(1);
    // steepest trail downhill, full throttle (must stay under the cap)
    const top = T[Math.min(T.length - 1, bi + 10)], dn = T[bi]; g.teleport(top.x, top.z, Math.atan2(dn.x - top.x, dn.z - top.z)); g.simulate(I(0), 0.6); setT('4H');
    let dmax = 0; for (let k = 0; k < 120; k++) { g.simulate(I(1), 0.05); const s = g.state(); dmax = Math.max(dmax, Math.hypot(s.hspeed, 0) * 3.6); }
    r.downhill = { maxKmh: +dmax.toFixed(1), cap: +g.capKmh.toFixed(1) };
    // sand: 4 s full throttle from standstill on the dune field
    g.teleport(66, -55, Math.PI / 2); g.simulate(I(0), 0.6); setT('4H'); const q0 = g.pose(); g.simulate(I(1), 4); const q1 = g.pose(); r.sand4s = { m: +Math.hypot(q1.x - q0.x, q1.z - q0.z).toFixed(1), kmh: +kmh().toFixed(1) };
    // steepest climb: +rise in 10 s (4H and 4L)
    for (const m of ['4H', '4L']) { const h0 = T[bi], h1 = T[bi + 4]; g.teleport(h0.x, h0.z, Math.atan2(h1.x - h0.x, h1.z - h0.z)); g.simulate(I(0, 0, 0, true), 1); setT(m);
      const y0 = g.pose().y; let rise = 0, vm = 0; for (let k = 0; k < 40; k++) { const p = g.pose(); let ni = bi, nd = 1e9; for (let i = bi; i < Math.min(T.length, bi + 60); i++) { const d = Math.hypot(T[i].x - p.x, T[i].z - p.z); if (d < nd) { nd = d; ni = i; } }
        const tg = T[Math.min(T.length - 1, ni + 4)]; let df = Math.atan2(tg.x - p.x, tg.z - p.z) - p.yaw; df = Math.atan2(Math.sin(df), Math.cos(df)); g.simulate(I(1, 0, Math.max(-1, Math.min(1, df * 2))), 0.25); rise = Math.max(rise, g.pose().y - y0); vm = Math.max(vm, kmh()); }
      r['climb' + m] = { rise10s: +rise.toFixed(1), maxKmh: +vm.toFixed(1) }; }
    setT('4H'); out.veh[id] = r;
  }
  return out;
}, VEH);
console.log(`steepest trail grade ${R.grade} %; flat runs on a 2 km level test pad (ground surface)`);
console.log('veh | mode | 0-30 s | 0-50 s | top km/h (cap)');
for (const [id, r] of Object.entries(R.veh)) {
  for (const m of ['pro', 'offroad', 'sim', 'arcade', 'low', '4L']) console.log(`${id} | ${m} | ${r[m].t30 ?? '-'} | ${r[m].t50 ?? '-'} | ${r[m].top} (${r[m].cap})`);
  console.log(`${id} | stop from ${r.stop.fromKmh} km/h ${r.stop.m} m | coast ${r.coast.from}->${r.coast.after3s} km/h in 3 s (${r.coast.decel} m/s2) | reverse ${r.reverse} km/h | downhill max ${r.downhill.maxKmh} (cap ${r.downhill.cap}) | sand 4 s ${r.sand4s.m} m @ ${r.sand4s.kmh} km/h | climb 10 s 4H +${r.climb4H.rise10s} m, 4L +${r.climb4L.rise10s} m`);
  ok(`${id}: NORMAL top speed 40-60 km/h (PRO/OFF-ROAD)`, r.pro.top >= 38 && r.pro.top <= 62 && r.offroad.top <= 62, `${r.pro.top} / ${r.offroad.top}`);
  ok(`${id}: 0-50 in ~6-9 s (PRO; heavy vans/pickups up to 13 s; trucks capped below 50)`, r.pro.t50 === null ? r.pro.cap < 56 : r.pro.t50 >= 5 && r.pro.t50 <= 13, `${r.pro.t50} s`);
  ok(`${id}: LOW limit ~25 km/h`, r.low.top <= 26.5 && r.low.top > 20, `${r.low.top}`);
  ok(`${id}: 4L capped ~25-30 km/h (n/a without 4L)`, !r.has4L || (r['4L'].top <= 30 && r['4L'].top > 18), `${r['4L'].top}`);
  ok(`${id}: downhill on steepest slope stays under cap (+3 %)`, r.downhill.maxKmh <= r.downhill.cap * 1.035 + 0.5, `${r.downhill.maxKmh} vs ${r.downhill.cap}`);
  ok(`${id}: coast-down decelerates predictably (0.3-2.5 m/s2)`, r.coast.decel > 0.3 && r.coast.decel < 2.5, `${r.coast.decel}`);
  ok(`${id}: reverse works, capped`, r.reverse < -5 && r.reverse > -16, `${r.reverse}`);
}
ok('no page errors', errs.length === 0, errs[0] || '');
fs.mkdirSync('screenshots/v081', { recursive: true }); fs.writeFileSync('screenshots/v081/speed-metrics.json', JSON.stringify(R, null, 1));
console.log(`\nspeed: ${res.filter((r) => r.p).length}/${res.length} PASS`); await b.close();
