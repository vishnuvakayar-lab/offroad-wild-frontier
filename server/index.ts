// OFFROAD: WILD FRONTIER multiplayer server: serves the built web client (dist/) and the authoritative
// WebSocket game server (/ws) from one Node process. Health: GET /healthz.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { WebSocketServer, type WebSocket } from 'ws';
import RAPIER from '@dimforge/rapier3d-compat';
import { Room, type Player, type Conn } from './room';
import { buildTerrainColliders } from '../src/terrain';
import { Bucket, KeyedBuckets } from './ratelimit';
import { PROTO, TICK_HZ, MAX_INPUTS_PER_MSG, CODE_ALPHABET, sanitizeInput, sanitizeName, validVehicle, validPaint, normCode, type RoomMode } from '../src/net/protocol';
import type { DriveInput } from '../src/vehicle';

const env = (k: string, d: string) => process.env[k] ?? d;
const CFG = {
  port: +env('PORT', '8080'), host: env('HOST', '0.0.0.0'),
  staticDir: path.resolve(env('STATIC_DIR', path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dist'))),
  maxRooms: +env('MAX_ROOMS', '24'), maxConnPerIp: +env('MAX_CONN_PER_IP', '12'), connPerMin: +env('CONN_PER_MIN', '60'),
  graceMs: +env('RECONNECT_GRACE_MS', '30000'), debug: env('DEBUG_API', '0') === '1', allowNetSim: env('ALLOW_NET_SIM', '0') === '1',
  trustProxy: env('TRUST_PROXY', '1') === '1', version: env('APP_VERSION', '0.5.0'),
};
const log = (m: string) => console.log(new Date().toISOString(), m);

await RAPIER.init();
{ const t0 = Date.now(), w = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); const n = buildTerrainColliders(w, RAPIER); w.free(); log(`terrain colliders ready (${n}) in ${Date.now() - t0} ms`); }
const rooms = new Map<string, Room>();
const startedAt = Date.now();
const tickMs: number[] = [];

// ---------------- HTTP: static client + health ----------------
const MIME: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.wasm': 'application/wasm', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8' };
const httpLimit = new KeyedBuckets(600, 10); // 600 requests / 60 s per IP (burst 600, 10/s refill)
const clientIp = (req: http.IncomingMessage) => {
  const ra = req.socket.remoteAddress ?? '?';
  const xf = req.headers['x-forwarded-for'];
  if (CFG.trustProxy && (ra === '127.0.0.1' || ra === '::1' || ra === '::ffff:127.0.0.1') && typeof xf === 'string') return xf.split(',')[0].trim();
  return ra;
};
const pct = (a: number[], p: number) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
function health() {
  const m = process.memoryUsage();
  let players = 0; for (const r of rooms.values()) players += r.count;
  return { ok: true, version: CFG.version, uptimeS: Math.round((Date.now() - startedAt) / 1000), rooms: rooms.size, players, connections: conns.size, tickHz: TICK_HZ,
    tickMs: { p50: +pct(tickMs, 0.5).toFixed(3), p95: +pct(tickMs, 0.95).toFixed(3), max: +Math.max(0, ...tickMs).toFixed(3) }, mem: { rssMB: +(m.rss / 1048576).toFixed(1), heapMB: +(m.heapUsed / 1048576).toFixed(1) } };
}
const server = http.createServer((req, res) => {
  const ip = clientIp(req);
  if (!httpLimit.take(ip)) { res.writeHead(429, { 'retry-after': '10' }); res.end('Too many requests'); return; }
  const url = new URL(req.url ?? '/', 'http://x');
  if (url.pathname === '/healthz') { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(health())); return; }
  if (CFG.debug && url.pathname === '/debug/rooms') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ health: health(), rooms: [...rooms.values()].map((r) => r.debug()), conns: [...conns.values()].map((c) => ({ ip: c.ip, room: c.room?.id ?? null, player: c.player?.id ?? null, dropped: c.dropped, violations: c.violations })) })); return; }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  let rel = decodeURIComponent(url.pathname); if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(CFG.staticDir, '.' + rel);
  if (!file.startsWith(CFG.staticDir + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found'); return; }
    const hashed = rel.startsWith('/assets/');
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream', 'content-length': st.size, 'x-content-type-options': 'nosniff',
      'cache-control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache' });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  });
});

// ---------------- WebSocket game server ----------------
interface Client {
  ws: WebSocket; ip: string; prof: { name: string; vehicle: string; paint: number } | null;
  room: Room | null; player: Player | null; msgs: Bucket; inputs: Bucket; joins: Bucket; lastMsg: number; dropped: number; violations: number; send: (d: string | Uint8Array) => void;
}
const conns = new Set<Client>();
const ipConns = new Map<string, number>();
const connRate = new KeyedBuckets(CFG.connPerMin, CFG.connPerMin / 60);
const joinRate = new KeyedBuckets(12, 0.2); // code join/create attempts: burst 12, then 1 per 5 s per IP (code brute force)
const wss = new WebSocketServer({ noServer: true, maxPayload: 4096 });

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url ?? '/', 'http://x'), ip = clientIp(req);
  if (url.pathname !== '/ws') { socket.destroy(); return; }
  const refuse = (code: number, msg: string) => { socket.write(`HTTP/1.1 ${code} ${msg}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`); socket.destroy(); };
  if ((ipConns.get(ip) ?? 0) >= CFG.maxConnPerIp) { refuse(429, 'Too Many Connections'); log(`refused ${ip}: too many connections`); return; }
  if (!connRate.take(ip)) { refuse(429, 'Too Many Requests'); log(`refused ${ip}: connection rate`); return; }
  wss.handleUpgrade(req, socket, head, (ws) => onConnection(ws, ip, url));
});

function onConnection(ws: WebSocket, ip: string, url: URL) {
  ipConns.set(ip, (ipConns.get(ip) ?? 0) + 1);
  // optional latency/jitter simulation for local testing only (ALLOW_NET_SIM=1); preserves message order like TCP
  const lag = CFG.allowNetSim ? Math.min(1000, +(url.searchParams.get('simlag') ?? 0)) : 0, jit = CFG.allowNetSim ? Math.min(200, +(url.searchParams.get('simjitter') ?? 0)) : 0;
  let outAt = 0, inAt = 0;
  const delay = (lastAt: number) => Math.max(lastAt, Date.now() + lag / 2 + (Math.random() * 2 - 1) * jit);
  const rawSend = (d: string | Uint8Array) => { if (ws.readyState === ws.OPEN) ws.send(d); };
  const c: Client = { ws, ip, prof: null, room: null, player: null, msgs: new Bucket(100, 50), inputs: new Bucket(60, 75), joins: new Bucket(6, 1), lastMsg: Date.now(), dropped: 0, violations: 0,
    send: lag ? (d) => { outAt = delay(outAt); setTimeout(() => rawSend(d), outAt - Date.now()); } : rawSend };
  conns.add(c);
  ws.on('message', (data, isBinary) => {
    if (lag) { inAt = delay(inAt); const d = data; setTimeout(() => onMessage(c, d as Buffer, isBinary), inAt - Date.now()); } else onMessage(c, data as Buffer, isBinary);
  });
  ws.on('close', () => {
    conns.delete(c); ipConns.set(ip, (ipConns.get(ip) ?? 1) - 1); if (!ipConns.get(ip)) ipConns.delete(ip);
    const p = c.player, r = c.room;
    if (p && r && p.conn === connOf(c)) r.setAway(p); // hold the car for the reconnect grace period
  });
  ws.on('error', () => {});
  c.send(JSON.stringify({ t: 'hi', proto: PROTO, version: CFG.version, tickHz: TICK_HZ, graceMs: CFG.graceMs }));
}
const connCache = new WeakMap<Client, Conn>();
function connOf(c: Client): Conn { let k = connCache.get(c); if (!k) { k = { send: (d) => c.send(d), close: (code, why) => c.ws.close(code, why) }; connCache.set(c, k); } return k; }
const err = (c: Client, code: string, msg: string) => c.send(JSON.stringify({ t: 'err', code, msg }));
function violation(c: Client, what: string) {
  c.violations++; if (c.player) c.player.stats.violations++;
  if (c.violations === 1 || c.violations % 50 === 0) log(`violation ${c.ip} ${what} (${c.violations})`);
  if (c.violations > 200) { err(c, 'kicked', 'Too many invalid messages'); c.ws.close(4003, 'invalid messages'); }
}
const newCode = () => { for (;;) { let s = ''; const b = crypto.randomBytes(5); for (let i = 0; i < 5; i++) s += CODE_ALPHABET[b[i] % CODE_ALPHABET.length]; if (![...rooms.values()].some((r) => r.code === s)) return s; } };
function createRoom(mode: RoomMode, isPublic: boolean) {
  if (rooms.size >= CFG.maxRooms) return null;
  const id = crypto.randomBytes(4).toString('hex');
  const r = new Room(id, isPublic ? null : newCode(), mode, isPublic, RAPIER, log);
  rooms.set(id, r); log(`room ${id} created (${mode}, ${isPublic ? 'public' : 'private ' + r.code})`); return r;
}
function enter(c: Client, r: Room) {
  if (!c.prof) { err(c, 'hello', 'Say hello first'); return; }
  leave(c, 'switched room');
  const token = crypto.randomBytes(16).toString('hex');
  const p = r.addPlayer(connOf(c), c.prof, token);
  if (!p) { err(c, 'room_full', 'That room is full (8 players)'); return; }
  c.room = r; c.player = p;
  c.send(JSON.stringify({ t: 'joined', id: p.id, token, roomId: r.id, resumed: false, tick: r.tick, room: r.info() }));
}
function leave(c: Client, why: string) {
  if (c.room && c.player) c.room.removePlayer(c.player.id, why);
  c.room = null; c.player = null;
}
const FORGED_KEYS = ['x', 'y', 'z', 'pos', 'p', 'q', 'vel', 'lv', 'speed', 'state'];

function onMessage(c: Client, data: Buffer, isBinary: boolean) {
  if (c.ws.readyState !== c.ws.OPEN) return;
  c.lastMsg = Date.now();
  if (!c.msgs.take()) { c.dropped++; if (c.dropped === 1 || c.dropped % 100 === 0) { err(c, 'rate', 'Slow down: message rate limit'); log(`rate limit ${c.ip} (${c.dropped} dropped)`); } if (c.dropped > 400) c.ws.close(4008, 'rate limit'); return; }
  if (isBinary) { violation(c, 'binary'); return; }
  let m: any; try { m = JSON.parse(data.toString()); } catch { violation(c, 'json'); return; }
  if (!m || typeof m.t !== 'string') { violation(c, 'shape'); return; }
  const r = c.room, p = c.player;
  switch (m.t) {
    case 'hello': {
      if (m.proto !== PROTO) { err(c, 'proto', 'Client out of date — reload the page'); return; }
      const vehicle = validVehicle(m.vehicle);
      c.prof = { name: sanitizeName(m.name), vehicle, paint: validPaint(m.paint, vehicle) };
      if (typeof m.token === 'string' && m.token.length === 32) { // reconnect: resume the same car
        for (const room of rooms.values()) for (const q of room.players.values()) {
          if (q.token !== m.token) continue;
          const old = [...conns].find((k) => k.player === q && k !== c); if (old) { old.player = null; old.room = null; old.ws.close(4001, 'replaced'); }
          c.room = room; c.player = q; room.resume(q, connOf(c));
          c.send(JSON.stringify({ t: 'joined', id: q.id, token: q.token, roomId: room.id, resumed: true, tick: room.tick, room: room.info() })); return;
        }
        err(c, 'expired', 'Your previous session expired');
      }
      c.send(JSON.stringify({ t: 'ready', name: c.prof.name })); return;
    }
    case 'quick': {
      if (!c.joins.take()) { err(c, 'rate', 'Too many join attempts'); return; }
      const mode: RoomMode = m.mode === 'race' ? 'race' : 'convoy';
      let best: Room | null = null;
      for (const room of rooms.values()) if (room.isPublic && room.mode === mode && room.joinable && room !== c.room && (!best || room.count > best.count)) best = room;
      best ??= createRoom(mode, true);
      if (!best) { err(c, 'server_full', 'Server is full — try again later'); return; }
      enter(c, best); return;
    }
    case 'create': {
      if (!c.joins.take() || !joinRate.take(c.ip)) { err(c, 'rate', 'Too many rooms created — wait a moment'); return; }
      const room = createRoom(m.mode === 'race' ? 'race' : 'convoy', false);
      if (!room) { err(c, 'server_full', 'Server is full — try again later'); return; }
      enter(c, room); return;
    }
    case 'join': {
      if (!c.joins.take() || !joinRate.take(c.ip)) { err(c, 'rate', 'Too many join attempts — wait a moment'); return; }
      const code = normCode(m.code); const room = [...rooms.values()].find((x) => x.code && x.code === code);
      if (!room) { err(c, 'bad_code', `No room with code "${code}"`); return; }
      if (!room.joinable) { err(c, room.full ? 'room_full' : 'in_progress', room.full ? 'That room is full (8 players)' : 'Race in progress — try again in a moment'); return; }
      enter(c, room); return;
    }
    case 'leave': leave(c, 'left'); c.send(JSON.stringify({ t: 'left' })); return;
    case 'ping': if (p && typeof m.rtt === 'number' && Number.isFinite(m.rtt)) { p.ping = Math.min(9999, Math.max(0, m.rtt)); if (r && r.tick % 30 === 0) r.markDirty(); }
      c.send(JSON.stringify({ t: 'pong', c: typeof m.c === 'number' ? m.c : 0, tick: r?.tick ?? 0 })); return;
    case 'i': {
      if (!r || !p) return;
      if (FORGED_KEYS.some((k) => k in m)) { p.stats.forged++; violation(c, 'forged state field'); } // ignored: the server owns positions
      if (!Number.isInteger(m.s) || m.s < 1 || !Array.isArray(m.a) || m.a.length < 1 || m.a.length > MAX_INPUTS_PER_MSG) { violation(c, 'input shape'); return; }
      if (m.s > p.lastSeq + 3600) { violation(c, 'seq jump'); return; }
      const ins: DriveInput[] = [];
      for (const a of m.a) { const i = sanitizeInput(a); if (!i) { violation(c, 'input value'); return; } ins.push(i); }
      if (!c.inputs.take(ins.length)) { c.dropped += ins.length; violation(c, 'input rate'); return; } // faster than real time -> dropped
      r.pushInputs(p, m.s, ins); return;
    }
    case 'reset': if (r && p) r.requestReset(p); return;
    case 'wp': if (r && p) { if (!r.setWaypoint(p, m.clear ? null : Number(m.x), m.clear ? null : Number(m.z))) err(c, 'denied', 'Only the convoy leader can set the waypoint'); } return;
    case 'start': if (r && p && !r.startRace(p)) err(c, 'denied', 'Only the host can start the race'); return;
    default: violation(c, 'type ' + String(m.t).slice(0, 12));
  }
}

// ---------------- fixed-rate simulation loop ----------------
const PERIOD = 1000 / TICK_HZ;
let nextAt = performance.now();
function loop() {
  const now = performance.now();
  if (now - nextAt > PERIOD * 10) { log(`tick loop behind by ${(now - nextAt).toFixed(0)} ms; skipping`); nextAt = now; }
  while (now >= nextAt) {
    const t0 = performance.now();
    for (const r of rooms.values()) r.step();
    tickMs.push(performance.now() - t0); if (tickMs.length > 900) tickMs.shift();
    nextAt += PERIOD;
  }
  // housekeeping: expire away players after the grace period, delete empty rooms, drop silent sockets
  const wall = Date.now();
  for (const r of rooms.values()) {
    for (const p of [...r.players.values()]) if (p.awaySince !== null && wall - p.awaySince > CFG.graceMs) r.removePlayer(p.id, 'timed out');
    if (!r.count && r.emptySince !== null && wall - r.emptySince > 5000) { r.dispose(); rooms.delete(r.id); log(`room ${r.id} closed`); }
  }
  setTimeout(loop, Math.max(0, nextAt - performance.now()));
}
setInterval(() => { const now = Date.now(); for (const c of conns) { if (now - c.lastMsg > 25000) c.ws.close(4000, 'idle'); else if (c.ws.readyState === c.ws.OPEN) c.ws.ping(); } }, 10000);
loop();
server.listen(CFG.port, CFG.host, () => log(`listening on http://${CFG.host}:${CFG.port} (static ${CFG.staticDir}${CFG.debug ? ', DEBUG_API' : ''}${CFG.allowNetSim ? ', NET_SIM' : ''})`));
const shutdown = () => { log('shutting down'); for (const c of conns) c.ws.close(1001, 'server restart'); server.close(); setTimeout(() => process.exit(0), 500); };
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
