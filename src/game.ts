import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { buildTerrain, heightAt, ZONES, wetMaterials, waterMat, PUDDLES, TREES } from './terrain';
import { Vehicle, SURFACE_PARAMS, type DriveInput } from './vehicle';
import { TrackMarks } from './tracks';
import { VEHICLES, PAINTS, vehicleById, stats } from './vehicles';
import { Input } from './input';
import { GameAudio } from './audio';
import { Particles, Rain } from './particles';
import { WEATHER, WEATHER_ORDER, makeStars, type WeatherId } from './weather';
import { loadSettings, saveSettings, PRESETS, isCoarse, type Preset, type TouchMode } from './settings';
import { MISSIONS, missionById, medalFor, MissionRunner, type Mode, type Pose } from './missions';
import { MissionWorld } from './missionWorld';
import { loadSave, storeSave, migrate, award, applyUpgrades, upgradesOf, vehicleUnlocked, paintUnlocked, devMode, levelOf, upgradeCost,
  VEHICLE_UNLOCK, PAINT_LEVEL, UPGRADE_KINDS, MAX_UPGRADE, XP_PER_LEVEL, SAVE_KEY, type UpgradeKind, type Medal } from './save';
import type { TrackMarks as TM } from './tracks';

type Phase = 'loading' | 'menu' | 'garage' | 'intro' | 'playing' | 'paused' | 'modes' | 'results';
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const IDLE: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: true };
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export async function boot(RAPIER: typeof RAPIER_NS, setLoad: (pct: number, text: string) => void) {
  const settings = loadSettings();
  const save = loadSave();
  if (!vehicleUnlocked(save, settings.vehicle)) settings.vehicle = 'scout';
  const specFor = (id: string) => applyUpgrades(vehicleById(id), upgradesOf(save, id));
  const audio = new GameAudio();
  audio.setVolume(settings.volume, settings.muted);
  setLoad(45, 'Sculpting terrain…');
  await nextFrame();

  // ---------- renderer (re-creatable so the AA setting applies without a reload) ----------
  let canvas = $<HTMLCanvasElement>('game');
  let renderer!: THREE.WebGLRenderer;
  let rendererAA: boolean | null = null;
  const scene = new THREE.Scene();
  const skyCol = new THREE.Color();
  scene.background = skyCol;
  scene.fog = new THREE.Fog(skyCol, 40, 300);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
  const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x5a4630, 1.1);
  const sun = new THREE.DirectionalLight(0xffe2b8, 2.6);
  sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 260; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.04;
  scene.add(hemi, sun, sun.target);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; varying vec3 vP;
      void main(){ float t = smoothstep(-0.02, 0.45, vP.y); vec3 c = mix(bottom, top, t);
        float s = max(0.0, dot(normalize(vP), normalize(sunDir))); c += sunCol * (pow(s, 600.0) * 3.0 + pow(s, 12.0) * 0.25);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 24, 12), skyMat);
  scene.add(sky);
  const stars = makeStars(scene);
  // night/low-light visibility: soft fill from the camera side + cool rim from behind (only near the car)
  const fill = new THREE.PointLight(0xdfe6ff, 0, 11, 1.6);
  const rim = new THREE.PointLight(0x9fb8ff, 0, 10, 1.6);
  let fillEnabled = true;
  // garage studio lighting (key + rim spots), only lit in the garage
  const keyL = new THREE.SpotLight(0xffe6c8, 0, 30, 0.6, 0.5, 1.2);
  const rimL = new THREE.SpotLight(0xa8c8ff, 0, 30, 0.7, 0.6, 1.2);
  scene.add(fill, rim, keyL, keyL.target, rimL, rimL.target);

  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = 1 / 60;
  buildTerrain(scene, world, RAPIER);
  setLoad(70, 'Fuelling the 4×4…');
  await nextFrame();
  const tracks = new TrackMarks(scene);
  const paintFor = (id: string) => settings.paints[id] ?? vehicleById(id).defaultPaint;
  const lodFor = (p: Preset) => (p === 'low' ? 0 : 1) as 0 | 1;
  let car = new Vehicle(world, RAPIER, scene, tracks, specFor(settings.vehicle), paintFor(settings.vehicle), lodFor(settings.preset));
  let envTex: THREE.Texture | null = null;
  // spawn facing open ground towards the dunes (no trees on this line)
  const spawn = { x: 0, z: -8, yaw: Math.atan2(ZONES.sand.x - 0, ZONES.sand.z + 8) };
  const resetCar = (x = spawn.x, z = spawn.z, yaw = spawn.yaw) => car.reset(x, heightAt(x, z) + car.spawnLift, z, yaw);
  resetCar();

  const mudP = new Particles(scene, 1800, 9.8, 0.6, 0.95);
  const dustP = new Particles(scene, 1400, -0.3, 1.3, 0.34);
  const splashP = new Particles(scene, 1000, 9.8, 0.4, 0.75);
  const allP = [mudP, dustP, splashP];
  const rain = new Rain(scene, 5000);
  setLoad(85, 'Checking the weather…');

  let weather: WeatherId = settings.weather;
  const sunDir = new THREE.Vector3();
  const terrainMat = wetMaterials[0];

  function makeRenderer(aa: boolean) {
    const old = rendererAA === null ? null : renderer;
    if (old) {
      const c = document.createElement('canvas'); c.id = 'game'; c.setAttribute('aria-label', 'Game view');
      canvas.replaceWith(c); canvas = c;
      for (const l of [sun, car.beam]) { l.shadow.map?.dispose(); (l.shadow as any).map = null; }
      old.dispose(); old.forceContextLoss();
    }
    renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererAA = aa;
    attachLook(canvas);
    // studio reflection map for the vehicle materials only (regenerated with each GL context)
    envTex?.dispose();
    const pm = new THREE.PMREMGenerator(renderer); envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose();
    car.setEnv(envTex, 1);
  }

  // ---------- settings application ----------
  const applyPreset = (p: Preset) => {
    const cfg = PRESETS[p];
    if (rendererAA !== cfg.aa) makeRenderer(cfg.aa);
    if (car.lod !== lodFor(p)) car.rebuildVisual(lodFor(p));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.pixelRatio));
    renderer.shadowMap.enabled = cfg.shadows;
    sun.castShadow = cfg.shadows;
    if (sun.shadow.mapSize.x !== cfg.shadowSize) {
      sun.shadow.mapSize.set(cfg.shadowSize, cfg.shadowSize);
      sun.shadow.map?.dispose(); (sun.shadow as any).map = null;
    }
    for (const ps of allP) ps.budget = cfg.particles;
    rain.setDensity(cfg.rain);
    $('preset-note').textContent = p === 'low' ? 'No shadows, no anti-aliasing, fewer particles — best for older phones.'
      : p === 'medium' ? 'Shadows, anti-aliasing, balanced resolution and particles.' : 'Full resolution, high-res shadows, max particles.';
    applyWeather(weather);
    resize();
  };

  function applyWeather(id: WeatherId) {
    weather = id;
    const w = WEATHER[id], cfg = PRESETS[settings.preset];
    skyMat.uniforms.top.value.set(w.skyTop); skyMat.uniforms.bottom.value.set(w.skyBottom);
    skyCol.set(w.fog);
    const fog = scene.fog as THREE.Fog; fog.color.set(w.fog); fog.near = w.fogNear; fog.far = Math.min(w.fogFar, cfg.fogFar);
    camera.far = Math.max(120, fog.far + 300); camera.updateProjectionMatrix();
    sun.color.set(w.sun); sun.intensity = w.sunI; sunDir.set(...w.sunDir).normalize();
    skyMat.uniforms.sunDir.value.copy(sunDir); skyMat.uniforms.sunCol.value.set(id === 'fog' || id === 'rain' ? 0x000000 : w.sun);
    hemi.color.set(w.hemiSky); hemi.groundColor.set(w.hemiGround); hemi.intensity = w.hemiI;
    renderer.toneMappingExposure = w.exposure;
    stars.visible = w.stars; rain.mesh.visible = w.rain;
    terrainMat.roughness = w.wet ? 0.45 : 0.95; terrainMat.metalness = w.wet ? 0.08 : 0; terrainMat.color.set(w.wet ? 0xa8a8a8 : 0xffffff);
    car.paint.roughness = w.wet ? 0.15 : 0.45;
    waterMat.color.set(0x4a4030).lerp(new THREE.Color(w.fog), 0.3);
    for (const ps of allP) ps.uniforms.uTint.value.set(w.tint);
    const night = id === 'night';
    for (const h of car.headlights) h.intensity = w.headlights && settings.preset !== 'low' ? (night ? 90 : 45) : 0;
    car.beam.intensity = w.headlights ? (night ? 320 : 160) : 0;
    const beamShadow = w.headlights && cfg.beamShadow && cfg.shadows && (night || id === 'fog');
    if (car.beam.castShadow !== beamShadow) { car.beam.castShadow = beamShadow; car.beam.shadow.map?.dispose(); (car.beam.shadow as any).map = null; }
    car.lampMat.emissiveIntensity = w.headlights ? 5 : 1.5;
    scene.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m && !Array.isArray(m)) m.needsUpdate = true; });
    $('btn-weather').textContent = w.icon;
    document.querySelectorAll('#seg-weather button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === id));
  }
  const touchOn = () => settings.touch === 'on' || (settings.touch === 'auto' && isCoarse());

  // ---------- resize / rotation / safe areas ----------
  let baseFov = 62;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    baseFov = w / h < 1 ? 72 : 62; // wider vertical FOV in portrait so the vehicle stays in view
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 150));
  window.visualViewport?.addEventListener('resize', resize);

  // ---------- input & UI ----------
  const input = new Input();
  document.querySelectorAll<HTMLElement>('#touch .tbtn').forEach((el) => input.bindHold(el, el.dataset.k as any));
  let phase: Phase = 'loading';
  const show = (id: string, on: boolean) => $(id).classList.toggle('hidden', !on);
  const drawer = $('drawer');
  const openDrawer = (on: boolean) => { drawer.classList.toggle('open', on); drawer.setAttribute('aria-hidden', String(!on)); };
  let toastTimer = 0;
  const toast = (t: string) => { const el = $('toast'); el.textContent = t; el.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el.classList.add('hidden'), 1600); };
  const refreshUI = () => {
    document.body.classList.toggle('touch', touchOn());
    show('menu', phase === 'menu');
    show('garage', phase === 'garage');
    show('modes', phase === 'modes');
    show('results', phase === 'results');
    show('mhud', !!mission && (phase === 'playing' || phase === 'paused'));
    show('btn-quit', !!mission);
    $('btn-reset').textContent = mission ? 'Reset to checkpoint' : 'Reset vehicle';
    const lvl = levelOf(save.xp), prog = `Lv ${lvl} · ${save.credits.toLocaleString()} cr · ${save.xp % XP_PER_LEVEL}/${XP_PER_LEVEL} XP${devMode() ? ' · DEV' : ''}`;
    $('menu-prog').textContent = prog; $('modes-prog').textContent = prog;
    show('pause', phase === 'paused');
    show('hud', phase === 'playing' || phase === 'paused');
    show('touch', phase === 'playing' && touchOn());
    $('hud-fps').classList.toggle('hidden', !settings.showFps);
    document.querySelectorAll('#seg-preset button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.preset));
    document.querySelectorAll('#seg-touch button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.touch));
    $<HTMLInputElement>('chk-fps').checked = settings.showFps;
    $<HTMLInputElement>('chk-intro').checked = settings.intro;
    $<HTMLInputElement>('chk-mute').checked = settings.muted;
    $<HTMLInputElement>('rng-volume').value = String(settings.volume);
    $('btn-mute').textContent = settings.muted ? '🔇' : '🔊';
  };
  const setPhase = (p: Phase) => { phase = p; if (p !== 'paused' && p !== 'menu') openDrawer(false); input.clearTouch(); refreshUI(); };

  // ---- garage ----
  let gIndex = Math.max(0, VEHICLES.findIndex((v) => v.id === settings.vehicle));
  function setVehicle(id: string, force = false) {
    if (car.spec.id === id && !force) return;
    car.dispose();
    car = new Vehicle(world, RAPIER, scene, tracks, specFor(id), paintFor(id), lodFor(settings.preset));
    resetCar();
    applyWeather(weather);
  }
  function renderGarage() {
    const spec = VEHICLES[gIndex];
    $('g-name').textContent = spec.name; $('g-class').textContent = spec.klass; $('g-desc').textContent = spec.desc;
    $('g-dots').innerHTML = VEHICLES.map((_, i) => `<i class="${i === gIndex ? 'on' : ''}"></i>`).join('');
    const st = stats(spec);
    $('g-stats').innerHTML = Object.entries(st).map(([k, v]) => `<span>${k}</span><div class="bar"><i style="width:${Math.round(v * 100)}%"></i></div>`).join('');
    const cur = paintFor(spec.id);
    $('g-colors').innerHTML = PAINTS.map((p) => `<button data-hex="${p.hex}" title="${p.name}${paintUnlocked(save, p.hex) ? '' : ' (level ' + PAINT_LEVEL(p.hex) + ')'}" aria-label="${p.name}" class="${p.hex === cur ? 'on' : ''} ${paintUnlocked(save, p.hex) ? '' : 'locked'}" style="background:#${p.hex.toString(16).padStart(6, '0')}"></button>`).join('');
    $('g-paint-name').textContent = PAINTS.find((p) => p.hex === cur)?.name ?? 'Custom';
    $('g-colors').querySelectorAll<HTMLElement>('button').forEach((b) => b.onclick = () => {
      const hex = Number(b.dataset.hex);
      if (!paintUnlocked(save, hex)) { toast(`🔒 Unlocks at level ${PAINT_LEVEL(hex)}`); return; }
      settings.paints[spec.id] = hex; saveSettings(settings); car.setPaint(hex); renderGarage();
    });
    // progression: lock / unlock / upgrades
    const unlocked = vehicleUnlocked(save, spec.id), req = VEHICLE_UNLOCK[spec.id], lvl = levelOf(save.xp);
    show('g-lock', !unlocked);
    $<HTMLButtonElement>('g-drive').disabled = !unlocked;
    if (!unlocked) {
      $('g-lock-text').textContent = `🔒 Requires level ${req.level} · ${req.price.toLocaleString()} cr`;
      const btn = $<HTMLButtonElement>('g-unlock'); btn.disabled = lvl < req.level || save.credits < req.price;
      btn.textContent = lvl < req.level ? `Level ${req.level}` : `Unlock ${req.price.toLocaleString()} cr`;
      btn.onclick = () => { if (unlockVehicle(spec.id)) toast(`${spec.name} unlocked!`); };
    }
    const up = upgradesOf(save, spec.id), NAMES: Record<UpgradeKind, string> = { engine: 'Engine', tyres: 'Tyres', susp: 'Suspension' };
    $('g-upgrades').innerHTML = unlocked ? UPGRADE_KINDS.map((k) => `<span>${NAMES[k]}</span><span class="pips">${Array.from({ length: MAX_UPGRADE }, (_, i) => `<i class="${i < up[k] ? 'on' : ''}"></i>`).join('')}</span>` +
      `<button class="btn small" data-up="${k}" ${up[k] >= MAX_UPGRADE || save.credits < upgradeCost(up[k]) ? 'disabled' : ''}>${up[k] >= MAX_UPGRADE ? 'Max' : '+ ' + upgradeCost(up[k]) + ' cr'}</button>`).join('') : '';
    $('g-upgrades').querySelectorAll<HTMLElement>('button').forEach((b) => b.onclick = () => { if (buyUpgrade(spec.id, b.dataset.up as UpgradeKind)) toast(`${NAMES[b.dataset.up as UpgradeKind]} upgraded`); });
    $('g-credits').textContent = `${save.credits.toLocaleString()} credits · level ${lvl}`;
    $('menu-vehicle').textContent = vehicleById(settings.vehicle).name;
  }
  const garageStep = (d: number) => {
    gIndex = (gIndex + d + VEHICLES.length) % VEHICLES.length;
    const id = VEHICLES[gIndex].id;
    if (vehicleUnlocked(save, id)) { settings.vehicle = id; saveSettings(settings); }
    setVehicle(id); renderGarage(); garageT = 0;
  };
  function unlockVehicle(id: string) {
    const req = VEHICLE_UNLOCK[id];
    if (save.vehicles.includes(id) || levelOf(save.xp) < req.level || save.credits < req.price) return false;
    save.credits -= req.price; save.vehicles.push(id); storeSave(save);
    settings.vehicle = id; saveSettings(settings); renderGarage(); refreshUI(); return true;
  }
  function buyUpgrade(id: string, k: UpgradeKind) {
    if (!vehicleUnlocked(save, id)) return false;
    const up = { ...upgradesOf(save, id) }, cost = upgradeCost(up[k]);
    if (up[k] >= MAX_UPGRADE || save.credits < cost) return false;
    save.credits -= cost; up[k]++; save.upgrades[id] = up; storeSave(save);
    if (car.spec.id === id) setVehicle(id, true);
    if (phase === 'garage') renderGarage(); refreshUI(); return true;
  }
  /** leaving the garage while previewing a locked vehicle returns to the selected (unlocked) one */
  const leaveGarage = () => { if (car.spec.id !== settings.vehicle) setVehicle(settings.vehicle); };
  let camOverride: [[number, number, number], [number, number, number]] | null = null;
  let garageT = 0; let garageHold: number | null = null;
  const openGarage = (ret: Phase = 'menu') => { garageReturn = ret; gIndex = Math.max(0, VEHICLES.findIndex((v) => v.id === settings.vehicle)); renderGarage(); resetCar(); garageT = 0; setPhase('garage'); };
  $('btn-garage').onclick = () => openGarage('menu');
  $('g-prev').onclick = () => garageStep(-1);
  $('g-next').onclick = () => garageStep(1);
  $('g-back').onclick = () => { leaveGarage(); setPhase(garageReturn); };
  $('g-drive').onclick = () => { if (!vehicleUnlocked(save, car.spec.id)) return; garageReturn === 'modes' ? (setPhase('modes'), renderModes()) : $('btn-play').click(); };
  let garageReturn: Phase = 'menu';

  // ---------- Phase 6: missions ----------
  let mission: MissionRunner | null = null;
  let mworld: MissionWorld | null = null;
  let stuck: Vehicle | null = null;
  let rope: RAPIER_NS.ImpulseJoint | null = null, ropeLen = 0, winching = false, winchAcc = 0;
  let resultT = 0, lastResult: any = null, modeTab: Mode = 'challenge';
  const NO_TRACKS = { add() {}, lift() {}, reset() {} } as unknown as TM;
  const STUCK_IN: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  const placeAt = (v: Vehicle, p: Pose) => v.reset(p.x, heightAt(p.x, p.z) + v.spawnLift, p.z, p.yaw);
  const anchorRear = () => new THREE.Vector3(0, car.spec.chassis.y, -car.spec.chassis.hz - 0.1);
  const anchorFront = () => new THREE.Vector3(0, stuck!.spec.chassis.y, stuck!.spec.chassis.hz + 0.1);
  const toWorld = (v: Vehicle, l: THREE.Vector3) => { const t = v.body.translation(), r = v.body.rotation(); return l.clone().applyQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w)).add(new THREE.Vector3(t.x, t.y, t.z)); };
  function makeRope(len: number) {
    if (rope) world.removeImpulseJoint(rope, true);
    const a = anchorRear(), b = anchorFront();
    rope = world.createImpulseJoint(RAPIER.JointData.rope(len, { x: a.x, y: a.y, z: a.z }, { x: b.x, y: b.y, z: b.z }), car.body, stuck!.body, true);
    ropeLen = len;
  }
  function toggleHook() {
    if (!mission || !stuck || mission.state !== 'running') return false;
    if (rope) { world.removeImpulseJoint(rope, true); rope = null; mission.attached = false; mission.say('Rope released'); return true; }
    const d = toWorld(car, anchorRear()).distanceTo(toWorld(stuck, anchorFront()));
    if (d > 10) { mission.say(`Too far to hook up (${d.toFixed(0)} m) — back up closer`); return false; }
    makeRope(Math.max(3, d + 0.3)); mission.attached = true; mission.reached = true; mission.say('Tow rope attached — drag it to the safe zone!', 2.5);
    return true;
  }
  function sampleCar() {
    const t = car.body.translation(), f = car.forward();
    return { x: t.x, z: t.z, yaw: Math.atan2(f.x, f.z), speed: car.forwardSpeed(), up: car.group.up.clone().applyQuaternion(car.group.quaternion).y };
  }
  /** one fixed physics step (player, tow target, world, mission logic) — shared by the render loop and the test simulate hook */
  function physStep(drive: DriveInput) {
    const d = mission && (mission.state === 'countdown' || mission.finished) ? IDLE : drive;
    car.step(STEP, d);
    if (stuck) {
      stuck.body.setLinearDamping(stuck.surface() === 'mud' ? 0.7 : 0.05); // bogged down in the mud
      stuck.step(STEP, STUCK_IN);
    }
    if (rope && winching) { winchAcc += STEP; if (winchAcc > 0.2 && ropeLen > 3) { winchAcc = 0; makeRope(Math.max(3, ropeLen - 0.35)); } }
    world.step();
    if (mission) { car.body.translation(); const st = stuck?.body.translation(); mission.update(STEP, sampleCar(), { stuck: st ? { x: st.x, z: st.z } : undefined }); }
  }
  function startMission(id: string) {
    const def = missionById(id); if (!def) return;
    endMission();
    if (!vehicleUnlocked(save, settings.vehicle)) settings.vehicle = 'scout';
    setVehicle(settings.vehicle);
    mission = new MissionRunner(def);
    mworld = new MissionWorld(scene, def); mworld.setGateState(0);
    if (def.stuck) {
      stuck = new Vehicle(world, RAPIER, scene, NO_TRACKS, vehicleById('voyager'), 0x7b8087, 0);
      for (const l of [...stuck.headlights, stuck.beam]) l.visible = false;
      placeAt(stuck, def.stuck);
      for (let k = 0; k < 90; k++) { stuck.step(STEP, { ...STUCK_IN, handbrake: true }); world.step(); } // settle into the mud
      stuck.sync();
    }
    if (def.type === 'deliver') applyWeather('sunset');
    resetCar(def.start.x, def.start.z, def.start.yaw); car.dirt = 0;
    resultT = 0; camInit = false; settings.intro && $('intro').classList.add('hidden');
    show('btn-mreset', !def.noReset);
    setPhase('playing');
  }
  function endMission() {
    if (!mission) return;
    if (rope) { world.removeImpulseJoint(rope, true); rope = null; }
    if (stuck) { stuck.dispose(); stuck = null; }
    mworld?.dispose(); mworld = null;
    const wasDeliver = mission.def.type === 'deliver';
    mission = null; winching = false;
    if (wasDeliver) applyWeather(settings.weather);
    $('countdown').classList.add('hidden');
    refreshUI();
  }
  function missionReset() {
    if (!mission) return;
    if (mission.requestReset()) {
      if (rope) { world.removeImpulseJoint(rope, true); rope = null; mission.attached = false; }
      resetCar(mission.last.x, mission.last.z, mission.last.yaw); camInit = false;
    }
  }
  const fmt = (t: number) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
  const MEDAL_ICON: Record<Medal, string> = { gold: '🥇', silver: '🥈', bronze: '🥉', none: '🏁' };
  function finishMission() {
    if (!mission) return;
    const m = mission, def = m.def, ok = m.state === 'success';
    const time = ok ? m.t : null, medal: Medal = ok ? medalFor(m.t, def.targets) : 'none';
    const prevBest = save.best[def.id]?.time ?? null;
    const r = award(save, def.id, time, medal, def.reward);
    if (r.newBest) save.best[def.id].splits = m.splits.slice();
    storeSave(save);
    lastResult = { id: def.id, success: ok, time, medal, ...r, prevBest, splits: m.splits.slice(), rejected: m.rejected, resets: m.resets, failReason: m.failReason };
    $('r-kicker').textContent = ({ race: 'Desert checkpoint race', challenge: 'Off-road challenge', rescue: 'Rescue & recovery' } as const)[def.mode];
    $('r-title').textContent = ok ? def.title + ' — complete' : def.title + ' — failed';
    $('r-medal').innerHTML = ok ? `${MEDAL_ICON[medal]}<em>${medal === 'none' ? 'finished' : medal}</em>` : `✖<em>${m.failReason}</em>`;
    const rows: [string, string][] = [];
    if (ok) rows.push(['Time', fmt(m.t)]);
    rows.push(['Best', save.best[def.id] ? fmt(save.best[def.id].time) + (r.newBest ? '  NEW!' : '') : '—']);
    rows.push(['Targets', `🥇 ${fmt(def.targets.gold)} · 🥈 ${fmt(def.targets.silver)} · 🥉 ${fmt(def.targets.bronze)}`]);
    m.splits.forEach((t, i) => rows.push([`Split ${i + 1}`, fmt(t)]));
    if (m.rejected) rows.push(['Missed-gate warnings', String(m.rejected)]);
    $('r-grid').innerHTML = rows.slice(0, 7).map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join('') + (rows.length > 7 ? `<span>…</span><b>${rows.length - 7} more splits</b>` : '');
    $('r-reward').textContent = `+${r.credits} credits · +${r.xp} XP` + (r.levelUp ? ` · LEVEL ${r.levelUp}!` : '');
    setPhase('results');
  }
  const nextMissionId = (id: string) => MISSIONS[(MISSIONS.findIndex((m) => m.id === id) + 1) % MISSIONS.length].id;
  $('r-retry').onclick = () => { const id = mission?.def.id; if (id) startMission(id); };
  $('r-next').onclick = () => { const id = mission?.def.id; if (id) startMission(nextMissionId(id)); };
  $('r-menu').onclick = () => { endMission(); setPhase('modes'); renderModes(); };
  function renderModes() {
    document.querySelectorAll<HTMLElement>('#m-tabs button').forEach((b) => { b.classList.toggle('on', b.dataset.mode === modeTab); b.onclick = () => { modeTab = b.dataset.mode as Mode; renderModes(); }; });
    const list = $('m-list');
    if (modeTab === 'free') {
      list.innerHTML = `<div class="m-card"><h3>Free Roam</h3><div class="meta">Open map · no timer</div><button class="btn primary small" data-free>Drive</button><p>Explore the mud basin, dunes, rocky ridge and proving-ground strip at your own pace.</p></div>`;
    } else {
      list.innerHTML = MISSIONS.filter((m) => m.mode === modeTab).map((m) => {
        const b = save.best[m.id];
        return `<div class="m-card"><h3>${m.title}</h3><div class="meta">${b ? MEDAL_ICON[b.medal] + ' best ' + fmt(b.time) : 'not completed'} · ${m.limit ? 'limit ' + fmt(m.limit) : 'no limit'} · ${m.reward} cr</div>` +
          `<button class="btn primary small" data-start="${m.id}">Start</button><p>${m.desc}</p></div>`;
      }).join('');
    }
    list.querySelectorAll<HTMLElement>('[data-start]').forEach((b) => b.onclick = () => startMission(b.dataset.start!));
    list.querySelector<HTMLElement>('[data-free]')?.addEventListener('click', () => $('btn-play').click());
    refreshUI();
  }
  $('btn-modes').onclick = () => { renderModes(); setPhase('modes'); };
  $('m-back').onclick = () => setPhase('menu');
  $('m-garage').onclick = () => openGarage('modes');
  $('btn-hook').onclick = () => toggleHook();
  $('btn-mreset').onclick = () => missionReset();
  const winchBtn = $('btn-winch');
  winchBtn.addEventListener('pointerdown', () => { winching = true; });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) winchBtn.addEventListener(ev, () => { winching = false; });
  const camDir = new THREE.Vector3();
  function updateMissionHud(dt: number) {
    if (!mission) return;
    const m = mission, def = m.def, c = sampleCar();
    $('mh-title').textContent = def.title;
    $('mh-time').textContent = m.state === 'countdown' ? fmt(0) : fmt(def.limit !== null && def.type !== 'race' ? Math.max(0, def.limit - m.t) : m.t);
    let target: { x: number; z: number } | null = null, sub = '';
    if (def.gates.length && m.next < def.gates.length) {
      target = def.gates[m.next];
      const last = m.splits.length ? m.splits[m.splits.length - 1] : null, best = save.best[def.id]?.splits?.[m.splits.length - 1];
      sub = `Next CP ${m.next + 1}/${def.gates.length}` + (last !== null ? ` · split ${fmt(last)}` + (best !== undefined ? ` (${last - best >= 0 ? '+' : '−'}${Math.abs(last - best).toFixed(1)})` : '') : '');
      if (def.noReset) sub += ' · no resets';
    } else if (def.type === 'tow' && stuck) {
      const st = stuck.body.translation();
      target = m.attached ? def.zone! : { x: st.x, z: st.z };
      sub = m.attached ? `Tow to safe zone · ${Math.hypot(st.x - def.zone!.x, st.z - def.zone!.z).toFixed(0)} m` : 'Reach the stuck 4x4 and hook up';
    } else if (def.zone) { target = def.zone; sub = def.type === 'deliver' ? 'Deliver to camp before dark' : 'Reach the summit flag'; }
    $('mh-sub').textContent = sub + (def.limit !== null && def.type !== 'race' ? ' · time left' : '');
    if (target) {
      camera.getWorldDirection(camDir);
      const ang = Math.atan2(target.x - c.x, target.z - c.z) - Math.atan2(camDir.x, camDir.z);
      const na = Math.atan2(Math.sin(ang), Math.cos(ang));
      $('mh-arrow').style.transform = `rotate(${(-na).toFixed(3)}rad)`;
      $('mh-dist').textContent = `${Math.hypot(target.x - c.x, target.z - c.z).toFixed(0)} m`;
    }
    const msgEl = $('mh-msg'); msgEl.textContent = m.msgT > 0 ? m.msg : ''; msgEl.classList.toggle('warn', /Wrong|Missed|failed|Too far/.test(m.msg));
    const cd = $('countdown');
    if (m.state === 'countdown') { cd.classList.remove('hidden'); cd.textContent = String(Math.ceil(m.countdown)); }
    else if (m.state === 'running' && m.t < 0.7) { cd.classList.remove('hidden'); cd.textContent = 'GO!'; }
    else cd.classList.add('hidden');
    show('btn-hook', def.type === 'tow' && m.state === 'running' && (m.reached || !!rope));
    $('btn-hook').textContent = rope ? 'Release (H)' : 'Hook (H)';
    show('btn-winch', !!rope);
    mworld?.setGateState(m.next);
    if (stuck) { stuck.sync(); mworld?.setRope(rope ? toWorld(car, anchorRear()) : null, rope ? toWorld(stuck, anchorFront()) : undefined); }
    if (def.type === 'deliver' && !m.finished) renderer.toneMappingExposure = WEATHER.sunset.exposure * (1 - 0.6 * sstep(0.25, 1, m.t / def.limit!));
    if (m.finished && phase === 'playing') { resultT += dt; if (resultT > 1.2) finishMission(); }
  }

  // ---- cinematic intro ----
  const INTRO_LEN = 7.6;
  let introT = 0;
  const startIntro = () => {
    resetCar(); introT = 0;
    $('intro-name').textContent = car.spec.name.toUpperCase(); $('intro-kicker').textContent = car.spec.klass;
    const el = $('intro'); el.classList.remove('hidden', 'out'); $('intro-name').parentElement!.classList.remove('show');
    setPhase('intro');
  };
  const endIntro = () => {
    if (phase !== 'intro') return;
    const el = $('intro'); el.classList.add('out'); $('intro-name').parentElement!.classList.remove('show');
    setTimeout(() => { if (phase !== 'intro') el.classList.add('hidden'); }, 650);
    camPos.copy(camera.position); camHeading = Math.atan2(car.forward().x, car.forward().z); camInit = true;
    setPhase('playing');
  };
  const cycleWeather = () => {
    const i = (WEATHER_ORDER.indexOf(weather) + 1) % WEATHER_ORDER.length;
    settings.weather = WEATHER_ORDER[i]; saveSettings(settings); applyWeather(settings.weather); toast(WEATHER[settings.weather].icon + '  ' + WEATHER[settings.weather].label);
  };
  const toggleMute = () => { settings.muted = !settings.muted; saveSettings(settings); audio.setVolume(settings.volume, settings.muted); refreshUI(); toast(settings.muted ? 'Sound off' : 'Sound on'); };

  $('btn-play').onclick = () => { endMission(); leaveGarage(); if (settings.intro) startIntro(); else { resetCar(); camInit = false; setPhase('playing'); } };
  $('btn-skip').onclick = (e) => { e.stopPropagation(); endIntro(); };
  $('btn-settings').onclick = () => openDrawer(true);
  $('btn-settings2').onclick = () => openDrawer(true);
  $('btn-close-drawer').onclick = () => openDrawer(false);
  $('btn-pause').onclick = () => setPhase('paused');
  $('btn-weather').onclick = cycleWeather;
  $('btn-mute').onclick = toggleMute;
  $('btn-resume').onclick = () => setPhase('playing');
  $('btn-reset').onclick = () => { if (mission) { setPhase('playing'); missionReset(); return; } resetCar(); camInit = false; setPhase('playing'); };
  $('btn-menu').onclick = () => { endMission(); setPhase('menu'); };
  $('btn-quit').onclick = () => { endMission(); setPhase('modes'); renderModes(); };
  input.onPause = () => {
    if (drawer.classList.contains('open')) { openDrawer(false); return; }
    if (phase === 'garage') { leaveGarage(); setPhase(garageReturn); return; }
    if (phase === 'modes') { setPhase('menu'); return; }
    if (phase === 'intro') { endIntro(); return; }
    if (phase === 'playing') setPhase('paused'); else if (phase === 'paused') setPhase('playing');
  };
  input.onKey = (code) => {
    if (phase === 'intro' && !/^(Shift|Control|Alt|Meta)/.test(code)) { endIntro(); return true; }
    if (phase === 'garage') {
      if (code === 'ArrowLeft' || code === 'KeyA') { garageStep(-1); return true; }
      if (code === 'ArrowRight' || code === 'KeyD') { garageStep(1); return true; }
      if (code === 'Enter') { $('btn-play').click(); return true; }
    }
    if (phase !== 'playing' && phase !== 'paused') return false;
    if (code === 'KeyT') { cycleWeather(); return true; }
    if (code === 'KeyH' && mission) { toggleHook(); return true; }
    if (code === 'KeyM') { toggleMute(); return true; }
    return false;
  };
  input.onReset = () => {
    if (phase !== 'playing') return;
    if (mission) { missionReset(); return; }
    const t = car.body.translation(); const f = car.forward();
    resetCar(t.x, t.z, Math.atan2(f.x, f.z)); // flip upright in place
  };
  document.querySelectorAll<HTMLElement>('#seg-preset button').forEach((b) => b.onclick = () => {
    settings.preset = b.dataset.v as Preset; saveSettings(settings); applyPreset(settings.preset); refreshUI();
  });
  document.querySelectorAll<HTMLElement>('#seg-touch button').forEach((b) => b.onclick = () => {
    settings.touch = b.dataset.v as TouchMode; saveSettings(settings); refreshUI();
  });
  document.querySelectorAll<HTMLElement>('#seg-weather button').forEach((b) => b.onclick = () => {
    settings.weather = b.dataset.v as WeatherId; saveSettings(settings); applyWeather(settings.weather);
  });
  $<HTMLInputElement>('chk-fps').onchange = (e) => { settings.showFps = (e.target as HTMLInputElement).checked; saveSettings(settings); refreshUI(); };
  $<HTMLInputElement>('chk-intro').onchange = (e) => { settings.intro = (e.target as HTMLInputElement).checked; saveSettings(settings); };
  $<HTMLInputElement>('chk-mute').onchange = (e) => { settings.muted = (e.target as HTMLInputElement).checked; saveSettings(settings); audio.setVolume(settings.volume, settings.muted); refreshUI(); };
  $<HTMLInputElement>('rng-volume').oninput = (e) => { settings.volume = Number((e.target as HTMLInputElement).value); saveSettings(settings); audio.setVolume(settings.volume, settings.muted); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && phase === 'playing') setPhase('paused'); });

  // drag-to-look (mouse or touch on empty game area); recentres when released
  let lookYaw = 0, lookPitch = 0, dragging: number | null = null, lastX = 0, lastY = 0;
  function attachLook(c: HTMLCanvasElement) {
    c.addEventListener('pointerdown', (e) => {
      if (phase === 'intro') { endIntro(); return; }
      dragging = e.pointerId; lastX = e.clientX; lastY = e.clientY; c.setPointerCapture(e.pointerId);
    });
    c.addEventListener('pointermove', (e) => {
      if (dragging !== e.pointerId) return;
      lookYaw -= (e.clientX - lastX) * 0.006; lookPitch = Math.max(-0.3, Math.min(0.6, lookPitch + (e.clientY - lastY) * 0.004));
      lastX = e.clientX; lastY = e.clientY;
    });
    const endDrag = (e: PointerEvent) => { if (dragging === e.pointerId) dragging = null; };
    c.addEventListener('pointerup', endDrag); c.addEventListener('pointercancel', endDrag);
  }

  applyPreset(settings.preset);
  resize();

  // ---------- particles ----------
  const emitAcc = [0, 0, 0, 0];
  const prevPuddle = [false, false, false, false];
  const C_MUD = new THREE.Color(0x2e2014), C_SAND = new THREE.Color(0xd8b47a), C_DIRT = new THREE.Color(0x8a7458), C_WATER = new THREE.Color(0x6d6250);
  const tv = new THREE.Vector3(), tp = new THREE.Vector3(), fwd = new THREE.Vector3(), rightV = new THREE.Vector3();
  function emitParticles(dt: number) {
    const w = WEATHER[weather];
    const v = car.body.linvel(); const speed = Math.hypot(v.x, v.z);
    car.forward(fwd); rightV.set(fwd.z, 0, -fwd.x);
    for (let i = 0; i < 4; i++) {
      const c = car.contact[i];
      if (!c) { prevPuddle[i] = false; continue; }
      const s = car.surfaces[i], slip = car.slip[i], rear = i >= 2;
      const side = i % 2 === 0 ? 1 : -1;
      if (car.inPuddle[i] && !prevPuddle[i] && speed > 2) { // entering water: burst + sound
        audio.splash(Math.min(1.5, speed / 12));
        for (let k = 0; k < 40 * mudP.budget; k++) {
          tv.set(v.x * 0.35 + rightV.x * side * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2, 2 + Math.random() * 3 + speed * 0.15, v.z * 0.35 + rightV.z * side * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2);
          splashP.emit(c, tv, 1.1, 0.16, 0.4, C_WATER, 0.6);
        }
      }
      prevPuddle[i] = car.inPuddle[i];
      let rate = 0;
      if (car.inPuddle[i]) rate = speed > 1.2 ? speed * 9 + slip * 40 : 0;
      else if (s === 'mud') rate = slip * 110 + speed * (rear ? 5 : 2.5);
      else if (s === 'sand') rate = slip * 70 + speed * 3.5;
      else if (w.dust > 0 && speed > 6) rate = (speed - 6) * 1.4 * w.dust * (rear ? 1 : 0.4);
      emitAcc[i] += rate * mudP.budget * dt;
      let n = 0;
      while (emitAcc[i] >= 1 && n++ < 30) {
        emitAcc[i] -= 1;
        tp.copy(c).addScaledVector(fwd, -0.3);
        if (car.inPuddle[i]) {
          tv.set(-fwd.x * 1.5 + rightV.x * side * Math.random() * 2.5 + v.x * 0.3, 1.5 + Math.random() * 2.5 + speed * 0.12, -fwd.z * 1.5 + rightV.z * side * Math.random() * 2.5 + v.z * 0.3);
          splashP.emit(tp, tv, 0.9, 0.14, 0.5, C_WATER, 0.5);
        } else if (s === 'mud') {
          const fling = 1 + slip * 6;
          tv.set(-fwd.x * fling + rightV.x * side * Math.random() * 1.6 + v.x * 0.45, 1.2 + Math.random() * (2 + slip * 3), -fwd.z * fling + rightV.z * side * Math.random() * 1.6 + v.z * 0.45);
          mudP.emit(tp, tv, 1.2, 0.09 + Math.random() * 0.1, 0.2, C_MUD, 0.35);
        } else {
          const col = s === 'sand' ? C_SAND : C_DIRT;
          tv.set(-fwd.x * (0.5 + slip * 3) + (Math.random() - 0.5) * 1.5 + v.x * 0.15, 0.4 + Math.random() * 0.9, -fwd.z * (0.5 + slip * 3) + (Math.random() - 0.5) * 1.5 + v.z * 0.15);
          dustP.emit(tp, tv, s === 'sand' ? 2.4 : 1.8, s === 'sand' ? 1.1 : 0.8, 2.6, col, 0.5);
          if (s === 'sand' && slip > 0.15 && Math.random() < slip) { // sand grains thrown by spinning tyres
            tv.set(-fwd.x * (2 + slip * 4) + v.x * 0.3, 1 + Math.random() * 2, -fwd.z * (2 + slip * 4) + v.z * 0.3);
            mudP.emit(tp, tv, 0.8, 0.06, 0, C_SAND, 0.3);
          }
        }
      }
    }
  }

  // ---------- main loop ----------
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let camInit = false, camHeading = 0;
  let acc = 0, last = performance.now(), menuT = 0, clock = 0;
  let fpsFrames = 0, fpsT = 0, fps = 0;
  const fpsHistory: number[] = [];
  let lastInput: DriveInput = IDLE;
  const STEP = 1 / 60;
  const tmpF = new THREE.Vector3(), want = new THREE.Vector3(), pivot = new THREE.Vector3(), dir = new THREE.Vector3(), look = new THREE.Vector3();
  const bufSize = new THREE.Vector2();

  function chaseCamera(dt: number, p: THREE.Vector3, heading: number, snap: boolean) {
    const v = car.body.linvel(); const sp = Math.hypot(v.x, v.z); const fs = car.forwardSpeed();
    let d = heading - camHeading; d = Math.atan2(Math.sin(d), Math.cos(d));
    camHeading += d * Math.min(1, dt * (2.5 + sp * 0.08));
    if (dragging === null) { lookYaw *= Math.max(0, 1 - dt * 1.5); lookPitch *= Math.max(0, 1 - dt * 1.5); }
    const yaw = camHeading + lookYaw;
    const dist = 7.4 + Math.min(3, Math.abs(fs) * 0.085);
    const height = 2.7 + Math.min(0.9, sp * 0.03) + lookPitch * 6;
    pivot.set(p.x, p.y + 1.6, p.z);
    want.set(p.x - Math.sin(yaw) * dist, p.y + height, p.z - Math.cos(yaw) * dist);
    // terrain avoidance along the camera line
    for (const t of [0.35, 0.65, 1]) {
      const x = pivot.x + (want.x - pivot.x) * t, z = pivot.z + (want.z - pivot.z) * t;
      const y = pivot.y + (want.y - pivot.y) * t, gy = heightAt(x, z) + 0.9;
      if (y < gy) want.y += (gy - y) / t;
    }
    // obstacle avoidance (trees, rocks, walls): ray from the vehicle to the camera, ignoring the vehicle
    dir.subVectors(want, pivot); const len = dir.length(); dir.divideScalar(len);
    const hit = world.castRay(new RAPIER.Ray(pivot, dir), len, true, undefined, undefined, undefined, car.body);
    let pulled = false;
    if (hit && hit.timeOfImpact < len) { want.copy(pivot).addScaledVector(dir, Math.max(1.2, hit.timeOfImpact - 0.35)); pulled = true; }
    if (snap || !camInit) { camPos.copy(want); camHeading = heading; camInit = true; }
    const pulledCloser = pulled && want.distanceToSquared(pivot) < camPos.distanceToSquared(pivot);
    camPos.lerp(want, 1 - Math.exp(-dt * (pulledCloser ? 18 : 6)));
    // look slightly ahead along the velocity
    look.set(p.x + v.x * 0.12, p.y + 1.1, p.z + v.z * 0.12);
    camLook.lerp(look, 1 - Math.exp(-dt * 10));
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    const fovT = baseFov + Math.min(14, Math.abs(fs) * 0.45);
    camera.fov += (fovT - camera.fov) * Math.min(1, dt * 3);
    camera.updateProjectionMatrix();
  }

  function introCamera(p: THREE.Vector3, heading: number) {
    const t = introT;
    const fx = Math.sin(heading), fz = Math.cos(heading), rx = fz, rz = -fx;
    const local = (a: number, s: number, up: number) => new THREE.Vector3(p.x + fx * a + rx * s, p.y + up, p.z + fz * a + rz * s);
    if (t < 3.2) { // high flyover sweeping in from the front-left
      const k = sstep(0, 3.2, t);
      const a = local(80, -50, 30), b = local(14, -7, 3.2);
      camera.position.lerpVectors(a, b, k);
      camera.lookAt(p.x, p.y + 0.8, p.z);
    } else if (t < 6.2) { // low showcase orbit around the vehicle
      const k = (t - 3.2) / 3.0;
      const ang = heading + 0.45 + k * 1.7, r = 6.2 - k * 0.6;
      camera.position.set(p.x + Math.sin(ang) * r, p.y + 1.0 + k * 0.4, p.z + Math.cos(ang) * r);
      camera.lookAt(p.x, p.y + 0.6, p.z);
      $('intro-name').parentElement!.classList.add('show');
    } else { // swing to the chase position
      const k = sstep(6.2, INTRO_LEN, t);
      const ang0 = heading + 2.15, r0 = 5.6;
      const a = new THREE.Vector3(p.x + Math.sin(ang0) * r0, p.y + 1.4, p.z + Math.cos(ang0) * r0);
      const b = new THREE.Vector3(p.x - fx * 7.4, p.y + 2.7, p.z - fz * 7.4);
      camera.position.lerpVectors(a, b, k);
      camera.lookAt(p.x, p.y + 0.6 + k * 0.5, p.z);
      if (t > 6.6) $('intro-name').parentElement!.classList.remove('show');
    }
    camera.fov = baseFov; camera.updateProjectionMatrix();
  }

  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now; clock += dt;
    fpsFrames++; fpsT += dt;
    if (fpsT >= 1) { fps = fpsFrames / fpsT; fpsHistory.push(fps); if (fpsHistory.length > 120) fpsHistory.shift(); fpsFrames = 0; fpsT = 0; $('hud-fps').textContent = fps.toFixed(0) + ' fps'; }

    if (phase !== 'paused') {
      const drive = phase === 'playing' ? input.read(dt) : (input.override ?? IDLE);
      lastInput = drive;
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 5) { physStep(drive); acc -= STEP; n++; }
      if (n === 5) acc = 0;
    }
    car.sync();
    if (phase === 'playing') emitParticles(dt);
    if (phase !== 'paused') for (const ps of allP) ps.update(dt, heightAt);

    // ---- camera ----
    const p = car.group.position;
    car.forward(tmpF);
    const heading = Math.atan2(tmpF.x, tmpF.z);
    if (phase === 'menu' || phase === 'modes') {
      menuT += dt * 0.15;
      const a = menuT + 2.2 + heading, r = 9.5;
      camera.position.set(p.x + Math.sin(a) * r, p.y + 2.6, p.z + Math.cos(a) * r);
      const portrait = window.innerWidth < window.innerHeight;
      camera.lookAt(p.x, p.y + (portrait ? -1.2 : 0.6), p.z);
      if (!portrait) camera.translateX(-2.2);
      camera.fov = baseFov; camera.updateProjectionMatrix();
      camInit = false;
    } else if (phase === 'garage') {
      garageT = garageHold ?? garageT + dt;
      const a = heading + 0.9 + garageT * 0.32, r = 6.5 + car.spec.chassis.hz * 0.9;
      const portrait = window.innerWidth < window.innerHeight;
      camera.position.set(p.x + Math.sin(a) * r, p.y + 1.6 + Math.sin(garageT * 0.4) * 0.4, p.z + Math.cos(a) * r);
      camera.lookAt(p.x, p.y + (portrait ? -1.6 : 0.4), p.z);
      if (!portrait) camera.translateX(window.innerHeight < 480 ? 2.6 : 2.4);
      camera.fov = baseFov - 4; camera.updateProjectionMatrix();
      camInit = false;
    } else if (phase === 'intro') {
      introT += dt;
      introCamera(p, heading);
      if (introT >= INTRO_LEN) endIntro();
    } else {
      chaseCamera(dt, p, heading, false);
    }
    sun.position.set(p.x + sunDir.x * 120, p.y + sunDir.y * 120, p.z + sunDir.z * 120); sun.target.position.copy(p);
    sky.position.copy(camera.position); stars.position.copy(camera.position);
    {
      const w = WEATHER[weather];
      tmpF.subVectors(camera.position, p); tmpF.y = 0; tmpF.normalize();
      fill.position.set(p.x + tmpF.x * 4.5, p.y + 2.6, p.z + tmpF.z * 4.5);
      rim.position.set(p.x - tmpF.x * 4.5, p.y + 2.2, p.z - tmpF.z * 4.5);
      fill.intensity = fillEnabled ? w.fill : 0; rim.intensity = fillEnabled ? w.rim : 0;
      const studio = phase === 'garage';
      car.setEnv(envTex, studio ? 1 : w.env);
      if (studio) car.dirt = 0;
      keyL.intensity = studio ? 260 : 0; rimL.intensity = studio ? 200 : 0;
      if (studio) {
        keyL.position.set(p.x + Math.sin(heading + 0.8) * 7, p.y + 6, p.z + Math.cos(heading + 0.8) * 7); keyL.target.position.copy(p);
        rimL.position.set(p.x + Math.sin(heading + 3.6) * 7, p.y + 4, p.z + Math.cos(heading + 3.6) * 7); rimL.target.position.copy(p);
      }
    }
    rain.update(clock, camera.position);
    renderer.getDrawingBufferSize(bufSize);
    const scale = bufSize.y / (2 * Math.tan((camera.fov * Math.PI) / 360));
    for (const ps of allP) ps.uniforms.uScale.value = scale;

    // ---- audio ----
    const surfN = { ground: 0, mud: 0, sand: 0 }; let cN = 0;
    for (const s of car.surfaces) if (s) { surfN[s]++; cN++; }
    const sl = (car.slip[0] + car.slip[1] + car.slip[2] + car.slip[3]) / 4;
    audio.update({ rpm: car.rpm, throttle: phase === 'paused' ? 0 : car.throttle, speed: car.forwardSpeed(), mud: cN ? surfN.mud / 4 : 0, sand: cN ? surfN.sand / 4 : 0,
      ground: cN ? surfN.ground / 4 : 0, slip: sl, active: phase === 'playing' || phase === 'intro', weather });

    // ---- HUD ----
    if (phase === 'playing' || phase === 'paused') {
      $('hud-speed').textContent = Math.round(Math.abs(car.forwardSpeed()) * 3.6).toString();
      $('hud-gear').textContent = car.gear < 0 ? 'R' : String(car.gear);
      const s = car.surface(); const chip = $('hud-surface');
      chip.textContent = SURFACE_PARAMS[s].label + (car.inPuddle.some(Boolean) ? ' · water' : ''); chip.className = 'chip ' + s;
    }
    updateMissionHud(dt);
    if (camOverride) { // test/screenshot hook: camera fixed in vehicle space
      camera.position.copy(car.group.localToWorld(new THREE.Vector3(...camOverride[0])));
      camera.lookAt(car.group.localToWorld(new THREE.Vector3(...camOverride[1])));
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // ---------- test / debug hook ----------
  (window as any).__game = {
    get phase() { return phase; },
    play: () => $('btn-play').click(),
    skipIntro: () => endIntro(),
    state: () => {
      const t = car.body.translation(), v = car.body.linvel();
      const f = car.forward();
      return { x: t.x, y: t.y, z: t.z, yaw: Math.atan2(f.x, f.z), up: car.group.up.clone().applyQuaternion(car.group.quaternion).y, speed: car.forwardSpeed(), hspeed: Math.hypot(v.x, v.z), surface: car.surface(),
        wheels: car.surfaces.slice(), slip: car.slip.slice(), puddle: car.inPuddle.slice(), rpm: car.rpm, gear: car.gear,
        fps, fpsHistory: fpsHistory.slice(), tracks: tracks.count, input: lastInput,
        renderer: { ...renderer.info.render }, preset: settings.preset, weather, aa: !!renderer.getContext().getContextAttributes()?.antialias,
        particles: { mud: mudP.active, dust: dustP.active, splash: splashP.active, spawned: mudP.spawned + dustP.spawned + splashP.spawned },
        audio: { state: audio.state, engineHz: audio.engineHz }, camera: { fov: camera.fov, x: camera.position.x, y: camera.position.y, z: camera.position.z },
        introT };
    },
    measureEngineHz: () => audio.measureEngineHz(),
    get vehicle() { return { id: car.spec.id, name: car.spec.name, paint: car.paint.color.getHex(), spawnLift: car.spawnLift, lod: car.lod, dirt: car.dirt }; },
    carStats: () => car.modelStats(),
    // ---- Phase 6 hooks ----
    get save() { return JSON.parse(JSON.stringify(save)); },
    saveKey: SAVE_KEY,
    migrate: (raw: unknown) => migrate(raw),
    medalFor: (t: number, id: string) => medalFor(t, missionById(id)!.targets),
    missions: MISSIONS.map((m) => ({ id: m.id, mode: m.mode, type: m.type, start: m.start, gates: m.gates, zone: m.zone ?? null, stuck: m.stuck ?? null, limit: m.limit, targets: m.targets })),
    startMission: (id: string) => startMission(id),
    endMission: () => { endMission(); setPhase('menu'); },
    skipCountdown: () => { if (mission && mission.state === 'countdown') mission.countdown = 0.0001; },
    get mission() { if (!mission) return null; const m = mission; return { id: m.def.id, state: m.state, t: m.t, next: m.next, splits: m.splits.slice(), rejected: m.rejected, resets: m.resets, msg: m.msg, attached: m.attached, reached: m.reached, failReason: m.failReason, countdown: m.countdown, ropeLen: rope ? ropeLen : 0 }; },
    missionReset: () => missionReset(),
    hook: () => toggleHook(),
    winch: (on: boolean) => { winching = on; },
    stuckPos: () => { if (!stuck) return null; const t = stuck.body.translation(); return { x: t.x, y: t.y, z: t.z, surface: stuck.surface() }; },
    get results() { return lastResult; },
    addCredits: (n: number, xp = 0) => { save.credits += n; save.xp += xp; storeSave(save); refreshUI(); },
    unlockVehicle: (id: string) => unlockVehicle(id),
    buyUpgrade: (id: string, k: UpgradeKind) => buyUpgrade(id, k),
    get dev() { return devMode(); },
    setPaint: (hex: number) => car.setPaint(hex),
    setDirt: (d: number) => { car.dirt = d; },
    /** world-space hub/suspension sample for animation tests */
    suspSample: () => { car.sync(); const g = car.group; g.updateMatrixWorld(true); const out: number[][] = [];
      g.traverse((o: any) => { if (o.isInstancedMesh) { const m = new THREE.Matrix4(); for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m); out.push(m.elements.slice(12, 15).concat([new THREE.Vector3().setFromMatrixScale(m).y, new THREE.Quaternion().setFromRotationMatrix(m).z])); } } });
      return { hubs: car.wheelMeshes.map((w) => [w.position.x, w.position.y, w.position.z, w.rotation.y, (w.children[0] as THREE.Object3D).rotation.x]), inst: out }; },
    get spec() { return car.spec; },
    vehicles: VEHICLES.map((v) => v.id),
    setVehicle: (id: string) => { settings.vehicle = id; saveSettings(settings); setVehicle(id); },
    camOverride: (c: [[number, number, number], [number, number, number]] | null) => { camOverride = c; },
    garageHold: (t: number | null) => { garageHold = t; },
    setFill: (on: boolean) => { fillEnabled = on; const w = WEATHER[weather]; fill.intensity = on ? w.fill : 0; rim.intensity = on ? w.rim : 0; },
    /** mean luminance (0..255) of a box around the vehicle's projected centre, read straight from the GL buffer */
    carLuma: (half = 0.05) => {
      renderer.render(scene, camera);
      const gl = renderer.getContext(); const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
      const c = car.group.position.clone().add(new THREE.Vector3(0, 0.6, 0)).project(camera);
      const cx = Math.round((c.x * 0.5 + 0.5) * W), cy = Math.round((c.y * 0.5 + 0.5) * H);
      const hw = Math.round(W * half), hh = Math.round(H * half);
      const px = new Uint8Array(hw * 2 * hh * 2 * 4);
      gl.readPixels(cx - hw, cy - hh, hw * 2, hh * 2, gl.RGBA, gl.UNSIGNED_BYTE, px);
      let sum = 0; for (let i = 0; i < px.length; i += 4) sum += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
      return sum / (px.length / 4);
    },
    setWeather: (id: WeatherId) => { settings.weather = id; applyWeather(id); },
    setInput: (i: DriveInput | null) => { input.override = i; },
    teleport: (x: number, z: number, yaw: number) => { resetCar(x, z, yaw); camInit = false; },
    /** Deterministic fixed-step simulation (independent of render FPS) for automated tests. */
    simulate: (i: DriveInput, seconds: number) => {
      const steps = Math.round(seconds / STEP); const trace: { t: number; speed: number; surface: string }[] = [];
      const t0 = car.body.translation(); const start = { x: t0.x, z: t0.z };
      for (let k = 1; k <= steps; k++) {
        physStep(i);
        if (k % 30 === 0) trace.push({ t: k * STEP, speed: car.forwardSpeed(), surface: car.surface() });
      }
      car.sync();
      const t1 = car.body.translation();
      const f1 = car.forward();
      return { yaw: Math.atan2(f1.x, f1.z), distance: Math.hypot(t1.x - start.x, t1.z - start.z), finalSpeed: car.forwardSpeed(), surface: car.surface(), trace };
    },
    zones: ZONES, puddles: PUDDLES, trees: TREES, heightAt,
    pose: () => { const c = sampleCar(); const t = car.body.translation(); return { ...c, y: t.y }; },
    /** Test bot: steers toward the current mission objective using the deterministic fixed step; returns the mission state. */
    botRun: (maxSeconds: number, o: { throttle?: number; slowZone?: boolean; autoHook?: boolean } = {}) => {
      if (!mission) return null;
      if (mission.state === 'countdown') mission.countdown = 0.0001;
      let stuckT = 0, rev = 0, lastP = sampleCar();
      for (let k = 0; k < Math.round(maxSeconds / STEP) && !mission.finished; k++) {
        const c = sampleCar(), def = mission.def;
        let tg: { x: number; z: number };
        if (def.gates.length && mission.next < def.gates.length) {
          const g = def.gates[mission.next]; tg = { x: g.x + Math.sin(g.yaw) * 6, z: g.z + Math.cos(g.yaw) * 6 }; // aim through the gate
        } else if (def.type === 'tow' && stuck && !mission.attached) {
          const st = stuck.body.translation(), sf = stuck.forward(); tg = { x: st.x + sf.x * 9, z: st.z + sf.z * 9 };
          if (Math.hypot(c.x - tg.x, c.z - tg.z) < 4 || toWorld(car, anchorRear()).distanceTo(toWorld(stuck, anchorFront())) < 8) { if (o.autoHook !== false) toggleHook(); }
        } else tg = def.zone!;
        if (def.type === 'tow' && mission.attached) winching = ropeLen > 4;
        let err = Math.atan2(tg.x - c.x, tg.z - c.z) - c.yaw; while (err > Math.PI) err -= 2 * Math.PI; while (err < -Math.PI) err += 2 * Math.PI;
        const dist = Math.hypot(tg.x - c.x, tg.z - c.z);
        if (k % 60 === 0) { const moved = Math.hypot(c.x - lastP.x, c.z - lastP.z); stuckT = moved < 1.0 && mission.state === 'running' ? stuckT + 1 : 0; lastP = c; if (stuckT >= 2) { rev = 90; stuckT = 0; } }
        let thr = o.throttle ?? 1, brk = 0;
        if (o.slowZone && dist < 20) { thr = c.speed > 3 ? 0 : 0.4; brk = c.speed > 3 ? 1 : 0; }
        let steer = Math.max(-1, Math.min(1, err * 2.2));
        if (rev > 0) { rev--; thr = 0; brk = 1; steer = -steer; }
        physStep({ throttle: thr, brake: brk, steer, handbrake: false });
      }
      winching = false; car.sync(); stuck?.sync();
      return { state: mission.state, t: mission.t, next: mission.next, splits: mission.splits.slice(), failReason: mission.failReason, rejected: mission.rejected, attached: mission.attached };
    },
  };

  renderGarage();
  setLoad(100, 'Ready');
  phase = 'menu';
  refreshUI();
  requestAnimationFrame((t) => { last = t; frame(t); });
}
