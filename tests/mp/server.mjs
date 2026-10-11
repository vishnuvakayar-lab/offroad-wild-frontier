// Start/stop the real multiplayer server (dist-server/server.mjs) for tests.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
export async function startServer(port, extraEnv = {}) {
  const log = fs.openSync(`/tmp/owf-mp-${port}.log`, 'w');
  const proc = spawn(process.execPath, [ROOT + 'dist-server/server.mjs'], { env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DEBUG_API: '1', ALLOW_NET_SIM: '1', MAX_CONN_PER_IP: '30', CONN_PER_MIN: '400', ...extraEnv }, stdio: ['ignore', log, log] });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) { try { const r = await fetch(base + '/healthz'); if (r.ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }
  return { proc, base, ws: `ws://127.0.0.1:${port}/ws`, pid: proc.pid, debug: async () => (await fetch(base + '/debug/rooms')).json(), health: async () => (await fetch(base + '/healthz')).json(),
    stop: () => new Promise((r) => { proc.once('exit', r); proc.kill('SIGTERM'); setTimeout(() => proc.kill('SIGKILL'), 3000); }), logFile: `/tmp/owf-mp-${port}.log` };
}
/** CPU % (of one core) and RSS of a process over a window, from /proc */
export function procSample(pid) {
  const st = fs.readFileSync(`/proc/${pid}/stat`, 'utf8').split(') ')[1].split(' ');
  const ticks = +st[11] + +st[12]; const rss = +fs.readFileSync(`/proc/${pid}/status`, 'utf8').match(/VmRSS:\s+(\d+)/)[1] / 1024;
  return { ticks, rss, t: performance.now() };
}
export const cpuPct = (a, b) => ((b.ticks - a.ticks) / 100) / ((b.t - a.t) / 1000) * 100; // CLK_TCK = 100
