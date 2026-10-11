// Phase 6 screenshots: mode select, missions in progress, results, garage unlocks/upgrades, portrait HUD.
import { chromium } from 'playwright';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const OUT = new URL('../screenshots/phase6/', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
async function open(opts, q = '') {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(APP + q); await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 }); await p.waitForTimeout(1500);
  return { p, ctx, errs };
}
const shot = (p, n) => p.screenshot({ path: OUT + n + '.png' });
const only = process.argv[2];
const want = (n) => !only || only.split(',').includes(n);
{
  const { p, ctx, errs } = await open({ viewport: { width: 1280, height: 720 } });
  if (want('modes')) { await p.click('#btn-modes'); await p.waitForTimeout(800); await shot(p, '01-mode-select-challenges');
    await p.click('#m-tabs [data-mode=race]'); await p.waitForTimeout(400); await shot(p, '02-mode-select-races'); await p.click('#m-back'); }
  const run = async (id, secs, name, opts = {}) => {
    await p.evaluate(([id, secs, o]) => { const g = window.__game; g.startMission(id); g.botRun(secs, o); }, [id, secs, opts]);
    await p.waitForTimeout(1500); await shot(p, name);
  };
  if (want('race')) await run('race-loop', 7, '03-race-dune-loop-in-progress');
  if (want('mud')) await run('ch-mud', 3.5, '04-challenge-mud-crossing');
  if (want('climb')) await run('ch-climb', 3, '05-challenge-ridge-climb');
  if (want('tow')) { await p.evaluate(() => { const g = window.__game; g.startMission('rs-tow'); g.botRun(9); }); await p.waitForTimeout(1500); await shot(p, '06-rescue-tow-hooked'); }
  if (want('deliver')) await run('rs-deliver', 4, '07-rescue-supply-run-dusk', { slowZone: true });
  if (want('results')) { await p.evaluate(() => { const g = window.__game; g.startMission('race-dash'); g.botRun(60); }); await p.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 20000 }); await p.waitForTimeout(800); await shot(p, '08-results'); }
  if (want('garage')) { await p.evaluate(() => { window.__game.endMission(); window.__game.addCredits(0); }); await p.click('#btn-garage'); await p.waitForTimeout(1000); await shot(p, '09-garage-upgrades');
    await p.click('#g-next'); await p.waitForTimeout(800); await shot(p, '10-garage-locked-vehicle'); }
  console.log('desktop errors', errs);
  await ctx.close();
}
if (want('portrait')) {
  const { p, ctx, errs } = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.click('#btn-modes'); await p.waitForTimeout(800); await shot(p, '11-portrait-mode-select');
  await p.evaluate(() => { const g = window.__game; g.startMission('race-dash'); g.botRun(5); }); await p.waitForTimeout(1500); await shot(p, '12-portrait-mission-hud');
  console.log('portrait errors', errs); await ctx.close();
}
if (want('landscape')) {
  const { p, ctx, errs } = await open({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.evaluate(() => { const g = window.__game; g.startMission('rs-tow'); g.botRun(9); }); await p.waitForTimeout(1500); await shot(p, '13-landscape-mission-hud-tow');
  console.log('landscape errors', errs); await ctx.close();
}
await b.close();
