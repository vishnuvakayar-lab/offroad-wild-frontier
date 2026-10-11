// Gameplay evidence from the running build: node tests/evidence-shots.mjs  (URL env, default vite preview :4173)
// Desktop + iPhone-emulated portrait / landscape (headless Chrome, SwiftShader). NOT a real device.
import { chromium } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const OUT = new URL('../screenshots/rework/evidence/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const log = {};
async function open(opts, settings) {
  const ctx = await browser.newContext(opts); const page = await ctx.newPage(); const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  if (settings) await page.addInitScript((s) => localStorage.setItem('owf.settings.v1', JSON.stringify(s)), settings);
  await page.goto(APP); await page.waitForFunction(() => ['menu', 'opening'].includes(window.__game?.phase), null, { timeout: 120000 });
  await page.evaluate(() => window.__game.skipOpening?.()); await page.waitForTimeout(1500);
  return { ctx, page, errors };
}
const play = async (page) => { await page.evaluate(() => { const g = window.__game; g.endMission(); g.play(); g.skipIntro?.(); }); await page.waitForFunction(() => window.__game.phase === 'playing'); };
const drive = async (page, i, ms) => { await page.evaluate((i) => window.__game.setInput(i), i); await page.waitForTimeout(ms); await page.evaluate(() => window.__game.setInput(null)); };

// desktop: gameplay, mud spray, sand dust, 2H/4H/4L on the rocky climb, garage
{
  const { ctx, page, errors } = await open({ viewport: { width: 1280, height: 720 } }, { preset: 'high', intro: false, showFps: true });
  await page.mouse.click(5, 5);
  await page.screenshot({ path: OUT + 'desktop-menu-live.png' });
  await play(page);
  await page.evaluate(() => window.__game.teleport(6, -6, Math.atan2(45, -29))); await page.waitForTimeout(800);
  await drive(page, { throttle: 0.8, brake: 0, steer: 0, handbrake: false }, 2500); await page.screenshot({ path: OUT + 'desktop-gameplay.png' });
  await page.evaluate(() => window.__game.teleport(-102, 40, Math.PI / 2)); await page.waitForTimeout(800);
  await drive(page, { throttle: 1, brake: 0, steer: 0.2, handbrake: false }, 2500); await page.screenshot({ path: OUT + 'desktop-mud-spray.png' });
  await page.evaluate(() => window.__game.teleport(66, -55, Math.PI / 2)); await page.waitForTimeout(800);
  await drive(page, { throttle: 1, brake: 0, steer: 0.15, handbrake: false }, 2500); await page.screenshot({ path: OUT + 'desktop-sand-dust.png' });
  log.climb = {};
  for (const m of ['2H', '4H', '4L']) {
    const r = await page.evaluate((m) => { const g = window.__game, T = g.trail; let best = 0, bi = 0;
      for (let i = 3; i < T.length - 8; i++) { const d = Math.hypot(T[i + 6].x - T[i].x, T[i + 6].z - T[i].z); const gr = (T[i + 6].h - T[i].h) / d; if (gr > best) { best = gr; bi = i; } }
      const a = T[bi], b = T[bi + 4]; g.teleport(a.x, a.z, Math.atan2(b.x - a.x, b.z - a.z)); g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 0.8);
      g.setGear('N'); const ok = g.setTransfer(m).ok; g.setGear('D'); return { ok, y0: g.pose().y }; }, m);
    await page.evaluate(() => { document.getElementById('drv-chip').click(); });
    await drive(page, { throttle: 1, brake: 0, steer: 0, handbrake: false }, 2200);
    const y1 = await page.evaluate(() => window.__game.pose().y);
    await page.screenshot({ path: OUT + `desktop-climb-${m}.png` });
    await page.evaluate(() => { document.getElementById('drv-chip').click(); const g = window.__game; g.simulate({ throttle: 0, brake: 0, steer: 0, handbrake: true }, 1); g.setGear('N'); g.setTransfer('4H'); g.setGear('A'); });
    log.climb[m] = { shifted: r.ok, riseRealtime: +(y1 - r.y0).toFixed(2) };
  }
  await page.evaluate(() => window.__game.endMission()); await page.waitForTimeout(300);
  await page.click('#btn-garage'); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + 'desktop-garage-suv.png' });
  await page.click('#g-cats [data-cat="pickup"]'); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + 'desktop-garage-pickup.png' });
  await page.click('#g-cats [data-cat="recovery"]'); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + 'desktop-garage-recovery.png' });
  log.desktopErrors = errors; await ctx.close();
}
// iPhone portrait + landscape: default touch-halves driving, drive selector, then the opt-in wheel + pedals cockpit
const hold = (page, sel, type, id) => page.evaluate(([sel, type, id]) => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: id === 1, bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 })); }, [sel, type, id]);
for (const [label, vp] of [['iphone-portrait', { width: 390, height: 844 }], ['iphone-landscape', { width: 844, height: 390 }]]) {
  const { ctx, page, errors } = await open({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: UA });
  await page.screenshot({ path: OUT + `${label}-menu.png` });
  await play(page);
  await page.evaluate(() => window.__game.teleport(6, -6, Math.atan2(45, -29))); await page.waitForTimeout(800);
  const p0 = await page.evaluate(() => window.__game.pose());
  await page.waitForTimeout(1500); await hold(page, '#tzones .tz.r', 'pointerdown', 1); await page.waitForTimeout(900);
  await page.screenshot({ path: OUT + `${label}-halves-driving.png` });
  await hold(page, '#tzones .tz.r', 'pointerup', 1);
  const p1 = await page.evaluate(() => window.__game.pose());
  await page.evaluate(() => document.getElementById('drv-chip').click()); await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + `${label}-drive-selector.png` });
  await page.evaluate(() => document.getElementById('drv-chip').click());
  await page.evaluate(() => window.__game.setControls('wheel', false)); await page.waitForTimeout(300); // opt-in Settings choice
  await hold(page, '#pd-gas', 'pointerdown', 7); await page.waitForTimeout(1500);
  await page.screenshot({ path: OUT + `${label}-optin-wheel-pedals.png` });
  await hold(page, '#pd-gas', 'pointerup', 7);
  log[label] = { errors, defaultScheme: 'halves', autoForwardMoved: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1) };
  await ctx.close();
}
fs.writeFileSync(OUT + 'evidence-log.json', JSON.stringify(log, null, 1));
console.log(JSON.stringify(log, null, 1));
await browser.close();
