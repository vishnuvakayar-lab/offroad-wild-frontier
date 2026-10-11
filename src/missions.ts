import type { Medal } from './save';
import { TRAIL, LEG_MID, RIDGE_TRAIL, DASH_PTS, DELIVER_PTS, DELIVER_CAMP } from './terrain';

export type Mode = 'free' | 'challenge' | 'race' | 'rescue';
export type MissionType = 'race' | 'mudrun' | 'climb' | 'tow' | 'deliver';
export interface Gate { x: number; z: number; yaw: number; w: number }
export interface Pose { x: number; z: number; yaw: number }
export interface MissionDef {
  id: string; mode: Exclude<Mode, 'free'>; type: MissionType; title: string; desc: string;
  start: Pose; gates: Gate[]; limit: number | null; noReset?: boolean;
  zone?: { x: number; z: number; r: number };       // finish / summit / safe zone / camp
  stuck?: Pose;                                      // tow target
  path?: { x: number; z: number }[];                 // driving line (bot + wrong-way detection on winding routes)
  laps?: number;
  targets: { gold: number; silver: number; bronze: number }; reward: number;
}

const yawOf = (dx: number, dz: number) => Math.atan2(dx, dz);
/** Gates through a list of points; each gate faces along the local path direction. */
function gatesFrom(pts: [number, number][], w = 12): Gate[] {
  return pts.map(([x, z], i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    return { x, z, yaw: yawOf(b[0] - a[0], b[1] - a[1]), w };
  });
}
const startBefore = (g: Gate, d = 14): Pose => ({ x: g.x - Math.sin(g.yaw) * d, z: g.z - Math.cos(g.yaw) * d, yaw: g.yaw });

// Dune Loop: an elliptical lap through the flat apron and dunes of the desert (start just past the finish line = first gate again)
const LOOP: [number, number][] = [];
for (let k = 0; k <= 8; k++) { const a = Math.PI + (k / 8) * Math.PI * 2; LOOP.push([80 + Math.cos(a) * 26, -55 - Math.sin(a) * 38]); }
LOOP[8] = [LOOP[0][0], LOOP[0][1]];
const loopGates = gatesFrom(LOOP); loopGates[0].yaw = loopGates[8].yaw = yawOf(LOOP[1][0] - LOOP[7][0], LOOP[1][1] - LOOP[7][1]);
const DASH: [number, number][] = DASH_PTS;
const dashGates = gatesFrom(DASH);
// Dune Loop: two laps -> the 8 gates repeated
const loop2 = [...loopGates.slice(1), ...loopGates.slice(1)];
const pathOf = (pts: { x: number; z: number }[]) => pts.map((p) => ({ x: p.x, z: p.z }));
// Ridge Climb: checkpoints in the middle of every switchback leg, summit flag on the plateau
const climbGates: Gate[] = LEG_MID.map((i) => { const a = TRAIL[Math.max(0, i - 1)], b = TRAIL[Math.min(TRAIL.length - 1, i + 1)]; return { x: TRAIL[i].x, z: TRAIL[i].z, yaw: yawOf(b.x - a.x, b.z - a.z), w: 9 }; }).slice(1);
// Supply Run: long cross-terrain route (mud basin edge, proving-ground, eastern hills, dunes) to the camp
const deliverGates = gatesFrom(DELIVER_PTS, 14).slice(1);
const deliverStart: Pose = { x: DELIVER_PTS[0][0] + 8, z: DELIVER_PTS[0][1] - 10, yaw: yawOf(DELIVER_PTS[1][0] - DELIVER_PTS[0][0] - 8, DELIVER_PTS[1][1] - DELIVER_PTS[0][1] + 10) };

/** Medal targets from the clean test bot's time on the Scout (deterministic, tests/phase6b): gold = bot x 1.2,
 *  silver = x 1.5, bronze = x 2 (rounded to 0.5 s). The human-like bot (reaction delay, input noise, slower corners)
 *  must still reach bronze; see tests/phase6b-block.mjs. */
export const BOT_TIMES: Record<string, number> = { 'race-loop': 31.07, 'race-dash': 26.35, 'ch-mud': 9.1, 'ch-climb': 48.13, 'rs-tow': 25.7, 'rs-deliver': 45.63 };
export const MEDAL_FACTORS = { gold: 1.2, silver: 1.5, bronze: 2 };
const r05 = (x: number) => Math.round(x * 2) / 2;
const fromBot = (id: string) => ({ gold: r05(BOT_TIMES[id] * MEDAL_FACTORS.gold), silver: r05(BOT_TIMES[id] * MEDAL_FACTORS.silver), bronze: r05(BOT_TIMES[id] * MEDAL_FACTORS.bronze) });

export const MISSIONS: MissionDef[] = [
  { id: 'race-loop', mode: 'race', type: 'race', title: 'Dune Loop', desc: 'Two laps of the desert: flat apron and rolling dunes. 16 checkpoints.',
    start: startBefore(loopGates[0], -4), gates: loop2, laps: 2, limit: null, targets: fromBot('race-loop'), reward: 320 },
  { id: 'race-dash', mode: 'race', type: 'race', title: 'Canyon Dash', desc: 'Point-to-point sprint across the dune field and up the canyon rim and back to base. 13 checkpoints.',
    start: startBefore(dashGates[0]), gates: dashGates, limit: null, targets: fromBot('race-dash'), reward: 320 },
  { id: 'ch-mud', mode: 'challenge', type: 'mudrun', title: 'Mud Crossing', desc: 'Cross the mud basin through both gates within the time limit. No resets allowed.',
    start: { x: -72, z: 1, yaw: 0 }, gates: gatesFrom([[-72, 30], [-72, 78]], 14), limit: 30, noReset: true, targets: fromBot('ch-mud'), reward: 250 },
  { id: 'ch-climb', mode: 'challenge', type: 'climb', title: 'Ridge Climb', desc: 'Switchback trail up the rocky mountain: steep loose-rock sections and tight hairpins. Reach the summit flag; do not roll over.',
    start: { ...RIDGE_TRAIL.start }, gates: climbGates, limit: 150, zone: { x: RIDGE_TRAIL.summit.x, z: RIDGE_TRAIL.summit.z, r: 7 }, path: pathOf(TRAIL), targets: fromBot('ch-climb'), reward: 420 },
  { id: 'rs-tow', mode: 'rescue', type: 'tow', title: 'Bogged Down', desc: 'A 4x4 is stuck deep in the mud basin. Reach it, hook up the tow rope (H / Hook) and drag it well inside the safe zone.',
    start: { x: -14, z: 34, yaw: -Math.PI / 2 }, gates: [], limit: 150, zone: { x: -22, z: 48, r: 7 }, stuck: { x: -60, z: 46, yaw: Math.PI / 2 },
    targets: fromBot('rs-tow'), reward: 450 },
  { id: 'rs-deliver', mode: 'rescue', type: 'deliver', title: 'Supply Run', desc: 'Cross the map with supplies — mud basin, proving ground, eastern hills and dunes — and stop at the stranded camp before night falls.',
    start: deliverStart, gates: deliverGates, limit: 120, zone: { x: DELIVER_CAMP.x, z: DELIVER_CAMP.z, r: 8 },
    path: [{ x: deliverStart.x, z: deliverStart.z }, ...DELIVER_PTS.map(([x, z]) => ({ x, z })), DELIVER_CAMP], targets: fromBot('rs-deliver'), reward: 500 },
];
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);

export const TOW_MARGIN = 2, TOW_HOLD = 1;
export function medalFor(time: number, t: MissionDef['targets']): Medal {
  return time <= t.gold ? 'gold' : time <= t.silver ? 'silver' : time <= t.bronze ? 'bronze' : 'none';
}

export interface CarSample { x: number; z: number; yaw: number; speed: number; up: number }
export type RunState = 'countdown' | 'running' | 'success' | 'fail';

/** Deterministic mission logic, stepped at the fixed physics rate (also by the test `simulate` hook). */
export class MissionRunner {
  state: RunState = 'countdown';
  countdown = 3; t = 0; next = 0; splits: number[] = []; rejected = 0; resets = 0;
  msg = ''; msgT = 0; wrongT = 0; flipT = 0; failReason = ''; zoneHold = 0;
  last: Pose; attached = false; reached = false;
  private prev: { x: number; z: number } | null = null;
  /** the car was teleported (reset/start): don't treat the jump as a gate crossing */
  jumped() { this.prev = null; }
  constructor(public def: MissionDef) { this.last = { ...def.start }; }

  get finished() { return this.state === 'success' || this.state === 'fail'; }
  /** recent distinct messages (for tests / debugging) */
  log: string[] = [];
  say(m: string, t = 1.6) { if (this.log[this.log.length - 1] !== m) { this.log.push(m); if (this.log.length > 30) this.log.shift(); } this.msg = m; this.msgT = t; }

  /** returns true when the reset is allowed (and it should teleport to `last`) */
  requestReset(): boolean {
    if (this.state !== 'running') return false;
    if (this.def.noReset) { this.fail('Reset used — challenge failed'); return false; }
    this.resets++; this.prev = null; this.say('Reset to last checkpoint'); return true;
  }
  fail(reason: string) { if (this.finished) return; this.state = 'fail'; this.failReason = reason; }
  succeed() { if (this.finished) return; this.state = 'success'; }

  update(dt: number, c: CarSample, ext: { stuck?: { x: number; z: number } } = {}) {
    if (this.msgT > 0) this.msgT -= dt;
    if (this.state === 'countdown') {
      this.countdown -= dt; this.prev = { x: c.x, z: c.z };
      if (this.countdown <= 0) { this.state = 'running'; this.say('GO!', 1); }
      return;
    }
    if (this.state !== 'running') return;
    this.t += dt;
    const d = this.def;
    // gates
    if (this.prev && d.gates.length) {
      for (let j = 0; j < d.gates.length; j++) {
        const g = d.gates[j], dir = cross(this.prev, c, g);
        if (!dir) continue;
        // lap races repeat gates: a crossing of a later copy of the current gate is the current gate
        if (j > this.next && d.gates.findIndex((q) => Math.hypot(q.x - g.x, q.z - g.z) < 0.5) < j) continue;
        if (dir < 0) { this.say('Wrong way!'); continue; }
        if (j === this.next) {
          this.splits.push(this.t); this.next++;
          this.last = { x: g.x, z: g.z, yaw: g.yaw };
          if (this.next >= d.gates.length) { if (d.type === 'race' || d.type === 'mudrun') this.succeed(); }
          else this.say(`Checkpoint ${this.next}/${d.gates.length}`, 1.2);
        } else if (j > this.next) { this.rejected++; this.say(`Missed checkpoint ${this.next + 1}!`, 2); }
      }
    }
    this.prev = { x: c.x, z: c.z };
    // wrong-way detection towards the next gate
    if (d.path && Math.abs(c.speed) > 3) {
      // winding routes: compare heading with the driving line's local direction (hairpins would fool a gate bearing)
      let bi = 0, bd = Infinity; for (let i = 0; i < d.path.length - 1; i++) { const q = d.path[i]; const dd = (q.x - c.x) ** 2 + (q.z - c.z) ** 2; if (dd < bd) { bd = dd; bi = i; } }
      const a = d.path[bi], b = d.path[bi + 1], L = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      const dot = (Math.sin(c.yaw) * (b.x - a.x) + Math.cos(c.yaw) * (b.z - a.z)) / L * Math.sign(c.speed);
      this.wrongT = dot < -0.5 && bd < 400 ? this.wrongT + dt : 0;
      if (this.wrongT > 1.5) this.say('Wrong way!', 0.3);
    } else if (this.next < d.gates.length && Math.abs(c.speed) > 3) {
      const g = d.gates[this.next], tx = g.x - c.x, tz = g.z - c.z, L = Math.hypot(tx, tz) || 1;
      const dot = (Math.sin(c.yaw) * tx + Math.cos(c.yaw) * tz) / L * Math.sign(c.speed);
      this.wrongT = dot < -0.3 ? this.wrongT + dt : 0;
      if (this.wrongT > 1) this.say('Wrong way!', 0.3);
    } else this.wrongT = 0;
    // type-specific goals
    const inZone = (p: { x: number; z: number }) => !!d.zone && Math.hypot(p.x - d.zone.x, p.z - d.zone.z) < d.zone.r;
    if (d.type === 'climb') {
      this.flipT = c.up < 0.35 ? this.flipT + dt : 0;
      if (this.flipT > 2.5) this.fail('Rolled over');
      if (inZone(c) && this.next >= d.gates.length) this.succeed();
      else if (inZone(c)) this.say(`Missed checkpoint ${this.next + 1}!`, 0.5);
    } else if (d.type === 'deliver') {
      const allGates = this.next >= d.gates.length;
      if (inZone(c) && allGates && Math.abs(c.speed) < 4) this.succeed();
      else if (inZone(c) && !allGates) this.say(`Missed checkpoint ${this.next + 1}!`, 0.5);
      else if (inZone(c)) this.say('Slow down and stop at the camp', 0.3);
    } else if (d.type === 'tow' && ext.stuck) {
      const dist = Math.hypot(c.x - ext.stuck.x, c.z - ext.stuck.z);
      if (!this.reached && dist < 9) { this.reached = true; this.say('Hook up the tow rope (H / Hook)', 3); }
      // the towed vehicle's centre must be well inside (<= r - 2 m) and stay there for 1 s
      const zd = d.zone ? Math.hypot(ext.stuck.x - d.zone.x, ext.stuck.z - d.zone.z) : Infinity;
      const deep = !!d.zone && zd <= d.zone.r - TOW_MARGIN;
      this.zoneHold = this.attached && deep ? this.zoneHold + dt : 0;
      if (this.attached && inZone(ext.stuck) && !deep) this.say('Pull it further into the safe zone', 0.3);
      else if (this.zoneHold > 0) this.say('Hold it there…', 0.3);
      if (this.zoneHold >= TOW_HOLD) this.succeed();
    }
    if (d.limit !== null && this.t >= d.limit && !this.finished) {
      this.t = d.limit; this.fail(d.type === 'deliver' ? 'Night fell before the supplies arrived' : 'Out of time');
    }
  }
}

/** +1 if the move a->b crosses gate g forwards, -1 backwards, 0 if no crossing. */
export function cross(a: { x: number; z: number }, b: { x: number; z: number }, g: Gate): number {
  const fx = Math.sin(g.yaw), fz = Math.cos(g.yaw);
  const sa = (a.x - g.x) * fx + (a.z - g.z) * fz, sb = (b.x - g.x) * fx + (b.z - g.z) * fz;
  if ((sa < 0) === (sb < 0)) return 0;
  const t = sa / (sa - sb), px = a.x + (b.x - a.x) * t - g.x, pz = a.z + (b.z - a.z) * t - g.z;
  const lat = px * fz - pz * fx;
  if (Math.abs(lat) > g.w / 2) return 0;
  return sb > sa ? 1 : -1;
}
