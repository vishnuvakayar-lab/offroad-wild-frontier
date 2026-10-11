import * as THREE from 'three';
import { heightAt } from './terrain';
import type { MissionDef, Gate } from './missions';

/** Visual props for a running mission (checkpoint gates, summit flag, zones, camp, tow rope). */
export class MissionWorld {
  group = new THREE.Group();
  gates: { g: THREE.Group; banner: THREE.MeshStandardMaterial; posts: THREE.MeshStandardMaterial }[] = [];
  rope: THREE.Mesh | null = null;
  private disposables: { dispose(): void }[] = [];
  constructor(private scene: THREE.Scene, def: MissionDef) {
    scene.add(this.group);
    const per = def.laps ? def.gates.length / def.laps : def.gates.length;
    def.gates.forEach((g, i) => this.addGate(g, i === def.gates.length - 1 && (def.type === 'race' || def.type === 'mudrun') ? 'FINISH' : String((i % per) + 1)));
    if (def.zone) {
      if (def.type === 'climb' || def.type === 'trail') this.addFlag(def.zone.x, def.zone.z);
      if (def.type === 'deliver') this.addCamp(def.zone.x, def.zone.z);
      this.addZone(def.zone.x, def.zone.z, def.zone.r, def.type === 'tow' ? 0x37d67a : def.type === 'deliver' ? 0xffb03a : 0xff5a3a);
    }
    if (def.type === 'tow') {
      const geo = new THREE.CylinderGeometry(0.025, 0.025, 1, 6); geo.translate(0, 0.5, 0); geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffc23a, roughness: 0.6 });
      this.rope = new THREE.Mesh(geo, mat); this.rope.visible = false; this.group.add(this.rope); this.disposables.push(geo, mat);
    }
  }
  private mat(o: THREE.MeshStandardMaterialParameters) { const m = new THREE.MeshStandardMaterial(o); this.disposables.push(m); return m; }
  private geo<T extends THREE.BufferGeometry>(g: T) { this.disposables.push(g); return g; }
  private label(text: string) {
    const c = document.createElement('canvas'); c.width = 480; c.height = 64;
    const x = c.getContext('2d')!; x.fillStyle = '#1b1408'; x.fillRect(0, 0, 480, 64);
    x.fillStyle = '#fff'; x.font = 'bold 44px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 240, 34);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; this.disposables.push(t); return t;
  }
  addGate(g: Gate, text: string) {
    const grp = new THREE.Group(), fx = Math.sin(g.yaw), fz = Math.cos(g.yaw), rx = fz, rz = -fx;
    const posts = this.mat({ color: 0xf2f2f2, emissive: 0x000000, roughness: 0.5 });
    const tex = this.label(text);
    const banner = this.mat({ color: 0xffffff, map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.15, side: THREE.DoubleSide });
    const postGeo = this.geo(new THREE.CylinderGeometry(0.16, 0.2, 4.6, 8));
    let top = -Infinity;
    for (const s of [-1, 1]) {
      const x = g.x + rx * s * g.w / 2, z = g.z + rz * s * g.w / 2, y = heightAt(x, z);
      const p = new THREE.Mesh(postGeo, posts); p.position.set(x, y + 2.3, z); grp.add(p); top = Math.max(top, y + 4.4);
    }
    const b = new THREE.Mesh(this.geo(new THREE.PlaneGeometry(g.w, 1.6)), banner);
    b.position.set(g.x, top, g.z); b.rotation.y = g.yaw + Math.PI; grp.add(b); // text faces drivers approaching the gate
    this.group.add(grp); this.gates.push({ g: grp, banner, posts });
  }
  /** highlight the next gate, dim passed ones */
  /** lap length: with repeated laps only the current lap's gates are shown (no doubled banners) */
  lapLen = Infinity;
  setGateState(next: number) {
    this.gates.forEach((x, i) => {
      x.g.visible = i >= next && i < next + this.lapLen;
      const on = i === next;
      x.posts.color.set(on ? 0xffb03a : 0xf2f2f2); x.posts.emissive.set(on ? 0x7a4a00 : 0x000000);
      x.banner.emissiveIntensity = on ? 0.7 : 0.12; x.banner.color.set(on ? 0xffc060 : 0xb0b0b0); x.banner.emissive.set(on ? 0xffa628 : 0xffffff);
    });
  }
  addFlag(x: number, z: number) {
    const y = heightAt(x, z);
    const pole = new THREE.Mesh(this.geo(new THREE.CylinderGeometry(0.06, 0.06, 6, 8)), this.mat({ color: 0xdddddd, metalness: 0.6, roughness: 0.3 }));
    pole.position.set(x, y + 3, z);
    const cloth = new THREE.Mesh(this.geo(new THREE.PlaneGeometry(1.8, 1.1)), this.mat({ color: 0xe0321e, emissive: 0x5a0a00, side: THREE.DoubleSide }));
    cloth.position.set(x + 0.9, y + 5.4, z); this.group.add(pole, cloth);
  }
  addZone(x: number, z: number, r: number, color: number) {
    const y = heightAt(x, z);
    const ring = new THREE.Mesh(this.geo(new THREE.RingGeometry(r - 0.5, r, 48)), this.mat({ color, emissive: color, emissiveIntensity: 0.6, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x, y + 0.35, z);
    const pillarMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }); this.disposables.push(pillarMat);
    const pillar = new THREE.Mesh(this.geo(new THREE.CylinderGeometry(r, r, 14, 32, 1, true)), pillarMat);
    pillar.position.set(x, y + 7, z); this.group.add(ring, pillar);
  }
  addCamp(x: number, z: number) {
    const y = heightAt(x, z), canvas = this.mat({ color: 0x5f7a52, roughness: 0.9 }), crate = this.mat({ color: 0x8a6a3a, roughness: 0.8 });
    for (const [dx, dz, s] of [[-3, 2, 1.2], [2.5, 3, 1]] as const) {
      const t = new THREE.Mesh(this.geo(new THREE.ConeGeometry(1.6 * s, 2 * s, 4)), canvas); t.position.set(x + dx, heightAt(x + dx, z + dz) + s, z + dz); t.rotation.y = 0.6; this.group.add(t);
    }
    const fire = new THREE.Mesh(this.geo(new THREE.ConeGeometry(0.35, 0.8, 7)), this.mat({ color: 0xff7a1a, emissive: 0xff6a00, emissiveIntensity: 2 }));
    fire.position.set(x, y + 0.4, z - 2); this.group.add(fire);
    for (const [dx, dz] of [[3.5, -2], [4.1, -1.2]]) { const c = new THREE.Mesh(this.geo(new THREE.BoxGeometry(0.7, 0.6, 0.7)), crate); c.position.set(x + dx, heightAt(x + dx, z + dz) + 0.3, z + dz); this.group.add(c); }
  }
  setRope(a: THREE.Vector3 | null, b?: THREE.Vector3) {
    if (!this.rope) return;
    this.rope.visible = !!a;
    if (!a || !b) return;
    this.rope.position.copy(a); this.rope.lookAt(b); this.rope.scale.set(1, 1, a.distanceTo(b));
  }
  dispose() { this.scene.remove(this.group); for (const d of this.disposables) d.dispose(); }
}
