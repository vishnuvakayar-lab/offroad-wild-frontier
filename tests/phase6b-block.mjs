// Phase 6b acceptance checks: medal targets vs clean/human-like bots, longer missions, rock surface,
// tow "well inside + hold" rule, tow camera occlusion, dusk tied to the clock, rock detail per preset.
// Exported so it runs inside tests/acceptance.mjs and standalone (tests/phase6b.mjs).
export async function runPhase6b({ openPage, ok }) {
  const metrics = { bots: {} };
  const SEEDS = [1, 2, 3];
  const { ctx, page, errors } = await openPage({ viewport: { width: 1280, height: 720 } }, 'phase6b');
  await page.click('#btn-play'); await page.waitForFunction(() => window.__game.phase !== 'menu'); await page.evaluate(() => window.__game.skipIntro());
  await page.waitForFunction(() => window.__game.phase === 'playing');

  // ---------- A: every mission vs its medal targets (clean bot <= gold, human-like bots <= bronze) ----------
  const defs = await page.evaluate(() => ({ ms: window.__game.missions, bot: window.__game.botTimes, f: window.__game.medalFactors }));
  for (const m of defs.ms) {
    const runs = await page.evaluate(([id, seeds]) => {
      const g = window.__game, out = [];
      for (const md of ['clean', ...seeds]) { g.startMission(id); const r = g.botRun(id === 'rs-tow' ? 160 : 200, md === 'clean' ? { slowZone: id === 'rs-deliver' } : { human: true, seed: md }); out.push({ md, state: r.state, t: r.t, resets: r.resets ?? 0 }); }
      return out;
    }, [m.id, SEEDS]);
    const T = m.targets, clean = runs[0], hum = runs.slice(1), hMean = hum.reduce((a, r) => a + r.t, 0) / hum.length;
    metrics.bots[m.id] = { clean: +clean.t.toFixed(2), human: hum.map((r) => +r.t.toFixed(2)), targets: T, limit: m.limit };
    ok(`p6b ${m.id}: clean bot finishes within gold`, clean.state === 'success' && clean.t <= T.gold,
      `clean ${clean.state} ${clean.t.toFixed(2)} s (recorded ${defs.bot[m.id]} s) | gold ${T.gold} / silver ${T.silver} / bronze ${T.bronze}${m.limit ? ` / limit ${m.limit}` : ''} s`);
    ok(`p6b ${m.id}: human-like bot (3 seeds) finishes within bronze; gold needs better driving`, hum.every((r) => r.state === 'success' && r.t <= T.bronze) && hMean > T.gold,
      `human ${hum.map((r) => `${r.state === 'success' ? '' : r.state + ' '}${r.t.toFixed(2)}`).join(', ')} s (mean ${hMean.toFixed(1)} > gold ${T.gold}), resets ${hum.map((r) => r.resets).join('/')}`);
  }
  const fac = defs.ms.filter((m) => defs.bot[m.id]).every((m) => Math.abs(m.targets.gold - defs.bot[m.id] * defs.f.gold) <= 0.26 && Math.abs(m.targets.bronze - defs.bot[m.id] * defs.f.bronze) <= 0.26 && (!m.limit || m.limit >= m.targets.bronze));
  ok('p6b targets: gold/silver/bronze = bot x1.2/1.5/2 (0.5 s), limits >= bronze', fac, `factors ${JSON.stringify(defs.f)}`);
  const B = metrics.bots, hm = (id) => B[id].human.reduce((a, b) => a + b, 0) / B[id].human.length;
  ok('p6b lengths: Ridge Climb 40-90 s and Supply Run 60-120 s for a human-like driver; races >= 40 s', hm('ch-climb') >= 40 && hm('ch-climb') <= 90 && hm('rs-deliver') >= 60 && hm('rs-deliver') <= 120 && hm('race-loop') >= 40 && hm('race-dash') >= 40,
    `human mean: climb ${hm('ch-climb').toFixed(1)} s, supply ${hm('rs-deliver').toFixed(1)} s, loop ${hm('race-loop').toFixed(1)} s, dash ${hm('race-dash').toFixed(1)} s`);

  // ---------- B: ridge trail geometry ----------
  const geo = await page.evaluate(() => { const g = window.__game, T = g.trail; let len = 0, maxG = 0, steep = 0;
    for (let i = 1; i < T.length; i++) { const d = Math.hypot(T[i].x - T[i - 1].x, T[i].z - T[i - 1].z); len += d; if (d > 0.5) { const gr = Math.abs(T[i].h - T[i - 1].h) / d; maxG = Math.max(maxG, gr); if (gr > 0.15) steep += d; } }
    return { len, maxG, steep, rise: T[T.length - 1].h - T[0].h, hairpins: g.hairpins.length }; });
  ok('p6b ridge trail: switchback climb with hairpins and steep rocky sections', geo.len > 300 && geo.hairpins >= 4 && geo.rise > 20 && geo.steep > 80 && geo.maxG < 0.45,
    `${geo.len.toFixed(0)} m, ${geo.hairpins} hairpins, rise ${geo.rise.toFixed(1)} m, ${geo.steep.toFixed(0)} m steeper than 15%, max grade ${(geo.maxG * 100).toFixed(0)}%`);

  // ---------- C: rock surface type (free roam) ----------
  await page.evaluate(() => { const g = window.__game; g.endMission(); g.play(); g.skipIntro(); }); await page.waitForFunction(() => window.__game.phase === 'playing'); await page.waitForTimeout(300);
  const rk = await page.evaluate(async () => {
    const g = window.__game, I = (t) => ({ throttle: t, brake: 0, steer: 0, handbrake: false });
    const launch = (x, z, yaw) => { g.teleport(x, z, yaw); g.simulate(I(0), 1.2); const s0 = g.state(); let slip = 0, n = 0, maxRock = 0;
      for (let i = 0; i < 12; i++) { g.simulate(I(1), 0.1); const s = g.state(); slip += s.slip.reduce((a, b) => a + b, 0) / 4; n++; maxRock = Math.max(maxRock, g.audioRock); }
      const s1 = g.state(); return { surface: s1.surface, wheels: s1.wheels, slip: slip / n, dist: Math.hypot(s1.x - s0.x, s1.z - s0.z), chip: document.getElementById('hud-surface').textContent, rockAudio: maxRock, dust: s1.particles.dust }; };
    const T = g.trail, i0 = Math.round(T.length * 0.5), a = T[i0], b = T[i0 + 3], hp = a; // a near-level stretch of the rocky switchback
    const rock = launch(hp.x, hp.z, Math.atan2(b.x - a.x, b.z - a.z)); for (let f = 0; f < 3; f++) await new Promise((r) => requestAnimationFrame(r)); rock.chip = document.getElementById('hud-surface').textContent; rock.cls = document.getElementById('hud-surface').className;
    const ground = launch(0, 0, 0);
    // real-time drive on rock: dust/chips and the gravel crunch are produced by the frame loop
    g.teleport(a.x, a.z, Math.atan2(b.x - a.x, b.z - a.z)); await new Promise((r) => setTimeout(r, 500)); g.setInput({ throttle: 0.8, brake: 0, steer: 0, handbrake: false });
    let rt = 0, dust = 0, au = 0, nf = 0; const t0 = performance.now();
    while (performance.now() - t0 < 1500 || nf++ < 12) { await new Promise((r) => requestAnimationFrame(r)); const s = g.state(); dust = Math.max(dust, s.particles.dust); au = Math.max(au, g.audioRock); rt = s.audio.state; }
    g.setInput(null); rock.dust = dust; rock.rockAudio = au; rock.audioState = rt;
    return { rock, ground, sAt: g.surfaceAt(hp.x, hp.z), sGround: g.surfaceAt(0, 0) };
  });
  metrics.rock = rk;
  ok('p6b rock: mountain detected as Rock surface (wheels + HUD chip)', rk.sAt === 'rock' && rk.sGround !== 'rock' && rk.rock.wheels.filter((w) => w === 'rock').length >= 3 && /Rock/.test(rk.rock.chip) && /rock/.test(rk.rock.cls),
    `surfaceAt hairpin=${rk.sAt}, spawn=${rk.sGround}; wheels [${rk.rock.wheels}], chip "${rk.rock.chip}"`);
  ok('p6b rock: distinct grip (more wheelspin than dirt on the same full-throttle launch)', rk.rock.slip > rk.ground.slip * 1.25 && rk.rock.wheels.every((w) => w === 'rock'),
    `1.2 s launch: rock slip ${rk.rock.slip.toFixed(3)} / ${rk.rock.dist.toFixed(1)} m vs dirt slip ${rk.ground.slip.toFixed(3)} / ${rk.ground.dist.toFixed(1)} m`);
  ok('p6b rock: own dust + gravel sound while driving on rock', rk.rock.dust > 0 && rk.rock.rockAudio > 0, `real-time 1.5 s on rock: dust particles ${rk.rock.dust}, gravel crunch level ${rk.rock.rockAudio.toFixed(3)} (audio ${rk.rock.audioState})`);

  // ---------- D: tow needs the stuck 4x4 well inside the zone, held 1 s ----------
  const tw = await page.evaluate(() => {
    const g = window.__game, def = g.missions.find((m) => m.id === 'rs-tow'), Z = def.zone, H = { throttle: 0, brake: 0, steer: 0, handbrake: true };
    g.startMission('rs-tow'); g.skipCountdown(); g.simulate(H, 0.2);
    // stuck 4x4 placed north of the centre (the slope there does not drag it back out), player hooked 6 m further on
    const put = (d) => { const yaw = 0, sx = Z.x, sz = Z.z + d; g.placeStuck(sx, sz, yaw); g.teleport(sx + Math.sin(yaw) * 6.2, sz + Math.cos(yaw) * 6.2, yaw); g.simulate(H, 0.4); g.hook?.(); g.simulate(H, 0.1); };
    const st = () => ({ state: g.mission.state, attached: g.mission.attached, zd: (() => { const p = g.stuckPos(); return Math.hypot(p.x - Z.x, p.z - Z.z); })(), msg: g.mission.msg });
    put(Z.r - 1.2); let edgeT = 0, everOk = false; for (let i = 0; i < 30; i++) { g.simulate(H, 0.1); const s = st(); if (s.zd < Z.r && s.zd > Z.r - g.towRule.margin) edgeT += 0.1; if (s.state !== 'running') everOk = true; } const edge = { ...st(), edgeT, everOk };
    put(2); g.simulate(H, 0.5); const half = st(); g.simulate(H, 0.8); const held = st();
    return { r: Z.r, margin: g.towRule.margin, hold: g.towRule.hold, edge, half, held };
  });
  metrics.towRule = tw;
  ok('p6b tow: stuck 4x4 at the zone edge does not count; well inside + 1 s hold does', tw.edge.attached && !tw.edge.everOk && tw.edge.edgeT >= 1.2 && tw.half.attached && tw.half.state === 'running' && tw.held.state === 'success' && tw.held.zd <= tw.r - tw.margin,
    `zone r ${tw.r} m, rule <= ${tw.r - tw.margin} m for ${tw.hold} s | inside but within 2 m of the edge for ${tw.edge.edgeT.toFixed(1)} s -> ${tw.edge.state} ("${tw.edge.msg}"), inside ${tw.half.zd.toFixed(1)} m 0.5 s -> ${tw.half.state}, 1.3 s -> ${tw.held.state}`);

  // ---------- E: tow camera is not blocked by the towed vehicle ----------
  const cam = await page.evaluate(async () => {
    const g = window.__game, frame = () => new Promise((r) => requestAnimationFrame(() => r()));
    g.startMission('rs-tow'); const a = g.botRun(40, { untilAttached: true }); let n = 0, occ = 0, minD = 99;
    for (let k = 0; k < 40 && g.mission.state === 'running' && g.mission.attached; k++) {
      g.botRun(0.25); for (let f = 0; f < 6; f++) await frame(); const d = g.towOcclusion(); if (d == null) continue; n++; minD = Math.min(minD, d); if (d < 1.6) occ++; }
    return { attached: a.attached, n, occ, minD, state: g.mission.state };
  });
  metrics.towCam = cam;
  ok('p6b tow camera: sight line to the player clears the towed 4x4', cam.n >= 5 && cam.occ / cam.n <= 0.1,
    `${cam.n} towing samples, ${cam.occ} with the 4x4 within 1.6 m of the camera->player line (min ${cam.minD.toFixed(2)} m), final ${cam.state}`);

  // ---------- F: nightfall follows the Supply Run clock ----------
  const dk = await page.evaluate(async () => {
    const g = window.__game, H = { throttle: 0, brake: 0, steer: 0, handbrake: true }, frame = async () => { await new Promise((r) => setTimeout(r, 120)); for (let i = 0; i < 3; i++) await new Promise((r) => requestAnimationFrame(r)); }, lim = g.missions.find((m) => m.id === 'rs-deliver').limit, out = [];
    g.startMission('rs-deliver'); g.skipCountdown?.(); for (const f of [0.1, 0.5, 0.9]) { g.simulate(H, f * lim - g.mission.t); await frame(); out.push({ t: g.mission.t, ...g.dusk }); }
    return { lim, out };
  });
  metrics.dusk = dk;
  const dd = dk.out;
  ok('p6b supply run: nightfall tied to the time limit', dd[0].k < 0.05 && dd[1].k > dd[0].k && dd[2].k > 0.75 && dd[2].exposure < dd[0].exposure * 0.7,
    `limit ${dk.lim} s: ${dd.map((d) => `t=${d.t.toFixed(0)} s dusk ${d.k.toFixed(2)} exp ${d.exposure.toFixed(2)}`).join(' | ')}`);

  // ---------- G: rock detail scales with the performance preset ----------
  const pr = await page.evaluate(async () => { const g = window.__game, out = {}; for (const p of ['low', 'medium', 'high']) { g.setPreset(p); await new Promise((r) => setTimeout(r, 150)); out[p] = g.screeCount(); } g.setPreset('high'); return out; });
  ok('p6b presets: scree detail low < medium < high (low = 0)', pr.low === 0 && pr.medium > 0 && pr.high > pr.medium, JSON.stringify(pr));
  ok('p6b no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
  return metrics;
}
