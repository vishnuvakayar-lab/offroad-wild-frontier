import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
p.on('console', m => console.log('CONSOLE', m.type(), m.text()));
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('http://127.0.0.1:4173/');
await p.waitForFunction(() => window.__game?.phase === 'menu', null, { timeout: 60000 });
console.log(await p.evaluate(() => { const c=document.createElement('canvas'); const g=c.getContext('webgl2'); const d=g.getExtension('WEBGL_debug_renderer_info'); return g.getParameter(d.UNMASKED_RENDERER_WEBGL); }));
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(() => window.__game.state())));
await p.evaluate(() => window.__game.play());
await p.evaluate(() => window.__game.setInput({throttle:1,brake:0,steer:0,handbrake:false}));
for (let i=0;i<6;i++){ await p.waitForTimeout(1000); const s = await p.evaluate(() => window.__game.state()); console.log(s.x.toFixed(2), s.y.toFixed(2), s.z.toFixed(2), s.speed.toFixed(2), s.surface, s.fps.toFixed(1)); }
await p.screenshot({ path: '/tmp/smoke.png' });
await b.close();
