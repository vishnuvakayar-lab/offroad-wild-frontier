// Online multiplayer (client side): lobby UI, server-authoritative play with client-side prediction +
// reconciliation for the own car, and snapshot interpolation for other players' cars.
import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { Vehicle, type DriveInput } from './vehicle';
import { vehicleById, PAINTS } from './vehicles';
import { heightAt, DASH_PTS } from './terrain';
import { MissionWorld } from './missionWorld';
import type { TrackMarks } from './tracks';
import { NetClient, type NetStatus } from './net/client';
import { STEP, TICK_HZ, IDLE_IN, RACE_DEF, MAX_INPUTS_PER_MSG, packInput, readState, writeState, decodeSnapshot, type CarState, type RoomInfo, type RoomMode } from './net/protocol';

export interface OnlineCtx {
  world: RAPIER_NS.World; R: typeof RAPIER_NS; scene: THREE.Scene; camera: THREE.PerspectiveCamera;
  car(): Vehicle;
  useCar(vehicle: string, paint: number): Vehicle;   // own car with the stock spec (online is fair: no upgrades)
  restoreCar(): void;                                // back to the single-player car (with upgrades)
  profile(): { name: string; vehicle: string; paint: number };
  setName(n: string): void;
  setPhase(p: 'lobby' | 'playing' | 'menu'): void;
  phase(): string;
  toast(t: string): void;
  resetCamera(): void;
}
interface Remote { id: number; v: Vehicle; buf: { t: number; s: CarState }[]; tag: HTMLElement; last: THREE.Vector3 | null; name: string; away: boolean; vehicle: string; paint: number; vis: { p: THREE.Vector3; q: THREE.Quaternion; speed: number } }
const $ = (id: string) => document.getElementById(id)!;
const NO_TRACKS = { add() {}, lift() {}, reset() {} } as unknown as TrackMarks;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (t: number) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, '0')}`;
const VNAME = (id: string) => vehicleById(id).name;
const PNAME = (hex: number) => PAINTS.find((p) => p.hex === hex)?.name ?? 'Custom';
const STATUS_TEXT: Record<NetStatus, string> = { offline: 'Offline', connecting: 'Connecting…', online: 'Online', reconnecting: 'Reconnecting…' };

const NOT_HOSTED = 'The online server is not hosted yet, so online rooms are unavailable on this site. Use Local split-screen for 2 players on one device.';
export class OnlineSession {
  net: NetClient;
  room: RoomInfo | null = null; myId = 0;
  remotes = new Map<number, Remote>();
  private hist: { s: number; inp: DriveInput; st: CarState }[] = [];
  seq = 0; lastAck = 0; private synced = false; histFirst = () => this.hist[0]?.s ?? -1; private pending: number[][] = []; private lastFlush = 0; private acc = 0;
  private offset: number | null = null; private jitter = 0; interpDelay = 0.1; lastTick = 0;
  private visOff = new THREE.Vector3(); private visQ = new THREE.Quaternion();
  private pendingAction: object | null = null;
  private mworld: MissionWorld | null = null; private wpMesh: THREE.Mesh | null = null;
  configured = false;
  private hudT = 0; lastErr = ''; private ready = false;
  pilot: { throttle: number; route: { x: number; z: number }[]; prog: number } | null = null;
  metrics = { snaps: 0, corrections: 0, hardSnaps: 0, maxErr: 0, errs: [] as number[], corrErrs: [] as number[], maxVisOff: 0, extrap: 0, noHist: 0, bigJump: 0, waiting: 0, nhLog: [] as number[][], remoteJerk: [] as number[], ownJerk: [] as number[], replaySteps: 0 };
  constructor(private ctx: OnlineCtx) {
    const q = new URLSearchParams(location.search);
    // Server URL: ?server=wss://… > build-time VITE_MP_SERVER > same host (only when the page is served by the game server itself).
    // Static hosting (GitHub Pages) has no game server, so online play is reported as "server not hosted yet" there.
    const cfg = (import.meta as any).env?.VITE_MP_SERVER as string | undefined;
    const staticHost = /github\.io$/i.test(location.hostname);
    let url = q.get('server') || cfg || (staticHost ? '' : `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
    this.configured = !!url;
    const lag = q.get('simlag'), jit = q.get('simjitter'); // forwarded to servers started with ALLOW_NET_SIM=1 (testing only)
    if (lag || jit) url += (url.includes('?') ? '&' : '?') + `simlag=${lag ?? 0}&simjitter=${jit ?? 0}`;
    this.net = new NetClient(url);
    this.net.onStatus = () => { this.renderLobby(); this.renderStatus(); };
    this.net.onReady = () => { this.ready = true; if (this.pendingAction) { this.net.send(this.pendingAction); this.pendingAction = null; } };
    this.net.onMsg = (m) => this.onMsg(m);
    this.net.onSnap = (b) => this.onSnap(b);
    this.bindUI();
  }
  get inRoom() { return !!this.room && this.myId > 0; }
  get me() { return this.room?.players.find((p) => p.id === this.myId) ?? null; }
  get isHost() { return !!this.room && this.room.hostId === this.myId; }

  // ---------------- connection / room actions ----------------
  private act(m: object) {
    if (!this.configured) { this.lastErr = NOT_HOSTED; this.renderLobby(); this.ctx.toast('⚠ Online server not hosted yet'); return; }
    this.lastErr = ''; this.renderLobby();
    const prof = this.ctx.profile(); this.net.profile = { ...prof };
    if (this.net.status === 'online' && this.ready) { this.net.send(m); return; }
    this.pendingAction = m; this.ready = false; this.net.connect();
  }
  quick(mode: RoomMode) { this.act({ t: 'quick', mode }); }
  create(mode: RoomMode) { this.act({ t: 'create', mode }); }
  join(code: string) { this.act({ t: 'join', code }); }
  leave() { this.net.send({ t: 'leave' }); this.net.disconnect(); this.cleanup(); this.ready = false; this.ctx.setPhase('lobby'); }
  startRace() { this.net.send({ t: 'start' }); }
  setWaypoint(clear = false) { const t = this.ctx.car().body.translation(); this.net.send(clear ? { t: 'wp', clear: true } : { t: 'wp', x: +t.x.toFixed(1), z: +t.z.toFixed(1) }); }
  requestReset() { this.net.send({ t: 'reset' }); }

  private onMsg(m: any) {
    switch (m.t) {
      case 'joined': {
        const first = !this.inRoom || this.room?.id !== m.roomId;
        this.myId = m.id; this.room = m.room; this.lastTick = m.tick;
        if (first) {
          this.cleanupWorld();
          const me = this.me!; this.ctx.useCar(me.vehicle, me.paint); this.hist = []; this.visOff.set(0, 0, 0); this.visQ.identity();
          this.ctx.setPhase(m.resumed ? 'playing' : 'lobby');
        }
        this.hist = []; this.synced = false; this.pending = []; this.syncRoom(); this.ctx.toast(m.resumed ? 'Reconnected — same car, same room' : `Joined ${m.room.public ? 'public' : 'private'} ${m.room.mode} room`);
        break;
      }
      case 'room': { const prev = this.room?.state; this.room = m.room; this.syncRoom(prev); break; }
      case 'evt': if (m.by !== this.myId) this.ctx.toast(m.msg); break;
      case 'err': this.lastErr = m.msg; this.renderLobby(); this.ctx.toast('⚠ ' + m.msg); break;
      case 'left': this.cleanup(); break;
      case 'lost': this.cleanup(); this.lastErr = m.kicked ? `Disconnected by server: ${m.reason}` : 'Connection lost — the server released your car'; this.ctx.setPhase('lobby'); this.renderLobby(); break;
    }
  }
  private syncRoom(prev?: string) {
    const r = this.room; if (!r) return;
    // remote cars come ONLY from the server's player list (never local bots)
    const ids = new Set(r.players.map((p) => p.id));
    for (const [id, rm] of this.remotes) if (!ids.has(id) || id === this.myId) this.removeRemote(id, rm);
    for (const p of r.players) {
      if (p.id === this.myId) continue;
      let rm = this.remotes.get(p.id);
      if (rm && (rm.vehicle !== p.vehicle || rm.paint !== p.paint)) { this.removeRemote(p.id, rm); rm = undefined; }
      if (!rm) rm = this.addRemote(p.id, p.vehicle, p.paint);
      rm.name = p.name; rm.away = p.away;
      rm.tag.innerHTML = `${p.id === r.leaderId && r.mode === 'convoy' ? '★ ' : ''}${esc(p.name)}${p.away ? ' <i>reconnecting…</i>' : ''}`;
    }
    if (r.mode === 'race' && !this.mworld) { this.mworld = new MissionWorld(this.ctx.scene, RACE_DEF); this.mworld.setGateState(0); }
    if (r.mode !== 'race' && this.mworld) { this.mworld.dispose(); this.mworld = null; }
    this.updateWaypoint();
    if (r.state === 'countdown' && prev !== 'countdown') { this.ctx.setPhase('playing'); this.ctx.resetCamera(); }
    if (r.state === 'results' && prev === 'racing') this.ctx.setPhase('lobby');
    this.renderLobby();
  }
  private addRemote(id: number, vehicle: string, paint: number): Remote {
    const v = new Vehicle(this.ctx.world, this.ctx.R, this.ctx.scene, NO_TRACKS, vehicleById(vehicle), paint, 0);
    v.body.setBodyType(this.ctx.R.RigidBodyType.KinematicPositionBased, true); // proxy collider for local prediction; server is authoritative
    for (const l of [...v.headlights, v.beam]) l.visible = false;
    v.group.visible = false;
    const tag = document.createElement('div'); tag.className = 'ptag'; $('tags').appendChild(tag);
    const rm: Remote = { id, v, buf: [], tag, last: null, name: '', away: false, vehicle, paint, vis: { p: new THREE.Vector3(), q: new THREE.Quaternion(), speed: 0 } };
    this.remotes.set(id, rm); return rm;
  }
  private removeRemote(id: number, rm: Remote) { rm.v.dispose(); rm.tag.remove(); this.remotes.delete(id); }
  private cleanupWorld() {
    for (const [id, rm] of this.remotes) this.removeRemote(id, rm);
    this.mworld?.dispose(); this.mworld = null;
    if (this.wpMesh) { this.ctx.scene.remove(this.wpMesh); this.wpMesh.geometry.dispose(); (this.wpMesh.material as THREE.Material).dispose(); this.wpMesh = null; }
  }
  cleanup() {
    const was = this.inRoom;
    this.cleanupWorld(); this.room = null; this.myId = 0; this.hist = []; this.synced = false; this.pending = []; this.offset = null; this.pilot = null;
    this.visOff.set(0, 0, 0); this.visQ.identity();
    if (was) this.ctx.restoreCar();
    $('ohud').classList.add('hidden'); $('countdown').classList.add('hidden');
    this.renderLobby();
  }
  private updateWaypoint() {
    const w = this.room?.mode === 'convoy' ? this.room.waypoint : null;
    if (!w) { if (this.wpMesh) this.wpMesh.visible = false; return; }
    if (!this.wpMesh) {
      const g = new THREE.CylinderGeometry(0.9, 0.9, 40, 12, 1, true); g.translate(0, 20, 0);
      this.wpMesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffb03a, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }));
      this.wpMesh.name = 'waypoint'; this.ctx.scene.add(this.wpMesh);
    }
    this.wpMesh.visible = true; this.wpMesh.position.set(w.x, heightAt(w.x, w.z), w.z);
  }

  // ---------------- prediction + reconciliation ----------------
  private get frozen() {
    const r = this.room; if (!r || this.net.status !== 'online') return true;
    if (r.state === 'countdown') return true;
    if (r.state === 'racing') { const me = r.race?.players.find((p) => p.id === this.myId); if (me && me.time !== null) return true; }
    return false;
  }
  /** fixed 60 Hz prediction of the own car with the same inputs the server will apply */
  frame(dt: number, drive: DriveInput) {
    if (!this.inRoom) return;
    const car = this.ctx.car(), world = this.ctx.world;
    if (!this.synced) { this.acc = 0; return; } // wait for the first authoritative snapshot (spawn pose)
    this.acc += dt; let n = 0;
    while (this.acc >= STEP && n < 30) {
      let inp = this.pilot ? this.pilotInput() : drive;
      if (this.frozen) inp = IDLE_IN;
      this.seq++;
      car.step(STEP, inp); world.step();
      this.hist.push({ s: this.seq, inp, st: readState(car) });
      this.pending.push(packInput(inp));
      this.acc -= STEP; n++;
    }
    if (n >= 30) this.acc = 0;
    if (this.hist.length > 900) this.hist.splice(0, this.hist.length - 900);
    const now = performance.now();
    if (this.pending.length >= 2 || (this.pending.length && now - this.lastFlush > 45)) {
      if (this.net.status === 'online') while (this.pending.length) { const a = this.pending.splice(0, MAX_INPUTS_PER_MSG); this.net.send({ t: 'i', s: this.seq - this.pending.length - a.length + 1, a }); }
      this.pending = []; this.lastFlush = now;
    }
  }
  private onSnap(buf: ArrayBuffer) {
    const d = decodeSnapshot(buf); if (!d || !this.inRoom) return;
    this.metrics.snaps++;
    const nowS = performance.now() / 1000, sample = d.tick / TICK_HZ - nowS;
    if (this.offset === null || sample > this.offset) this.offset = sample;
    this.jitter = this.jitter * 0.95 + (this.offset - sample) * 0.05;
    this.interpDelay = Math.min(0.35, Math.max(0.07, 1.5 / TICK_HZ + 2.5 * this.jitter));
    this.lastTick = d.tick;
    for (const p of d.players) {
      if (p.id === this.myId) {
        if (!this.synced) { writeState(this.ctx.car(), p); this.hist = []; this.synced = true; this.ctx.resetCamera(); this.lastAck = d.ack; continue; }
        this.reconcile(d.ack, p); continue;
      }
      const rm = this.remotes.get(p.id); if (!rm) continue;
      const t = d.tick / TICK_HZ; if (rm.buf.length && rm.buf[rm.buf.length - 1].t >= t) continue;
      rm.buf.push({ t, s: p }); if (rm.buf.length > 60) rm.buf.shift();
    }
  }
  private reconcile(ack: number, s: CarState) {
    this.lastAck = ack;
    const car = this.ctx.car(), world = this.ctx.world;
    while (this.hist.length && this.hist[0].s < ack) this.hist.shift();
    const h = this.hist.length && this.hist[0].s === ack ? this.hist[0] : null;
    if (!h && !this.hist.length) { writeState(car, s); return; } // nothing predicted yet
    if (!h && this.hist.length && ack < this.hist[0].s) { this.metrics.waiting++; return; } // server has not consumed our first input yet
    let err = Infinity;
    if (h) {
      err = Math.hypot(h.st.p[0] - s.p[0], h.st.p[1] - s.p[1], h.st.p[2] - s.p[2]);
      const dq = Math.abs(h.st.q[0] * s.q[0] + h.st.q[1] * s.q[1] + h.st.q[2] * s.q[2] + h.st.q[3] * s.q[3]);
      const ang = 2 * Math.acos(Math.min(1, dq)), dv = Math.hypot(h.st.lv[0] - s.lv[0], h.st.lv[1] - s.lv[1], h.st.lv[2] - s.lv[2]);
      this.metrics.errs.push(err); if (this.metrics.errs.length > 2000) this.metrics.errs.shift();
      if (err < 0.03 && ang < 0.02 && dv < 0.15) return; // prediction matched the server
    }
    // rewind to the authoritative state at `ack` and replay the inputs the server has not processed yet
    const t0 = car.body.translation(), r0 = car.body.rotation();
    const pre = new THREE.Vector3(t0.x, t0.y, t0.z), preQ = new THREE.Quaternion(r0.x, r0.y, r0.z, r0.w);
    writeState(car, s);
    for (const e of this.hist) { if (e.s <= ack) continue; car.step(STEP, e.inp); world.step(); e.st = readState(car); this.metrics.replaySteps++; }
    if (h) h.st = s;
    const t1 = car.body.translation(), r1 = car.body.rotation();
    const jump = pre.distanceTo(new THREE.Vector3(t1.x, t1.y, t1.z));
    if (!h || jump > 4) { this.metrics.hardSnaps++; if (!h) { this.metrics.noHist++; this.metrics.nhLog.push([ack, this.seq, this.hist.length, this.hist[0]?.s ?? -1]); if (this.metrics.nhLog.length > 8) this.metrics.nhLog.shift(); } else this.metrics.bigJump++; this.visOff.set(0, 0, 0); this.visQ.identity(); if (jump > 4) this.ctx.resetCamera(); }
    else {
      this.metrics.corrections++; this.metrics.maxErr = Math.max(this.metrics.maxErr, err); this.metrics.corrErrs.push(err); if (this.metrics.corrErrs.length > 2000) this.metrics.corrErrs.shift();
      this.visOff.add(pre.sub(new THREE.Vector3(t1.x, t1.y, t1.z))); // hide the snap: decay the visual offset over ~100 ms
      this.visQ.premultiply(preQ.multiply(new THREE.Quaternion(r1.x, r1.y, r1.z, r1.w).invert()));
      this.metrics.maxVisOff = Math.max(this.metrics.maxVisOff, this.visOff.length());
    }
  }

  // ---------------- per-frame visuals: smoothing, interpolation, tags, HUD ----------------
  private lastOwn: THREE.Vector3 | null = null;
  afterSync(dt: number) {
    if (!this.inRoom) return;
    const car = this.ctx.car();
    const k = Math.exp(-dt * 12);
    this.visOff.multiplyScalar(k); this.visQ.slerp(new THREE.Quaternion(), 1 - k);
    car.group.position.add(this.visOff); car.group.quaternion.premultiply(this.visQ);
    if (this.lastOwn && dt > 0 && dt < 0.1) { const v = car.body.linvel(); this.metrics.ownJerk.push(Math.abs(this.lastOwn.distanceTo(car.group.position) - Math.hypot(v.x, v.y, v.z) * dt)); if (this.metrics.ownJerk.length > 3000) this.metrics.ownJerk.shift(); }
    (this.lastOwn ??= new THREE.Vector3()).copy(car.group.position);
    // remote cars: render ~interpDelay in the past between two snapshots
    if (this.offset !== null) this.offset -= dt * 0.002; // let the clock estimate re-converge after jitter spikes
    const T = performance.now() / 1000 + (this.offset ?? 0) - this.interpDelay;
    const cam = this.ctx.camera, W = window.innerWidth, H = window.innerHeight, v3 = new THREE.Vector3();
    for (const rm of this.remotes.values()) {
      const b = rm.buf; if (!b.length) continue;
      let p: THREE.Vector3, q: THREE.Quaternion, steer: number, susp: number[], speed: number;
      if (T <= b[0].t || b.length === 1) { const s = b[0].s; p = new THREE.Vector3(...s.p); q = new THREE.Quaternion(...s.q); steer = s.steer; susp = s.susp; speed = Math.hypot(s.lv[0], s.lv[2]); }
      else if (T >= b[b.length - 1].t) { // extrapolate briefly, then hold
        const s = b[b.length - 1].s, e = Math.min(0.12, T - b[b.length - 1].t); this.metrics.extrap++;
        p = new THREE.Vector3(s.p[0] + s.lv[0] * e, s.p[1] + s.lv[1] * e, s.p[2] + s.lv[2] * e); q = new THREE.Quaternion(...s.q); steer = s.steer; susp = s.susp; speed = Math.hypot(s.lv[0], s.lv[2]);
      } else {
        let i = b.length - 2; while (i > 0 && b[i].t > T) i--;
        const A = b[i], B = b[i + 1], u = (T - A.t) / (B.t - A.t || 1);
        p = new THREE.Vector3(...A.s.p).lerp(new THREE.Vector3(...B.s.p), u);
        q = new THREE.Quaternion(...A.s.q).slerp(new THREE.Quaternion(...B.s.q), u);
        steer = A.s.steer + (B.s.steer - A.s.steer) * u; susp = A.s.susp.map((x, j) => x + (B.s.susp[j] - x) * u);
        speed = Math.hypot(A.s.lv[0] + (B.s.lv[0] - A.s.lv[0]) * u, A.s.lv[2] + (B.s.lv[2] - A.s.lv[2]) * u);
        while (b.length > 3 && b[1].t < T - 0.5) b.shift();
      }
      if (rm.last && dt > 0 && dt < 0.1) { this.metrics.remoteJerk.push(Math.abs(rm.last.distanceTo(p) - speed * dt)); if (this.metrics.remoteJerk.length > 3000) this.metrics.remoteJerk.shift(); }
      (rm.last ??= new THREE.Vector3()).copy(p);
      rm.v.group.visible = true; rm.v.syncRemote(p, q, steer, susp, speed, dt); rm.vis.p.copy(p); rm.vis.q.copy(q); rm.vis.speed = speed;
      rm.v.body.setNextKinematicTranslation(p); rm.v.body.setNextKinematicRotation(q);
      // name tag
      v3.set(p.x, p.y + 2.5, p.z).project(cam);
      const show = v3.z < 1 && cam.position.distanceTo(p) < 160 && this.ctx.phase() !== 'menu';
      rm.tag.style.display = show ? '' : 'none';
      if (show) rm.tag.style.transform = `translate(${((v3.x + 1) / 2 * W).toFixed(1)}px, ${((1 - v3.y) / 2 * H).toFixed(1)}px) translate(-50%, -100%)`;
    }
    this.hudT -= dt; if (this.hudT <= 0) { this.hudT = 0.1; this.renderHud(); }
  }
  private estTick() { return this.offset === null ? this.lastTick : (performance.now() / 1000 + this.offset) * TICK_HZ; }
  private renderHud() {
    const r = this.room, on = this.inRoom && this.ctx.phase() === 'playing';
    $('ohud').classList.toggle('hidden', !on); if (!on || !r) return;
    const c = this.ctx.car().body.translation(), cam = this.ctx.camera, dir = new THREE.Vector3(); cam.getWorldDirection(dir);
    $('oh-title').textContent = `${r.mode === 'race' ? 'Online race' : 'Convoy'} · ${r.public ? 'public' : 'room ' + r.code} · ${r.players.length}/${r.max}`;
    let main = '', sub = '', target: { x: number; z: number } | null = null;
    const cd = $('countdown');
    if (r.mode === 'race') {
      const me = r.race?.players.find((p) => p.id === this.myId), goT = r.race?.startTick ?? 0, el = (this.estTick() - goT) / TICK_HZ;
      if (r.state === 'countdown') { main = '0:00.00'; sub = 'Get ready'; cd.classList.remove('hidden'); cd.textContent = String(Math.max(1, Math.ceil(-el))); }
      else if (r.state === 'racing' && me) {
        main = me.time !== null ? fmt(me.time) : fmt(Math.max(0, el));
        sub = me.time !== null ? `Finished #${me.place}` : `CP ${me.next + 1}/${RACE_DEF.gates.length}`;
        if (me.time === null && me.next < RACE_DEF.gates.length) target = RACE_DEF.gates[me.next];
        this.mworld?.setGateState(me.next);
        if (el < 0.8) { cd.classList.remove('hidden'); cd.textContent = 'GO!'; } else cd.classList.add('hidden');
      } else { cd.classList.add('hidden'); main = r.state === 'racing' ? 'Race in progress' : r.state === 'results' ? 'Race over' : 'Grid'; sub = this.isHost ? 'Esc → lobby → Start race' : 'Waiting for the host to start'; target = RACE_DEF.start; }
    } else {
      cd.classList.add('hidden');
      const lead = r.players.find((p) => p.id === r.leaderId), lrm = this.remotes.get(r.leaderId);
      main = this.isHost ? '★ You lead the convoy' : `Following ★ ${lead?.name ?? '—'}`;
      if (r.waypoint) { target = r.waypoint; sub = 'Waypoint'; }
      else if (lrm) { target = { x: lrm.vis.p.x, z: lrm.vis.p.z }; sub = 'Leader'; }
      else sub = this.isHost ? 'G = mark a waypoint for everyone' : '';
    }
    $('oh-main').textContent = main;
    if (target) {
      const ang = Math.atan2(target.x - c.x, target.z - c.z) - Math.atan2(dir.x, dir.z), na = Math.atan2(Math.sin(ang), Math.cos(ang));
      $('oh-arrow').style.transform = `rotate(${(-na).toFixed(3)}rad)`; $('oh-arrow').style.visibility = '';
      $('oh-dist').textContent = `${Math.hypot(target.x - c.x, target.z - c.z).toFixed(0)} m`;
    } else { $('oh-arrow').style.visibility = 'hidden'; $('oh-dist').textContent = ''; }
    $('oh-sub').textContent = sub;
    $('btn-wp').classList.toggle('hidden', !(r.mode === 'convoy' && this.isHost));
    this.renderStatus();
  }
  renderStatus() {
    const s = this.net.status, el = $('oh-net'), txt = s === 'online' ? `● ${Math.round(this.net.rtt)} ms` : s === 'reconnecting' ? '◌ Reconnecting…' : s === 'connecting' ? '◌ Connecting…' : '○ Offline';
    el.textContent = txt; el.className = 'chip net ' + s;
  }

  // ---------------- test autopilot (drives through the real input path) ----------------
  setPilot(o: { throttle?: number; route?: 'race' | 'loop' } | null) {
    if (!o) { this.pilot = null; return; }
    const pts = o.route === 'race' ? [RACE_DEF.start, ...RACE_DEF.gates.map((g) => ({ x: g.x + Math.sin(g.yaw) * 4, z: g.z + Math.cos(g.yaw) * 4 }))] : [...DASH_PTS, DASH_PTS[0]].map(([x, z]) => ({ x, z }));
    this.pilot = { throttle: o.throttle ?? 1, route: pts.map((p) => ({ x: p.x, z: p.z })), prog: 0 };
  }
  private pilotInput(): DriveInput {
    const P = this.pilot!, car = this.ctx.car(), t = car.body.translation(), f = car.forward(), yaw = Math.atan2(f.x, f.z), sp = car.forwardSpeed();
    const L = P.route;
    // advance the progress index to the closest upcoming segment
    while (P.prog < L.length - 2 && Math.hypot(L[P.prog + 1].x - t.x, L[P.prog + 1].z - t.z) < Math.hypot(L[P.prog].x - t.x, L[P.prog].z - t.z) + 2) P.prog++;
    let look = 7 + Math.abs(sp) * 0.5, i = P.prog, px = t.x, pz = t.z;
    while (i < L.length - 1) { const d = Math.hypot(L[i + 1].x - px, L[i + 1].z - pz); if (d > look) break; look -= d; px = L[i + 1].x; pz = L[i + 1].z; i++; }
    let tx = L[Math.min(L.length - 1, i + 1)].x, tz = L[Math.min(L.length - 1, i + 1)].z; const seg = Math.hypot(tx - px, tz - pz) || 1;
    tx = px + (tx - px) / seg * Math.min(look, seg); tz = pz + (tz - pz) / seg * Math.min(look, seg);
    let da = Math.atan2(tx - t.x, tz - t.z) - yaw; da = Math.atan2(Math.sin(da), Math.cos(da));
    const a1 = L[Math.min(L.length - 1, P.prog + 1)], a2 = L[Math.min(L.length - 1, P.prog + 2)], a0 = L[P.prog];
    const turn = Math.abs(Math.atan2(Math.sin(Math.atan2(a2.x - a1.x, a2.z - a1.z) - Math.atan2(a1.x - a0.x, a1.z - a0.z)), Math.cos(Math.atan2(a2.x - a1.x, a2.z - a1.z) - Math.atan2(a1.x - a0.x, a1.z - a0.z))));
    const vmax = Math.max(7, 24 - turn * 16) * (0.6 + 0.4 * P.throttle);
    return { throttle: sp < vmax ? P.throttle : 0, brake: sp > vmax + 2.5 ? 0.6 : 0, steer: Math.max(-1, Math.min(1, da * 2.2)), handbrake: false };
  }

  // ---------------- lobby UI ----------------
  private bindUI() {
    const nameEl = $('lb-name') as HTMLInputElement;
    nameEl.addEventListener('change', () => { this.ctx.setName(nameEl.value); });
    document.querySelectorAll<HTMLElement>('[data-quick]').forEach((b) => b.onclick = () => { this.ctx.setName(nameEl.value); this.quick(b.dataset.quick as RoomMode); });
    $('lb-create').onclick = () => { this.ctx.setName(nameEl.value); this.create(($('lb-mode') as HTMLSelectElement).value as RoomMode); };
    $('lb-join').onclick = () => { this.ctx.setName(nameEl.value); this.join(($('lb-code') as HTMLInputElement).value); };
    ($('lb-code') as HTMLInputElement).addEventListener('keydown', (e) => { if (e.key === 'Enter') $('lb-join').click(); });
    $('lb-leave').onclick = () => this.leave();
    $('lb-start').onclick = () => this.startRace();
    $('lb-drive').onclick = () => { this.ctx.setPhase('playing'); this.ctx.resetCamera(); };
    $('lb-copy').onclick = () => { const c = this.room?.code; if (c) navigator.clipboard?.writeText(c).then(() => this.ctx.toast('Code copied'), () => this.ctx.toast(c)); };
    $('btn-wp').onclick = () => this.setWaypoint(!!this.room?.waypoint && Math.hypot(this.room.waypoint.x - this.ctx.car().body.translation().x, this.room.waypoint.z - this.ctx.car().body.translation().z) < 10);
  }
  renderLobby() {
    const r = this.room, s = this.net.status, prof = this.ctx.profile();
    const chip = $('net-status'); chip.textContent = STATUS_TEXT[s] + (s === 'online' && this.net.rtt ? ` · ${Math.round(this.net.rtt)} ms` : ''); chip.className = 'net-chip ' + s;
    $('lb-setup').classList.toggle('hidden', !!r);
    $('lb-room').classList.toggle('hidden', !r);
    $('lb-err').textContent = this.lastErr;
    $('lb-nohost').classList.toggle('hidden', this.configured);
    if (!this.configured) { chip.textContent = 'Server not hosted'; chip.className = 'net-chip offline'; }
    $('lb-backrow').classList.toggle('hidden', !!r);
    $('lb-veh').textContent = `${VNAME(prof.vehicle)} · ${PNAME(prof.paint)} — stock specs online (fair play)`;
    const nameEl = $('lb-name') as HTMLInputElement; if (document.activeElement !== nameEl) nameEl.value = prof.name;
    const busy = s === 'connecting' || (s === 'reconnecting' && !r);
    document.querySelectorAll<HTMLButtonElement>('#lb-setup button').forEach((b) => b.disabled = busy);
    if (!r) return;
    $('lb-roomkind').textContent = `${r.public ? 'Public' : 'Private'} ${r.mode === 'race' ? 'race (Canyon Dash, 13 CP)' : 'convoy · free roam'}`;
    $('lb-code-big').textContent = r.code ?? '';
    $('lb-codebox').classList.toggle('hidden', !r.code);
    $('lb-players').innerHTML = r.players.map((p) => `<li class="${p.id === this.myId ? 'me' : ''}"><span class="sw" style="background:#${p.paint.toString(16).padStart(6, '0')}"></span><b>${esc(p.name)}${p.id === this.myId ? ' (you)' : ''}</b><em>${VNAME(p.vehicle)}</em>` +
      `<span class="tags">${p.id === r.hostId ? (r.mode === 'convoy' ? '★ leader' : 'host') : ''}${p.away ? ' · reconnecting…' : ''}</span><span class="ping">${p.away ? '—' : p.ping ? p.ping + ' ms' : ''}</span></li>`).join('');
    $('lb-count').textContent = `${r.players.length}/${r.max} players · ${r.state === 'free' ? 'driving' : r.state}`;
    const res = r.race?.results;
    $('lb-results').innerHTML = r.mode === 'race' && res ? `<h3>Race results <small>(decided by the server)</small></h3><ol>${res.map((x) => `<li class="${x.id === this.myId ? 'me' : ''}"><b>${x.place ? '#' + x.place : 'DNF'}</b><span>${esc(x.name)}</span><em>${x.time !== null ? fmt(x.time) : '—'}</em></li>`).join('')}</ol>` : '';
    const st = $('lb-start') as HTMLButtonElement;
    st.classList.toggle('hidden', r.mode !== 'race'); st.disabled = !this.isHost || !(r.state === 'lobby' || r.state === 'results');
    st.textContent = r.state === 'results' ? 'Race again' : 'Start race'; st.title = this.isHost ? '' : 'Only the host can start';
  }
}
