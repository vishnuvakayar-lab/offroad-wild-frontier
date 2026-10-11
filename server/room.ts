// One multiplayer room: an authoritative Rapier world running the shared vehicle code at TICK_HZ x SUBSTEPS.
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { Vehicle, type DriveInput } from '../src/vehicle';
import { vehicleById } from '../src/vehicles';
import { buildTerrainColliders, heightAt } from '../src/terrain';
import { MissionRunner } from '../src/missions';
import {
  STEP, SUBSTEPS, TICK_HZ, MAX_PLAYERS, IDLE_IN, RACE_DEF, RACE_COUNTDOWN, RACE_MAX_AFTER_FIRST, RACE_MAX_TIME,
  spawnPose, placeVehicle, readState, encodeSnapshotBody, snapshotHeader,
  type RoomMode, type RoomState, type RoomInfo, type PlayerInfo,
} from '../src/net/protocol';

export interface Conn { send(data: string | Uint8Array): void; close(code: number, reason: string): void; }
export interface Player {
  id: number; name: string; vehicle: string; paint: number; token: string; joinedAt: number; slot: number;
  conn: Conn | null; awaySince: number | null; ping: number;
  car: Vehicle; queue: { s: number; i: DriveInput }[]; lastSeq: number; last: DriveInput; starved: boolean;
  stats: { starve: number; dropped: number; consumed: number; forged: number; violations: number };
  runner: MissionRunner | null; lastReset: number; lastWp: number; dry: number; burst: number;
}

export class Room {
  players = new Map<number, Player>();
  world: RAPIER_NS.World;
  tick = 0; state: RoomState; hostId = 0; waypoint: RoomInfo['waypoint'] = null;
  race: { startTick: number; goTick: number; firstFinish: number | null; results: NonNullable<RoomInfo['race']>['results'] } | null = null;
  private nextId = 1; private dirty = true; createdAt = Date.now(); emptySince: number | null = null;
  constructor(public id: string, public code: string | null, public mode: RoomMode, public isPublic: boolean, private R: typeof RAPIER_NS, private log: (m: string) => void) {
    this.world = new R.World({ x: 0, y: -9.81, z: 0 }); this.world.timestep = STEP;
    buildTerrainColliders(this.world, R);
    this.state = mode === 'race' ? 'lobby' : 'free';
  }
  get count() { return this.players.size; }
  get full() { return this.players.size >= MAX_PLAYERS; }
  get joinable() { return !this.full && (this.mode === 'convoy' || this.state === 'lobby' || this.state === 'results'); }

  addPlayer(conn: Conn, prof: { name: string; vehicle: string; paint: number }, token: string): Player | null {
    if (this.full) return null;
    const used = new Set([...this.players.values()].map((p) => p.slot)); let slot = 0; while (used.has(slot)) slot++;
    const car = new Vehicle(this.world, this.R, null, null, vehicleById(prof.vehicle), prof.paint, 1, true); // stock spec online (fair; no client-claimed upgrades)
    placeVehicle(car, spawnPose(this.mode, slot));
    const p: Player = { id: this.nextId++, ...prof, token, joinedAt: Date.now(), slot, conn, awaySince: null, ping: 0, car, queue: [], lastSeq: 0, last: IDLE_IN, starved: true,
      stats: { starve: 0, dropped: 0, consumed: 0, forged: 0, violations: 0 }, runner: null, lastReset: 0, lastWp: 0, dry: 0, burst: 2 };
    if (this.nextId > 250) this.nextId = 1;
    this.players.set(p.id, p);
    if (!this.hostId || !this.players.has(this.hostId)) this.hostId = p.id;
    this.emptySince = null; this.dirty = true;
    this.event(`${p.name} joined`, p.id);
    return p;
  }
  removePlayer(id: number, why: string) {
    const p = this.players.get(id); if (!p) return;
    p.car.dispose(); this.players.delete(id);
    if (this.hostId === id) this.hostId = [...this.players.values()].sort((a, b) => a.joinedAt - b.joinedAt)[0]?.id ?? 0;
    if (this.waypoint?.by === id && this.hostId) this.waypoint = null;
    if (!this.players.size) this.emptySince = Date.now();
    this.dirty = true; this.event(`${p.name} left (${why})`, id);
  }
  setAway(p: Player) { p.conn = null; p.awaySince = Date.now(); p.queue = []; this.dirty = true; this.event(`${p.name} lost connection — holding their car`, p.id); }
  resume(p: Player, conn: Conn) { p.conn = conn; p.awaySince = null; p.queue = []; p.starved = true; this.dirty = true; this.event(`${p.name} reconnected`, p.id); }

  /** queue validated inputs (seq-ordered); stale/duplicate seqs are ignored */
  pushInputs(p: Player, first: number, inputs: DriveInput[]) {
    for (let k = 0; k < inputs.length; k++) {
      const s = first + k; if (s <= p.lastSeq || (p.queue.length && s <= p.queue[p.queue.length - 1].s)) continue;
      p.queue.push({ s, i: inputs[k] });
    }
    // adaptive jitter buffer: clients that send in bigger batches (low frame rate, jittery links) get a deeper buffer
    p.burst = Math.max(inputs.length, p.burst * 0.97);
    // bounded latency: never let the backlog grow past ~2 batches + 0.1 s (drop the oldest; the client reconciles)
    const cap = Math.max(12, Math.ceil(p.burst) * 2 + 6);
    if (p.queue.length > cap) { const n = p.queue.length - Math.ceil(cap / 2); p.queue.splice(0, n); p.stats.dropped += n; }
  }
  private nextInput(p: Player, frozen: boolean): DriveInput {
    if (p.awaySince !== null) return IDLE_IN;
    // after running dry, wait until about one client batch + 1 is buffered before consuming again
    if (p.queue.length && !(p.starved && p.queue.length < Math.min(14, Math.ceil(p.burst) + 1))) {
      const q = p.queue.shift()!; p.lastSeq = q.s; p.last = q.i; p.starved = false; p.stats.consumed++;
      p.dry = 0;
    } else { if (!p.starved) p.stats.starve++; p.starved = true; p.dry++; }
    // no inputs for 0.5 s (tab hidden, stalled client): stop instead of repeating the last input forever
    return frozen || p.dry > 30 ? IDLE_IN : p.last;
  }

  requestReset(p: Player) {
    const now = Date.now(); if (now - p.lastReset < 2000) return false; p.lastReset = now;
    if (p.runner && this.state === 'racing') { const l = p.runner.last; placeVehicle(p.car, l); p.runner.jumped(); return true; }
    const t = p.car.body.translation(), f = p.car.forward();
    p.car.reset(t.x, heightAt(t.x, t.z) + p.car.spawnLift, t.z, Math.atan2(f.x, f.z)); return true;
  }
  setWaypoint(p: Player, x: number | null, z: number | null) {
    const now = Date.now(); if (now - p.lastWp < 400) return false; p.lastWp = now;
    if (p.id !== this.hostId || this.mode !== 'convoy') return false;
    if (x === null || z === null) this.waypoint = null;
    else { if (!Number.isFinite(x) || !Number.isFinite(z) || Math.abs(x) > 155 || Math.abs(z) > 155) return false; this.waypoint = { x, z, by: p.id }; }
    this.dirty = true; return true;
  }
  startRace(p: Player) {
    if (this.mode !== 'race' || p.id !== this.hostId || !(this.state === 'lobby' || this.state === 'results')) return false;
    const racers = [...this.players.values()].filter((q) => q.awaySince === null).sort((a, b) => a.joinedAt - b.joinedAt);
    racers.forEach((q, i) => { placeVehicle(q.car, spawnPose('race', i)); q.runner = null; });
    for (const q of this.players.values()) if (!racers.includes(q)) q.runner = null;
    this.race = { startTick: this.tick, goTick: this.tick + RACE_COUNTDOWN * TICK_HZ, firstFinish: null, results: null };
    this.state = 'countdown'; this.dirty = true;
    (this as any)._racers = racers.map((q) => q.id);
    this.event('Race starting!', p.id); return true;
  }
  private sample(v: Vehicle) {
    const t = v.body.translation(), f = v.forward(), q = v.body.rotation();
    return { x: t.x, z: t.z, yaw: Math.atan2(f.x, f.z), speed: v.forwardSpeed(), up: 1 - 2 * (q.x * q.x + q.z * q.z) };
  }
  private raceStep() {
    if (!this.race) return;
    if (this.state === 'countdown' && this.tick >= this.race.goTick) {
      this.state = 'racing'; this.dirty = true;
      for (const id of (this as any)._racers as number[]) { const p = this.players.get(id); if (!p) continue; p.runner = new MissionRunner(RACE_DEF); p.runner.countdown = 0; p.runner.update(0, this.sample(p.car)); }
    }
  }
  private raceSubstep() {
    if (this.state !== 'racing' || !this.race) return;
    let place = [...this.players.values()].filter((p) => p.runner?.state === 'success').length;
    for (const p of this.players.values()) {
      const r = p.runner; if (!r || r.finished) continue;
      const before = r.next; r.update(STEP, this.sample(p.car));
      if (r.next !== before) this.dirty = true;
      if (r.state === 'success') { place++; (r as any).place = place; this.race.firstFinish ??= this.tick; this.dirty = true; this.event(`${p.name} finished #${place} in ${r.t.toFixed(2)} s`, p.id); }
    }
  }
  private raceEnd() {
    if (this.state !== 'racing' || !this.race) return;
    const runners = [...this.players.values()].filter((p) => p.runner);
    const live = runners.filter((p) => !p.runner!.finished && p.awaySince === null);
    const el = (this.tick - this.race.goTick) / TICK_HZ;
    const timeUp = el > RACE_MAX_TIME || (this.race.firstFinish !== null && (this.tick - this.race.firstFinish) / TICK_HZ > RACE_MAX_AFTER_FIRST);
    if (live.length && !timeUp && runners.length) return;
    // final order is computed here, on the server: finishers by time, then DNF
    const fin = runners.filter((p) => p.runner!.state === 'success').sort((a, b) => a.runner!.t - b.runner!.t || a.id - b.id);
    const dnf = runners.filter((p) => p.runner!.state !== 'success').sort((a, b) => b.runner!.next - a.runner!.next);
    this.race.results = [...fin.map((p, i) => ({ id: p.id, name: p.name, time: +p.runner!.t.toFixed(3), place: i + 1 })), ...dnf.map((p) => ({ id: p.id, name: p.name, time: null, place: null }))];
    this.state = 'results'; this.dirty = true; this.event('Race over', 0);
  }

  /** one authoritative tick: inputs -> SUBSTEPS physics steps -> race logic -> snapshots */
  step() {
    this.tick++;
    const frozen = this.state === 'countdown';
    const list = [...this.players.values()];
    for (let s = 0; s < SUBSTEPS; s++) {
      const ins = list.map((p) => this.nextInput(p, frozen || (this.state === 'racing' && p.runner?.finished === true)));
      list.forEach((p, k) => p.car.step(STEP, ins[k]));
      this.world.step();
      this.raceSubstep();
    }
    this.raceStep(); this.raceEnd();
    // safety net: physics blow-ups / fell through the world -> respawn
    for (const p of list) {
      const t = p.car.body.translation(), v = p.car.body.linvel();
      if (!Number.isFinite(t.x + t.y + t.z) || t.y < heightAt(t.x, t.z) - 6 || Math.hypot(v.x, v.y, v.z) > 70) { placeVehicle(p.car, spawnPose(this.mode, p.slot)); this.log(`room ${this.id}: respawned ${p.id} (bad state)`); }
    }
    this.broadcastSnapshot(list);
    if (this.dirty) { this.dirty = false; this.broadcast({ t: 'room', room: this.info() }); }
  }
  broadcastSnapshot(list: Player[]) {
    const body = encodeSnapshotBody(list.map((p) => ({ id: p.id, away: p.awaySince !== null, s: readState(p.car) })));
    for (const p of list) {
      if (!p.conn) continue;
      const h = snapshotHeader(list.length, this.tick, p.lastSeq), out = new Uint8Array(h.length + body.length);
      out.set(h, 0); out.set(body, h.length); p.conn.send(out);
    }
  }
  broadcast(m: object) { const s = JSON.stringify(m); for (const p of this.players.values()) p.conn?.send(s); }
  event(msg: string, by: number) { this.broadcast({ t: 'evt', msg, by }); }
  markDirty() { this.dirty = true; }
  info(): RoomInfo {
    const players: PlayerInfo[] = [...this.players.values()].sort((a, b) => a.joinedAt - b.joinedAt).map((p) => ({ id: p.id, name: p.name, vehicle: p.vehicle, paint: p.paint, away: p.awaySince !== null, ping: Math.round(p.ping), joinedAt: p.joinedAt }));
    const race = this.race ? { startTick: this.race.goTick, players: [...this.players.values()].filter((p) => p.runner).map((p) => ({ id: p.id, next: p.runner!.next, time: p.runner!.state === 'success' ? +p.runner!.t.toFixed(3) : null, place: (p.runner as any).place ?? null })), results: this.race.results } : null;
    return { id: this.id, code: this.code, mode: this.mode, public: this.isPublic, hostId: this.hostId, leaderId: this.hostId, state: this.state, waypoint: this.waypoint, players, race, max: MAX_PLAYERS };
  }
  debug() {
    return { ...this.info(), tick: this.tick, cars: [...this.players.values()].map((p) => { const t = p.car.body.translation(), r = p.car.body.rotation(), v = p.car.body.linvel(); return { id: p.id, name: p.name, x: t.x, y: t.y, z: t.z, q: [r.x, r.y, r.z, r.w], speed: Math.hypot(v.x, v.z), lastSeq: p.lastSeq, queue: p.queue.length, away: p.awaySince !== null, ...p.stats, runner: p.runner ? { next: p.runner.next, t: p.runner.t, state: p.runner.state } : null }; }) };
  }
  dispose() { for (const p of this.players.values()) p.car.dispose(); this.players.clear(); this.world.free(); }
}
