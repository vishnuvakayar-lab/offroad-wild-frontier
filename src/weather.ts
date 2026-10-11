import * as THREE from 'three';

export type WeatherId = 'clear' | 'sunset' | 'fog' | 'rain' | 'night';
export const WEATHER_ORDER: WeatherId[] = ['clear', 'sunset', 'fog', 'rain', 'night'];

export interface WeatherDef {
  label: string; icon: string;
  skyTop: number; skyBottom: number; fog: number; fogNear: number; fogFar: number;
  sun: number; sunI: number; sunDir: [number, number, number];
  hemiSky: number; hemiGround: number; hemiI: number; exposure: number;
  headlights: boolean; tint: number; fill: number; rim: number; env: number; rain: boolean; wet: boolean; stars: boolean; dust: number; cloud: number; cloudCol: number;
}

export const WEATHER: Record<WeatherId, WeatherDef> = {
  clear: { cloud: 0.45, cloudCol: 0xffffff, label: 'Clear day', icon: '☀', skyTop: 0x4f86c6, skyBottom: 0xc9d6dc, fog: 0xc4cfd4, fogNear: 60, fogFar: 340,
    sun: 0xfff0d8, sunI: 2.8, sunDir: [0.55, 0.8, 0.25], hemiSky: 0xdfe8ff, hemiGround: 0x5a4630, hemiI: 1.1, exposure: 1.0,
    fill: 0, rim: 0, env: 0.7,  tint: 0xffffff, headlights: false, rain: false, wet: false, stars: false, dust: 1 },
  sunset: { cloud: 0.55, cloudCol: 0xffc39a, label: 'Sunset dunes', icon: '🌅', skyTop: 0x3a3f73, skyBottom: 0xf08a3c, fog: 0xd98a52, fogNear: 50, fogFar: 300,
    sun: 0xff9a4a, sunI: 3.2, sunDir: [0.85, 0.16, -0.5], hemiSky: 0xffb07a, hemiGround: 0x4a3020, hemiI: 0.7, exposure: 1.05,
    fill: 2.5, rim: 3, env: 0.55,  tint: 0xffb08a, headlights: true, rain: false, wet: false, stars: false, dust: 1.3 },
  fog: { cloud: 0, cloudCol: 0x9aa2a6, label: 'Dense fog', icon: '🌫', skyTop: 0x9aa2a6, skyBottom: 0x9aa2a6, fog: 0x9aa2a6, fogNear: 4, fogFar: 62,
    sun: 0xe6ecef, sunI: 0.9, sunDir: [0.3, 0.9, 0.2], hemiSky: 0xc9d2d8, hemiGround: 0x5a5448, hemiI: 1.25, exposure: 1.0,
    fill: 2, rim: 1.5, env: 0.45,  tint: 0xc8ccd0, headlights: true, rain: false, wet: true, stars: false, dust: 0.3 },
  rain: { cloud: 1, cloudCol: 0x5c646c, label: 'Rain', icon: '🌧', skyTop: 0x4b5560, skyBottom: 0x7d878f, fog: 0x6f7880, fogNear: 15, fogFar: 150,
    sun: 0xc8d2dc, sunI: 0.9, sunDir: [0.4, 0.85, 0.3], hemiSky: 0xaab6c2, hemiGround: 0x3a3428, hemiI: 1.0, exposure: 1.0,
    fill: 2.5, rim: 2, env: 0.5,  tint: 0x9aa0a8, headlights: true, rain: true, wet: true, stars: false, dust: 0 },
  night: { cloud: 0.35, cloudCol: 0x1a2236, label: 'Night', icon: '🌙', skyTop: 0x050812, skyBottom: 0x101a2c, fog: 0x0b1220, fogNear: 20, fogFar: 170,
    sun: 0x8fa8ff, sunI: 0.35, sunDir: [-0.4, 0.7, 0.4], hemiSky: 0x3a4f80, hemiGround: 0x14110c, hemiI: 0.45, exposure: 1.1,
    fill: 4.5, rim: 5, env: 0.05,  tint: 0x262c3a, headlights: true, rain: false, wet: false, stars: true, dust: 0.6 },
};

export function makeStars(scene: THREE.Scene) {
  const n = 900, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(1 - Math.random() * 0.95);
    p.set([Math.sin(v) * Math.cos(u) * 550, Math.cos(v) * 550, Math.sin(v) * Math.sin(u) * 550], i * 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const s = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 }));
  s.visible = false; s.frustumCulled = false; scene.add(s);
  return s;
}
