import * as THREE from 'three';
import type { Surface } from './terrain';

/** Ring buffer of instanced tyre-track decals. */
export class TrackMarks {
  private mesh: THREE.InstancedMesh;
  private i = 0;
  private M = new THREE.Matrix4();
  private Q = new THREE.Quaternion();
  private S = new THREE.Vector3(0.32, 1, 0.46);
  private C = new THREE.Color();
  count = 0;
  constructor(scene: THREE.Scene, private max = 1500) {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.mesh = new THREE.InstancedMesh(geo, mat, max);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.mesh);
  }
  add(p: THREE.Vector3, n: THREE.Vector3, fwd: THREE.Vector3, s: Surface) {
    const yaw = Math.atan2(fwd.x, fwd.z);
    const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const qTilt = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    this.Q.copy(qTilt).multiply(qYaw);
    this.M.compose(p.clone().addScaledVector(n, 0.03), this.Q, this.S);
    this.mesh.setMatrixAt(this.i, this.M);
    this.C.set(s === 'mud' ? 0x1a120b : 0xa88250);
    this.mesh.setColorAt(this.i, this.C);
    this.i = (this.i + 1) % this.max;
    this.count++;
    this.mesh.count = Math.min(this.max, Math.max(this.mesh.count, this.i === 0 ? this.max : this.i));
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}
