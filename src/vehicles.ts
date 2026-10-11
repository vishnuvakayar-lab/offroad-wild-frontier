import * as THREE from 'three';

/** Shared materials handed to each procedural model builder. */
export interface Mats {
  paint: THREE.MeshStandardMaterial; dark: THREE.MeshStandardMaterial; glass: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial; lamp: THREE.MeshStandardMaterial; tail: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial; amber: THREE.MeshStandardMaterial;
}
type V3 = [number, number, number];
export interface VehicleSpec {
  id: string; name: string; klass: string; desc: string; defaultPaint: number;
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
  build: (g: THREE.Group, m: Mats, s: VehicleSpec) => void;
}

const mk = (g: THREE.Group) => (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
};
const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const C = (r: number, h: number, seg = 16) => new THREE.CylinderGeometry(r, r, h, seg);
const flares = (add: ReturnType<typeof mk>, m: Mats, s: VehicleSpec, y: number, len = 1.15) => {
  for (const z of [s.wheel.zf, s.wheel.zr]) for (const sx of [-1, 1]) add(B(0.24, 0.12, len), m.dark, sx * (s.wheel.x + 0.02), y, z);
};
const roundLamps = (add: ReturnType<typeof mk>, m: Mats, x: number, y: number, z: number, r = 0.13) => {
  for (const sx of [-1, 1]) add(C(r, 0.06, 14), m.lamp, sx * x, y, z, Math.PI / 2);
};

export const VEHICLES: VehicleSpec[] = [
  {
    id: 'scout', name: 'Frontier Scout', klass: 'Short-wheelbase classic 4×4', defaultPaint: 0xb8823a,
    desc: 'Boxy, nimble and tough. Short overhangs and long-travel springs make it the all-round trail tool.',
    mass: 1650, inertia: [4200, 4800, 1300], com: [0, -0.35, 0.05],
    chassis: { hx: 0.95, hy: 0.42, hz: 2.25, y: 0.1 }, cabin: { hx: 0.85, hy: 0.35, hz: 1.2, y: 0.85, z: -0.3 },
    wheel: { x: 0.98, y: -0.25, zf: 1.42, zr: -1.42, r: 0.43, w: 0.34 },
    susp: { rest: 0.38, travel: 0.32, stiffness: 28, compression: 2.6, relaxation: 3.2 },
    engine: 4600, topSpeed: 36, reverse: 9, grip: { ground: 1, sand: 1, mud: 1 }, side: 1, drag: { sand: 1, mud: 1 },
    steerLow: 0.6, steerHigh: 0.26, assist: 3, lamp: { x: 0.7, y: 0.35, z: 2.3 },
    build(g, m, s) {
      const add = mk(g);
      add(B(1.9, 0.7, 4.4), m.paint, 0, 0.15, 0);
      add(B(1.8, 0.75, 2.6), m.paint, 0, 0.85, -0.45);
      add(B(1.82, 0.5, 2.3), m.glass, 0, 0.9, -0.4);
      add(B(1.84, 0.08, 2.65), m.paint, 0, 1.24, -0.45);
      add(B(1.7, 0.6, 0.08), m.glass, 0, 0.88, 0.86, -0.25);
      add(B(1.86, 0.18, 4.5), m.dark, 0, -0.12, 0);
      add(B(1.4, 0.08, 1.3), m.paint, 0, 0.54, 1.45);
      add(B(1.7, 0.06, 2.2), m.dark, 0, 1.38, -0.45);
      for (const x of [-0.82, 0.82]) add(B(0.06, 0.12, 2.2), m.dark, x, 1.42, -0.45);
      add(B(1.95, 0.22, 0.25), m.dark, 0, -0.05, 2.28);
      add(B(1.2, 0.08, 0.08), m.chrome, 0, 0.35, 2.38);
      for (const x of [-0.55, 0.55]) add(B(0.08, 0.45, 0.08), m.chrome, x, 0.15, 2.38);
      add(B(1.95, 0.22, 0.2), m.dark, 0, -0.05, -2.25);
      roundLamps(add, m, 0.7, 0.35, 2.21);
      for (const x of [-0.85, 0.85]) add(B(0.14, 0.24, 0.04), m.tail, x, 0.32, -2.21);
      add(C(0.4, 0.25, 20), m.dark, 0, 0.6, -2.35, Math.PI / 2);
      flares(add, m, s, 0.42);
      add(B(0.1, 0.9, 0.1), m.dark, 0.93, 0.85, 1.0);
    },
  },
  {
    id: 'voyager', name: 'Voyager Expedition', klass: 'Large expedition SUV', defaultPaint: 0x4f5d3a,
    desc: 'Long-range overlander with a roof tent, winch bar and plush long-travel suspension. Comfortable, heavy, unstoppable.',
    mass: 2450, com: [0, -0.4, 0.1],
    chassis: { hx: 1.0, hy: 0.45, hz: 2.45, y: 0.1 }, cabin: { hx: 0.95, hy: 0.4, hz: 1.6, y: 0.95, z: -0.4 },
    wheel: { x: 1.02, y: -0.3, zf: 1.5, zr: -1.45, r: 0.44, w: 0.34 },
    susp: { rest: 0.42, travel: 0.36, stiffness: 25, compression: 2.4, relaxation: 3.0 },
    engine: 5600, topSpeed: 40, reverse: 9, grip: { ground: 0.85, sand: 1.05, mud: 1.15 }, side: 0.95, drag: { sand: 0.95, mud: 0.85 },
    steerLow: 0.55, steerHigh: 0.23, assist: 2.4, lamp: { x: 0.72, y: 0.38, z: 2.5 },
    build(g, m, s) {
      const add = mk(g);
      add(B(2.0, 0.75, 4.85), m.paint, 0, 0.15, 0);
      add(B(1.92, 0.85, 3.3), m.paint, 0, 0.92, -0.45);
      add(B(1.94, 0.5, 3.0), m.glass, 0, 0.98, -0.4);
      add(B(1.8, 0.62, 0.08), m.glass, 0, 0.95, 1.22, -0.35);
      add(B(1.5, 0.1, 1.4), m.paint, 0, 0.56, 1.75);                 // bonnet
      add(B(1.96, 0.2, 4.95), m.dark, 0, -0.14, 0);
      add(B(1.55, 0.32, 1.9), m.accent, 0, 1.55, -0.7);              // roof-top tent
      for (const x of [-0.88, 0.88]) add(B(0.06, 0.1, 3.0), m.chrome, x, 1.4, -0.45);
      add(B(2.05, 0.35, 0.3), m.dark, 0, 0.0, 2.48);                  // winch bar
      add(C(0.12, 0.8, 12), m.chrome, 0, 0.02, 2.62, 0, 0, Math.PI / 2); // winch drum
      for (const x of [-0.72, 0.72]) add(B(0.34, 0.16, 0.05), m.lamp, x, 0.38, 2.43);
      add(B(1.2, 0.08, 0.06), m.chrome, 0, 0.42, 2.44);                // grille bar
      for (const x of [-0.9, 0.9]) add(B(0.12, 0.3, 0.04), m.tail, x, 0.35, -2.43);
      add(B(0.06, 1.0, 0.5), m.dark, 0.7, 0.9, -2.45);                 // rear ladder
      flares(add, m, s, 0.45, 1.2);
      for (const sx of [-1, 1]) add(B(0.18, 0.06, 2.0), m.chrome, sx * 1.05, -0.2, 0.05); // side steps
      add(B(0.11, 1.0, 0.11), m.dark, 0.97, 0.95, 1.3);                // snorkel
    },
  },
  {
    id: 'sahara', name: 'Sahara GT', klass: 'Full-size desert SUV', defaultPaint: 0xe6e6e0,
    desc: 'Big-bore V8 dune cruiser. Huge power and wide sand-biting tyres; long and heavy in the tight stuff.',
    mass: 2700, com: [0, -0.38, 0.15],
    chassis: { hx: 1.03, hy: 0.45, hz: 2.55, y: 0.1 }, cabin: { hx: 0.97, hy: 0.4, hz: 1.5, y: 0.95, z: -0.35 },
    wheel: { x: 1.05, y: -0.3, zf: 1.55, zr: -1.55, r: 0.46, w: 0.38 },
    susp: { rest: 0.4, travel: 0.3, stiffness: 32, compression: 2.8, relaxation: 3.4 },
    engine: 7400, topSpeed: 44, reverse: 10, grip: { ground: 0.9, sand: 1.25, mud: 0.95 }, side: 1.0, drag: { sand: 0.8, mud: 1.05 },
    steerLow: 0.52, steerHigh: 0.22, assist: 2.4, lamp: { x: 0.74, y: 0.4, z: 2.58 },
    build(g, m, s) {
      const add = mk(g);
      add(B(2.06, 0.78, 5.05), m.paint, 0, 0.17, 0);
      add(B(1.96, 0.78, 3.0), m.paint, 0, 0.94, -0.45);
      add(B(1.98, 0.46, 2.8), m.glass, 0, 0.98, -0.42);
      add(B(1.86, 0.66, 0.08), m.glass, 0, 0.92, 1.1, -0.55);         // raked windscreen
      add(B(1.86, 0.5, 0.08), m.glass, 0, 0.95, -1.95, 0.45);         // raked rear glass
      add(B(1.7, 0.14, 1.6), m.paint, 0, 0.6, 1.7);                    // long bonnet with bulge
      add(B(0.8, 0.08, 1.0), m.paint, 0, 0.7, 1.6);
      for (let k = 0; k < 5; k++) add(B(1.3, 0.04, 0.04), m.chrome, 0, 0.22 + k * 0.07, 2.55); // grille slats
      for (const x of [-0.78, 0.78]) add(B(0.36, 0.12, 0.05), m.lamp, x, 0.42, 2.53);
      add(B(2.1, 0.24, 0.24), m.chrome, 0, -0.08, 2.55);
      add(B(2.1, 0.24, 0.22), m.dark, 0, -0.08, -2.55);
      for (const x of [-0.92, 0.92]) add(B(0.1, 0.36, 0.04), m.tail, x, 0.42, -2.53);
      flares(add, m, s, 0.5, 1.35);
      add(B(1.4, 0.12, 0.16), m.dark, 0, 1.42, 0.7);                   // roof light bar
      for (let k = -2; k <= 2; k++) add(B(0.2, 0.08, 0.04), m.lamp, k * 0.27, 1.42, 0.79);
      for (const sx of [-1, 1]) add(B(0.05, 0.08, 2.6), m.chrome, sx * 0.9, 1.36, -0.45);
    },
  },
  {
    id: 'pickup', name: 'Workhorse Trail', klass: 'Off-road pickup', defaultPaint: 0xb3261e,
    desc: 'Double-cab trail truck with a cargo bed and roll bar. Long wheelbase: stable at speed, wide in the turns.',
    mass: 2200, com: [0, -0.38, 0.35],
    chassis: { hx: 0.98, hy: 0.42, hz: 2.7, y: 0.1 }, cabin: { hx: 0.93, hy: 0.4, hz: 0.95, y: 0.92, z: 0.45 },
    wheel: { x: 1.0, y: -0.3, zf: 1.75, zr: -1.65, r: 0.44, w: 0.34 },
    susp: { rest: 0.4, travel: 0.34, stiffness: 27, compression: 2.6, relaxation: 3.2 },
    engine: 4800, topSpeed: 38, reverse: 9, grip: { ground: 0.88, sand: 1.05, mud: 1.0 }, side: 1.0, drag: { sand: 1, mud: 1 },
    steerLow: 0.5, steerHigh: 0.22, assist: 2.4, lamp: { x: 0.72, y: 0.38, z: 2.72 },
    build(g, m, s) {
      const add = mk(g);
      add(B(1.96, 0.7, 5.4), m.paint, 0, 0.15, 0);
      add(B(1.86, 0.8, 1.9), m.paint, 0, 0.9, 0.45);                   // cab
      add(B(1.88, 0.46, 1.7), m.glass, 0, 0.96, 0.45);
      add(B(1.76, 0.6, 0.08), m.glass, 0, 0.9, 1.43, -0.38);
      add(B(1.5, 0.08, 1.2), m.paint, 0, 0.53, 2.05);
      // cargo bed
      for (const sx of [-1, 1]) add(B(0.08, 0.42, 2.25), m.paint, sx * 0.94, 0.7, -1.6);
      add(B(1.96, 0.42, 0.08), m.paint, 0, 0.7, -2.7);
      add(B(1.8, 0.04, 2.2), m.dark, 0, 0.5, -1.6);
      add(C(0.38, 0.24, 18), m.dark, 0, 0.75, -1.6, Math.PI / 2);      // spare in the bed
      // roll bar with light bar
      for (const sx of [-1, 1]) add(B(0.08, 0.7, 0.08), m.dark, sx * 0.85, 1.05, -0.6);
      add(B(1.78, 0.08, 0.08), m.dark, 0, 1.4, -0.6);
      for (let k = -2; k <= 2; k++) add(B(0.22, 0.12, 0.06), m.lamp, k * 0.3, 1.5, -0.56);
      add(B(2.0, 0.26, 0.28), m.dark, 0, -0.05, 2.72);
      for (const x of [-0.5, 0.5]) add(B(0.08, 0.5, 0.08), m.dark, x, 0.25, 2.85);
      add(B(1.1, 0.08, 0.08), m.dark, 0, 0.5, 2.85);
      for (const x of [-0.72, 0.72]) add(B(0.3, 0.16, 0.05), m.lamp, x, 0.38, 2.7);
      for (const x of [-0.92, 0.92]) add(B(0.1, 0.3, 0.04), m.tail, x, 0.6, -2.74);
      flares(add, m, s, 0.45, 1.2);
    },
  },
  {
    id: 'rally', name: 'Apex R4', klass: 'Rally car', defaultPaint: 0x2c5d8f,
    desc: 'Featherweight turbo rally hatch. Explosive acceleration and sharp turn-in; low ground clearance hates deep mud.',
    mass: 1250, com: [0, -0.3, 0.1],
    chassis: { hx: 0.9, hy: 0.35, hz: 2.05, y: 0.05 }, cabin: { hx: 0.78, hy: 0.3, hz: 1.0, y: 0.62, z: -0.3 },
    wheel: { x: 0.9, y: -0.15, zf: 1.3, zr: -1.25, r: 0.36, w: 0.3 },
    susp: { rest: 0.3, travel: 0.22, stiffness: 42, compression: 3.2, relaxation: 3.8 },
    engine: 4400, topSpeed: 48, reverse: 10, grip: { ground: 1.15, sand: 0.9, mud: 0.78 }, side: 1.2, drag: { sand: 1.15, mud: 1.55 },
    steerLow: 0.65, steerHigh: 0.32, assist: 4, lamp: { x: 0.62, y: 0.2, z: 2.08 },
    build(g, m, s) {
      const add = mk(g);
      add(B(1.8, 0.55, 4.1), m.paint, 0, 0.05, 0);
      add(B(1.56, 0.55, 2.0), m.paint, 0, 0.6, -0.35);
      add(B(1.58, 0.36, 1.8), m.glass, 0, 0.64, -0.3);
      add(B(1.5, 0.5, 0.06), m.glass, 0, 0.6, 0.75, -0.75);
      add(B(1.58, 0.4, 0.06), m.glass, 0, 0.6, -1.35, 0.6);
      add(B(1.6, 0.06, 1.3), m.paint, 0, 0.36, 1.35, 0.08);            // sloped bonnet
      add(B(0.4, 0.1, 0.5), m.dark, 0, 0.92, -0.1);                     // roof scoop
      // livery stripes (no text / logos)
      add(B(1.82, 0.12, 4.12), m.accent, 0, 0.12, 0);
      add(B(0.3, 0.02, 2.0), m.accent, 0, 0.885, -0.35);
      for (const sx of [-1, 1]) add(C(0.24, 0.02, 20), m.accent, sx * 0.905, 0.15, -0.1, 0, 0, Math.PI / 2); // door roundels
      // rear wing
      for (const x of [-0.6, 0.6]) add(B(0.06, 0.25, 0.1), m.dark, x, 0.98, -1.75);
      add(B(1.7, 0.05, 0.38), m.dark, 0, 1.12, -1.78, -0.1);
      add(B(1.86, 0.18, 0.2), m.dark, 0, -0.18, 2.05);
      add(B(1.86, 0.18, 0.2), m.dark, 0, -0.18, -2.05);
      for (const x of [-0.62, 0.62]) add(B(0.3, 0.12, 0.04), m.lamp, x, 0.2, 2.06);
      for (const x of [-0.3, 0.3]) add(C(0.11, 0.08, 14), m.lamp, x, 0.05, 2.12, Math.PI / 2); // spot pods
      for (const x of [-0.78, 0.78]) add(B(0.18, 0.1, 0.04), m.tail, x, 0.25, -2.06);
      for (const sx of [-1, 1]) add(B(0.3, 0.3, 0.02), m.dark, sx * 0.8, -0.2, s.wheel.zr - 0.45); // mud flaps
      flares(add, m, s, 0.28, 1.0);
    },
  },
  {
    id: 'recovery', name: 'Atlas Recovery', klass: 'Recovery truck', defaultPaint: 0xe07a1f,
    desc: 'Cab-over 4×4 recovery rig with a hydraulic boom and front winch. Massive torque and tyres, slow and heavy.',
    mass: 4300, com: [0, -0.5, 0.4],
    chassis: { hx: 1.15, hy: 0.55, hz: 3.5, y: 0.3 }, cabin: { hx: 1.12, hy: 0.7, hz: 0.9, y: 1.45, z: 2.45 },
    wheel: { x: 1.1, y: -0.12, zf: 2.4, zr: -2.0, r: 0.55, w: 0.42 },
    susp: { rest: 0.44, travel: 0.34, stiffness: 30, compression: 2.8, relaxation: 3.4 },
    engine: 8200, topSpeed: 29, reverse: 7, grip: { ground: 0.72, sand: 1.05, mud: 1.25 }, side: 0.95, drag: { sand: 0.9, mud: 0.75 },
    steerLow: 0.48, steerHigh: 0.2, assist: 1.6, lamp: { x: 0.85, y: 0.65, z: 3.4 },
    build(g, m, s) {
      const add = mk(g);
      add(B(1.4, 0.35, 7.0), m.dark, 0, 0.1, 0);                       // chassis rails
      add(B(2.3, 1.6, 1.85), m.paint, 0, 1.35, 2.45);                   // cab-over cab
      add(B(2.32, 0.65, 1.6), m.glass, 0, 1.75, 2.5);
      add(B(2.1, 0.7, 0.06), m.glass, 0, 1.72, 3.38);
      add(B(2.35, 0.3, 0.3), m.dark, 0, 0.3, 3.45);                     // bumper
      add(C(0.16, 1.1, 14), m.chrome, 0, 0.36, 3.62, 0, 0, Math.PI / 2); // winch drum
      add(B(0.1, 0.1, 0.25), m.chrome, 0, 0.36, 3.8);                   // winch hook
      for (const x of [-0.85, 0.85]) add(B(0.36, 0.2, 0.05), m.lamp, x, 0.65, 3.39);
      for (const x of [-0.75, 0.75]) add(C(0.1, 0.16, 10), m.amber, x, 2.25, 2.6);  // roof beacons
      add(B(1.4, 0.06, 0.5), m.dark, 0, 2.18, 2.6);
      // flatbed + toolboxes
      add(B(2.3, 0.14, 4.4), m.dark, 0, 0.6, -1.35);
      for (const sx of [-1, 1]) add(B(0.5, 0.45, 1.3), m.paint, sx * 0.9, 0.95, 0.85);
      // hydraulic boom crane
      add(C(0.35, 0.4, 16), m.paint, 0, 0.9, -2.9);
      const boom = add(B(0.26, 0.26, 3.6), m.accent, 0, 2.0, -1.6, -0.62);
      boom.position.set(0, 1.95, -1.55);
      add(B(0.18, 1.5, 0.18), m.paint, 0, 1.5, -2.6, 0.35);             // ram
      add(C(0.02, 1.4, 6), m.dark, 0, 2.55, -0.08);                     // cable
      add(B(0.16, 0.2, 0.1), m.chrome, 0, 1.8, -0.08);                  // hook
      for (const x of [-1.0, 1.0]) add(B(0.12, 0.3, 0.04), m.tail, x, 0.4, -3.52);
      add(B(2.3, 0.08, 0.08), m.amber, 0, 0.75, -3.52);
      flares(add, m, s, 0.35, 1.45);
    },
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
