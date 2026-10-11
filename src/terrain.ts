import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';

export type Surface = 'ground' | 'mud' | 'sand';

export const MAP_SIZE = 320;
const SEG = 160;

/** Flat proving-ground strip used for top-speed runs. */
export const STRIP = { z: 100, half: 7, len: 104 };
export const onStrip = (x: number, z: number) => Math.abs(z - STRIP.z) < STRIP.half && Math.abs(x) < STRIP.len;

export const ZONES = {
  spawn: { x: 0, z: 0, r: 42 },
  mud: { x: -72, z: 40, r: 40 },
  sand: { x: 88, z: -55, r: 62, flat: 30 },
  /** rocky ridge (Phase 6 hill-climb): summit plateau at the centre */
  ridge: { x: -92, z: -92, r: 50, h: 17 },
};
/** Hill-climb trail: start at the foot of the ridge, summit flag on the plateau. */
export const RIDGE_TRAIL = { start: { x: -50, z: -50 }, summit: { x: -92, z: -92 } };
/** distance from the straight climb line (used to keep the line clear of trees/boulders) */
export function distToTrail(x: number, z: number) {
  const a = RIDGE_TRAIL.start, b = RIDGE_TRAIL.summit, dx = b.x - a.x, dz = b.z - a.z;
  const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t));
}

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

function baseHeight(x: number, z: number): number {
  // rolling hills
  let h = (fbm(x * 0.018 + 10, z * 0.018 - 7, 5) - 0.45) * 9;
  // rocky mountain rim towards map edges
  const edge = Math.max(Math.abs(x), Math.abs(z));
  h += sstep(105, 158, edge) * (14 + fbm(x * 0.05, z * 0.05, 4) * 14);

  // rocky ridge: smooth cone with a summit plateau, rough rocky lumps on the flanks (smoother along the trail)
  const dr = dist(x, z, ZONES.ridge);
  if (dr < ZONES.ridge.r + 2) {
    const k = 1 - sstep(5, ZONES.ridge.r, dr);
    const rough = (fbm(x * 0.35, z * 0.35, 3) - 0.5) * 1.6 * Math.min(1, distToTrail(x, z) / 7 + 0.25);
    h = Math.max(h, h * (1 - k) + (ZONES.ridge.h * k + rough * k * (1 - k) * 3));
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

export function buildTerrain(scene: THREE.Scene, world: RAPIER_NS.World, RAPIER: typeof RAPIER_NS) {
  const geo = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = heightAt(x, z);
    pos.setY(i, y);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const s = surfaceAt(x, z);
    const n = fbm(x * 0.15, z * 0.15, 3);
    const slope = 1 - nrm.getY(i);
    if (s === 'mud') c.copy(C_MUD).lerp(C_MUD_WET, n);
    else if (s === 'sand') c.copy(C_SAND).lerp(C_SAND_D, n * 0.8);
    else {
      c.copy(C_GRASS).lerp(C_DIRT, Math.min(1, n * 0.9 + (dist(x, z, ZONES.spawn) < 30 ? 0.35 : 0)));
      if (onStrip(x, z)) c.copy(C_STRIP).lerp(C_DIRT, n * 0.5);
      if (slope > 0.12 || Math.max(Math.abs(x), Math.abs(z)) > 125) c.lerp(C_ROCK, Math.min(1, slope * 4 + 0.3));
    }
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'terrain';
  scene.add(mesh);

  // physics trimesh built from the exact same vertices
  const verts = new Float32Array(pos.array as ArrayLike<number>);
  const idx = new Uint32Array(geo.index!.array as ArrayLike<number>);
  const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(RAPIER.ColliderDesc.trimesh(verts, idx).setFriction(0.9), ground);

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
  const ok = (x: number, z: number, margin: number) => Math.abs(z - STRIP.z) > STRIP.half + 14 && distToTrail(x, z) > 7 &&
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
}
