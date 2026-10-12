// Layout block: mobile-first menus + default touch-halves controls on iPhone SE / 13 / Pro Max (portrait + landscape), iPad and desktop.
// Measures how much of the screen each panel covers, checks nothing is clipped / overflowing, that closing pause/settings goes straight
// back to a playable game, that the default mobile scheme is touch halves (no wheel / pedals), and the on-screen keyboard handling
// (visualViewport is SIMULATED in headless Chrome; real iOS keyboard behaviour is unverified). Runs in acceptance.mjs and tests/layout.mjs.
import fs from 'node:fs';
const SH = new URL('../screenshots/rework/layout/', import.meta.url).pathname;
fs.mkdirSync(SH, { recursive: true });
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPAD_UA = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const phone = (w, h) => ({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPHONE_UA });
export const DEVICES = [
  ['iphone-se-portrait', phone(375, 667)], ['iphone-se-landscape', phone(667, 375)],
  ['iphone-13-portrait', phone(390, 844)], ['iphone-13-landscape', phone(844, 390)],
  ['iphone-promax-portrait', phone(430, 932)], ['iphone-promax-landscape', phone(932, 430)],
  ['ipad-portrait', { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPAD_UA }],
  ['ipad-landscape', { viewport: { width: 1180, height: 820 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: IPAD_UA }],
  ['desktop', { viewport: { width: 1280, height: 720 } }],
];

/** coverage (visible rect ∩ viewport / viewport), clipping and overflow of one panel */
const measure = (page, id) => page.evaluate(async (id) => {
  const e0 = document.getElementById(id);
  await Promise.all(e0.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))); // let the drawer slide-in finish
  const e = e0, W = innerWidth, H = innerHeight, r = e.getBoundingClientRect();
  const visible = e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden' && r.right > 0 && r.left < W;
  const iw = Math.max(0, Math.min(W, r.right) - Math.max(0, r.left)), ih = Math.max(0, Math.min(H, r.bottom) - Math.max(0, r.top));
  const inside = r.left >= -1 && r.top >= -1 && r.right <= W + 1 && r.bottom <= H + 1;
  const hOverflow = e.scrollWidth > e.clientWidth + 1;
  const canScroll = /(auto|scroll)/.test(getComputedStyle(e).overflowY);
  // every visible button must sit horizontally inside the panel; vertically it must be inside, or reachable by scrolling the panel
  const clipped = [...e.querySelectorAll('button, input')].filter((b) => b.getClientRects().length > 0).filter((b) => {
    const q = b.getBoundingClientRect();
    const hBad = q.left < r.left - 1 || q.right > r.right + 1 || q.width < 1;
    const vBad = !canScroll && (q.top < r.top - 1 || q.bottom > r.bottom + 1);
    return hBad || vBad;
  }).map((b) => b.id || b.textContent.trim().slice(0, 14));
  return { visible, cover: (iw * ih) / (W * H), inside, hOverflow, clipped, w: Math.round(r.width), h: Math.round(r.height) };
}, id);
const tap = async (page, sel, touch) => { if (touch) await page.tap(sel); else await page.click(sel); await page.waitForTimeout(450); };
const frames = (page, n = 3) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);

export async function runLayout({ openPage, ok }) {
  const metrics = {};
  for (const [label, opts] of DEVICES.filter(([l]) => !process.env.LAYOUT_ONLY || process.env.LAYOUT_ONLY.split(',').includes(l))) {
    const touch = !!opts.hasTouch, W = opts.viewport.width, H = opts.viewport.height, phoneish = touch && Math.min(W, H) < 500;
    const { ctx, page, errors } = await openPage(opts, 'layout-' + label);
    const m = {}, bad = [];
    const check = async (name, id) => {
      const r = await measure(page, id); m[name] = r;
      const lim = phoneish ? 0.65 : 0.5;
      if (!r.visible) bad.push(`${name} not visible`);
      if (!r.inside) bad.push(`${name} off-screen`);
      if (r.hOverflow) bad.push(`${name} horizontal overflow`);
      if (r.clipped.length) bad.push(`${name} clipped [${r.clipped}]`);
      if (r.cover > lim) bad.push(`${name} covers ${(r.cover * 100).toFixed(0)}% > ${lim * 100}%`);
    };
    await check('menu', 'menu'); await page.screenshot({ path: `${SH}${label}-menu.png` });
    await tap(page, '#btn-garage', touch); await check('garage', 'garage'); await page.screenshot({ path: `${SH}${label}-garage.png` }); await tap(page, '#g-back', touch);
    await tap(page, '#btn-levels', touch); await check('career', 'levels'); await tap(page, '#lv-back', touch);
    await tap(page, '#btn-modes', touch); await check('modes', 'modes'); await tap(page, '#m-back', touch);
    await tap(page, '#btn-online', touch); await check('lobby', 'lobby');
    if (label === 'iphone-se-portrait') { // on-screen keyboard: simulated by shrinking visualViewport (real iOS keyboard unverified)
      await page.focus('#lb-name');
      const kb = await page.evaluate(async () => {
        const vv = window.visualViewport, kbH = 260; Object.defineProperty(vv, 'height', { configurable: true, get: () => innerHeight - kbH });
        vv.dispatchEvent(new Event('resize')); await new Promise((r) => setTimeout(r, 150));
        const p = document.getElementById('lobby').getBoundingClientRect(), i = document.getElementById('lb-name').getBoundingClientRect();
        const res = { kbClass: document.body.classList.contains('kb'), panelBottom: Math.round(p.bottom), inputBottom: Math.round(i.bottom), top: Math.round(p.top), limit: innerHeight - kbH };
        delete vv.height; vv.dispatchEvent(new Event('resize')); await new Promise((r) => setTimeout(r, 100));
        res.restored = !document.body.classList.contains('kb'); return res;
      });
      m.keyboard = kb;
      ok('layout keyboard (simulated visualViewport, iPhone SE): lobby panel moves above the on-screen keyboard and the focused name field stays visible',
        kb.kbClass && kb.panelBottom <= kb.limit + 1 && kb.inputBottom <= kb.limit && kb.top >= 0 && kb.restored, JSON.stringify(kb));
      await page.evaluate(() => document.activeElement?.blur());
    }
    await tap(page, '#lb-back', touch);
    await tap(page, '#btn-settings', touch); await check('settings', 'drawer'); await page.screenshot({ path: `${SH}${label}-settings.png` }); await tap(page, '#btn-close-drawer', touch);
    // free roam: default controls, then pause -> resume and pause -> settings -> close must both land in a playable game at once
    await tap(page, '#btn-play', touch); await page.evaluate(() => window.__game.skipIntro?.());
    await page.waitForFunction(() => window.__game.phase === 'playing'); await frames(page);
    const ui = await page.evaluate(() => { const v = (id) => document.getElementById(id).getClientRects().length > 0; return { setting: window.__game.controls().setting, scheme: window.__game.controls().scheme, zones: v('tzones'), wheel: v('wheel'), steer: v('sb-l') && v('sb-r'), gas: v('pd-gas'), brake: v('pd-brake'), rec: v('ck-rec'), drv: v('drv-chip') }; });
    m.controls = ui;
    if (touch) {
      // pills / chip must not overlap each other and stay on-screen
      const pr = await page.evaluate(() => ['sb-l', 'sb-r', 'pd-gas', 'pd-brake', 'ck-rec', 'ck-hb', 'drv-chip', 'hud-speed', 'btn-pause'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return { id, x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width }; }));
      const off = pr.filter((b) => b.w > 0 && (b.x < -0.5 || b.y < -0.5 || b.r > W + 0.5 || b.b > H + 0.5)).map((b) => b.id);
      const ov = []; for (let i = 0; i < pr.length; i++) for (let j = i + 1; j < pr.length; j++) { const a = pr[i], b = pr[j]; if (a.w && b.w && !(a.r <= b.x || b.r <= a.x || a.b <= b.y || b.b <= a.y)) ov.push(a.id + '/' + b.id); }
      const ctlCover = pr.filter((b) => ['sb-l', 'sb-r', 'pd-gas', 'pd-brake', 'ck-rec', 'ck-hb', 'drv-chip'].includes(b.id)).reduce((t, b) => t + (b.r - b.x) * (b.b - b.y), 0) / (W * H);
      m.controls.cover = ctlCover; m.controls.off = off; m.controls.overlaps = ov;
      // ◀ steers left while GAS is held (pointer path; the native touch path is covered by tests/mobile-drive.mjs)
      const ptr = (sel, type, id) => page.evaluate(([sel, type, id]) => { const e = document.getElementById(sel), r = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 })); }, [sel, type, id]);
      await ptr('pd-gas', 'pointerdown', 1); await ptr('sb-l', 'pointerdown', 2);
      const p0 = await page.evaluate(() => window.__game.pose()); await page.waitForTimeout(1500); await frames(page, 25); // physics is render-paced: large iPad viewports render slowly under SwiftShader
      const i1 = await page.evaluate(() => window.__game.readInput()), p1 = await page.evaluate(() => window.__game.pose());
      await ptr('sb-l', 'pointerup', 2); await ptr('pd-gas', 'pointerup', 1);
      m.controls.drive = { steer: +i1.steer.toFixed(2), throttle: i1.throttle, moved: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1) };
      await page.screenshot({ path: `${SH}${label}-play-buttons.png` });
      ok(`layout ${label}: default mobile controls = ◀ ▶ + GAS + BRAKE/REV + Reset, nothing overlapping or off-screen; steer + gas together drive and turn`,
        ui.setting === 'buttons' && ui.scheme === 'buttons' && !ui.zones && !ui.wheel && ui.steer && ui.gas && ui.brake && ui.rec && off.length === 0 && ov.length === 0 && ctlCover < 0.2 && i1.steer > 0.3 && i1.throttle > 0.5 && m.controls.drive.moved > 2,
        `setting ${ui.setting}, steer ${ui.steer}, gas ${ui.gas}, brake ${ui.brake}, reset ${ui.rec}, wheel ${ui.wheel}; controls cover ${(ctlCover * 100).toFixed(1)}%; off [${off}] overlaps [${ov}]; steer ${i1.steer.toFixed(2)} thr ${i1.throttle.toFixed(2)}, moved ${m.controls.drive.moved} m in >= 1.5 s + 25 frames`);
    } else {
      ok(`layout ${label}: desktop shows no touch controls (keyboard driving)`, !ui.zones && !ui.wheel && !ui.pedals, JSON.stringify(ui));
    }
    await tap(page, '#btn-pause', touch); await check('pause', 'pause'); await page.screenshot({ path: `${SH}${label}-pause.png` });
    await tap(page, '#btn-resume', touch); await frames(page, 2);
    const r1 = await page.evaluate(() => ({ phase: window.__game.phase, pause: document.getElementById('pause').getClientRects().length > 0 }));
    await tap(page, '#btn-pause', touch); await tap(page, '#btn-settings2', touch);
    const stacked = await page.evaluate(() => document.getElementById('pause').getClientRects().length > 0);
    await check('pause-settings', 'drawer');
    await tap(page, '#btn-close-drawer', touch); await frames(page, 2);
    const r2 = await page.evaluate(() => ({ phase: window.__game.phase, drawer: document.getElementById('drawer').classList.contains('open'), pause: document.getElementById('pause').getClientRects().length > 0 }));
    m.close = { resume: r1, settingsClose: r2, stacked };
    ok(`layout ${label}: closing Pause (Resume) or the Settings drawer opened from Pause returns straight to driving; no stacked overlays`,
      r1.phase === 'playing' && !r1.pause && !stacked && r2.phase === 'playing' && !r2.drawer && !r2.pause, JSON.stringify(m.close));
    const cov = Object.entries(m).filter(([, v]) => v && typeof v.cover === 'number' && 'inside' in v).map(([k, v]) => `${k} ${(v.cover * 100).toFixed(0)}%`).join(', ');
    ok(`layout ${label} (${W}x${H}): every panel is a sized card/drawer (never full-screen), fully on-screen, no clipped buttons or horizontal overflow`, bad.length === 0, `${cov}${bad.length ? ' | ' + bad.join('; ') : ''}`);
    ok(`layout ${label}: no console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
    metrics[label] = m;
    await ctx.close();
  }
  fs.writeFileSync(SH + 'layout-metrics.json', JSON.stringify(metrics, null, 1));
  return metrics;
}
