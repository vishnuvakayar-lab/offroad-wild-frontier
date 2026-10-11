import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';

export type Surface = 'ground' | 'mud' | 'sand';

export const MAP_SIZE = 320;
const SEG = 160;

export const ZONES = {
  spawn: { x: 0, z: 0, r: 42 },
  mud: { x: -72, z: 40, r: 40 },
  sand: { x: 88, z: -55, r: 62, flat: 30 },
};

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

export function heightAt(x: number, z: number): number {
  // rolling hills
  let h = (fbm(x * 0.018 + 10, z * 0.018 - 7, 5) - 0.45) * 9;
  // rocky mountain rim towards map edges
  const edge = Math.max(Math.abs(x), Math.abs(z));
  h += sstep(105, 158, edge) * (14 + fbm(x * 0.05, z * 0.05, 4) * 14);

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
  return h;
}

const C_GRASS = new THREE.Color(0x5f7a3a);
const C_DIRT = new THREE.Color(0x7a6448);
const C_MUD = new THREE.Color(0x3a2a1c);
const C_MUD_WET = new THREE.Color(0x2a1e14);
const C_SAND = new THREE.Color(0xd9b77a);
const C_SAND_D = new THREE.Color(0xc29a5c);
const C_ROCK = new THREE.Color(0x7c7770);

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

  // shallow muddy water puddles in the mud basin (visual)
  const puddleMat = new THREE.MeshStandardMaterial({ color: 0x2b2116, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.85 });
  const rnd = mulberry(7);
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2, r = rnd() * (ZONES.mud.r - 10);
    const x = ZONES.mud.x + Math.cos(a) * r, z = ZONES.mud.z + Math.sin(a) * r;
    const p = new THREE.Mesh(new THREE.CircleGeometry(2 + rnd() * 3, 20), puddleMat);
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, heightAt(x, z) + 0.06, z);
    p.scale.set(1, 0.6 + rnd() * 0.6, 1);
    p.receiveShadow = true;
    scene.add(p);
  }

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
  const ok = (x: number, z: number, margin: number) =>
    surfaceAt(x, z) === 'ground' && dist(x, z, ZONES.spawn) > ZONES.spawn.r + margin &&
    dist(x, z, ZONES.mud) > ZONES.mud.r + margin && dist(x, z, ZONES.sand) > ZONES.sand.r + margin;
  let t = 0, guard = 0;
  while (t < NT && guard++ < 5000) {
    const x = (rnd() - 0.5) * (MAP_SIZE - 30), z = (rnd() - 0.5) * (MAP_SIZE - 30);
    if (!ok(x, z, 6)) continue;
    const y = heightAt(x, z), s = 0.8 + rnd() * 0.7;
    Q.setFromEuler(new THREE.Euler(0, rnd() * 6.28, 0));
    trunks.setMatrixAt(t, M.compose(P.set(x, y + 1.2 * s, z), Q, S.set(s, s, s)));
    crowns.setMatrixAt(t, M.compose(P.set(x, y + (2.4 + 2.0) * s, z), Q, S.set(s, s, s)));
    world.createCollider(RAPIER.ColliderDesc.cylinder(1.5 * s, 0.3 * s).setTranslation(x, y + 1.5 * s, z), ground);
    t++;
  }
  trunks.count = crowns.count = t;
  let r = 0; guard = 0;
  while (r < NR && guard++ < 5000) {
    const x = (rnd() - 0.5) * (MAP_SIZE - 30), z = (rnd() - 0.5) * (MAP_SIZE - 30);
    if (!ok(x, z, 2)) continue;
    const y = heightAt(x, z), s = 0.5 + rnd() * 1.6;
    Q.setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3));
    rocks.setMatrixAt(r, M.compose(P.set(x, y + s * 0.3, z), Q, S.set(s * 1.3, s, s * 1.1)));
    world.createCollider(RAPIER.ColliderDesc.ball(s * 0.95).setTranslation(x, y + s * 0.3, z), ground);
    r++;
  }
  rocks.count = r;
}
