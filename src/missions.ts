import type { Medal } from './save';

export type Mode = 'free' | 'challenge' | 'race' | 'rescue';
export type MissionType = 'race' | 'mudrun' | 'climb' | 'tow' | 'deliver';
export interface Gate { x: number; z: number; yaw: number; w: number }
export interface Pose { x: number; z: number; yaw: number }
export interface MissionDef {
  id: string; mode: Exclude<Mode, 'free'>; type: MissionType; title: string; desc: string;
  start: Pose; gates: Gate[]; limit: number | null; noReset?: boolean;
  zone?: { x: number; z: number; r: number };       // finish / summit / safe zone / camp
  stuck?: Pose;                                      // tow target
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

// Dune Loop: an elliptical lap through the flat apron and dunes of the desert (finish = first gate again)
const LOOP: [number, number][] = [];
for (let k = 0; k <= 8; k++) { const a = Math.PI + (k / 8) * Math.PI * 2; LOOP.push([80 + Math.cos(a) * 26, -55 - Math.sin(a) * 38]); }
LOOP[8] = [LOOP[0][0], LOOP[0][1]];
const loopGates = gatesFrom(LOOP); loopGates[0].yaw = loopGates[8].yaw = yawOf(LOOP[1][0] - LOOP[7][0], LOOP[1][1] - LOOP[7][1]);
const DASH: [number, number][] = [[40, -28], [58, -46], [68, -72], [88, -90], [103, -70], [99, -42], [84, -18]];
const dashGates = gatesFrom(DASH);

export const MISSIONS: MissionDef[] = [
  { id: 'race-loop', mode: 'race', type: 'race', title: 'Dune Loop', desc: 'One lap of the desert: flat apron and rolling dunes. 8 checkpoints.',
    start: startBefore(loopGates[0], 10), gates: loopGates.slice(1), limit: null, targets: { gold: 30, silver: 35, bronze: 42 }, reward: 300 },
  { id: 'race-dash', mode: 'race', type: 'race', title: 'Canyon Dash', desc: 'Point-to-point sprint across the dune field. 7 checkpoints.',
    start: startBefore(dashGates[0]), gates: dashGates, limit: null, targets: { gold: 22, silver: 26, bronze: 32 }, reward: 300 },
  { id: 'ch-mud', mode: 'challenge', type: 'mudrun', title: 'Mud Crossing', desc: 'Cross the mud basin through both gates within the time limit. No resets allowed.',
    start: { x: -72, z: 1, yaw: 0 }, gates: gatesFrom([[-72, 30], [-72, 78]], 14), limit: 30, noReset: true, targets: { gold: 11, silver: 14, bronze: 30 }, reward: 250 },
  { id: 'ch-climb', mode: 'challenge', type: 'climb', title: 'Ridge Climb', desc: 'Climb the rocky ridge to the summit flag before the clock runs out. Do not roll over.',
    start: { x: -44, z: -44, yaw: yawOf(-1, -1) }, gates: [], limit: 60, zone: { x: -92, z: -92, r: 7 }, targets: { gold: 12, silver: 16, bronze: 60 }, reward: 300 },
  { id: 'rs-tow', mode: 'rescue', type: 'tow', title: 'Bogged Down', desc: 'A 4x4 is stuck deep in the mud basin. Reach it, hook up the tow rope (T / Hook) and drag it to the safe zone.',
    start: { x: -14, z: 34, yaw: -Math.PI / 2 }, gates: [], limit: 240, zone: { x: -22, z: 48, r: 7 }, stuck: { x: -60, z: 46, yaw: Math.PI / 2 },
    targets: { gold: 50, silver: 75, bronze: 240 }, reward: 450 },
  { id: 'rs-deliver', mode: 'rescue', type: 'deliver', title: 'Supply Run', desc: 'A camp is stranded at the desert edge. Deliver the supplies and stop at the camp before dark.',
    start: { x: 0, z: -8, yaw: yawOf(40, -87) }, gates: [], limit: 50, zone: { x: 40, z: -95, r: 8 }, targets: { gold: 14, silver: 18, bronze: 50 }, reward: 350 },
];
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);

export function medalFor(time: number, t: MissionDef['targets']): Medal {
  return time <= t.gold ? 'gold' : time <= t.silver ? 'silver' : time <= t.bronze ? 'bronze' : 'none';
}

export interface CarSample { x: number; z: number; yaw: number; speed: number; up: number }
export type RunState = 'countdown' | 'running' | 'success' | 'fail';

/** Deterministic mission logic, stepped at the fixed physics rate (also by the test `simulate` hook). */
export class MissionRunner {
  state: RunState = 'countdown';
  countdown = 3; t = 0; next = 0; splits: number[] = []; rejected = 0; resets = 0;
  msg = ''; msgT = 0; wrongT = 0; flipT = 0; failReason = '';
  last: Pose; attached = false; reached = false;
  private prev: { x: number; z: number } | null = null;
  constructor(public def: MissionDef) { this.last = { ...def.start }; }

  get finished() { return this.state === 'success' || this.state === 'fail'; }
  say(m: string, t = 1.6) { this.msg = m; this.msgT = t; }

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
    if (this.next < d.gates.length && Math.abs(c.speed) > 3) {
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
      if (inZone(c)) this.succeed();
    } else if (d.type === 'deliver') {
      if (inZone(c) && Math.abs(c.speed) < 4) this.succeed();
      else if (inZone(c)) this.say('Slow down and stop at the camp', 0.3);
    } else if (d.type === 'tow' && ext.stuck) {
      const dist = Math.hypot(c.x - ext.stuck.x, c.z - ext.stuck.z);
      if (!this.reached && dist < 9) { this.reached = true; this.say('Hook up the tow rope (T / Hook)', 3); }
      if (this.attached && inZone(ext.stuck)) this.succeed();
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
