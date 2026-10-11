import * as THREE from 'three';
import type { Surface } from './terrain';

const MUD_C = new THREE.Color(0x150e08), SAND_C = new THREE.Color(0xa07a48); // converted to linear by THREE.Color

/** Continuous tyre-track ribbons: each wheel extends its own strip of joined quads (ring buffer). */
export class TrackMarks {
  private geo = new THREE.BufferGeometry();
  private pos: Float32Array; private col: Float32Array;
  private seg = 0;
  private prev: ({ l: THREE.Vector3; r: THREE.Vector3; c: THREE.Vector3 } | null)[] = [];
  count = 0;
  private W = 0.3;
  private side = new THREE.Vector3();
  constructor(scene: THREE.Scene, private max = 4000) {
    this.pos = new Float32Array(max * 4 * 3); this.col = new Float32Array(max * 4 * 4);
    const idx = new Uint32Array(max * 6);
    for (let i = 0; i < max; i++) idx.set([i * 4, i * 4 + 2, i * 4 + 1, i * 4 + 1, i * 4 + 2, i * 4 + 3], i * 6);
    this.geo.setIndex(new THREE.BufferAttribute(idx, 1));
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo.setDrawRange(0, 0);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.frustumCulled = false; mesh.receiveShadow = true;
    scene.add(mesh);
  }
  /** Break the strip for a wheel (e.g. it left the ground or soft surface). */
  lift(wheel: number) { this.prev[wheel] = null; }
  reset() { this.prev = []; }
  add(wheel: number, p: THREE.Vector3, n: THREE.Vector3, fwd: THREE.Vector3, s: Surface) {
    const c = p.clone().addScaledVector(n, 0.035);
    this.side.crossVectors(n, fwd).normalize().multiplyScalar(this.W / 2);
    const cur = { l: c.clone().add(this.side), r: c.clone().sub(this.side), c };
    const pr = this.prev[wheel];
    if (pr && pr.c.distanceToSquared(c) < 0.25 * 0.25) return; // wait until it moved 25 cm
    if (pr && pr.c.distanceToSquared(c) < 4) {
      const i = this.seg;
      this.pos.set([pr.l.x, pr.l.y, pr.l.z, pr.r.x, pr.r.y, pr.r.z, cur.l.x, cur.l.y, cur.l.z, cur.r.x, cur.r.y, cur.r.z], i * 12);
      const c = s === 'mud' ? MUD_C : SAND_C;
      const rgb = [c.r, c.g, c.b, s === 'mud' ? 0.9 : 0.65];
      for (let k = 0; k < 4; k++) this.col.set(rgb, i * 16 + k * 4);
      this.seg = (this.seg + 1) % this.max; this.count++;
      this.geo.setDrawRange(0, Math.min(this.count, this.max) * 6);
      (this.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (this.geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    this.prev[wheel] = cur;
  }
}
