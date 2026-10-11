import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { heightAt, surfaceAt, puddleAt, distToTrail, distToRoutes, distToL1, onStrip, mulberry, ZONES, TREES, STRIP } from './terrain';
import { groundUniforms } from './groundShader';

/**
 * Biome dressing (Phase C rework): jungle fringe around the mud basin (broadleaf trees with colliders, ferns/bushes,
 * reeds at the mud edge), wind-animated grass across the open ground, and a desert set (sandstone outcrops with
 * colliders, dry scrub, dead trees). Everything is instanced and chunked so it frustum/distance-culls; the visual-only
 * layers scale with the graphics preset. Deterministic (seeded) so the multiplayer server replays identical colliders.
 */
const dist = (x: number, z: number, c: { x: number; z: number }) => Math.hypot(x - c.x, z - c.z);
const LOOP = { x: 80, z: -55, rx: 26, rz: 38 }; // Dune Loop race ellipse (keep outcrops clear of it)
const loopK = (x: number, z: number, m: number) => ((x - LOOP.x) / (LOOP.rx + m)) ** 2 + ((z - LOOP.z) / (LOOP.rz + m)) ** 2;

function colorize(g: THREE.BufferGeometry, f: (x: number, y: number, z: number, c: THREE.Color) => void) {
  const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { f(p.getX(i), p.getY(i), p.getZ(i), c); col.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
const nonIdx = (g: THREE.BufferGeometry) => { const n = g.index ? g.toNonIndexed() : g; if (n.attributes.uv) n.deleteAttribute('uv'); return n; };
function jitter(g: THREE.BufferGeometry, amt: number, seed: number) {
  const r = mulberry(seed), p = g.attributes.position as THREE.BufferAttribute, key = new Map<string, number[]>();
  for (let i = 0; i < p.count; i++) { // move shared vertices together so the mesh stays closed
    const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    const d = key.get(k) ?? [(r() - 0.5) * amt, (r() - 0.5) * amt, (r() - 0.5) * amt]; key.set(k, d);
    p.setXYZ(i, p.getX(i) + d[0], p.getY(i) + d[1], p.getZ(i) + d[2]);
  }
  g.computeVertexNormals(); return g;
}

/** wind sway for foliage: bend proportional to height above the instance origin */
function windify(mat: THREE.MeshStandardMaterial, amp: number, key: string) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = groundUniforms.uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
      vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      #else
      vec3 ip = vec3(0.0);
      #endif
      float sw = sin(uTime * 1.7 + ip.x * 0.21 + ip.z * 0.17) + 0.45 * sin(uTime * 3.1 + ip.x * 0.7);
      transformed.x += sw * ${amp.toFixed(3)} * max(0.0, position.y) * max(0.0, position.y);
      transformed.z += sw * ${(amp * 0.6).toFixed(3)} * max(0.0, position.y) * max(0.0, position.y);`);
  };
  mat.customProgramCacheKey = () => 'owf-wind-' + key;
}

interface Layer { meshes: THREE.InstancedMesh[]; max: number[]; frac: [number, number, number]; viewDist: number }
const LAYERS: Layer[] = [];
let detail: 0 | 1 | 2 = 2;

/** Instances bucketed into 40 m chunks: one InstancedMesh per chunk so off-screen / far chunks are culled. */
function chunked(scene: THREE.Scene, geo: THREE.BufferGeometry, mat: THREE.Material, mats: THREE.Matrix4[], cols: THREE.Color[] | null, o: { shadow?: boolean; frac: [number, number, number]; viewDist: number; name: string }) {
  const CH = 40, buckets = new Map<string, number[]>(), v = new THREE.Vector3();
  mats.forEach((m, i) => { v.setFromMatrixPosition(m); const k = `${Math.floor(v.x / CH)},${Math.floor(v.z / CH)}`; (buckets.get(k) ?? buckets.set(k, []).get(k)!).push(i); });
  const layer: Layer = { meshes: [], max: [], frac: o.frac, viewDist: o.viewDist };
  for (const idx of buckets.values()) {
    // shuffle-free: instances are already random, so truncating `count` thins evenly
    const im = new THREE.InstancedMesh(geo, mat, idx.length);
    idx.forEach((j, k) => { im.setMatrixAt(k, mats[j]); if (cols) im.setColorAt(k, cols[j]); });
    im.castShadow = !!o.shadow; im.receiveShadow = true; im.name = o.name;
    im.computeBoundingSphere();
    scene.add(im); layer.meshes.push(im); layer.max.push(idx.length);
  }
  LAYERS.push(layer);
}

export function setNatureDetail(level: 0 | 1 | 2) {
  detail = level;
  for (const L of LAYERS) L.meshes.forEach((m, i) => { m.count = Math.round(L.max[i] * L.frac[level]); });
}
const tmpS = new THREE.Sphere();
/** distance culling per chunk (frustum culling is automatic) */
export function updateNature(cam: THREE.Vector3) {
  for (const L of LAYERS) for (const m of L.meshes) {
    if (!m.boundingSphere) continue;
    tmpS.copy(m.boundingSphere).applyMatrix4(m.matrixWorld);
    m.visible = m.count > 0 && tmpS.center.distanceTo(cam) - tmpS.radius < L.viewDist * (detail === 0 ? 0.6 : detail === 1 ? 0.8 : 1);
  }
}
export function natureStats() {
  let inst = 0, vis = 0, meshes = 0;
  for (const L of LAYERS) for (const m of L.meshes) { meshes++; inst += m.count; if (m.visible) vis += m.count; }
  return { layers: LAYERS.length, meshes, instances: inst, visibleInstances: vis, detail };
}
export const NATURE_COUNTS: Record<string, number> = {};

export function buildNature(scene: THREE.Scene, world: RAPIER_NS.World, RAPIER: typeof RAPIER_NS, ground: RAPIER_NS.RigidBody) {
  LAYERS.length = 0;
  const rnd = mulberry(4242);
  const Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3(), E = new THREE.Euler();
  const MZ = ZONES.mud, SZ = ZONES.sand;
  const clearOf = (x: number, z: number, m: number) => distToL1(x, z) > 3 + m && !onStrip(x, z) && Math.abs(z - STRIP.z) > STRIP.half + m && distToTrail(x, z) > 6 + m && distToRoutes(x, z) > 4 + m &&
    dist(x, z, ZONES.spawn) > ZONES.spawn.r * 0.5 + m && !puddleAt(x, z) && Math.abs(x) < 150 && Math.abs(z) < 150;
  const treeClear = (x: number, z: number, r: number) => TREES.every((t) => (t.x - x) ** 2 + (t.z - z) ** 2 > r * r);

  // ---------- jungle broadleaf trees (colliders) around the mud basin ----------
  const trunkG = nonIdx(new THREE.CylinderGeometry(0.22, 0.42, 6, 7, 3).translate(0, 3, 0));
  { const p = trunkG.attributes.position as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + Math.sin(y * 0.5) * 0.25); } trunkG.computeVertexNormals(); }
  colorize(trunkG, (_x, y, _z, c) => c.setRGB(0.22 + y * 0.008, 0.16 + y * 0.006, 0.1));
  const crownParts: THREE.BufferGeometry[] = [];
  const cr = mulberry(91);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + cr(), rr = k === 0 ? 0 : 1.6 + cr() * 0.8, s = k === 0 ? 2.4 : 1.5 + cr() * 0.8;
    crownParts.push(nonIdx(jitter(new THREE.IcosahedronGeometry(1, 1), 0.35, 100 + k).scale(s, s * 0.62, s).translate(Math.cos(a) * rr, 6.2 + cr() * 1.2 + (k === 0 ? 0.9 : 0), Math.sin(a) * rr)));
  }
  const crownG = colorize(mergeGeometries(crownParts)!, (x, y, z, c) => { const n = 0.5 + 0.5 * Math.sin(x * 3.1 + z * 2.3 + y * 1.7); c.setRGB(0.11 + n * 0.07, 0.22 + n * 0.1 + (y - 5.5) * 0.025, 0.07 + n * 0.04); });
  const leafMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, flatShading: true });
  windify(leafMat, 0.0016, 'leaf');
  const barkMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
  const tM: THREE.Matrix4[] = [], tC: THREE.Color[] = [];
  let guard = 0;
  while (tM.length < 95 && guard++ < 6000) {
    const a = rnd() * Math.PI * 2, rr = MZ.r + 7 + rnd() * 34, x = MZ.x + Math.cos(a) * rr, z = MZ.z + Math.sin(a) * rr;
    if (surfaceAt(x, z) !== 'ground' || !clearOf(x, z, 4) || !treeClear(x, z, 4.5)) continue;
    const y = heightAt(x, z), s = 0.75 + rnd() * 0.6;
    Q.setFromEuler(E.set(0, rnd() * 6.28, 0));
    tM.push(new THREE.Matrix4().compose(P.set(x, y - 0.2, z), Q, S.set(s, s * (0.9 + rnd() * 0.3), s)));
    tC.push(new THREE.Color().setHSL(0.2 + rnd() * 0.1, 0.18 + rnd() * 0.2, 0.36 + rnd() * 0.16));
    TREES.push({ x, z });
    world.createCollider(RAPIER.ColliderDesc.cylinder(3 * s, 0.38 * s).setTranslation(x, y + 3 * s, z), ground);
  }
  chunked(scene, trunkG, barkMat, tM, null, { shadow: true, frac: [1, 1, 1], viewDist: 400, name: 'jungle-trunks' });
  chunked(scene, crownG, leafMat, tM, tC, { shadow: true, frac: [1, 1, 1], viewDist: 400, name: 'jungle-crowns' });
  NATURE_COUNTS.jungleTrees = tM.length;

  // ---------- ferns / bushes (visual only) ----------
  const fernParts: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 7; k++) { // fronds: flattened, tilted leaves radiating from the centre
    const a = (k / 7) * Math.PI * 2;
    fernParts.push(nonIdx(new THREE.ConeGeometry(0.22, 1.5, 3, 1).rotateX(-1.05).translate(0, 0.35, 0.62).rotateY(a)));
  }
  const fernG = colorize(mergeGeometries(fernParts)!, (_x, y, _z, c) => c.setRGB(0.12 + y * 0.12, 0.3 + y * 0.25, 0.08));
  const bushG = colorize(nonIdx(jitter(new THREE.IcosahedronGeometry(1, 1), 0.3, 7).scale(1, 0.7, 1).translate(0, 0.45, 0)), (_x, y, _z, c) => c.setRGB(0.15 + y * 0.06, 0.3 + y * 0.12, 0.1));
  const fernMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, side: THREE.DoubleSide, flatShading: true });
  windify(fernMat, 0.05, 'fern');
  const bushMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true });
  const fM: THREE.Matrix4[] = [], fC: THREE.Color[] = [], bM: THREE.Matrix4[] = [], bC: THREE.Color[] = [];
  guard = 0;
  while ((fM.length < 900 || bM.length < 380) && guard++ < 30000) {
    const jungle = rnd() < 0.75;
    let x: number, z: number;
    if (jungle) { const a = rnd() * Math.PI * 2, rr = MZ.r + 1 + rnd() * 44; x = MZ.x + Math.cos(a) * rr; z = MZ.z + Math.sin(a) * rr; }
    else { x = (rnd() - 0.5) * 290; z = (rnd() - 0.5) * 290; }
    if (surfaceAt(x, z) !== 'ground' || !clearOf(x, z, 0.5)) continue;
    const y = heightAt(x, z);
    Q.setFromEuler(E.set(0, rnd() * 6.28, 0));
    if (fM.length < 900 && rnd() < 0.7) {
      const s = 0.4 + rnd() * 0.45; fM.push(new THREE.Matrix4().compose(P.set(x, y - 0.05, z), Q, S.set(s, s, s)));
      fC.push(new THREE.Color().setHSL(0.2 + rnd() * 0.1, 0.2 + rnd() * 0.2, 0.32 + rnd() * 0.18));
    } else if (bM.length < 380) {
      const s = 0.6 + rnd() * 1.1; bM.push(new THREE.Matrix4().compose(P.set(x, y - 0.1, z), Q, S.set(s * (1 + rnd() * 0.5), s, s)));
      bC.push(new THREE.Color().setHSL(0.18 + rnd() * 0.1, 0.18 + rnd() * 0.2, 0.34 + rnd() * 0.18));
    }
  }
  chunked(scene, fernG, fernMat, fM, fC, { frac: [0.25, 0.6, 1], viewDist: 110, name: 'ferns' });
  chunked(scene, bushG, bushMat, bM, bC, { shadow: true, frac: [0.4, 0.75, 1], viewDist: 170, name: 'bushes' });
  NATURE_COUNTS.ferns = fM.length; NATURE_COUNTS.bushes = bM.length;

  // ---------- grass tufts (wind) + reeds at the mud edge ----------
  const blades: THREE.BufferGeometry[] = [];
  const br = mulberry(55);
  for (let k = 0; k < 7; k++) {
    const a = br() * Math.PI * 2, r0 = br() * 0.18, h = 0.35 + br() * 0.35, lean = (br() - 0.5) * 0.5, w = 0.035 + br() * 0.02;
    const g = new THREE.BufferGeometry();
    const bx = Math.cos(a) * r0, bz = Math.sin(a) * r0, px = -Math.sin(a) * w, pz = Math.cos(a) * w;
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([bx - px, 0, bz - pz, bx + px, 0, bz + pz, bx + Math.cos(a) * lean, h, bz + Math.sin(a) * lean]), 3));
    g.computeVertexNormals();
    // normals point up-ish so tufts light like the ground instead of flickering by facing
    const n = g.attributes.normal as THREE.BufferAttribute; for (let i = 0; i < 3; i++) n.setXYZ(i, n.getX(i) * 0.3, 1, n.getZ(i) * 0.3);
    blades.push(g);
  }
  const tuftG = colorize(mergeGeometries(blades)!, (_x, y, _z, c) => c.setRGB(0.16 + y * 0.45, 0.26 + y * 0.55, 0.08 + y * 0.12));
  const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
  windify(grassMat, 0.35, 'grass');
  const gM: THREE.Matrix4[] = [], gC: THREE.Color[] = [];
  guard = 0;
  while (gM.length < 9000 && guard++ < 60000) {
    const near = rnd() < 0.45; let x: number, z: number;
    if (near) { const a = rnd() * Math.PI * 2, rr = MZ.r - 2 + rnd() * 50; x = MZ.x + Math.cos(a) * rr; z = MZ.z + Math.sin(a) * rr; }
    else { x = (rnd() - 0.5) * 296; z = (rnd() - 0.5) * 296; }
    const s0 = surfaceAt(x, z);
    if (s0 !== 'ground' || onStrip(x, z) || puddleAt(x, z) || distToTrail(x, z) < 5 || dist(x, z, ZONES.spawn) < 16) continue;
    const y = heightAt(x, z), s = 0.7 + rnd() * 0.8;
    Q.setFromEuler(E.set(0, rnd() * 6.28, 0));
    gM.push(new THREE.Matrix4().compose(P.set(x, y - 0.03, z), Q, S.set(s, s * (0.8 + rnd() * 0.6), s)));
    gC.push(new THREE.Color().setHSL(0.16 + rnd() * 0.08, 0.25 + rnd() * 0.2, 0.5 + rnd() * 0.25));
  }
  chunked(scene, tuftG, grassMat, gM, gC, { frac: [0, 0.45, 1], viewDist: 75, name: 'grass' });
  NATURE_COUNTS.grass = gM.length;
  const rM: THREE.Matrix4[] = [], rC: THREE.Color[] = [];
  guard = 0;
  while (rM.length < 700 && guard++ < 20000) { // reeds on the boggy rim of the basin and around puddles
    const a = rnd() * Math.PI * 2, rr = MZ.r - 4 + rnd() * 9, x = MZ.x + Math.cos(a) * rr, z = MZ.z + Math.sin(a) * rr;
    if (distToRoutes(x, z) < 5 || puddleAt(x, z)) continue;
    const y = heightAt(x, z), s = 1.6 + rnd() * 1.4;
    Q.setFromEuler(E.set(0, rnd() * 6.28, 0));
    rM.push(new THREE.Matrix4().compose(P.set(x, y - 0.05, z), Q, S.set(s * 0.7, s * 1.5, s * 0.7)));
    rC.push(new THREE.Color().setHSL(0.13 + rnd() * 0.06, 0.35, 0.42 + rnd() * 0.2));
  }
  chunked(scene, tuftG, grassMat, rM, rC, { frac: [0.3, 0.7, 1], viewDist: 110, name: 'reeds' });
  NATURE_COUNTS.reeds = rM.length;

  // ---------- desert: sandstone outcrops (colliders), dry scrub, dead trees ----------
  const sandstone = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true });
  const stoneG = colorize(nonIdx(jitter(new THREE.IcosahedronGeometry(1, 1), 0.45, 21)), (_x, y, _z, c) => {
    const band = 0.5 + 0.5 * Math.sin(y * 9.0); c.setRGB(0.62 + band * 0.12, 0.4 + band * 0.08, 0.24 + band * 0.04); });
  const oM: THREE.Matrix4[] = [];
  guard = 0;
  while (oM.length < 34 && guard++ < 8000) {
    const a = rnd() * Math.PI * 2, rr = SZ.flat + 12 + rnd() * 40, x = SZ.x + Math.cos(a) * rr, z = SZ.z + Math.sin(a) * rr;
    if (Math.abs(x) > 148 || Math.abs(z) > 148 || loopK(x, z, 14) < 1 || distToRoutes(x, z) < 12 || distToL1(x, z) < 12 || dist(x, z, ZONES.spawn) < ZONES.spawn.r + 8 || !treeClear(x, z, 6)) continue;
    if (oM.some((m) => { P.setFromMatrixPosition(m); return Math.hypot(P.x - x, P.z - z) < 7; })) continue;
    const y = heightAt(x, z), big = rnd() < 0.35, s = big ? 2.2 + rnd() * 2 : 0.9 + rnd() * 1.2, sy = s * (big ? 1.1 + rnd() * 0.9 : 0.7 + rnd() * 0.5);
    Q.setFromEuler(E.set((rnd() - 0.5) * 0.3, rnd() * 6.28, (rnd() - 0.5) * 0.3));
    oM.push(new THREE.Matrix4().compose(P.set(x, y + sy * 0.25, z), Q, S.set(s * (1 + rnd() * 0.6), sy, s)));
    world.createCollider(RAPIER.ColliderDesc.ball(Math.min(s, sy) * 0.9).setTranslation(x, y + sy * 0.25, z), ground);
    TREES.push({ x, z });
  }
  chunked(scene, stoneG, sandstone, oM, null, { shadow: true, frac: [1, 1, 1], viewDist: 400, name: 'sandstone' });
  NATURE_COUNTS.outcrops = oM.length;
  const scrubG = colorize(nonIdx(jitter(new THREE.IcosahedronGeometry(1, 0), 0.4, 33).scale(1, 0.55, 1).translate(0, 0.3, 0)), (_x, y, _z, c) => c.setRGB(0.4 + y * 0.1, 0.36 + y * 0.12, 0.2));
  const scrubMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });
  const sM: THREE.Matrix4[] = [], sC: THREE.Color[] = [];
  guard = 0;
  while (sM.length < 320 && guard++ < 12000) {
    const a = rnd() * Math.PI * 2, rr = 6 + rnd() * (SZ.r + 14), x = SZ.x + Math.cos(a) * rr, z = SZ.z + Math.sin(a) * rr;
    if (Math.abs(x) > 150 || Math.abs(z) > 150 || distToRoutes(x, z) < 4 || distToL1(x, z) < 4 || (rr < SZ.flat && rnd() < 0.8)) continue;
    const y = heightAt(x, z), s = 0.35 + rnd() * 0.6;
    Q.setFromEuler(E.set(0, rnd() * 6.28, 0));
    sM.push(new THREE.Matrix4().compose(P.set(x, y - 0.05, z), Q, S.set(s, s, s)));
    sC.push(new THREE.Color().setHSL(0.1 + rnd() * 0.08, 0.25 + rnd() * 0.2, 0.55 + rnd() * 0.25));
  }
  chunked(scene, scrubG, scrubMat, sM, sC, { frac: [0.35, 0.7, 1], viewDist: 160, name: 'scrub' });
  NATURE_COUNTS.scrub = sM.length;
  // dead trees: trunk + a few bare branches
  const deadParts = [nonIdx(new THREE.CylinderGeometry(0.1, 0.2, 3.2, 5).translate(0, 1.6, 0))];
  const dr = mulberry(8);
  for (let k = 0; k < 5; k++) { const len = 0.9 + dr() * 1.1; deadParts.push(nonIdx(new THREE.CylinderGeometry(0.03, 0.08, len, 4).translate(0, len / 2, 0).rotateZ(0.6 + dr() * 0.6).rotateY(dr() * 6.28).translate(0, 1.6 + dr() * 1.4, 0))); }
  const deadG = colorize(mergeGeometries(deadParts)!, (_x, y, _z, c) => c.setRGB(0.36 + y * 0.03, 0.3 + y * 0.02, 0.24));
  const dM: THREE.Matrix4[] = [];
  guard = 0;
  while (dM.length < 16 && guard++ < 4000) {
    const a = rnd() * Math.PI * 2, rr = SZ.flat + 4 + rnd() * 40, x = SZ.x + Math.cos(a) * rr, z = SZ.z + Math.sin(a) * rr;
    if (Math.abs(x) > 148 || Math.abs(z) > 148 || distToRoutes(x, z) < 6 || distToL1(x, z) < 8 || loopK(x, z, 8) < 1) continue;
    const s = 0.8 + rnd() * 0.6; Q.setFromEuler(E.set((rnd() - 0.5) * 0.2, rnd() * 6.28, 0));
    dM.push(new THREE.Matrix4().compose(P.set(x, heightAt(x, z) - 0.1, z), Q, S.set(s, s, s)));
  }
  chunked(scene, deadG, barkMat, dM, null, { shadow: true, frac: [1, 1, 1], viewDist: 260, name: 'dead-trees' });
  NATURE_COUNTS.deadTrees = dM.length;
  setNatureDetail(detail);
}
