// Browser WebSocket client: connection status, hello/resume token, ping, auto-reconnect with backoff.
import { PROTO, RECONNECT_GRACE_MS } from './protocol';

export type NetStatus = 'offline' | 'connecting' | 'online' | 'reconnecting';
const TOKEN_KEY = 'owf.mp.token';

export class NetClient {
  ws: WebSocket | null = null;
  status: NetStatus = 'offline';
  rtt = 0; rttSamples: number[] = [];
  lastError = '';
  reconnects = 0; private attempt = 0; private lostAt = 0; private intentional = false; private pingTimer = 0; private retryTimer = 0;
  profile = { name: 'Driver', vehicle: 'scout', paint: 0 };
  onStatus: (s: NetStatus) => void = () => {};
  onMsg: (m: any) => void = () => {};
  onSnap: (b: ArrayBuffer) => void = () => {};
  onReady: () => void = () => {};
  bytesIn = 0; msgsOut = 0;

  constructor(public url: string) {}
  get token() { return sessionStorage.getItem(TOKEN_KEY); }
  set token(t: string | null) { if (t) sessionStorage.setItem(TOKEN_KEY, t); else sessionStorage.removeItem(TOKEN_KEY); }
  private set(s: NetStatus) { if (this.status !== s) { this.status = s; this.onStatus(s); } }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    this.intentional = false;
    this.set(this.status === 'reconnecting' ? 'reconnecting' : 'connecting');
    let ws: WebSocket;
    try { ws = new WebSocket(this.url); } catch (e) { this.lastError = String(e); this.closed(); return; }
    ws.binaryType = 'arraybuffer'; this.ws = ws;
    ws.onopen = () => { this.send({ t: 'hello', proto: PROTO, ...this.profile, token: this.token }); };
    ws.onmessage = (e) => {
      if (typeof e.data !== 'string') { this.bytesIn += (e.data as ArrayBuffer).byteLength; this.onSnap(e.data as ArrayBuffer); return; }
      this.bytesIn += e.data.length;
      let m: any; try { m = JSON.parse(e.data); } catch { return; }
      if (m.t === 'ready' || m.t === 'joined') { this.attempt = 0; this.set('online'); this.startPing(); }
      if (m.t === 'joined') this.token = m.token;
      if (m.t === 'err' && m.code === 'expired') this.token = null;
      if (m.t === 'pong') { const r = performance.now() - m.c; this.rttSamples.push(r); if (this.rttSamples.length > 10) this.rttSamples.shift(); this.rtt = [...this.rttSamples].sort((a, b) => a - b)[Math.floor(this.rttSamples.length / 2)]; }
      if (m.t === 'ready') this.onReady();
      this.onMsg(m);
    };
    ws.onclose = (e) => { if (this.ws === ws) { this.ws = null; this.lastError = e.reason || `closed (${e.code})`; this.closed(e.code); } };
    ws.onerror = () => {};
  }
  private startPing() {
    clearInterval(this.pingTimer);
    const ping = () => this.send({ t: 'ping', c: performance.now(), rtt: Math.round(this.rtt) });
    ping(); this.pingTimer = window.setInterval(ping, 2000);
  }
  private closed(code = 0) {
    clearInterval(this.pingTimer);
    // auto-reconnect while we hold a room token (server keeps our car for the grace period); not after kicks
    const kicked = code === 4003 || code === 4008 || code === 4001;
    if (!this.intentional && !kicked && this.token) {
      if (this.status !== 'reconnecting') { this.lostAt = performance.now(); this.set('reconnecting'); }
      if (performance.now() - this.lostAt > RECONNECT_GRACE_MS + 5000) { this.token = null; this.set('offline'); this.onMsg({ t: 'lost' }); return; }
      const wait = Math.min(3000, 400 * 2 ** this.attempt++); this.reconnects++;
      this.retryTimer = window.setTimeout(() => this.connect(), wait);
      return;
    }
    this.set('offline');
    if (kicked) { this.token = null; this.onMsg({ t: 'lost', kicked: true, reason: this.lastError }); }
  }
  send(m: object) { if (this.ws?.readyState === WebSocket.OPEN) { this.ws.send(JSON.stringify(m)); this.msgsOut++; return true; } return false; }
  sendRaw(s: string) { if (this.ws?.readyState === WebSocket.OPEN) { this.ws.send(s); return true; } return false; }
  /** leave the room and close the socket for good */
  disconnect() { this.intentional = true; clearTimeout(this.retryTimer); clearInterval(this.pingTimer); this.token = null; this.ws?.close(1000, 'bye'); this.ws = null; this.set('offline'); }
  /** test hook: drop the socket as if the network failed (auto-reconnect kicks in) */
  dropConnection() { this.ws?.close(4100, 'simulated drop'); }
}
