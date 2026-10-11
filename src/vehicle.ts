import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { surfaceAt, puddleAt, type Surface } from './terrain';
import { TrackMarks } from './tracks';
import { type VehicleSpec, type Mats } from './vehicles';

export interface DriveInput { throttle: number; brake: number; steer: number; handbrake: boolean; }

/** Per-surface handling. frictionSlip limits tyre grip (Rapier raycast vehicle);
 *  drag is a speed-proportional resistance (sinking into mud / ploughing sand). */
export const SURFACE_PARAMS: Record<Surface, { slip: number; side: number; drag: number; label: string }> = {
  ground: { slip: 1.5, side: 1.0, drag: 0.04, label: 'Dirt' },
  sand: { slip: 0.75, side: 0.7, drag: 0.28, label: 'Sand' },
  mud: { slip: 0.42, side: 0.45, drag: 0.55, label: 'Mud' },
};

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

  spec: VehicleSpec;
  private conn: { x: number; y: number; z: number }[];
  private world: RAPIER_NS.World;
  private scene: THREE.Scene;
  /** how high above the terrain the chassis centre must spawn so the wheels are not buried */
  spawnLift: number;
  private inertiaY = 4800;

  constructor(world: RAPIER_NS.World, R: typeof RAPIER_NS, scene: THREE.Scene, tracks: TrackMarks, spec: VehicleSpec, paint: number) {
    this.tracks = tracks; this.spec = spec; this.world = world; this.scene = scene;
    const W = spec.wheel;
    this.conn = [
      { x: W.x, y: W.y, z: W.zf }, { x: -W.x, y: W.y, z: W.zf }, // front left (+x is the vehicle's left), front right
      { x: W.x, y: W.y, z: W.zr }, { x: -W.x, y: W.y, z: W.zr }, // rear left, rear right
    ];
    this.spawnLift = Math.max(1.4, -(W.y - spec.susp.rest - W.r) + 0.15);
    const ch = spec.chassis, cab = spec.cabin;
    const inertia = spec.inertia ?? [
      (spec.mass / 12) * ((2 * ch.hy) ** 2 + (2 * ch.hz) ** 2) * 1.5,
      (spec.mass / 12) * ((2 * ch.hx) ** 2 + (2 * ch.hz) ** 2) * 1.5,
      (spec.mass / 12) * ((2 * ch.hx) ** 2 + (2 * ch.hy) ** 2) * 2.2,
    ];
    const bd = R.RigidBodyDesc.dynamic().setTranslation(0, 2, 0).setCanSleep(false)
      .setLinearDamping(0.02).setAngularDamping(0.4);
    this.body = world.createRigidBody(bd);
    // main chassis collider; explicit mass props with a low centre of mass for stability
    const cd = R.ColliderDesc.cuboid(ch.hx, ch.hy, ch.hz).setTranslation(0, ch.y, 0).setFriction(0.4)
      .setMassProperties(spec.mass, { x: spec.com[0], y: spec.com[1], z: spec.com[2] }, { x: inertia[0], y: inertia[1], z: inertia[2] }, { x: 0, y: 0, z: 0, w: 1 });
    world.createCollider(cd, this.body);
    this.inertiaY = inertia[1];
    world.createCollider(R.ColliderDesc.cuboid(cab.hx, cab.hy, cab.hz).setTranslation(0, cab.y, cab.z).setDensity(0), this.body);

    this.ctrl = world.createVehicleController(this.body);
    this.ctrl.indexUpAxis = 1;
    this.ctrl.setIndexForwardAxis = 2; // forward = +Z in chassis space
    for (let i = 0; i < 4; i++) {
      const c = this.conn[i], su = spec.susp;
      this.ctrl.addWheel(c, { x: 0, y: -1, z: 0 }, { x: -1, y: 0, z: 0 }, su.rest, W.r);
      this.ctrl.setWheelSuspensionStiffness(i, su.stiffness);
      this.ctrl.setWheelSuspensionCompression(i, su.compression);
      this.ctrl.setWheelSuspensionRelaxation(i, su.relaxation);
      this.ctrl.setWheelMaxSuspensionTravel(i, su.travel);
      this.ctrl.setWheelMaxSuspensionForce(i, 120000 * (spec.mass / 1650));
      this.ctrl.setWheelFrictionSlip(i, SURFACE_PARAMS.ground.slip);
      this.ctrl.setWheelSideFrictionStiffness(i, 1);
    }
    this.buildModel(paint);
    scene.add(this.group);
  }

  /** Remove physics body, controller and visuals (used when switching vehicles in the garage). */
  dispose() {
    this.world.removeVehicleController(this.ctrl);
    this.world.removeRigidBody(this.body);
    this.scene.remove(this.group);
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if ((o as THREE.SpotLight).isSpotLight) (o as THREE.SpotLight).dispose();
    });
    for (const mat of this.mats) mat.dispose();
  }
  private mats: THREE.Material[] = [];
  setPaint(hex: number) { this.paint.color.set(hex); }

  private buildModel(paintHex: number) {
    const g = this.group, spec = this.spec;
    const m: Mats = {
      paint: this.paint = new THREE.MeshStandardMaterial({ color: paintHex, roughness: 0.45, metalness: 0.35 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x1d1f21, roughness: 0.8, metalness: 0.2 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x223040, roughness: 0.1, metalness: 0.6 }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xbfc3c7, roughness: 0.25, metalness: 0.9 }),
      lamp: this.lampMat = new THREE.MeshStandardMaterial({ color: 0xfff6d8, emissive: 0xfff1c0, emissiveIntensity: 2.0 }),
      tail: new THREE.MeshStandardMaterial({ color: 0x700000, emissive: 0xff1a1a, emissiveIntensity: 1.2 }),
      accent: new THREE.MeshStandardMaterial({ color: 0xece8de, roughness: 0.5, metalness: 0.1 }),
      amber: new THREE.MeshStandardMaterial({ color: 0x7a4a00, emissive: 0xffa000, emissiveIntensity: 1.5 }),
    };
    this.mats.push(...Object.values(m));
    spec.build(g, m, spec);
    const chrome = m.chrome;
    const WHEEL_R = spec.wheel.r, WW = spec.wheel.w;

    // wheels
    const tyreGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, WW, 22);
    tyreGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(WHEEL_R * 0.55, WHEEL_R * 0.55, WW + 0.02, 8);
    rimGeo.rotateZ(Math.PI / 2);
    const lugGeo = new THREE.BoxGeometry(WW + 0.02, 0.08, 0.12);
    const tyreMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 });
    this.mats.push(tyreMat);
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
    const L = spec.lamp;
    for (const x of [-L.x, L.x]) {
      const s = new THREE.SpotLight(0xfff1d0, 0, 45, 0.5, 0.5, 1.2);
      s.position.set(x, L.y, L.z);
      s.target.position.set(x * 1.5, -0.6, L.z + 10);
      g.add(s, s.target);
      this.headlights.push(s);
    }
    this.beam = new THREE.SpotLight(0xfff1d0, 0, 70, 0.42, 0.6, 1.0);
    this.beam.position.set(0, L.y + 0.25, L.z);
    this.beam.target.position.set(0, -1, L.z + 14);
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
    const sp0 = this.spec;
    const maxSteer = sp0.steerLow - (sp0.steerLow - sp0.steerHigh) * Math.min(1, Math.abs(speed) / 28);
    const target = inp.steer * maxSteer;
    this.steer += (target - this.steer) * Math.min(1, dt * 8);

    // drive / brake / reverse logic
    let engine = 0, brake = 0;
    const bs = sp0.mass / 1650; // brake impulses scale with mass
    if (inp.throttle > 0.01) {
      if (speed < -0.8) brake = 70 * bs * inp.throttle;
      else engine = sp0.engine * inp.throttle * Math.max(0, 1 - Math.max(0, speed) / sp0.topSpeed);
    }
    if (inp.brake > 0.01) {
      if (speed > 0.8) brake = Math.max(brake, 70 * bs * inp.brake);
      else if (inp.throttle <= 0.01) engine = -sp0.engine * 0.6 * inp.brake * Math.max(0, 1 - Math.max(0, -speed) / sp0.reverse);
    }
    if (inp.throttle <= 0.01 && inp.brake <= 0.01) brake = 4 * bs; // engine braking / rolling resistance

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
      const surf = s ?? 'ground';
      const gripK = sp0.grip[surf] * sp.slip;
      const dragK = sp.drag * (surf === 'ground' ? 1 : sp0.drag[surf]);
      dragSum += inContact ? dragK + (this.inPuddle[i] ? 0.35 : 0) : 0;
      // slip estimate: requested drive force vs available grip (Rapier clamps the forward impulse at
      // suspensionForce * frictionSlip) plus sideways sliding
      if (inContact) {
        const grip = (ctrl.wheelSuspensionForce(i) ?? 0) * gripK;
        const req = Math.abs(engine) + (inp.handbrake && i >= 2 ? 3000 * bs : 0);
        const lon = req > grip && req > 0 ? (req - grip) / req : 0;
        this.slip[i] = Math.min(1, lon + latV / 7);
      } else this.slip[i] = 0;
      const rear = i >= 2;
      ctrl.setWheelFrictionSlip(i, gripK);
      ctrl.setWheelSideFrictionStiffness(i, sp.side * sp0.side * (rear && inp.handbrake ? 0.35 : 1));
      ctrl.setWheelSteering(i, rear ? 0 : this.steer);
      ctrl.setWheelEngineForce(i, engine / 1); // per wheel (4WD)
      ctrl.setWheelBrake(i, rear && inp.handbrake ? 160 * bs : brake);
      // visual wheel-spin on loose surfaces under power
      this.extraSpin[i] += Math.sign(engine) * (inContact ? this.slip[i] : Math.abs(engine) / sp0.engine) * dt * 20;
    }
    ctrl.updateVehicle(dt);

    // simple automatic gearbox -> engine RPM for audio/HUD
    this.throttle = Math.max(inp.throttle, engine < 0 ? inp.brake : 0);
    const kmh = Math.abs(speed) * 3.6;
    const gk = (sp0.topSpeed * 3.6) / 130;
    const GEARS = [0, 18, 36, 58, 82, 108, 140].map((g) => g * gk);
    let gI = 1; while (gI < GEARS.length - 1 && kmh > GEARS[gI]) gI++;
    this.gear = speed < -0.5 ? -1 : gI;
    const lo = GEARS[gI - 1], hi = GEARS[gI];
    const avgSlip = (this.slip[0] + this.slip[1] + this.slip[2] + this.slip[3]) / 4;
    const frac = Math.min(1, (kmh - lo) / (hi - lo));
    let rpmT = gI === 1 ? 900 + frac * 4300 : 2400 + frac * 2800;
    rpmT += this.throttle * (900 + avgSlip * 2600) * (contacts ? 1 : 2.5);
    rpmT = Math.min(6500, Math.max(850, rpmT));
    this.rpm += (rpmT - this.rpm) * Math.min(1, dt * 6);

    // arcade steering assist: a yaw torque proportional to steering input that fades in with speed,
    // so the vehicle turns more readily at speed than raw tyre grip would allow (only with >=3 wheels down)
    if (contacts >= 3 && Math.abs(speed) > 2 && sp0.assist > 0) {
      const rq = this.body.rotation();
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(new THREE.Quaternion(rq.x, rq.y, rq.z, rq.w));
      const w = this.body.angvel(); const yawRate = w.x * up.x + w.y * up.y + w.z * up.z;
      const fade = Math.min(1, (Math.abs(speed) - 2) / 12);
      const want = inp.steer * sp0.assist * fade * Math.sign(speed);
      // don't add more once the yaw rate already exceeds ~1.1 rad/s in that direction (prevents spins)
      const room = Math.max(0, 1.1 - Math.sign(want) * yawRate);
      const tq = (this.inertiaY * want * Math.min(1, room)) * dt;
      this.body.applyTorqueImpulse({ x: up.x * tq, y: up.y * tq, z: up.z * tq }, true);
    }

    // surface resistance (mud suction, sand ploughing) + light aero drag
    if (contacts > 0) {
      const v = this.body.linvel();
      const k = (dragSum / 4) * sp0.mass;
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
      const c = this.conn[i];
      const len = this.ctrl.wheelSuspensionLength(i) ?? this.spec.susp.rest;
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
