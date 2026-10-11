import { BUILDERS } from './models';
import type { Kit } from './kit';

type V3 = [number, number, number];
export type VehicleCat = 'suv' | 'pickup' | 'recovery' | 'rally';
/** Garage categories. Trailers are deliberately not offered: there is no hitch / trailer physics yet. */
export const CATEGORIES: { id: VehicleCat; label: string }[] = [{ id: 'suv', label: 'SUVs' }, { id: 'pickup', label: 'Pickups' }, { id: 'rally', label: 'Rally' }, { id: 'recovery', label: 'Recovery' }];
export interface VehicleSpec {
  id: string; name: string; klass: string; desc: string; defaultPaint: number;
  /** garage category */
  cat: VehicleCat;
  mass: number; inertia?: V3; com: V3;
  chassis: { hx: number; hy: number; hz: number; y: number };
  cabin: { hx: number; hy: number; hz: number; y: number; z: number };
  wheel: { x: number; y: number; zf: number; zr: number; r: number; w: number };
  susp: { rest: number; travel: number; stiffness: number; compression: number; relaxation: number };
  engine: number;   // N per wheel at low speed (4WD)
  topSpeed: number; // m/s
  reverse: number;  // m/s
  grip: { ground: number; sand: number; mud: number };  // multipliers on surface friction-slip
  side: number;     // multiplier on lateral tyre stiffness
  drag: { sand: number; mud: number };                  // multipliers on soft-surface drag (clearance / tyre size)
  steerLow: number; steerHigh: number;                  // max steering angle (rad) at standstill / at ~100 km/h
  assist: number;   // arcade yaw assist (rad/s^2 at full lock) that lightens steering at speed
  lamp: { x: number; y: number; z: number };
  /** wheel look: rim style/colour, axle layout for the animated suspension, spring colour */
  rim: { style: 'steel' | 'spoke' | 'twin' | 'rally' | 'truck'; color: number; metal: number; rough: number };
  axle: 'solid' | 'independent'; spring: number;
  /** transfer-case modes this vehicle offers (first 4WD mode is the default) */
  drive?: ('2H' | '4H' | '4L' | 'AWD')[];
  /** share of drive force to the front axle in 4H / 4L / AWD (0..1, default 0.5) */
  frontSplit?: number;
  build: (k: Kit, s: VehicleSpec) => void;
}

export const VEHICLES: VehicleSpec[] = [
  {
    drive: ['2H', '4H', '4L'],
    id: 'scout', cat: 'suv', name: 'Frontier Scout', klass: 'Short-wheelbase classic 4×4', defaultPaint: 0xb8823a,
    desc: 'Boxy, nimble and tough. Short overhangs and long-travel springs make it the all-round trail tool.',
    mass: 1650, inertia: [4200, 4800, 1300], com: [0, -0.35, 0.05],
    chassis: { hx: 0.95, hy: 0.42, hz: 2.25, y: 0.1 }, cabin: { hx: 0.85, hy: 0.35, hz: 1.2, y: 0.85, z: -0.3 },
    wheel: { x: 0.98, y: -0.25, zf: 1.42, zr: -1.42, r: 0.43, w: 0.34 },
    susp: { rest: 0.38, travel: 0.32, stiffness: 28, compression: 2.6, relaxation: 3.2 },
    engine: 4600, topSpeed: 36, reverse: 9, grip: { ground: 1, sand: 1, mud: 1 }, side: 1, drag: { sand: 1, mud: 1 },
    steerLow: 0.6, steerHigh: 0.26, assist: 3, lamp: { x: 0.7, y: 0.35, z: 2.3 },
    rim: { style: 'steel', color: 0xd9d9d4, metal: 0.3, rough: 0.5 }, axle: 'solid', spring: 0xc8a400, build: BUILDERS.scout,
  },
  {
    drive: ['2H', '4H', '4L'],
    id: 'voyager', cat: 'suv', name: 'Voyager Expedition', klass: 'Large expedition SUV', defaultPaint: 0x4f5d3a,
    desc: 'Long-range overlander with a roof tent, winch bar and plush long-travel suspension. Comfortable, heavy, unstoppable.',
    mass: 2450, com: [0, -0.4, 0.1],
    chassis: { hx: 1.0, hy: 0.45, hz: 2.45, y: 0.1 }, cabin: { hx: 0.95, hy: 0.4, hz: 1.6, y: 0.95, z: -0.4 },
    wheel: { x: 1.02, y: -0.3, zf: 1.5, zr: -1.45, r: 0.44, w: 0.34 },
    susp: { rest: 0.42, travel: 0.36, stiffness: 25, compression: 2.4, relaxation: 3.0 },
    engine: 5600, topSpeed: 40, reverse: 9, grip: { ground: 0.85, sand: 1.05, mud: 1.15 }, side: 0.95, drag: { sand: 0.95, mud: 0.85 },
    steerLow: 0.55, steerHigh: 0.23, assist: 2.4, lamp: { x: 0.72, y: 0.38, z: 2.5 },
    rim: { style: 'spoke', color: 0x2a2c2e, metal: 0.5, rough: 0.45 }, axle: 'solid', spring: 0x1f5fbf, build: BUILDERS.voyager,
  },
  {
    drive: ['2H', '4H', '4L'],
    id: 'sahara', cat: 'suv', name: 'Sahara GT', klass: 'Full-size desert SUV', defaultPaint: 0xe6e6e0,
    desc: 'Big-bore V8 dune cruiser. Huge power and wide sand-biting tyres; long and heavy in the tight stuff.',
    mass: 2700, com: [0, -0.38, 0.15],
    chassis: { hx: 1.03, hy: 0.45, hz: 2.55, y: 0.1 }, cabin: { hx: 0.97, hy: 0.4, hz: 1.5, y: 0.95, z: -0.35 },
    wheel: { x: 1.05, y: -0.3, zf: 1.55, zr: -1.55, r: 0.46, w: 0.38 },
    susp: { rest: 0.4, travel: 0.3, stiffness: 32, compression: 2.8, relaxation: 3.4 },
    engine: 7400, topSpeed: 44, reverse: 10, grip: { ground: 0.9, sand: 1.25, mud: 0.95 }, side: 1.0, drag: { sand: 0.8, mud: 1.05 },
    steerLow: 0.52, steerHigh: 0.22, assist: 2.4, lamp: { x: 0.74, y: 0.4, z: 2.58 },
    rim: { style: 'twin', color: 0xc9ccd1, metal: 0.9, rough: 0.25 }, axle: 'independent', spring: 0x9a9a9a, build: BUILDERS.sahara,
  },
  {
    drive: ['2H', '4H', '4L'],
    id: 'pickup', cat: 'pickup', name: 'Workhorse Trail', klass: 'Off-road pickup', defaultPaint: 0xb3261e,
    desc: 'Double-cab trail truck with a cargo bed and roll bar. Long wheelbase: stable at speed, wide in the turns.',
    mass: 2200, com: [0, -0.38, 0.35],
    chassis: { hx: 0.98, hy: 0.42, hz: 2.7, y: 0.1 }, cabin: { hx: 0.93, hy: 0.4, hz: 0.95, y: 0.92, z: 0.45 },
    wheel: { x: 1.0, y: -0.3, zf: 1.75, zr: -1.65, r: 0.44, w: 0.34 },
    susp: { rest: 0.4, travel: 0.34, stiffness: 27, compression: 2.6, relaxation: 3.2 },
    engine: 4800, topSpeed: 38, reverse: 9, grip: { ground: 0.88, sand: 1.05, mud: 1.0 }, side: 1.0, drag: { sand: 1, mud: 1 },
    steerLow: 0.5, steerHigh: 0.22, assist: 2.4, lamp: { x: 0.72, y: 0.38, z: 2.72 },
    rim: { style: 'spoke', color: 0x9da2a8, metal: 0.8, rough: 0.35 }, axle: 'solid', spring: 0xd23b1e, build: BUILDERS.pickup,
  },
  {
    drive: ['AWD'], frontSplit: 0.4,
    id: 'rally', cat: 'rally', name: 'Apex R4', klass: 'Rally car', defaultPaint: 0x2c5d8f,
    desc: 'Featherweight turbo rally hatch. Explosive acceleration and sharp turn-in; low ground clearance hates deep mud.',
    mass: 1250, com: [0, -0.3, 0.1],
    chassis: { hx: 0.9, hy: 0.35, hz: 2.05, y: 0.05 }, cabin: { hx: 0.78, hy: 0.3, hz: 1.0, y: 0.62, z: -0.3 },
    wheel: { x: 0.9, y: -0.15, zf: 1.3, zr: -1.25, r: 0.36, w: 0.3 },
    susp: { rest: 0.3, travel: 0.22, stiffness: 42, compression: 3.2, relaxation: 3.8 },
    engine: 4400, topSpeed: 48, reverse: 10, grip: { ground: 1.15, sand: 0.9, mud: 0.78 }, side: 1.2, drag: { sand: 1.15, mud: 1.55 },
    steerLow: 0.65, steerHigh: 0.32, assist: 4, lamp: { x: 0.62, y: 0.2, z: 2.08 },
    rim: { style: 'rally', color: 0xf2f2f0, metal: 0.2, rough: 0.4 }, axle: 'independent', spring: 0xe8c200, build: BUILDERS.rally,
  },
  {
    drive: ['4H', '4L'],
    id: 'recovery', cat: 'recovery', name: 'Atlas Recovery', klass: 'Recovery truck', defaultPaint: 0xe07a1f,
    desc: 'Cab-over 4×4 recovery rig with a hydraulic boom and front winch. Massive torque and tyres, slow and heavy.',
    mass: 4300, com: [0, -0.5, 0.4],
    chassis: { hx: 1.15, hy: 0.55, hz: 3.5, y: 0.3 }, cabin: { hx: 1.12, hy: 0.7, hz: 0.9, y: 1.45, z: 2.45 },
    wheel: { x: 1.1, y: -0.12, zf: 2.4, zr: -2.0, r: 0.55, w: 0.42 },
    susp: { rest: 0.44, travel: 0.34, stiffness: 30, compression: 2.8, relaxation: 3.4 },
    engine: 8200, topSpeed: 29, reverse: 7, grip: { ground: 0.72, sand: 1.05, mud: 1.25 }, side: 0.95, drag: { sand: 0.9, mud: 0.75 },
    steerLow: 0.48, steerHigh: 0.2, assist: 1.6, lamp: { x: 0.85, y: 0.65, z: 3.4 },
    rim: { style: 'truck', color: 0xb8bcc0, metal: 0.5, rough: 0.45 }, axle: 'solid', spring: 0x333333, build: BUILDERS.recovery,
  },
];
export const vehicleById = (id: string) => VEHICLES.find((v) => v.id === id) ?? VEHICLES[0];

export const PAINTS: { name: string; hex: number }[] = [
  { name: 'Desert Tan', hex: 0xb8823a }, { name: 'Expedition Green', hex: 0x4f5d3a }, { name: 'Glacier White', hex: 0xe6e6e0 },
  { name: 'Rescue Red', hex: 0xb3261e }, { name: 'Ocean Blue', hex: 0x2c5d8f }, { name: 'Graphite', hex: 0x3a3d42 },
  { name: 'Sunburst Orange', hex: 0xe07a1f }, { name: 'Sand Beige', hex: 0xd8c49a },
];

/** 0..1 stat-bar values derived from the actual physics tuning. */
export function stats(s: VehicleSpec) {
  const accel = (s.engine * 4) / s.mass;
  return {
    Power: Math.min(1, accel / 14.5),
    'Top speed': Math.min(1, s.topSpeed / 50),
    Handling: Math.min(1, (s.steerHigh / 0.32) * 0.6 + s.side * 0.35 - (s.wheel.zf - s.wheel.zr) * 0.05),
    'Off-road': Math.min(1, ((s.grip.mud + s.grip.sand) / 2 / ((s.drag.mud + s.drag.sand) / 2)) * 0.55 + (s.susp.travel / 0.36) * 0.35),
    Weight: Math.min(1, s.mass / 4500),
  };
}
