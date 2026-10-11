import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Level of detail: 0 = Low preset (simplified), 1 = Medium/High (full detail). */
export type Lod = 0 | 1;
export type P2 = [number, number]; // (z, y) in vehicle space; +z forward, +y up, +x = vehicle left

/** Materials shared by every procedural vehicle model. Only `paint` follows the garage colour. */
export interface Mats {
  paint: THREE.MeshStandardMaterial;   // body panels only (clear-coated metallic on Medium/High)
  dark: THREE.MeshStandardMaterial;    // textured black plastic trim / flares / grilles
  steel: THREE.MeshStandardMaterial;   // dark painted steel (bumpers, rails, chassis)
  glass: THREE.MeshStandardMaterial;   // tinted reflective glazing
  chrome: THREE.MeshStandardMaterial;
  lamp: THREE.MeshStandardMaterial;    // emissive headlight lenses
  tail: THREE.MeshStandardMaterial;    // emissive tail-light lenses
  amber: THREE.MeshStandardMaterial;   // indicators / beacons
  accent: THREE.MeshStandardMaterial;  // contrast roof / livery / tent
  rubber: THREE.MeshStandardMaterial;  // tyres
  alloy: THREE.MeshStandardMaterial;   // wheel rims / brake discs
  caliper: THREE.MeshStandardMaterial;
}

const tmpM = new THREE.Matrix4(), tmpE = new THREE.Euler();

/** Geometry helpers + a recorder that tags meshes so they can be merged per material afterwards. */
export class Kit {
  constructor(public g: THREE.Group, public m: Mats, public lod: Lod) {}
  /** Add a static mesh (merged later). minLod 1 = skipped on Low. */
  add(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, minLod: Lod = 0) {
    if (this.lod < minLod) { geo.dispose(); return null; }
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz);
    mesh.userData.static = true; this.g.add(mesh); return mesh;
  }
  /** Same part mirrored on both sides (x and -x). */
  sym(geoF: () => THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, minLod: Lod = 0) {
    this.add(geoF(), mat, x, y, z, rx, ry, rz, minLod); this.add(geoF(), mat, -x, y, z, rx, -ry, -rz, minLod);
  }
  box(w: number, h: number, d: number, r = 0) {
    if (r > 0 && this.lod > 0) return new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
    return new THREE.BoxGeometry(w, h, d);
  }
  cyl(rt: number, rb: number, h: number, seg = 16) { return new THREE.CylinderGeometry(rt, rb, h, this.lod ? seg : Math.max(6, seg >> 1)); }
  /** cylinder whose axis runs along X */
  cylX(r: number, h: number, seg = 16) { const g = this.cyl(r, r, h, seg); g.rotateZ(Math.PI / 2); return g; }
  /** cylinder whose axis runs along Z */
  cylZ(r: number, h: number, seg = 16) { const g = this.cyl(r, r, h, seg); g.rotateX(Math.PI / 2); return g; }

  /** Side-profile body panel: outline over the top (rear-bottom -> front-bottom), wheel arches cut into the sill line,
   *  extruded across the width with rounded (bevelled) edges. */
  profile(top: P2[], sillY: number, arches: { z: number; y: number; r: number }[], width: number, bevel = 0.05) {
    const s = new THREE.Shape();
    s.moveTo(top[0][0], top[0][1]);
    for (let i = 1; i < top.length; i++) s.lineTo(top[i][0], top[i][1]);
    // back along the sill from front to rear, cutting arches
    for (const a of [...arches].sort((p, q) => q.z - p.z)) {
      const dy = Math.max(-a.r * 0.95, Math.min(a.r * 0.95, sillY - a.y));
      const half = Math.sqrt(a.r * a.r - dy * dy), ang = Math.asin(dy / a.r);
      s.lineTo(a.z + half, sillY);
      s.absarc(a.z, a.y, a.r, ang, Math.PI - ang, false);
    }
    s.lineTo(top[0][0], sillY);
    const bt = this.lod ? bevel : bevel * 0.6;
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: Math.max(0.01, width - 2 * bt), bevelEnabled: true, bevelThickness: bt, bevelSize: bt * 0.8, bevelOffset: -bt * 0.8,
      bevelSegments: this.lod ? 3 : 1, curveSegments: this.lod ? 12 : 5,
    });
    geo.rotateY(-Math.PI / 2); // shape u -> +z, v -> y, depth -> -x
    geo.translate(width / 2 - bt, 0, 0);
    return geo;
  }
  /** Flat polygon on the vehicle side at |x| (both sides): windows, panels, lenses. */
  sidePoly(poly: P2[], x: number, mat: THREE.Material, minLod: Lod = 0) {
    for (const side of [1, -1]) {
      const sh = new THREE.Shape(poly.map(([z, y]) => new THREE.Vector2(side > 0 ? -z : z, y)));
      const geo = new THREE.ShapeGeometry(sh, this.lod ? 6 : 2);
      geo.rotateY(side > 0 ? Math.PI / 2 : -Math.PI / 2);
      this.add(geo, mat, side * x, 0, 0, 0, 0, 0, minLod);
    }
  }
  /** Flat panel spanning the width between two (z,y) points (windscreens, rear glass, bonnets). Double-sided material advised. */
  span(a: P2, b: P2, width: number, mat: THREE.Material, out = 1, thick = 0, minLod: Lod = 0) {
    const dz = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dz, dy), th = Math.atan2(dz, dy), o = 0.012 * out;
    const geo = thick > 0 ? new THREE.BoxGeometry(width, L, thick) : new THREE.PlaneGeometry(width, L);
    return this.add(geo, mat, 0, (a[1] + b[1]) / 2 - Math.sin(th) * o, (a[0] + b[0]) / 2 + Math.cos(th) * o, th, 0, 0, minLod);
  }
  /** Black wheel-arch flare: half-annulus extruded outward on both sides. */
  flare(z: number, y: number, r: number, x: number, width = 0.14, band = 0.12, from = 0.05, to = Math.PI - 0.05, mat = this.m.dark) {
    for (const side of [1, -1]) {
      const s = new THREE.Shape();
      s.absarc(0, 0, r + band, from, to, false);
      s.absarc(0, 0, r, to, from, true);
      const geo = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: this.lod > 0, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1, curveSegments: this.lod ? 14 : 6 });
      geo.rotateY(-Math.PI / 2); geo.translate(side > 0 ? width : 0, 0, 0);
      this.add(geo, mat, side > 0 ? x - width * 0.5 : -x - width * 0.5, y, z);
    }
  }
  /** Thin dark shut-line on both flanks between two (z,y) points. */
  line(a: P2, b: P2, x: number, w = 0.012) {
    const dz = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dz, dy);
    for (const side of [1, -1]) this.add(new THREE.BoxGeometry(0.006, L, w), this.m.dark, side * x, (a[1] + b[1]) / 2, (a[0] + b[0]) / 2, Math.atan2(dz, dy), 0, 0, 1);
  }
  /** Lamp: housing + emissive lens facing +z (front) or -z (rear). */
  lampRound(x: number, y: number, z: number, r: number, mat: THREE.Material, dir = 1) {
    for (const sx of [1, -1]) {
      this.add(this.cylZ(r * 1.25, 0.05, 18), this.m.chrome, sx * x, y, z, 0, 0, 0, 1);
      this.add(this.cylZ(r, 0.06, 18), mat, sx * x, y, z + dir * 0.012);
    }
  }
  lampRect(x: number, y: number, z: number, w: number, h: number, mat: THREE.Material, dir = 1, rimMat: THREE.Material = this.m.dark) {
    for (const sx of [1, -1]) {
      this.add(this.box(w + 0.05, h + 0.05, 0.05, 0.02), rimMat, sx * x, y, z, 0, 0, 0, 1);
      this.add(this.box(w, h, 0.05, 0.015), mat, sx * x, y, z + dir * 0.015);
    }
  }
  /** Door mirror on a stalk (both sides). */
  mirrors(x: number, y: number, z: number, big = false) {
    const w = big ? 0.12 : 0.08, h = big ? 0.42 : 0.16, d = big ? 0.05 : 0.2;
    for (const sx of [1, -1]) {
      this.add(this.box(0.16, 0.03, 0.03), this.m.dark, sx * (x + 0.06), y - h * 0.3, z, 0, 0, 0, 1);
      this.add(this.box(w + 0.02, h, d, 0.02), this.m.dark, sx * (x + 0.16), y, z);
      this.add(new THREE.PlaneGeometry(d * 0.8, h * 0.8), this.m.glass, sx * (x + 0.16), y, z - (big ? 0.03 : 0.11), 0, Math.PI, 0, 1);
    }
  }
  /** Tyre geometry (axis along X), shared by road wheels and spares. */
  tyre(r: number, w: number): THREE.BufferGeometry {
    const seg = this.lod ? 36 : 16, side = Math.min(0.12, r * 0.28), rr = r - side;
    const pts: THREE.Vector2[] = [];
    const hw = w / 2, c = Math.min(0.06, w * 0.18);
    pts.push(new THREE.Vector2(rr * 0.98, -hw), new THREE.Vector2(r - c, -hw - 0.005));
    for (let k = 0; k <= (this.lod ? 4 : 1); k++) { const a = -Math.PI / 2 + (k / (this.lod ? 4 : 1)) * Math.PI / 2; pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, -hw + c + Math.sin(a) * c)); }
    for (let k = 0; k <= (this.lod ? 4 : 1); k++) { const a = (k / (this.lod ? 4 : 1)) * Math.PI / 2; pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, hw - c + Math.sin(a) * c)); }
    pts.push(new THREE.Vector2(r - c, hw + 0.005), new THREE.Vector2(rr * 0.98, hw));
    let geo: THREE.BufferGeometry = new THREE.LatheGeometry(pts, seg);
    geo.rotateZ(Math.PI / 2); // lathe axis Y -> X
    geo = geo.toNonIndexed(); geo.deleteAttribute('uv');
    if (this.lod) { // staggered tread blocks so rolling is visible and the tyre reads as off-road rubber
      const n = Math.round(r * 44), parts: THREE.BufferGeometry[] = [geo];
      for (let k = 0; k < n; k++) for (const row of [-1, 1]) {
        const a = ((k + (row > 0 ? 0.5 : 0)) / n) * Math.PI * 2;
        const b = new THREE.BoxGeometry(w * 0.42, 0.035, (Math.PI * 2 * r / n) * 0.55).toNonIndexed(); b.deleteAttribute('uv');
        b.rotateY(row * 0.25); b.translate(row * w * 0.22, r + 0.006, 0); b.rotateX(a);
        parts.push(b);
      }
      geo = mergeGeometries(parts)!;
    }
    return geo;
  }
}

/** Merge all static meshes in `g` by material into one mesh per material (fewer draw calls). */
export function mergeStatic(g: THREE.Group) {
  const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const kill: THREE.Mesh[] = [];
  g.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(g.matrixWorld).invert();
  for (const o of g.children) {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.userData.static) continue;
    let geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
    for (const k of Object.keys(geo.attributes)) if (k !== 'position' && k !== 'normal') geo.deleteAttribute(k);
    if (!geo.attributes.normal) geo.computeVertexNormals();
    tmpM.multiplyMatrices(inv, mesh.matrixWorld); geo.applyMatrix4(tmpM);
    const mat = mesh.material as THREE.Material;
    if (!byMat.has(mat)) byMat.set(mat, []);
    byMat.get(mat)!.push(geo); kill.push(mesh);
  }
  for (const k of kill) { g.remove(k); k.geometry.dispose(); }
  for (const [mat, list] of byMat) {
    const merged = mergeGeometries(list)!; list.forEach((x) => x.dispose());
    const mesh = new THREE.Mesh(merged, mat); mesh.name = 'static:' + mat.name;
    mesh.castShadow = true; mesh.receiveShadow = mat.name !== 'glass';
    g.add(mesh);
  }
  void tmpE;
}
