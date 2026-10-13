import * as THREE from 'three';
import { Kit, type P2 } from './kit';
import type { VehicleSpec } from './vehicles';

/* Procedural vehicle bodies. Each model follows the proportions and signature design cues of a well-known
 * off-roader class, but is built from scratch here: no manufacturer names, logos, badges or emblems,
 * and no copied meshes. Units are metres in vehicle space: +z forward, +y up, +x = vehicle left. */

const arch = (s: VehicleSpec, yc: number, pad = 0.09) => [
  { z: s.wheel.zf, y: yc, r: s.wheel.r + pad }, { z: s.wheel.zr, y: yc, r: s.wheel.r + pad },
];

/** Chassis rails, floor pan, tank, exhaust and skid plate (seen from low camera angles / in the air). */
function underbody(k: Kit, s: VehicleSpec, y: number, z0: number, z1: number, exhaustX = -0.45) {
  const { steel, dark, chrome } = k.m, L = z1 - z0, zc = (z0 + z1) / 2;
  for (const sx of [1, -1]) k.add(k.box(0.12, 0.16, L * 0.96), steel, sx * 0.48, y, zc);
  for (const z of [z0 + 0.3, zc, z1 - 0.3]) k.add(k.box(0.96, 0.1, 0.1), steel, 0, y, z, 0, 0, 0, 1);
  k.add(k.box(1.3, 0.03, L * 0.8), dark, 0, y + 0.1, zc);
  k.add(k.box(0.6, 0.26, 0.7, 0.05), steel, 0.25, y - 0.02, zc - L * 0.18, 0, 0, 0, 1);       // fuel tank
  k.add(k.box(0.9, 0.04, 0.8), steel, 0, y - 0.1, s.wheel.zf + 0.05, 0, 0, 0, 1);            // skid plate
  k.add(k.cylZ(0.035, L * 0.75, 8), steel, exhaustX, y - 0.04, zc - L * 0.08, 0, 0, 0, 1);  // exhaust pipe
  k.add(k.cylZ(0.09, 0.5, 12), steel, exhaustX, y - 0.04, zc - L * 0.05, 0, 0, 0, 1);       // silencer
  k.add(k.cylZ(0.045, 0.1, 10), chrome, exhaustX, y - 0.04, z0 + 0.02);                     // tailpipe tip
}
const towHooks = (k: Kit, x: number, y: number, z: number) => {
  for (const sx of [1, -1]) k.add(new THREE.TorusGeometry(0.05, 0.016, 6, k.lod ? 12 : 6), k.m.steel, sx * x, y, z, 0, Math.PI / 2, 0, 1);
};
/** Spare wheel (tyre + steel disc) mounted on a rear face, axis along z. */
function spare(k: Kit, r: number, w: number, x: number, y: number, z: number) {
  const t = k.tyre(r, w); t.rotateY(Math.PI / 2); k.add(t, k.m.rubber, x, y, z);
  k.add(k.cylZ(r * 0.6, w * 0.6, 16), k.m.alloy, x, y, z - 0.03);
  k.add(k.cylZ(r * 0.2, w * 0.7, 10), k.m.steel, x, y, z - 0.06, 0, 0, 0, 1);
}
/** Roof rack: perimeter rails + slats. */
function rack(k: Kit, w: number, y: number, z0: number, z1: number, slats = 6) {
  const { dark } = k.m, L = z1 - z0;
  for (const sx of [1, -1]) k.add(k.box(0.05, 0.06, L), dark, sx * w / 2, y, (z0 + z1) / 2);
  for (const z of [z0, z1]) k.add(k.box(w, 0.06, 0.05), dark, 0, y, z);
  for (let i = 1; i < slats; i++) k.add(k.box(w, 0.025, 0.05), dark, 0, y - 0.01, z0 + (L * i) / slats, 0, 0, 0, 1);
  for (const sx of [1, -1]) for (const z of [z0 + 0.1, z1 - 0.1]) k.add(k.box(0.05, 0.1, 0.05), dark, sx * w / 2, y - 0.07, z, 0, 0, 0, 1);
}
/** Front grille made of horizontal slats inside a frame (facing +z). */
function slatGrille(k: Kit, w: number, h: number, y: number, z: number, n: number, frame: THREE.Material, slat: THREE.Material, back = k.m.dark) {
  k.add(k.box(w + 0.08, h + 0.08, 0.05, 0.03), frame, 0, y, z);
  k.add(k.box(w, h, 0.02), back, 0, y, z + 0.02);
  for (let i = 0; i < n; i++) k.add(k.box(w * 0.98, (h / n) * 0.42, 0.04, 0.01), slat, 0, y - h / 2 + (h / n) * (i + 0.5), z + 0.035, 0, 0, 0, i % 2 && n > 4 ? 1 : 0);
}

// ---------------------------------------------------------------- Frontier Scout
// Design cues of the classic short-wheelbase utility 4x4: upright slab-sided body, flat clamshell bonnet and
// flat wing tops, near-vertical windscreen, contrast roof with small alpine windows, round headlamps in a
// black grille panel, exposed door hinges, side-hinged rear door carrying the spare, low corner tail lamps.
export function buildScout(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, chrome, lamp, tail, amber, accent } = k.m;
  const yc = -0.53, W = 1.84, Wu = 1.72;
  k.add(k.profile([[-1.98, -0.3], [-1.98, 0.5], [1.96, 0.5], [2.02, 0.44], [2.02, -0.26]], -0.3, arch(s, yc, 0.1), W, 0.035), paint);
  // upper body (slight tumblehome), contrast roof
  k.add(k.profile([[-1.95, 0.5], [-1.95, 1.08], [0.66, 1.08], [0.82, 0.5]], 0.5, [], Wu, 0.03), paint);
  k.add(k.box(Wu + 0.04, 0.07, 2.66, 0.03), accent, 0, 1.12, -0.64);
  // glazing: windscreen, door glass, side glass, alpine strips, rear door glass
  k.span([0.798, 0.58], [0.677, 1.02], 1.5, glass);
  k.add(k.box(1.62, 0.05, 0.05), dark, 0, 0.545, 0.82);                         // screen base/bulkhead vent
  const xs = Wu / 2 + 0.004;
  k.sidePoly([[0.1, 0.62], [0.74, 0.62], [0.66, 0.98], [0.1, 0.98]], xs, glass);
  k.sidePoly([[-1.82, 0.62], [-0.08, 0.62], [-0.08, 0.98], [-1.82, 0.98]], xs, glass);
  k.add(k.box(Wu + 0.012, 0.06, 0.8), glass, 0, 1.04, -0.95, 0, 0, 0, 1);       // alpine windows (roof edge)
  k.add(new THREE.PlaneGeometry(0.62, 0.36), glass, -0.22, 0.8, -1.985, 0, Math.PI, 0);
  // shut lines, hinges, handles
  const xl = W / 2 + 0.002;
  k.line([0.8, -0.26], [0.8, 0.5], xl); k.line([-0.02, -0.26], [-0.02, 0.5], xl); k.line([-0.02, 0.5], [-0.02, 0.98], xs);
  for (const y of [0.05, 0.38]) k.sym(() => k.box(0.03, 0.08, 0.12), dark, xl + 0.01, y, 0.74, 0, 0, 0, 1);
  k.sym(() => k.box(0.03, 0.03, 0.14), chrome, xl + 0.01, 0.32, 0.05, 0, 0, 0, 1);
  // bonnet (raised clamshell) + wing-top plates
  k.add(k.box(1.3, 0.05, 1.12, 0.02), paint, 0, 0.535, 1.42);
  k.sym(() => k.box(0.24, 0.012, 0.9), steel, 0.75, 0.52, 1.45, 0, 0, 0, 1);
  // front: black grille panel with round lamps, side/indicator lamps
  k.add(k.box(1.84, 0.46, 0.05, 0.02), dark, 0, 0.2, 2.04);
  slatGrille(k, 0.86, 0.34, 0.22, 2.05, 6, dark, steel);
  k.lampRound(0.66, 0.26, 2.075, 0.105, lamp);
  k.lampRound(0.66, 0.03, 2.07, 0.04, amber); k.lampRound(0.82, 0.03, 2.07, 0.035, lamp);
  // bumper, tow eyes, A-bar
  k.add(k.box(1.96, 0.2, 0.18, 0.02), steel, 0, -0.2, 2.13);
  towHooks(k, 0.42, -0.2, 2.24);
  // sill steps, mudflaps, flares (flat-topped utility eyebrows)
  k.sym(() => k.box(0.08, 0.06, 0.62), steel, W / 2 - 0.02, -0.34, 0.38, 0, 0, 0, 1);
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.1, W / 2 + 0.06, 0.12, 0.07);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.1, W / 2 + 0.06, 0.12, 0.07);
  k.sym(() => k.box(0.3, 0.32, 0.015), dark, 0.78, -0.48, s.wheel.zr - 0.62, 0, 0, 0, 1);
  // rear: offset side-hinged door with spare, low corner lamps, crossmember
  k.line([-1.985, -0.25], [-1.985, 1.0], 0.52);
  spare(k, 0.38, 0.24, -0.2, 0.28, -2.12);
  k.lampRect(0.8, 0.02, -1.99, 0.1, 0.22, tail, -1);
  k.add(k.box(1.9, 0.18, 0.16, 0.02), steel, 0, -0.22, -2.06);
  k.mirrors(xs, 0.72, 0.68);
  k.add(k.box(0.07, 0.07, 0.07), dark, 0.8, 1.1, 0.7, 0, 0, 0, 1); // aerial base
  rack(k, 1.6, 1.24, -1.85, 0.5);
  underbody(k, s, -0.36, -1.9, 1.9);
}

// ---------------------------------------------------------------- Voyager Expedition
// Cues of the long-running utility wagon line: long slab-sided wagon, slightly raked screen, flat bonnet with
// a centre power bulge, wide horizontal grille with rectangular lamps, big black flares, asymmetric barn
// doors at the rear. Expedition kit: roof tent, bull bar with winch, snorkel, ladder, rear spare.
export function buildVoyager(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, chrome, lamp, tail, amber, accent } = k.m;
  const yc = -0.6, W = 1.9, Wu = 1.78;
  k.add(k.profile([[-2.4, -0.32], [-2.42, 0.58], [1.0, 0.62], [2.28, 0.54], [2.4, 0.44], [2.42, -0.28]], -0.32, arch(s, yc, 0.1), W, 0.045), paint);
  k.add(k.profile([[-2.38, 0.58], [-2.38, 1.2], [-2.3, 1.26], [0.45, 1.26], [0.58, 1.2], [1.0, 0.62]], 0.58, [], Wu, 0.04), paint);
  k.span([0.957, 0.68], [0.616, 1.15], 1.58, glass);
  const xs = Wu / 2 + 0.004, xl = W / 2 + 0.002;
  k.sidePoly([[0.16, 0.7], [0.88, 0.7], [0.6, 1.14], [0.16, 1.14]], xs, glass);
  k.sidePoly([[-0.86, 0.7], [0.02, 0.7], [0.02, 1.14], [-0.86, 1.14]], xs, glass);
  k.sidePoly([[-2.25, 0.7], [-1.0, 0.7], [-1.0, 1.14], [-2.25, 1.14]], xs, glass);
  for (const z of [0.94, 0.09, -0.93]) k.line([z, -0.28], [z, 0.58], xl);
  k.line([0.09, 0.6], [0.09, 1.15], xs);
  k.sym(() => k.box(0.03, 0.03, 0.15), chrome, xl + 0.01, 0.42, 0.0, 0, 0, 0, 1);
  k.sym(() => k.box(0.03, 0.03, 0.15), chrome, xl + 0.01, 0.42, -1.0, 0, 0, 0, 1);
  // bonnet with power bulge + scoop
  k.add(k.box(0.78, 0.07, 1.0, 0.03), paint, 0, 0.63, 1.62, -0.06, 0, 0);
  k.add(k.box(0.44, 0.05, 0.08), dark, 0, 0.66, 2.1, 0, 0, 0, 1);
  // front: wide slat grille, rectangular lamps + indicators
  slatGrille(k, 1.0, 0.3, 0.3, 2.43, 5, chrome, chrome);
  k.lampRect(0.72, 0.31, 2.43, 0.3, 0.17, lamp);
  k.lampRect(0.72, 0.13, 2.43, 0.22, 0.06, amber);
  // bull bar + winch
  k.add(k.box(2.04, 0.3, 0.26, 0.04), steel, 0, -0.06, 2.5);
  k.add(k.cylX(0.12, 0.78, 14), chrome, 0, -0.02, 2.66, 0, 0, 0, 1);
  for (const sx of [1, -1]) k.add(k.cyl(0.035, 0.035, 0.62, 10), steel, sx * 0.42, 0.34, 2.56, 0.15, 0, 0);
  k.add(k.cylX(0.035, 0.9, 10), steel, 0, 0.62, 2.6);
  for (const sx of [1, -1]) k.add(k.cylX(0.035, 0.5, 10), steel, sx * 0.72, 0.42, 2.58, 0, 0, sx * 0.5);
  towHooks(k, 0.7, -0.05, 2.64);
  // flares, sill steps, mudflaps
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.1, W / 2 + 0.07, 0.16, 0.12);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.1, W / 2 + 0.07, 0.16, 0.12);
  k.sym(() => k.box(0.22, 0.05, 1.6), steel, W / 2 + 0.05, -0.36, -0.0);
  k.sym(() => k.box(0.32, 0.34, 0.015), dark, 0.8, -0.5, s.wheel.zr - 0.64, 0, 0, 0, 1);
  // snorkel up the right A-pillar
  k.add(k.cyl(0.055, 0.055, 0.85, 10), dark, -(W / 2 + 0.06), 0.85, 0.95);
  k.add(k.box(0.14, 0.12, 0.22, 0.03), dark, -(W / 2 + 0.06), 1.33, 0.98);
  // rear: asymmetric barn doors, spare, ladder, bumper lamps
  k.line([-2.425, -0.3], [-2.425, 1.18], 0.18);
  for (const x of [0.52, -0.42]) k.add(new THREE.PlaneGeometry(x > 0 ? 0.5 : 0.78, 0.42), glass, x, 0.9, -2.425, 0, Math.PI, 0);
  spare(k, 0.39, 0.25, 0.5, 0.22, -2.56);
  for (const sx of [1, -1]) k.add(k.box(0.04, 1.1, 0.04), steel, -0.25 + sx * 0.2, 0.75, -2.48, 0, 0, 0, 1);
  for (let i = 0; i < 5; i++) k.add(k.cylX(0.015, 0.4, 6), steel, -0.25, 0.3 + i * 0.22, -2.48, 0, 0, 0, 1);
  k.add(k.box(1.98, 0.22, 0.2, 0.03), steel, 0, -0.18, -2.5);
  k.lampRect(0.86, 0.32, -2.43, 0.12, 0.3, tail, -1);
  // roof tent on a rack
  rack(k, 1.66, 1.33, -2.2, 0.35, 7);
  k.add(k.box(1.5, 0.28, 1.9, 0.08), accent, 0, 1.52, -0.75);
  k.add(k.box(1.52, 0.05, 1.92, 0.02), dark, 0, 1.38, -0.75, 0, 0, 0, 1);
  k.mirrors(xs, 0.8, 0.82);
  underbody(k, s, -0.4, -2.3, 2.3);
}

// ---------------------------------------------------------------- Sahara GT
// Cues of the big full-size luxury desert SUV: tall, rounded-square body with heavy radii, high beltline,
// large chrome-framed grille with thick horizontal bars, swept headlamps with a light strip, body-colour
// arch blisters, chrome side mouldings and roof rails, wraparound tail lamps, chrome running boards.
export function buildSahara(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, chrome, lamp, tail, amber } = k.m;
  const yc = -0.6, W = 2.0, Wu = 1.84;
  k.add(k.profile([[-2.48, -0.3], [-2.55, 0.3], [-2.5, 0.68], [0.95, 0.74], [2.15, 0.64], [2.48, 0.5], [2.56, 0.05], [2.5, -0.3]], -0.3, arch(s, yc, 0.09), W, 0.12), paint);
  k.add(k.profile([[-2.42, 0.66], [-2.28, 1.27], [-2.12, 1.34], [0.22, 1.36], [0.45, 1.31], [1.05, 0.72]], 0.66, [], Wu, 0.1), paint);
  k.span([0.989, 0.78], [0.511, 1.25], 1.62, glass);
  k.span([-2.402, 0.74], [-2.291, 1.22], 1.5, glass, -1);
  const xs = Wu / 2 + 0.006, xl = W / 2 + 0.004;
  k.sidePoly([[0.12, 0.8], [0.9, 0.8], [0.45, 1.24], [0.12, 1.24]], xs, glass);
  k.sidePoly([[-0.95, 0.8], [0.0, 0.8], [0.0, 1.24], [-0.85, 1.24]], xs, glass);
  k.sidePoly([[-2.25, 0.8], [-1.1, 0.8], [-1.1, 1.24], [-2.15, 1.24]], xs, glass);
  k.line([0.06, 0.78], [0.06, 1.25], xs); k.line([-1.02, 0.78], [-1.02, 1.25], xs);
  for (const z of [1.0, 0.06, -1.02]) k.line([z, -0.24], [z, 0.7], xl);
  k.sym(() => k.box(0.012, 0.025, 3.3), chrome, xs + 0.004, 0.78, -0.6, 0, 0, 0, 1);  // window-line chrome
  k.sym(() => k.box(0.02, 0.05, 3.3), chrome, xl + 0.01, 0.0, -0.05);                   // door moulding
  for (const z of [0.35, -0.65]) k.sym(() => k.box(0.03, 0.04, 0.17), chrome, xl + 0.01, 0.5, z, 0, 0, 0, 1);
  // body-colour arch blisters
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.09, W / 2 + 0.03, 0.12, 0.1, 0.1, Math.PI - 0.1, paint);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.09, W / 2 + 0.03, 0.12, 0.1, 0.1, Math.PI - 0.1, paint);
  // bonnet power domes
  k.sym(() => k.box(0.32, 0.05, 1.2, 0.025), paint, 0.36, 0.73, 1.58, -0.08, 0, 0, 1);
  // front: big chrome grille with three heavy bars, swept lamps + light strip, fogs, skid plate
  k.add(k.box(1.3, 0.56, 0.08, 0.07), chrome, 0, 0.26, 2.53);
  k.add(k.box(1.18, 0.46, 0.04), dark, 0, 0.26, 2.56);
  for (let i = 0; i < 3; i++) k.add(k.box(1.16, 0.06, 0.05, 0.02), chrome, 0, 0.1 + i * 0.16, 2.58);
  for (const sx of [1, -1]) {
    k.add(k.box(0.44, 0.17, 0.12, 0.05), dark, sx * 0.76, 0.42, 2.45, 0, sx * 0.25, 0);
    k.add(k.box(0.36, 0.11, 0.05, 0.04), lamp, sx * 0.76, 0.44, 2.5, 0, sx * 0.25, 0);
    k.add(k.box(0.38, 0.025, 0.04), lamp, sx * 0.78, 0.34, 2.49, 0, sx * 0.25, 0, 1);
    k.add(k.box(0.1, 0.03, 0.04), amber, sx * 0.95, 0.42, 2.38, 0, sx * 0.6, 0, 1);
  }
  k.lampRound(0.74, -0.06, 2.53, 0.05, lamp);
  k.add(k.box(1.1, 0.07, 0.12, 0.02), chrome, 0, -0.22, 2.5);                       // skid plate
  k.add(k.box(1.6, 0.12, 0.05), dark, 0, -0.08, 2.54);                              // lower intake
  // running boards, roof rails
  k.sym(() => k.box(0.2, 0.05, 1.9, 0.02), chrome, W / 2 + 0.06, -0.36, -0.03);
  for (const sx of [1, -1]) {
    k.add(k.box(0.05, 0.05, 2.5, 0.02), chrome, sx * 0.78, 1.42, -0.95);
    for (const z of [-2.1, 0.2]) k.add(k.box(0.06, 0.08, 0.12, 0.02), dark, sx * 0.78, 1.38, z, 0, 0, 0, 1);
  }
  // rear: wraparound lamps, bumper, chrome strip
  for (const sx of [1, -1]) {
    k.add(k.box(0.36, 0.17, 0.06, 0.04), tail, sx * 0.8, 0.56, -2.51);
    k.add(k.box(0.06, 0.17, 0.3, 0.03), tail, sx * 0.97, 0.56, -2.38);
  }
  k.add(k.box(1.0, 0.05, 0.04), chrome, 0, 0.58, -2.53, 0, 0, 0, 1);
  k.add(k.box(2.02, 0.2, 0.2, 0.06), dark, 0, -0.2, -2.5);
  k.mirrors(xs, 0.88, 0.85);
  // roof light bar (desert spec)
  k.add(k.box(1.3, 0.11, 0.14, 0.03), dark, 0, 1.44, 0.15, 0, 0, 0, 1);
  for (let i = -2; i <= 2; i++) k.add(k.box(0.2, 0.07, 0.03), lamp, i * 0.25, 1.44, 0.23, 0, 0, 0, 1);
  void steel;
  underbody(k, s, -0.36, -2.4, 2.4);
}

// ---------------------------------------------------------------- Workhorse Trail
// Cues of the popular mid-size double-cab pickup: long bonnet sloping to a tall trapezoid grille, slim swept
// headlamps, raked screen, four doors, separate load bed with tailgate and vertical tail lamps, sports bar,
// black arch flares, chrome step bumper.
export function buildPickup(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, chrome, lamp, tail, amber } = k.m;
  const yc = -0.58, W = 1.9, Wu = 1.76;
  k.add(k.profile([[-2.7, -0.3], [-2.72, 0.24], [-0.82, 0.24], [-0.82, 0.62], [1.28, 0.62], [2.38, 0.52], [2.68, 0.42], [2.72, 0.0], [2.68, -0.3]], -0.3, arch(s, yc, 0.1), W, 0.045), paint);
  k.add(k.profile([[-0.82, 0.6], [-0.78, 1.3], [-0.68, 1.36], [0.55, 1.36], [0.7, 1.3], [1.3, 0.64]], 0.6, [], Wu, 0.04), paint);
  // load bed: sides, tailgate, liner, rails
  for (const sx of [1, -1]) k.add(k.box(0.07, 0.42, 1.9, 0.02), paint, sx * (W / 2 - 0.035), 0.44, -1.76);
  k.add(k.box(W - 0.02, 0.42, 0.07, 0.02), paint, 0, 0.44, -2.69);
  k.add(k.box(W - 0.16, 0.03, 1.86), dark, 0, 0.255, -1.76);
  k.add(k.box(W - 0.16, 0.36, 0.03), dark, 0, 0.42, -0.84, 0, 0, 0, 1);
  for (const sx of [1, -1]) k.add(k.cylZ(0.022, 1.8, 8), chrome, sx * (W / 2 - 0.04), 0.7, -1.76, 0, 0, 0, 1);
  k.add(k.box(0.5, 0.03, 0.04), dark, 0, 0.55, -2.73, 0, 0, 0, 1);                    // tailgate handle
  k.span([1.245, 0.7], [0.745, 1.25], 1.56, glass);
  k.add(new THREE.PlaneGeometry(1.3, 0.38), glass, 0, 1.1, -0.825, 0, Math.PI, 0);
  const xs = Wu / 2 + 0.004, xl = W / 2 + 0.002;
  k.sidePoly([[0.1, 0.72], [1.15, 0.72], [0.68, 1.27], [0.1, 1.27]], xs, glass);
  k.sidePoly([[-0.7, 0.72], [-0.02, 0.72], [-0.02, 1.27], [-0.62, 1.27]], xs, glass);
  for (const z of [1.2, 0.04, -0.78]) k.line([z, -0.26], [z, 0.62], xl);
  k.line([0.04, 0.62], [0.04, 1.28], xs);
  for (const z of [0.3, -0.5]) k.sym(() => k.box(0.03, 0.03, 0.15), chrome, xl + 0.01, 0.45, z, 0, 0, 0, 1);
  k.sym(() => k.box(0.012, 0.03, 2.1), dark, xl + 0.006, 0.22, 0.2, 0, 0, 0, 1);       // body crease
  // bonnet + front end
  k.add(k.box(0.9, 0.04, 1.0, 0.02), paint, 0, 0.6, 1.85, -0.09, 0, 0, 1);
  k.add(k.box(1.08, 0.46, 0.06, 0.05), chrome, 0, 0.18, 2.7);
  k.add(k.box(0.98, 0.38, 0.04), dark, 0, 0.18, 2.72);
  for (let i = 0; i < 4; i++) k.add(k.box(0.94, 0.03, 0.04), steel, 0, 0.04 + i * 0.1, 2.74, 0, 0, 0, 1);
  for (const sx of [1, -1]) {
    k.add(k.box(0.42, 0.13, 0.12, 0.04), dark, sx * 0.72, 0.38, 2.6, 0, sx * 0.3, 0);
    k.add(k.box(0.34, 0.08, 0.05, 0.03), lamp, sx * 0.72, 0.39, 2.65, 0, sx * 0.3, 0);
    k.add(k.box(0.12, 0.03, 0.04), amber, sx * 0.88, 0.32, 2.56, 0, sx * 0.5, 0, 1);
  }
  k.add(k.box(1.96, 0.24, 0.16, 0.05), dark, 0, -0.16, 2.7);
  k.lampRound(0.72, -0.15, 2.79, 0.045, lamp);
  k.add(k.box(1.0, 0.05, 0.4), steel, 0, -0.3, 2.62, 0.2, 0, 0, 1);
  towHooks(k, 0.5, -0.24, 2.8);
  // sports bar
  for (const sx of [1, -1]) k.add(k.cyl(0.035, 0.035, 0.6, 10), steel, sx * 0.82, 0.92, -0.98, -0.25, 0, 0);
  k.add(k.cylX(0.035, 1.66, 10), steel, 0, 1.2, -1.05);
  for (const sx of [1, -1]) k.add(k.cylZ(0.03, 0.7, 8), steel, sx * 0.82, 0.86, -1.3, 0.9, 0, 0, 1);
  // flares, steps, rear
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.1, W / 2 + 0.06, 0.14, 0.1);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.1, W / 2 + 0.06, 0.14, 0.1);
  k.sym(() => k.box(0.16, 0.04, 1.7, 0.015), steel, W / 2 + 0.03, -0.35, 0.22);
  k.lampRect(0.88, 0.42, -2.73, 0.1, 0.3, tail, -1);
  k.add(k.box(1.96, 0.16, 0.22, 0.04), chrome, 0, -0.22, -2.76);
  const sp = k.tyre(0.38, 0.24); sp.rotateZ(Math.PI / 2); k.add(sp, k.m.rubber, 0, -0.18, -2.15);   // spare under the bed
  k.mirrors(xs, 0.86, 1.08);
  underbody(k, s, -0.36, -2.6, 2.6);
}

// ---------------------------------------------------------------- Apex R4
// Cues of a modern world-rally hatchback: short, wide and low, steep screen, big bolt-on box arches, deep
// front splitter and large intakes, roof scoop, tall rear wing at roof level, diffuser, mud flaps, stage
// light pod, livery bands (no text or sponsor marks).
export function buildRally(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, accent } = k.m;
  const yc = -0.36, W = 1.82, Wu = 1.5;
  k.add(k.profile([[-1.98, -0.2], [-2.04, 0.22], [-1.95, 0.42], [0.82, 0.46], [1.85, 0.3], [2.06, 0.14], [2.06, -0.18]], -0.2, arch(s, yc, 0.08), W, 0.07), paint);
  k.add(k.profile([[-1.95, 0.42], [-1.52, 0.92], [-1.34, 1.0], [0.02, 1.02], [0.26, 0.97], [0.88, 0.46]], 0.42, [], Wu, 0.07), paint);
  k.span([0.807, 0.52], [0.321, 0.92], 1.32, glass);
  k.span([-1.898, 0.48], [-1.554, 0.88], 1.24, glass, -1);
  const xs = Wu / 2 + 0.004, xl = W / 2 + 0.002;
  k.sidePoly([[-0.05, 0.52], [0.72, 0.52], [0.28, 0.93], [-0.05, 0.93]], xs - 0.03, glass);
  k.sidePoly([[-1.2, 0.52], [-0.15, 0.52], [-0.15, 0.94], [-1.15, 0.94]], xs - 0.03, glass);
  k.line([0.84, -0.14], [0.84, 0.46], xl); k.line([-0.1, -0.14], [-0.1, 0.46], xl); k.line([-1.2, -0.14], [-1.2, 0.44], xl);
  // bolt-on box arches (body colour)
  for (const z of [s.wheel.zf, s.wheel.zr]) k.flare(z, yc, s.wheel.r + 0.08, W / 2 + 0.1, 0.22, 0.12, 0.0, Math.PI, paint);
  k.sym(() => k.box(0.1, 0.08, 1.45, 0.03), dark, W / 2 + 0.04, -0.2, 0.02);       // side skirt
  // livery: band along the flanks + roof stripe + door roundels (no numbers or marks)
  k.sym(() => k.box(0.01, 0.09, 3.0), accent, xl + 0.006, 0.18, 0.05);
  k.add(k.box(0.34, 0.012, 1.4), accent, 0, 1.03, -0.65);
  k.sym(() => k.cylX(0.19, 0.012, 22), accent, xl + 0.008, 0.12, 0.35);
  // bonnet vents, roof scoop, wing
  for (const sx of [1, -1]) k.add(k.box(0.3, 0.02, 0.24), dark, sx * 0.4, 0.42, 1.25, 0.1, 0, 0, 1);
  k.add(k.box(0.36, 0.1, 0.42, 0.04), dark, 0, 1.06, -0.05);
  for (const sx of [1, -1]) k.add(k.box(0.04, 0.24, 0.3, 0.01), dark, sx * 0.62, 1.06, -1.62);
  k.add(k.box(1.72, 0.04, 0.42, 0.015), dark, 0, 1.19, -1.68, -0.12, 0, 0);
  for (const sx of [1, -1]) k.add(k.box(0.02, 0.2, 0.46), dark, sx * 0.87, 1.17, -1.7);
  // front: splitter, big intakes, slim lamps, light pod
  k.add(k.box(1.9, 0.04, 0.24), dark, 0, -0.2, 2.06);
  k.add(k.box(1.3, 0.22, 0.04), dark, 0, -0.04, 2.08);
  for (const sx of [1, -1]) k.add(k.box(0.32, 0.18, 0.04), dark, sx * 0.72, -0.06, 2.07, 0, 0, 0, 1);
  k.add(k.box(0.7, 0.12, 0.04), dark, 0, 0.17, 2.08);
  for (const sx of [1, -1]) {
    k.add(k.box(0.36, 0.1, 0.1, 0.03), dark, sx * 0.62, 0.22, 2.0, 0, sx * 0.3, 0);
    k.add(k.box(0.3, 0.06, 0.05, 0.02), lamp, sx * 0.62, 0.225, 2.04, 0, sx * 0.3, 0);
  }
  k.add(k.box(1.2, 0.16, 0.08, 0.04), dark, 0, 0.42, 1.98);
  for (let i = 0; i < 4; i++) k.add(k.cylZ(0.06, 0.04, 14), lamp, -0.45 + i * 0.3, 0.42, 2.03);
  // rear: diffuser, lamps, big exhaust, flaps
  k.add(k.box(1.6, 0.08, 0.3), dark, 0, -0.18, -2.0);
  for (let i = -3; i <= 3; i++) k.add(k.box(0.015, 0.1, 0.28), dark, i * 0.2, -0.16, -2.02, 0, 0, 0, 1);
  k.lampRect(0.68, 0.32, -2.0, 0.24, 0.09, tail, -1);
  k.add(k.cylZ(0.065, 0.2, 14), steel, -0.5, -0.12, -2.05);
  for (const z of [s.wheel.zf - 0.5, s.wheel.zr - 0.5]) k.sym(() => k.box(0.3, 0.26, 0.015), accent, 0.8, -0.34, z, 0, 0, 0);
  k.mirrors(xs - 0.03, 0.58, 0.62);
  underbody(k, s, -0.26, -1.9, 1.9, -0.5);
}

// ---------------------------------------------------------------- Atlas Recovery
// Cues of a cab-over 4x4 recovery truck: flat-fronted tilt cab over the front axle, big split windscreen,
// slatted grille, sun visor, beacon bar, tall mirrors, exhaust stack, side fuel tank, wrecker body with
// tool lockers, hydraulic boom with ram/cable/hook, rear under-lift, front winch.
export function buildRecovery(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, chrome, lamp, tail, amber, accent } = k.m;
  const W = 2.3, yc = -0.45;
  // ladder chassis
  for (const sx of [1, -1]) k.add(k.box(0.16, 0.28, 7.0), steel, sx * 0.5, 0.05, 0);
  for (let i = 0; i < 6; i++) k.add(k.box(1.0, 0.12, 0.1), steel, 0, 0.05, -3.2 + i * 1.3, 0, 0, 0, 1);
  // cab
  k.add(k.profile([[1.55, 0.42], [1.55, 2.08], [1.66, 2.18], [3.2, 2.18], [3.33, 2.05], [3.46, 1.2], [3.46, 0.42]], 0.42, [], W, 0.08), paint);
  k.span([3.448, 1.28], [3.341, 1.98], 2.1, glass);
  k.add(k.box(0.06, 0.76, 0.05), dark, 0, 1.63, 3.42, -0.18, 0, 0, 1);              // centre pillar
  k.add(k.box(2.2, 0.06, 0.32), dark, 0, 2.08, 3.45, 0.15, 0, 0);                   // sun visor
  const xs = W / 2 + 0.004;
  k.sidePoly([[2.5, 1.26], [3.38, 1.26], [3.3, 1.98], [2.5, 1.98]], xs, glass);
  k.sidePoly([[1.75, 1.4], [2.3, 1.4], [2.3, 1.98], [1.75, 1.98]], xs, glass);
  k.line([2.42, 0.5], [2.42, 2.0], xs); k.line([3.38, 0.5], [3.38, 1.2], xs);
  k.sym(() => k.box(0.03, 0.03, 0.18), chrome, xs + 0.01, 1.1, 2.6, 0, 0, 0, 1);
  for (const y of [0.25, -0.05]) k.sym(() => k.box(0.24, 0.04, 0.5), steel, W / 2 - 0.06, y, 2.95);   // cab steps
  slatGrille(k, 1.5, 0.5, 0.82, 3.47, 6, dark, steel);
  k.add(k.box(2.36, 0.34, 0.32, 0.04), steel, 0, 0.3, 3.5);
  k.lampRect(0.86, 0.32, 3.66, 0.34, 0.16, lamp);
  k.lampRect(0.86, 0.6, 3.48, 0.14, 0.08, amber);
  k.add(k.cylX(0.16, 1.0, 14), chrome, 0, 0.34, 3.7, 0, 0, 0, 1);                    // front winch
  k.add(k.box(0.1, 0.12, 0.22), chrome, 0, 0.34, 3.86);
  // beacon bar, mirrors, exhaust stack, horn
  k.add(k.box(1.6, 0.08, 0.32, 0.03), dark, 0, 2.24, 2.75);
  for (const sx of [1, -1]) k.add(k.cyl(0.1, 0.11, 0.16, 12), amber, sx * 0.62, 2.35, 2.75);
  k.add(k.box(0.7, 0.1, 0.12, 0.03), amber, 0, 2.32, 2.75);
  k.mirrors(xs, 1.55, 3.2, true);
  k.add(k.cyl(0.07, 0.07, 1.9, 12), chrome, -0.95, 1.4, 1.42);
  k.add(k.cyl(0.11, 0.11, 0.5, 12), steel, -0.95, 0.75, 1.42, 0, 0, 0, 1);
  // front mudguards over the cab-mounted axle
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.12, W / 2 - 0.02, 0.5, 0.06, 0.2, Math.PI - 0.15);
  // side fuel tank + battery box
  k.sym(() => k.cylZ(0.24, 0.9, 16), k.m.alloy, 0.82, 0.05, 1.0);
  k.add(k.box(0.36, 0.4, 0.6, 0.03), steel, -0.84, 0.1, 1.0, 0, 0, 0, 1);
  // wrecker body: deck, lockers, headboard
  k.add(k.box(2.3, 0.14, 4.4, 0.03), steel, 0, 0.52, -1.35);
  for (const sx of [1, -1]) {
    k.add(k.box(0.55, 0.62, 1.6, 0.04), paint, sx * 0.88, 0.95, 0.55);
    k.add(k.box(0.012, 0.5, 0.012), dark, sx * 1.16, 0.95, 0.55, 0, 0, 0, 1);
    for (const z of [0.2, 0.9]) k.add(k.box(0.02, 0.04, 0.14), chrome, sx * 1.165, 1.05, z, 0, 0, 0, 1);
    k.add(k.box(0.12, 0.05, 4.2), dark, sx * 1.14, 0.52, -1.4, 0, 0, 0, 1);
  }
  k.add(k.box(2.3, 1.0, 0.1, 0.03), dark, 0, 1.08, 1.45);
  for (let i = 0; i < 5; i++) k.add(k.box(2.1, 0.04, 0.02), steel, 0, 0.7 + i * 0.18, 1.39, 0, 0, 0, 1);
  // hydraulic boom crane: turret, boom, ram, cable, hook
  k.add(k.cyl(0.42, 0.46, 0.36, 18), paint, 0, 0.78, -2.85);
  k.add(k.box(0.5, 0.5, 0.5, 0.05), steel, 0, 1.15, -2.85);
  k.add(k.box(0.3, 0.3, 3.7, 0.04), accent, 0, 2.15, -1.55, -0.6, 0, 0);
  k.add(k.box(0.22, 0.22, 1.4, 0.03), accent, 0, 3.0, -0.25, -0.6, 0, 0);
  k.add(k.cyl(0.09, 0.09, 1.3, 12), steel, 0, 1.55, -2.35, 0.32, 0, 0);
  k.add(k.cyl(0.045, 0.045, 1.0, 10), chrome, 0, 1.95, -2.1, 0.32, 0, 0);
  k.add(k.cylX(0.12, 0.34, 14), steel, 0, 3.38, 0.32, 0, 0, 0, 1);
  k.add(k.cyl(0.012, 0.012, 2.1, 6), dark, 0, 2.3, 0.38);
  k.add(new THREE.TorusGeometry(0.09, 0.025, 6, k.lod ? 14 : 6, Math.PI * 1.4), chrome, 0, 1.2, 0.38, 0, 0, Math.PI * 0.8);
  k.add(k.box(0.12, 0.14, 0.1), steel, 0, 1.3, 0.38);
  // rear under-lift + lamps + outriggers
  k.add(k.box(0.2, 0.18, 1.0), steel, 0, -0.08, -3.75);
  k.add(k.box(1.8, 0.14, 0.14, 0.03), steel, 0, -0.08, -4.25);
  for (const sx of [1, -1]) k.add(k.box(0.12, 0.3, 0.3), dark, sx * 0.8, -0.08, -4.25, 0, 0, 0, 1);
  for (const sx of [1, -1]) k.add(k.box(0.14, 0.7, 0.14), steel, sx * 1.0, 0.15, -3.0, 0, 0, 0, 1);
  k.add(k.box(2.3, 0.1, 0.1), amber, 0, 0.75, -3.55);
  k.lampRect(1.0, 0.42, -3.56, 0.14, 0.28, tail, -1);
  // rear mudguards
  k.sym(() => k.box(0.5, 0.05, 1.3, 0.02), dark, W / 2 - 0.25, 0.25, s.wheel.zr);
  k.sym(() => k.box(0.5, 0.4, 0.015), dark, W / 2 - 0.25, -0.05, s.wheel.zr - 0.68, 0, 0, 0, 1);
  void glass; void steel;
}


// ---------------------------------------------------------------- 0.7.2 additions (original designs, no logos/badges/insignia, no weapons)
const camoMats = new Map<string, THREE.MeshStandardMaterial>();
function camoMat(hex: number) {
  const key = hex.toString(16); let m = camoMats.get(key);
  if (!m) { m = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.85, metalness: 0.05 }); m.name = 'camo'; m.userData.envK = 0.4; camoMats.set(key, m); }
  return m;
}
/** Painted camouflage blotches on both body sides + top (flat matte patches just proud of the panels). Deterministic pattern. */
function camo(k: Kit, x: number, z0: number, z1: number, y0: number, y1: number, cols: number[], n = 14, roofY?: number, roofW = 1.4) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n; i++) {
    const z = z0 + (z1 - z0) * rnd(), y = y0 + (y1 - y0) * rnd(), w = 0.25 + rnd() * 0.45, h = 0.1 + rnd() * 0.18;
    const mat = camoMat(cols[i % cols.length]);
    k.sym(() => k.box(0.012, h, w), mat, x + 0.008, y, z, rnd() * 0.6 - 0.3, 0, 0, 1);
    if (roofY !== undefined && i % 2 === 0) k.add(k.box((0.2 + rnd() * 0.4) * roofW, 0.012, w), mat, (rnd() - 0.5) * roofW * 0.6, roofY + 0.008, z, 0, rnd(), 0, 1);
  }
}
function tyreAt(k: Kit, s: VehicleSpec, z: number, y: number) {
  // extra (non-driven, cosmetic) axle: tyre + hub on both sides
  for (const sx of [1, -1]) {
    const t = k.tyre(s.wheel.r, s.wheel.w); t.rotateY(sx > 0 ? 0 : Math.PI); k.add(t, k.m.rubber, sx * s.wheel.x, y, z);
    k.add(k.cylX(s.wheel.r * 0.55, s.wheel.w + 0.02, 14), k.m.alloy, sx * s.wheel.x, y, z);
  }
}

// Nomad 4x4 Van: tall boxy expedition van, short sloped nose, sliding side door, high roof with rack, ladder, rear spare.
export function buildVan(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, amber, accent } = k.m;
  const yc = -0.55, W = 1.98, Wu = 1.94;
  k.add(k.profile([[-2.62, -0.3], [-2.64, 0.55], [1.55, 0.55], [2.35, 0.45], [2.5, 0.3], [2.52, -0.28]], -0.3, arch(s, yc, 0.1), W, 0.05), paint);
  k.add(k.profile([[-2.62, 0.53], [-2.6, 1.78], [-2.5, 1.84], [1.1, 1.84], [1.25, 1.76], [1.6, 0.56]], 0.53, [], Wu, 0.06), paint);
  k.span([1.58, 0.62], [1.2, 1.6], 1.74, glass);
  const xs = Wu / 2 + 0.004, xl = W / 2 + 0.002;
  k.sidePoly([[0.62, 0.82], [1.42, 0.82], [1.2, 1.55], [0.62, 1.55]], xs, glass);
  k.sidePoly([[-0.9, 0.95], [0.4, 0.95], [0.4, 1.55], [-0.9, 1.55]], xs, glass);
  k.sidePoly([[-2.45, 0.95], [-1.2, 0.95], [-1.2, 1.55], [-2.45, 1.55]], xs, glass);
  for (const z of [1.5, 0.52, -1.05]) k.line([z, -0.26], [z, 1.6], xl);
  k.sym(() => k.box(0.02, 0.025, 1.6), steel, xl + 0.01, 1.62, -0.25, 0, 0, 0, 1);      // sliding-door track
  k.sym(() => k.box(0.012, 0.18, 4.9), accent, xl + 0.006, 0.18, -0.05, 0, 0, 0, 1);     // two-tone stripe
  // nose: short bonnet, black grille, rect lamps, steel bumper with skid plate
  k.add(k.box(1.7, 0.05, 0.85, 0.02), paint, 0, 0.5, 2.0, -0.18, 0, 0);
  k.add(k.box(1.3, 0.3, 0.05, 0.03), dark, 0, 0.18, 2.52);
  for (let i = 0; i < 3; i++) k.add(k.box(1.2, 0.03, 0.03), steel, 0, 0.08 + i * 0.1, 2.55, 0, 0, 0, 1);
  k.lampRect(0.72, 0.24, 2.52, 0.3, 0.14, lamp);
  k.lampRect(0.9, 0.08, 2.5, 0.12, 0.06, amber);
  k.add(k.box(2.04, 0.24, 0.24, 0.04), steel, 0, -0.18, 2.58);
  towHooks(k, 0.55, -0.2, 2.7);
  for (const sx of [1, -1]) k.lampRound(sx * 0.35, 1.92, 1.0, 0.08, lamp);                 // roof light bar pods
  // flares, side steps, mudflaps
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.1, W / 2 + 0.07, 0.16, 0.12);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.1, W / 2 + 0.07, 0.16, 0.12);
  k.sym(() => k.box(0.2, 0.05, 1.3), steel, W / 2 + 0.05, -0.36, 0.0);
  k.sym(() => k.box(0.34, 0.36, 0.015), dark, 0.82, -0.5, s.wheel.zr - 0.64, 0, 0, 0, 1);
  // rear: twin doors, ladder, spare, tail lamps
  k.line([-2.645, -0.28], [-2.645, 1.75], 0.0);
  for (const sx of [1, -1]) k.add(new THREE.PlaneGeometry(0.62, 0.45), glass, sx * 0.45, 1.3, -2.645, 0, Math.PI, 0);
  spare(k, 0.42, 0.26, 0.45, 0.4, -2.8);
  for (const sx of [1, -1]) k.add(k.box(0.04, 1.5, 0.04), steel, -0.45 + sx * 0.2, 1.0, -2.7, 0, 0, 0, 1);
  for (let i = 0; i < 6; i++) k.add(k.cylX(0.015, 0.4, 6), steel, -0.45, 0.4 + i * 0.25, -2.7, 0, 0, 0, 1);
  k.lampRect(0.88, 0.45, -2.645, 0.12, 0.36, tail, -1);
  k.add(k.box(2.0, 0.2, 0.2, 0.03), steel, 0, -0.2, -2.7);
  rack(k, 1.8, 1.9, -2.4, 0.8, 8);
  k.add(k.box(0.9, 0.06, 0.7), dark, 0, 1.96, -1.6);                                        // roof box / solar panel
  k.mirrors(xs, 1.05, 1.35, true);
  underbody(k, s, -0.38, -2.5, 2.4);
}

// Ranger LTV: light tactical 4x4 (open-top utility), flat panels, fold-down screen, roll cage, jerry cans. Olive drab + camo.
export function buildLtv(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, amber } = k.m;
  const yc = -0.5, W = 1.9;
  k.add(k.profile([[-2.05, -0.28], [-2.05, 0.42], [-0.9, 0.42], [-0.9, 0.5], [1.05, 0.5], [2.1, 0.42], [2.15, -0.22]], -0.28, arch(s, yc, 0.12), W, 0.02), paint);
  k.add(k.box(W - 0.2, 0.04, 2.0), dark, 0, 0.18, -0.95);                                   // floor tub
  for (const sx of [1, -1]) k.add(k.box(0.12, 0.3, 2.9), paint, sx * (W / 2 - 0.06), 0.62, -0.55, 0, 0, 0, 1); // tub sides
  // fold-down windscreen frame
  k.add(k.box(1.7, 0.05, 0.05), steel, 0, 0.55, 1.0); k.add(k.box(1.7, 0.05, 0.05), steel, 0, 1.22, 0.9);
  for (const sx of [1, -1]) k.add(k.box(0.05, 0.7, 0.05), steel, sx * 0.84, 0.88, 0.95, -0.15, 0, 0);
  k.add(new THREE.PlaneGeometry(1.62, 0.62), glass, 0, 0.88, 0.95, -0.15, 0, 0);
  // roll cage
  for (const z of [-0.35, -1.75]) {
    for (const sx of [1, -1]) k.add(k.cyl(0.04, 0.04, 0.9, 10), steel, sx * 0.84, 0.95, z);
    k.add(k.cylX(0.04, 1.72, 10), steel, 0, 1.4, z);
  }
  for (const sx of [1, -1]) k.add(k.cylZ(0.04, 1.4, 10), steel, sx * 0.84, 1.4, -1.05);
  // bonnet with louvres, flat grille with vertical slots, round lamps, brush guard
  k.add(k.box(1.6, 0.04, 1.05, 0.01), paint, 0, 0.53, 1.58);
  for (let i = 0; i < 5; i++) k.add(k.box(0.5, 0.012, 0.04), dark, 0, 0.555, 1.3 + i * 0.12, 0, 0, 0, 1);
  k.add(k.box(1.5, 0.42, 0.04), dark, 0, 0.22, 2.12);
  for (let i = -4; i <= 4; i++) k.add(k.box(0.04, 0.32, 0.02), steel, i * 0.12, 0.22, 2.14, 0, 0, 0, 1);
  k.lampRound(0.65, 0.3, 2.15, 0.09, lamp); k.lampRound(0.65, 0.1, 2.15, 0.035, amber);
  k.add(k.box(1.9, 0.14, 0.14), steel, 0, -0.15, 2.2);
  for (const sx of [1, -1]) k.add(k.cyl(0.03, 0.03, 0.55, 8), steel, sx * 0.5, 0.15, 2.26);
  k.add(k.cylX(0.03, 1.1, 8), steel, 0, 0.42, 2.26);
  towHooks(k, 0.45, -0.15, 2.3);
  // seats, spare + jerry cans, tail lamps
  for (const sx of [1, -1]) { k.add(k.box(0.5, 0.12, 0.5), dark, sx * 0.42, 0.35, -0.2); k.add(k.box(0.5, 0.55, 0.1), dark, sx * 0.42, 0.62, -0.5, -0.15, 0, 0); }
  spare(k, 0.42, 0.28, 0.3, 0.55, -2.2);
  for (const sx of [-0.35, -0.75]) k.add(k.box(0.16, 0.42, 0.3, 0.02), paint, sx, 0.5, -2.2);
  k.lampRect(0.8, 0.28, -2.06, 0.1, 0.12, tail, -1);
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.12, W / 2 + 0.05, 0.12, 0.1, 0.05, Math.PI - 0.05, paint);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.12, W / 2 + 0.05, 0.12, 0.1, 0.05, Math.PI - 0.05, paint);
  k.add(k.cyl(0.05, 0.05, 1.0, 10), dark, -(W / 2 + 0.05), 0.7, 0.9);                         // snorkel
  camo(k, W / 2, -2.0, 2.0, -0.15, 0.4, [0x3d4a2a, 0x5b5a3a, 0x2a2a22], 16, 0.53, 1.5);
  k.mirrors(W / 2 + 0.02, 0.85, 0.98);
  underbody(k, s, -0.34, -1.9, 2.0);
}

// Bastion APT: armored patrol truck, faceted armor panels, small thick windows, roof hatch ring (no weapon), run-flat tyres. Sand camo.
export function buildPatrol(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, amber } = k.m;
  const yc = -0.55, W = 2.08, Wu = 1.9;
  k.add(k.profile([[-2.8, -0.3], [-2.8, 0.7], [1.3, 0.7], [2.4, 0.55], [2.62, 0.3], [2.62, -0.25]], -0.3, arch(s, yc, 0.12), W, 0.03), paint);
  k.add(k.profile([[-2.78, 0.68], [-2.7, 1.62], [0.75, 1.62], [1.25, 0.72]], 0.68, [], Wu, 0.03), paint);
  k.span([1.22, 0.86], [0.85, 1.45], 1.3, glass);                                             // narrow thick windscreen
  k.add(k.box(1.5, 0.08, 0.1), dark, 0, 0.8, 1.27, -0.6, 0, 0, 1);
  const xs = Wu / 2 + 0.006, xl = W / 2 + 0.002;
  for (const z of [0.4, -0.6, -1.6]) k.sidePoly([[z - 0.32, 1.05], [z + 0.32, 1.05], [z + 0.32, 1.38], [z - 0.32, 1.38]], xs, glass);
  for (const z of [1.25, -0.1, -1.1]) k.line([z, -0.26], [z, 1.55], xl, 0.02);
  // bolted armor plates + rivets
  for (const z of [0.9, -0.2, -1.3, -2.3]) k.sym(() => k.box(0.03, 0.55, 0.9, 0.01), steel, xl + 0.015, 0.2, z, 0, 0, 0, 1);
  // front: armored grille louvres, recessed lamps behind guards, push bar
  k.add(k.box(1.8, 0.05, 1.1, 0.02), paint, 0, 0.62, 1.95, -0.14, 0, 0);
  k.add(k.box(1.6, 0.5, 0.06), dark, 0, 0.2, 2.63);
  for (let i = 0; i < 6; i++) k.add(k.box(1.5, 0.03, 0.05), steel, 0, 0.0 + i * 0.08, 2.66, 0.4, 0, 0, 1);
  k.lampRect(0.82, 0.3, 2.64, 0.18, 0.12, lamp);
  for (const sx of [1, -1]) for (let i = 0; i < 3; i++) k.add(k.box(0.02, 0.16, 0.02), steel, sx * 0.82 + (i - 1) * 0.06, 0.3, 2.7, 0, 0, 0, 1);
  k.lampRect(0.95, 0.12, 2.63, 0.08, 0.05, amber);
  k.add(k.box(2.1, 0.3, 0.3, 0.03), steel, 0, -0.15, 2.72);
  towHooks(k, 0.6, -0.15, 2.88);
  // roof: hatch ring (empty), antenna bases, stowage
  k.add(k.cyl(0.45, 0.45, 0.12, 20), steel, 0, 1.68, -0.8);
  k.add(k.cyl(0.38, 0.38, 0.14, 20), dark, 0, 1.69, -0.8);
  for (const sx of [1, -1]) { k.add(k.cyl(0.04, 0.05, 0.1, 8), dark, sx * 0.75, 1.67, -2.3); k.add(k.cyl(0.008, 0.008, 1.4, 4), dark, sx * 0.75, 2.4, -2.3, 0, 0, 0, 1); }
  rack(k, 1.7, 1.66, -2.6, -1.4, 5);
  // rear: heavy door with small window, steps, lamps
  k.add(new THREE.PlaneGeometry(0.4, 0.3), glass, 0.4, 1.2, -2.805, 0, Math.PI, 0);
  k.line([-2.805, -0.25], [-2.805, 1.5], 0.0, 0.02);
  k.lampRect(0.9, 0.5, -2.8, 0.12, 0.2, tail, -1);
  k.add(k.box(1.6, 0.06, 0.3), steel, 0, -0.3, -2.9);
  k.flare(s.wheel.zf, yc, s.wheel.r + 0.12, W / 2 + 0.03, 0.12, 0.14, 0.05, Math.PI - 0.05, paint);
  k.flare(s.wheel.zr, yc, s.wheel.r + 0.12, W / 2 + 0.03, 0.12, 0.14, 0.05, Math.PI - 0.05, paint);
  camo(k, xl + 0.03, -2.6, 2.4, -0.1, 1.5, [0xb39b6b, 0x8a7550, 0x6b5a3e], 22, 1.62, 1.6);
  k.mirrors(xs, 1.0, 1.15, true);
  underbody(k, s, -0.4, -2.6, 2.5);
}

// Mule 6x6 cargo truck: bonneted cab, canvas-covered cargo bed on hoops, three axles (rear tandem: the third axle is cosmetic). Olive drab.
export function buildCargo6(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, amber, accent } = k.m;
  const W = 2.2, Wc = 2.0;
  k.add(k.box(1.0, 0.25, 8.0), steel, 0, -0.05, -0.45);                                       // ladder frame
  // cab
  k.add(k.profile([[0.6, 0.1], [0.6, 1.95], [2.0, 1.95], [2.1, 1.85], [2.12, 1.0], [2.15, 0.1]], 0.1, [], Wc, 0.04), paint);
  k.add(new THREE.PlaneGeometry(1.7, 0.6), glass, 0, 1.5, 2.125, 0, 0, 0);
  for (const sx of [1, -1]) k.add(new THREE.PlaneGeometry(0.65, 0.55), glass, sx * (Wc / 2 + 0.005), 1.5, 1.55, 0, sx * Math.PI / 2, 0);
  k.sym(() => k.box(0.012, 0.03, 1.0), dark, Wc / 2 + 0.005, 0.9, 1.4, 0, 0, 0, 1);
  // bonnet + grille
  k.add(k.box(1.6, 0.9, 1.3, 0.05), paint, 0, 0.75, 2.8);
  k.add(k.box(1.4, 0.7, 0.05), dark, 0, 0.7, 3.46);
  for (let i = -5; i <= 5; i++) k.add(k.box(0.04, 0.6, 0.03), steel, i * 0.12, 0.7, 3.48, 0, 0, 0, 1);
  for (const sx of [1, -1]) { k.lampRound(sx * 0.95, 0.75, 3.3, 0.11, lamp); k.add(k.box(0.5, 0.06, 1.2), paint, sx * 1.0, 0.95, 2.8); k.add(k.box(0.5, 0.6, 0.05), paint, sx * 1.0, 0.65, 3.38); }
  k.lampRound(0.95, 0.5, 3.4, 0.04, amber);
  k.add(k.box(2.3, 0.25, 0.25, 0.03), steel, 0, 0.1, 3.55);
  towHooks(k, 0.7, 0.1, 3.7);
  // cargo bed + canvas tilt over hoops
  k.add(k.box(W, 0.15, 4.4), steel, 0, 0.35, -2.0);
  for (const sx of [1, -1]) k.add(k.box(0.06, 0.5, 4.4), paint, sx * (W / 2 - 0.03), 0.65, -2.0);
  k.add(k.box(W, 0.5, 0.06), paint, 0, 0.65, -4.2); k.add(k.box(W, 0.5, 0.06), paint, 0, 0.65, 0.2);
  const canvas = camoMat(0x5a5c3c);
  k.add(k.box(W + 0.02, 1.2, 4.4, 0.08), canvas, 0, 1.5, -2.0);
  for (let i = 0; i < 6; i++) k.add(k.box(W + 0.04, 0.03, 0.04), dark, 0, 2.11, -0.0 - i * 0.8, 0, 0, 0, 1);
  for (let i = 0; i < 8; i++) k.sym(() => k.box(0.03, 0.08, 0.03), dark, W / 2 + 0.02, 0.92, -0.1 - i * 0.55, 0, 0, 0, 1); // tie-down loops
  // fuel tank, spare, steps, tail lamps, mudguards over the tandem
  k.add(k.cylZ(0.25, 0.9, 14), steel, -0.85, 0.0, 0.9);
  k.add(k.box(0.3, 0.05, 0.4), steel, 0.95, -0.15, 1.2);
  spare(k, s.wheel.r, s.wheel.w, 0, 0.45, 0.45);
  k.lampRect(0.9, 0.3, -4.25, 0.14, 0.12, tail, -1);
  for (const z of [s.wheel.zr, s.wheel.zr - 1.4]) k.sym(() => k.box(0.5, 0.04, 1.3), dark, W / 2 - 0.15, s.wheel.y + s.wheel.r + 0.12, z, 0, 0, 0, 1);
  k.sym(() => k.box(0.5, 0.04, 1.2), paint, W / 2 - 0.1, s.wheel.y + s.wheel.r + 0.15, s.wheel.zf, 0, 0, 0, 1);
  tyreAt(k, s, s.wheel.zr - 1.4, s.wheel.y - s.susp.rest + 0.05);
  camo(k, Wc / 2 + 0.03, 0.7, 2.0, 0.2, 1.0, [0x3d4a2a, 0x2a2a22], 6);
  k.add(k.box(0.012, 0.012, 0.012), accent, 0, -10, 0, 0, 0, 0, 1);                          // keep material slot
  k.mirrors(Wc / 2 + 0.02, 1.6, 2.0, true);
}

// Warden MRAP: V-hull mine-resistant vehicle, tall armored capsule, raked side armor, very small windows, big tyres. Sand camo, no weapons.
export function buildMrap(k: Kit, s: VehicleSpec) {
  const { paint, dark, steel, glass, lamp, tail, amber } = k.m;
  const W = 2.3, Wu = 2.1;
  // V-hull belly
  for (const sx of [1, -1]) k.add(k.box(1.2, 0.08, 5.4), steel, sx * 0.5, -0.05, -0.2, 0, 0, sx * 0.5);
  // armored capsule (raked upper sides)
  k.add(k.profile([[-3.0, 0.2], [-3.0, 1.2], [1.6, 1.2], [2.9, 0.95], [3.0, 0.4], [3.0, 0.2]], 0.2, [], W, 0.04), paint);
  k.add(k.profile([[-2.98, 1.18], [-2.95, 2.25], [1.0, 2.25], [1.55, 1.2]], 1.18, [], Wu, 0.05), paint);
  k.span([1.5, 1.35], [1.1, 2.05], 1.5, glass);
  k.add(k.box(1.8, 0.12, 0.14), dark, 0, 1.3, 1.55, -0.9, 0, 0, 1);
  const xs = Wu / 2 + 0.006, xl = W / 2 + 0.004;
  for (const z of [0.6, -0.5, -1.6]) k.sidePoly([[z - 0.25, 1.6], [z + 0.25, 1.6], [z + 0.25, 1.95], [z - 0.25, 1.95]], xs, glass);
  for (const z of [1.1, -0.05, -1.05]) k.line([z, 0.25], [z, 2.15], xl, 0.025);
  for (const z of [0.6, -1.0, -2.4]) k.sym(() => k.box(0.04, 0.8, 1.3, 0.01), steel, xl + 0.02, 0.75, z, 0, 0, 0, 1); // add-on armor
  // front: angled bonnet, armored louvres, guarded lamps, heavy bumper
  k.add(k.box(2.0, 0.06, 1.4, 0.02), paint, 0, 1.08, 2.25, -0.2, 0, 0);
  k.add(k.box(1.9, 0.6, 0.06), dark, 0, 0.65, 3.0);
  for (let i = 0; i < 6; i++) k.add(k.box(1.8, 0.04, 0.06), steel, 0, 0.42 + i * 0.09, 3.03, 0.4, 0, 0, 1);
  k.lampRect(0.92, 0.82, 3.0, 0.22, 0.14, lamp);
  k.lampRect(0.92, 0.6, 3.0, 0.1, 0.06, amber);
  k.add(k.box(2.4, 0.35, 0.35, 0.03), steel, 0, 0.12, 3.12);
  towHooks(k, 0.75, 0.1, 3.3);
  // roof: hatch ring (empty), antennas, cargo basket; rear: heavy ramp door + steps
  k.add(k.cyl(0.5, 0.5, 0.14, 20), steel, 0, 2.32, -0.6);
  k.add(k.cyl(0.42, 0.42, 0.16, 20), dark, 0, 2.33, -0.6);
  for (const sx of [1, -1]) k.add(k.cyl(0.01, 0.01, 1.6, 4), dark, sx * 0.9, 3.05, -2.6, 0, 0, 0, 1);
  rack(k, 1.8, 2.28, -2.8, -1.6, 5);
  k.add(k.box(1.4, 1.6, 0.08), steel, 0, 1.15, -3.02);
  k.add(new THREE.PlaneGeometry(0.3, 0.25), glass, 0, 1.6, -3.07, 0, Math.PI, 0);
  k.lampRect(1.0, 1.0, -3.0, 0.12, 0.2, tail, -1);
  for (let i = 0; i < 3; i++) k.add(k.box(0.8, 0.04, 0.2), steel, 0, 0.1 - i * 0.2, -3.15, 0, 0, 0, 1);
  for (const z of [s.wheel.zf, s.wheel.zr]) k.sym(() => k.box(0.6, 0.06, 1.6), paint, W / 2 - 0.1, s.wheel.y + s.wheel.r + 0.18, z, 0, 0, 0, 1);
  camo(k, xl + 0.04, -2.9, 2.6, 0.4, 2.1, [0xb39b6b, 0x8a7550, 0x6b5a3e], 26, 2.25, 1.8);
  k.mirrors(xs, 1.6, 1.5, true);
}

export const BUILDERS: Record<string, (k: Kit, s: VehicleSpec) => void> = {
  scout: buildScout, voyager: buildVoyager, sahara: buildSahara, pickup: buildPickup, rally: buildRally, recovery: buildRecovery,
  van: buildVan, ltv: buildLtv, patrol: buildPatrol, cargo6: buildCargo6, mrap: buildMrap,
};
export type { P2 };
