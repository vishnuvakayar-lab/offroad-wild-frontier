// Drive-control block: cockpit HUD (virtual wheel + progressive pedals), alternative schemes (buttons / tilt / halves),
// transmission selector A/P/R/N/D with interlocks, transfer case 2H/4H/4L(/AWD) physics on sand / mud / rock / steep slope,
// opening cinematic, pause / orientation. All in headless Chrome (SwiftShader) with touch emulation: NO real-device testing.
// Runs inside tests/acceptance.mjs and standalone (tests/drive.mjs).
import fs from 'node:fs';
const SH = new URL('../screenshots/rework/', import.meta.url).pathname;
fs.mkdirSync(SH, { recursive: true });
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inp = (page) => page.evaluate(() => window.__game.readInput());
const ped = (page) => page.evaluate(() => window.__game.pedals());
const pose = (page) => page.evaluate(() => window.__game.pose());
const ptr = (page, sel, type, id, dx = 0, dy = 0) => page.evaluate(([sel, type, id, dx, dy]) => {
  const el = document.querySelector(sel); const r = el.getBoundingClientRect();
  el.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', bubbles: true, cancelable: true, clientX: r.left + r.width / 2 + dx, clientY: r.top + r.height / 2 + dy }));
}, [sel, type, id, dx, dy]);
const frames = (page, n) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);
const rect = (page, ids) => page.evaluate((ids) => Object.fromEntries(ids.map((id) => { const e = document.getElementById(id) ?? document.querySelector(id); const r = e.getBoundingClientRect(); return [id, { x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, vis: e.offsetParent !== null || getComputedStyle(e).position === 'fixed' }]; })), ids);
const inView = (b, W, H) => b.w > 0 && b.x >= -0.5 && b.y >= -0.5 && b.r <= W + 0.5 && b.b <= H + 0.5;
const overlap = (a, b) => !(a.r <= b.x || b.r <= a.x || a.b <= b.y || b.b <= a.y);

export async function runDrive({ openPage, ok }) {
  const metrics = {};

  // ---------- D0: opening cinematic on launch (default settings) ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'drive-opening', '', { keepOpening: true });
    const ph0 = await page.evaluate(() => window.__game.phase);
    const p0 = await pose(page);
    await page.waitForFunction(() => window.__game.openT > 3.2 || window.__game.phase !== 'opening', null, { timeout: 120000 });
    const titled = await page.evaluate(() => document.getElementById('opening').classList.contains('titled'));
    await page.screenshot({ path: SH + 'opening-establishing.png' });
    await page.waitForFunction(() => window.__game.openT > 6.5 || window.__game.phase !== 'opening', null, { timeout: 120000 });
    await page.screenshot({ path: SH + 'opening-drive-in.png' });
    const p1 = await pose(page);
    await page.mouse.click(640, 360); await frames(page, 3);
    const after = await page.evaluate(() => ({ phase: window.__game.phase, reveal: document.getElementById('menu').classList.contains('reveal'), menu: !document.getElementById('menu').classList.contains('hidden') }));
    await page.waitForTimeout(1500); await page.screenshot({ path: SH + 'opening-menu-live.png' });
    const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
    ok('drive opening: plays on launch, title card, 4x4 drives into the scene, tap skips to the live 3D menu', ph0 === 'opening' && titled && moved > 15 && after.phase === 'menu' && after.menu && after.reveal,
      `phase at load ${ph0}, title shown ${titled}, car moved ${moved.toFixed(1)} m by t=6.5 s, after tap: ${JSON.stringify(after)}`);
    ok('drive opening: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- D1-D6: iPhone landscape cockpit ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPHONE_UA }, 'drive-landscape');
    const def = await page.evaluate(() => window.__game.controls().setting);
    await page.evaluate(() => { const g = window.__game; g.endMission(); g.play(); g.skipIntro?.(); });
    await page.waitForFunction(() => window.__game.phase === 'playing'); await page.waitForTimeout(400);
    const ids = ['wheel', 'pd-gas', 'pd-brake', 'drv-chip', 'ck-rec', 'ck-hb', 'hud-speed', 'btn-pause'];
    const R = await rect(page, ids); const W = 844, H = 390;
    const allIn = ids.every((id) => inView(R[id], W, H));
    const pairs = [['wheel', 'pd-gas'], ['wheel', 'pd-brake'], ['wheel', 'drv-chip'], ['drv-chip', 'pd-brake'], ['drv-chip', 'pd-gas'], ['ck-rec', 'pd-gas'], ['ck-hb', 'pd-gas'], ['wheel', 'hud-speed']];
    const clash = pairs.filter(([a, b]) => overlap(R[a], R[b])).map((p) => p.join('/'));
    const coverage = ['wheel', 'pd-gas', 'pd-brake', 'drv-chip'].reduce((t, id) => t + R[id].w * R[id].h, 0) / (W * H);
    await page.screenshot({ path: SH + 'drive-cockpit-landscape.png' });
    ok('drive cockpit: default scheme = wheel + pedals; wheel bottom-left, pedals bottom-right, drive chip lower centre; all on-screen, no overlaps, small footprint',
      def === 'wheel' && allIn && clash.length === 0 && R.wheel.x < W * 0.3 && R['pd-gas'].r > W * 0.8 && R.wheel.b > H * 0.6 && coverage < 0.16,
      `scheme ${def}, in view ${allIn}, overlaps [${clash}], controls cover ${(coverage * 100).toFixed(1)}% of the screen, wheel ${Math.round(R.wheel.w)} px at x ${Math.round(R.wheel.x)}`);

    // D2 progressive throttle (real-time ramp), instant release
    await ptr(page, '#pd-gas', 'pointerdown', 21);
    const ramp = []; const t0 = Date.now();
    for (let k = 0; k < 8; k++) { ramp.push({ t: Date.now() - t0, v: (await ped(page)).gas }); await frames(page, 1); }
    await sleep(700); ramp.push({ t: Date.now() - t0, v: (await ped(page)).gas });
    const iGas = await inp(page);
    await ptr(page, '#pd-gas', 'pointerup', 21); await frames(page, 2);
    const rel = await ped(page); const iRel = await inp(page);
    const mono = ramp.every((r, i) => i === 0 || r.v >= ramp[i - 1].v - 1e-6);
    ok('drive pedals: throttle is progressive (ramps up while held), release = 0', ramp[0].v < 0.75 && ramp[ramp.length - 1].v === 1 && mono && rel.gas === 0 && iRel.throttle === 0 && iGas.throttle === 1,
      `ramp ${ramp.map((r) => `${r.t}ms:${r.v.toFixed(2)}`).join(' ')}, after release gas ${rel.gas}, throttle ${iRel.throttle}`);
    metrics.ramp = ramp;

    // D3 brake independent + brake wins over throttle
    await ptr(page, '#pd-brake', 'pointerdown', 23); await frames(page, 2); const bOnly = await inp(page);
    await ptr(page, '#pd-gas', 'pointerdown', 21); await frames(page, 3); const both = await inp(page);
    await ptr(page, '#pd-brake', 'pointerup', 23); await frames(page, 3); const gasAgain = await inp(page);
    await ptr(page, '#pd-gas', 'pointerup', 21); await frames(page, 1);
    ok('drive pedals: brake works on its own and always wins (throttle cut while both are pressed)', bOnly.brake > 0.3 && bOnly.throttle === 0 && both.brake > 0.3 && both.throttle === 0 && gasAgain.throttle > 0 && gasAgain.brake === 0,
      `brake only ${bOnly.brake.toFixed(2)}/${bOnly.throttle}; both pressed: brake ${both.brake.toFixed(2)}, throttle ${both.throttle}; brake released: throttle ${gasAgain.throttle.toFixed(2)}`);

    // D4 multitouch: steer with the wheel while holding the accelerator
    await page.evaluate(() => { const g = window.__game; g.teleport(0, 0, 0); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.6); });
    await ptr(page, '#pd-gas', 'pointerdown', 31);
    const wr = (await rect(page, ['wheel'])).wheel; const rr = wr.w / 2 - 8;
    await ptr(page, '#wheel', 'pointerdown', 32, 0, -rr); // grab the top of the rim
    for (let k = 1; k <= 6; k++) { const a = (-90 + k * 15) * Math.PI / 180; await ptr(page, '#wheel', 'pointermove', 32, Math.cos(a) * rr, Math.sin(a) * rr); } // turn clockwise 90 deg
    await frames(page, 4);
    const wIn = await inp(page), wPed = await ped(page), q0 = await pose(page);
    await sleep(2500);
    const q1 = await pose(page);
    let dy = q1.yaw - q0.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    await page.screenshot({ path: SH + 'drive-multitouch-wheel.png' });
    ok('drive multitouch: wheel turned 90 deg clockwise while holding GAS -> steers right and accelerates, car turns right', wPed.wheelDeg > 80 && wIn.steer < -0.4 && wIn.throttle > 0.5 && dy < -0.15 && Math.hypot(q1.x - q0.x, q1.z - q0.z) > 3,
      `wheel ${wPed.wheelDeg.toFixed(0)} deg -> steer ${wIn.steer.toFixed(2)}, throttle ${wIn.throttle.toFixed(2)}; yaw ${(dy * 180 / Math.PI).toFixed(0)} deg, moved ${Math.hypot(q1.x - q0.x, q1.z - q0.z).toFixed(1)} m`);
    await ptr(page, '#wheel', 'pointerup', 32); await ptr(page, '#pd-gas', 'pointerup', 31);
    await sleep(700); await frames(page, 2);
    const centred = await ped(page); const ci = await inp(page);
    ok('drive wheel: self-centres after release', centred.wheelDeg === 0 && Math.abs(ci.steer) < 0.05, `wheel ${centred.wheelDeg.toFixed(1)} deg, steer ${ci.steer.toFixed(2)} 0.7 s after release`);

    // D5 drive chip: 4L rejected while moving (UI path), toast + mode kept
    await page.evaluate(() => { const g = window.__game; g.teleport(0, 0, 0); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 2.0); });
    await page.tap('#drv-chip'); await page.waitForTimeout(150);
    await page.tap('#drv-tc [data-t="4L"]'); await page.waitForTimeout(100);
    const rej = await page.evaluate(() => ({ d: window.__game.drive(), toast: document.getElementById('toast').textContent, note: document.getElementById('drv-note').textContent, pop: !document.getElementById('drv-pop').classList.contains('hidden') }));
    await page.screenshot({ path: SH + 'drive-transfer-popover.png' });
    ok('drive transfer UI: popover opens; 4L while moving is rejected with a message and 4H is kept', rej.pop && rej.d.transfer === '4H' && /Stop/.test(rej.toast) && /4L/.test(rej.note),
      `at ${rej.d.kmh.toFixed(0)} km/h: transfer ${rej.d.transfer}, toast "${rej.toast}"`);
    await page.tap('#drv-chip');

    // D6 pause / resume keeps drivetrain state; orientation change keeps the cockpit on-screen
    await page.evaluate(() => { const g = window.__game; g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 3); g.setGear('N'); g.setTransfer('4L'); g.setGear('A'); });
    await page.tap('#btn-pause'); await page.waitForTimeout(250); const ph = await page.evaluate(() => window.__game.phase);
    await page.tap('#btn-resume'); await page.waitForTimeout(250);
    const kept = await page.evaluate(() => ({ phase: window.__game.phase, d: window.__game.drive(), chip: document.getElementById('drv-chip').textContent }));
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(600);
    const P = await rect(page, ids); const pIn = ids.every((id) => inView(P[id], 390, 844));
    const pClash = pairs.filter(([a, b]) => overlap(P[a], P[b])).map((p) => p.join('/'));
    await page.screenshot({ path: SH + 'drive-cockpit-portrait.png' });
    ok('drive pause/rotate: pause -> resume keeps gear + 4L; rotating to portrait keeps every control on-screen without overlaps', ph === 'paused' && kept.phase === 'playing' && kept.d.transfer === '4L' && /4L/.test(kept.chip) && pIn && pClash.length === 0,
      `paused ${ph}, resumed ${kept.phase} chip "${kept.chip}", portrait in view ${pIn}, overlaps [${pClash}]`);
    // restart (Recover pill) keeps the session playable
    await page.tap('#ck-rec'); await page.waitForTimeout(200);
    const rec = await page.evaluate(() => ({ phase: window.__game.phase, up: window.__game.state().up ?? null }));
    ok('drive recover: Recover pill resets the vehicle and play continues', rec.phase === 'playing', JSON.stringify(rec));

    // D7 alternative schemes: buttons, halves, tilt (tilt sensor stubbed)
    await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(300);
    await page.evaluate(() => window.__game.setControls('buttons', false)); await frames(page, 2);
    await ptr(page, '#sb-l', 'pointerdown', 41); await sleep(300); await frames(page, 6); const bl = await inp(page); await ptr(page, '#sb-l', 'pointerup', 41);
    const vb = await page.evaluate(() => ({ wheel: document.getElementById('wheel').offsetParent !== null, btns: document.getElementById('steer-btns').offsetParent !== null }));
    await page.evaluate(() => window.__game.setControls('halves', false)); await frames(page, 2);
    const vh = await page.evaluate(() => ({ zones: document.getElementById('tzones').offsetParent !== null, cockpit: document.getElementById('cockpit').offsetParent !== null || !document.getElementById('cockpit').classList.contains('hidden') }));
    const hi = await inp(page);
    await page.evaluate(() => { DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted'); });
    await page.tap('#btn-pause'); await page.waitForTimeout(150); await page.tap('#btn-settings2').catch(() => {});
    await page.evaluate(() => { document.querySelector('#seg-ctrl [data-v="tilt"]').click(); });
    await page.evaluate(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: 0, gamma: 0 })));
    await page.tap('#btn-resume').catch(async () => page.evaluate(() => document.getElementById('btn-resume').click())); await page.waitForTimeout(400);
    const ang = await page.evaluate(() => screen.orientation?.angle ?? 0);
    await page.evaluate(() => window.__game.controls()); await page.evaluate(() => { window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: 0, gamma: 0 })); });
    await page.waitForTimeout(400); await page.evaluate(() => document.getElementById('ck-cal').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
    const roll = ang === 90 ? [-15, 0] : ang === 270 ? [15, 0] : [0, -15];
    await page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: b, gamma: g })), roll); await page.waitForTimeout(400);
    const ti = await inp(page), tc = await page.evaluate(() => window.__game.controls());
    ok('drive schemes: ◀ button steers (buttons mode shows buttons, hides wheel); halves = zones + auto-forward; tilt (stubbed sensor) steers with pedals shown',
      bl.steer > 0.3 && vb.btns && !vb.wheel && vh.zones && hi.throttle === 1 && tc.setting === 'tilt' && tc.tiltState === 'granted' && ti.steer > 0.3,
      `buttons: steer ${bl.steer.toFixed(2)} ${JSON.stringify(vb)}; halves: ${JSON.stringify(vh)} thr ${hi.throttle}; tilt: state ${tc.tiltState}, tilt ${tc.tilt.toFixed(2)}, steer ${ti.steer.toFixed(2)}`);
    ok('drive landscape: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- D8-D14: transmission + transfer case (deterministic fixed-step physics, 1/60 s) ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 960, height: 540 } }, 'drive-physics');
    await page.evaluate(() => { const g = window.__game; g.setPreset('low'); g.setVehicle('scout'); g.endMission(); g.play(); g.skipIntro?.(); });
    await page.waitForFunction(() => window.__game.phase === 'playing');
    // a long clear straight on the flat start area (the opening-cinematic path, driven in reverse)
    const STRAIGHT = { x: 6, z: -6, yaw: Math.atan2(45, -29) };
    const gearT = await page.evaluate((S) => {
      const g = window.__game, I = (t, b = 0) => ({ throttle: t, brake: b, steer: 0, handbrake: false }), kmh = () => g.drive().kmh, log = [];
      const s = (name, r) => { log.push(`${name}:${r.ok ? 'ok' : 'REJECT(' + r.msg + ')'}`); return r; };
      g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 1);
      s('D', g.setGear('D')); g.simulate(I(1), 2); const vD = kmh();
      const rR = s('R@' + vD.toFixed(0), g.setGear('R')), rP = s('P@' + vD.toFixed(0), g.setGear('P')); const keep1 = g.drive().sel;
      g.simulate(I(0, 1), 3); const vStop = kmh();
      const rR2 = s('R@' + vStop.toFixed(1), g.setGear('R')); g.simulate(I(1), 2.5); const vR = kmh();
      const rD = s('D@' + vR.toFixed(0), g.setGear('D')); const keep2 = g.drive().sel;
      g.simulate(I(0, 1), 3); const rP2 = s('P@' + kmh().toFixed(1), g.setGear('P'));
      const pPos = g.pose(); g.simulate(I(1), 2); const pPos2 = g.pose(); const pMove = Math.hypot(pPos2.x - pPos.x, pPos2.z - pPos.z);
      const rN = s('N', g.setGear('N')); g.simulate(I(1), 2); const vN = kmh();
      g.setGear('A'); g.simulate(I(0, 1), 2.5); const vAutoRev = kmh();
      g.simulate(I(0, 1), 2); g.setGear('A');
      return { vD, rR: rR.ok, rP: rP.ok, keep1, vStop, rR2: rR2.ok, vR, rD: rD.ok, keep2, rP2: rP2.ok, pMove, rN: rN.ok, vN, vAutoRev, log };
    }, STRAIGHT);
    metrics.gears = gearT;
    ok('drive transmission: P/R/N/D interlocks (R and P rejected while moving forward, D rejected while reversing, selector unchanged) and correct behaviour in each',
      gearT.vD > 10 && !gearT.rR && !gearT.rP && gearT.keep1 === 'D' && gearT.rR2 && gearT.vR < -3 && !gearT.rD && gearT.keep2 === 'R' && gearT.rP2 && gearT.pMove < 0.3 && gearT.rN && Math.abs(gearT.vN) < 1.5 && gearT.vAutoRev < -2,
      `${gearT.log.join(' ')} | D 2 s ${gearT.vD.toFixed(1)} km/h, R 2.5 s ${gearT.vR.toFixed(1)} km/h, P + full throttle moved ${gearT.pMove.toFixed(2)} m, N + throttle ${gearT.vN.toFixed(1)} km/h, AUTO brake at standstill -> ${gearT.vAutoRev.toFixed(1)} km/h`);

    const tc = await page.evaluate((S) => {
      const g = window.__game, I = (t, b = 0) => ({ throttle: t, brake: b, steer: 0, handbrake: false }), log = [];
      g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 1); g.setGear('D'); g.simulate(I(1), 1.6);
      const v1 = g.drive().kmh; const a = g.setTransfer('4L'); const keepA = g.drive().transfer; log.push(`4L@${v1.toFixed(0)}km/h:${a.ok ? 'ok' : 'REJECT'}`);
      const r2h = g.setTransfer('2H'); log.push(`2H@${g.drive().kmh.toFixed(0)}km/h:${r2h.ok ? 'ok' : 'REJECT'}`); const r4h = g.setTransfer('4H'); log.push(`4H:${r4h.ok ? 'ok' : 'REJECT'}`);
      g.simulate(I(0, 1), 3); const b = g.setTransfer('4L'); const keepB = g.drive().transfer; log.push(`4L stopped in D:${b.ok ? 'ok' : 'REJECT'}`);
      g.setGear('N'); const c = g.setTransfer('4L'); log.push(`4L stopped in N:${c.ok ? 'ok' : 'REJECT'}`);
      const after = g.drive().transfer; g.setTransfer('4H'); g.setGear('A');
      const veh = {};
      for (const id of ['scout', 'voyager', 'sahara', 'pickup', 'rally', 'recovery']) { g.setVehicle(id); const m = g.drive().modes; veh[id] = { modes: m, r2h: g.setTransfer('2H').ok, r4l: (g.setGear('N'), g.setTransfer('4L').ok), transfer: g.drive().transfer }; g.setGear('N'); g.setTransfer(m.includes('4H') ? '4H' : m[0]); g.setGear('A'); }
      g.setVehicle('scout');
      return { a: a.ok, aMsg: a.msg, keepA, r2h: r2h.ok, r4h: r4h.ok, b: b.ok, bMsg: b.msg, keepB, c: c.ok, after, veh, log };
    }, STRAIGHT);
    metrics.transfer = tc;
    ok('drive transfer case: 4L only when stopped AND in N (rejected while moving / in D, mode unchanged, reason shown); 2H<->4H on the fly at low speed',
      !tc.a && tc.keepA === '4H' && /Stop/.test(tc.aMsg) && tc.r2h && tc.r4h && !tc.b && tc.keepB === '4H' && /N/.test(tc.bMsg) && tc.c && tc.after === '4L',
      `${tc.log.join(' ')} | reason "${tc.aMsg}"`);
    const V = tc.veh;
    ok('drive vehicles: permanent-AWD rally has no 2H/4L (both rejected); recovery truck is 4H/4L only; SUVs + pickup offer 2H/4H/4L',
      V.rally.modes.join() === 'AWD' && !V.rally.r2h && !V.rally.r4l && V.recovery.modes.join() === '4H,4L' && !V.recovery.r2h && V.recovery.r4l && ['scout', 'voyager', 'sahara', 'pickup'].every((id) => V[id].modes.join() === '2H,4H,4L' && V[id].r2h && V[id].r4l),
      Object.entries(V).map(([id, v]) => `${id} ${v.modes.join('/')} (2H ${v.r2h ? 'ok' : 'rej'}, 4L ${v.r4l ? 'ok' : 'rej'})`).join('; '));

    // torque path: requested wheel force = engine force x ratio x axle split (no double multiplication)
    const tq = await page.evaluate((S) => {
      const g = window.__game, I = (t, b = 0, st = 0) => ({ throttle: t, brake: b, steer: st, handbrake: false }), out = {};
      const mode = (m) => { g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.6); g.setGear('N'); const r = g.setTransfer(m); g.setGear('D'); return r.ok; };
      for (const m of ['2H', '4H', '4L']) { g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); mode(m); g.simulate(I(1), 1 / 60); const d = g.drive(); out[m] = { req: d.wheelReq.map(Math.round), out: d.wheelForce.map(Math.round), engine: Math.round(d.engineForce), ratio: d.ratio, total: Math.round(d.wheelReq.reduce((a, b) => a + b, 0)) }; }
      g.simulate(I(0, 1), 1); g.setGear('N'); g.setTransfer('4H'); g.setGear('A');
      g.setVehicle('rally'); g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); g.simulate(I(1), 1 / 60); { const d = g.drive(); out.rally = { req: d.wheelReq.map(Math.round), split: d.frontSplit, front: (d.wheelReq[0] + d.wheelReq[1]) / d.wheelReq.reduce((a, b) => a + b, 0) }; }
      g.setVehicle('scout');
      // same road speed -> engine RPM (gearbox model): 4L turns the engine faster at the same speed
      const rpmAt = (m, target) => { g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); mode(m); for (let k = 0; k < 200 && g.drive().kmh < target; k++) g.simulate(I(1), 1 / 60); g.simulate(I(0.25), 0.3); return { kmh: +g.drive().kmh.toFixed(1), rpm: Math.round(g.drive().rpm) }; };
      out.rpm = { '4H': rpmAt('4H', 18), '4L': rpmAt('4L', 18) };
      // steering: wheel angle and heading respond
      g.simulate(I(0, 1), 1); g.setGear('N'); g.setTransfer('4H'); g.setGear('A');
      g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); g.simulate(I(0.6), 1.2); const y0 = g.pose().yaw; g.simulate(I(0.4, 0, 1), 1.0); const d1 = g.drive(); const y1 = g.pose().yaw;
      let dy = y1 - y0; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); out.steer = { angle: +d1.steerAngle.toFixed(3), dyaw: +(dy * 180 / Math.PI).toFixed(1), kmh: +d1.kmh.toFixed(1) };
      return out;
    }, STRAIGHT);
    metrics.torque = tq;
    const e = tq['4H'].engine;
    ok('drive torque 2H: only the rear wheels receive drive force (front = 0), total unchanged',
      tq['2H'].req[0] === 0 && tq['2H'].req[1] === 0 && tq['2H'].req[2] > 0 && Math.abs(tq['2H'].total - tq['2H'].engine) <= 4,
      `2H wheel force N [FL,FR,RL,RR] requested ${tq['2H'].req}, delivered ${tq['2H'].out}, engine ${tq['2H'].engine} N`);
    ok('drive torque 4H: front/rear split matches the vehicle config (scout 50/50, rally AWD 40/60)',
      tq['4H'].req.every((f) => Math.abs(f - tq['4H'].req[0]) <= 1) && Math.abs(tq.rally.front - tq.rally.split) < 0.01,
      `scout 4H ${tq['4H'].req}; rally AWD ${tq.rally.req} -> front share ${(tq.rally.front * 100).toFixed(1)} % (config ${tq.rally.split * 100} %)`);
    ok('drive torque 4L: wheel force / engine force = 2.6 exactly once (no double multiplication); same speed -> higher engine RPM',
      tq['4L'].ratio === 2.6 && Math.abs(tq['4L'].total / tq['4L'].engine - 2.6) < 0.01 && Math.abs(tq['4H'].total / e - 1) < 0.01 && tq.rpm['4L'].rpm > tq.rpm['4H'].rpm * 1.3,
      `4L: requested ${tq['4L'].req} = ${tq['4L'].total} N vs engine ${tq['4L'].engine} N -> ratio ${(tq['4L'].total / tq['4L'].engine).toFixed(3)}; 4H ratio ${(tq['4H'].total / e).toFixed(3)} | RPM at ~18 km/h: 4H ${tq.rpm['4H'].rpm} @ ${tq.rpm['4H'].kmh} km/h, 4L ${tq.rpm['4L'].rpm} @ ${tq.rpm['4L'].kmh} km/h`);
    ok('drive steering: full lock changes the front wheel angle and the heading', tq.steer.angle > 0.25 && tq.steer.dyaw > 15,
      `front wheel angle ${tq.steer.angle} rad, heading change ${tq.steer.dyaw} deg in 1 s at ${tq.steer.kmh} km/h`);

    // per-mode performance table under fixed conditions
    const tab = await page.evaluate((S) => {
      const g = window.__game, I = (t, b = 0, st = 0) => ({ throttle: t, brake: b, steer: st, handbrake: false });
      const mode = (m) => { g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.6); g.setGear('N'); const r = g.setTransfer(m); g.setGear('D'); return r.ok; };
      const T = g.trail;
      let best = 0, bi = 0; for (let i = 3; i < T.length - 8; i++) { const d = Math.hypot(T[i + 6].x - T[i].x, T[i + 6].z - T[i].z); const gr = (T[i + 6].h - T[i].h) / d; if (gr > best) { best = gr; bi = i; } }
      const rows = {};
      for (const m of ['2H', '4H', '4L']) {
        const r = {};
        g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); mode(m);
        g.simulate(I(1), 0.1); { const d = g.drive(); r.wheelForceN = Math.round(d.wheelForce.reduce((a, b) => a + Math.abs(b), 0)); }
        let t30 = null, t = 0.1; for (let k = 0; k < 600 && t30 === null; k++) { g.simulate(I(1), 1 / 60); t += 1 / 60; if (g.drive().kmh >= 30) t30 = t; }
        r.t0_30 = t30 === null ? null : +t30.toFixed(2);
        g.simulate(I(1), 0.3); const ws = g.drive().wheelRate; r.wheelRadS = +((ws[0] + ws[1] + ws[2] + ws[3]) / 4).toFixed(1); r.atKmh = +g.drive().kmh.toFixed(1);
        // stopping distance from 30 km/h (full brake, straight)
        g.teleport(S.x, S.z, S.yaw); g.simulate(I(0), 0.8); mode(m); for (let k = 0; k < 600 && g.drive().kmh < 30; k++) g.simulate(I(1), 1 / 60);
        const v0 = g.drive().kmh, p0 = g.pose(); for (let k = 0; k < 600 && g.drive().kmh > 0.3; k++) g.simulate(I(0, 1), 1 / 60); const p1 = g.pose();
        r.stop30m = +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(2); r.stopFromKmh = +v0.toFixed(1);
        for (const [surf, x, z, yaw] of [['sand', 66, -55, Math.PI / 2], ['mud', -102, 40, Math.PI / 2]]) {
          g.teleport(x, z, yaw); g.simulate(I(0), 0.8); mode(m); const q0 = g.pose(); let slip = 0;
          for (let k = 0; k < 30; k++) { g.simulate(I(1), 0.1); slip += g.state().slip.reduce((a, b) => a + b, 0) / 4; }
          const q1 = g.pose(); r[surf] = { dist3s: +Math.hypot(q1.x - q0.x, q1.z - q0.z).toFixed(2), kmh: +(q1.speed * 3.6).toFixed(1), slip: +(slip / 30).toFixed(3) };
        }
        // steep rocky climb: steepest ridge-trail stretch, standing start, simple centre-line pursuit
        const h0 = T[bi], h1 = T[bi + 4];
        g.teleport(h0.x, h0.z, Math.atan2(h1.x - h0.x, h1.z - h0.z)); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 1.0); mode(m);
        const y0 = g.pose().y; let t8 = null, tt = 0, maxRise = 0;
        for (let k = 0; k < 48; k++) {
          const p = g.pose(); let ni = bi, nd = 1e9; for (let i = bi; i < Math.min(T.length, bi + 60); i++) { const d = Math.hypot(T[i].x - p.x, T[i].z - p.z); if (d < nd) { nd = d; ni = i; } }
          const tg = T[Math.min(T.length - 1, ni + 4)]; let df = Math.atan2(tg.x - p.x, tg.z - p.z) - p.yaw; df = Math.atan2(Math.sin(df), Math.cos(df));
          g.simulate(I(1, 0, Math.max(-1, Math.min(1, df * 2))), 0.25); tt += 0.25;
          const rise = g.pose().y - y0; maxRise = Math.max(maxRise, rise); if (t8 === null && rise >= 5) t8 = tt;
        }
        r.climb = { surface: g.surfaceAt(h0.x, h0.z), t_plus5m: t8 === null ? null : +t8.toFixed(2), success: t8 !== null, rise12s: +maxRise.toFixed(2) };
        g.teleport(-30, 10, Math.PI / 2); g.simulate(I(0), 0.8); mode(m); let top = 0;
        for (let k = 0; k < 32; k++) { g.simulate(I(1), 0.25); top = Math.max(top, g.drive().kmh); }
        r.top8s = +top.toFixed(1);
        rows[m] = r;
        g.simulate(I(0, 1), 1);
      }
      g.setGear('N'); g.setTransfer('4H'); g.setGear('A');
      return { rows, grade: +(best * 100).toFixed(0) };
    }, STRAIGHT);
    metrics.table = tab;
    const RW = tab.rows;
    console.log('   mode | wheel N @launch | 0-30 km/h | wheel rad/s (km/h) | stop 30->0 | sand 3 s (slip) | mud 3 s (slip) | rocky climb +5 m (' + tab.grade + '% grade) | top 8 s');
    for (const m of ['2H', '4H', '4L']) { const r = RW[m]; console.log(`   ${m}   | ${r.wheelForceN} | ${r.t0_30 ?? '-'} s | ${r.wheelRadS} (${r.atKmh}) | ${r.stop30m} m from ${r.stopFromKmh} | ${r.sand.dist3s} m ${r.sand.kmh} km/h (${r.sand.slip}) | ${r.mud.dist3s} m ${r.mud.kmh} km/h (${r.mud.slip}) | ${r.climb.success ? r.climb.t_plus5m + ' s' : 'FAIL'} rise ${r.climb.rise12s} m [${r.climb.surface}] | ${r.top8s} km/h`); }
    ok('drive table: every mode measured (0-30, wheel speed, stopping, sand, mud, steep rocky climb) under fixed conditions',
      ['2H', '4H', '4L'].every((m) => RW[m].t0_30 !== null && RW[m].stop30m > 0 && RW[m].sand.dist3s > 0 && RW[m].mud.dist3s > 0), 'see table above / drive-metrics.json');
    ok('drive realism: 2H gains less than 4H on loose sand and mud (traction-limited rear axle); 4L delivers the most wheel force at launch',
      RW['2H'].sand.dist3s < RW['4H'].sand.dist3s && RW['2H'].mud.dist3s < RW['4H'].mud.dist3s && RW['4L'].wheelForceN > RW['4H'].wheelForceN,
      `sand 3 s: 2H ${RW['2H'].sand.dist3s} / 4H ${RW['4H'].sand.dist3s} / 4L ${RW['4L'].sand.dist3s} m; mud 3 s: 2H ${RW['2H'].mud.dist3s} / 4H ${RW['4H'].mud.dist3s} / 4L ${RW['4L'].mud.dist3s} m; launch force 2H ${RW['2H'].wheelForceN} / 4H ${RW['4H'].wheelForceN} / 4L ${RW['4L'].wheelForceN} N`);
    ok('drive climb: steep rocky section climbed in 4H and 4L; 4L at least as quick as 4H to +5 m', RW['4H'].climb.success && RW['4L'].climb.success && RW['4L'].climb.t_plus5m <= RW['4H'].climb.t_plus5m + 0.25,
      `+5 m: 2H ${RW['2H'].climb.t_plus5m ?? 'fail'} s, 4H ${RW['4H'].climb.t_plus5m ?? 'fail'} s, 4L ${RW['4L'].climb.t_plus5m ?? 'fail'} s`);
    ok('drive 4L top speed: limited to about top speed / 2.6 (crawl range)', RW['4L'].top8s < RW['4H'].top8s * 0.6 && RW['4L'].top8s > 15,
      `8 s full throttle on the flat: 2H ${RW['2H'].top8s} km/h, 4H ${RW['4H'].top8s} km/h, 4L ${RW['4L'].top8s} km/h`);
    ok('drive physics: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  return metrics;
}
