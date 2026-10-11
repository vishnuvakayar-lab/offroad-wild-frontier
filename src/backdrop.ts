import * as THREE from 'three';

/**
 * Layered distant mountain silhouettes (2 rings) that follow the camera horizontally, so the horizon reads as
 * ranges receding into haze instead of terrain ending in fog. Unlit, no fog, one draw call per layer.
 */
const LAYERS = [
  { r: 0.8, hMin: 18, hMax: 62, seed: 3.1, haze: 0.42 },
  { r: 0.95, hMin: 34, hMax: 112, seed: 7.7, haze: 0.66 },
];

function ridge(a: number, seed: number) {
  // sum of sines with incommensurate frequencies -> irregular peaks, periodic around the ring
  let h = 0, amp = 1, tot = 0;
  for (let k = 0; k < 5; k++) { const f = [3, 7, 13, 23, 41][k]; h += amp * (0.5 + 0.5 * Math.sin(a * f + seed * (k + 1.3) + Math.sin(a * f * 0.5 + seed) * 0.8)); tot += amp; amp *= 0.55; }
  return Math.pow(h / tot, 1.6);
}

export interface Backdrop { group: THREE.Group; setColors(rock: THREE.Color, haze: THREE.Color): void; update(cam: THREE.Camera & { far: number }, baseY: number): void }

export function buildBackdrop(scene: THREE.Scene): Backdrop {
  const group = new THREE.Group(); group.name = 'backdrop:ridges';
  const mats: THREE.ShaderMaterial[] = [];
  for (const L of LAYERS) {
    const N = 360, pos: number[] = [], hv: number[] = [], idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2, h = L.hMin + (L.hMax - L.hMin) * ridge(a, L.seed);
      const x = Math.sin(a) * L.r, z = Math.cos(a) * L.r;
      pos.push(x, -40, z, x, h, z); hv.push(0, 1);
      if (i < N) { const b = i * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aTop', new THREE.Float32BufferAttribute(hv, 1));
    geo.setIndex(idx);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uRock: { value: new THREE.Color() }, uHaze: { value: new THREE.Color() }, uK: { value: L.haze } },
      vertexShader: `attribute float aTop; varying float vT; varying float vY; void main(){ vT = aTop; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uRock; uniform vec3 uHaze; uniform float uK; varying float vT; varying float vY;
        void main(){ float base = smoothstep(-10.0, 40.0, vY); vec3 c = mix(uHaze, uRock, (1.0 - uK) * base); gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
      side: THREE.DoubleSide, fog: false, depthWrite: true,
    });
    mats.push(mat);
    const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; m.renderOrder = -1; m.name = 'backdrop:layer';
    group.add(m);
  }
  scene.add(group);
  return {
    group,
    setColors(rock, haze) { for (const m of mats) { m.uniforms.uRock.value.copy(rock); m.uniforms.uHaze.value.copy(haze); } },
    update(cam, baseY) {
      const s = cam.far * 0.9;
      group.position.set(cam.position.x, baseY, cam.position.z);
      group.scale.set(s, 1, s);
    },
  };
}
