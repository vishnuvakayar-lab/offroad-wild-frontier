import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';

export type Surface = 'ground' | 'mud' | 'sand' | 'rock';

export const MAP_SIZE = 320;
const SEG = 160;

/** Flat proving-ground strip used for top-speed runs. */
export const STRIP = { z: 100, half: 7, len: 104 };
export const onStrip = (x: number, z: number) => Math.abs(z - STRIP.z) < STRIP.half && Math.abs(x) < STRIP.len;

export const ZONES = {
  spawn: { x: 0, z: 0, r: 42 },
  mud: { x: -72, z: 40, r: 40 },
  sand: { x: 88, z: -55, r: 62, flat: 30 },
  /** rocky mountain (Phase 6b): cone with cliff bands, summit plateau of radius `top` */
  ridge: { x: -102, z: -102, r: 64, h: 34, top: 9 },
};
const RC = ZONES.ridge;
const TH0 = Math.atan2(-RC.z, -RC.x);            // direction from the summit towards spawn
const polar = (r: number, th: number) => ({ x: RC.x + Math.cos(TH0 + th) * r, z: RC.z + Math.sin(TH0 + th) * r });
/** smooth mountain profile by distance from the summit (no rock noise); steepest in the middle band */
function ridgeProfile(dr: number) {
  const t = Math.min(1, Math.max(0, (RC.r - dr) / (RC.r - RC.top)));
  return RC.h * (0.28 * t + 0.72 * sstep(0.12, 0.92, t));
}
/** foot blend weight of the mountain (0 outside, 1 on the slopes) */
const ridgeK = (dr: number) => 1 - sstep(RC.r - 12, RC.r + 4, dr);

/** Switchback climb trail: polar legs zig-zagging up the face, hairpin platforms at the turns.
 *  Points carry the bench height `h` (smooth profile), half-width `hw` and a rough-rock factor. */
export interface TrailPt { x: number; z: number; h: number; hw: number; rough: number; s: number }
const A = 0.95, HP_R = 5.6;                        // leg half-angle; hairpin turn radius
const HAIR_R = [58, 45, 32, 19];                     // hairpin centres (distance from the summit), alternating sides
const LEG_ROUGH = [0, 0.1, 0.35, 0.55, 0.3];         // loose-rock roughness per leg (upper legs are the rocky steps)
export const TRAIL: TrailPt[] = [];
export const HAIRPINS: { x: number; z: number; h: number }[] = [];
/** index of the middle point of every leg (climb checkpoints) */
export const LEG_MID: number[] = [];
{
  // polar helpers relative to the summit; side = +1/-1 for the hairpin's angle
  const side = (i: number) => (i % 2 === 0 ? 1 : -1);
  const pts: { x: number; z: number; h: number; hw: number; rough: number; leg: number }[] = [];
  const legLine = (r0: number, a0: number, r1: number, a1: number, h0: number, h1: number, rough: number, leg: number) => {
    const len = Math.abs(a1 - a0) * (r0 + r1) / 2 + Math.abs(r1 - r0), n = Math.max(4, Math.ceil(len / 2.5));
    const startIdx = pts.length;
    for (let k = pts.length ? 1 : 0; k <= n; k++) {
      const u = k / n, p = polar(r0 + (r1 - r0) * u, a0 + (a1 - a0) * u);
      pts.push({ ...p, h: h0 + (h1 - h0) * sstep(0, 1, u) * 0.15 + (h1 - h0) * u * 0.85, hw: 4.0, rough: rough * sstep(0, 0.2, Math.min(u, 1 - u)), leg });
    }
    LEG_MID.push(Math.floor((startIdx + pts.length - 1) / 2));
  };
  const hairpin = (R: number, a: number, sgn: number, h: number, leg: number) => {
    // semicircle around polar(R, a) from radius R+HP_R to R-HP_R, bulging further round in angle (level turning platform)
    const c = polar(R, a), radial = { x: Math.cos(TH0 + a), z: Math.sin(TH0 + a) }, tang = { x: -Math.sin(TH0 + a) * sgn, z: Math.cos(TH0 + a) * sgn };
    for (let k = 1; k <= 8; k++) {
      const ph = (k / 8) * Math.PI, rx = Math.cos(ph) * HP_R, tx = Math.sin(ph) * HP_R;
      pts.push({ x: c.x + radial.x * rx + tang.x * tx, z: c.z + radial.z * rx + tang.z * tx, h, hw: 5.8, rough: 0, leg });
    }
    HAIRPINS.push({ ...c, h });
  };
  const hNat = (r: number, th: number) => { const p = polar(r, th), hb = hillsRim(p.x, p.z), k = ridgeK(r); return Math.max(hb, hb * (1 - k) + ridgeProfile(r) * k); };
  // approach + legs + hairpins
  let r = 76, a = 0, h = hNat(76, 0);
  HAIR_R.forEach((R, i) => {
    const aa = A * side(i), hh = hNat(R, aa);
    legLine(r, a, R + HP_R, aa, h, hh, LEG_ROUGH[i], i);
    hairpin(R, aa, side(i), hh, i);
    r = R - HP_R; a = aa; h = hh;
  });
  legLine(r, a, 6, 0, h, RC.h, LEG_ROUGH[HAIR_R.length], HAIR_R.length);
  let sAcc = 0;
  pts.forEach((p, i) => { if (i) sAcc += Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z); TRAIL.push({ x: p.x, z: p.z, h: p.h, hw: p.hw, rough: p.rough, s: sAcc }); });
}
/** distance from the climb trail (used to keep trees/boulders off it) */
export function distToTrail(x: number, z: number) { return nearTrail(x, z).d; }
function segNear(x: number, z: number, i: number) {
  const a = TRAIL[i], b = TRAIL[i + 1], dx = b.x - a.x, dz = b.z - a.z;
  const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)));
  return { d: Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)), t };
}
/** nearest trail point: distance, bench height, half-width, roughness */
export function nearTrail(x: number, z: number) {
  let best = { d: Infinity, i: 0, t: 0 };
  if (Math.hypot(x - RC.x, z - RC.z) > RC.r + 30) return { d: Infinity, h: 0, hw: 0, rough: 0, s: 0 };
  for (let i = 0; i < TRAIL.length - 1; i++) {
    const a = TRAIL[i]; if (Math.abs(a.x - x) > best.d + 4 && Math.abs(a.z - z) > best.d + 4) continue;
    const r = segNear(x, z, i); if (r.d < best.d) best = { d: r.d, i, t: r.t };
  }
  const a = TRAIL[best.i], b = TRAIL[best.i + 1], t = best.t;
  return { d: best.d, h: a.h + (b.h - a.h) * t, hw: a.hw + (b.hw - a.hw) * t, rough: a.rough + (b.rough - a.rough) * t, s: a.s + (b.s - a.s) * t };
}
/** Mission routes that cross open terrain (trees are kept off a corridor around them). */
export const DASH_PTS: [number, number][] = [[30, -20], [48, -38], [58, -60], [70, -82], [92, -100], [116, -86], [130, -60], [126, -30], [110, -8], [88, 4], [64, -2], [46, 12], [26, 26]];
export const DELIVER_PTS: [number, number][] = [[-30, -20], [-50, 15], [-64, 58], [-96, 82], [-70, 120], [-30, 104], [20, 100], [75, 94], [115, 55], [122, 5], [100, -35], [70, -75], [42, -104]];
export const DELIVER_CAMP = { x: 18, z: -116 };
/** Bogged Down: the tow line from the stuck 4x4 to the safe zone must stay clear */
export const TOW_LINE: [number, number][] = [[-64, 46], [-22, 48], [-10, 40]];
const ROUTES: [number, number][][] = [DASH_PTS, [...DELIVER_PTS, [DELIVER_CAMP.x, DELIVER_CAMP.z]], TOW_LINE];
export function distToRoutes(x: number, z: number) {
  let d = Infinity;
  for (const R of ROUTES) for (let i = 0; i < R.length - 1; i++) {
    const [ax, az] = R[i], [bx, bz] = R[i + 1], dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    d = Math.min(d, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
  }
  return d;
}
/** start pose / summit of the climb */
export const RIDGE_TRAIL = { start: { x: TRAIL[0].x, z: TRAIL[0].z, yaw: Math.atan2(TRAIL[3].x - TRAIL[0].x, TRAIL[3].z - TRAIL[0].z) }, summit: { x: RC.x, z: RC.z } };

// ---------- deterministic value noise ----------
function hash(x: number, z: number): number {
  let h = (x * 374761393 + z * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h & 0xffff) / 0xffff;
}
function smooth(t: number) { return t * t * (3 - 2 * t); }
function vnoise(x: number, z: number): number {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  const u = smooth(xf), v = smooth(zf);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}
export function fbm(x: number, z: number, oct = 4): number {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, z * f); f *= 2; a *= 0.5; }
  return s; // ~0..1
}
function sstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
const dist = (x: number, z: number, c: { x: number; z: number }) => Math.hypot(x - c.x, z - c.z);

export function surfaceAt(x: number, z: number): Surface {
  // slightly wobbly zone borders so they look natural
  const wob = (fbm(x * 0.08, z * 0.08, 2) - 0.5) * 8;
  if (dist(x, z, RC) < RC.r - 6 + wob) return 'rock';
  if (dist(x, z, ZONES.mud) < ZONES.mud.r + wob) return 'mud';
  if (dist(x, z, ZONES.sand) < ZONES.sand.r + wob) return 'sand';
  return 'ground';
}

/** Deeper drivable puddles: a depression in the terrain filled with a water plane. */
export interface Puddle { x: number; z: number; r: number; depth: number; level: number; }
export const PUDDLES: Puddle[] = [
  [-70, 42, 5.5], [-58, 56, 4.2], [-50, 28, 3.6], [-82, 18, 4.2], [-66, 72, 3.4], [-92, 60, 3.8], [-44, 46, 3.2],
  [-20, -30, 4.2],
].map(([x, z, r]) => ({ x, z, r, depth: 0.5, level: 0 }));
for (const p of PUDDLES) p.level = baseHeight(p.x, p.z) - 0.12;

export function puddleAt(x: number, z: number): Puddle | null {
  for (const p of PUDDLES) if ((x - p.x) ** 2 + (z - p.z) ** 2 < p.r * p.r) return p;
  return null;
}

export function heightAt(x: number, z: number): number {
  let h = baseHeight(x, z);
  for (const p of PUDDLES) {
    const d = Math.hypot(x - p.x, z - p.z);
    if (d < p.r + 1.5) h -= p.depth * (1 - sstep(p.r * 0.45, p.r + 1.5, d));
  }
  return h;
}

function mountainHeight(x: number, z: number, dr: number, trailGap = Infinity) {
  const t = Math.min(1, Math.max(0, (RC.r - dr) / (RC.r - RC.top)));
  let m = ridgeProfile(dr);
  const th = Math.atan2(z - RC.z, x - RC.x);
  const mid = t * (1 - t) * 4;                                   // 0 at foot and summit, 1 mid-slope
  m += Math.sin(th * 5 + fbm(x * 0.03, z * 0.03, 2) * 4) * 3.4 * mid + Math.sin(th * 11 + fbm(x * 0.06, z * 0.06, 2) * 5) * 1.3 * mid; // radial spurs and gullies
  const ridged = 1 - Math.abs(2 * fbm(x * 0.07 + 3, z * 0.07 - 5, 4) - 1);
  m += (ridged - 0.55) * 5 * mid + (fbm(x * 0.45, z * 0.45, 2) - 0.5) * 1.1 * Math.min(1, t * 3); // rock lumps
  // cliff bands: partial terracing makes near-vertical rock faces with ledges
  const band = sstep(0.5, 0.68, fbm(x * 0.05 - 9, z * 0.05 + 4, 3)) * sstep(0.12, 0.3, t) * (1 - sstep(0.85, 0.97, t));
  const step = 2.6 + fbm(x * 0.02 + 5, z * 0.02, 2) * 2.4, q = m / step + (fbm(x * 0.08, z * 0.08, 2) - 0.5) * 1.2, fl = Math.floor(q);
  m = m * (1 - 0.7 * band) + (fl + sstep(0.62, 0.95, q - fl) - (q - m / step)) * step * 0.7 * band;
  // crags: sharp ridged outcrops on the upper slopes
  m += Math.max(0, ridged - 0.72) * 9 * sstep(0.35, 0.7, t) * (1 - sstep(0.9, 1, t)) * sstep(3, 9, trailGap); // never right beside the trail
  return m;
}
/** hills + rim only (the base the mountain blends into) */
function hillsRim(x: number, z: number) {
  let h = (fbm(x * 0.018 + 10, z * 0.018 - 7, 5) - 0.45) * 9;
  const edge = Math.max(Math.abs(x), Math.abs(z));
  return h + sstep(105, 158, edge) * (14 + fbm(x * 0.05, z * 0.05, 4) * 14);
}

function baseHeight(x: number, z: number): number {
  // rolling hills + rocky rim towards map edges
  let h = hillsRim(x, z);

  // rocky mountain: steep cone + radial spurs + ridged rock noise + cliff bands (terraces), then the trail bench
  const dr = dist(x, z, RC);
  if (dr < RC.r + 18) {
    const k = ridgeK(dr);
    const tr = nearTrail(x, z);
    if (k > 0) h = Math.max(h, h * (1 - k) + mountainHeight(x, z, dr, tr.d - tr.hw) * k);
    if (tr.d < tr.hw + 2.6) {
      const w = 1 - sstep(tr.hw, tr.hw + 2.6, tr.d);
      const bumps = tr.rough * ((fbm(x * 0.55, z * 0.55, 2) - 0.5) * 1.3 + (fbm(x * 1.7, z * 1.7, 1) - 0.5) * 0.35);
      // stone berm along the drop-off side (where the bench is built up above the natural slope)
      const fill = sstep(0.3, 1.5, tr.h - h);
      const berm = fill * 0.55 * Math.exp(-(((tr.d - tr.hw - 0.5) / 0.55) ** 2));
      h = h * (1 - w) + (tr.h + bumps) * w + berm;
    }
  }
  // spawn flat
  const ds = dist(x, z, ZONES.spawn);
  const ws = 1 - sstep(ZONES.spawn.r - 4, ZONES.spawn.r + 14, ds);
  h = h * (1 - ws) + (fbm(x * 0.2, z * 0.2, 2) - 0.5) * 0.15 * ws;

  // mud basin: slightly sunken, lumpy
  const dm = dist(x, z, ZONES.mud);
  const wm = 1 - sstep(ZONES.mud.r - 6, ZONES.mud.r + 14, dm);
  const mudH = -0.7 + (fbm(x * 0.25, z * 0.25, 3) - 0.5) * 0.35;
  h = h * (1 - wm) + mudH * wm;

  // sand: flat apron in the middle, dunes around it
  const dd = dist(x, z, ZONES.sand);
  const wd = 1 - sstep(ZONES.sand.r - 4, ZONES.sand.r + 16, dd);
  const duneAmt = sstep(ZONES.sand.flat, ZONES.sand.flat + 14, dd);
  const dunes = (Math.sin(x * 0.11 + Math.sin(z * 0.05) * 2.2) * 0.5 + 0.5) * 3.2 + fbm(x * 0.04, z * 0.04, 3) * 2.5;
  const sandH = 0.2 + dunes * duneAmt;
  h = h * (1 - wd) + sandH * wd;
  // proving-ground strip: long flat straight along z = STRIP.z
  const ws2 = (1 - sstep(STRIP.half - 1, STRIP.half + 9, Math.abs(z - STRIP.z))) * (1 - sstep(STRIP.len - 6, STRIP.len + 8, Math.abs(x)));
  h = h * (1 - ws2) + 0.3 * ws2;
  return h;
}

const C_GRASS = new THREE.Color(0x5f7a3a);
const C_DIRT = new THREE.Color(0x7a6448);
const C_MUD = new THREE.Color(0x3a2a1c);
const C_MUD_WET = new THREE.Color(0x2a1e14);
const C_SAND = new THREE.Color(0xd9b77a);
const C_SAND_D = new THREE.Color(0xc29a5c);
const C_ROCK = new THREE.Color(0x7c7770);
const C_STRIP = new THREE.Color(0x9a8a72);

export const TREES: { x: number; z: number }[] = [];
export const wetMaterials: THREE.MeshStandardMaterial[] = [];
export const waterMat = new THREE.MeshStandardMaterial({ color: 0x6a604e, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.8 });

/** Hi-res terrain patch over the mountain (1 m grid; the main grid is 2 m) so cliffs, ledges and the trail bench read clearly. */
export const PATCH = { x0: -160, x1: -30, z0: -160, z1: -30, step: 1 };
const inPatch = (x: number, z: number) => x > PATCH.x0 && x < PATCH.x1 && z > PATCH.z0 && z < PATCH.z1;
const C_CLIFF = new THREE.Color(0x3b3937), C_CLIFF2 = new THREE.Color(0x5e554b), C_SCREE = new THREE.Color(0x8b8a87), C_ROCKM = new THREE.Color(0x67645f);
const C_TRAIL = new THREE.Color(0xa09078), C_LICHEN = new THREE.Color(0x6f7a4a);
function colorAt(c: THREE.Color, x: number, z: number, ny: number) {
  const s = surfaceAt(x, z);
  const n = fbm(x * 0.15, z * 0.15, 3);
  const slope = 1 - ny;
  if (s === 'mud') c.copy(C_MUD).lerp(C_MUD_WET, n);
  else if (s === 'sand') c.copy(C_SAND).lerp(C_SAND_D, n * 0.8);
  else if (s === 'rock') {
    // slope-based rock: scree/gravel on gentle ground, grey rock on slopes, dark exposed faces on cliffs
    const fine = fbm(x * 0.9, z * 0.9, 2), strata = Math.sin(heightAt(x, z) * 2.1 + fine * 2) * 0.5 + 0.5;
    c.copy(C_SCREE).lerp(C_ROCKM, sstep(0.06, 0.25, slope) * 0.9 + fine * 0.2);
    c.multiplyScalar(0.86 + hash(Math.round(x * 3), Math.round(z * 3)) * 0.22); // speckle: loose stones and grit
    c.lerp(C_CLIFF, sstep(0.2, 0.45, slope)).lerp(C_CLIFF2, sstep(0.2, 0.5, slope) * strata * 0.5);
    if (slope < 0.12 && n > 0.55) c.lerp(C_LICHEN, (n - 0.55) * 1.6);   // lichen/grass tufts on ledges
    const tr = nearTrail(x, z);
    if (tr.d < tr.hw + 1) c.lerp(C_TRAIL, (1 - sstep(tr.hw - 1, tr.hw + 1, tr.d)) * (0.75 + fine * 0.25));
  } else {
    c.copy(C_GRASS).lerp(C_DIRT, Math.min(1, n * 0.9 + (dist(x, z, ZONES.spawn) < 30 ? 0.35 : 0)));
    if (onStrip(x, z)) c.copy(C_STRIP).lerp(C_DIRT, n * 0.5);
    if (slope > 0.12 || Math.max(Math.abs(x), Math.abs(z)) > 125) c.lerp(C_ROCK, Math.min(1, slope * 4 + 0.3));
    const tr = nearTrail(x, z); // dirt approach track to the trail head
    if (tr.d < tr.hw + 1) c.lerp(C_TRAIL, (1 - sstep(tr.hw - 1, tr.hw + 1, tr.d)) * 0.6);
  }
}
function gridGeo(w: number, d: number, sx: number, sz: number, cx: number, cz: number) {
  const g = new THREE.PlaneGeometry(w, d, sx, sz); g.rotateX(-Math.PI / 2); g.translate(cx, 0, cz); return g;
}

export function buildTerrain(scene: THREE.Scene, world: RAPIER_NS.World, RAPIER: typeof RAPIER_NS) {
  const geo = gridGeo(MAP_SIZE, MAP_SIZE, SEG, SEG, 0, 0);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    colorAt(c, pos.getX(i), pos.getZ(i), nrm.getY(i));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // cut the patch area out of the main grid
  {
    const ix = geo.index!.array as ArrayLike<number>, keep: number[] = [];
    for (let i = 0; i < ix.length; i += 3) {
      const a = ix[i], b = ix[i + 1], d = ix[i + 2];
      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(d)) / 3, cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(d)) / 3;
      if (!inPatch(cx, cz)) keep.push(a, b, d);
    }
    geo.setIndex(keep);
  }
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'terrain';
  scene.add(mesh);

  // hi-res mountain patch; border vertices on odd metres follow the coarse grid's straight edges (crack-free seam)
  const PW = PATCH.x1 - PATCH.x0, PD = PATCH.z1 - PATCH.z0;
  const pgeo = gridGeo(PW, PD, PW / PATCH.step, PD / PATCH.step, (PATCH.x0 + PATCH.x1) / 2, (PATCH.z0 + PATCH.z1) / 2);
  const ppos = pgeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < ppos.count; i++) {
    const x = ppos.getX(i), z = ppos.getZ(i);
    const onX = Math.abs(x - PATCH.x1) < 1e-6 || Math.abs(x - PATCH.x0) < 1e-6, onZ = Math.abs(z - PATCH.z1) < 1e-6 || Math.abs(z - PATCH.z0) < 1e-6;
    const odd = (v: number) => Math.abs(((Math.round(v) % 2) + 2) % 2 - 1) < 1e-6;
    let y = heightAt(x, z);
    if (onX && odd(z)) y = (heightAt(x, z - 1) + heightAt(x, z + 1)) / 2;
    else if (onZ && odd(x)) y = (heightAt(x - 1, z) + heightAt(x + 1, z)) / 2;
    ppos.setY(i, y);
  }
  pgeo.computeVertexNormals();
  const pn = pgeo.attributes.normal as THREE.BufferAttribute, pcol = new Float32Array(ppos.count * 3);
  for (let i = 0; i < ppos.count; i++) { colorAt(c, ppos.getX(i), ppos.getZ(i), pn.getY(i)); pcol[i * 3] = c.r; pcol[i * 3 + 1] = c.g; pcol[i * 3 + 2] = c.b; }
  pgeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
  // faceted (flat-shaded) rock look for the mountain patch
  const pmat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, flatShading: true });
  wetMaterials.push(pmat);
  const pmesh = new THREE.Mesh(pgeo, pmat);
  pmesh.receiveShadow = true; pmesh.name = 'terrain-mountain';
  scene.add(pmesh);

  // physics trimesh built from the exact same vertices
  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  for (const g of [geo, pgeo]) {
    const verts = new Float32Array((g.attributes.position as THREE.BufferAttribute).array as ArrayLike<number>);
    const idx = new Uint32Array(g.index!.array as ArrayLike<number>);
    world.createCollider(RAPIER.ColliderDesc.trimesh(verts, idx).setFriction(0.9), ground);
  }

  // boundary walls
  const half = MAP_SIZE / 2 - 4;
  const walls: [number, number, number, number][] = [
    [half, 0, 1, half], [-half, 0, 1, half], [0, half, half, 1], [0, -half, half, 1],
  ];
  for (const [x, z, hx, hz] of walls) {
    world.createCollider(RAPIER.ColliderDesc.cuboid(hx, 60, hz).setTranslation(x, 20, z), ground);
  }

  // water surfaces for the puddles
  const water = waterMat;
  for (const p of PUDDLES) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(p.r * 0.92, 28), water);
    m.rotation.x = -Math.PI / 2; m.position.set(p.x, p.level, p.z); m.receiveShadow = true; m.name = 'water';
    scene.add(m);
  }
  wetMaterials.push(mat);

  // proving-ground marker posts every 20 m (visual only)
  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 6);
  const postMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, emissive: 0x402000, roughness: 0.6 });
  const xs: number[] = []; for (let x = -100; x <= 100; x += 20) xs.push(x);
  const posts = new THREE.InstancedMesh(postGeo, postMat, xs.length * 2);
  const PM = new THREE.Matrix4(); let pi = 0;
  for (const x of xs) for (const sz of [-1, 1]) { const z = STRIP.z + sz * (STRIP.half + 0.8); PM.makeTranslation(x, heightAt(x, z) + 0.55, z); posts.setMatrixAt(pi++, PM); }
  posts.castShadow = true; scene.add(posts);
  scatterProps(scene, world, RAPIER, ground);
  return mesh;
}

/** Physics-only terrain for the multiplayer server: the same colliders buildTerrain creates (same order, same shapes),
 *  recorded once from a throwaway scene and replayed into each room's world. */
let RECORDED: RAPIER_NS.ColliderDesc[] | null = null;
export function buildTerrainColliders(world: RAPIER_NS.World, RAPIER: typeof RAPIER_NS) {
  if (!RECORDED) {
    const list: RAPIER_NS.ColliderDesc[] = [];
    const rec = { createRigidBody: () => ({}), createCollider: (d: RAPIER_NS.ColliderDesc) => { list.push(d); return {}; } } as unknown as RAPIER_NS.World;
    buildTerrain(new THREE.Scene(), rec, RAPIER);
    RECORDED = list;
  }
  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  for (const d of RECORDED) world.createCollider(d, ground);
  return RECORDED.length;
}

export function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scatterProps(scene: THREE.Scene, world: RAPIER_NS.World, RAPIER: typeof RAPIER_NS, ground: RAPIER_NS.RigidBody) {
  const rnd = mulberry(1234);
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 2.4, 6);
  const crownGeo = new THREE.ConeGeometry(1.6, 4.5, 7);
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 1 });
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x2f4a26, roughness: 0.9 });
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x86817a, roughness: 0.95, flatShading: true });
  const NT = 170, NR = 90;
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, NT);
  const crowns = new THREE.InstancedMesh(crownGeo, crownMat, NT);
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, NR);
  for (const m of [trunks, crowns, rocks]) { m.castShadow = true; m.receiveShadow = true; scene.add(m); }
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3();
  const ok = (x: number, z: number, margin: number) => Math.abs(z - STRIP.z) > STRIP.half + 14 && distToTrail(x, z) > 8 && distToRoutes(x, z) > 6 && dist(x, z, RC) > RC.r - 10 &&
    surfaceAt(x, z) === 'ground' && dist(x, z, ZONES.spawn) > ZONES.spawn.r + margin &&
    dist(x, z, ZONES.mud) > ZONES.mud.r + margin && dist(x, z, ZONES.sand) > ZONES.sand.r + margin;
  let t = 0, guard = 0;
  while (t < NT && guard++ < 5000) {
    const x = (rnd() - 0.5) * (MAP_SIZE - 30), z = (rnd() - 0.5) * (MAP_SIZE - 30);
    if (!ok(x, z, 6) || puddleAt(x, z)) continue;
    const y = heightAt(x, z), s = 0.8 + rnd() * 0.7;
    Q.setFromEuler(new THREE.Euler(0, rnd() * 6.28, 0));
    trunks.setMatrixAt(t, M.compose(P.set(x, y + 1.2 * s, z), Q, S.set(s, s, s)));
    crowns.setMatrixAt(t, M.compose(P.set(x, y + (2.4 + 2.0) * s, z), Q, S.set(s, s, s)));
    TREES.push({ x, z });
    world.createCollider(RAPIER.ColliderDesc.cylinder(1.5 * s, 0.3 * s).setTranslation(x, y + 1.5 * s, z), ground);
    t++;
  }
  trunks.count = crowns.count = t;
  let r = 0; guard = 0;
  while (r < NR && guard++ < 5000) {
    const x = (rnd() - 0.5) * (MAP_SIZE - 30), z = (rnd() - 0.5) * (MAP_SIZE - 30);
    if (!ok(x, z, 2) || puddleAt(x, z)) continue;
    const y = heightAt(x, z), s = 0.5 + rnd() * 1.6;
    Q.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
    rocks.setMatrixAt(r, M.compose(P.set(x, y + s * 0.3, z), Q, S.set(s * 1.3, s, s * 1.1)));
    world.createCollider(RAPIER.ColliderDesc.ball(s * 0.95).setTranslation(x, y + s * 0.3, z), ground);
    r++;
  }
  rocks.count = r;

  // mountain boulders (with colliders, kept off the trail) and fine scree (visual only; count follows the preset)
  const bMat = new THREE.MeshStandardMaterial({ color: 0x77716a, roughness: 0.95, flatShading: true });
  const NB = 110, NS = 700;
  const boulders = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 1), bMat, NB);
  const scree = new THREE.InstancedMesh(new THREE.TetrahedronGeometry(1, 0), rockMat, NS);
  boulders.castShadow = true; boulders.receiveShadow = true; scree.receiveShadow = true;
  boulders.name = 'boulders'; scree.name = 'scree';
  scene.add(boulders, scree);
  const rb = mulberry(777), pert = (g: THREE.BufferGeometry) => { const p = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) { const k = 0.8 + hash(Math.round(p.getX(i) * 50), Math.round(p.getZ(i) * 50 + p.getY(i) * 31)) * 0.4; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); } g.computeVertexNormals(); };
  pert(boulders.geometry);
  let nb = 0; guard = 0;
  while (nb < NB && guard++ < 8000) {
    const a = rb() * Math.PI * 2, rr = 8 + Math.sqrt(rb()) * (RC.r + 2), x = RC.x + Math.cos(a) * rr, z = RC.z + Math.sin(a) * rr;
    if (Math.abs(x) > 152 || Math.abs(z) > 152) continue;
    const tr = nearTrail(x, z); if (tr.d < tr.hw + 3.5) continue;
    const y = heightAt(x, z), s = 0.7 + rb() * rb() * 2.6;
    Q.setFromEuler(new THREE.Euler(rb() * 3, rb() * 3, rb() * 3));
    boulders.setMatrixAt(nb++, M.compose(P.set(x, y + s * 0.25, z), Q, S.set(s * (1 + rb() * 0.4), s * (0.6 + rb() * 0.4), s * (1 + rb() * 0.3))));
    if (s > 1.1) world.createCollider(RAPIER.ColliderDesc.ball(s * 0.8).setTranslation(x, y + s * 0.2, z), ground);
  }
  boulders.count = nb;
  let ns = 0; guard = 0;
  while (ns < NS && guard++ < 20000) {
    const a = rb() * Math.PI * 2, rr = 4 + Math.sqrt(rb()) * (RC.r + 4), x = RC.x + Math.cos(a) * rr, z = RC.z + Math.sin(a) * rr;
    if (Math.abs(x) > 154 || Math.abs(z) > 154 || surfaceAt(x, z) !== 'rock') continue;
    const tr = nearTrail(x, z); if (tr.d < tr.hw - 0.5 && rb() < 0.85) continue;  // a few loose stones on the trail edge
    const s = 0.12 + rb() * rb() * 0.45;
    Q.setFromEuler(new THREE.Euler(rb() * 6, rb() * 6, rb() * 6));
    scree.setMatrixAt(ns++, M.compose(P.set(x, heightAt(x, z) + s * 0.2, z), Q, S.set(s, s * 0.7, s)));
  }
  scree.count = ns; SCREE.mesh = scree; SCREE.max = ns;
}
/** scree instance count follows the graphics preset (0 on Low) */
export const SCREE: { mesh: THREE.InstancedMesh | null; max: number } = { mesh: null, max: 0 };
export function setTerrainDetail(level: 0 | 1 | 2) { if (SCREE.mesh) SCREE.mesh.count = level === 0 ? 0 : level === 1 ? Math.round(SCREE.max * 0.5) : SCREE.max; }
