// Phase 6 acceptance checks: missions, results, progression, upgrades, save migration, mission HUD layout.
// Exported so it runs both inside tests/acceptance.mjs and standalone (tests/phase6.mjs).
import fs from 'node:fs';
export async function runPhase6({ openPage, ok, area }) {
  const SH = new URL('../screenshots/phase6/', import.meta.url).pathname; fs.mkdirSync(SH, { recursive: true });
  const I = (t, b, s, h) => ({ throttle: t, brake: b, steer: s, handbrake: h });
  const metrics = {};

  // ---------- A: fresh profile (no dev override) ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase6');
    // save from empty storage
    const s0 = await page.evaluate(() => ({ save: window.__game.save, raw: localStorage.getItem('owf.save'), dev: window.__game.dev, veh: window.__game.vehicle.id }));
    ok('p6 save: empty storage -> v2 defaults (Scout only, 0 cr)', s0.save.v === 2 && s0.save.credits === 0 && s0.save.xp === 0 && JSON.stringify(s0.save.vehicles) === '["scout"]' && s0.save.paints.length === 3 && !s0.dev && s0.veh === 'scout',
      `v${s0.save.v}, ${s0.save.credits} cr, vehicles ${s0.save.vehicles}, ${s0.save.paints.length} paints, dev=${s0.dev}`);

    // mode select UI
    await page.click('#btn-modes'); await page.waitForFunction(() => window.__game.phase === 'modes');
    const tabs = await page.$$eval('#m-tabs button', (b) => b.map((x) => x.textContent.trim()));
    const counts = {};
    for (const m of ['free', 'challenge', 'race', 'rescue']) { await page.click(`#m-tabs [data-mode=${m}]`); counts[m] = await page.$$eval('#m-list .m-card', (c) => c.length); }
    const modesA = await area(page, '#modes');
    ok('p6 mode select: 4 modes, >=2 missions each, panel leaves game visible', tabs.length === 4 && counts.race >= 2 && counts.challenge >= 2 && counts.rescue >= 2 && counts.free === 1 && modesA < 0.45,
      `tabs [${tabs.join(' | ')}], cards ${JSON.stringify(counts)}, panel ${(modesA * 100).toFixed(0)}% of 1280x720`);
    // start a race from the UI -> countdown blocks driving
    await page.click('#m-tabs [data-mode=race]'); await page.click('#m-list [data-start=race-dash]');
    await page.waitForFunction(() => window.__game.phase === 'playing');
    const cd = await page.evaluate(() => { const g = window.__game, p0 = g.pose(), m0 = g.mission; g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 1); const p1 = g.pose(), m1 = g.mission;
      g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: false }, 2.2); const m2 = g.mission; return { s0: m0.state, c0: m0.countdown, moved: Math.hypot(p1.x - p0.x, p1.z - p0.z), s1: m1.state, t1: m1.t, s2: m2.state, t2: m2.t, cdVisible: !document.getElementById('countdown').classList.contains('hidden') }; });
    // (render frames also tick between evaluate calls, so the timer can be a few frames past 0.2 s)
    ok('p6 race: 3 s countdown holds the car, then timer starts', cd.s0 === 'countdown' && cd.c0 > 2.5 && cd.moved < 0.6 && cd.s1 === 'countdown' && cd.s2 === 'running' && cd.t2 > 0 && cd.t2 < 0.6 && cd.cdVisible,
      `state ${cd.s0}(${cd.c0.toFixed(1)}s) -> after 1 s full throttle moved ${cd.moved.toFixed(2)} m, still ${cd.s1}; after 3.2 s ${cd.s2}, t=${cd.t2.toFixed(2)} s`);
    // timer accuracy (fixed-step simulated seconds)
    const tm = await page.evaluate(() => { const g = window.__game, a = g.mission.t; g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 2); return g.mission.t - a; });
    ok('p6 timer: advances with simulated time', Math.abs(tm - 2) < 0.02, `2.00 s simulated -> timer +${tm.toFixed(3)} s`);

    // out-of-order + wrong way + reset to last checkpoint (Canyon Dash)
    const oo = await page.evaluate(() => {
      const g = window.__game, def = g.missions.find((m) => m.id === 'race-dash'), G = def.gates;
      const through = (gt, back = false) => { const y = back ? gt.yaw + Math.PI : gt.yaw, d = 3; g.teleport(gt.x - Math.sin(y) * d, gt.z - Math.cos(y) * d, y); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 2); };
      g.startMission('race-dash'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.1);
      through(G[2]); const a = g.mission;                          // skip gates 1-2
      g.startMission('race-dash'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.1);
      through(G[0], true); const b = g.mission;                    // fresh run: gate 1 the wrong way
      through(G[0]); const c = g.mission;                          // gate 1 correctly
      g.teleport(def.start.x + 30, def.start.z + 30, 0); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.3);
      g.missionReset(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.3); const p = g.pose(), d = g.mission;
      return { a, b, c, d, resetDist: Math.hypot(p.x - G[0].x, p.z - G[0].z), resetYawErr: Math.abs(Math.atan2(Math.sin(p.yaw - G[0].yaw), Math.cos(p.yaw - G[0].yaw))) };
    });
    ok('p6 race: out-of-order checkpoint rejected', oo.a.next === 0 && oo.a.rejected === 1 && oo.a.splits.length === 0 && oo.a.log.some((x) => /Missed checkpoint 1/.test(x)), `after crossing gate 3 first: next=${oo.a.next}, rejected=${oo.a.rejected}, messages [${oo.a.log.join(' | ')}]`);
    ok('p6 race: wrong-way crossing flagged, not counted', oo.b.next === 0 && oo.b.log.some((x) => /Wrong way/.test(x)) && oo.b.splits.length === 0, `fresh run, backwards through gate 1: next=${oo.b.next}, messages [${oo.b.log.join(' | ')}]`);
    ok('p6 race: in-order checkpoint accepted with split', oo.c.next === 1 && oo.c.splits.length === 1 && oo.c.splits[0] > 0, `next=${oo.c.next}, split ${oo.c.splits[0]?.toFixed(2)} s`);
    ok('p6 race: reset returns to last checkpoint facing the course', oo.d.resets === 1 && oo.resetDist < 8 && oo.resetYawErr < 0.3 && oo.d.state === 'running', `resets=${oo.d.resets}, ${oo.resetDist.toFixed(1)} m from gate 1, yaw error ${(oo.resetYawErr * 57.3).toFixed(0)}°`);

    // teleport through every gate in order -> finish (both races)
    const tp = await page.evaluate(() => {
      const g = window.__game, out = {};
      for (const id of ['race-loop', 'race-dash']) {
        const def = g.missions.find((m) => m.id === id); g.startMission(id); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.05);
        for (const gt of def.gates) { g.teleport(gt.x - Math.sin(gt.yaw) * 4, gt.z - Math.cos(gt.yaw) * 4, gt.yaw); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 2); }
        const m = g.mission; out[id] = { state: m.state, next: m.next, n: def.gates.length, splits: m.splits.length, rejected: m.rejected };
      }
      g.endMission(); return out;
    });
    ok('p6 races: teleporting through gates in order completes both routes', Object.values(tp).every((r) => r.state === 'success' && r.next === r.n && r.splits === r.n && r.rejected === 0), JSON.stringify(tp));

    // bot-driven runs: both races -> results screen, credits, best time, medal
    const runs = {};
    for (const id of ['race-dash', 'race-loop']) {
      const b = await page.evaluate((id) => { const g = window.__game; g.startMission(id); return g.botRun(90); }, id);
      await page.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 20000 });
      runs[id] = { ...b, results: await page.evaluate(() => window.__game.results), save: await page.evaluate(() => window.__game.save) };
      if (id === 'race-dash') { await page.waitForTimeout(600); await page.screenshot({ path: SH + 'test-results-race-dash.png' }); }
    }
    metrics.raceBot = Object.fromEntries(Object.entries(runs).map(([k, r]) => [k, { t: +r.t.toFixed(2), medal: r.results.medal, splits: r.splits.map((x) => +x.toFixed(2)) }]));
    ok('p6 races: bot completes both routes (gates in order, no rejections)', Object.values(runs).every((r) => r.state === 'success' && r.rejected === 0),
      Object.entries(runs).map(([k, r]) => `${k} ${r.t.toFixed(2)} s, ${r.splits.length} splits, ${r.results.medal}`).join('; '));
    const rd = runs['race-dash'], rl = runs['race-loop'];
    const resUI = await page.evaluate(() => ({ title: document.getElementById('r-title').textContent, medal: document.getElementById('r-medal').textContent, reward: document.getElementById('r-reward').textContent, btns: ['r-retry', 'r-next', 'r-menu'].every((id) => document.getElementById(id).getBoundingClientRect().width > 0) }));
    const resA = await area(page, '#results');
    ok('p6 results: medal, reward and retry/next/menu shown', /complete/.test(resUI.title) && /gold|silver|bronze/.test(resUI.medal) && /points|credits/.test(resUI.reward) && resUI.btns && resA < 0.6,
      `"${resUI.title}" ${resUI.medal.replace(/\s+/g, ' ')} · ${resUI.reward}; panel ${(resA * 100).toFixed(0)}%`);
    const expCredits = rd.results.credits + rl.results.credits;
    const RW = await page.evaluate(() => window.__game.missions.find((m) => m.id === 'race-dash').reward); // 6b: reward read from the mission (was hard-coded 300)
    ok('p6 progression: credits/XP awarded by medal', rd.results.credits === Math.round(RW * { gold: 2, silver: 1.5, bronze: 1.2, none: 1 }[rd.results.medal]) && rl.save.credits === expCredits && rl.save.xp === rd.results.xp + rl.results.xp && rl.save.runs === 2,
      `race-dash ${rd.results.medal} +${rd.results.credits} cr/+${rd.results.xp} XP, race-loop ${rl.results.medal} +${rl.results.credits} cr/+${rl.results.xp} XP -> ${rl.save.credits} cr, ${rl.save.xp} XP`);
    ok('p6 results: best time + medal stored', rl.save.best['race-dash']?.time === rd.results.time && rl.save.best['race-dash'].medal === rd.results.medal && rl.save.best['race-dash'].splits?.length === rd.splits.length && rd.splits.length >= 7, // 6b: Canyon Dash now has 13 gates
      `best race-dash ${rl.save.best['race-dash']?.time.toFixed(2)} s ${rl.save.best['race-dash']?.medal}, splits ${rl.save.best['race-dash']?.splits?.length}`);
    // retry button restarts the same mission; "next" moves on
    await page.click('#r-retry'); const rt = await page.evaluate(() => ({ ph: window.__game.phase, m: window.__game.mission }));
    await page.evaluate(() => { const g = window.__game; g.botRun(90); }); await page.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 20000 });
    const slower = await page.evaluate(() => window.__game.results);
    await page.click('#r-next'); const nx = await page.evaluate(() => window.__game.mission?.id);
    ok('p6 results: retry restarts same mission, next goes to the following one', rt.ph === 'playing' && rt.m.id === 'race-loop' && rt.m.state === 'countdown' && nx && nx !== 'race-loop',
      `retry -> ${rt.m.id} (${rt.m.state}); next -> ${nx}; repeat run ${slower.time.toFixed(2)} s newBest=${slower.newBest}`);

    // medal thresholds
    const md = await page.evaluate(() => { const g = window.__game, T = g.missions.find((m) => m.id === 'race-dash').targets; return { T, r: [T.gold - 0.01, T.gold, T.gold + 0.01, T.silver, T.silver + 0.01, T.bronze, T.bronze + 0.01].map((t) => g.medalFor(t, 'race-dash')) }; });
    ok('p6 medals: thresholds gold<=silver<=bronze inclusive', md.r.join() === 'gold,gold,silver,silver,bronze,bronze,none', `targets ${JSON.stringify(md.T)} -> ${md.r.join(', ')}`);

    // challenges
    const ch = await page.evaluate(() => {
      const g = window.__game, out = {};
      g.startMission('ch-mud'); out.mudOk = g.botRun(30);
      g.startMission('ch-mud'); g.skipCountdown(); g.simulate({ throttle: 1, brake: 0, steer: 0, handbrake: false }, 2); g.missionReset(); out.mudReset = g.mission;
      g.startMission('ch-mud'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 30.2); out.mudTime = g.mission; // 6b: limit 18 -> 30 s
      g.startMission('ch-climb'); out.climbOk = g.botRun(150); out.climbPose = g.pose(); // 6b: switchback climb ~50 s
      g.startMission('ch-climb'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 150.2); out.climbTime = g.mission; // 6b: limit 20 -> 150 s
      g.startMission('ch-climb'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.2);
      g.flip(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 3.5); out.climbFlip = g.mission;
      g.endMission(); return out;
    });
    metrics.challenges = { mud: +ch.mudOk.t.toFixed(2), climb: +ch.climbOk.t.toFixed(2) };
    ok('p6 challenge mud: bot crosses both gates in time without reset', ch.mudOk.state === 'success' && ch.mudOk.next === 2, `${ch.mudOk.state} in ${ch.mudOk.t.toFixed(2)} s (limit 30 s)`);
    ok('p6 challenge mud: reset = fail, timeout = fail', ch.mudReset.state === 'fail' && ch.mudTime.state === 'fail', `reset -> ${ch.mudReset.state} ("${ch.mudReset.failReason}"); idle 30.2 s -> ${ch.mudTime.state} ("${ch.mudTime.failReason}")`);
    ok('p6 challenge climb: bot reaches summit flag', ch.climbOk.state === 'success' && ch.climbPose.y > 15, `${ch.climbOk.state} in ${ch.climbOk.t.toFixed(2)} s, summit y=${ch.climbPose.y.toFixed(1)} m`);
    ok('p6 challenge climb: timeout and rollover fail', ch.climbTime.state === 'fail' && ch.climbFlip.state === 'fail', `idle 150.2 s -> "${ch.climbTime.failReason}"; rolled over -> "${ch.climbFlip.failReason}"`);

    // rescue: tow (rope joint) + delivery
    await page.evaluate(() => window.__game.startMission('rs-tow'));
    const tw0 = await page.evaluate(() => { const g = window.__game, def = g.missions.find((m) => m.id === 'rs-tow'); g.skipCountdown();
      const a = g.stuckPos(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 5); const b = g.stuckPos();
      const far = g.hook();
      // reverse up to the stuck 4x4's front bumper
      g.teleport(def.stuck.x + 8.5, def.stuck.z, def.stuck.yaw); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.5);
      return { a, b, far, zone: def.zone }; });
    await page.keyboard.press('h'); await page.waitForTimeout(200);
    const tw1 = await page.evaluate(() => { const g = window.__game, m0 = g.mission; const a = g.stuckPos(); const r = g.botRun(150); const b = g.stuckPos(); return { m0, a, r, b }; });
    const zd = Math.hypot(tw1.b.x - tw0.zone.x, tw1.b.z - tw0.zone.z);
    metrics.tow = { t: +tw1.r.t.toFixed(2), moved: +Math.hypot(tw1.b.x - tw1.a.x, tw1.b.z - tw1.a.z).toFixed(1), zoneDist: +zd.toFixed(2) };
    ok('p6 tow: stuck 4x4 stays put in the mud on its own', Math.hypot(tw0.b.x - tw0.a.x, tw0.b.z - tw0.a.z) < 0.5 && tw0.a.surface === 'mud' && tw0.far === false,
      `drift ${Math.hypot(tw0.b.x - tw0.a.x, tw0.b.z - tw0.a.z).toFixed(2)} m in 5 s on ${tw0.a.surface}; hook from start refused`);
    ok('p6 tow: H attaches the rope joint, towing drags the 4x4 into the safe zone', tw1.m0.attached && tw1.m0.ropeLen > 2 && tw1.r.state === 'success' && zd <= tw0.zone.r - 2 && metrics.tow.moved > 25, // 6b: must be well inside (<= r-2 m)
      `attached (rope ${tw1.m0.ropeLen.toFixed(1)} m); stuck vehicle moved ${metrics.tow.moved} m, ends ${zd.toFixed(1)} m from safe-zone centre (r=${tw0.zone.r}) in ${tw1.r.t.toFixed(1)} s`);
    const dv = await page.evaluate(() => { const g = window.__game, out = {};
      g.startMission('rs-deliver'); out.ok = g.botRun(120, { slowZone: true }); // 6b: route ~45-65 s
      g.startMission('rs-deliver'); g.skipCountdown(); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 120.2); out.late = g.mission; // 6b: limit 25 -> 120 s
      g.endMission(); return out; });
    metrics.deliver = +dv.ok.t.toFixed(2);
    ok('p6 deliver: bot reaches camp and stops before dark; idle -> night fail', dv.ok.state === 'success' && dv.late.state === 'fail' && /night|dark/i.test(dv.late.failReason),
      `delivered in ${dv.ok.t.toFixed(2)} s (limit 120 s); idle -> "${dv.late.failReason}"`);

    // unlock with earned credits; persistence across reload
    const before = await page.evaluate(() => window.__game.save);
    await page.click('#btn-garage'); await page.waitForFunction(() => window.__game.phase === 'garage');
    while ((await page.evaluate(() => window.__game.vehicle.id)) !== 'pickup') await page.click('#g-next');
    await page.waitForTimeout(300);
    const lockUI = await page.evaluate(() => ({ lockShown: !document.getElementById('g-lock').classList.contains('hidden'), driveDisabled: document.getElementById('g-drive').disabled, text: document.getElementById('g-lock-text').textContent }));
    await page.screenshot({ path: SH + 'test-garage-locked.png' });
    await page.click('#g-unlock'); await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({ s: window.__game.save, lockShown: !document.getElementById('g-lock').classList.contains('hidden'), driveDisabled: document.getElementById('g-drive').disabled }));
    ok('p6 unlock: locked vehicle blocks Drive; unlocking spends earned credits', lockUI.lockShown && lockUI.driveDisabled && !after.lockShown && !after.driveDisabled && after.s.vehicles.includes('pickup') && after.s.credits === before.credits - 1200,
      `pickup locked ("${lockUI.text}"), ${before.credits} cr / Lv ${1 + Math.floor(before.xp / 300)} -> unlocked, ${after.s.credits} cr left`);
    await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 }); await page.evaluate(() => window.__game.skipOpening());
    const rl2 = await page.evaluate(() => ({ s: window.__game.save, v: window.__game.vehicle.id }));
    ok('p6 persistence: credits, XP, unlocks and best times survive reload', rl2.s.vehicles.includes('pickup') && rl2.s.credits === after.s.credits && rl2.s.xp === after.s.xp && rl2.s.best['race-dash'] && rl2.v === 'pickup',
      `after reload: ${rl2.s.credits} cr, ${rl2.s.xp} XP, vehicles ${rl2.s.vehicles}, best ${Object.keys(rl2.s.best).join(',')}, driving ${rl2.v}`);
    ok('p6: no console errors (fresh profile)', errors.length === 0, errors.slice(0, 5).join(' | '));
    await ctx.close();
  }

  // ---------- B: upgrades change physics measurably ----------
  {
    const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase6-upgrades');
    const m = await page.evaluate(() => {
      const g = window.__game, I = (t, b, s, h) => ({ throttle: t, brake: b, steer: s, handbrake: h });
      g.setVehicle('scout');
      const measure = () => {
        const r = {};
        g.teleport(-32, 0, Math.PI / 2); g.simulate(I(0, 0, 0, true), 1);
        let t = 0; r.t60 = null; while (t < 10) { g.simulate(I(1, 0, 0, false), 0.05); t += 0.05; if (g.state().speed >= 16.667) { r.t60 = +t.toFixed(2); break; } }
        // grip: sand launch (wheelspin-limited) and steady-state lateral grip on the flat strip
        g.teleport(80, -55, 0); g.simulate(I(0, 0, 0, true), 1); r.sand3 = g.simulate(I(1, 0, 0, false), 3).finalSpeed * 3.6;
        g.teleport(-102, 40, Math.PI / 2); g.simulate(I(0, 1, 0, true), 1.5); r.mud3 = g.simulate(I(1, 0, 0, false), 3).finalSpeed * 3.6;
        g.teleport(-100, 100, Math.PI / 2); g.simulate(I(0, 0, 0, true), 1);
        for (let k = 0; k < 200 && g.state().speed < 13.9; k++) g.simulate(I(1, 0, 0, false), 0.05);
        let lat = 0; for (let k = 0; k < 20; k++) { g.simulate(I(0.5, 0, 1, false), 0.05); } for (let k = 0; k < 10; k++) { g.simulate(I(0.5, 0, 1, false), 0.05); const s = g.state(); lat += (s.hspeed ** 2) / 1; }
        // suspension: settled ride height above terrain + spec travel/stiffness
        g.teleport(-32, 0, Math.PI / 2); g.simulate(I(0, 0, 0, true), 2); const s = g.state(); r.ride = s.y - g.heightAt(s.x, s.z);
        const sp = g.spec; r.travel = sp.susp.travel; r.stiff = sp.susp.stiffness; r.engine = sp.engine; r.grip = sp.grip.sand;
        return r;
      };
      const out = { base: measure() };
      g.addCredits(8000, 0);
      for (let i = 0; i < 3; i++) g.buyUpgrade('scout', 'engine'); out.engine = measure();
      for (let i = 0; i < 3; i++) g.buyUpgrade('scout', 'tyres'); out.tyres = measure();
      for (let i = 0; i < 3; i++) g.buyUpgrade('scout', 'susp'); out.susp = measure();
      out.extra = g.buyUpgrade('scout', 'engine'); out.save = g.save;
      return out;
    });
    metrics.upgrades = m;
    ok('p6 upgrades: engine x3 -> quicker 0-60', m.engine.t60 < m.base.t60 * 0.9 && m.engine.engine > m.base.engine * 1.25, `0-60 ${m.base.t60} s -> ${m.engine.t60} s (drive force ${m.base.engine} -> ${m.engine.engine.toFixed(0)})`);
    ok('p6 upgrades: tyres x3 -> more traction on loose surfaces', m.tyres.grip > m.engine.grip * 1.2 && (m.tyres.sand3 > m.engine.sand3 + 0.5 || m.tyres.mud3 > m.engine.mud3 + 0.5),
      `sand grip ${m.engine.grip.toFixed(2)} -> ${m.tyres.grip.toFixed(2)}; 3 s sand launch ${m.engine.sand3.toFixed(1)} -> ${m.tyres.sand3.toFixed(1)} km/h; mud ${m.engine.mud3.toFixed(1)} -> ${m.tyres.mud3.toFixed(1)} km/h`);
    ok('p6 upgrades: suspension x3 -> more travel, stiffer, measurably higher ride', m.susp.travel > m.tyres.travel * 1.25 && m.susp.stiff > m.tyres.stiff * 1.2 && m.susp.ride > m.tyres.ride + 0.04,
      `travel ${m.tyres.travel.toFixed(3)} -> ${m.susp.travel.toFixed(3)} m, stiffness ${m.tyres.stiff.toFixed(1)} -> ${m.susp.stiff.toFixed(1)}, settled ride height ${m.tyres.ride.toFixed(3)} -> ${m.susp.ride.toFixed(3)} m`);
    ok('p6 upgrades: capped at level 3, cost credits, saved', m.extra === false && m.save.upgrades.scout.engine === 3 && m.save.upgrades.scout.tyres === 3 && m.save.upgrades.scout.susp === 3 && m.save.credits === 8000 - 3 * 2400,
      `${JSON.stringify(m.save.upgrades.scout)}, ${m.save.credits} cr left (3 x 2400 spent), 4th engine upgrade refused`);
    await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 }); await page.evaluate(() => window.__game.skipOpening());
    const sp = await page.evaluate(() => window.__game.spec);
    ok('p6 upgrades: persist across reload into the physics spec', Math.abs(sp.engine - m.susp.engine) < 1e-6 && Math.abs(sp.susp.travel - m.susp.travel) < 1e-9, `engine ${sp.engine.toFixed(0)}, travel ${sp.susp.travel.toFixed(3)} after reload`);

    // ---------- save migration ----------
    const mg = await page.evaluate(() => {
      const g = window.__game, out = {};
      out.nul = g.migrate(null); out.garbage = g.migrate('%%%'); out.arr = g.migrate([1, 2]);
      out.v1 = g.migrate({ version: 1, cash: 2500, unlocked: ['rally', 'tank', 7], bestTimes: { 'race-dash': 21.5, x: -3 } });
      out.bad = g.migrate({ v: 2, credits: -50, xp: 'lots', vehicles: 'all', paints: [123], upgrades: { scout: { engine: 99, tyres: -1 }, ghost: { engine: 1 } }, best: { a: { time: 0 } } });
      out.future = g.migrate({ v: 9, credits: 10, xp: 20, vehicles: ['scout', 'sahara'], newThing: { x: 1 } });
      return out;
    });
    ok('p6 migration: empty/corrupt -> clean defaults', [mg.nul, mg.garbage, mg.arr].every((s) => s.v === 2 && s.credits === 0 && s.vehicles.join() === 'scout'), 'null, "%%%", [1,2] -> v2 defaults');
    ok('p6 migration: v1 save converted (cash, unlocks, best times; invalid entries dropped)', mg.v1.v === 2 && mg.v1.credits === 2500 && mg.v1.vehicles.join() === 'scout,rally' && mg.v1.best['race-dash'].time === 21.5 && !mg.v1.best.x,
      `v1 {cash 2500, unlocked [rally,tank,7]} -> ${JSON.stringify({ credits: mg.v1.credits, vehicles: mg.v1.vehicles, best: mg.v1.best })}`);
    ok('p6 migration: bad fields sanitised; future version keeps known fields', mg.bad.credits === 0 && mg.bad.xp === 0 && mg.bad.vehicles.join() === 'scout' && mg.bad.upgrades.scout.engine === 3 && mg.bad.upgrades.scout.tyres === 0 && !mg.bad.upgrades.ghost && Object.keys(mg.bad.best).length === 0 && mg.future.credits === 10 && mg.future.vehicles.includes('sahara'),
      `bad -> ${JSON.stringify({ c: mg.bad.credits, xp: mg.bad.xp, v: mg.bad.vehicles, up: mg.bad.upgrades })}; future v9 -> ${mg.future.credits} cr, ${mg.future.vehicles}`);
    // end-to-end: a v1 save in localStorage is loaded + rewritten as v2 on the next store
    await page.evaluate(() => { localStorage.setItem('owf.save', JSON.stringify({ version: 1, cash: 1300, unlocked: ['pickup'], bestTimes: {} })); localStorage.removeItem('owf.settings.v1'); });
    await page.reload(); await page.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 90000 }); await page.evaluate(() => window.__game.skipOpening());
    const e2e = await page.evaluate(() => { const g = window.__game; const s = g.save; g.addCredits(0); return { s, raw: JSON.parse(localStorage.getItem('owf.save')) }; });
    ok('p6 migration: v1 save in storage loads and is rewritten as v2', e2e.s.v === 2 && e2e.s.credits === 1300 && e2e.s.vehicles.includes('pickup') && e2e.raw.v === 2 && e2e.raw.version === undefined, `loaded ${e2e.s.credits} cr, ${e2e.s.vehicles}; stored v${e2e.raw.v}`);
    ok('p6: no console errors (upgrades/migration)', errors.length === 0, errors.slice(0, 5).join(' | '));
    await ctx.close();
  }

  // ---------- C: mission HUD on phones (portrait + landscape) ----------
  for (const [label, vp] of [['portrait', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }]]) {
    const o = await openPage({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, 'p6-' + label);
    await o.page.tap('#btn-modes'); await o.page.waitForFunction(() => window.__game.phase === 'modes'); await o.page.waitForTimeout(400);
    const mA = await area(o.page, '#modes');
    const startVisible = await o.page.evaluate(() => { const b = document.querySelector('#m-list [data-start]'); const r = b.getBoundingClientRect(); return r.width > 0 && r.bottom <= innerHeight && r.right <= innerWidth; });
    await o.page.tap('#m-tabs [data-mode=rescue]'); await o.page.tap('#m-list [data-start=rs-tow]'); await o.page.waitForFunction(() => window.__game.phase === 'playing');
    await o.page.evaluate(() => { const g = window.__game, d = g.missions.find((m) => m.id === 'rs-tow'); g.skipCountdown(); g.teleport(d.stuck.x + 8.5, d.stuck.z, d.stuck.yaw); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.5); });
    await o.page.waitForTimeout(500);
    await o.page.tap('#btn-hook'); await o.page.waitForTimeout(400);
    const hud = await o.page.evaluate(() => {
      const r = (id) => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height, vis: getComputedStyle(e).display !== 'none' && !e.classList.contains('hidden') }; };
      const ids = ['mhud', 'btn-winch', 'btn-mreset', 'pause-btn', 'speedo'];
      const opaque = [document.querySelector('#mhud .mh-box'), ...document.querySelectorAll('#mhud .mh-actions .btn')].map((e) => e.getBoundingClientRect()).filter((b) => b.width > 0).reduce((t, b) => t + b.width * b.height, 0);
      const o = {}; for (const id of ids) if (document.getElementById(id)) o[id] = r(id);
      const touch = [...document.querySelectorAll('#cockpit button, #tzones .tpill')].map((e) => e.getBoundingClientRect()).filter((b) => b.width > 0);
      return { o, touch, opaque, attached: window.__game.mission.attached, W: innerWidth, H: innerHeight };
    });
    const inView = (b) => b.x >= 0 && b.y >= 0 && b.r <= hud.W + 0.5 && b.b <= hud.H + 0.5;
    const overlaps = (a, b) => !(a.r <= b.left || b.right <= a.x || a.b <= b.top || b.bottom <= a.y);
    const mh = hud.o.mhud, bboxA = (mh.w * mh.h) / (hud.W * hud.H), hudA = hud.opaque / (hud.W * hud.H); // opaque panels (timer box + buttons); the message line is shadowed text only
    const overlapTouch = hud.touch.some((t) => overlaps(mh, t));
    await o.page.screenshot({ path: `${SH}test-${label}-tow-hud.png` });
    ok(`p6 ${label}: mode select fits, mission HUD inside viewport, small, clear of touch controls`, mA < 0.62 && startVisible && inView(mh) && hudA < 0.08 && bboxA < 0.18 && !overlapTouch && inView(hud.o['btn-winch']) && hud.o['btn-winch'].vis && hud.attached,
      `modes ${(mA * 100).toFixed(0)}%, HUD opaque panels ${(hudA * 100).toFixed(1)}% (bounding box incl. message ${mh.w.toFixed(0)}x${mh.h.toFixed(0)} px = ${(bboxA * 100).toFixed(1)}%) at y ${mh.y.toFixed(0)}, touch overlap ${overlapTouch}, winch on-screen ${inView(hud.o['btn-winch'])}, hook tap attached ${hud.attached}`);
    ok(`p6 ${label}: no console errors`, o.errors.length === 0, o.errors.slice(0, 5).join(' | '));
    await o.ctx.close();
  }
  fs.writeFileSync(SH + 'metrics.json', JSON.stringify(metrics, null, 2));
  return metrics;
}
