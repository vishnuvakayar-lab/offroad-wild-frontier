import * as THREE from 'three';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { surfaceAt, puddleAt, type Surface } from './terrain';
import { TrackMarks } from './tracks';
import { type VehicleSpec } from './vehicles';
import { Kit, mergeStatic, type Mats, type Lod } from './kit';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface DriveInput { throttle: number; brake: number; steer: number; handbrake: boolean; }
/** Transfer case: 2H = rear-wheel drive, 4H = 50/50 front/rear, 4L = 4H through a low-range reduction, AWD = permanent (no low range). */
export type Transfer = '2H' | '4H' | '4L' | 'AWD';
/** Transmission selector: A = automatic (brake at standstill engages reverse), or manual P / R / N / D. */
export type GearSel = 'A' | 'P' | 'R' | 'N' | 'D';
export const LOW_RANGE = 2.6;          // 4L reduction ratio: x2.6 wheel torque, top speed / 2.6
export const SHIFT_ON_FLY_KMH = 60;    // 2H <-> 4H allowed below this speed
export const DIR_SHIFT_KMH = 2;        // D <-> R only below this speed
export interface ShiftResult { ok: boolean; msg: string }

/** Per-surface handling. frictionSlip limits tyre grip (Rapier raycast vehicle);
 *  drag is a speed-proportional resistance (sinking into mud / ploughing sand). */
export const SURFACE_PARAMS: Record<Surface, { slip: number; side: number; drag: number; label: string }> = {
  ground: { slip: 1.5, side: 1.0, drag: 0.04, label: 'Dirt' },
  sand: { slip: 0.75, side: 0.7, drag: 0.28, label: 'Sand' },
  mud: { slip: 0.42, side: 0.45, drag: 0.55, label: 'Mud' },
  // rock: hard but loose scree on top - less grip than packed dirt, very little drag
  rock: { slip: 1.12, side: 0.82, drag: 0.05, label: 'Rock' },
};

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
  /** drivetrain state */
  transfer: Transfer = '4H'; sel: GearSel = 'A';
  /** per-wheel drive force applied in the last step (N), for tests / HUD */
  wheelForce = [0, 0, 0, 0];
  /** drivetrain output per wheel before the traction limit (engine force x ratio x split) */
  wheelReq = [0, 0, 0, 0];
  /** wheel angular speed (rad/s) from the physics wheels */
  wheelRate = [0, 0, 0, 0];
  private lastRot = [0, 0, 0, 0];
  ratio = 1; engineForce = 0;

  spec: VehicleSpec;
  private conn: { x: number; y: number; z: number }[];
  private world: RAPIER_NS.World;
  private scene: THREE.Scene;
  /** how high above the terrain the chassis centre must spawn so the wheels are not buried */
  spawnLift: number;
  private inertiaY = 4800;

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
    if (!headless) { this.buildModel(paint); scene!.add(this.group); }
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
      accent: std('accent', { color: 0xece8de, roughness: 0.5, metalness: 0.1 }),
      rubber: std('rubber', { color: 0x161616, roughness: 0.92, metalness: 0 }, 0.15),
      alloy: std('alloy', { color: spec.rim.color, roughness: spec.rim.rough, metalness: spec.rim.metal }, 1.1),
      caliper: std('caliper', { color: spec.spring, roughness: 0.4, metalness: 0.3 }),
    };
    this.mats.push(...Object.values(m));
    const k = new Kit(g, m, this.lod);
    spec.build(k, spec);
    mergeStatic(g);
    g.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh) this.geos.push(mm.geometry); });
    // sprung body: everything built so far (shell, cabin, lamps) leans on top of the physical chassis motion
    this.bodyVis = new THREE.Group(); this.bodyVis.name = 'body:sprung';
    for (const ch of [...g.children]) this.bodyVis.add(ch);
    g.add(this.bodyVis);
    this.tailMat = m.tail;

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
    this.beam = new THREE.SpotLight(0xfff1d0, 0, 70, 0.42, 0.6, 1.0);
    this.beam.position.set(0, L.y + 0.25, L.z);
    this.beam.target.position.set(0, -1, L.z + 14);
    this.beam.shadow.mapSize.set(1024, 1024);
    this.beam.shadow.camera.near = 0.5; this.beam.shadow.camera.far = 70; this.beam.shadow.bias = -0.0008;
    g.add(this.beam, this.beam.target);
    this.sync();
  }

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
      if (kmh > 1 || (this.sel !== 'N' && this.sel !== 'P')) return { ok: false, msg: `Stop and select N to shift ${t === '4L' ? 'into' : 'out of'} 4L` };
    } else if (kmh > SHIFT_ON_FLY_KMH) return { ok: false, msg: `Slow below ${SHIFT_ON_FLY_KMH} km/h to shift to ${t}` };
    this.transfer = t; return { ok: true, msg: t };
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

  step(dt: number, inp: DriveInput) {
    const ctrl = this.ctrl;
    const speed = this.forwardSpeed();
    { // cosmetic mud build-up (visual only; no effect on physics)
      let mudW = 0, sandW = 0; for (const s of this.surfaces) { if (s === 'mud') mudW++; else if (s === 'sand') sandW++; }
      const sp = Math.min(1, (Math.abs(speed) + 1) / 6);
      if (mudW) this.dirt = Math.min(1, this.dirt + dt * 0.08 * (mudW / 4) * sp);
      else if (sandW && this.dirt < 0.3) this.dirt = Math.min(0.3, this.dirt + dt * 0.01 * sp);
    }
    // speed-sensitive steering, smoothed
    const sp0 = this.spec;
    const maxSteer = sp0.steerLow - (sp0.steerLow - sp0.steerHigh) * Math.min(1, Math.abs(speed) / 28);
    const target = inp.steer * maxSteer;
    this.steer += (target - this.steer) * Math.min(1, dt * 8);

    // drive / brake / reverse logic (transmission selector + transfer case)
    let engine = 0, brake = 0;
    const bs = sp0.mass / 1650; // brake impulses scale with mass
    const low = this.transfer === '4L' ? LOW_RANGE : 1;
    const force = sp0.engine * low, top = sp0.topSpeed / low, rev = sp0.reverse / low;
    const fwdDrive = (t: number) => force * t * Math.max(0, 1 - Math.max(0, speed) / top);
    const revDrive = (t: number) => -force * 0.6 * t * Math.max(0, 1 - Math.max(0, -speed) / rev);
    const sel = this.sel;
    if (sel === 'A') {
      if (inp.throttle > 0.01) {
        if (speed < -0.8) brake = 70 * bs * inp.throttle;
        else engine = fwdDrive(inp.throttle);
      }
      if (inp.brake > 0.01) {
        if (speed > 0.8) brake = Math.max(brake, 70 * bs * inp.brake);
        else if (inp.throttle <= 0.01) engine = revDrive(inp.brake);
      }
    } else if (sel === 'D' || sel === 'R') {
      if (inp.throttle > 0.01) {
        const against = sel === 'D' ? speed < -0.8 : speed > 0.8; // rolling the wrong way: throttle brakes first
        if (against) brake = 70 * bs * inp.throttle; else engine = sel === 'D' ? fwdDrive(inp.throttle) : revDrive(inp.throttle);
      }
      if (inp.brake > 0.01) brake = Math.max(brake, 70 * bs * inp.brake);
    } else if (sel === 'N') {
      if (inp.brake > 0.01) brake = 70 * bs * inp.brake;
    } else brake = 200 * bs; // P: parking pawl
    if (inp.throttle <= 0.01 && inp.brake <= 0.01 && sel !== 'P') brake = sel === 'N' ? 1.2 * bs : 4 * bs * low; // engine braking (stronger in low range) / rolling resistance
    // torque split: 2H drives only the rear axle (same total force), 4H/4L/AWD split it evenly
    // 2H: rear axle only (same total force); 4H/4L/AWD: front/rear split from the vehicle spec (frontSplit, default 50 %)
    const fsp = sp0.frontSplit ?? 0.5;
    const split = this.transfer === '2H' ? [0, 0, 2, 2] : [2 * fsp, 2 * fsp, 2 * (1 - fsp), 2 * (1 - fsp)];
    this.ratio = low; this.engineForce = (engine / low) * 4; // engine drive force referred to the wheels in high range (all wheels)

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
      const gripK = sp0.grip[surf === 'rock' ? 'ground' : surf] * sp.slip; // tyres: rock uses the hard-surface grip rating
      const dragK = sp.drag * (surf === 'ground' || surf === 'rock' ? 1 : sp0.drag[surf]);
      dragSum += inContact ? dragK + (this.inPuddle[i] ? 0.35 : 0) : 0;
      // slip estimate: requested drive force vs available grip (Rapier clamps the forward impulse at
      // suspensionForce * frictionSlip) plus sideways sliding
      if (inContact) {
        const grip = (ctrl.wheelSuspensionForce(i) ?? 0) * gripK;
        const req = Math.abs(engine * split[i]) + (inp.handbrake && i >= 2 ? 3000 * bs : 0);
        const lon = req > grip && req > 0 ? (req - grip) / req : 0;
        this.slip[i] = Math.min(1, lon + latV / 7);
      } else this.slip[i] = 0;
      const rear = i >= 2;
      ctrl.setWheelFrictionSlip(i, gripK);
      ctrl.setWheelSideFrictionStiffness(i, sp.side * sp0.side * (rear && inp.handbrake ? 0.35 : 1));
      ctrl.setWheelSteering(i, rear ? 0 : this.steer);
      // traction limit for force above the arcade baseline: the tuned tyre model always delivers the high-range per-wheel
      // force; anything beyond it (2H doubling the rear, 4L multiplication) is limited by load x grip -> wheelspin instead
      const reqF = engine * split[i];
      let outF = reqF;
      if (inContact) { const cap = Math.max(Math.abs(engine) / low, (ctrl.wheelSuspensionForce(i) ?? 0) * gripK); outF = Math.sign(reqF) * Math.min(Math.abs(reqF), cap); }
      ctrl.setWheelEngineForce(i, outF); this.wheelReq[i] = reqF; this.wheelForce[i] = outF;
      ctrl.setWheelBrake(i, rear && inp.handbrake ? 160 * bs : brake);
      // visual wheel-spin on loose surfaces under power
      if (split[i] > 0) this.extraSpin[i] += Math.sign(engine) * (inContact ? this.slip[i] : Math.abs(engine) / force) * dt * 20;
    }
    ctrl.updateVehicle(dt);
    for (let i = 0; i < 4; i++) { const r = ctrl.wheelRotation(i) ?? 0; this.wheelRate[i] = (r - this.lastRot[i]) / dt; this.lastRot[i] = r; }
    { // local acceleration for the sprung-body lean + brake lights
      const v1 = this.body.linvel(), q = this.body.rotation();
      if (this.lastV) {
        const qq = new THREE.Quaternion(q.x, q.y, q.z, q.w).invert();
        const a = new THREE.Vector3((v1.x - this.lastV.x) / dt, (v1.y - this.lastV.y) / dt, (v1.z - this.lastV.z) / dt).applyQuaternion(qq);
        const k = 1 - Math.exp(-dt * 8);
        this.accLocal.x += (THREE.MathUtils.clamp(a.x, -25, 25) - this.accLocal.x) * k;
        this.accLocal.y += (THREE.MathUtils.clamp(a.z, -25, 25) - this.accLocal.y) * k;
      }
      this.lastV = { x: v1.x, y: v1.y, z: v1.z };
      // spring-damper towards the target lean (looks like body roll / dive / squat on the springs)
      const L = this.lean, tp = THREE.MathUtils.clamp(-this.accLocal.y * 0.0055, -0.055, 0.055), tr = THREE.MathUtils.clamp(this.accLocal.x * 0.0065, -0.065, 0.065);
      L.vp += ((tp - L.pitch) * 90 - L.vp * 11) * dt; L.pitch += L.vp * dt;
      L.vr += ((tr - L.roll) * 80 - L.vr * 10) * dt; L.roll += L.vr * dt;
      this.braking = (inp.brake > 0.05 && speed > 0.5) || (inp.handbrake && Math.abs(speed) > 0.5);
    }

    // simple automatic gearbox -> engine RPM for audio/HUD
    this.throttle = Math.max(inp.throttle, engine < 0 ? inp.brake : 0);
    const kmh = Math.abs(speed) * 3.6;
    const gk = (top * 3.6) / 130;
    const GEARS = [0, 18, 36, 58, 82, 108, 140].map((g) => g * gk);
    let gI = 1; while (gI < GEARS.length - 1 && kmh > GEARS[gI]) gI++;
    this.gear = speed < -0.5 || sel === 'R' ? -1 : gI;
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
    this.bodyVis.rotation.set(this.lean.pitch, 0, this.lean.roll);
    if (this.tailMat) this.tailMat.emissiveIntensity = this.braking ? 5 : 1.2; // brake lights
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
      if (s && s !== 'ground' && s !== 'rock' && this.ctrl.wheelIsInContact(i) && !this.inPuddle[i]) {
        const p = this.ctrl.wheelContactPoint(i);
        if (p) {
          const n = this.ctrl.wheelContactNormal(i);
          this.tracks.add(i, new THREE.Vector3(p.x, p.y, p.z), n ? new THREE.Vector3(n.x, n.y, n.z) : new THREE.Vector3(0, 1, 0), this.forward(), s);
        }
      } else this.tracks.lift(i);
    }
    this.syncSuspension();
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
