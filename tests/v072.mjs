// 0.7.2 checks: new vehicles (van + 4 military), 3D steering wheel rotation, camera views (chase/driver/mirror/orbit),
// local split-screen 2P (keyboard + touch set), online "server not hosted" notice. Emulation only (not a real iPhone).
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:4173/';
const OUT = new URL('../screenshots/v073/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const CH = { executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
const res = []; const ok = (n, p, d = '') => { res.push({ n, p, d }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}  ${d}`); };
const frames = (page, n) => page.evaluate(async (n) => { for (let i = 0; i < n; i++) await new Promise((r) => requestAnimationFrame(r)); }, n);
const hold = async (page, ms, n) => { const t0 = Date.now(); await frames(page, n); const l = ms - (Date.now() - t0); if (l > 0) await page.waitForTimeout(l); };
const shot = (page, f) => page.screenshot({ path: OUT + f });
const boot = async (page, q = '?noopening&dev=1') => {
  await page.goto(APP + q); await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 180000 });
};
const browser = await chromium.launch(CH);
const errors = [];
{ // desktop
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  ok('build label 0.8.0', /Build 0\.8\.0/.test(await page.textContent('body')));
  // vehicles in garage
  const ids = await page.evaluate(() => window.__game.vehicles);
  ok('vehicle list has van, ltv, patrol, cargo6, mrap + the 6 originals', ['scout','voyager','sahara','pickup','rally','recovery','van','ltv','patrol','cargo6','mrap'].every((i) => ids.includes(i)), ids.join(','));
  await page.click('#btn-garage'); await page.waitForTimeout(800);
  for (const id of ids) {
    const st = await page.evaluate((id) => { window.__game.garageHold(1.2); const i = window.__game.vehicles.indexOf(id); const cur = window.__game.vehicles.indexOf(window.__game.vehicle.id); return [i, cur]; }, id);
    // step the garage to the vehicle
    for (let k = 0; k < 20 && (await page.evaluate(() => window.__game.vehicle.id)) !== id; k++) await page.keyboard.press('ArrowRight'), await page.waitForTimeout(150);
    await frames(page, 25);
    const v = await page.evaluate(() => ({ id: window.__game.vehicle.id, stats: window.__game.carStats?.() }));
    ok(`garage shows ${id}`, v.id === id, JSON.stringify(v.stats ?? {}).slice(0, 80)); await shot(page, `garage-${id}.png`);
  }
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  // handling differs: drive each new vehicle 4 s full throttle on flat ground
  for (const id of ['scout', 'van', 'ltv', 'patrol', 'cargo6', 'mrap']) {
    await page.evaluate((id) => { const g = window.__game; g.setVehicle(id); document.getElementById('btn-play').click(); }, id);
    await page.waitForFunction(() => window.__game.phase === 'playing');
    await page.keyboard.down('KeyW'); await page.waitForTimeout(4000); await page.keyboard.up('KeyW');
    const s = await page.evaluate(() => window.__game.state());
    ok(`${id} drives (W key) and stays upright`, s.speed > 3 && s.up > 0.7, `${(s.speed * 3.6).toFixed(0)} km/h after 4 s, up ${s.up.toFixed(2)}`);
    await page.keyboard.press('Escape'); await page.click('#btn-menu').catch(() => {}); await page.waitForTimeout(400);
  }
  // steering wheel + camera views (scout + mrap)
  for (const id of ['scout', 'mrap']) {
    await page.evaluate((id) => { window.__game.setVehicle(id); document.getElementById('btn-play').click(); }, id);
    await page.waitForFunction(() => window.__game.phase === 'playing'); await frames(page, 30);
    const a0 = await page.evaluate(() => window.__game.wheelAngle());
    await page.keyboard.press('KeyC'); await page.waitForTimeout(300);
    const m1 = await page.evaluate(() => window.__game.camMode);
    await page.keyboard.down('KeyA'); await hold(page, 900, 60);
    const aL = await page.evaluate(() => window.__game.wheelAngle());
    await shot(page, `cam-driver-left-${id}.png`); await page.keyboard.up('KeyA');
    await page.keyboard.down('KeyD'); await hold(page, 900, 90);
    const aR = await page.evaluate(() => window.__game.wheelAngle()); await shot(page, `cam-driver-right-${id}.png`); await page.keyboard.up('KeyD');
    ok(`${id}: C key -> driver view; 3D steering wheel rotates with steering (left/right opposite)`, m1 === 'cockpit' && a0 !== null && aL < -0.5 && aR > 0.5, `mode ${m1}, angle rest ${a0?.toFixed(2)} left ${aL?.toFixed(2)} right ${aR?.toFixed(2)} rad`);
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyC'); await page.keyboard.down('KeyW'); await page.waitForTimeout(1200);
    const m2 = await page.evaluate(() => [window.__game.camMode, document.getElementById('game').classList.contains('mirrored')]);
    await shot(page, `cam-mirror-${id}.png`); await page.keyboard.up('KeyW');
    ok(`${id}: C -> left mirror view (image flipped)`, m2[0] === 'mirror' && m2[1], JSON.stringify(m2));
    await page.click('#btn-cam'); await page.waitForTimeout(300);
    const m3 = await page.evaluate(() => window.__game.camMode);
    const c0 = await page.evaluate(() => window.__game.state().camera);
    await page.mouse.move(700, 400); await page.mouse.down(); await page.mouse.move(400, 380, { steps: 10 }); await page.mouse.up();
    await frames(page, 5); const c1 = await page.evaluate(() => window.__game.state().camera);
    await shot(page, `cam-orbit-${id}.png`);
    ok(`${id}: 🎥 button -> 360° orbit; mouse drag rotates around the vehicle`, m3 === 'orbit' && Math.hypot(c1.x - c0.x, c1.z - c0.z) > 2, `moved ${Math.hypot(c1.x - c0.x, c1.z - c0.z).toFixed(1)} m`);
    await page.click('#btn-cam'); await frames(page, 20);
    ok(`${id}: button cycles back to chase`, (await page.evaluate(() => window.__game.camMode)) === 'chase'); await shot(page, `cam-chase-${id}.png`);
    await page.keyboard.press('Escape'); await page.click('#btn-menu').catch(() => {}); await page.waitForTimeout(400);
  }
  // split-screen
  await page.evaluate(() => window.__game.setVehicle('ltv'));
  await page.click('#btn-split'); await page.waitForFunction(() => window.__game.phase === 'playing'); await frames(page, 20);
  const p1a = await page.evaluate(() => window.__game.state()), p2a = await page.evaluate(() => window.__game.split.p2());
  await page.keyboard.down('ArrowUp'); await hold(page, 3000, 150); await page.keyboard.up('ArrowUp');
  await page.evaluate(() => window.__game.split.setP2({ throttle: 0, brake: 1, steer: 0, handbrake: true })); await hold(page, 1500, 90);
  const p1b0 = await page.evaluate(() => window.__game.state()), p2b = await page.evaluate(() => window.__game.split.p2());
  ok('split-screen: arrow keys drive P2 only', Math.hypot(p2b.x - p2a.x, p2b.z - p2a.z) > 3 && Math.hypot(p1b0.x - p1a.x, p1b0.z - p1a.z) < 1, `P2 moved ${Math.hypot(p2b.x - p2a.x, p2b.z - p2a.z).toFixed(1)} m, P1 ${Math.hypot(p1b0.x - p1a.x, p1b0.z - p1a.z).toFixed(1)} m`);
  const p1b = await page.evaluate(() => window.__game.state());
  await page.keyboard.down('KeyW'); await hold(page, 1500, 50);
  const p1c = await page.evaluate(() => window.__game.state()), p2c = await page.evaluate(() => window.__game.split.p2());
  await page.keyboard.up('KeyW');
  ok('split-screen: WASD drives P1 only', Math.hypot(p1c.x - p1b.x, p1c.z - p1b.z) > 3 && p2c.input.throttle === 0 && p2c.p1input.throttle > 0, `P1 moved ${Math.hypot(p1c.x - p1b.x, p1c.z - p1b.z).toFixed(1)} m; P1 input throttle ${p2c.p1input.throttle}, P2 input throttle ${p2c.input.throttle}`);
  await shot(page, 'split-desktop.png');
  await page.keyboard.press('Escape'); await page.click('#btn-menu'); await page.waitForTimeout(400);
  ok('leaving to menu ends split-screen', !(await page.evaluate(() => window.__game.split.on)));
  // online lobby: not hosted (only meaningful on github.io; locally the page is served by vite without a server)
  await page.click('#btn-online'); await page.waitForTimeout(500); await shot(page, 'online-lobby-local.png');
  await page.close();
}
{ // GitHub-Pages-like static host check is done on the live preview (see LIVE run); touch split-screen here
  const ctx = await browser.newContext({ ...devices['iPhone 13 Pro Max landscape'] });
  const page = await ctx.newPage(); page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await page.click('#btn-split'); await page.waitForFunction(() => window.__game.phase === 'playing'); await frames(page, 20);
  const vis = await page.evaluate(() => ['p2-wheel', 'p2-gas', 'p2-brake', 'wheel', 'pd-gas', 'pd-brake'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return [id, r.width > 0 && r.top >= 0 && r.bottom <= innerHeight, Math.round(r.top)]; }));
  ok('touch split-screen: P1 wheel+pedals (bottom) + smaller P2 wheel+pedals (above the divider) visible', vis.every((v) => v[1]), JSON.stringify(vis));
  const p2a = await page.evaluate(() => window.__game.split.p2());
  const b = await page.locator('#p2-gas').boundingBox();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2, id: 1 }] });
  await page.waitForTimeout(3000);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const p2b = await page.evaluate(() => window.__game.split.p2());
  ok('touch split-screen: holding P2 GAS drives P2', Math.hypot(p2b.x - p2a.x, p2b.z - p2a.z) > 3, `P2 moved ${Math.hypot(p2b.x - p2a.x, p2b.z - p2a.z).toFixed(1)} m`);
  { // P2 wheel: real rotational drag (CDP touch) 120° clockwise
    const w = await page.locator('#p2-wheel').boundingBox(); const cx = w.x + w.width / 2, cy = w.y + w.height / 2, R = w.width * 0.4;
    const pt = (a) => ({ x: cx + Math.cos(a * Math.PI / 180) * R, y: cy + Math.sin(a * Math.PI / 180) * R, id: 7 });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(-90)] });
    for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(-90 + i * 10)] });
    await frames(page, 30);
    const u = await page.evaluate(() => window.__game.wheelUI()); const q = await page.evaluate(() => window.__game.split.p2());
    await page.screenshot({ path: OUT + 'split-touch-p2-wheel.png' });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    ok('touch split-screen: P2 steering wheel drag steers P2 right and its 3D wheel mirrors it', u.p2deg > 100 && q.input.steer < -0.15 && Math.abs(u.p2angle * 180 / Math.PI - u.p2deg) < 0.5, `P2 wheel ${u.p2deg.toFixed(0)}°, 3D ${(u.p2angle * 180 / Math.PI).toFixed(0)}°, P2 steer ${q.input.steer.toFixed(2)}`);
  }
  await page.screenshot({ path: OUT + 'split-touch-iphone13promax-landscape.png' });
  // P1 touch still works in single-player
  await page.evaluate(() => window.__game.split.stop());
  await page.close();
}
await browser.close();
ok('no page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
const pass = res.filter((r) => r.p).length; console.log(`\n${pass}/${res.length} passed`);
fs.writeFileSync(OUT + 'results.json', JSON.stringify(res, null, 1));
process.exit(pass === res.length ? 0 : 1);
