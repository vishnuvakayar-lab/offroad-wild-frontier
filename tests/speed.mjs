// 0.9.0 physics measurements (deterministic fixed-step physics via __game.simulate; SIMULATED, software WebGL box).
// Nothing here checks a velocity cap: top speed, 0-50, braking distance, 4L speed, engine braking and soft-ground
// bogging must all come out of the engine / gearbox / tyre / resistance model. The optional speed limiter (NORMAL /
// LOW, throttle-only) is measured separately.
import { chromium } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await b.newContext({ viewport: { width: 1000, height: 600 } })).newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
await page.goto(APP + '?noopening&dev=1'); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 180000 });
const res = []; const ok = (n, p, d = '') => { res.push({ n, p: !!p, d }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${d}`); };
const VEH = (process.env.VEH || 'scout,f110,sahara,rally,van,mrap').split(',');
const R = await page.evaluate((VEH) => {
  const g = window.__game; g.setPreset('low'); g.play(); g.skipIntro?.();
  const I = (t, br = 0, st = 0, hb = false) => ({ throttle: t, brake: br, steer: st, handbrake: hb });
  const kmh = () => g.state().speed * 3.6;
  const PAD = g.testPad(); const toPad = () => { g.place(PAD.x, PAD.y + 1.2, PAD.z, 0); g.simulate(I(0, 0, 0, true), 0.8); };
  const setT = (m) => { g.setGear('N'); g.setTransfer(m); g.setGear('A'); };
  const accel = (secs) => { let t = 0, t50 = null, t100 = null, vmax = 0; while (t < secs) { g.simulate(I(1), 0.1); t += 0.1; const v = kmh(); vmax = Math.max(vmax, v); if (t50 === null && v >= 50) t50 = +t.toFixed(1); if (t100 === null && v >= 100) t100 = +t.toFixed(1); } return { t50, t100, top: +vmax.toFixed(1) }; };
  const out = { veh: {} };
  for (const id of VEH) {
    const r = {}; g.setVehicle(id); g.profile('pro'); g.speedMode('off');
    g.forceSurface(null); toPad(); setT('4H'); const ph = g.phys(); r.rest = { sumFz: Math.round(ph.load.reduce((a, c) => a + c, 0)), mg: Math.round(ph.mass * 9.81) };
    // per-surface flat top speed and 0-50 with the limiter OFF
    r.surf = {};
    for (const s of ['asphalt', 'gravel', 'rock', 'wet', 'sand', 'softsand', 'mud']) { g.forceSurface(s); toPad(); setT('4H'); r.surf[s] = accel(s === 'asphalt' || s === 'gravel' ? 45 : 25); }
    g.forceSurface('gravel');
    // braking from 50 and from 100 (ABS, gravel + asphalt)
    r.stop = {};
    for (const s of ['gravel', 'asphalt']) for (const v0 of [50, 100]) { g.forceSurface(s); toPad(); setT('4H'); for (let k = 0; k < 2400 && kmh() < v0; k++) g.simulate(I(1), 1 / 60);
      const a = kmh(), p0 = g.pose(); let k = 0; for (; k < 900 && kmh() > 0.3; k++) g.simulate(I(0, 1), 1 / 60); const p1 = g.pose(); r.stop[s + v0] = { from: +a.toFixed(0), m: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1), decelG: +((a / 3.6) ** 2 / 2 / Math.max(0.1, Math.hypot(p1.x - p0.x, p1.z - p0.z)) / 9.81).toFixed(2) }; }
    g.forceSurface('gravel');
    // 4L: top speed from the gearing (gears 1-2 x final x low range)
    r.has4L = g.drive().modes.includes('4L');
    if (r.has4L) { toPad(); setT('4L'); const a = accel(20); r['4L'] = { ...a, rpm: Math.round(g.phys().rpm), ratio: +g.phys().ratio.toFixed(1) }; setT('4H'); }
    // engine braking: coast 4 s from 60 km/h in gear (A) vs in neutral
    for (const sel of ['A', 'N']) { toPad(); setT('4H'); for (let k = 0; k < 900 && kmh() < 60; k++) g.simulate(I(1), 1 / 60); g.setGear(sel); const c0 = kmh(); g.simulate(I(0), 4); r['coast' + sel] = +((c0 - kmh()) / 3.6 / 4).toFixed(2); g.setGear('A'); }
    // optional limiter: NORMAL / LOW (throttle-only)
    for (const m of ['normal', 'low']) { g.speedMode(m); toPad(); setT('4H'); const a = accel(25); r['lim_' + m] = { top: a.top, cap: +g.capKmh.toFixed(1) }; }
    g.speedMode('normal');
    // reverse (ECU reverse limiter ~14 km/h)
    toPad(); setT('4H'); let rv = 0; for (let k = 0; k < 120; k++) { g.simulate(I(0, 1), 0.05); rv = Math.min(rv, kmh()); } r.reverse = +rv.toFixed(1);
    g.forceSurface(null); out.veh[id] = r;
  }
  // render-rate consistency: identical 6 s full-throttle run driven through the real frame accumulator at 30 / 60 / 120 fps
  g.setVehicle('f110'); g.profile('pro'); g.speedMode('off'); g.forceSurface('gravel'); out.fps = {};
  for (const f of [30, 60, 120]) { toPad(); setT('4H'); const p0 = g.pose(); const o = g.frames(I(1), f, 6); const p1 = g.pose(); out.fps[f] = { kmh: +(o.speed * 3.6).toFixed(2), m: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2) }; }
  g.forceSurface(null); g.speedMode('normal');
  return out;
}, VEH);
const T = (s) => s == null ? '-' : s;
console.log('veh | surface | 0-50 s | 0-100 s | top km/h (limiter OFF, flat)');
for (const [id, r] of Object.entries(R.veh)) {
  for (const [s, v] of Object.entries(r.surf)) console.log(`${id} | ${s} | ${T(v.t50)} | ${T(v.t100)} | ${v.top}`);
  console.log(`${id} | rest ΣFz ${r.rest.sumFz} N vs m·g ${r.rest.mg} N | stop gravel 50:${r.stop.gravel50.m} m 100:${r.stop.gravel100.m} m, asphalt 50:${r.stop.asphalt50.m} m 100:${r.stop.asphalt100.m} m | 4L ${r['4L'] ? r['4L'].top + ' km/h @' + r['4L'].rpm + ' rpm' : 'n/a'} | coast A ${r.coastA} / N ${r.coastN} m/s² | limiter N ${r.lim_normal.top}/${r.lim_normal.cap} L ${r.lim_low.top}/${r.lim_low.cap} | reverse ${r.reverse}`);
  ok(`${id}: suspension carries the car (ΣFz = m·g ±3 %)`, Math.abs(r.rest.sumFz / r.rest.mg - 1) < 0.03, `${r.rest.sumFz}/${r.rest.mg}`);
  const tops = r.surf;
  ok(`${id}: top speed is surface dependent (asphalt ≥ gravel > sand > soft sand, mud slowest group)`, tops.asphalt.top >= tops.gravel.top - 1 && tops.gravel.top > tops.sand.top && tops.sand.top > tops.softsand.top && tops.mud.top < tops.gravel.top, `${tops.asphalt.top}/${tops.gravel.top}/${tops.sand.top}/${tops.softsand.top}/${tops.mud.top}`);
  ok(`${id}: 0-50 on gravel physically plausible (2-14 s)`, tops.gravel.t50 && tops.gravel.t50 >= 2 && tops.gravel.t50 <= 14, `${tops.gravel.t50}`);
  ok(`${id}: braking 100->0 on asphalt ≤ 1.15 g and ≥ 0.6 g (tyre-limited, ABS)`, r.stop.asphalt100.decelG <= 1.15 && r.stop.asphalt100.decelG >= 0.6, `${r.stop.asphalt100.decelG} g, ${r.stop.asphalt100.m} m`);
  ok(`${id}: braking on gravel weaker than on asphalt`, r.stop.gravel100.decelG < r.stop.asphalt100.decelG, `${r.stop.gravel100.decelG} < ${r.stop.asphalt100.decelG} g`);
  ok(`${id}: 4L top speed set by gearing (12-60 km/h, at redline in 2nd)`, !r.has4L || (r['4L'].top > 12 && r['4L'].top < 60), `${r['4L']?.top}`);
  ok(`${id}: engine braking (coast in gear decelerates harder than in N)`, r.coastA > r.coastN, `${r.coastA} vs ${r.coastN}`);
  ok(`${id}: optional NORMAL limiter holds its setpoint`, r.lim_normal.top <= r.lim_normal.cap + 1.5 && r.lim_normal.top >= Math.min(r.lim_normal.cap - 4, tops.gravel.top - 2), `${r.lim_normal.top}/${r.lim_normal.cap}`);
  ok(`${id}: optional LOW limiter ~25 km/h`, r.lim_low.top <= 26.5 && r.lim_low.top > 20, `${r.lim_low.top}`);
  ok(`${id}: reverse works (ECU reverse limiter)`, r.reverse < -5 && r.reverse > -16, `${r.reverse}`);
}
const f = R.fps; console.log('fps consistency', JSON.stringify(f));
ok('30/60/120 fps give the same result (±2 % distance)', Math.abs(f[30].m / f[60].m - 1) < 0.02 && Math.abs(f[120].m / f[60].m - 1) < 0.02, `${f[30].m} / ${f[60].m} / ${f[120].m} m`);
ok('no page errors', errs.length === 0, errs[0] || '');
fs.mkdirSync('screenshots/v090', { recursive: true }); fs.writeFileSync('screenshots/v090/speed-metrics.json', JSON.stringify(R, null, 1));
console.log(`\nspeed: ${res.filter((r) => r.p).length}/${res.length} PASS`); await b.close();
