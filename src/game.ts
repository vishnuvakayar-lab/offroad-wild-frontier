import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import { buildTerrain, heightAt, ZONES, wetMaterials, waterMat, PUDDLES, TREES, setTerrainDetail, surfaceAt, TRAIL, SCREE, HAIRPINS } from './terrain';
import { Vehicle, SURFACE_PARAMS, LOW_RANGE, type DriveInput, type GearSel, type Transfer } from './vehicle';
import { TrackMarks } from './tracks';
import { VEHICLES, PAINTS, vehicleById, stats, CATEGORIES } from './vehicles';
import { Input } from './input';
import { GameAudio } from './audio';
import { Particles, Rain } from './particles';
import { WEATHER, WEATHER_ORDER, makeStars, type WeatherId } from './weather';
import { loadSettings, saveSettings, PRESETS, isCoarse, type Preset, type TouchMode } from './settings';
import { MISSIONS, medalFor, MissionRunner, BOT_TIMES, MEDAL_FACTORS, TOW_MARGIN, TOW_HOLD, type Mode, type Pose } from './missions';
import { MissionWorld } from './missionWorld';
import { loadSave, storeSave, migrate, award, applyUpgrades, upgradesOf, vehicleUnlocked, paintUnlocked, devMode, levelOf, upgradeCost,
  VEHICLE_UNLOCK, PAINT_LEVEL, UPGRADE_KINDS, MAX_UPGRADE, XP_PER_LEVEL, SAVE_KEY, type UpgradeKind, type Medal } from './save';
import type { TrackMarks as TM } from './tracks';
import { OnlineSession } from './online';
import { buildBackdrop } from './backdrop';
import { setNatureDetail, updateNature, natureStats, NATURE_COUNTS } from './nature';
import { groundUniforms, setGroundDetail, NOISE_GLSL } from './groundShader';
import { groundMaterials } from './terrain';
import { LEVELS, LEVEL_MISSIONS, missionById, levelDone, levelUnlocked, levelOfMission } from './levels';

type Phase = 'loading' | 'opening' | 'menu' | 'garage' | 'intro' | 'playing' | 'paused' | 'modes' | 'results' | 'lobby' | 'levels';
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const SAND_GRAIN = new THREE.Color(0xe2c28a);
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3();
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
    uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() },
      uCloud: { value: 0.5 }, uCloudCol: { value: new THREE.Color(1, 1, 1) }, uTime: groundUniforms.uTime },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; uniform float uCloud; uniform vec3 uCloudCol; uniform float uTime; varying vec3 vP;
      ${NOISE_GLSL}
      void main(){ vec3 d = normalize(vP); float t = smoothstep(-0.02, 0.45, d.y); vec3 c = mix(bottom, top, t);
        float s = max(0.0, dot(d, normalize(sunDir))); c += sunCol * (pow(s, 600.0) * 3.0 + pow(s, 12.0) * 0.25);
        // drifting cloud layer projected on a dome; lit edge towards the sun
        vec2 cu = d.xz / (d.y + 0.12) * 1.6 + vec2(uTime * 0.004, uTime * 0.002);
        float cn = owFB(cu * 1.3) * 0.75 + owFB(cu * 4.0 + 2.0) * 0.25;
        float cov = smoothstep(1.0 - uCloud * 0.75, 1.05 - uCloud * 0.45, cn) * smoothstep(0.0, 0.18, d.y);
        vec3 cc = uCloudCol * (0.82 + 0.3 * cn) + sunCol * pow(s, 6.0) * 0.35;
        c = mix(c, cc, cov * 0.92);
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
  let onTeleport: (() => void) | null = null; // set by the mission block
  let resetImpact: (() => void) | null = null;
  const resetCar = (x = spawn.x, z = spawn.z, yaw = spawn.yaw) => { car.reset(x, heightAt(x, z) + car.spawnLift, z, yaw); onTeleport?.(); resetImpact?.(); };
  resetCar();

  const mudP = new Particles(scene, 1800, 9.8, 0.6, 0.95);
  const dustP = new Particles(scene, 1400, -0.3, 1.3, 0.34);
  const splashP = new Particles(scene, 1000, 9.8, 0.4, 0.75);
  const windP = new Particles(scene, 600, 0.35, 0.05, 0.22); // wind-blown sand drifting across the dunes
  const allP = [mudP, dustP, splashP, windP];
  const backdrop = buildBackdrop(scene);
  let windAcc = 0;
  const rain = new Rain(scene, 5000);
  setLoad(85, 'Checking the weather…');

  let weather: WeatherId = settings.weather;
  const sunDir = new THREE.Vector3();

  // outdoor reflection map rendered from the sky dome (water, wet ground, vehicle paint); rebuilt per weather
  const skyEnvScene = new THREE.Scene();
  skyEnvScene.add(new THREE.Mesh(sky.geometry, skyMat));
  let pmrem: THREE.PMREMGenerator | null = null, skyEnvRT: THREE.WebGLRenderTarget | null = null;
  let skyEnvKey = '';
  function rebuildSkyEnv() {
    if (!pmrem || (skyEnvRT && skyEnvKey === weather)) return;
    skyEnvKey = weather;
    skyEnvRT?.dispose();
    skyEnvRT = pmrem.fromScene(skyEnvScene, 0, 1, 1000);
    waterMat.envMap = skyEnvRT.texture; waterMat.needsUpdate = true;
  }
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
    pmrem?.dispose(); pmrem = new THREE.PMREMGenerator(renderer); skyEnvRT = null;
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
    setTerrainDetail(p === 'low' ? 0 : p === 'medium' ? 1 : 2);
    setNatureDetail(p === 'low' ? 0 : p === 'medium' ? 1 : 2);
    setGroundDetail(groundMaterials, p !== 'low');
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
    for (const tm of wetMaterials) { tm.roughness = w.wet ? 0.45 : 0.95; tm.metalness = w.wet ? 0.08 : 0; tm.color.set(w.wet ? 0xa8a8a8 : 0xffffff); }
    car.paint.roughness = w.wet ? 0.15 : 0.45;
    waterMat.color.set(0x2b241a).lerp(new THREE.Color(w.fog), 0.12);
    groundUniforms.uWetAll.value = w.wet ? 1 : 0;
    groundUniforms.uSkyRefl.value.set(w.skyBottom).lerp(new THREE.Color(w.skyTop), 0.35);
    skyMat.uniforms.uCloud.value = w.cloud; skyMat.uniforms.uCloudCol.value.set(w.cloudCol);
    { const haze = new THREE.Color(w.fog).lerp(new THREE.Color(w.skyBottom), 0.5), rock = new THREE.Color(0x6f6457).multiply(new THREE.Color(w.hemiSky)).lerp(haze, 0.2);
      if (id === 'night') rock.multiplyScalar(0.35); backdrop.setColors(rock, haze); }
    rebuildSkyEnv();
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
    // on-screen keyboard (iOS shrinks only the visual viewport): expose its height so panels with inputs stay above it
    const ae = document.activeElement, typing = !!ae && (ae.tagName === 'TEXTAREA' || (ae.tagName === 'INPUT' && /^(text|search|email|number|tel|url|password|)$/.test((ae as HTMLInputElement).type)));
    const vv = window.visualViewport, kb = vv && typing ? Math.max(0, h - vv.height - vv.offsetTop) : 0; // only a focused text field means a keyboard (not pinch-zoom / toolbars)
    document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
    document.body.classList.toggle('kb', kb > 80);
    if (kb > 80) (document.activeElement as HTMLElement | null)?.scrollIntoView?.({ block: 'nearest' });
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 150));
  window.visualViewport?.addEventListener('resize', resize);
  document.addEventListener('focusout', () => setTimeout(resize, 50));

  // ---------- input & UI ----------
  const input = new Input();
  input.scheme = settings.controls; input.autoThrottle = settings.autoThrottle;
  input.bindZones($('tzones'), (l, r) => { $('tzones').querySelector('.tz.l')!.classList.toggle('on', l); $('tzones').querySelector('.tz.r')!.classList.toggle('on', r); });
  input.bindHold($('tp-hb'), 'hand'); input.bindHold($('tp-brake'), 'brake');
  $('tp-rec').addEventListener('pointerdown', (e) => { e.stopPropagation(); input.onReset?.(); });
  $('tp-cal').addEventListener('pointerdown', (e) => { e.stopPropagation(); input.calibrateTilt(); toast('Tilt centred'); });
  // cockpit HUD: wheel, steering buttons, pedals, pills
  input.wheelSens = settings.wheelSens;
  const wheelRim = $('wheel').querySelector<HTMLElement>('.w-turn')!;
  input.onWheel = (deg) => { wheelRim.style.transform = `rotate(${deg.toFixed(1)}deg)`; };
  input.bindWheel($('wheel'));
  input.bindHold($('sb-l'), 'left'); input.bindHold($('sb-r'), 'right');
  input.bindHold($('pd-gas'), 'gas'); input.bindHold($('pd-brake'), 'brake'); input.bindHold($('ck-hb'), 'hand');
  $('ck-rec').addEventListener('pointerdown', (e) => { e.stopPropagation(); input.onReset?.(); });
  $('ck-cal').addEventListener('pointerdown', (e) => { e.stopPropagation(); input.calibrateTilt(); toast('Tilt centred'); });
  // drivetrain: gear selector (A/P/R/N/D) + transfer case (2H/4H/4L/AWD) with interlocks
  const drvNote = (m: string) => { $('drv-note').textContent = m; };
  const shiftGear = (gs: GearSel) => { const r = car.setGear(gs); if (!r.ok) { toast('⛔ ' + r.msg); drvNote(r.msg); } else drvNote(''); refreshDrv(); return r; };
  const shiftTransfer = (t: Transfer) => { const r = car.setTransfer(t); if (!r.ok) { toast('⛔ ' + r.msg); drvNote(r.msg); } else { drvNote(t === '4L' ? 'Low range: x' + LOW_RANGE + ' torque, top speed / ' + LOW_RANGE : ''); toast(t + (t === '4L' ? ' · low range' : t === '2H' ? ' · rear-wheel drive' : ' · four-wheel drive')); } refreshDrv(); return r; };
  const refreshDrv = () => {
    $('drv-gear').textContent = car.sel === 'A' ? 'A' : car.sel; $('drv-mode').textContent = car.transfer;
    document.querySelectorAll<HTMLButtonElement>('#drv-sel button').forEach((b) => b.classList.toggle('on', b.dataset.g === car.sel));
    document.querySelectorAll<HTMLButtonElement>('#drv-tc button').forEach((b) => { const t = b.dataset.t as Transfer; b.classList.toggle('on', t === car.transfer); b.disabled = !car.driveModes.includes(t); b.hidden = t === 'AWD' ? !car.driveModes.includes('AWD') : car.driveModes.length === 1 && car.driveModes[0] === 'AWD'; });
  };
  $('drv-chip').onclick = () => { const p = $('drv-pop'); const open = p.classList.contains('hidden'); p.classList.toggle('hidden', !open); $('drv-chip').setAttribute('aria-expanded', String(open)); refreshDrv(); };
  document.querySelectorAll<HTMLElement>('#drv-sel button').forEach((b) => b.onclick = () => shiftGear(b.dataset.g as GearSel));
  document.querySelectorAll<HTMLElement>('#drv-tc button').forEach((b) => b.onclick = () => shiftTransfer(b.dataset.t as Transfer));
  let tiltFallback = false, tiltCheck = 0, needCal = false;
  input.onTiltData = () => { if (tiltFallback && settings.controls === 'tilt') { tiltFallback = false; refreshUI(); setTimeout(() => input.calibrateTilt(), 200); toast('Tilt steering active'); } };
  /** called from Play / Start taps (user gestures): asks iOS for motion access when tilt steering is selected */
  const prepControls = () => {
    if (!touchOn() || settings.controls !== 'tilt' || input.tiltState === 'granted') return;
    input.requestTilt().then(() => refreshUI());
  };
  let rotHintT = 0;
  const rotHint = () => { // landscape is preferred on phones: a non-blocking hint (pointer-events: none), portrait stays fully playable
    const el = $('rot-hint'), on = phase === 'playing' && touchOn() && innerHeight > innerWidth && innerWidth < 600;
    el.classList.toggle('hidden', !on); clearTimeout(rotHintT); if (on) rotHintT = window.setTimeout(() => el.classList.add('hidden'), 4000);
  };
  window.addEventListener('orientationchange', () => setTimeout(rotHint, 200));
  const onPlayingStarted = () => {
    clearTimeout(tiltCheck); rotHint();
    if (!input.touchActive || settings.controls !== 'tilt') return;
    tiltFallback = false; input.scheme = 'tilt';
    needCal = true;
    setTimeout(() => { if (input.tiltEvents > 0) { needCal = false; input.calibrateTilt(); } }, 250);
    tiltCheck = window.setTimeout(() => { // no motion data -> touch halves for this session (setting kept)
      if (phase === 'playing' && input.scheme === 'tilt' && input.tiltEvents === 0) {
        tiltFallback = true; input.scheme = 'halves'; refreshUI();
        toast(input.tiltState === 'denied' ? 'Motion access denied — using touch halves' : 'No tilt sensor data — using touch halves');
      } else if (needCal) { needCal = false; input.calibrateTilt(); } // only if no sample was there to centre on at the start
    }, 1800);
  };
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
    show('levels', phase === 'levels');
    show('lobby', phase === 'lobby');
    if (phase !== 'playing') $('ohud').classList.add('hidden');
    show('results', phase === 'results');
    show('mhud', !!mission && (phase === 'playing' || phase === 'paused'));
    show('btn-quit', !!mission);
    $('btn-reset').textContent = mission ? 'Reset to checkpoint' : 'Reset vehicle';
    const lvl = levelOf(save.xp), prog = `Lv ${lvl} · ${save.credits.toLocaleString()} pts · ${save.xp % XP_PER_LEVEL}/${XP_PER_LEVEL} XP${devMode() ? ' · DEV' : ''}`;
    $('menu-prog').textContent = prog; $('modes-prog').textContent = prog; $('levels-prog').textContent = prog;
    show('pause', phase === 'paused');
    show('hud', phase === 'playing' || phase === 'paused');
    const tOn = phase === 'playing' && touchOn();
    input.touchActive = tOn;
    if (!tiltFallback) input.scheme = settings.controls;
    input.autoThrottle = settings.autoThrottle;
    const sc = input.scheme;
    show('tzones', tOn && sc === 'halves');
    show('cockpit', tOn && sc !== 'halves');
    $('cockpit').dataset.sc = sc; show('wheel', sc === 'wheel'); show('steer-btns', sc === 'buttons'); show('ck-cal', sc === 'tilt');
    show('drv', phase === 'playing' || phase === 'paused'); if (phase !== 'playing') $('drv-pop').classList.add('hidden'); refreshDrv();
    show('row-wsens', settings.controls === 'wheel'); $<HTMLInputElement>('rng-wsens').value = String(settings.wheelSens);
    $('tz-l').textContent = sc === 'halves' ? '◀ STEER' : 'BRAKE';
    $('tz-r').textContent = sc === 'halves' ? 'STEER ▶' : settings.autoThrottle ? 'AUTO-GAS' : 'GAS';
    $('tz-hint').textContent = sc === 'halves' ? 'Drives forward · hold both sides to brake / reverse' : sc === 'tilt' ? 'Tilt the phone to steer' : '';
    show('tp-cal', sc === 'tilt');
    document.querySelectorAll('#seg-ctrl button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.controls));
    $<HTMLInputElement>('chk-auto').checked = settings.autoThrottle;
    $('ctrl-note').textContent = settings.controls === 'wheel' ? 'Default: turn the steering wheel (bottom-left) by dragging your finger around it - up to 1¼ turns each way, it centres itself when released. Pedals (bottom-right): GAS and BRAKE are progressive; brake at a standstill reverses in AUTO.'
      : settings.controls === 'buttons' ? 'Optional: hold ◀ / ▶ (bottom-left) to steer and GAS (bottom-right) to drive; BRAKE / REV brakes, keep holding at a standstill to reverse. Steer and GAS work together (multi-touch).'
      : settings.controls === 'tilt' ? `Tilt the phone like a steering wheel; pedals bottom-right${settings.autoThrottle ? ' (auto-throttle on: GAS is automatic, BRAKE overrides)' : ''}. Motion access: ${input.tiltState}${tiltFallback ? ' (using touch halves)' : ''}.`
      : settings.controls === 'halves' ? 'Default: hold the left or right half of the screen to steer. The car drives forward by itself; hold both halves or ■ Brake/Rev to brake, keep holding at a standstill to reverse.'
      : '';
    $('hud-fps').classList.toggle('hidden', !settings.showFps);
    document.querySelectorAll('#seg-preset button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.preset));
    document.querySelectorAll('#seg-touch button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.touch));
    $<HTMLInputElement>('chk-fps').checked = settings.showFps;
    $<HTMLInputElement>('chk-intro').checked = settings.intro;
    $<HTMLInputElement>('rng-camdist').value = String(settings.camDist); $<HTMLInputElement>('rng-camheight').value = String(settings.camHeight);
    $<HTMLInputElement>('chk-shake').checked = settings.shake;
    $<HTMLInputElement>('chk-mute').checked = settings.muted;
    $<HTMLInputElement>('rng-volume').value = String(settings.volume);
    $('btn-mute').textContent = settings.muted ? '🔇' : '🔊';
  };
  const setPhase = (p: Phase) => { const was = phase; phase = p; if (split && p !== 'playing' && p !== 'paused') stopSplit(); if (p !== 'paused' && p !== 'menu') openDrawer(false); input.clearTouch(); refreshUI(); if (p === 'playing' && was !== 'paused') onPlayingStarted(); };

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
    $('g-cats').innerHTML = CATEGORIES.map((c) => `<button data-cat="${c.id}" class="${c.id === spec.cat ? 'on' : ''}">${c.label} <b>${VEHICLES.filter((v) => v.cat === c.id).length}</b></button>`).join('');
    $('g-cats').querySelectorAll<HTMLElement>('button').forEach((b) => b.onclick = () => { const i = VEHICLES.findIndex((v) => v.cat === b.dataset.cat); if (i >= 0 && i !== gIndex) garageStep(i - gIndex); });
    { const own = vehicleUnlocked(save, spec.id), rq = VEHICLE_UNLOCK[spec.id];
      $('g-price').textContent = own ? (spec.id === settings.vehicle ? '✓ Selected' : '✓ Owned') : `${rq.price.toLocaleString()} pts · level ${rq.level}`;
      $('g-price').className = 'g-price ' + (own ? 'own' : 'buy'); }
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
      $('g-lock-text').textContent = `🔒 Requires level ${req.level} · ${req.price.toLocaleString()} pts`;
      const btn = $<HTMLButtonElement>('g-unlock'); btn.disabled = lvl < req.level || save.credits < req.price;
      btn.textContent = lvl < req.level ? `Level ${req.level}` : `Unlock ${req.price.toLocaleString()} pts`;
      btn.onclick = () => { if (unlockVehicle(spec.id)) toast(`${spec.name} unlocked!`); };
    }
    const up = upgradesOf(save, spec.id), NAMES: Record<UpgradeKind, string> = { engine: 'Engine', tyres: 'Tyres', susp: 'Suspension' };
    $('g-upgrades').innerHTML = unlocked ? UPGRADE_KINDS.map((k) => `<span>${NAMES[k]}</span><span class="pips">${Array.from({ length: MAX_UPGRADE }, (_, i) => `<i class="${i < up[k] ? 'on' : ''}"></i>`).join('')}</span>` +
      `<button class="btn small" data-up="${k}" ${up[k] >= MAX_UPGRADE || save.credits < upgradeCost(up[k]) ? 'disabled' : ''}>${up[k] >= MAX_UPGRADE ? 'Max' : '+ ' + upgradeCost(up[k]) + ' pts'}</button>`).join('') : '';
    $('g-upgrades').querySelectorAll<HTMLElement>('button').forEach((b) => b.onclick = () => { if (buyUpgrade(spec.id, b.dataset.up as UpgradeKind)) toast(`${NAMES[b.dataset.up as UpgradeKind]} upgraded`); });
    $('g-credits').textContent = `${save.credits.toLocaleString()} points · level ${lvl}`;
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
  let camWorld: [[number, number, number], [number, number, number]] | null = null;
  let garageT = 0; let garageHold: number | null = null;
  const openGarage = (ret: Phase = 'menu') => { garageReturn = ret; gIndex = Math.max(0, VEHICLES.findIndex((v) => v.id === settings.vehicle)); renderGarage(); resetCar(); garageT = 0; setPhase('garage'); };
  $('btn-garage').onclick = () => openGarage('menu');
  $('g-prev').onclick = () => garageStep(-1);
  $('g-next').onclick = () => garageStep(1);
  $('g-back').onclick = () => { leaveGarage(); setPhase(garageReturn); };
  $('g-drive').onclick = () => { if (!vehicleUnlocked(save, car.spec.id)) return; garageReturn === 'modes' ? (setPhase('modes'), renderModes()) : garageReturn === 'levels' ? openLevels() : $('btn-play').click(); };
  let garageReturn: Phase = 'menu';

  // ---------- Phase 6: missions ----------
  let mission: MissionRunner | null = null;
  let mworld: MissionWorld | null = null;
  let stuck: Vehicle | null = null;
  let rope: RAPIER_NS.ImpulseJoint | null = null, ropeLen = 0, winching = false, winchAcc = 0;
  let resultT = 0, lastResult: any = null, modeTab: Mode = 'challenge';
  let forcedWeather: WeatherId | null = null;
  onTeleport = () => mission?.jumped();
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
    const q = car.body.rotation();
    return { x: t.x, z: t.z, yaw: Math.atan2(f.x, f.z), speed: car.forwardSpeed(), up: 1 - 2 * (q.x * q.x + q.z * q.z) }; // body up-vector y (fresh every physics step)
  }
  /** one fixed physics step (player, tow target, world, mission logic) — shared by the render loop and the test simulate hook */
  function physStep(drive: DriveInput) {
    const d = mission && (mission.state === 'countdown' || mission.finished) ? IDLE : drive;
    car.step(STEP, d);
    if (car2) car2.step(STEP, drive2);
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
    mworld = new MissionWorld(scene, def); if (def.laps) mworld.lapLen = def.gates.length / def.laps; mworld.setGateState(0);
    if (def.stuck) {
      stuck = new Vehicle(world, RAPIER, scene, NO_TRACKS, vehicleById('voyager'), 0x7b8087, 0);
      for (const l of [...stuck.headlights, stuck.beam]) l.visible = false;
      placeAt(stuck, def.stuck);
      for (let k = 0; k < 90; k++) { stuck.step(STEP, { ...STUCK_IN, handbrake: true }); world.step(); } // settle into the mud
      stuck.sync();
    }
    forcedWeather = def.weather ?? (def.type === 'deliver' ? 'sunset' : null);
    if (forcedWeather) applyWeather(forcedWeather);
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
    mission = null; winching = false;
    if (forcedWeather) { forcedWeather = null; applyWeather(settings.weather); }
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
    const lv = levelOfMission(def.id), nextLv = lv ? LEVELS.find((l) => l.n === lv.n + 1) : null;
    lastResult.level = lv?.n ?? null; lastResult.nextUnlocked = !!(ok && nextLv && levelUnlocked(save.best, nextLv));
    $('r-reward').textContent = `+${r.credits} points · +${r.xp} XP` + (r.levelUp ? ` · LEVEL ${r.levelUp}!` : '') +
      (lv && ok ? ` · Level ${lv.n} complete` + (nextLv && lastResult.nextUnlocked ? ` — Level ${nextLv.n} unlocked!` : '') : '');
    $('r-kicker').textContent = lv ? `Level ${lv.n} · ${lv.difficulty}` : $('r-kicker').textContent;
    setPhase('results');
  }
  const nextMissionId = (id: string) => {
    const lv = levelOfMission(id);
    if (lv) { const nx = LEVELS.find((l) => l.n > lv.n && l.missionId && levelUnlocked(save.best, l, devMode())); return nx?.missionId ?? null; }
    return MISSIONS[(MISSIONS.findIndex((m) => m.id === id) + 1) % MISSIONS.length].id;
  };
  $('r-retry').onclick = () => { const id = mission?.def.id; if (id) startMission(id); };
  $('r-next').onclick = () => { const id = mission?.def.id; const nx = id ? nextMissionId(id) : null; if (nx) startMission(nx); else if (id && levelOfMission(id)) { endMission(); openLevels(); } };
  $('r-menu').onclick = () => { const wasLevel = !!(mission && levelOfMission(mission.def.id)); endMission(); if (wasLevel) openLevels(); else { setPhase('modes'); renderModes(); } };
  const STATUS_LABEL = { playable: 'Playable', prototype: 'Prototype', online: 'Needs server', planned: 'Not built yet' } as const;
  function renderLevels() {
    const dev = devMode();
    $('lv-list').innerHTML = LEVELS.map((L) => {
      const done = levelDone(save.best, L), unl = levelUnlocked(save.best, L, dev), b = L.missionId ? save.best[L.missionId] : null;
      const canStart = !!L.missionId && unl;
      const meta = (done && b ? `${MEDAL_ICON[b.medal]} best ${fmt(b.time)} · ` : unl ? '' : '🔒 locked · ') + L.difficulty;
      const btn = L.status === 'online' ? `<button class="btn small" data-online>Online</button>`
        : canStart ? `<button class="btn primary small" data-level="${L.missionId}">${done ? 'Replay' : 'Start'}</button>` : `<button class="btn small" disabled>${L.status === 'planned' ? 'Soon' : '🔒'}</button>`;
      return `<div class="m-card lv-card ${unl ? '' : 'locked'}" data-n="${L.n}"><h3><span class="lvn">${L.n}</span>${L.title}<span class="st ${L.status}">${STATUS_LABEL[L.status]}</span></h3>` +
        `<div class="meta">${meta}</div>${btn}<p>${L.objective}${L.note ? ' <em>' + L.note + '</em>' : ''}${L.unlock && !done ? ' · ' + L.unlock : ''}</p></div>`;
    }).join('');
    $('lv-list').querySelectorAll<HTMLElement>('[data-level]').forEach((b) => b.onclick = () => { prepControls(); startMission(b.dataset.level!); });
    $('lv-list').querySelectorAll<HTMLElement>('[data-online]').forEach((b) => b.onclick = () => $('btn-online').click());
  }
  const openLevels = () => { renderLevels(); setPhase('levels'); };
  $('btn-levels').onclick = () => openLevels();
  $('lv-back').onclick = () => setPhase('menu');
  $('lv-garage').onclick = () => openGarage('levels');
  function renderModes() {
    document.querySelectorAll<HTMLElement>('#m-tabs button').forEach((b) => { b.classList.toggle('on', b.dataset.mode === modeTab); b.onclick = () => { modeTab = b.dataset.mode as Mode; renderModes(); }; });
    const list = $('m-list');
    if (modeTab === 'free') {
      list.innerHTML = `<div class="m-card"><h3>Free Roam</h3><div class="meta">Open map · no timer</div><button class="btn primary small" data-free>Drive</button><p>Explore the mud basin, dunes, rocky ridge and proving-ground strip at your own pace.</p></div>`;
    } else {
      list.innerHTML = MISSIONS.filter((m) => m.mode === modeTab).map((m) => {
        const b = save.best[m.id];
        return `<div class="m-card"><h3>${m.title}</h3><div class="meta">${b ? MEDAL_ICON[b.medal] + ' best ' + fmt(b.time) : 'not completed'} · ${m.limit ? 'limit ' + fmt(m.limit) : 'no limit'} · ${m.reward} pts</div>` +
          `<button class="btn primary small" data-start="${m.id}">Start</button><p>${m.desc}</p></div>`;
      }).join('');
    }
    list.querySelectorAll<HTMLElement>('[data-start]').forEach((b) => b.onclick = () => { prepControls(); startMission(b.dataset.start!); });
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
  let duskK = 0;
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
    } else if (def.zone) { target = def.zone; sub = def.type === 'deliver' ? 'Deliver to camp before dark' : def.type === 'trail' ? 'Stop inside the finish circle' : 'Reach the summit flag'; }
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
    if (def.type === 'deliver' && !m.finished) { // nightfall runs on the mission clock: dusk at 25 % of the limit, dark at the limit
      duskK = sstep(0.25, 1, m.t / def.limit!);
      renderer.toneMappingExposure = WEATHER.sunset.exposure * (1 - 0.6 * duskK);
      sun.intensity = WEATHER.sunset.sunI * (1 - 0.85 * duskK); hemi.intensity = WEATHER.sunset.hemiI * (1 - 0.6 * duskK);
    }
    if (m.finished && phase === 'playing') { resultT += dt; if (resultT > 1.2) finishMission(); }
  }

  // ---------- Phase 7: online multiplayer ----------
  const MP_NAME = 'owf.mp.name';
  if (!localStorage.getItem(MP_NAME)) localStorage.setItem(MP_NAME, 'Driver' + Math.floor(100 + Math.random() * 900));
  const online: OnlineSession = new OnlineSession({
    world, R: RAPIER, scene, camera,
    car: () => car,
    useCar: (id, paint) => {
      endMission(); car.dispose();
      car = new Vehicle(world, RAPIER, scene, tracks, vehicleById(id), paint, lodFor(settings.preset)); // stock spec online
      applyWeather(weather); camInit = false; return car;
    },
    restoreCar: () => { setVehicle(settings.vehicle, true); resetCar(); camInit = false; },
    profile: () => ({ name: localStorage.getItem(MP_NAME) || 'Driver', vehicle: settings.vehicle, paint: paintFor(settings.vehicle) }),
    setName: (n) => { const v = n.replace(/[^\p{L}\p{N} _.\-]/gu, '').trim().slice(0, 16); if (v) localStorage.setItem(MP_NAME, v); },
    setPhase: (p) => setPhase(p),
    phase: () => phase,
    toast: (t) => toast(t),
    resetCamera: () => { camInit = false; },
  });
  $('btn-online').onclick = () => { endMission(); leaveGarage(); setPhase('lobby'); online.renderLobby(); };
  $('lb-back').onclick = () => setPhase(online.inRoom ? 'playing' : 'menu');
  $('btn-olobby').onclick = () => setPhase('lobby');

  // ---- tap-through guard: a tap that skips a cinematic is consumed (iOS fires the click ~after pointerdown/touchend, on whatever is now under the finger) ----
  let swallowUntil = 0;
  const swallowClicks = (ms = 500) => { swallowUntil = performance.now() + ms; };
  document.addEventListener('click', (e) => { if (performance.now() < swallowUntil) { e.stopPropagation(); e.preventDefault(); } }, true);
  // no pinch-zoom / page scroll while driving (iOS ignores user-scalable=no for pinch; gesture* events are WebKit-only)
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
  document.addEventListener('touchmove', (e) => { if (phase === 'playing' || phase === 'opening') e.preventDefault(); }, { passive: false });
  // ---- cinematic intro ----
  const INTRO_LEN = 7.6;
  let introT = 0;
  // (the Free Roam fly-over was removed: entering Free Roam is immediately controllable; endIntro stays for the 'intro' phase hooks)
  const endIntro = () => {
    if (phase !== 'intro') return;
    swallowClicks();
    const el = $('intro'); el.classList.add('out'); $('intro-name').parentElement!.classList.remove('show');
    setTimeout(() => { if (phase !== 'intro') el.classList.add('hidden'); }, 650);
    camPos.copy(camera.position); camHeading = Math.atan2(car.forward().x, car.forward().z); camInit = true;
    setPhase('playing');
  };
  // ---- opening cinematic (on launch): establishing shot -> 4x4 drives into the scene -> live 3D main menu ----
  const OPEN_PATH: [number, number][] = [[74, -52], [64, -44], [51, -35], [39, -27], [27, -21], [15, -13], [6, -6]];
  const OPEN_LEN = 12.5;
  let openT = 0, openWp = 1, openEnding = false, menuBlend = 1;
  const startOpening = () => {
    const [a, b] = OPEN_PATH; resetCar(a[0], a[1], Math.atan2(b[0] - a[0], b[1] - a[1])); openT = 0; openWp = 1; openEnding = false;
    const el = $('opening'); el.classList.remove('hidden', 'out'); el.classList.add('in');
    phase = 'opening'; refreshUI();
  };
  const endOpening = (skipped: boolean) => {
    if (phase !== 'opening' || openEnding) return;
    openEnding = true;
    if (skipped) swallowClicks(); // the skip tap must not also press the menu button that appears under the finger
    if (skipped) { const e = OPEN_PATH[OPEN_PATH.length - 1], d = OPEN_PATH[OPEN_PATH.length - 2]; resetCar(e[0], e[1], Math.atan2(e[0] - d[0], e[1] - d[1])); }
    const el = $('opening'); el.classList.add('out'); setTimeout(() => el.classList.add('hidden'), 900);
    menuT = 0; menuBlend = 0; setPhase('menu');
    const m = $('menu'); m.classList.remove('reveal'); void m.offsetWidth; m.classList.add('reveal');
  };
  /** auto-driver for the opening: pure pursuit along OPEN_PATH, eases off and stops at the menu spot */
  function openingDrive(): DriveInput {
    const t = car.body.translation(), f = car.forward(tmpF), last = OPEN_PATH.length - 1;
    let w = OPEN_PATH[openWp]; const dWp = Math.hypot(w[0] - t.x, w[1] - t.z);
    if (dWp < 7 && openWp < last) { openWp++; w = OPEN_PATH[openWp]; }
    const d = Math.hypot(w[0] - t.x, w[1] - t.z);
    let diff = Math.atan2(w[0] - t.x, w[1] - t.z) - Math.atan2(f.x, f.z); diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    const steer = THREE.MathUtils.clamp(diff * 2.2, -1, 1), sp = car.forwardSpeed();
    if (openWp === last && d < 16) return { throttle: 0, brake: sp > 0.6 ? Math.min(1, 0.35 + (16 - d) / 16) : 0, steer, handbrake: sp <= 0.6 };
    return { throttle: sp < 7.2 ? 0.75 : 0.15, brake: 0, steer, handbrake: false };
  }
  const menuPose = (p: THREE.Vector3, heading: number, t: number, outPos: THREE.Vector3, outLook: THREE.Vector3) => {
    const a = t + 2.2 + heading, r = 9.5, portrait = window.innerWidth < window.innerHeight;
    outPos.set(p.x + Math.sin(a) * r, p.y + 2.6, p.z + Math.cos(a) * r);
    outLook.set(p.x, p.y + (portrait ? -1.2 : 0.6), p.z);
  };
  const oPos = new THREE.Vector3(), oLook = new THREE.Vector3(), oA = new THREE.Vector3(), oB = new THREE.Vector3();
  function openingCamera(p: THREE.Vector3, heading: number, dt: number) {
    const t = openT, portrait = window.innerWidth < window.innerHeight;
    const hAt = (x: number, z: number) => heightAt(x, z);
    if (t < 4.2) { // wide establishing shot: high crane drifting over the dunes, slowly finding the 4x4
      const k = sstep(0, 4.2, t);
      oA.set(-46, hAt(-46, 38) + 46, 38); oB.set(-14, hAt(-14, 20) + 20, 20);
      oPos.lerpVectors(oA, oB, k);
      oLook.set(110 - 60 * k, 6 + 2 * (1 - k), -90 + 50 * k).lerp(p, k * k);
    } else if (t < 8.0) { // low ground camera beside the trail: the 4x4 rushes towards and past the lens
      const gx = 33, gz = -16; oPos.set(gx, hAt(gx, gz) + 0.9, gz);
      oLook.set(p.x, p.y + 0.7, p.z);
    } else if (t < OPEN_LEN - 2.2) { // tracking front three-quarter shot
      const fx = Math.sin(heading), fz = Math.cos(heading);
      const k = (t - 8.0) / (OPEN_LEN - 2.2 - 8.0);
      const ang = heading + 0.7 + k * 0.9, r = 7.5 - k * 1.2;
      oPos.set(p.x + Math.sin(ang) * r, p.y + 1.3 + k * 0.6, p.z + Math.cos(ang) * r);
      oLook.set(p.x + fx * 1.2, p.y + 0.7, p.z + fz * 1.2);
    } else { // settle into the live menu orbit
      const k = sstep(OPEN_LEN - 2.2, OPEN_LEN, t);
      const ang = heading + 1.6, r = 6.3;
      oA.set(p.x + Math.sin(ang) * r, p.y + 1.9, p.z + Math.cos(ang) * r);
      menuPose(p, heading, 0, oB, oLook);
      oPos.lerpVectors(oA, oB, k);
      if (!portrait) { /* menu shot pans left of the car once the panel shows */ }
    }
    const y = hAt(oPos.x, oPos.z) + 0.6; if (oPos.y < y) oPos.y = y;
    camera.position.lerp(oPos, t < 0.05 ? 1 : 1 - Math.exp(-dt * 6));
    camLook.lerp(oLook, t < 0.05 ? 1 : 1 - Math.exp(-dt * 6));
    camera.lookAt(camLook);
    camera.fov = t < 4.2 ? baseFov - 10 : t < 8 ? baseFov - 18 : baseFov; camera.updateProjectionMatrix();
    $('opening').classList.toggle('titled', t > 1.2 && t < 5.6);
  }
  const cycleWeather = () => {
    const i = (WEATHER_ORDER.indexOf(weather) + 1) % WEATHER_ORDER.length;
    settings.weather = WEATHER_ORDER[i]; saveSettings(settings); applyWeather(settings.weather); toast(WEATHER[settings.weather].icon + '  ' + WEATHER[settings.weather].label);
  };
  const toggleMute = () => { settings.muted = !settings.muted; saveSettings(settings); audio.setVolume(settings.volume, settings.muted); refreshUI(); toast(settings.muted ? 'Sound off' : 'Sound on'); };

  // Free Roam: controllable at once (the old 7.6 s fly-over showed no controls and ignored input until it ended or was tapped)
  $('btn-play').onclick = () => { prepControls(); endMission(); leaveGarage(); resetCar(); camInit = false; setPhase('playing'); };
  $('btn-skip').onclick = (e) => { e.stopPropagation(); endIntro(); };

  // ---------- local split-screen (2 players, one device) ----------
  // P1: WASD + Space (+ the normal touch controls at the bottom); P2: arrow keys + Right Shift/Enter (+ the P2 touch set at the top).
  let split = false, car2: Vehicle | null = null, drive2: DriveInput = IDLE;
  const camera2 = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
  const cam2Pos = new THREE.Vector3(), cam2Look = new THREE.Vector3(); let cam2Heading = 0, cam2Init = false;
  const P2_PAINT = 0x2f7fd1;
  function spawnP2() {
    const yaw = spawn.yaw, x = spawn.x + Math.cos(yaw) * 4.5, z = spawn.z - Math.sin(yaw) * 4.5;
    car2!.reset(x, heightAt(x, z) + car2!.spawnLift, z, yaw); cam2Init = false;
  }
  function startSplit() {
    prepControls(); endMission(); leaveGarage(); resetCar(); camInit = false;
    if (car2) car2.dispose();
    const id = vehicleUnlocked(save, settings.vehicle) ? settings.vehicle : 'scout';
    car2 = new Vehicle(world, RAPIER, scene, tracks, specFor(id), paintFor(id) === P2_PAINT ? 0xd8a020 : P2_PAINT, lodFor(settings.preset));
    spawnP2(); car2.setEnv(skyEnvRT ? skyEnvRT.texture : envTex, WEATHER[weather].env * 1.5);
    split = true; input.split = true; document.body.classList.add('split');
    setPhase('playing'); toast('2 players: P1 = WASD · P2 = arrow keys');
  }
  function stopSplit() {
    if (!split) return;
    split = false; input.split = false; document.body.classList.remove('split');
    if (car2) { car2.dispose(); car2 = null; }
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  }
  $('btn-split').onclick = () => startSplit();
  $('p2-rec').onclick = () => { if (!car2) return; const t = car2.body.translation(), f = car2.forward(); car2.reset(t.x, heightAt(t.x, t.z) + car2.spawnLift, t.z, Math.atan2(f.x, f.z)); };
  const p2Rim = $('p2-wheel').querySelector<HTMLElement>('.w-turn')!;
  input.onWheel2 = (deg) => { p2Rim.style.transform = `rotate(${deg.toFixed(1)}deg)`; };
  input.bindWheel($('p2-wheel'), input.p2wheel, (d) => input.onWheel2(d));
  for (const [id, key] of [['p2-gas', 'gas'], ['p2-brake', 'brake']] as const) input.bindHold($(id), key, input.p2touch);
  /** split layout: side by side on wide desktop screens, stacked (P2 on top, facing the top controls) on touch / portrait */
  const splitStacked = () => touchOn() || window.innerWidth < window.innerHeight;
  function chase2(dt: number) {
    const c = car2!, p = c.group.position, f = c.forward(), heading = Math.atan2(f.x, f.z), v = c.body.linvel(), sp = Math.hypot(v.x, v.z);
    let d = heading - cam2Heading; d = Math.atan2(Math.sin(d), Math.cos(d));
    if (!cam2Init) { cam2Heading = heading; } else cam2Heading += d * Math.min(1, dt * (2.5 + sp * 0.08));
    const dist = (7.4 + Math.min(3, Math.abs(c.forwardSpeed()) * 0.085)) * settings.camDist, h = (2.7 + Math.min(0.9, sp * 0.03)) * settings.camHeight;
    const wx = p.x - Math.sin(cam2Heading) * dist, wz = p.z - Math.cos(cam2Heading) * dist;
    const wy = Math.max(p.y + h, heightAt(wx, wz) + 1);
    if (!cam2Init) { cam2Pos.set(wx, wy, wz); cam2Look.set(p.x, p.y + 1.1, p.z); cam2Init = true; }
    cam2Pos.lerp(tmpV.set(wx, wy, wz), 1 - Math.exp(-dt * 6));
    cam2Look.lerp(tmpV.set(p.x + v.x * 0.12, p.y + 1.1, p.z + v.z * 0.12), 1 - Math.exp(-dt * 10));
    camera2.position.copy(cam2Pos); camera2.lookAt(cam2Look);
    camera2.fov = baseFov + Math.min(14, Math.abs(c.forwardSpeed()) * 0.45);
  }
  function renderSplit() {
    const w = window.innerWidth, h = window.innerHeight, stacked = splitStacked();
    const v1 = stacked ? [0, 0, w, h / 2] : [0, 0, w / 2, h], v2 = stacked ? [0, h / 2, w, h / 2] : [w / 2, 0, w / 2, h]; // GL origin = bottom-left
    camera.aspect = v1[2] / v1[3]; camera.updateProjectionMatrix();
    camera2.aspect = v2[2] / v2[3]; camera2.far = camera.far; camera2.updateProjectionMatrix();
    renderer.setScissorTest(true);
    renderer.setViewport(v1[0], v1[1], v1[2], v1[3]); renderer.setScissor(v1[0], v1[1], v1[2], v1[3]); renderer.render(scene, camera);
    renderer.setViewport(v2[0], v2[1], v2[2], v2[3]); renderer.setScissor(v2[0], v2[1], v2[2], v2[3]); renderer.render(scene, camera2);
    renderer.setScissorTest(false); renderer.setViewport(0, 0, w, h);
    document.body.classList.toggle('split-stack', stacked);
    $('p2-speed').textContent = Math.round(Math.abs(car2!.forwardSpeed()) * 3.6).toString();
  }

  // ---------- camera views: chase / in-car (3D steering wheel) / left side mirror / 360° orbit (drag to rotate) ----------
  type CamMode = 'chase' | 'cockpit' | 'mirror' | 'orbit';
  const CAM_MODES: CamMode[] = ['chase', 'cockpit', 'mirror', 'orbit'];
  const CAM_LABEL: Record<CamMode, string> = { chase: 'Chase view', cockpit: 'Driver view', mirror: 'Left mirror view', orbit: '360° orbit · drag to rotate' };
  let camMode: CamMode = 'chase', orbitYaw = 0, orbitPitch = 0.35, orbitIdle = 0;
  const eyeW = new THREE.Vector3(), aheadW = new THREE.Vector3();
  function setCamMode(m: CamMode) {
    camMode = m; car.setCockpit(m === 'cockpit');
    $('btn-cam').classList.toggle('on', m !== 'chase'); $('btn-cam').dataset.mode = m; $('btn-cam').title = CAM_LABEL[m] + ' (C)';
    canvas.classList.toggle('mirrored', m === 'mirror');
    if (m === 'orbit') { const f = car.forward(); orbitYaw = Math.atan2(f.x, f.z) + Math.PI * 0.75; orbitIdle = 0; }
    toast('🎥 ' + CAM_LABEL[m]); camInit = false;
  }
  const cycleCam = () => setCamMode(CAM_MODES[(CAM_MODES.indexOf(camMode) + 1) % CAM_MODES.length]);
  $('btn-cam').onclick = cycleCam;
  function viewCamera(dt: number) {
    if (camMode === 'cockpit' || camMode === 'mirror') {
      if (camMode === 'cockpit' && !car.cockpitOn) car.setCockpit(true);
      car.bodyVis.updateWorldMatrix(true, false);
      const c = car.spec.cabin;
      if (camMode === 'cockpit') { eyeW.copy(car.eye); aheadW.set(car.eye.x, car.eye.y - 0.9, car.eye.z + 10); }
      else { // just outside the left (driver) mirror, looking back along the flank; the image is flipped like a real mirror
        const mx = c.hx + 0.32, my = c.y - c.hy + 0.55, mz = c.z + c.hz - 0.15;
        eyeW.set(mx, my, mz); aheadW.set(mx + 0.9, my - 0.45, mz - 12);
      }
      car.bodyVis.localToWorld(eyeW); car.bodyVis.localToWorld(aheadW);
      camera.position.copy(eyeW); camera.up.set(0, 1, 0).applyQuaternion(car.group.quaternion); camera.lookAt(aheadW); camera.up.set(0, 1, 0);
      camera.near = 0.05; camera.fov = camMode === 'cockpit' ? baseFov + 8 : baseFov - 12; camera.updateProjectionMatrix();
    } else if (camMode === 'orbit') {
      orbitIdle += dt; if (dragging === null && orbitIdle > 2.5) orbitYaw += dt * 0.25; // slow auto-spin when not dragged
      const p = car.group.position, r = 6.5 + car.spec.chassis.hz * 1.1;
      camera.position.set(p.x + Math.sin(orbitYaw) * Math.cos(orbitPitch) * r, p.y + 0.8 + Math.sin(orbitPitch) * r, p.z + Math.cos(orbitYaw) * Math.cos(orbitPitch) * r);
      const gy = heightAt(camera.position.x, camera.position.z) + 0.6; if (camera.position.y < gy) camera.position.y = gy;
      camera.lookAt(p.x, p.y + 0.6, p.z); camera.fov = baseFov; camera.updateProjectionMatrix();
    }
  }
  $('btn-settings').onclick = () => openDrawer(true);
  // Settings from the pause card: the drawer replaces the card (no stacked overlays); closing it goes straight back to driving
  let drawerFromPause = false;
  $('btn-settings2').onclick = () => { drawerFromPause = true; $('pause').classList.add('hidden'); openDrawer(true); };
  $('btn-close-drawer').onclick = () => { openDrawer(false); if (drawerFromPause && phase === 'paused') setPhase('playing'); drawerFromPause = false; };
  $('btn-pause').onclick = () => setPhase(online.inRoom ? 'lobby' : 'paused');
  $('btn-weather').onclick = cycleWeather;
  $('btn-mute').onclick = toggleMute;
  $('btn-resume').onclick = () => setPhase('playing');
  $('btn-reset').onclick = () => { if (mission) { setPhase('playing'); missionReset(); return; } resetCar(); camInit = false; setPhase('playing'); };
  $('btn-menu').onclick = () => { endMission(); setPhase('menu'); };
  $('btn-quit').onclick = () => { endMission(); setPhase('modes'); renderModes(); };
  input.onPause = () => {
    if (drawer.classList.contains('open')) { openDrawer(false); return; }
    if (phase === 'garage') { leaveGarage(); setPhase(garageReturn); return; }
    if (phase === 'modes' || phase === 'levels') { setPhase('menu'); return; }
    if (phase === 'intro') { endIntro(); return; }
    if (phase === 'opening') { endOpening(true); return; }
    if (online.inRoom) { setPhase(phase === 'lobby' ? 'playing' : 'lobby'); return; }
    if (phase === 'lobby') { setPhase('menu'); return; }
    if (phase === 'playing') setPhase('paused'); else if (phase === 'paused') setPhase('playing');
  };
  input.onKey = (code) => {
    if (phase === 'intro' && !/^(Shift|Control|Alt|Meta)/.test(code)) { endIntro(); return true; }
    if (phase === 'opening' && !/^(Shift|Control|Alt|Meta)/.test(code)) { endOpening(true); return true; }
    if (phase === 'playing' && !online.inRoom) {
      const T: Record<string, Transfer> = { Digit1: '2H', Digit2: '4H', Digit3: '4L', Digit4: 'AWD' };
      if (T[code]) { shiftTransfer(T[code]); return true; }
      if (code === 'KeyQ') { const order: GearSel[] = ['A', 'D', 'N', 'R', 'P']; shiftGear(order[(order.indexOf(car.sel) + 1) % order.length]); return true; }
    }
    if (phase === 'garage') {
      if (code === 'ArrowLeft' || code === 'KeyA') { garageStep(-1); return true; }
      if (code === 'ArrowRight' || code === 'KeyD') { garageStep(1); return true; }
      if (code === 'Enter') { $('btn-play').click(); return true; }
    }
    if (phase !== 'playing' && phase !== 'paused') return false;
    if (code === 'KeyT') { cycleWeather(); return true; }
    if (code === 'KeyH' && mission) { toggleHook(); return true; }
    if (code === 'KeyG' && online.inRoom) { $('btn-wp').click(); return true; }
    if (code === 'KeyM') { toggleMute(); return true; }
    if (code === 'Slash' && split && car2) { const t = car2.body.translation(), f = car2.forward(); car2.reset(t.x, heightAt(t.x, t.z) + car2.spawnLift, t.z, Math.atan2(f.x, f.z)); return true; }
    if (code === 'KeyC' && !split) { cycleCam(); return true; }
    return false;
  };
  input.onReset = () => {
    if (phase !== 'playing') return;
    if (online.inRoom) { online.requestReset(); return; }
    if (mission) { missionReset(); return; }
    const t = car.body.translation(); const f = car.forward();
    resetCar(t.x, t.z, Math.atan2(f.x, f.z)); // flip upright in place
  };
  document.querySelectorAll<HTMLElement>('#seg-preset button').forEach((b) => b.onclick = () => {
    settings.preset = b.dataset.v as Preset; saveSettings(settings); applyPreset(settings.preset); refreshUI();
  });
  document.querySelectorAll<HTMLElement>('#seg-ctrl button').forEach((b) => b.onclick = () => {
    settings.controls = b.dataset.v as any; saveSettings(settings); tiltFallback = false;
    if (settings.controls === 'tilt') input.requestTilt().then(() => refreshUI()); // inside the tap: required by iOS
    refreshUI();
  });
  $<HTMLInputElement>('rng-wsens').oninput = (e) => { settings.wheelSens = Number((e.target as HTMLInputElement).value); input.wheelSens = settings.wheelSens; saveSettings(settings); };
  $<HTMLInputElement>('chk-auto').onchange = (e) => { settings.autoThrottle = (e.target as HTMLInputElement).checked; saveSettings(settings); refreshUI(); };
  document.querySelectorAll<HTMLElement>('#seg-touch button').forEach((b) => b.onclick = () => {
    settings.touch = b.dataset.v as TouchMode; saveSettings(settings); refreshUI();
  });
  document.querySelectorAll<HTMLElement>('#seg-weather button').forEach((b) => b.onclick = () => {
    settings.weather = b.dataset.v as WeatherId; saveSettings(settings); applyWeather(settings.weather);
  });
  $<HTMLInputElement>('chk-fps').onchange = (e) => { settings.showFps = (e.target as HTMLInputElement).checked; saveSettings(settings); refreshUI(); };
  $<HTMLInputElement>('rng-camdist').oninput = (e) => { settings.camDist = Number((e.target as HTMLInputElement).value); saveSettings(settings); };
  $<HTMLInputElement>('rng-camheight').oninput = (e) => { settings.camHeight = Number((e.target as HTMLInputElement).value); saveSettings(settings); };
  $<HTMLInputElement>('chk-shake').onchange = (e) => { settings.shake = (e.target as HTMLInputElement).checked; saveSettings(settings); };
  $<HTMLInputElement>('chk-intro').onchange = (e) => { settings.intro = (e.target as HTMLInputElement).checked; saveSettings(settings); };
  $<HTMLInputElement>('chk-mute').onchange = (e) => { settings.muted = (e.target as HTMLInputElement).checked; saveSettings(settings); audio.setVolume(settings.volume, settings.muted); refreshUI(); };
  $<HTMLInputElement>('rng-volume').oninput = (e) => { settings.volume = Number((e.target as HTMLInputElement).value); saveSettings(settings); audio.setVolume(settings.volume, settings.muted); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { input.clearTouch(); if (phase === 'playing' && !online.inRoom) setPhase('paused'); } }); // release held controls; online games cannot pause

  // drag-to-look (mouse or touch on empty game area); recentres when released
  let lookYaw = 0, lookPitch = 0, dragging: number | null = null, lastX = 0, lastY = 0;
  function attachLook(c: HTMLCanvasElement) {
    // GPU reset / tab backgrounded too long on mobile: tell the player instead of freezing on a black screen
    c.addEventListener('webglcontextlost', (e) => { e.preventDefault(); if (c !== canvas) return; const el = $('gl-lost'); el.classList.remove('hidden'); if (phase === 'playing') setPhase('paused'); });
    c.addEventListener('webglcontextrestored', () => { $('gl-lost').classList.add('hidden'); });
    c.addEventListener('pointerdown', (e) => {
      if (phase === 'intro') { endIntro(); return; }
      if (phase === 'opening') { endOpening(true); return; }
      dragging = e.pointerId; lastX = e.clientX; lastY = e.clientY; c.setPointerCapture(e.pointerId);
    });
    c.addEventListener('pointermove', (e) => {
      if (dragging !== e.pointerId) return;
      if (camMode === 'orbit') { orbitYaw -= (e.clientX - lastX) * 0.008; orbitPitch = Math.max(0.05, Math.min(1.2, orbitPitch + (e.clientY - lastY) * 0.005)); orbitIdle = 0; lastX = e.clientX; lastY = e.clientY; return; }
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
  const C_MUD = new THREE.Color(0x2e2014), C_SAND = new THREE.Color(0xd8b47a), C_DIRT = new THREE.Color(0x8a7458), C_ROCKDUST = new THREE.Color(0x9b968e), C_CHIP = new THREE.Color(0x6e6a64), C_WATER = new THREE.Color(0x6d6250);
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
      else if (s === 'rock') rate = slip * 45 + (speed > 3 ? speed * 1.1 : 0) * (rear ? 1 : 0.5); // grey rock dust + chips
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
          const col = s === 'sand' ? C_SAND : s === 'rock' ? C_ROCKDUST : C_DIRT;
          tv.set(-fwd.x * (0.5 + slip * 3) + (Math.random() - 0.5) * 1.5 + v.x * 0.15, 0.4 + Math.random() * 0.9, -fwd.z * (0.5 + slip * 3) + (Math.random() - 0.5) * 1.5 + v.z * 0.15);
          dustP.emit(tp, tv, s === 'sand' ? 2.4 : 1.8, s === 'sand' ? 1.1 : 0.8, 2.6, col, 0.5);
          if (s === 'rock' && Math.random() < 0.25 + slip) { // stone chips flicked out by the tread
            tv.set(-fwd.x * (1.5 + slip * 4) + (Math.random() - 0.5) * 2 + v.x * 0.3, 0.8 + Math.random() * 1.8, -fwd.z * (1.5 + slip * 4) + (Math.random() - 0.5) * 2 + v.z * 0.3);
            mudP.emit(tp, tv, 0.7, 0.05 + Math.random() * 0.05, 0, C_CHIP, 0.25);
          }
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
  let camInit = false, camHeading = 0, towCamK = 0;
  let acc = 0, last = performance.now(), menuT = 0, clock = 0, impactCool = 0.5, impactPrev: { x: number; y: number; z: number } | null = null;
  resetImpact = () => { impactPrev = null; impactCool = 0.4; };
  let fpsFrames = 0, fpsT = 0, fps = 0;
  const fpsHistory: number[] = [];
  let lastInput: DriveInput = IDLE;
  const STEP = 1 / 60;
  const tmpF = new THREE.Vector3(), want = new THREE.Vector3(), pivot = new THREE.Vector3(), dir = new THREE.Vector3(), look = new THREE.Vector3();
  const bufSize = new THREE.Vector2();

  let prevVy = 0, shakeAmp = 0;
  function chaseCamera(dt: number, p: THREE.Vector3, heading: number, snap: boolean) {
    const v = car.body.linvel(); const sp = Math.hypot(v.x, v.z); const fs = car.forwardSpeed();
    let d = heading - camHeading; d = Math.atan2(Math.sin(d), Math.cos(d));
    camHeading += d * Math.min(1, dt * (2.5 + sp * 0.08));
    if (dragging === null) { lookYaw *= Math.max(0, 1 - dt * 1.5); lookPitch *= Math.max(0, 1 - dt * 1.5); }
    const yaw = camHeading + lookYaw;
    // towing: lift and pull back the camera so it looks over the towed vehicle instead of into it
    towCamK += ((rope ? 1 : 0) - towCamK) * Math.min(1, dt * 2);
    const dist = (7.4 + Math.min(3, Math.abs(fs) * 0.085)) * settings.camDist + towCamK * 3.2;
    const height = (2.7 + Math.min(0.9, sp * 0.03)) * settings.camHeight + lookPitch * 6 + towCamK * 3.4;
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
    const towed = stuck?.body; // the towed 4x4 never pulls the camera in (it would fill the screen)
    const hit = world.castRay(new RAPIER.Ray(pivot, dir), len, true, undefined, undefined, undefined, car.body, towed ? (c: RAPIER_NS.Collider) => c.parent()?.handle !== towed.handle : undefined);
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
    // rough-terrain shake: driven by vertical jolts of the chassis + surface roughness at speed (comfort toggle in Settings)
    const jolt = Math.abs(v.y - prevVy) / Math.max(dt, 1e-3); prevVy = v.y;
    const surf = car.surface(), rough = (surf === 'rock' ? 0.022 : surf === 'ground' ? 0.008 : surf === 'mud' ? 0.012 : 0.006) * Math.min(1, sp / 12);
    const shakeT = settings.shake && !snap ? Math.min(0.14, Math.max(0, jolt - 4) * 0.006 + rough) : 0;
    shakeAmp += (shakeT - shakeAmp) * Math.min(1, dt * (shakeT > shakeAmp ? 20 : 4));
    if (shakeAmp > 0.002) {
      camera.position.x += (Math.sin(clock * 37.1) + Math.sin(clock * 23.7)) * shakeAmp * 0.5;
      camera.position.y += (Math.sin(clock * 41.3) + Math.sin(clock * 29.9)) * shakeAmp * 0.5;
      camera.rotateZ(Math.sin(clock * 19.3) * shakeAmp * 0.08);
    }
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
    const rawDt = Math.min(0.5, Math.max(0, (now - last) / 1000)); // online prediction keeps real time even at low fps
    const dt = Math.min(0.1, (now - last) / 1000); last = now; clock += dt;
    fpsFrames++; fpsT += dt;
    if (fpsT >= 1) { fps = fpsFrames / fpsT; fpsHistory.push(fps); if (fpsHistory.length > 120) fpsHistory.shift(); fpsFrames = 0; fpsT = 0; $('hud-fps').textContent = fps.toFixed(0) + ' fps'; }

    if (online.inRoom) { // server-authoritative: predict own car, send inputs (see online.ts)
      const drive = phase === 'playing' ? input.read(dt) : IDLE; lastInput = drive;
      online.frame(rawDt, drive);
    } else if (phase !== 'paused') {
      const drive = phase === 'playing' ? input.read(dt) : phase === 'opening' ? (input.override ?? openingDrive()) : (input.override ?? IDLE);
      lastInput = drive;
      drive2 = split && phase === 'playing' ? input.readP2(dt) : IDLE;
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 8) { physStep(drive); acc -= STEP; n++; } // up to 8 fixed steps per frame keeps real-time speed down to ~7.5 fps
      if (n === 8) acc = 0;
    }
    { const wh = input.touchActive && input.scheme === 'wheel'; car.wheelDegOverride = wh ? input.wheelDeg : null; if (car2) car2.wheelDegOverride = input.touchActive ? input.p2wheel.wheelDeg : null; }
    car.sync(); if (car2) car2.sync();
    { // collision / hard-landing sounds from sudden velocity changes (ignores teleports/resets: impactCool)
      const v = car.body.linvel();
      if (impactPrev && phase !== 'paused' && impactCool <= 0) {
        const dv = Math.hypot(v.x - impactPrev.x, (v.y - impactPrev.y) * 0.6, v.z - impactPrev.z);
        if (dv > 3.2) { audio.impact((dv - 3.2) / 6); impactCool = 0.25; }
      }
      impactCool -= dt; impactPrev = { x: v.x, y: v.y, z: v.z };
    }
    online.afterSync(dt);
    if (phase === 'playing' || phase === 'opening') emitParticles(dt);
    if (phase !== 'paused') for (const ps of allP) ps.update(dt, heightAt);

    // ---- camera ----
    const p = car.group.position;
    car.forward(tmpF);
    const heading = Math.atan2(tmpF.x, tmpF.z);
    if (phase === 'menu' || phase === 'modes' || phase === 'levels' || (phase === 'lobby' && !online.inRoom)) {
      menuT += dt * 0.15;
      const portrait = window.innerWidth < window.innerHeight;
      menuPose(p, heading, menuT, oPos, oLook);
      if (menuBlend < 1) { // ease out of the opening shot instead of cutting
        menuBlend = Math.min(1, menuBlend + dt * 0.8); const k = sstep(0, 1, menuBlend);
        camera.position.lerp(oPos, k); camLook.lerp(oLook, k);
      } else { camera.position.copy(oPos); camLook.copy(oLook); }
      camera.lookAt(camLook);
      if (!portrait) camera.translateX(-2.2 * (menuBlend < 1 ? sstep(0, 1, menuBlend) : 1));
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
    } else if (phase === 'opening') {
      openT += dt;
      openingCamera(p, heading, dt);
      if (openT >= OPEN_LEN) endOpening(false);
    } else if (phase === 'intro') {
      introT += dt;
      introCamera(p, heading);
      if (introT >= INTRO_LEN) endIntro();
    } else {
      chaseCamera(dt, p, heading, false);
      if (camMode !== 'chase' && !split && (phase === 'playing' || phase === 'paused')) viewCamera(dt);
      else if (camera.near !== 0.1) { camera.near = 0.1; camera.updateProjectionMatrix(); }
      if (split && car2) chase2(dt);
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
      car.setEnv(studio || !skyEnvRT ? envTex : skyEnvRT.texture, studio ? 1 : w.env * 1.5);
      if (studio) car.dirt = 0;
      car2?.setEnv(skyEnvRT ? skyEnvRT.texture : envTex, w.env * 1.5);
      keyL.intensity = studio ? 260 : 0; rimL.intensity = studio ? 200 : 0;
      if (studio) {
        keyL.position.set(p.x + Math.sin(heading + 0.8) * 7, p.y + 6, p.z + Math.cos(heading + 0.8) * 7); keyL.target.position.copy(p);
        rimL.position.set(p.x + Math.sin(heading + 3.6) * 7, p.y + 4, p.z + Math.cos(heading + 3.6) * 7); rimL.target.position.copy(p);
      }
    }
    rain.update(clock, camera.position);
    backdrop.update(camera, -6);
    // blowing sand: low drifting grains around the car whenever it is on/near the dunes (dry weather only)
    if ((phase === 'playing' || phase === 'opening' || phase === 'menu') && weather !== 'rain' && weather !== 'fog') {
      const near = surfaceAt(p.x, p.z) === 'sand' || surfaceAt(p.x + 12, p.z - 6) === 'sand';
      windAcc += near ? dt * 70 * PRESETS[settings.preset].particles : 0;
      while (windAcc >= 1) {
        windAcc--;
        const ox = (Math.random() - 0.5) * 36 - 10, oz = (Math.random() - 0.5) * 36 - 4;
        const x = p.x + ox, z = p.z + oz;
        if (surfaceAt(x, z) !== 'sand') continue;
        tmpV.set(x, heightAt(x, z) + 0.05 + Math.random() * 0.6, z);
        tmpV2.set(6.5 + Math.random() * 3, 0.4 + Math.random() * 0.5, 2.2 + Math.random() * 1.5);
        windP.emit(tmpV, tmpV2, 1.6 + Math.random() * 1.4, 0.18 + Math.random() * 0.2, 1.8, SAND_GRAIN, 0.4);
      }
    }
    groundUniforms.uTime.value = clock;
    updateNature(camera.position);
    renderer.getDrawingBufferSize(bufSize);
    const scale = bufSize.y / (2 * Math.tan((camera.fov * Math.PI) / 360));
    for (const ps of allP) ps.uniforms.uScale.value = scale;

    // ---- audio ----
    const surfN = { ground: 0, mud: 0, sand: 0, rock: 0 }; let cN = 0;
    for (const s of car.surfaces) if (s) { surfN[s]++; cN++; }
    const sl = (car.slip[0] + car.slip[1] + car.slip[2] + car.slip[3]) / 4;
    audio.update({ rpm: car.rpm, throttle: phase === 'paused' ? 0 : car.throttle, speed: car.forwardSpeed(), mud: cN ? surfN.mud / 4 : 0, sand: cN ? surfN.sand / 4 : 0,
      ground: cN ? surfN.ground / 4 : 0, rock: cN ? surfN.rock / 4 : 0, slip: sl, active: phase === 'playing' || phase === 'intro' || phase === 'opening', weather });

    // ---- HUD ----
    if (phase === 'playing' || phase === 'paused') {
      $('hud-speed').textContent = Math.round(Math.abs(car.forwardSpeed()) * 3.6).toString();
      $('hud-gear').textContent = car.sel === 'P' ? 'P' : car.sel === 'N' ? 'N' : car.gear < 0 ? 'R' : (car.sel === 'D' ? 'D' : '') + String(car.gear);
      if (input.touchActive) { ($('pd-gas').querySelector('.fill') as HTMLElement).style.height = `${Math.round(input.gasV * 100)}%`; ($('pd-brake').querySelector('.fill') as HTMLElement).style.height = `${Math.round(input.brakeV * 100)}%`; }
      const s = car.surface(); const chip = $('hud-surface');
      chip.textContent = SURFACE_PARAMS[s].label + (car.inPuddle.some(Boolean) ? ' · water' : ''); chip.className = 'chip ' + s;
    }
    updateMissionHud(dt);
    if (camOverride) { // test/screenshot hook: camera fixed in vehicle space
      camera.position.copy(car.group.localToWorld(new THREE.Vector3(...camOverride[0])));
      camera.lookAt(car.group.localToWorld(new THREE.Vector3(...camOverride[1])));
    }
    if (camWorld) { camera.position.set(...camWorld[0]); camera.lookAt(new THREE.Vector3(...camWorld[1])); }
    canvas.classList.toggle('mirrored', camMode === 'mirror' && !split && (phase === 'playing' || phase === 'paused'));
    if (split && car2 && (phase === 'playing' || phase === 'paused')) renderSplit();
    else renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // ---------- test / debug hook ----------
  (window as any).__net = {
    get status() { return online.net.status; }, get rtt() { return online.net.rtt; }, get room() { return online.room; }, get myId() { return online.myId; },
    get inRoom() { return online.inRoom; }, get metrics() { return online.metrics; }, get interpDelay() { return online.interpDelay; }, get reconnects() { return online.net.reconnects; },
    get lastErr() { return online.lastErr; }, get url() { return online.net.url; }, get bytesIn() { return online.net.bytesIn; }, get seq() { return [online.seq, online.lastAck, online.histFirst()]; },
    quick: (m: 'convoy' | 'race') => online.quick(m), create: (m: 'convoy' | 'race') => online.create(m), join: (c: string) => online.join(c), leave: () => online.leave(),
    startRace: () => online.startRace(), setWaypoint: (clear = false) => online.setWaypoint(clear), drop: () => online.net.dropConnection(), sendRaw: (s: string) => online.net.sendRaw(s),
    setPilot: (o: any) => online.setPilot(o), drive: () => { setPhase('playing'); camInit = false; },
    own: () => { const t = car.body.translation(); return { x: t.x, y: t.y, z: t.z, vx: car.group.position.x, vz: car.group.position.z }; },
    remotes: () => [...online.remotes.values()].map((r) => ({ id: r.id, name: r.name, away: r.away, x: r.vis.p.x, y: r.vis.p.y, z: r.vis.p.z, visible: r.v.group.visible, tag: r.tag.textContent })),
    lobbyNames: () => [...document.querySelectorAll('#lb-players li b')].map((b) => b.textContent),
    resetMetrics: () => { const m = online.metrics; m.corrections = m.hardSnaps = m.maxErr = m.maxVisOff = m.extrap = m.replaySteps = 0; m.errs.length = m.corrErrs.length = m.remoteJerk.length = m.ownJerk.length = 0; m.snaps = 0; },
  };
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
    missions: MISSIONS.map((m) => ({ id: m.id, mode: m.mode, type: m.type, start: m.start, gates: m.gates, zone: m.zone ?? null, stuck: m.stuck ?? null, limit: m.limit, targets: m.targets, reward: m.reward, laps: m.laps ?? 1, noReset: !!m.noReset })),
    levels: LEVELS.map((l) => ({ ...l })), levelMissions: LEVEL_MISSIONS.map((m) => ({ id: m.id, type: m.type, start: m.start, gates: m.gates, zone: m.zone ?? null, limit: m.limit, targets: m.targets, reward: m.reward, weather: m.weather ?? null, maxResets: m.maxResets ?? null, stuckFail: m.stuckFail ?? null })),
    levelState: () => LEVELS.map((l) => ({ n: l.n, status: l.status, done: levelDone(save.best, l), unlocked: levelUnlocked(save.best, l, devMode()) })),
    openLevels: () => openLevels(),
    get forcedWeather() { return forcedWeather; },
    botTimes: BOT_TIMES, medalFactors: MEDAL_FACTORS, towRule: { margin: TOW_MARGIN, hold: TOW_HOLD },
    startMission: (id: string) => startMission(id),
    endMission: () => { endMission(); setPhase('menu'); },
    skipCountdown: () => { if (mission && mission.state === 'countdown') mission.countdown = 0.0001; },
    get mission() { if (!mission) return null; const m = mission; return { id: m.def.id, state: m.state, t: m.t, next: m.next, splits: m.splits.slice(), rejected: m.rejected, resets: m.resets, msg: m.msg, log: m.log.slice(), attached: m.attached, reached: m.reached, failReason: m.failReason, countdown: m.countdown, ropeLen: rope ? ropeLen : 0 }; },
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
    split: { start: () => startSplit(), stop: () => { stopSplit(); setPhase('menu'); }, get on() { return split; }, setP2: (d: DriveInput | null) => { input.override2 = d; },
      p2: () => { if (!car2) return null; const t = car2.body.translation(); return { x: t.x, y: t.y, z: t.z, speed: car2.forwardSpeed(), steer: car2.steer, input: drive2, p1input: lastInput }; } },
    cam: (m: CamMode) => setCamMode(m), get camMode() { return camMode; }, orbit: (yaw: number, pitch = 0.35) => { orbitYaw = yaw; orbitPitch = pitch; orbitIdle = 0; },
    wheelAngle: () => car.steeringWheel?.rotation.z ?? null,
    wheelUI: () => ({ deg: input.wheelDeg, held: input.wheelHeld, value: input.wheelValue, steer: lastInput.steer, p2deg: input.p2wheel.wheelDeg, p2angle: car2?.steeringWheel?.rotation.z ?? null }),
    camOverride: (c: [[number, number, number], [number, number, number]] | null) => { camOverride = c; },
    /** screenshot hook: fixed world-space camera (null = normal camera) */
    camWorld: (c: [[number, number, number], [number, number, number]] | null) => { camWorld = c; },
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
    zones: ZONES, puddles: PUDDLES, trees: TREES, heightAt, surfaceAt, trail: TRAIL.map((p) => ({ x: p.x, z: p.z, h: p.h, hw: p.hw })), hairpins: HAIRPINS.map((h) => ({ ...h })),
    get audioRock() { return audio.rockLevel; },
    controls: () => ({ setting: settings.controls, scheme: input.scheme, auto: settings.autoThrottle, tiltState: input.tiltState, tiltEvents: input.tiltEvents, tilt: input.tiltValue, touchActive: input.touchActive, fallback: tiltFallback }),
    setControls: (c: 'wheel' | 'buttons' | 'tilt' | 'halves', auto = false) => { settings.controls = c; settings.autoThrottle = auto; tiltFallback = false; saveSettings(settings); refreshUI(); },
    readInput: () => input.read(1 / 60),
    nature: () => ({ ...natureStats(), counts: { ...NATURE_COUNTS } }),
    groundDetail: () => groundMaterials.map((m) => 'OW_DETAIL' in (m.defines ?? {})),
    skyEnv: () => !!skyEnvRT,
    /** tow camera check: distance from the towed vehicle's centre to the camera->player sight line (m) */
    towOcclusion: () => { if (!stuck) return null; const a = camera.position, t = car.body.translation(), b = new THREE.Vector3(t.x, t.y + 1, t.z), st = stuck.body.translation();
      const ab = b.clone().sub(a), u = Math.max(0, Math.min(1, new THREE.Vector3(st.x, st.y + 0.8, st.z).sub(a).dot(ab) / ab.lengthSq()));
      return a.clone().addScaledVector(ab, u).distanceTo(new THREE.Vector3(st.x, st.y + 0.8, st.z)); },
    /** test hook: put the stuck vehicle at a pose (rope released) */
    placeStuck: (x: number, z: number, yaw: number) => { if (!stuck || !mission) return false; if (rope) { world.removeImpulseJoint(rope, true); rope = null; mission.attached = false; }
      placeAt(stuck, { x, z, yaw }); stuck.sync(); return true; },
    setPreset: (p: Preset) => { settings.preset = p; applyPreset(p); },
    /** test hook: isolate render cost of the rework layers */
    perfToggle: (k: 'ground' | 'nature' | 'clouds', on: boolean) => {
      if (k === 'ground') setGroundDetail(groundMaterials, on);
      else if (k === 'nature') setNatureDetail(on ? 2 : 0);
      else skyMat.uniforms.uCloud.value = on ? 0.5 : 0;
    },
    screeCount: () => SCREE.mesh?.count ?? 0,
    get openT() { return openT; },
    skipOpening: () => endOpening(true),
    lean: () => ({ ...car.lean, braking: car.braking, tail: car.tailMat?.emissiveIntensity ?? 0, acc: { lat: car.accLocal.x, lon: car.accLocal.y } }),
    camShake: () => shakeAmp,
    impacts: () => audio.impacts,
    drive: () => ({ sel: car.sel, transfer: car.transfer, modes: car.driveModes.slice(), wheelForce: car.wheelForce.slice(), wheelReq: car.wheelReq.slice(), wheelRate: car.wheelRate.slice(), ratio: car.ratio, engineForce: car.engineForce, frontSplit: car.spec.frontSplit ?? 0.5, gear: car.gear, rpm: car.rpm, steerAngle: car.steer, kmh: car.forwardSpeed() * 3.6 }),
    setGear: (gs: GearSel) => shiftGear(gs), setTransfer: (t: Transfer) => shiftTransfer(t),
    pedals: () => ({ gas: input.gasV, brake: input.brakeV, wheelDeg: input.wheelDeg, wheel: input.wheelValue }),
    get dusk() { return { k: duskK, exposure: renderer.toneMappingExposure, sun: sun.intensity }; },
    /** test hook: roll the car onto its roof in place */
    flip: () => { const t = car.body.translation(), r = car.body.rotation(); const q = new THREE.Quaternion(r.x, r.y, r.z, r.w).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI));
      car.body.setTranslation({ x: t.x, y: t.y + 1.8, z: t.z }, true); car.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true); car.body.setLinvel({ x: 0, y: 0, z: 0 }, true); car.body.setAngvel({ x: 0, y: 0, z: 0 }, true); },
    pose: () => { const c = sampleCar(); const t = car.body.translation(); return { ...c, y: t.y }; },
    /** Test bot: steers toward the current mission objective using the deterministic fixed step; returns the mission state. */
    /** Test bots. Clean bot: pure-pursuit along the mission's driving line with curvature-based speed control.
     *  human:true adds a reaction delay, steering/throttle noise, softer inputs and slower corner speeds (seeded). */
    botRun: (maxSeconds: number, o: { throttle?: number; slowZone?: boolean; autoHook?: boolean; human?: boolean; seed?: number; untilAttached?: boolean } = {}) => {
      if (!mission) return null;
      if (mission.state === 'countdown') mission.countdown = 0.0001;
      const def = mission.def, H = !!o.human;
      let seed = (o.seed ?? 1) * 9301 + 49297; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const line: { x: number; z: number }[] = def.path ?? [{ x: def.start.x, z: def.start.z }, ...def.gates.map((g) => ({ x: g.x + Math.sin(g.yaw) * 4, z: g.z + Math.cos(g.yaw) * 4 })), ...(def.zone ? [def.zone] : [])];
      const cum = [0]; for (let i = 1; i < line.length; i++) cum.push(cum[i - 1] + Math.hypot(line[i].x - line[i - 1].x, line[i].z - line[i - 1].z));
      const at = (s: number) => { s = Math.min(cum[cum.length - 1], Math.max(0, s)); let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const u = (s - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return { x: line[i - 1].x + (line[i].x - line[i - 1].x) * u, z: line[i - 1].z + (line[i].z - line[i - 1].z) * u }; };
      let prog = 0; // arc-length progress along the line (monotonic, local search)
      const project = (x: number, z: number) => { let best = prog, bd = Infinity; for (let s = Math.max(0, prog - 10); s <= Math.min(cum[cum.length - 1], prog + 40); s += 1) { const p = at(s), d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd) { bd = d; best = s; } } prog = best; return Math.sqrt(bd); };
      let stuckT = 0, rev = 0, lastP = sampleCar(), steerNoise = 0, thrNoise = 0, lift = 0, offT = 0, hookWait = 0;
      const delayQ: number[] = []; let steerOut = 0, thrOut = 0;
      for (let k = 0; k < Math.round(maxSeconds / STEP) && !mission.finished && !(o.untilAttached && mission.attached); k++) {
        const c = sampleCar();
        let tg: { x: number; z: number }, vmax = 30;
        if (def.type === 'tow' && stuck && !mission.attached) {
          const st = stuck.body.translation(), sf = stuck.forward(); tg = { x: st.x + sf.x * 9, z: st.z + sf.z * 9 }; vmax = H ? 8 : 12;
          if (Math.hypot(c.x - tg.x, c.z - tg.z) < 4 || toWorld(car, anchorRear()).distanceTo(toWorld(stuck, anchorFront())) < 8) {
            hookWait++; if (o.autoHook !== false && hookWait > (H ? 90 : 0)) toggleHook(); // a player takes ~1.5 s to line up and hook
          }
        } else if (def.type === 'tow') {
          // drag the towed 4x4 through the zone centre: aim beyond it, ease off once it is well inside
          const st = stuck!.body.translation(), z0 = def.zone!, dx = z0.x - st.x, dz = z0.z - st.z, dd = Math.hypot(dx, dz) || 1;
          tg = { x: z0.x + (dx / dd) * 12, z: z0.z + (dz / dd) * 12 }; vmax = dd < 2.5 ? 0 : dd < 6 ? 3 : H ? 5 : 7;
        }
        else {
          let off = project(c.x, c.z);
          // like a player: lost / fallen off the line for 2 s -> reset to the last checkpoint
          offT = off > 9 || c.up < 0.4 ? offT + STEP : 0;
          if (offT > 2 && !def.noReset && mission.state === 'running') {
            missionReset(); offT = 0; const p = sampleCar(); prog = 0;
            let bd = Infinity; for (let s2 = 0; s2 <= cum[cum.length - 1]; s2 += 2) { const q = at(s2), d = (q.x - p.x) ** 2 + (q.z - p.z) ** 2; if (d < bd) { bd = d; prog = s2; } }
            off = Math.sqrt(bd);
          }
          const L = (H ? 7 : 6) + Math.abs(c.speed) * (H ? 0.45 : 0.5);
          tg = at(prog + L);
          // corner speed from the turn angle over the next stretch of the line
          // max heading change over any 12 m stretch within the braking horizon (catches hairpins)
          let turn = 0; const horizon = 12 + Math.abs(c.speed) * 1.6;
          for (let d0 = 0; d0 <= horizon; d0 += 3) {
            const q0 = at(prog + d0), q1 = at(prog + d0 + 6), q2 = at(prog + d0 + 12);
            let tt = Math.atan2(q2.x - q1.x, q2.z - q1.z) - Math.atan2(q1.x - q0.x, q1.z - q0.z); tt = Math.abs(Math.atan2(Math.sin(tt), Math.cos(tt)));
            turn = Math.max(turn, tt * (1 - 0.35 * d0 / horizon));
          }
          vmax = Math.max(H ? 4.2 : 4.8, (H ? 19 : 26) - turn * (H ? 19 : 17));
          if (off > 6) vmax = Math.min(vmax, 8);
          if (def.zone && (def.type === 'deliver' || def.type === 'trail' || o.slowZone) && Math.hypot(def.zone.x - c.x, def.zone.z - c.z) < 22 && prog > cum[cum.length - 1] - 30) vmax = 3;
        }
        if (def.type === 'tow' && mission.attached) winching = ropeLen > 4;
        let err = Math.atan2(tg.x - c.x, tg.z - c.z) - c.yaw; err = Math.atan2(Math.sin(err), Math.cos(err));
        if (k % 60 === 0) { const moved = Math.hypot(c.x - lastP.x, c.z - lastP.z); stuckT = moved < 1.0 && mission.state === 'running' ? stuckT + 1 : 0; lastP = c; if (stuckT >= 2) { rev = 90; stuckT = 0; } }
        let thr = c.speed < vmax ? (o.throttle ?? 1) : 0, brk = c.speed > vmax + (H ? 2.5 : 1) ? 1 : 0;
        let steer = Math.max(-1, Math.min(1, err * (H ? 1.7 : 2.2)));
        if (H) { // reaction delay (~0.25 s), wandering hands, throttle lifts
          if (k % 6 === 0) { steerNoise = steerNoise * 0.7 + (rnd() - 0.5) * 0.5; thrNoise = rnd(); if (lift <= 0 && rnd() < 0.03) lift = 20 + rnd() * 30; }
          delayQ.push(steer); steer = delayQ.length > 15 ? delayQ.shift()! : 0;
          steer = Math.max(-1, Math.min(1, steer + steerNoise));
          if (lift > 0) { lift--; thr *= 0.3; }
          thr *= 0.8 + thrNoise * 0.2;
          steerOut += (steer - steerOut) * 0.25; thrOut += (thr - thrOut) * 0.2; steer = steerOut; thr = thrOut;
        }
        if (rev > 0) { rev--; thr = 0; brk = 1; steer = -steer; }
        physStep({ throttle: thr, brake: brk, steer, handbrake: false });
      }
      winching = false; car.sync(); stuck?.sync();
      return { state: mission.state, t: mission.t, next: mission.next, splits: mission.splits.slice(), failReason: mission.failReason, rejected: mission.rejected, attached: mission.attached, resets: mission.resets };
    },
  };

  renderGarage();
  setLoad(100, 'Ready');
  $('btn-oskip').onclick = () => endOpening(true);
  if (settings.intro && !/[?&]noopening/.test(location.search)) startOpening(); else { phase = 'menu'; refreshUI(); }
  requestAnimationFrame((t) => { last = t; frame(t); });
}
