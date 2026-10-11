// Rework screenshots: node tests/rework-shots.mjs [prefix]  (URL env, default dev server)
import { chromium } from 'playwright';
import fs from 'node:fs';
const APP = process.env.URL || 'http://127.0.0.1:5180/';
const OUT = new URL('../screenshots/rework/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const pre = process.argv[2] || 'after';
const only = process.argv[3] ? process.argv[3].split(',') : null;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.addInitScript(() => localStorage.setItem('owf.settings.v1', JSON.stringify({ preset: 'high', intro: false, showFps: true })));
await page.goto(APP);
await page.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 120000 });
await page.waitForTimeout(1500);
await page.mouse.click(5, 5);
await page.evaluate(() => window.__game.play());
await page.waitForFunction(() => window.__game.phase === 'playing');
const shots = [
  // name, weather, teleport [x,z,yaw], drive input, seconds of real-time driving
  ['mud-basin', 'clear', [-40, 30, -1.75], { throttle: 1, brake: 0, steer: 0.15, handbrake: false }, 3],
  ['mud-puddles', 'clear', [-60, 62, -2.6], { throttle: 0.7, brake: 0, steer: 0, handbrake: false }, 2.5],
  ['jungle-edge', 'clear', [-20, 60, -1.2], { throttle: 0.6, brake: 0, steer: 0, handbrake: false }, 2],
  ['dunes', 'clear', [60, -20, 2.4], { throttle: 1, brake: 0, steer: 0, handbrake: false }, 3],
  ['dunes-sunset', 'sunset', [100, -10, 2.9], { throttle: 1, brake: 0, steer: 0.2, handbrake: false }, 3],
  ['rain-mud', 'rain', [-40, 30, -1.75], { throttle: 1, brake: 0, steer: 0, handbrake: false }, 3],
  ['night-jungle', 'night', [-30, 40, -1.6], { throttle: 0.6, brake: 0, steer: 0, handbrake: false }, 2.5],
  ['fog', 'fog', [-30, 40, -1.6], { throttle: 0.6, brake: 0, steer: 0, handbrake: false }, 2.5],
  ['spawn', 'clear', null, { throttle: 0.5, brake: 0, steer: 0, handbrake: false }, 1.5],
];
const metrics = {};
for (const [name, w, tp, inp, sec] of shots) {
  if (only && !only.includes(name)) continue;
  await page.evaluate(([w, tp]) => { window.__game.setWeather(w); if (tp) window.__game.teleport(...tp); else window.__game.teleport(0, -8, Math.atan2(88, -47)); }, [w, tp]);
  await page.waitForTimeout(900);
  await page.evaluate((i) => window.__game.setInput(i), inp);
  await page.waitForTimeout(sec * 1000);
  await page.evaluate(() => window.__game.setInput(null));
  await page.screenshot({ path: `${OUT}${pre}-${name}.png` });
  metrics[name] = await page.evaluate(() => { const s = window.__game.state(); return { fps: s.fps, draws: s.renderer.calls, tris: s.renderer.triangles, surface: s.surface }; });
}
fs.writeFileSync(`${OUT}${pre}-metrics.json`, JSON.stringify({ metrics, errors }, null, 1));
console.log(JSON.stringify({ metrics, errors }, null, 1));
await browser.close();
