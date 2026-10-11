import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { buildTerrain, heightAt, ZONES } from './terrain';
import { Vehicle, SURFACE_PARAMS, type DriveInput } from './vehicle';
import { TrackMarks } from './tracks';
import { Input } from './input';
import { loadSettings, saveSettings, PRESETS, isCoarse, type Preset, type TouchMode } from './settings';

type Phase = 'loading' | 'menu' | 'playing' | 'paused';
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const setLoad = (pct: number, text: string) => { $('load-bar').style.width = pct + '%'; $('load-text').textContent = text; };
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

async function boot() {
  const settings = loadSettings();
  setLoad(15, 'Loading physics…');
  await RAPIER.init();
  setLoad(40, 'Building terrain…');
  await nextFrame();

  // ---------- renderer / scene ----------
  const canvas = $<HTMLCanvasElement>('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: settings.preset !== 'low', powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const skyCol = new THREE.Color(0xc9b89a);
  scene.background = skyCol;
  scene.fog = new THREE.Fog(skyCol, 40, 300);
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 900);

  const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x5a4630, 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2b8, 2.6);
  sun.position.set(60, 90, 30);
  sun.shadow.camera.left = -40; sun.shadow.camera.right = 40; sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 250; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);
  // sky dome gradient
  const skyGeo = new THREE.SphereGeometry(600, 24, 12);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x5d86b8) }, bottom: { value: skyCol } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float t = smoothstep(-0.02, 0.45, vP.y); gl_FragColor = vec4(mix(bottom, top, t), 1.0);\n#include <colorspace_fragment>\n}',
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = 1 / 60;
  buildTerrain(scene, world, RAPIER);
  setLoad(70, 'Preparing vehicle…');
  await nextFrame();
  const tracks = new TrackMarks(scene);
  const car = new Vehicle(world, RAPIER, scene, tracks);
  const spawn = { x: 0, z: -8, yaw: 0 };
  const resetCar = (x = spawn.x, z = spawn.z, yaw = spawn.yaw) => car.reset(x, heightAt(x, z) + 1.4, z, yaw);
  resetCar();

  // ---------- settings application ----------
  const applyPreset = (p: Preset) => {
    const cfg = PRESETS[p];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.pixelRatio));
    renderer.shadowMap.enabled = cfg.shadows;
    sun.castShadow = cfg.shadows;
    if (sun.shadow.mapSize.x !== cfg.shadowSize) {
      sun.shadow.mapSize.set(cfg.shadowSize, cfg.shadowSize);
      sun.shadow.map?.dispose(); (sun.shadow as any).map = null;
    }
    (scene.fog as THREE.Fog).far = cfg.fogFar;
    camera.far = cfg.fogFar + 300; camera.updateProjectionMatrix();
    for (const h of car.headlights) h.intensity = cfg.headlights ? 30 : 0;
    scene.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m) m.needsUpdate = true; });
    $('preset-note').textContent = p === 'low' ? 'No shadows, reduced resolution — best for older phones.'
      : p === 'medium' ? 'Soft shadows, balanced resolution.' : 'Full resolution, high-res shadows.';
    resize();
  };
  const touchOn = () => settings.touch === 'on' || (settings.touch === 'auto' && isCoarse());

  // ---------- resize / rotation / safe areas ----------
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 72 : 62; // wider vertical FOV in portrait so the vehicle stays in view
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
  const refreshUI = () => {
    document.body.classList.toggle('touch', touchOn());
    show('menu', phase === 'menu');
    show('pause', phase === 'paused');
    show('hud', phase === 'playing' || phase === 'paused');
    show('touch', phase === 'playing' && touchOn());
    $('hud-fps').classList.toggle('hidden', !settings.showFps);
    document.querySelectorAll('#seg-preset button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.preset));
    document.querySelectorAll('#seg-touch button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.v === settings.touch));
    $<HTMLInputElement>('chk-fps').checked = settings.showFps;
  };
  const setPhase = (p: Phase) => { phase = p; if (p !== 'paused' && p !== 'menu') openDrawer(false); input.clearTouch(); refreshUI(); };

  $('btn-play').onclick = () => { resetCar(); camInit = false; setPhase('playing'); };
  $('btn-settings').onclick = () => openDrawer(true);
  $('btn-settings2').onclick = () => openDrawer(true);
  $('btn-close-drawer').onclick = () => openDrawer(false);
  $('btn-pause').onclick = () => setPhase('paused');
  $('btn-resume').onclick = () => setPhase('playing');
  $('btn-reset').onclick = () => { resetCar(); camInit = false; setPhase('playing'); };
  $('btn-menu').onclick = () => setPhase('menu');
  input.onPause = () => {
    if (drawer.classList.contains('open')) { openDrawer(false); return; }
    if (phase === 'playing') setPhase('paused'); else if (phase === 'paused') setPhase('playing');
  };
  input.onReset = () => {
    if (phase !== 'playing') return;
    const t = car.body.translation(); const f = car.forward();
    resetCar(t.x, t.z, Math.atan2(f.x, f.z)); // flip upright in place
  };
  document.querySelectorAll<HTMLElement>('#seg-preset button').forEach((b) => b.onclick = () => {
    settings.preset = b.dataset.v as Preset; saveSettings(settings); applyPreset(settings.preset); refreshUI();
  });
  document.querySelectorAll<HTMLElement>('#seg-touch button').forEach((b) => b.onclick = () => {
    settings.touch = b.dataset.v as TouchMode; saveSettings(settings); refreshUI();
  });
  $<HTMLInputElement>('chk-fps').onchange = (e) => { settings.showFps = (e.target as HTMLInputElement).checked; saveSettings(settings); refreshUI(); };
  document.addEventListener('visibilitychange', () => { if (document.hidden && phase === 'playing') setPhase('paused'); });

  // drag-to-look (mouse or touch on empty game area); recentres when released
  let lookYaw = 0, lookPitch = 0, dragging: number | null = null, lastX = 0, lastY = 0;
  canvas.addEventListener('pointerdown', (e) => { dragging = e.pointerId; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (dragging !== e.pointerId) return;
    lookYaw -= (e.clientX - lastX) * 0.006; lookPitch = Math.max(-0.3, Math.min(0.6, lookPitch + (e.clientY - lastY) * 0.004));
    lastX = e.clientX; lastY = e.clientY;
  });
  const endDrag = (e: PointerEvent) => { if (dragging === e.pointerId) dragging = null; };
  canvas.addEventListener('pointerup', endDrag); canvas.addEventListener('pointercancel', endDrag);

  applyPreset(settings.preset);
  resize();

  // ---------- main loop ----------
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let camInit = false, camHeading = 0;
  let acc = 0, last = performance.now(), menuT = 0;
  let fpsFrames = 0, fpsT = 0, fps = 0;
  const fpsHistory: number[] = [];
  let lastInput: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: false };
  const STEP = 1 / 60;
  const tmpF = new THREE.Vector3();

  function frame(now: number) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    fpsFrames++; fpsT += dt;
    if (fpsT >= 1) { fps = fpsFrames / fpsT; fpsHistory.push(fps); if (fpsHistory.length > 120) fpsHistory.shift(); fpsFrames = 0; fpsT = 0; $('hud-fps').textContent = fps.toFixed(0) + ' fps'; }

    if (phase !== 'paused') {
      const drive = phase === 'playing' ? input.read(dt)
        : (input.override ?? { throttle: 0, brake: 0, steer: 0, handbrake: true });
      lastInput = drive;
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 5) { car.step(STEP, drive); world.step(); acc -= STEP; n++; }
      if (n === 5) acc = 0;
    }
    car.sync();

    // ---- camera ----
    const p = car.group.position;
    car.forward(tmpF);
    const heading = Math.atan2(tmpF.x, tmpF.z);
    if (phase === 'menu') {
      menuT += dt * 0.15;
      const a = menuT + 2.2, r = 9.5;
      camPos.set(p.x + Math.sin(a) * r, p.y + 2.6, p.z + Math.cos(a) * r);
      // keep the vehicle visible in the uncovered part of the screen
      const portrait = window.innerWidth < window.innerHeight;
      camLook.set(p.x, p.y + (portrait ? -1.2 : 0.6), p.z);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
      if (!portrait) camera.translateX(-2.2);
      camInit = false;
    } else {
      let d = heading - camHeading; d = Math.atan2(Math.sin(d), Math.cos(d));
      camHeading += d * Math.min(1, dt * 3.5);
      if (dragging === null) { lookYaw *= Math.max(0, 1 - dt * 1.5); lookPitch *= Math.max(0, 1 - dt * 1.5); }
      const yaw = camHeading + lookYaw;
      const dist = 7.8, height = 3.0 + lookPitch * 6;
      const want = new THREE.Vector3(p.x - Math.sin(yaw) * dist, p.y + height, p.z - Math.cos(yaw) * dist);
      want.y = Math.max(want.y, heightAt(want.x, want.z) + 1.2);
      if (!camInit) { camPos.copy(want); camHeading = heading; camInit = true; }
      camPos.lerp(want, 1 - Math.exp(-dt * 6));
      camLook.lerp(new THREE.Vector3(p.x, p.y + 1.1, p.z), 1 - Math.exp(-dt * 12));
      camera.position.copy(camPos);
      camera.lookAt(camLook);
    }
    sun.position.set(p.x + 60, p.y + 90, p.z + 30); sun.target.position.copy(p);
    sky.position.copy(camera.position);

    // ---- HUD ----
    if (phase === 'playing' || phase === 'paused') {
      $('hud-speed').textContent = Math.round(Math.abs(car.forwardSpeed()) * 3.6).toString();
      const s = car.surface(); const chip = $('hud-surface');
      chip.textContent = SURFACE_PARAMS[s].label; chip.className = 'chip ' + s;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  // ---------- test / debug hook ----------
  (window as any).__game = {
    get phase() { return phase; },
    play: () => $('btn-play').click(),
    state: () => {
      const t = car.body.translation(), v = car.body.linvel();
      const f = car.forward();
      return { x: t.x, y: t.y, z: t.z, yaw: Math.atan2(f.x, f.z), up: car.group.up.clone().applyQuaternion(car.group.quaternion).y, speed: car.forwardSpeed(), hspeed: Math.hypot(v.x, v.z), surface: car.surface(),
        wheels: car.surfaces.slice(), fps, fpsHistory: fpsHistory.slice(), tracks: tracks.count, input: lastInput,
        renderer: renderer.info.render, preset: settings.preset };
    },
    setInput: (i: DriveInput | null) => { input.override = i; },
    /** Deterministic fixed-step simulation (independent of render FPS) for automated tests. */
    simulate: (i: DriveInput, seconds: number) => {
      const steps = Math.round(seconds / STEP); const trace: { t: number; speed: number; surface: string }[] = [];
      const t0 = car.body.translation(); const start = { x: t0.x, z: t0.z };
      for (let k = 1; k <= steps; k++) {
        car.step(STEP, i); world.step();
        if (k % 30 === 0) trace.push({ t: k * STEP, speed: car.forwardSpeed(), surface: car.surface() });
      }
      car.sync();
      const t1 = car.body.translation();
      const f1 = car.forward();
      return { yaw: Math.atan2(f1.x, f1.z), distance: Math.hypot(t1.x - start.x, t1.z - start.z), finalSpeed: car.forwardSpeed(), surface: car.surface(), trace };
    },
    teleport: (x: number, z: number, yaw: number) => { resetCar(x, z, yaw); camInit = false; },
    zones: ZONES,
  };

  setLoad(100, 'Ready');
  phase = 'menu';
  refreshUI();
  requestAnimationFrame((t) => { last = t; frame(t); });
  const ls = $('loading'); ls.classList.add('fade'); setTimeout(() => ls.classList.add('hidden'), 600);
}

boot().catch((e) => {
  console.error(e);
  $('load-text').textContent = 'Failed to start: ' + (e?.message ?? e) + ' — your browser may not support WebGL2/WebAssembly.';
});
