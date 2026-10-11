import * as THREE from 'three';

/** CPU-simulated, GPU-drawn soft particles (one draw call per system). */
export class Particles {
  readonly max: number;
  private pos: Float32Array; private vel: Float32Array; private life: Float32Array; private maxLife: Float32Array;
  private size0: Float32Array; private grow: Float32Array;
  private aSize: Float32Array; private aAlpha: Float32Array; private aColor: Float32Array;
  private geo = new THREE.BufferGeometry();
  points: THREE.Points;
  private cursor = 0;
  active = 0;
  spawned = 0;
  budget = 1; // 0..1, set from graphics preset
  uniforms = { uScale: { value: 500 }, uTint: { value: new THREE.Color(1, 1, 1) } };

  constructor(scene: THREE.Scene, max: number, private gravity: number, private drag: number, private baseAlpha: number, additive = false) {
    this.max = max;
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max); this.maxLife = new Float32Array(max);
    this.size0 = new Float32Array(max); this.grow = new Float32Array(max);
    this.aSize = new Float32Array(max); this.aAlpha = new Float32Array(max); this.aColor = new Float32Array(max * 3);
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aSize', new THREE.BufferAttribute(this.aSize, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.aAlpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.aColor, 3).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `attribute float aSize; attribute float aAlpha; attribute vec3 aColor; uniform float uScale;
        varying float vA; varying vec3 vC;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uScale / max(0.5, -mv.z); vA = aAlpha; vC = aColor; }`,
      fragmentShader: `uniform vec3 uTint; varying float vA; varying vec3 vC;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c,c); if (d > 0.25) discard;
          gl_FragColor = vec4(vC * uTint, vA * smoothstep(0.25, 0.05, d));
          #include <colorspace_fragment>
        }`,
    });
    this.points = new THREE.Points(this.geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
  }

  emit(p: THREE.Vector3, v: THREE.Vector3, life: number, size: number, grow: number, color: THREE.Color, jitter = 0.3) {
    // ring buffer: oldest particle is recycled when full
    const i = this.cursor; this.cursor = (this.cursor + 1) % this.max;
    if (this.life[i] <= 0) this.active++;
    this.pos[i * 3] = p.x + (Math.random() - 0.5) * jitter; this.pos[i * 3 + 1] = p.y + Math.random() * jitter * 0.5; this.pos[i * 3 + 2] = p.z + (Math.random() - 0.5) * jitter;
    this.vel[i * 3] = v.x; this.vel[i * 3 + 1] = v.y; this.vel[i * 3 + 2] = v.z;
    this.life[i] = this.maxLife[i] = life * (0.7 + Math.random() * 0.6);
    this.size0[i] = size * (0.7 + Math.random() * 0.6); this.grow[i] = grow;
    const s = 0.85 + Math.random() * 0.3;
    this.aColor[i * 3] = color.r * s; this.aColor[i * 3 + 1] = color.g * s; this.aColor[i * 3 + 2] = color.b * s;
    this.spawned++;
  }

  update(dt: number, groundY: (x: number, z: number) => number) {
    let n = 0;
    const dragF = Math.max(0, 1 - this.drag * dt);
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) { this.aAlpha[i] = 0; this.aSize[i] = 0; continue; }
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.aAlpha[i] = 0; this.aSize[i] = 0; continue; }
      n++;
      const j = i * 3;
      this.vel[j + 1] -= this.gravity * dt;
      this.vel[j] *= dragF; this.vel[j + 1] *= dragF; this.vel[j + 2] *= dragF;
      this.pos[j] += this.vel[j] * dt; this.pos[j + 1] += this.vel[j + 1] * dt; this.pos[j + 2] += this.vel[j + 2] * dt;
      if (this.gravity > 0) {
        const gy = groundY(this.pos[j], this.pos[j + 2]);
        if (this.pos[j + 1] < gy) { this.pos[j + 1] = gy; this.vel[j] *= 0.3; this.vel[j + 1] = 0; this.vel[j + 2] *= 0.3; this.life[i] = Math.min(this.life[i], 0.25); }
      }
      const t = 1 - this.life[i] / this.maxLife[i];
      this.aSize[i] = this.size0[i] * (1 + this.grow[i] * t);
      this.aAlpha[i] = this.baseAlpha * Math.min(1, (1 - t) * 1.6) * Math.min(1, t * 12 + 0.2);
    }
    this.active = n;
    for (const k of ['position', 'aSize', 'aAlpha', 'aColor']) (this.geo.attributes[k] as THREE.BufferAttribute).needsUpdate = true;
  }
}

/** Shader-animated rain streaks that wrap around the camera (no per-frame CPU cost). */
export class Rain {
  mesh: THREE.LineSegments;
  private uniforms = { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uOpacity: { value: 0.45 } };
  constructor(scene: THREE.Scene, count: number) {
    const W = 50, H = 28;
    const base = new Float32Array(count * 2 * 3); const end = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W, y = Math.random() * H, z = Math.random() * W;
      base.set([x, y, z, x, y, z], i * 6); end[i * 2] = 0; end[i * 2 + 1] = 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(base, 3));
    g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: this.uniforms,
      vertexShader: `attribute float aEnd; uniform float uTime; uniform vec3 uCam;
        void main(){ float W = ${W.toFixed(1)}; float H = ${H.toFixed(1)};
          vec3 p = position; p.y = mod(p.y - uTime * 22.0, H) + uCam.y - H * 0.45;
          p.x = uCam.x + mod(p.x - uCam.x, W) - W * 0.5; p.z = uCam.z + mod(p.z - uCam.z, W) - W * 0.5;
          p += vec3(0.08, 0.55, 0.02) * aEnd;
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,
      fragmentShader: `uniform float uOpacity; void main(){ gl_FragColor = vec4(0.75, 0.8, 0.88, uOpacity); }`,
    });
    this.mesh = new THREE.LineSegments(g, mat);
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    scene.add(this.mesh);
  }
  update(t: number, cam: THREE.Vector3) { this.uniforms.uTime.value = t; this.uniforms.uCam.value.copy(cam); }
  setDensity(frac: number) { const g = this.mesh.geometry; g.setDrawRange(0, Math.floor((g.attributes.position.count / 2) * frac) * 2); }
}
