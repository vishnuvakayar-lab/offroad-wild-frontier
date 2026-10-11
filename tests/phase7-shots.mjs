// Phase 7 screenshots: lobby (desktop / portrait / landscape), private room code, two clients side by side in a convoy, race results.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { startServer } from './mp/server.mjs';
const OUT = new URL('../screenshots/phase7/', import.meta.url).pathname;
const only = process.argv[2]; const want = (n) => !only || only.split(',').includes(n);
const srv = await startServer(8095);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errs = [];
async function open(name, vp, opts = {}) {
  const ctx = await b.newContext({ viewport: vp, ...opts }); const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); }); p.on('pageerror', (e) => errs.push(name + ' pageerror: ' + e.message));
  await p.goto(srv.base + '/'); await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 90000 });
  await p.evaluate((n) => localStorage.setItem('owf.mp.name', n), name); await p.click('#btn-online'); await p.waitForTimeout(600); return p;
}
const shot = (p, n) => p.screenshot({ path: OUT + n + '.png' });
const inRoom = (p) => p.waitForFunction(() => window.__net.inRoom, null, { timeout: 20000 });
if (want('lobby')) {
  const d = await open('Vishnu', { width: 1280, height: 720 }); await d.waitForTimeout(800); await shot(d, 'lobby-desktop');
  const m = await open('Vishnu', { width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 1 }); await m.waitForTimeout(800); await shot(m, 'lobby-portrait');
  const l = await open('Vishnu', { width: 844, height: 390 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 1 }); await l.waitForTimeout(800); await shot(l, 'lobby-landscape');
  for (const p of [d, m, l]) await p.context().close();
}
if (want('convoy')) {
  const A = await open('Vishnu', { width: 640, height: 400 }), B = await open('Arjun', { width: 640, height: 400 });
  await A.evaluate(() => window.__net.create('convoy')); await inRoom(A);
  const code = await A.evaluate(() => window.__net.room.code);
  await B.fill('#lb-code', code); await B.click('#lb-join'); await inRoom(B);
  await A.waitForTimeout(1500);
  const C = await open('Vishnu', { width: 1280, height: 720 }); await C.context().close(); // (warm-up only)
  await A.setViewportSize({ width: 1280, height: 720 }); await A.waitForTimeout(800); await shot(A, 'private-room-code');
  await A.setViewportSize({ width: 640, height: 400 });
  await A.evaluate(() => { window.__net.drive(); window.__net.setWaypoint(); });
  await B.evaluate(() => window.__net.drive());
  // Arjun follows Vishnu's line a little behind
  await A.evaluate(() => window.__net.setPilot({ throttle: 0.55, route: 'loop' })); await A.waitForTimeout(2500);
  await B.evaluate(() => window.__net.setPilot({ throttle: 0.6, route: 'loop' }));
  await A.waitForTimeout(9000);
  await A.screenshot({ path: '/tmp/convoy-a.png' }); await B.screenshot({ path: '/tmp/convoy-b.png' });
  execFileSync('python3', ['-c', `from PIL import Image, ImageDraw
a=Image.open('/tmp/convoy-a.png'); b=Image.open('/tmp/convoy-b.png'); w,h=a.size
o=Image.new('RGB',(w*2+8,h),(20,17,13)); o.paste(a,(0,0)); o.paste(b,(w+8,0))
d=ImageDraw.Draw(o); d.rectangle([4,h-26,170,h-4],fill=(0,0,0)); d.text((10,h-22),'Client 1: Vishnu',fill=(255,255,255)); d.rectangle([w+12,h-26,w+170,h-4],fill=(0,0,0)); d.text((w+18,h-22),'Client 2: Arjun',fill=(255,255,255))
o.save('${OUT}convoy-two-clients.png')`]);
  await A.context().close(); await B.context().close();
}
if (want('race')) {
  const A = await open('Vishnu', { width: 1280, height: 720 }), B = await open('Arjun', { width: 640, height: 400 });
  await A.evaluate(() => window.__net.create('race')); await inRoom(A);
  const code = await A.evaluate(() => window.__net.room.code); await B.evaluate((c) => window.__net.join(c), code); await inRoom(B);
  await A.waitForTimeout(1000);
  await A.evaluate(() => { window.__net.setPilot({ throttle: 1, route: 'race' }); window.__net.startRace(); });
  await B.evaluate(() => window.__net.setPilot({ throttle: 0.8, route: 'race' }));
  await A.waitForFunction(() => window.__net.room?.state === 'racing', null, { timeout: 20000 }); await A.waitForTimeout(6000); await shot(A, 'race-in-progress');
  await A.waitForFunction(() => window.__net.room?.state === 'results', null, { timeout: 150000 });
  await A.waitForTimeout(1200); await shot(A, 'race-results');
  await A.context().close(); await B.context().close();
}
console.log('errors', errs);
await b.close(); await srv.stop();
