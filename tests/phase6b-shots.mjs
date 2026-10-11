// Phase 6b screenshots: ridge from a distance / on the trail, supply run route, results with new targets.
// PREFIX=before- to capture the old ridge for comparison.
import { chromium } from 'playwright';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const PRE = process.env.PREFIX || '';
const OUT = new URL('../screenshots/phase6b/', import.meta.url).pathname;
const only = process.argv[2]; const want = (n) => !only || only.split(',').includes(n);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(APP + '?dev=1'); await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 }); await p.waitForTimeout(1500);
const shot = (n) => p.screenshot({ path: OUT + PRE + n + '.png' });
await p.click('#btn-play'); await p.waitForTimeout(300); await p.click('#btn-skip').catch(() => {}); await p.waitForFunction(() => window.__game.phase === 'playing');
if (want('far')) {
  await p.evaluate(() => { const g = window.__game; g.teleport(-20, -20, Math.atan2(-1, -1)); g.camWorld([[-14, g.heightAt(-14, -14) + 9, -14], [-96, 14, -96]]); });
  await p.waitForTimeout(1500); await shot('ridge-from-distance');
  await p.evaluate(() => { const g = window.__game; g.camWorld([[-30, 30, -150], [-96, 12, -90]]); }); await p.waitForTimeout(1200); await shot('ridge-side-view');
  await p.evaluate(() => window.__game.camWorld(null));
}
if (want('trail')) {
  for (const [secs, n] of [[0.1, 'climb-trail-start'], [process.env.T1 || 6, 'climb-trail-mid'], [process.env.T2 || 14, 'climb-trail-high']]) {
    await p.evaluate((s) => { const g = window.__game; g.startMission('ch-climb'); g.botRun(s); g.setInput({ throttle: 0, brake: 1, steer: 0, handbrake: true }); }, +secs);
    await p.waitForTimeout(1500); await shot(n);
  }
  await p.evaluate(() => window.__game.setInput(null));
}
if (want('deliver')) {
  for (const [secs, n] of [[process.env.D1 || 10, 'supply-run-route'], [process.env.D2 || 30, 'supply-run-dusk']]) {
    await p.evaluate((s) => { const g = window.__game; g.startMission('rs-deliver'); g.botRun(s, { slowZone: true }); g.setInput({ throttle: 0, brake: 1, steer: 0, handbrake: true }); }, +secs);
    await p.waitForTimeout(1500); await shot(n);
  }
  await p.evaluate(() => window.__game.setInput(null));
}
if (want('results')) {
  await p.evaluate(() => { const g = window.__game; g.startMission('ch-climb'); g.botRun(200); });
  await p.waitForFunction(() => window.__game.phase === 'results', null, { timeout: 30000 }); await p.waitForTimeout(800); await shot('results-new-targets');
}
console.log('errors', errs);
await b.close();
