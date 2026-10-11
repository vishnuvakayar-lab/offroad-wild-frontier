import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await p.goto('http://127.0.0.1:4173/'); await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 });
await p.evaluate(() => { const g = window.__game; g.startMission('race-loop'); g.botRun(7); });
for (let i=0;i<3;i++){ await p.waitForTimeout(700);
console.log(await p.evaluate(() => { const g = window.__game, m = g.mission, gate = g.missions[0].gates[m.next], c = g.pose(); return JSON.stringify({ c, gate, bearing: Math.atan2(gate.x-c.x, gate.z-c.z), tf: document.getElementById('mh-arrow').style.transform, cs: getComputedStyle(document.getElementById('mh-arrow')).transform }); }));}
await b.close();
