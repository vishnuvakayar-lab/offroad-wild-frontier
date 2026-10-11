// Rework acceptance block: career levels (L1 Desert Training end to end), tilt / touch-halves / auto-throttle controls
// (iOS permission API + deviceorientation are STUBBED in headless Chrome: real-device sensor behaviour is unverified),
// persistence of points / level completion / unlocked vehicles across reloads, points-based garage unlock, biome detail presets,
// WebGL context-loss overlay. Runs inside tests/acceptance.mjs and standalone (tests/rework.mjs).
import fs from 'node:fs';
const SH = new URL('../screenshots/rework/', import.meta.url).pathname;
fs.mkdirSync(SH, { recursive: true });
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** installs a fake iOS DeviceOrientationEvent.requestPermission (answer: 'granted' | 'denied' | null = API absent) */
const stubPermission = (page, answer) => page.evaluate((answer) => {
  window.__perm = { asked: 0 };
  if (answer === null) { try { delete DeviceOrientationEvent.requestPermission; } catch {} return; }
  DeviceOrientationEvent.requestPermission = () => { window.__perm.asked++; return Promise.resolve(answer); };
}, answer);
const orient = (page, beta, gamma) => page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: b, gamma: g })), [beta, gamma]);
const ctl = (page) => page.evaluate(() => window.__game.controls());
const inp = (page) => page.evaluate(() => window.__game.readInput());
const pose = (page) => page.evaluate(() => window.__game.pose());
async function zone(page, side, type, id) {
  const r = await page.locator(`#tzones .tz.${side}`).boundingBox();
  await page.dispatchEvent(`#tzones .tz.${side}`, type, { pointerId: id, pointerType: 'touch', isPrimary: id === 1, bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 });
}
async function startL1ByTap(page) {
  await page.tap('#btn-levels'); await page.waitForTimeout(400);
  await page.tap('#lv-list [data-level="lv1-desert-training"]');
  await page.waitForFunction(() => window.__game.phase === 'playing' && window.__game.mission?.id === 'lv1-desert-training');
}

export async function runRework({ openPage, ok, area }) {
  const metrics = {};

  // ---------- R1-R2: career panel + L1 on iPhone portrait with tilt steering (stubbed sensors) ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPHONE_UA }, 'rework-portrait');
    const c0 = await ctl(page);
    ok('rework controls: mobile default = touch halves with auto-forward (no wheel / pedals by default)', c0.setting === 'halves' && c0.auto === true, JSON.stringify(c0));
    await page.tap('#btn-levels'); await page.waitForTimeout(500);
    const cards = await page.$$eval('#lv-list .lv-card', (cs) => cs.map((c) => ({ n: +c.dataset.n, st: c.querySelector('.st').className.split(' ')[1], locked: c.classList.contains('locked'), start: !!c.querySelector('[data-level]') })));
    const cnt = (s) => cards.filter((c) => c.st === s).length;
    const lvA = await area(page, '#levels');
    await page.screenshot({ path: SH + 'career-portrait.png' });
    ok('rework career: 10 levels with honest status labels, L1 startable, L2 locked at start', cards.length === 10 && cnt('playable') === 2 && cnt('prototype') === 3 && cnt('online') === 2 && cnt('planned') === 3 && cards[0].start && !cards[0].locked && cards[1].locked && !cards[1].start && lvA < 0.7,
      `playable ${cnt('playable')}, prototype ${cnt('prototype')}, online ${cnt('online')}, planned ${cnt('planned')}; panel ${(lvA * 100).toFixed(0)}%`);
    await page.tap('#lv-back'); await page.waitForTimeout(300);
    await stubPermission(page, 'granted');
    await page.evaluate(() => window.__game.setControls('tilt', true)); // tilt is optional: permission is only asked once it is chosen
    await startL1ByTap(page);
    await orient(page, 20, 0); // a real phone streams sensor samples right after permission is granted
    const perm = await page.evaluate(() => window.__perm.asked);
    await page.evaluate(() => window.__game.skipCountdown());
    await orient(page, 20, 0); await page.waitForTimeout(400); // neutral pose -> auto-calibrated as "straight"
    // getClientRects, not offsetParent: #ck-cal is position:fixed
    const vis = await page.evaluate(() => { const v = (id) => { const e = document.getElementById(id); return !!e && e.getClientRects().length > 0; }; return { pedals: v('pedals'), wheel: v('wheel'), cal: v('ck-cal'), zones: v('tzones') }; });
    const c1 = await ctl(page);
    ok('rework tilt: iOS requestPermission called once from the Start tap and granted; tilt mode = pedals + Centre, no wheel', perm === 1 && c1.tiltState === 'granted' && vis.pedals && !vis.wheel && vis.cal && !vis.zones, `asked ${perm}, state ${c1.tiltState}, ${JSON.stringify(vis)}`);
    const i0 = await inp(page);
    await orient(page, 20, -15); await page.waitForTimeout(150); // tilt the phone left (portrait: gamma < 0)
    const c2 = await ctl(page); await page.waitForTimeout(300); const i1 = await inp(page);
    ok('rework tilt: tilting left steers left; auto-throttle accelerates with no touch', Math.abs(i0.steer) < 0.05 && c2.tilt > 0.5 && i1.steer > 0.3 && i0.throttle === 1 && i1.throttle === 1, `neutral steer ${i0.steer.toFixed(2)}, tilt ${c2.tilt.toFixed(2)}, steer ${i1.steer.toFixed(2)}, throttle ${i1.throttle}`);
    const p0 = await pose(page); await page.waitForTimeout(3000); const p1 = await pose(page);
    let dy = p1.yaw - p0.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
    ok('rework tilt: real-time drive (auto-throttle + tilt) moves and turns the car left', moved > 5 && dy > 0.2, `moved ${moved.toFixed(1)} m, yaw ${(dy * 180 / Math.PI).toFixed(0)} deg, speed ${(p1.speed * 3.6).toFixed(0)} km/h`);
    await page.screenshot({ path: SH + 'l1-portrait-tilt.png' });
    await page.tap('#ck-cal'); await page.waitForTimeout(100);
    const c3 = await ctl(page);
    await page.dispatchEvent('#pd-brake', 'pointerdown', { pointerId: 5, pointerType: 'touch', bubbles: true }); await page.waitForTimeout(100); const i2 = await inp(page);
    await page.dispatchEvent('#pd-brake', 'pointerup', { pointerId: 5, pointerType: 'touch', bubbles: true });
    ok('rework tilt: ⟲ Centre recalibrates; BRAKE pedal overrides auto-throttle', Math.abs(c3.tilt) < 0.05 && i2.brake > 0.3 && i2.throttle === 0, `tilt after centre ${c3.tilt.toFixed(2)}, brake ${i2.brake.toFixed(2)}, throttle ${i2.throttle}`);
    ok('rework portrait: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- R3-R4: permission denied / no sensor -> touch halves fallback ----------
  for (const [label, answer] of [['denied', 'denied'], ['no sensor data', null]]) {
    const { ctx, page, errors } = await openPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: IPHONE_UA }, 'rework-' + label);
    await stubPermission(page, answer);
    await page.evaluate(() => window.__game.setControls('tilt', true));
    await startL1ByTap(page);
    await page.waitForTimeout(2300);
    const c = await ctl(page);
    const toast = await page.textContent('#toast');
    ok(`rework tilt fallback (${label}): switches to touch halves with a message`, c.scheme === 'halves' && c.fallback && c.setting === 'tilt' && /touch halves/.test(toast), `state ${c.tiltState}, scheme ${c.scheme}, toast "${toast}"`);
    if (answer === 'denied') {
      // touch halves: left = steer left (car keeps driving), both = brake/reverse
      await page.evaluate(() => { window.__game.skipCountdown(); });
      await zone(page, 'l', 'pointerdown', 1); await page.waitForTimeout(250);
      const a = await inp(page); const p0 = await pose(page); await page.waitForTimeout(2000); const p1 = await pose(page);
      let dy = p1.yaw - p0.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      await zone(page, 'r', 'pointerdown', 2); await page.waitForTimeout(150);
      const b = await inp(page); await page.waitForTimeout(3500); const p2 = await pose(page);
      await zone(page, 'l', 'pointerup', 1); await zone(page, 'r', 'pointerup', 2); await page.waitForTimeout(150);
      const cc = await inp(page);
      await page.screenshot({ path: SH + 'l1-touch-halves.png' });
      ok('rework touch halves: left half steers left while driving forward; both halves brake then reverse; release = drive on', a.steer > 0.3 && a.throttle === 1 && dy > 0.15 && b.brake === 1 && b.throttle === 0 && p2.speed < 0 && cc.throttle === 1 && cc.brake === 0,
        `left: steer ${a.steer.toFixed(2)} thr ${a.throttle}, yaw ${(dy * 180 / Math.PI).toFixed(0)} deg; both: brake ${b.brake}, speed after 3.5 s ${(p2.speed * 3.6).toFixed(1)} km/h; released thr ${cc.throttle}`);
    }
    ok(`rework tilt fallback (${label}): no console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- R5: iPhone landscape: tilt uses beta, HUD + touch layer fit ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPHONE_UA }, 'rework-landscape');
    await stubPermission(page, 'granted');
    await page.evaluate(() => window.__game.setControls('tilt', true));
    await startL1ByTap(page); await orient(page, 0, 30); await page.evaluate(() => window.__game.skipCountdown());
    const ang = await page.evaluate(() => screen.orientation?.angle ?? window.orientation ?? 0);
    await orient(page, 0, 30); await page.waitForTimeout(2000); // past the 1.8 s start-up centring window (slow SwiftShader frames can delay the first sample)
    // steering-wheel roll to the left in landscape: angle 90 -> beta decreases, angle 270 -> beta increases, 0 (emulator) -> gamma
    const roll = ang === 90 ? [-15, 30] : ang === 270 ? [15, 30] : [0, 15];
    await orient(page, roll[0], roll[1]); await page.waitForTimeout(400);
    const i = await inp(page), c = await ctl(page);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: SH + 'l1-landscape-tilt.png' });
    const fit = await page.evaluate(() => ['ck-cal', 'ck-hb', 'pd-gas', 'pd-brake', 'mhud', 'hud-speed', 'btn-pause'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }));
    ok('rework landscape: roll steers left (orientation-aware) and controls/HUD fit on screen', i.steer > 0.3 && c.tilt > 0.5 && fit.every(Boolean), `screen angle ${ang}, tilt ${c.tilt.toFixed(2)}, steer ${i.steer.toFixed(2)}, fit ${fit.join(',')}`);
    ok('rework landscape: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- R6-R8: L1 completion -> L2 unlock, points + level + vehicle persistence, points-based garage unlock ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'rework-desktop');
    await page.click('#btn-levels'); await page.waitForTimeout(300);
    await page.click('#lv-list [data-level="lv1-desert-training"]');
    await page.waitForFunction(() => window.__game.phase === 'playing');
    const mdef = await page.evaluate(() => window.__game.levelMissions.find((m) => m.id === 'lv1-desert-training'));
    const bot = await page.evaluate(() => window.__game.botRun(120, {}));
    await page.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 15000 });
    const res = await page.evaluate(() => ({ r: window.__game.results, reward: document.getElementById('r-reward').textContent, kicker: document.getElementById('r-kicker').textContent, save: window.__game.save, lv: window.__game.levelState() }));
    await page.screenshot({ path: SH + 'l1-results.png' });
    metrics.l1 = { bot: bot.t, gates: mdef.gates.length, targets: mdef.targets };
    ok('rework L1: clean bot completes Desert Training (13 gates + stop in finish circle) within gold; results show Level 2 unlocked', bot.state === 'success' && bot.t <= mdef.targets.gold && res.r.success && res.r.nextUnlocked && /Level 2 unlocked/.test(res.reward) && res.lv[1].unlocked,
      `${bot.t.toFixed(2)} s (gold ${mdef.targets.gold}), medal ${res.r.medal}, "${res.reward}", "${res.kicker}"`);
    // a human-like bot (reaction delay + noise) must at least reach bronze
    await page.evaluate(() => window.__game.startMission('lv1-desert-training'));
    const hb = await page.evaluate(() => window.__game.botRun(120, { human: true, seed: 2 }));
    ok('rework L1: human-like bot finishes within bronze', hb.state === 'success' && hb.t <= mdef.targets.bronze, `${hb.t.toFixed(2)} s (bronze ${mdef.targets.bronze})`);
    await page.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 15000 });
    const before = await page.evaluate(() => ({ save: window.__game.save, lv: window.__game.levelState() }));
    await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 }); await page.evaluate(() => window.__game.skipOpening());
    const after = await page.evaluate(() => ({ save: window.__game.save, lv: window.__game.levelState() }));
    ok('rework persistence: points, XP, L1 completion/best time and L2 unlock survive a reload', after.save.credits === before.save.credits && after.save.credits > 0 && after.save.xp === before.save.xp && after.lv[0].done && after.lv[1].unlocked && !after.lv[2].unlocked && after.save.best['lv1-desert-training']?.time === before.save.best['lv1-desert-training']?.time,
      `${after.save.credits} pts, ${after.save.xp} XP, L1 best ${after.save.best['lv1-desert-training']?.time.toFixed(2)} s, L2 unlocked ${after.lv[1].unlocked}, L3 unlocked ${after.lv[2].unlocked}`);
    // points-based vehicle unlock in the garage UI
    await page.evaluate(() => window.__game.addCredits(2000, 400)); // simulated earnings: level 3 player
    await page.click('#btn-garage'); await page.waitForTimeout(400);
    let guard = 0; while ((await page.evaluate(() => window.__game.vehicle.id)) !== 'pickup' && guard++ < 6) { await page.click('#g-next'); await page.waitForTimeout(250); }
    const pre = await page.evaluate(() => ({ lock: !document.getElementById('g-lock').classList.contains('hidden'), btn: document.getElementById('g-unlock').textContent, pts: window.__game.save.credits }));
    await page.click('#g-unlock'); await page.waitForTimeout(300);
    const post = await page.evaluate(() => ({ save: window.__game.save, lock: !document.getElementById('g-lock').classList.contains('hidden') }));
    await page.screenshot({ path: SH + 'garage-points-unlock.png' });
    ok('rework garage: vehicle unlocked with points (price deducted), lock removed', pre.lock && post.save.vehicles.includes('pickup') && !post.lock && post.save.credits === pre.pts - 1200, `"${pre.btn}" ${pre.pts} -> ${post.save.credits} pts, vehicles ${post.save.vehicles.join(',')}`);
    await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 }); await page.evaluate(() => window.__game.skipOpening());
    await page.click('#btn-play'); await page.waitForFunction(() => window.__game.phase !== 'menu'); await page.evaluate(() => window.__game.skipIntro());
    const drv = await page.evaluate(() => { const g = window.__game; const r = g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 3); return { id: g.vehicle.id, saveV: g.save.vehicles, d: r.distance, v: r.finalSpeed }; });
    ok('rework persistence: unlocked + selected vehicle survives reload and is the one that drives', drv.id === 'pickup' && drv.saveV.includes('pickup') && drv.d > 10, `${drv.id} drove ${drv.d.toFixed(1)} m in 3 s (${(drv.v * 3.6).toFixed(0)} km/h)`);
    // level rules: forced weather, stuck fail, limited recoveries
    const rules = await page.evaluate(() => { const g = window.__game, H = { throttle: 0, brake: 0, steer: 0, handbrake: true }, o = {};
      g.startMission('lv2-dune-challenge'); o.l2Weather = g.forcedWeather; g.endMission(); o.afterWeather = g.state().weather;
      g.startMission('lv3-mud-jungle'); g.skipCountdown(); g.simulate(H, 16); o.l3 = g.mission.state + ':' + g.mission.failReason;
      g.startMission('lv4-rocky-mountain'); g.skipCountdown(); g.simulate(H, 0.2); for (let i = 0; i < 4; i++) g.missionReset(); o.l4 = g.mission.state + ':' + g.mission.failReason + ':' + g.mission.resets;
      g.endMission(); return o; });
    ok('rework level rules: L2 forces sunset (restored after), L3 fails when stuck 15 s, L4 allows 3 recoveries then fails', rules.l2Weather === 'sunset' && rules.afterWeather !== 'sunset' && rules.l3 === 'fail:Stuck in the mud' && rules.l4 === 'fail:No recoveries left:3', JSON.stringify(rules));
    // biome detail scales with the preset
    await page.click('#btn-play'); await page.waitForFunction(() => window.__game.phase !== 'menu'); await page.evaluate(() => window.__game.skipIntro());
    const pres = {};
    for (const p of ['low', 'medium', 'high']) {
      await page.evaluate((p) => { window.__game.setPreset(p); window.__game.setWeather('clear'); window.__game.teleport(-30, 40, -1.6); }, p);
      await page.waitForTimeout(2500);
      const h0 = (await page.evaluate(() => window.__game.state().fpsHistory.length)); await page.waitForTimeout(3200);
      pres[p] = await page.evaluate((h0) => { const s = window.__game.state(), n = window.__game.nature(), h = s.fpsHistory.slice(h0); return { fps: +(h.length ? h.reduce((a, b) => a + b, 0) / h.length : s.fps).toFixed(1), draws: s.renderer.calls, tris: s.renderer.triangles, inst: n.instances, vis: n.visibleInstances, detail: window.__game.groundDetail()[0] }; }, h0);
    }
    metrics.presets = pres;
    ok('rework presets: Low drops ground detail + grass, High has the most vegetation (FPS on SwiftShader CPU renderer)', !pres.low.detail && pres.medium.detail && pres.high.detail && pres.low.inst < pres.medium.inst && pres.medium.inst < pres.high.inst && (await page.evaluate(() => window.__game.skyEnv())),
      Object.entries(pres).map(([k, v]) => `${k}: ${v.fps} fps, ${v.draws} draws, ${(v.tris / 1000).toFixed(0)}k tris, ${v.inst} plants`).join(' | '));
    // GPU context loss -> visible recovery overlay instead of a frozen black screen
    const lost = await page.evaluate(async () => { const gl = document.getElementById('game').getContext('webgl2'); const ext = gl.getExtension('WEBGL_lose_context'); ext.loseContext();
      await new Promise((r) => setTimeout(r, 300)); const shown = !document.getElementById('gl-lost').classList.contains('hidden'); ext.restoreContext(); await new Promise((r) => setTimeout(r, 500));
      return { shown, hidden: document.getElementById('gl-lost').classList.contains('hidden'), phase: window.__game.phase }; });
    ok('rework robustness: WebGL context loss shows a reload overlay and pauses; overlay clears on restore', lost.shown && lost.hidden && lost.phase === 'paused', JSON.stringify(lost));
    ok('rework desktop: no console errors', errors.filter((e) => !/CONTEXT_LOST|context lost/i.test(e)).length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  fs.writeFileSync(SH + 'rework-metrics.json', JSON.stringify(metrics, null, 1));
  return metrics;
}
