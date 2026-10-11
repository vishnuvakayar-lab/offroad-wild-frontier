import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { surfaceAt, puddleAt, type Surface } from './terrain';
import { TrackMarks } from './tracks';

export interface DriveInput { throttle: number; brake: number; steer: number; handbrake: boolean; }

/** Per-surface handling. frictionSlip limits tyre grip (Rapier raycast vehicle);
 *  drag is a speed-proportional resistance (sinking into mud / ploughing sand). */
export const SURFACE_PARAMS: Record<Surface, { slip: number; side: number; drag: number; label: string }> = {
  ground: { slip: 1.5, side: 1.0, drag: 0.04, label: 'Dirt' },
  sand: { slip: 0.75, side: 0.7, drag: 0.28, label: 'Sand' },
  mud: { slip: 0.42, side: 0.45, drag: 0.55, label: 'Mud' },
};

const MASS = 1650;
const WHEEL_R = 0.43;
const REST = 0.38;
const CONN = [
  { x: 0.98, y: -0.25, z: 1.42 },  // front left (+x is the vehicle's left)
  { x: -0.98, y: -0.25, z: 1.42 }, // front right
  { x: 0.98, y: -0.25, z: -1.42 }, // rear left
  { x: -0.98, y: -0.25, z: -1.42 },// rear right
];
const ENGINE_FORCE = 4600; // N per wheel at low speed (4WD)
const MAX_SPEED = 36;      // m/s ~ 130 km/h
const REVERSE_MAX = 9;

export class Vehicle {
  body: RAPIER_NS.RigidBody;
  ctrl: RAPIER_NS.DynamicRayCastVehicleController;
  group = new THREE.Group();
  wheelMeshes: THREE.Object3D[] = [];
  steer = 0;
  surfaces: (Surface | null)[] = [null, null, null, null];
  private extraSpin = [0, 0, 0, 0];
  private tracks: TrackMarks;
  headlights: THREE.SpotLight[] = [];
  /** shadow-casting centre beam used at night / in fog */
  beam!: THREE.SpotLight;
  paint!: THREE.MeshStandardMaterial;
  lampMat!: THREE.MeshStandardMaterial;
  /** per-wheel telemetry for particles/audio */
  slip = [0, 0, 0, 0];
  contact: (THREE.Vector3 | null)[] = [null, null, null, null];
  inPuddle = [false, false, false, false];
  throttle = 0;
  rpm = 900;
  gear = 1;

  constructor(world: RAPIER_NS.World, R: typeof RAPIER_NS, scene: THREE.Scene, tracks: TrackMarks) {
    this.tracks = tracks;
    const bd = R.RigidBodyDesc.dynamic().setTranslation(0, 2, 0).setCanSleep(false)
      .setLinearDamping(0.02).setAngularDamping(0.4);
    this.body = world.createRigidBody(bd);
    // main chassis collider; explicit mass props with a low centre of mass for stability
    const cd = R.ColliderDesc.cuboid(0.95, 0.42, 2.25).setTranslation(0, 0.1, 0).setFriction(0.4)
      .setMassProperties(MASS, { x: 0, y: -0.35, z: 0.05 }, { x: 4200, y: 4800, z: 1300 }, { x: 0, y: 0, z: 0, w: 1 });
    world.createCollider(cd, this.body);
    world.createCollider(R.ColliderDesc.cuboid(0.85, 0.35, 1.2).setTranslation(0, 0.85, -0.3).setDensity(0), this.body);

    this.ctrl = world.createVehicleController(this.body);
    this.ctrl.indexUpAxis = 1;
    this.ctrl.setIndexForwardAxis = 2; // forward = +Z in chassis space
    for (let i = 0; i < 4; i++) {
      const c = CONN[i];
      this.ctrl.addWheel(c, { x: 0, y: -1, z: 0 }, { x: -1, y: 0, z: 0 }, REST, WHEEL_R);
      this.ctrl.setWheelSuspensionStiffness(i, 28);
      this.ctrl.setWheelSuspensionCompression(i, 2.6);
      this.ctrl.setWheelSuspensionRelaxation(i, 3.2);
      this.ctrl.setWheelMaxSuspensionTravel(i, 0.32);
      this.ctrl.setWheelMaxSuspensionForce(i, 120000);
      this.ctrl.setWheelFrictionSlip(i, SURFACE_PARAMS.ground.slip);
      this.ctrl.setWheelSideFrictionStiffness(i, 1);
    }
    this.buildModel();
    scene.add(this.group);
  }

  private buildModel() {
    const g = this.group;
    const paint = this.paint = new THREE.MeshStandardMaterial({ color: 0xb8823a, roughness: 0.45, metalness: 0.35 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1d1f21, roughness: 0.8, metalness: 0.2 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x223040, roughness: 0.1, metalness: 0.6 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xbfc3c7, roughness: 0.25, metalness: 0.9 });
    const lamp = this.lampMat = new THREE.MeshStandardMaterial({ color: 0xfff6d8, emissive: 0xfff1c0, emissiveIntensity: 2.0 });
    const tail = new THREE.MeshStandardMaterial({ color: 0x700000, emissive: 0xff1a1a, emissiveIntensity: 1.2 });
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.x = rx;
      m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
    };
    // lower body + boxy expedition cabin (original design)
    add(new THREE.BoxGeometry(1.9, 0.7, 4.4), paint, 0, 0.15, 0);
    add(new THREE.BoxGeometry(1.8, 0.75, 2.6), paint, 0, 0.85, -0.45);
    add(new THREE.BoxGeometry(1.82, 0.5, 2.3), glass, 0, 0.9, -0.4);           // window band
    add(new THREE.BoxGeometry(1.84, 0.08, 2.65), paint, 0, 1.24, -0.45);       // roof skin
    add(new THREE.BoxGeometry(1.7, 0.6, 0.08), glass, 0, 0.88, 0.86, -0.25);   // windscreen
    add(new THREE.BoxGeometry(1.86, 0.18, 4.5), dark, 0, -0.12, 0);            // rocker / cladding
    // bonnet bulge
    add(new THREE.BoxGeometry(1.4, 0.08, 1.3), paint, 0, 0.54, 1.45);
    // roof rack
    add(new THREE.BoxGeometry(1.7, 0.06, 2.2), dark, 0, 1.38, -0.45);
    for (const x of [-0.82, 0.82]) add(new THREE.BoxGeometry(0.06, 0.12, 2.2), dark, x, 1.42, -0.45);
    // bull bar + bumpers
    add(new THREE.BoxGeometry(1.95, 0.22, 0.25), dark, 0, -0.05, 2.28);
    add(new THREE.BoxGeometry(1.2, 0.08, 0.08), chrome, 0, 0.35, 2.38);
    for (const x of [-0.55, 0.55]) add(new THREE.BoxGeometry(0.08, 0.45, 0.08), chrome, x, 0.15, 2.38);
    add(new THREE.BoxGeometry(1.95, 0.22, 0.2), dark, 0, -0.05, -2.25);
    // lights
    for (const x of [-0.7, 0.7]) add(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 14), lamp, x, 0.35, 2.21, Math.PI / 2);
    for (const x of [-0.85, 0.85]) add(new THREE.BoxGeometry(0.14, 0.24, 0.04), tail, x, 0.32, -2.21);
    // spare wheel on the tailgate
    add(new THREE.CylinderGeometry(0.4, 0.4, 0.25, 20), dark, 0, 0.6, -2.35, Math.PI / 2);
    // fender flares
    for (const c of CONN) add(new THREE.BoxGeometry(0.22, 0.12, 1.15), dark, Math.sign(c.x) * 0.98, 0.42, c.z);
    // snorkel
    add(new THREE.BoxGeometry(0.1, 0.9, 0.1), dark, 0.93, 0.85, 1.0);

    // wheels
    const tyreGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.34, 22);
    tyreGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(WHEEL_R * 0.55, WHEEL_R * 0.55, 0.36, 8);
    rimGeo.rotateZ(Math.PI / 2);
    const lugGeo = new THREE.BoxGeometry(0.36, 0.08, 0.12);
    const tyreMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 });
    for (let i = 0; i < 4; i++) {
      const pivot = new THREE.Group();      // steering + suspension
      const spin = new THREE.Group();       // rolling
      const t = new THREE.Mesh(tyreGeo, tyreMat); t.castShadow = true;
      const r = new THREE.Mesh(rimGeo, chrome);
      spin.add(t, r);
      for (let k = 0; k < 8; k++) {         // chunky tread blocks so rotation is visible
        const lug = new THREE.Mesh(lugGeo, tyreMat);
        const a = (k / 8) * Math.PI * 2;
        lug.position.set(0, Math.cos(a) * WHEEL_R, Math.sin(a) * WHEEL_R);
        lug.rotation.x = -a;
        spin.add(lug);
      }
      pivot.add(spin);
      g.add(pivot);
      this.wheelMeshes.push(pivot);
    }
    // headlights (enabled on med/high presets)
    for (const x of [-0.7, 0.7]) {
      const s = new THREE.SpotLight(0xfff1d0, 0, 45, 0.5, 0.5, 1.2);
      s.position.set(x, 0.35, 2.3);
      s.target.position.set(x * 1.5, -0.6, 12);
      g.add(s, s.target);
      this.headlights.push(s);
    }
    this.beam = new THREE.SpotLight(0xfff1d0, 0, 70, 0.42, 0.6, 1.0);
    this.beam.position.set(0, 0.6, 2.3);
    this.beam.target.position.set(0, -1, 16);
    this.beam.shadow.mapSize.set(1024, 1024);
    this.beam.shadow.camera.near = 0.5; this.beam.shadow.camera.far = 70; this.beam.shadow.bias = -0.0008;
    g.add(this.beam, this.beam.target);
  }

  reset(x: number, y: number, z: number, yaw: number) {
    this.body.setTranslation({ x, y, z }, true);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
    this.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.steer = 0;
    this.tracks.reset();
  }

  forward(out = new THREE.Vector3()) {
    const r = this.body.rotation();
    return out.set(0, 0, 1).applyQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w));
  }

  /** forward speed in m/s (signed) */
  forwardSpeed() {
    const v = this.body.linvel();
    const f = this.forward();
    return v.x * f.x + v.y * f.y + v.z * f.z;
  }

  /** Dominant surface under the wheels that are touching the ground. */
  surface(): Surface {
    const c: Record<Surface, number> = { ground: 0, mud: 0, sand: 0 };
    let any = false;
    for (const s of this.surfaces) if (s) { c[s]++; any = true; }
    if (!any) return 'ground';
    return (Object.keys(c) as Surface[]).reduce((a, b) => (c[b] > c[a] ? b : a));
  }

  step(dt: number, inp: DriveInput) {
    const ctrl = this.ctrl;
    const speed = this.forwardSpeed();
    // speed-sensitive steering, smoothed
    const maxSteer = 0.6 - 0.42 * Math.min(1, Math.abs(speed) / 28);
    const target = inp.steer * maxSteer;
    this.steer += (target - this.steer) * Math.min(1, dt * 8);

    // drive / brake / reverse logic
    let engine = 0, brake = 0;
    if (inp.throttle > 0.01) {
      if (speed < -0.8) brake = 70 * inp.throttle;
      else engine = ENGINE_FORCE * inp.throttle * Math.max(0, 1 - Math.max(0, speed) / MAX_SPEED);
    }
    if (inp.brake > 0.01) {
      if (speed > 0.8) brake = Math.max(brake, 70 * inp.brake);
      else if (inp.throttle <= 0.01) engine = -ENGINE_FORCE * 0.6 * inp.brake * Math.max(0, 1 - Math.max(0, -speed) / REVERSE_MAX);
    }
    if (inp.throttle <= 0.01 && inp.brake <= 0.01) brake = 4; // engine braking / rolling resistance

    let contacts = 0, dragSum = 0;
    const v = this.body.linvel();
    const r = this.body.rotation();
    const right = new THREE.Vector3(-1, 0, 0).applyQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w));
    const latV = Math.abs(v.x * right.x + v.y * right.y + v.z * right.z);
    for (let i = 0; i < 4; i++) {
      const inContact = ctrl.wheelIsInContact(i);
      let s: Surface | null = null;
      this.inPuddle[i] = false;
      if (inContact) {
        const p = ctrl.wheelContactPoint(i);
        s = p ? surfaceAt(p.x, p.z) : 'ground';
        if (p) { (this.contact[i] ??= new THREE.Vector3()).set(p.x, p.y, p.z); this.inPuddle[i] = !!puddleAt(p.x, p.z); }
        contacts++;
      } else this.contact[i] = null;
      this.surfaces[i] = s;
      const sp = SURFACE_PARAMS[s ?? 'ground'];
      dragSum += inContact ? sp.drag + (this.inPuddle[i] ? 0.35 : 0) : 0;
      // slip estimate: requested drive force vs available grip (Rapier clamps the forward impulse at
      // suspensionForce * frictionSlip) plus sideways sliding
      if (inContact) {
        const grip = (ctrl.wheelSuspensionForce(i) ?? 0) * sp.slip;
        const req = Math.abs(engine) + (inp.handbrake && i >= 2 ? 3000 : 0);
        const lon = req > grip && req > 0 ? (req - grip) / req : 0;
        this.slip[i] = Math.min(1, lon + latV / 7);
      } else this.slip[i] = 0;
      const rear = i >= 2;
      ctrl.setWheelFrictionSlip(i, sp.slip);
      ctrl.setWheelSideFrictionStiffness(i, sp.side * (rear && inp.handbrake ? 0.35 : 1));
      ctrl.setWheelSteering(i, rear ? 0 : this.steer);
      ctrl.setWheelEngineForce(i, engine / 1); // per wheel (4WD)
      ctrl.setWheelBrake(i, rear && inp.handbrake ? 160 : brake);
      // visual wheel-spin on loose surfaces under power
      this.extraSpin[i] += Math.sign(engine) * (inContact ? this.slip[i] : Math.abs(engine) / ENGINE_FORCE) * dt * 20;
    }
    ctrl.updateVehicle(dt);

    // simple automatic gearbox -> engine RPM for audio/HUD
    this.throttle = Math.max(inp.throttle, engine < 0 ? inp.brake : 0);
    const kmh = Math.abs(speed) * 3.6;
    const GEARS = [0, 18, 36, 58, 82, 108, 140];
    let gI = 1; while (gI < GEARS.length - 1 && kmh > GEARS[gI]) gI++;
    this.gear = speed < -0.5 ? -1 : gI;
    const lo = GEARS[gI - 1], hi = GEARS[gI];
    const avgSlip = (this.slip[0] + this.slip[1] + this.slip[2] + this.slip[3]) / 4;
    const frac = Math.min(1, (kmh - lo) / (hi - lo));
    let rpmT = gI === 1 ? 900 + frac * 4300 : 2400 + frac * 2800;
    rpmT += this.throttle * (900 + avgSlip * 2600) * (contacts ? 1 : 2.5);
    rpmT = Math.min(6500, Math.max(850, rpmT));
    this.rpm += (rpmT - this.rpm) * Math.min(1, dt * 6);

    // surface resistance (mud suction, sand ploughing) + light aero drag
    if (contacts > 0) {
      const v = this.body.linvel();
      const k = (dragSum / 4) * MASS;
      const vh = Math.hypot(v.x, v.z);
      const aero = 0.45 * vh;
      this.body.applyImpulse({ x: -(k + aero) * v.x * dt, y: 0, z: -(k + aero) * v.z * dt }, true);
    }
  }

  /** Copy physics state to visuals; also lay tyre tracks on soft ground. */
  sync() {
    const t = this.body.translation(), r = this.body.rotation();
    this.group.position.set(t.x, t.y, t.z);
    this.group.quaternion.set(r.x, r.y, r.z, r.w);
    for (let i = 0; i < 4; i++) {
      const c = CONN[i];
      const len = this.ctrl.wheelSuspensionLength(i) ?? REST;
      const w = this.wheelMeshes[i];
      w.position.set(c.x, c.y - len, c.z);
      w.rotation.y = i < 2 ? this.steer : 0;
      const spin = w.children[0];
      spin.rotation.x = (this.ctrl.wheelRotation(i) ?? 0) + this.extraSpin[i];
      // continuous tyre tracks on soft ground
      const s = this.surfaces[i];
      if (s && s !== 'ground' && this.ctrl.wheelIsInContact(i) && !this.inPuddle[i]) {
        const p = this.ctrl.wheelContactPoint(i);
        if (p) {
          const n = this.ctrl.wheelContactNormal(i);
          this.tracks.add(i, new THREE.Vector3(p.x, p.y, p.z), n ? new THREE.Vector3(n.x, n.y, n.z) : new THREE.Vector3(0, 1, 0), this.forward(), s);
        }
      } else this.tracks.lift(i);
    }
  }
}
