import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
await p.goto('http://127.0.0.1:4173/?dev=1'); await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 });
const veh = process.argv[2] || 'scout';
for (const id of (process.argv[3]||'race-loop,race-dash,ch-mud,ch-climb,rs-tow,rs-deliver').split(',')) {
  const r = await p.evaluate(([id,veh]) => { const g = window.__game; g.setVehicle(veh); g.startMission(id); return g.botRun(id==='rs-tow'?240:90, { slowZone: id==='rs-deliver' }); }, [id,veh]);
  const pos = await p.evaluate(() => [window.__game.pose(), window.__game.stuckPos()]);
  console.log(veh, id, JSON.stringify(r), JSON.stringify(pos));
}
console.log('errors', errs.slice(0,5));
await b.close();
