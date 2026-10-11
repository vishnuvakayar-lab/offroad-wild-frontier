import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
p.on('console', m => { if (m.type() !== 'log') console.log('CONSOLE', m.type(), m.text().slice(0, 300)); });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('http://127.0.0.1:4173/');
await p.waitForFunction(() => window.__game?.phase === 'menu' || window.__game?.phase === 'opening', null, { timeout: 60000 }); await p.evaluate(() => window.__game.skipOpening());
console.log('boot', JSON.stringify(await p.evaluate(() => window.__boot)));
await p.waitForTimeout(800);
await p.click('#btn-play');
for (const t of [1000, 2500, 4500]) { await p.waitForTimeout(t === 1000 ? 1000 : 1500); await p.screenshot({ path: `/tmp/owf-intro-${t}.png` }); }
await p.click('#btn-skip'); await p.waitForTimeout(300);
console.log('phase', await p.evaluate(() => window.__game.phase));
const st = () => p.evaluate(() => window.__game.state());
console.log(JSON.stringify((await st()).audio), (await st()).rpm);
await p.keyboard.down('KeyW'); await p.waitForTimeout(4000);
let s = await st(); console.log('drive', s.x.toFixed(1), s.z.toFixed(1), (s.speed*3.6).toFixed(0), s.rpm.toFixed(0), JSON.stringify(s.audio), JSON.stringify(s.particles), s.puddle, await p.evaluate(() => window.__game.measureEngineHz()));
await p.screenshot({ path: '/tmp/owf-p4-drive.png' });
await p.keyboard.up('KeyW');
await p.evaluate(() => { window.__game.teleport(-100, 30, 1.2); window.__game.setInput({ throttle: 1, brake: 0, steer: 0.3, handbrake: false }); });
await p.waitForTimeout(3000);
s = await st(); console.log('mud', JSON.stringify(s.particles), s.slip.map(x=>x.toFixed(2)), s.rpm.toFixed(0), s.tracks);
await p.screenshot({ path: '/tmp/owf-p4-mud.png' });
for (const w of ['sunset','fog','rain','night']) {
  await p.evaluate((w) => window.__game.setWeather(w), w);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `/tmp/owf-p4-${w}.png` });
}
await b.close();
