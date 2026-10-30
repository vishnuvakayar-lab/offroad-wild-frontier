import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { surfaceAt, puddleAt, type Surface } from './terrain';
import { TrackMarks } from './tracks';
import { type VehicleSpec, vehicleById } from './vehicles';
import { Kit, mergeStatic, type Mats, type Lod } from './kit';
import { powertrainFor, engineTorque, engineDrag, physSurface, SURF, magic, type Powertrain, type PhysSurface } from './physics';
import { PROFILES, type DriveProfile, type ProfileId } from './profiles';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface DriveInput { throttle: number; brake: number; steer: number; handbrake: boolean; }
/** Transfer case: 2H = rear-wheel drive, 4H = 50/50 front/rear, 4L = 4H through a low-range reduction, AWD = permanent (no low range). */
export type Transfer = '2H' | '4H' | '4L' | 'AWD';
/** Transmission selector: A = automatic (brake at standstill engages reverse), or manual P / R / N / D. */
export type GearSel = 'A' | 'P' | 'R' | 'N' | 'D';
/** user-facing speed limiter setpoints (m/s): the limiter only closes the throttle (no velocity clamping) */
export const NORMAL_CAP_MIN = 40 / 3.6, NORMAL_CAP_MAX = 60 / 3.6, LOW_SPEED_CAP = 25 / 3.6, REVERSE_CAP = 14 / 3.6;
export const PEDAL_RAMP_S = 0.25;
export type SpeedMode = 'normal' | 'low' | 'off';
/** per-vehicle NORMAL limiter setpoint (km/h pace of the previous builds): clamped to 40..60 km/h */
export const normalCap = (top: number) => Math.min(NORMAL_CAP_MAX, Math.max(NORMAL_CAP_MIN, top * 0.46));
export const SHIFT_ON_FLY_KMH = 60;
export const LOW_RANGE_MAX_KMH = 8;    // 4L in/out only when stopped or creeping below this speed    // 2H <-> 4H allowed below this speed
export const DIR_SHIFT_KMH = 2;        // D <-> R only below this speed
export interface ShiftResult { ok: boolean; msg: string }

/** Per-surface handling. frictionSlip limits tyre grip (Rapier raycast vehicle);
 *  drag is a speed-proportional resistance (sinking into mud / ploughing sand). */
export const SURFACE_PARAMS: Record<Surface, { label: string }> = { ground: { label: 'Dirt' }, sand: { label: 'Sand' }, mud: { label: 'Mud' }, rock: { label: 'Rock' } };

export class Vehicle {
  body: RAPIER_NS.RigidBody;
  ctrl: RAPIER_NS.DynamicRayCastVehicleController;
  group = new THREE.Group();
  /** sprung part of the visual model (pitch under braking/acceleration, roll in corners) */
  bodyVis = new THREE.Group();
  tailMat: THREE.MeshStandardMaterial | null = null;
  /** filtered local acceleration (x = lateral, +left; z = longitudinal, +forward) and body lean (rad) */
  accLocal = new THREE.Vector2(); lean = { pitch: 0, roll: 0, vp: 0, vr: 0 }; braking = false;
  private lastV: { x: number; y: number; z: number } | null = null;
  wheelMeshes: THREE.Object3D[] = [];
  steer = 0;
  /** 0.8.0: driving profile (scales physics) + wetness 0..1 (rain lowers hard-ground grip) */
  profile: DriveProfile = PROFILES.pro; wet = 0;
  static defaultProfile: ProfileId = 'pro';
  /** landing / impact feedback for the camera: last frame's vertical jolt (m/s) */
  landJolt = 0; private lastVy = 0;
  /** cockpit: steering wheel (rotates with steering), driver eye point in vehicle space */
  steeringWheel: THREE.Group | null = null;
  /** on-screen wheel angle (deg, + = clockwise = right) mirrored 1:1 by the 3D wheel; null = follow the road-wheel angle */
  wheelDegOverride: number | null = null;
  eye = new THREE.Vector3(0.36, 1, 0);
  private glassMat: THREE.MeshStandardMaterial | null = null;
  surfaces: (Surface | null)[] = [null, null, null, null];
  private extraSpin = [0, 0, 0, 0];
  private tracks: TrackMarks;
  headlights: THREE.SpotLight[] = [];
  /** shadow-casting centre beam used at night / in fog */
  beam!: THREE.SpotLight;
  paint!: THREE.MeshStandardMaterial;
  lampMat!: THREE.MeshStandardMaterial;
  rearGlow!: THREE.PointLight; lightsOn = false;
  static speedMode: SpeedMode = 'normal';
  /** test hook: force one tyre surface everywhere (null = terrain) */
  static forceSurf: PhysSurface | null = null;
  thrRamp = 0; capKmh = 0;
  /** per-wheel telemetry for particles/audio */
  slip = [0, 0, 0, 0];
  contact: (THREE.Vector3 | null)[] = [null, null, null, null];
  inPuddle = [false, false, false, false];
  throttle = 0;
  rpm = 900;
  gear = 1;
  /** drivetrain state */
  transfer: Transfer = '4H'; sel: GearSel = 'A';
  /** per-wheel drive force applied in the last step (N), for tests / HUD */
  wheelForce = [0, 0, 0, 0];
  /** drivetrain output per wheel before the traction limit (engine force x ratio x split) */
  wheelReq = [0, 0, 0, 0];
  /** wheel angular speed (rad/s) from the physics wheels */
  wheelRate = [0, 0, 0, 0];
  // (lastRot removed in 0.9.0)
  ratio = 1; engineForce = 0;

  spec: VehicleSpec;
  private conn: { x: number; y: number; z: number }[];
  private world: RAPIER_NS.World;
  private scene: THREE.Scene;
  /** how high above the terrain the chassis centre must spawn so the wheels are not buried */
  spawnLift: number;
  inertiaY = 4800;

  /** `headless` (multiplayer server): physics only, no visual model. */
  readonly headless: boolean;
  constructor(world: RAPIER_NS.World, R: typeof RAPIER_NS, scene: THREE.Scene | null, tracks: TrackMarks | null, spec: VehicleSpec, paint: number, lod: Lod = 1, headless = false) {
    this.headless = headless;
    this.lod = lod;
    this.tracks = tracks as TrackMarks; this.spec = spec; this.world = world; this.scene = scene as THREE.Scene;
    this.transfer = this.driveModes.includes('4H') ? '4H' : this.driveModes[0];
    const W = spec.wheel;
    this.conn = [
      { x: W.x, y: W.y, z: W.zf }, { x: -W.x, y: W.y, z: W.zf }, // front left (+x is the vehicle's left), front right
      { x: W.x, y: W.y, z: W.zr }, { x: -W.x, y: W.y, z: W.zr }, // rear left, rear right
    ];
    this.pt = powertrainFor(spec.id);
    this.spawnLift = Math.max(1.4, -(W.y - spec.susp.rest - W.r) + 0.15);
    const ch = spec.chassis, cab = spec.cabin;
    const inertia = spec.inertia ?? [
      (spec.mass / 12) * ((2 * ch.hy) ** 2 + (2 * ch.hz) ** 2) * 1.5,
      (spec.mass / 12) * ((2 * ch.hx) ** 2 + (2 * ch.hz) ** 2) * 1.5,
      (spec.mass / 12) * ((2 * ch.hx) ** 2 + (2 * ch.hy) ** 2) * 2.2,
    ];
    const bd = R.RigidBodyDesc.dynamic().setTranslation(0, 2, 0).setCanSleep(false)
      .setLinearDamping(0).setAngularDamping(0.05); // no artificial damping: resistance comes from tyres, aero and suspension
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
      // Rapier only supplies the spring/damper suspension; all tyre forces come from the tyre model in step()
      this.ctrl.setWheelFrictionSlip(i, 0);
      this.ctrl.setWheelSideFrictionStiffness(i, 0);
    }
    if (!headless) { this.setProfile(Vehicle.defaultProfile); this.buildModel(paint); scene!.add(this.group); }
  }

  /** Remove physics body, controller and visuals (used when switching vehicles in the garage). */
  dispose() {
    this.world.removeVehicleController(this.ctrl);
    this.world.removeRigidBody(this.body);
    if (this.headless) return;
    this.scene.remove(this.group);
    this.disposeVisual();
  }
  private mats: THREE.Material[] = [];
  private geos: THREE.BufferGeometry[] = [];
  setPaint(hex: number) { this.paint?.color.set(hex); }
  /** visual level of detail (0 = Low preset) */
  lod: Lod = 1;
  /** 0..1 mud build-up on the lower body (cosmetic) */
  dirt = 0;
  private dirtU = { value: 0 };
  private shocks: THREE.InstancedMesh | null = null;
  private springs: THREE.InstancedMesh | null = null;
  private links: THREE.InstancedMesh | null = null;
  private calipers: THREE.Object3D[] = [];
  private envTex: THREE.Texture | null = null;

  /** Reflection map for paint/glass/chrome (car materials only) and its strength. */
  setEnv(tex: THREE.Texture | null, intensity: number) {
    this.envTex = tex;
    for (const m of this.mats) {
      const sm = m as THREE.MeshStandardMaterial;
      if (!('envMapIntensity' in sm)) continue;
      if (sm.envMap !== tex) { sm.envMap = tex; sm.needsUpdate = true; }
      sm.envMapIntensity = intensity * ((sm.userData.envK as number) ?? 1);
    }
  }
  /** Swap the visual model (e.g. preset change) without touching physics. */
  rebuildVisual(lod: Lod) {
    const paint = this.paint.color.getHex();
    this.disposeVisual();
    this.lod = lod;
    this.buildModel(paint);
    if (this.envTex) this.setEnv(this.envTex, 1);
  }
  private disposeVisual() {
    for (const o of [...this.group.children]) this.group.remove(o);
    this.group.traverse(() => {});
    for (const g of this.geos) g.dispose();
    for (const l of [...this.headlights, this.beam]) l?.dispose();
    for (const m of this.mats) m.dispose();
    this.geos = []; this.mats = []; this.headlights = []; this.wheelMeshes = []; this.calipers = [];
    this.shocks = this.springs = this.links = null;
  }
  /** Mesh / triangle counts of the visual model (each visible mesh = one draw call per pass). */
  modelStats() {
    let draws = 0, tris = 0; const parts: { name: string; mat: string; color: number; tris: number }[] = [];
    this.group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.visible) return;
      const g = mesh.geometry, n = g.index ? g.index.count : g.attributes.position.count;
      const t = (n / 3) * ((mesh as THREE.InstancedMesh).isInstancedMesh ? (mesh as THREE.InstancedMesh).count : 1);
      draws++; tris += t;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      parts.push({ name: mesh.name, mat: mat.name, color: mat.color?.getHex() ?? 0, tris: t });
    });
    return { draws, tris: Math.round(tris), parts };
  }

  private buildModel(paintHex: number) {
    const g = this.group, spec = this.spec, hi = this.lod > 0;
    const std = (name: string, o: THREE.MeshStandardMaterialParameters, envK = 1) => {
      const m = new THREE.MeshStandardMaterial(o); m.name = name; m.userData.envK = envK; return m;
    };
    const paint = hi
      ? new THREE.MeshPhysicalMaterial({ color: paintHex, roughness: 0.42, metalness: 0.45, clearcoat: 0.85, clearcoatRoughness: 0.12 })
      : new THREE.MeshStandardMaterial({ color: paintHex, roughness: 0.45, metalness: 0.35 });
    paint.name = 'paint'; paint.userData.envK = 0.8;
    // cosmetic mud layer: darkens/roughens the lower body as `dirt` builds up (vehicle-space height mask)
    const dirtU = this.dirtU;
    paint.onBeforeCompile = (sh) => {
      sh.uniforms.uDirt = dirtU;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vCarPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCarPos = position;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vCarPos;\nuniform float uDirt;')
        .replace('#include <color_fragment>', `#include <color_fragment>
        float dn = sin(vCarPos.z * 7.1 + vCarPos.x * 3.0) * 0.06 + sin(vCarPos.z * 23.0 + vCarPos.y * 17.0) * 0.03;
        float dm = uDirt * (1.0 - smoothstep(-0.35, 0.25 + uDirt * 0.35, vCarPos.y + dn));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.12, 0.08), clamp(dm, 0.0, 0.92));`);
    };
    paint.customProgramCacheKey = () => 'owf-paint-dirt';
    const glass = hi
      ? new THREE.MeshPhysicalMaterial({ color: 0x0c141c, roughness: 0.04, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide })
      : new THREE.MeshStandardMaterial({ color: 0x15202b, roughness: 0.1, metalness: 0.6, side: THREE.DoubleSide });
    glass.name = 'glass'; glass.userData.envK = 1.6;
    const m: Mats = {
      paint: this.paint = paint,
      dark: std('dark', { color: 0x1b1c1e, roughness: 0.78, metalness: 0.05 }, 0.3),
      steel: std('steel', { color: 0x2c2f33, roughness: 0.5, metalness: 0.6 }, 0.6),
      glass,
      chrome: std('chrome', { color: 0xd8dbe0, roughness: 0.16, metalness: 1.0 }, 1.4),
      lamp: this.lampMat = std('lamp', { color: 0xfff6d8, emissive: 0xfff1c0, emissiveIntensity: 2.0, roughness: 0.2 }),
      tail: std('tail', { color: 0x700000, emissive: 0xff1a1a, emissiveIntensity: 1.2, roughness: 0.25 }),
      amber: std('amber', { color: 0x7a4a00, emissive: 0xffa000, emissiveIntensity: 1.5, roughness: 0.25 }),
      accent: std('accent', { color: spec.accent ?? 0xece8de, roughness: 0.5, metalness: 0.1 }),
      rubber: std('rubber', { color: 0x161616, roughness: 0.92, metalness: 0 }, 0.15),
      alloy: std('alloy', { color: spec.rim.color, roughness: spec.rim.rough, metalness: spec.rim.metal }, 1.1),
      caliper: std('caliper', { color: spec.spring, roughness: 0.4, metalness: 0.3 }),
    };
    this.mats.push(...Object.values(m));
    const k = new Kit(g, m, this.lod);
    spec.build(k, spec);
    this.buildInterior(k);
    mergeStatic(g);
    g.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh) this.geos.push(mm.geometry); });
    // sprung body: everything built so far (shell, cabin, lamps) leans on top of the physical chassis motion
    this.bodyVis = new THREE.Group(); this.bodyVis.name = 'body:sprung';
    for (const ch of [...g.children]) this.bodyVis.add(ch);
    g.add(this.bodyVis);
    this.tailMat = m.tail;
    this.glassMat = m.glass;

    // ---- wheels: tread-pattern tyre + styled rim with brake disc (spin), caliper (steers, does not spin)
    const R = spec.wheel.r, WW = spec.wheel.w, rr = R - Math.min(0.12, R * 0.28);
    const tyreGeo = k.tyre(R, WW);
    const rimGeo = this.rimGeometry(k, rr, WW);
    const calGeo = new THREE.BoxGeometry(WW * 0.32, rr * 0.4, rr * 0.28);
    this.geos.push(tyreGeo, rimGeo, calGeo);
    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? 1 : -1; // even = left (+x)
      const pivot = new THREE.Group();
      const spin = new THREE.Group();
      const t = new THREE.Mesh(tyreGeo, m.rubber); t.castShadow = true; t.name = 'wheel:tyre';
      const r = new THREE.Mesh(rimGeo, m.alloy); r.castShadow = hi; r.name = 'wheel:rim';
      spin.add(t, r); spin.scale.x = side;
      pivot.add(spin);
      if (hi) {
        const c = new THREE.Mesh(calGeo, m.caliper); c.name = 'wheel:caliper';
        c.position.set(side * WW * 0.08, rr * 0.5, -rr * 0.38); c.rotation.x = 0.6;
        pivot.add(c); this.calipers.push(c);
      }
      g.add(pivot);
      this.wheelMeshes.push(pivot);
    }
    // ---- animated suspension: dampers (+ coil springs on High), solid axles or wishbones
    const unitY = (geo: THREE.BufferGeometry) => { this.geos.push(geo); return geo; };
    const damper = unitY(mergeGeometries([
      new THREE.CylinderGeometry(0.04, 0.04, 0.55, hi ? 10 : 6).translate(0, -0.22, 0).toNonIndexed(),
      new THREE.CylinderGeometry(0.018, 0.018, 0.5, 6).translate(0, 0.25, 0).toNonIndexed(),
    ].map((x) => { x.deleteAttribute('uv'); return x; }))!);
    this.shocks = new THREE.InstancedMesh(damper, m.steel, 4); this.shocks.name = 'susp:dampers';
    g.add(this.shocks);
    if (hi) {
      const pts: THREE.Vector3[] = []; const turns = 6, n = turns * 14;
      for (let j = 0; j <= n; j++) { const a = (j / 14) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * 0.075, -0.4 + (j / n) * 0.8, Math.sin(a) * 0.075)); }
      const coil = unitY(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, 0.013, 5));
      this.springs = new THREE.InstancedMesh(coil, m.caliper, 4); this.springs.name = 'susp:springs';
      g.add(this.springs);
    }
    if (spec.axle === 'solid') {
      const half = spec.wheel.x - WW * 0.5;
      const axle = unitY(mergeGeometries([
        new THREE.CylinderGeometry(0.05, 0.05, half * 2, 8).rotateZ(Math.PI / 2).toNonIndexed(),
        new THREE.SphereGeometry(0.17, hi ? 12 : 6, hi ? 8 : 4).scale(1, 1, 0.8).translate(0.15, 0, 0).toNonIndexed(),
        new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6).rotateX(Math.PI / 2).translate(0.15, 0, 0.45).toNonIndexed(),
      ].map((x) => { x.deleteAttribute('uv'); return x; }))!);
      this.links = new THREE.InstancedMesh(axle, m.steel, 2); this.links.name = 'susp:axles';
    } else {
      // wishbone (A-arm) of unit length along +x, scaled to the pivot->hub distance every frame
      const arm = unitY(mergeGeometries([
        new THREE.BoxGeometry(1, 0.04, 0.05).translate(0.5, 0, 0.14).rotateY(-0.25).toNonIndexed(),
        new THREE.BoxGeometry(1, 0.04, 0.05).translate(0.5, 0, -0.14).rotateY(0.25).toNonIndexed(),
      ].map((x) => { x.deleteAttribute('uv'); return x; }))!);
      this.links = new THREE.InstancedMesh(arm, m.steel, 4); this.links.name = 'susp:wishbones';
    }
    g.add(this.links);
    for (const im of [this.shocks, this.springs, this.links]) if (im) { im.castShadow = hi; im.frustumCulled = false; im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); }

    // headlights (enabled on med/high presets)
    const L = spec.lamp;
    for (const x of [-L.x, L.x]) {
      const s = new THREE.SpotLight(0xfff1d0, 0, 45, 0.5, 0.5, 1.2);
      s.position.set(x, L.y, L.z);
      s.target.position.set(x * 1.5, -0.6, L.z + 10);
      g.add(s, s.target);
      this.headlights.push(s);
    }
    // rear red glow: tail lamps light the ground behind at night (and brighten under braking)
    this.rearGlow = new THREE.PointLight(0xff2010, 0, 9, 2); this.rearGlow.visible = false; this.rearGlow.position.set(0, L.y, -spec.chassis.hz - 0.3); g.add(this.rearGlow);
    this.beam = new THREE.SpotLight(0xfff1d0, 0, 70, 0.42, 0.6, 1.0);
    this.beam.position.set(0, L.y + 0.25, L.z);
    this.beam.target.position.set(0, -1, L.z + 14);
    this.beam.shadow.mapSize.set(1024, 1024);
    this.beam.shadow.camera.near = 0.5; this.beam.shadow.camera.far = 70; this.beam.shadow.bias = -0.0008;
    g.add(this.beam, this.beam.target);
    this.sync();
  }


  /** Original 3D cockpit: dash, instrument binnacle, column and a three-spoke leather-wrapped steering wheel (no logos/badges).
   *  Driver sits on the left (+x, left-hand drive as in the UAE). The wheel turns with the steering (see sync). */
  private buildInterior(k: Kit) {
    const m = k.m, c = this.spec.cabin, hi = this.lod > 0, g = this.group;
    // static parts go through Kit (merged into the body's existing material batches: no extra draw calls)
    const front = c.z + c.hz, floor = c.y - c.hy, dx = Math.min(0.42, c.hx * 0.45);
    const eyeY = c.y + c.hy - 0.3, dashZ = front - 0.3, dashY = Math.max(floor + 0.2, eyeY - 0.36);
    k.add(k.box(c.hx * 1.9, 0.16, 0.34), m.dark, 0, dashY, dashZ);                                   // dash top
    k.add(k.box(c.hx * 1.9, 0.3, 0.1), m.dark, 0, dashY - 0.2, dashZ - 0.12);                          // dash face
    k.add(k.box(0.42, 0.12, 0.14), m.dark, dx, dashY + 0.1, dashZ - 0.1);                              // binnacle hood
    for (const gx of [-0.09, 0.09]) k.add(new THREE.CircleGeometry(0.055, hi ? 24 : 10), m.accent, dx + gx, dashY + 0.05, dashZ - 0.18, 0, Math.PI, 0); // dials
    for (const gx of [-0.09, 0.09]) k.add(new THREE.RingGeometry(0.055, 0.064, hi ? 24 : 10), m.chrome, dx + gx, dashY + 0.05, dashZ - 0.181, 0, Math.PI, 0);
    k.add(k.box(0.22, 0.12, 0.02), m.steel, 0, dashY - 0.12, dashZ - 0.18);                            // centre screen
    for (const sx of [dx, -dx]) {                                                                      // seats
      k.add(k.box(0.46, 0.1, 0.48, 0.03), m.rubber, sx, eyeY - 0.62, dashZ - 0.95);
      k.add(k.box(0.46, 0.6, 0.1, 0.03), m.rubber, sx, eyeY - 0.3, dashZ - 1.22, -0.18);
    }
    const tilt = -0.42, cz = dashZ - 0.3, cy = dashY + 0.02;
    k.add(k.box(0.11, 0.09, 0.14), m.dark, dx, cy, cz + 0.06, tilt);                                  // column shroud
    k.add(k.box(0.06, 0.012, 0.03), m.steel, dx + 0.13, cy + 0.03, cz + 0.06, tilt);                  // indicator stalk
    // the rotating wheel: its own small group (2 draw calls), turned about its axis in sync()
    const col = new THREE.Group(); col.position.set(dx, cy, cz); col.rotation.x = tilt; g.add(col);
    const w = new THREE.Group(); w.name = 'steering-wheel'; col.add(w);
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
      const me = new THREE.Mesh(geo, mat); me.position.set(x, y, z); me.rotation.set(rx, ry, rz); me.userData.static = true; w.add(me); return me;
    };
    const R = 0.19, seg = hi ? 48 : 20;
    add(new THREE.TorusGeometry(R, 0.022, hi ? 12 : 6, seg), m.rubber);                               // leather-look rim
    add(new THREE.CylinderGeometry(0.07, 0.075, 0.05, hi ? 24 : 10), m.rubber, 0, 0, -0.02, Math.PI / 2); // plain hub / airbag pad (no logo)
    add(new THREE.TorusGeometry(R, 0.0235, 6, 10, 0.5), m.steel, 0, 0, 0, 0, 0, Math.PI / 2 - 0.25); // 12 o'clock marker band
    for (const a of [Math.PI, 0, -Math.PI / 2]) add(new THREE.BoxGeometry(R - 0.05, 0.03, 0.016), m.steel, Math.cos(a) * (R / 2 + 0.02), Math.sin(a) * (R / 2 + 0.02), -0.01, 0, 0, a); // 3 spokes
    for (const sx of [-0.1, 0.1]) add(new THREE.BoxGeometry(0.03, 0.014, 0.012), m.steel, sx, 0.02, -0.03); // thumb buttons
    add(new THREE.CylinderGeometry(0.035, 0.045, 0.2, 10), m.steel, 0, 0, 0.12, Math.PI / 2);          // column
    mergeStatic(w);
    w.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh) this.geos.push(mm.geometry); });
    this.steeringWheel = w;
    this.eye.set(dx, eyeY, dashZ - 0.8);
  }
  /** steering-wheel angle shown for a road-wheel angle (approx. 14:1 ratio, capped at about 1.25 turns lock to lock each way) */
  static wheelTurn(steer: number) { return THREE.MathUtils.clamp(steer * 14, -7.8, 7.8); }
  /** see-through glass for the in-car view */
  cockpitOn = false;
  setCockpit(on: boolean) { this.cockpitOn = on; const g = this.glassMat; if (!g) return; g.transparent = on; g.opacity = on ? 0.12 : 1; g.depthWrite = !on; g.needsUpdate = true; }

  /** Rim (axis along X, face towards +x) with brake disc and lug nuts, merged into one geometry. */
  private rimGeometry(k: Kit, rr: number, w: number) {
    const hi = k.lod > 0, st = this.spec.rim.style, parts: THREE.BufferGeometry[] = [];
    const P = (geo: THREE.BufferGeometry) => { const x = geo.index ? geo.toNonIndexed() : geo; if (x.attributes.uv) x.deleteAttribute('uv'); parts.push(x); };
    const seg = hi ? 28 : 12;
    const face = w * 0.5 - (st === 'truck' ? 0.1 : 0.04);
    P(new THREE.CylinderGeometry(rr, rr, w * 0.92, seg, 1, true).rotateZ(Math.PI / 2));                 // barrel
    P(new THREE.TorusGeometry(rr, 0.015, 4, seg).rotateY(Math.PI / 2).translate(w * 0.46, 0, 0));      // outer lip
    P(new THREE.CylinderGeometry(rr * 0.25, rr * 0.3, 0.08, hi ? 14 : 8).rotateZ(Math.PI / 2).translate(face, 0, 0)); // hub
    if (hi) P(new THREE.CylinderGeometry(rr * 0.72, rr * 0.72, 0.025, 24).rotateZ(Math.PI / 2).translate(-w * 0.05, 0, 0)); // brake disc
    if (st === 'steel' || st === 'truck') {
      // pressed dish with a ring of vent holes (holes = dark inset discs merged into the tyre material is avoided; drawn as recessed rings)
      P(new THREE.CylinderGeometry(rr * 0.97, rr * 0.97, 0.02, seg).rotateZ(Math.PI / 2).translate(face - 0.01, 0, 0));
      const n = st === 'truck' ? 8 : 5;
      for (let j = 0; j < n && hi; j++) { const a = (j / n) * Math.PI * 2; P(new THREE.TorusGeometry(rr * 0.12, 0.012, 4, 10).rotateY(Math.PI / 2).translate(face + 0.006, Math.cos(a) * rr * 0.62, Math.sin(a) * rr * 0.62)); }
      if (st === 'truck') P(new THREE.CylinderGeometry(rr * 0.45, rr * 0.45, 0.1, 16).rotateZ(Math.PI / 2).translate(face + 0.04, 0, 0));
    } else {
      const n = st === 'twin' ? 12 : st === 'rally' ? 5 : 6;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2 + (st === 'twin' && j % 2 ? -0.12 : 0);
        const sp = new THREE.BoxGeometry(0.03, rr * 0.75, st === 'rally' ? rr * 0.3 : st === 'twin' ? rr * 0.09 : rr * 0.18);
        sp.translate(face, rr * 0.55, 0); sp.rotateX(a); P(sp);
      }
    }
    const lugs = st === 'truck' ? 10 : 6;
    for (let j = 0; j < lugs && hi; j++) { const a = (j / lugs) * Math.PI * 2; P(new THREE.CylinderGeometry(0.014, 0.014, 0.04, 6).rotateZ(Math.PI / 2).translate(face + 0.04, Math.cos(a) * rr * 0.18, Math.sin(a) * rr * 0.18)); }
    return mergeGeometries(parts)!;
  }

  reset(x: number, y: number, z: number, yaw: number) {
    this.body.setTranslation({ x, y, z }, true);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
    this.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.w = [0, 0, 0, 0]; this.gearIdx = 1; this.thrRamp = 0; this.shiftT = 0; this.autoDir = 1; this.kappa = [0, 0, 0, 0]; this.rpm = this.pt.idle; this.steer = 0;
    this.lastV = null; this.accLocal.set(0, 0); this.lean = { pitch: 0, roll: 0, vp: 0, vr: 0 }; this.braking = false;
    this.steer = 0;
    this.tracks?.reset();
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
    const c: Record<Surface, number> = { ground: 0, mud: 0, sand: 0, rock: 0 };
    let any = false;
    for (const s of this.surfaces) if (s) { c[s]++; any = true; }
    if (!any) return 'ground';
    return (Object.keys(c) as Surface[]).reduce((a, b) => (c[b] > c[a] ? b : a));
  }

  get driveModes(): Transfer[] { return this.spec.drive ?? ['4H']; }
  /** Transfer-case shift with the usual interlocks. Rejected shifts keep the current mode. */
  setTransfer(t: Transfer): ShiftResult {
    const kmh = Math.abs(this.forwardSpeed()) * 3.6;
    if (!this.driveModes.includes(t)) return { ok: false, msg: `${t} is not available on the ${this.spec.name}` };
    if (t === this.transfer) return { ok: true, msg: t };
    if (t === '4L' || this.transfer === '4L') {
      if (kmh > LOW_RANGE_MAX_KMH) return { ok: false, msg: `4L rejected: slow below ${LOW_RANGE_MAX_KMH} km/h to shift ${t === '4L' ? 'into' : 'out of'} low range (now ${kmh.toFixed(0)} km/h)` };
    } else if (kmh > SHIFT_ON_FLY_KMH) return { ok: false, msg: `Slow below ${SHIFT_ON_FLY_KMH} km/h to shift to ${t}` };
    this.transfer = t; return { ok: true, msg: t };
  }
  /** Apply a driving profile: suspension values go straight to the physics controller; the rest is used per step. */
  setProfile(id: ProfileId) {
    const P = this.profile = PROFILES[id] ?? PROFILES.pro, su = this.spec.susp;
    for (let i = 0; i < 4; i++) {
      this.ctrl.setWheelSuspensionStiffness(i, su.stiffness * P.stiff);
      this.ctrl.setWheelSuspensionCompression(i, su.compression * P.damp);
      this.ctrl.setWheelSuspensionRelaxation(i, su.relaxation * P.damp);
      this.ctrl.setWheelMaxSuspensionTravel(i, su.travel * P.travel);
    }
  }
  /** Gear selector with interlocks: P only at a standstill, no D <-> R while moving. */
  setGear(g: GearSel): ShiftResult {
    const v = this.forwardSpeed(), kmh = v * 3.6;
    if (g === this.sel) return { ok: true, msg: g };
    if (g === 'P' && Math.abs(kmh) > 1) return { ok: false, msg: 'Stop the vehicle to select P' };
    if (g === 'R' && kmh > DIR_SHIFT_KMH) return { ok: false, msg: `Stop before selecting R (${Math.round(kmh)} km/h)` };
    if ((g === 'D' || g === 'A') && kmh < -DIR_SHIFT_KMH) return { ok: false, msg: `Stop before selecting ${g === 'A' ? 'Auto' : 'D'}` };
    this.sel = g; return { ok: true, msg: g };
  }

  // ===================== 0.9.0 real vehicle model =====================
  /** powertrain data (engine curve, gearbox, transfer case, aero, brakes, anti-roll bars) */
  pt!: Powertrain;
  /** wheel angular velocity (rad/s), visual wheel angle */
  w = [0, 0, 0, 0]; private wAng = [0, 0, 0, 0];
  /** current automatic gear (1-based), shift timer (s), last driving direction in Auto */
  gearIdx = 1; private shiftT = 0; private autoDir = 1;
  /** user diff lock (axle diffs locked; centre is always locked in 4H/4L) */
  diffLock = false;
  /** last tyre telemetry: slip ratio, slip angle (rad), surface per wheel, wheel load (N) */
  kappa = [0, 0, 0, 0]; alpha = [0, 0, 0, 0]; phys: (PhysSurface | null)[] = [null, null, null, null]; load = [0, 0, 0, 0];
  /** total ratio engine -> wheel in the current gear (incl. final drive + transfer) */
  totalRatio = 0; converterLocked = false; engineTorqueNm = 0;
  /** limiter setpoint (m/s) when the optional speed limiter is on, 0 = off */
  limitV = 0;
  static readonly SUB = 2; // tyre / wheel / drivetrain substeps per physics step (60 Hz world -> 120 Hz tyre model)

  step(dt: number, inp: DriveInput) {
    const ctrl = this.ctrl, sp0 = this.spec, P = this.profile, pt = this.pt;
    const speed = this.forwardSpeed();
    { // cosmetic mud build-up (visual only; no effect on physics)
      let mudW = 0, sandW = 0; for (const s of this.surfaces) { if (s === 'mud') mudW++; else if (s === 'sand') sandW++; }
      const sp = Math.min(1, (Math.abs(speed) + 1) / 6);
      if (mudW) this.dirt = Math.min(1, this.dirt + dt * 0.08 * (mudW / 4) * sp);
      else if (sandW && this.dirt < 0.3) this.dirt = Math.min(0.3, this.dirt + dt * 0.01 * sp);
    }
    // steering: rack angle limited by the vehicle's lock, quicker ratio at parking speed (variable-ratio rack), finite steering rate
    const maxSteer = (sp0.steerLow - (sp0.steerLow - sp0.steerHigh) * Math.min(1, Math.abs(speed) / 16)) * P.steerLim;
    this.steer += (inp.steer * maxSteer - this.steer) * Math.min(1, dt * P.steerRate);
    // pedal map (profile) + throttle-body / turbo response lag (~0.25 s)
    const thrT = inp.throttle > 0 ? Math.pow(inp.throttle, P.throttleExp) : 0;
    this.thrRamp = thrT > this.thrRamp ? Math.min(thrT, this.thrRamp + dt / PEDAL_RAMP_S) : Math.max(thrT, this.thrRamp - dt * 6);
    const pedal = this.thrRamp;

    // ---- selector logic -> gear direction, engine throttle, brake pedal
    let dir = 0, thr = 0, brk = 0, park = false;
    const sel = this.sel;
    if (sel === 'A') {
      if (pedal > 0.01) { if (speed < -0.8) brk = pedal; else { dir = 1; thr = pedal; this.autoDir = 1; } }
      if (inp.brake > 0.01) { if (speed > 0.8 || inp.handbrake) brk = Math.max(brk, inp.brake); else if (pedal <= 0.01) { dir = -1; thr = inp.brake; this.autoDir = -1; } }
      if (dir === 0) dir = this.autoDir;
    } else if (sel === 'D' || sel === 'R') {
      dir = sel === 'D' ? 1 : -1;
      if (pedal > 0.01) { if (sel === 'D' ? speed < -0.8 : speed > 0.8) brk = pedal; else thr = pedal; }
      if (inp.brake > 0.01) brk = Math.max(brk, inp.brake);
    } else if (sel === 'N') { if (inp.brake > 0.01) brk = inp.brake; }
    else park = true;
    // optional speed limiter (user setting): works on the throttle only, like a real limiter (it cannot brake downhill)
    const capN = Vehicle.speedMode === 'off' ? 0 : Vehicle.speedMode === 'low' ? Math.min(LOW_SPEED_CAP, normalCap(sp0.topSpeed)) : normalCap(sp0.topSpeed);
    this.limitV = capN; this.capKmh = capN * 3.6;
    if (dir > 0 && capN > 0) thr *= THREE.MathUtils.clamp((capN - speed) / 1.2, 0, 1);
    if (dir < 0) thr *= THREE.MathUtils.clamp((REVERSE_CAP + speed) / 1.2, 0, 1); // ECU reverse-speed limiter

    // ---- gearbox (automatic with torque converter) + transfer case
    const lowK = this.transfer === '4L' ? pt.low : 1;
    const maxGear = this.transfer === '4L' ? Math.min(2, pt.gears.length) : pt.gears.length;
    if (this.gearIdx > maxGear) this.gearIdx = maxGear;
    const twoH = this.transfer === '2H', awd = this.transfer === 'AWD';
    const fs = twoH ? 0 : (sp0.frontSplit ?? 0.5);
    const r = sp0.wheel.r, Iw = this.wheelInertia;
    const drivenS = () => twoH ? (this.w[2] + this.w[3]) / 2 : awd ? fs * (this.w[0] + this.w[1]) / 2 + (1 - fs) * (this.w[2] + this.w[3]) / 2 : (this.w[0] + this.w[1] + this.w[2] + this.w[3]) / 4;
    const ratioOf = (g: number) => (dir < 0 ? pt.reverse : pt.gears[g - 1]) * pt.final * lowK;
    let total = dir === 0 || park ? 0 : ratioOf(this.gearIdx);
    let rpmW = Math.abs(drivenS() * total) * 30 / Math.PI;
    if (dir > 0 && !park && this.shiftT <= 0) { // shift schedule: later upshifts with more throttle, kick-down
      const span = pt.redline - pt.idle;
      const up = Math.min(pt.redline * 0.96, pt.idle + (0.42 + 0.52 * thr) * span), dn = pt.idle + (0.18 + 0.38 * thr) * span;
      if (rpmW > up && this.gearIdx < maxGear) { this.gearIdx++; this.shiftT = 0.25; }
      else if (this.gearIdx > 1 && rpmW < dn && rpmW * pt.gears[this.gearIdx - 2] / pt.gears[this.gearIdx - 1] < up * 0.92) { this.gearIdx--; this.shiftT = 0.2; }
      total = ratioOf(this.gearIdx); rpmW = Math.abs(drivenS() * total) * 30 / Math.PI;
    }
    if (dir <= 0 || Math.abs(speed) < 0.3 && thr < 0.05) { if (dir <= 0) this.gearIdx = 1; }
    this.shiftT = Math.max(0, this.shiftT - dt);
    // torque converter: slips below lock-up (stall speed rises with throttle), multiplies torque while slipping
    const stall = pt.idle + thr * (Math.min(pt.rpmT * 1.15, pt.redline * 0.55) - pt.idle);
    const locked = total > 0 && this.gearIdx >= 2 && rpmW > pt.idle * 1.25 && rpmW > stall * 0.9;
    let rpm = total === 0 ? pt.idle + thr * (pt.redline * 0.7 - pt.idle) : locked ? rpmW : Math.max(rpmW, stall, pt.idle);
    let Te: number;
    if (total === 0) Te = 0;
    else if (rpm >= pt.redline) Te = -engineDrag(pt, rpm); // rev limiter: fuel cut
    else if (thr > 0.01) Te = engineTorque(pt, rpm) * thr * P.engine * (sp0.engine / vehicleById(sp0.id).engine) /* engine upgrades: +9 % torque per level */ - (1 - thr) * engineDrag(pt, rpm);
    else Te = rpm > pt.idle * 1.1 ? -engineDrag(pt, rpm) : 0; // engine braking above idle
    let TR = 1;
    if (!locked && total > 0) {
      const SR = Math.min(1, rpmW / Math.max(1, rpm));
      TR = 1 + 1.1 * Math.max(0, 1 - SR / 0.88);         // converter torque multiplication (~2.1 at stall)
      if (thr <= 0.01) Te = 0.16 * pt.torque * Math.max(0, 1 - rpmW / (pt.idle * 1.2)) - (rpmW > pt.idle * 1.2 ? engineDrag(pt, rpm) * SR : 0); // idle creep / weak coupling
    }
    if (this.shiftT > 0.1) Te *= 0.35; // torque reduction during the shift
    // traction control (ARCADE): cuts engine torque while a driven wheel is spinning hard
    if (P.stability > 0 && Te > 0) { const ks = twoH ? Math.max(this.kappa[2], this.kappa[3]) : Math.max(...this.kappa); if (ks > 0.25) Te *= Math.max(0.3, 1 - (ks - 0.25) * 2 * P.stability); }
    this.engineTorqueNm = Te; this.totalRatio = total; this.converterLocked = locked;
    const Td = Te * TR * total * pt.eff * Math.sign(dir || 1); // axle torque, all driven wheels together (N m)
    const Ie = locked ? pt.engInertia * total * total : 0;   // engine inertia reflected through the gears (only when coupled)

    // ---- brakes: service brake split front/rear, handbrake on the rear, park pawl locks the driveline
    const bMax = pt.brakeG * sp0.mass * 9.81 * r * P.brake;
    const Tb = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) Tb[i] = brk * bMax * (i < 2 ? pt.brakeFront : 1 - pt.brakeFront) / 2;
    if (inp.handbrake) { Tb[2] += 0.45 * sp0.mass * 9.81 * r; Tb[3] += 0.45 * sp0.mass * 9.81 * r; }
    if (park) for (let i = 0; i < 4; i++) if (!twoH || i >= 2) Tb[i] += 2 * sp0.mass * 9.81 * r;
    if (sel === 'N' && !brk) { /* free rolling */ }

    // ---- suspension (spring + damper per wheel, Rapier ray-cast) -> wheel loads; anti-roll bars
    ctrl.updateVehicle(dt);
    const rq = this.body.rotation(), Q = Vehicle._q2.set(rq.x, rq.y, rq.z, rq.w);
    const fwdC = Vehicle._f.set(0, 0, 1).applyQuaternion(Q), upC = Vehicle._u.set(0, 1, 0).applyQuaternion(Q);
    const t0 = this.body.translation();
    let contacts = 0;
    const Fz = [0, 0, 0, 0], comp = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      const inC = ctrl.wheelIsInContact(i); this.inPuddle[i] = false;
      comp[i] = inC ? this.spec.susp.rest - (ctrl.wheelSuspensionLength(i) ?? this.spec.susp.rest) : 0;
      if (inC) {
        const p = ctrl.wheelContactPoint(i);
        const s = p ? surfaceAt(p.x, p.z) : 'ground';
        if (p) { (this.contact[i] ??= new THREE.Vector3()).set(p.x, p.y, p.z); this.inPuddle[i] = !!puddleAt(p.x, p.z); }
        this.surfaces[i] = s; this.phys[i] = Vehicle.forceSurf ?? physSurface(s, p?.x ?? 0, p?.z ?? 0, this.wet, this.inPuddle[i]);
        Fz[i] = Math.max(0, ctrl.wheelSuspensionForce(i) ?? 0); contacts++;
      } else { this.contact[i] = null; this.surfaces[i] = null; this.phys[i] = null; }
    }
    for (const [a, b, k] of [[0, 1, pt.arbF], [2, 3, pt.arbR]] as const) {
      const F = k * (comp[a] - comp[b]) * P.stiff;
      if (F === 0 || (!this.contact[a] && !this.contact[b])) continue;
      for (const [i, s] of [[a, 1], [b, -1]] as const) {
        const c = this.conn[i], hp = Vehicle._p.set(c.x, c.y, c.z).applyQuaternion(Q).add(Vehicle._t.set(t0.x, t0.y, t0.z));
        this.body.applyImpulseAtPoint({ x: upC.x * F * s * dt, y: upC.y * F * s * dt, z: upC.z * F * s * dt }, hp, true);
        if (this.contact[i]) Fz[i] = Math.max(0, Fz[i] + F * s);
      }
    }
    this.load = Fz;

    // Ackermann steering geometry: inside wheel turns more
    const L = sp0.wheel.zf - sp0.wheel.zr, Tk = 2 * sp0.wheel.x, d0 = this.steer;
    let dL = d0, dR = d0;
    if (Math.abs(d0) > 1e-4) { const R = L / Math.tan(Math.abs(d0)), inn = Math.atan(L / Math.max(0.5, R - Tk / 2)), out = Math.atan(L / (R + Tk / 2)); if (d0 > 0) { dL = inn; dR = out; } else { dL = -out; dR = -inn; } }
    const delta = [dL, dR, 0, 0];

    // ESC (ARCADE): brake a single wheel when the yaw rate departs from the driver's intended path
    if (P.stability > 0 && contacts >= 3 && Math.abs(speed) > 5) {
      const av = this.body.angvel(), yr = av.x * upC.x + av.y * upC.y + av.z * upC.z;
      const want = THREE.MathUtils.clamp(speed * Math.tan(d0) / L / (1 + 0.0025 * speed * speed), -9 / Math.abs(speed), 9 / Math.abs(speed));
      const e = yr - want, sg = Math.sign(want || yr);
      const k = 0.35 * sp0.mass * 9.81 * r * P.stability;
      if (e * sg > 0.12) Tb[sg > 0 ? 1 : 0] += k * Math.min(1, (e * sg - 0.12) * 3);           // oversteer: brake the outer front
      else if (e * sg < -0.25) Tb[sg > 0 ? 2 : 3] += k * 0.6 * Math.min(1, (-e * sg - 0.25) * 3); // understeer: brake the inner rear
    }

    // ---- tyre / wheel / driveline integration at SUB x the physics rate
    const SUB = Vehicle.SUB, h = dt / SUB, VLOW = 2, VLAT = 2.5;
    const mShare = sp0.mass / 4;
    const tw = Vehicle._tw, fw = Vehicle._fw, sw = Vehicle._sw, nrm = Vehicle._n, pnt = Vehicle._pp;
    const Fx = [0, 0, 0, 0], kx = [0, 0, 0, 0], mu = [0, 0, 0, 0], vxs = [0, 0, 0, 0], vys = [0, 0, 0, 0];
    const fwV: THREE.Vector3[] = this._fwV, swV: THREE.Vector3[] = this._swV;
    for (let sub = 0; sub < SUB; sub++) {
      // 1. contact kinematics + longitudinal force and its slope dFx/domega at the current wheel speed
      for (let i = 0; i < 4; i++) {
        const cp = this.contact[i];
        if (!cp || Fz[i] <= 0) { Fx[i] = 0; kx[i] = 0; mu[i] = 0; continue; }
        const S = SURF[this.phys[i]!];
        const n = ctrl.wheelContactNormal(i); nrm.set(n?.x ?? 0, n?.y ?? 1, n?.z ?? 0);
        tw.copy(fwdC).applyAxisAngle(upC, delta[i]);
        fw.copy(tw).addScaledVector(nrm, -tw.dot(nrm)).normalize(); sw.crossVectors(nrm, fw);
        fwV[i].copy(fw); swV[i].copy(sw);
        const vp = this.body.velocityAtPoint(cp); pnt.set(vp.x, vp.y, vp.z);
        const vx = pnt.dot(fw), vy = pnt.dot(sw); vxs[i] = vx; vys[i] = vy;
        const tyre = sp0.grip[this.surfaces[i] === 'rock' || this.surfaces[i] === 'ground' || !this.surfaces[i] ? 'ground' : this.surfaces[i] as 'sand' | 'mud'];
        const loadK = THREE.MathUtils.clamp(1 - 0.1 * (Fz[i] / (mShare * 9.81) - 1), 0.8, 1.1); // load sensitivity
        mu[i] = S.mu * tyre * P.grip * (S.soft ? P.softGrip : 1) * loadK * (this.inPuddle[i] ? 0.85 : 1);
        const den = Math.max(Math.abs(vx), VLOW), kap = (this.w[i] * r - vx) / den, B = S.B;
        Fx[i] = mu[i] * Fz[i] * magic(B, S.C, kap);
        // secant slope dFx/domega through the zero-slip origin (<= the initial slope): the implicit wheel update can never
        // overshoot past zero slip (stable at any step) yet a hard-spinning or locked wheel recovers at its true force
        const kMax = mu[i] * Fz[i] * S.C * B * r / den, sv = this.w[i] * r - vx;
        kx[i] = Math.abs(sv) > 1e-4 ? Math.min(kMax, Math.abs(Fx[i] * r / sv)) : kMax;
      }
      // 2. driveline modes (implicit in the tyre force): open diffs = equal torque, locked = common speed
      const w = this.w, Iax = 2 * Iw;
      const axleDiff = (a: number, b: number) => { // difference mode of one axle (zero when locked)
        if (this.diffLock) { const m = (w[a] + w[b]) / 2; w[a] = w[b] = m; return; }
        const d = (w[a] - w[b]) / 2, kk = r * (kx[a] + kx[b]);
        const nd = d + h * (-r * (Fx[a] - Fx[b])) / (Iax + h * kk);
        const s = (w[a] + w[b]) / 2; w[a] = s + nd; w[b] = s - nd;
      };
      const sumMode = (ids: number[], T: number, I: number) => { // common (sum) mode of the wheels in ids
        let F = 0, K = 0, s = 0; for (const i of ids) { F += Fx[i]; K += kx[i]; s += w[i]; } s /= ids.length;
        const ds = h * (T - r * F) / (I + h * r * K); for (const i of ids) w[i] += ds;
      };
      if (twoH) { sumMode([2, 3], Td, Iax + Ie); sumMode([0, 1], 0, Iax); }
      else if (awd) { sumMode([0, 1], Td * fs, Iax + Ie * fs); sumMode([2, 3], Td * (1 - fs), Iax + Ie * (1 - fs));
        const mf = (w[0] + w[1]) / 2, mr = (w[2] + w[3]) / 2, c = (mr - mf) * 0.12; w[0] += c; w[1] += c; w[2] -= c; w[3] -= c; } // viscous centre coupling
      else sumMode([0, 1, 2, 3], Td, 2 * Iax + Ie); // part-time 4H / 4L: centre locked
      axleDiff(0, 1); axleDiff(2, 3);
      // 3. brakes (friction torque, never reverses the wheel) with ABS, plus brake-based traction control (BTC, as on
      //    modern 4x4s): a driven wheel spinning faster than its partner on the same open diff gets braked, which sends
      //    torque across the diff to the wheel that has grip.
      const btc = [0, 0, 0, 0];
      if (!this.diffLock && Td !== 0 && Math.abs(speed) < 14) for (const [a2, b2] of (twoH ? [[2, 3]] : [[0, 1], [2, 3]])) {
        const ex = Math.abs(w[a2] - w[b2]) * r - 1.0; if (ex <= 0) continue;
        const fast = Math.abs(w[a2]) > Math.abs(w[b2]) ? a2 : b2;
        btc[fast] = Math.min(Math.abs(Td) * 0.6, Math.abs(Td) * 0.25 * ex);
      }
      for (let i = 0; i < 4; i++) {
        let tb = Tb[i] + btc[i]; if (tb <= 0) continue;
        // ABS: modulates line pressure so the brake torque never exceeds what the tyre can transmit (wheel stays near peak slip)
        if (brk > 0 && !park && this.contact[i] && Math.abs(vxs[i]) > 1.5 && !(inp.handbrake && i >= 2)) {
          tb = Math.min(tb, r * mu[i] * Fz[i] * 0.97);
          if ((w[i] * r - vxs[i]) / Math.abs(vxs[i]) * Math.sign(vxs[i]) < -0.18) tb = 0; // wheel locking: dump pressure until it spins back up
        }
        const db = h * tb / Iw; w[i] = Math.abs(w[i]) <= db ? 0 : w[i] - Math.sign(w[i]) * db;
      }
      // 4. final tyre forces from the new wheel speeds -> chassis (applied at the contact patch)
      for (let i = 0; i < 4; i++) {
        const cp = this.contact[i];
        if (!cp || mu[i] <= 0) { this.kappa[i] = 0; this.alpha[i] = 0; continue; }
        const S = SURF[this.phys[i]!], vx = vxs[i], vy = vys[i];
        const kap = (w[i] * r - vx) / Math.max(Math.abs(vx), VLOW);
        const fx = mu[i] * Fz[i] * magic(S.B, S.C, kap), ux = THREE.MathUtils.clamp(fx / (mu[i] * Fz[i]), -1, 1);
        const al = Math.atan2(vy, Math.max(Math.abs(vx), VLAT));
        const muY = mu[i] * sp0.side * P.side;
        const fy = -muY * Fz[i] * magic(S.B * 0.9, S.C * 0.85, al) * Math.sqrt(Math.max(0.04, 1 - ux * ux)); // friction ellipse
        // rolling resistance incl. sinkage: a spinning / sliding tyre digs into soft ground
        const soft = S.soft ? P.softDrag * sp0.drag[this.surfaces[i] === 'sand' ? 'sand' : 'mud'] : 1;
        const crr = (S.crr + S.dig * Math.min(1, Math.max(0, Math.abs(kap) - 0.08) * 2)) * soft;
        const frr = -Math.sign(vx) * Math.min(crr * Fz[i], Math.abs(vx) * mShare / h);
        const fwater = this.inPuddle[i] ? -45 * vx * Math.abs(vx) : 0;
        const fl = fx + frr + fwater;
        const f = fwV[i], s = swV[i];
        this.body.applyImpulseAtPoint({ x: (f.x * fl + s.x * fy) * h, y: (f.y * fl + s.y * fy) * h, z: (f.z * fl + s.z * fy) * h }, cp, true);
        this.kappa[i] = kap; this.alpha[i] = al; this.wheelForce[i] = fx;
      }
    }
    for (let i = 0; i < 4; i++) {
      this.wAng[i] += this.w[i] * dt; this.wheelRate[i] = this.w[i];
      const drv = twoH ? (i >= 2 ? 0.5 : 0) : (i < 2 ? fs : 1 - fs) / 2 * 2 / 2 * 2;
      this.wheelReq[i] = (Td * (twoH ? (i >= 2 ? 0.5 : 0) : i < 2 ? fs / 2 : (1 - fs) / 2)) / r; void drv;
      this.slip[i] = this.contact[i] ? Math.min(1, Math.abs(this.kappa[i]) * 1.6 + Math.max(0, Math.abs(this.alpha[i]) - 0.05) * 2.5) : 0;
      ctrl.setWheelSteering(i, delta[i]);
    }
    this.ratio = lowK; this.engineForce = Td / r;
    // aerodynamic drag at the centre of mass
    { const v = this.body.linvel(), vm = Math.hypot(v.x, v.y, v.z), k = 0.5 * 1.2 * pt.cda * vm * dt;
      this.body.applyImpulse({ x: -k * v.x, y: -k * v.y, z: -k * v.z }, true); }

    { // local acceleration (camera / brake lights) + visual sprung-body lean (cosmetic, small)
      const v1 = this.body.linvel(), q = this.body.rotation();
      if (this.lastV) {
        const qq = new THREE.Quaternion(q.x, q.y, q.z, q.w).invert();
        const a = new THREE.Vector3((v1.x - this.lastV.x) / dt, (v1.y - this.lastV.y) / dt, (v1.z - this.lastV.z) / dt).applyQuaternion(qq);
        const k = 1 - Math.exp(-dt * 8);
        this.accLocal.x += (THREE.MathUtils.clamp(a.x, -25, 25) - this.accLocal.x) * k;
        this.accLocal.y += (THREE.MathUtils.clamp(a.z, -25, 25) - this.accLocal.y) * k;
      }
      this.lastV = { x: v1.x, y: v1.y, z: v1.z };
      const Ln = this.lean, lk = P.lean * 0.5, tp = THREE.MathUtils.clamp(-this.accLocal.y * 0.0055 * lk, -0.05, 0.05), tr = THREE.MathUtils.clamp(this.accLocal.x * 0.0065 * lk, -0.05, 0.05);
      const jolt = Math.max(0, v1.y - this.lastVy); this.lastVy = v1.y; this.landJolt = jolt;
      Ln.vp += ((tp - Ln.pitch) * 90 - Ln.vp * 11) * dt; Ln.pitch += Ln.vp * dt;
      Ln.vr += ((tr - Ln.roll) * 80 - Ln.vr * 10) * dt; Ln.roll += Ln.vr * dt;
      this.braking = (brk > 0.05 && Math.abs(speed) > 0.5) || (inp.handbrake && Math.abs(speed) > 0.5);
    }
    this.throttle = thr;
    this.gear = dir < 0 ? -1 : this.gearIdx;
    this.rpm += (Math.min(pt.redline, rpm) - this.rpm) * Math.min(1, dt * 15);
  }
  private _fwV = [0, 1, 2, 3].map(() => new THREE.Vector3()); private _swV = [0, 1, 2, 3].map(() => new THREE.Vector3());
  private static _q2 = new THREE.Quaternion(); private static _f = new THREE.Vector3(); private static _u = new THREE.Vector3();
  private static _p = new THREE.Vector3(); private static _t = new THREE.Vector3(); private static _tw = new THREE.Vector3();
  private static _fw = new THREE.Vector3(); private static _sw = new THREE.Vector3(); private static _n = new THREE.Vector3(); private static _pp = new THREE.Vector3();
  /** tyre + rim rotational inertia (kg m^2), grows with wheel size */
  get wheelInertia() { const r = this.spec.wheel.r, m = 20 + 2000 * (r - 0.36) ** 2; return 0.55 * m * r * r; }

  /** Copy physics state to visuals; also lay tyre tracks on soft ground. */
  sync() {
    const t = this.body.translation(), r = this.body.rotation();
    this.group.position.set(t.x, t.y, t.z);
    this.group.quaternion.set(r.x, r.y, r.z, r.w);
    this.bodyVis.rotation.set(this.lean.pitch, 0, this.lean.roll);
    if (this.tailMat) this.tailMat.emissiveIntensity = this.braking ? 5 : this.lightsOn ? 2.6 : 1.2; // brake / tail lights
    if (this.rearGlow) { this.rearGlow.visible = this.lightsOn; this.rearGlow.intensity = this.braking ? 6 : 2.2; } // only lit with the headlights (an invisible light costs no shader time)
    for (let i = 0; i < 4; i++) {
      const c = this.conn[i];
      const len = this.ctrl.wheelSuspensionLength(i) ?? this.spec.susp.rest;
      const w = this.wheelMeshes[i];
      w.position.set(c.x, c.y - len, c.z);
      w.rotation.y = i < 2 ? (this.ctrl.wheelSteering(i) ?? this.steer) : 0;
      const spin = w.children[0];
      spin.rotation.x = this.wAng[i];
      // continuous tyre tracks on soft ground
      const s = this.surfaces[i];
      if (s && s !== 'ground' && s !== 'rock' && this.ctrl.wheelIsInContact(i) && !this.inPuddle[i]) {
        const p = this.ctrl.wheelContactPoint(i);
        if (p) {
          const n = this.ctrl.wheelContactNormal(i);
          this.tracks.add(i, new THREE.Vector3(p.x, p.y, p.z), n ? new THREE.Vector3(n.x, n.y, n.z) : new THREE.Vector3(0, 1, 0), this.forward(), s);
        }
      } else this.tracks.lift(i);
    }
    this.syncSuspension();
    if (this.steeringWheel) this.steeringWheel.rotation.z = this.wheelDegOverride !== null ? this.wheelDegOverride * Math.PI / 180 : -Vehicle.wheelTurn(this.steer);
    this.dirtU.value = this.dirt;
  }

  /** Network proxy (remote player): place body + wheels from an interpolated server state instead of local physics. */
  syncRemote(p: { x: number; y: number; z: number }, q: { x: number; y: number; z: number; w: number }, steer: number, susp: number[], speed: number, dt: number) {
    this.group.position.set(p.x, p.y, p.z); this.group.quaternion.set(q.x, q.y, q.z, q.w);
    this.steer = steer;
    for (let i = 0; i < 4; i++) {
      const c = this.conn[i], w = this.wheelMeshes[i];
      w.position.set(c.x, c.y - susp[i], c.z); w.rotation.y = i < 2 ? steer : 0;
      this.extraSpin[i] += (speed / this.spec.wheel.r) * dt; w.children[0].rotation.x = this.extraSpin[i];
    }
    this.syncSuspension();
    if (this.steeringWheel) this.steeringWheel.rotation.z = -Vehicle.wheelTurn(steer);
  }
  /** current suspension lengths (sent to other players for wheel animation) */
  suspLengths() { return [0, 1, 2, 3].map((i) => this.ctrl.wheelSuspensionLength(i) ?? this.spec.susp.rest); }

  private static _m = new THREE.Matrix4(); private static _q = new THREE.Quaternion(); private static _v = new THREE.Vector3();
  private static _a = new THREE.Vector3(); private static _b = new THREE.Vector3(); private static _s = new THREE.Vector3();
  private static _up = new THREE.Vector3(0, 1, 0); private static _x = new THREE.Vector3(1, 0, 0);
  /** Place a unit-length part between a and b (axis = `axis`), stretched along it. */
  private static between(im: THREE.InstancedMesh, i: number, a: THREE.Vector3, b: THREE.Vector3, axis: THREE.Vector3, centre: boolean) {
    const V = Vehicle, d = V._v.subVectors(b, a), len = d.length();
    V._q.setFromUnitVectors(axis, d.divideScalar(len || 1));
    V._s.set(axis === V._x ? len : 1, axis === V._up ? len : 1, 1);
    const p = centre ? V._b.copy(a).add(b).multiplyScalar(0.5) : V._b.copy(a);
    im.setMatrixAt(i, V._m.compose(p, V._q, V._s));
  }
  /** Dampers/springs stretch between body mounts and hubs; axles tilt / wishbones swing with wheel travel. */
  private syncSuspension() {
    if (!this.shocks) return;
    const V = Vehicle, W = this.spec.wheel, hubs = this.wheelMeshes.map((w) => w.position);
    for (let i = 0; i < 4; i++) {
      const sx = i % 2 === 0 ? 1 : -1, h = hubs[i];
      const top = V._a.set(sx * (W.x - 0.28), W.y + 0.12, h.z - 0.12);
      const bot = new THREE.Vector3(sx * (W.x - W.w * 0.5 - 0.1), h.y + 0.02, h.z - 0.1);
      V.between(this.shocks, i, bot, top, V._up, true);
      if (this.springs) V.between(this.springs, i, bot.clone().lerp(top, 0.12), top.clone().lerp(bot, 0.06), V._up, true);
      if (this.links && this.spec.axle === 'independent') {
        const piv = new THREE.Vector3(sx * 0.32, W.y - this.spec.susp.rest + 0.02, h.z);
        V.between(this.links, i, piv, new THREE.Vector3(sx * (W.x - W.w * 0.5 - 0.02), h.y, h.z), V._x, false);
      }
    }
    if (this.links && this.spec.axle === 'solid') {
      for (const [k, l, r] of [[0, 0, 1], [1, 2, 3]]) {
        const a = hubs[l], b = hubs[r];
        V._q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(a.y - b.y, a.x - b.x));
        if (k === 0) V._q.multiply(new THREE.Quaternion().setFromAxisAngle(V._up, Math.PI)); // front diff faces rearwards
        this.links.setMatrixAt(k, V._m.compose(V._b.set(0, (a.y + b.y) / 2, (a.z + b.z) / 2), V._q, V._s.set(1, 1, 1)));
      }
    }
    for (const im of [this.shocks, this.springs, this.links]) if (im) im.instanceMatrix.needsUpdate = true;
  }
}
