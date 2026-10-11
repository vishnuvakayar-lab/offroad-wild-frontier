import * as THREE from 'three';

/** GLSL helpers shared by the ground, water and sky shaders (cheap hash value noise, no textures). */
export const NOISE_GLSL = /* glsl */ `
float owH21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float owVN(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(owH21(i), owH21(i + vec2(1.0, 0.0)), u.x), mix(owH21(i + vec2(0.0, 1.0)), owH21(i + vec2(1.0, 1.0)), u.x), u.y); }
float owFB2(vec2 p){ return owVN(p) * 0.667 + owVN(p * 2.03 + 1.7) * 0.333; }
float owFB3(vec2 p){ return owVN(p) * 0.571 + owVN(p * 2.03 + 1.7) * 0.286 + owVN(p * 4.11 + 3.1) * 0.143; }
float owFB(vec2 p){ return owVN(p) * 0.5 + owVN(p * 2.03 + 1.7) * 0.25 + owVN(p * 4.11 + 3.1) * 0.125 + owVN(p * 8.17 + 5.3) * 0.0625; }
`;

/** Surface-normal perturbation from a scalar height computed in the fragment shader (screen-space derivatives). */
const BUMP_GLSL = /* glsl */ `
vec3 owBump(vec3 pos, vec3 n, float h){
  vec3 dpx = dFdx(pos), dpy = dFdy(pos);
  float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
  float det = dot(dpx, r1);
  vec3 g = sign(det) * (dhx * r1 + dhy * r2);
  return normalize(abs(det) * n - g);
}`;

export const groundUniforms = { uTime: { value: 0 }, uWetAll: { value: 0 }, uSkyRefl: { value: new THREE.Color(0.6, 0.7, 0.85) } };

/**
 * Procedural ground detail on top of the per-vertex biome colours:
 *  - grass/dirt: patchy albedo, clumps and pebbles
 *  - sand: wind ripples + grain (bump), lighter crests
 *  - mud: lumpy clods, wet glossy pools (low roughness, darker), ruts
 *  - rock: cracks and grit
 * Biome weights come from the `aSurf` attribute (mud, sand, rock, wet-ring). Disabled (define removed) on the Low preset.
 */
export function enhanceGround(mat: THREE.MeshStandardMaterial, kind: 'main' | 'mountain') {
  mat.defines = { ...(mat.defines ?? {}), OW_DETAIL: '' };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = groundUniforms.uTime; sh.uniforms.uWetAll = groundUniforms.uWetAll; sh.uniforms.uSkyRefl = groundUniforms.uSkyRefl;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aSurf; varying vec4 vSurf; varying vec3 vW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSurf = aSurf; vW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec4 vSurf; varying vec3 vW; uniform float uTime; uniform float uWetAll; uniform vec3 uSkyRefl;
${NOISE_GLSL}
${BUMP_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float owHgt = 0.0, owWet = 0.0;
#ifdef OW_DETAIL
{
  float dist = length(vViewPosition);
  float mudW = vSurf.x, sandW = vSurf.y, rockW = vSurf.z, ring = vSurf.w;
  float pools = 0.0;
  // per-biome work is branched on its weight (biomes are large coherent regions) and skipped beyond 220 m
  if (dist < 220.0) {
    float fadeN = 1.0 - smoothstep(18.0, 70.0, dist);    // fine bump only near the camera (avoids shimmer)
    float fadeC = 1.0 - smoothstep(60.0, 220.0, dist);   // colour variation further out
    vec2 p = vW.xz;
    float grassW = clamp(1.0 - mudW - sandW - rockW, 0.0, 1.0);
    vec3 c = diffuseColor.rgb, detailC = vec3(0.0);
    float big = owFB2(p * 0.045), fine = owVN(p * 6.3), grit = fadeN > 0.0 ? owVN(p * 23.0) : 0.5;
    float hG = 0.0, hS = 0.0, hM = 0.0, hR = 0.0;
    if (grassW > 0.01) { // grass / dirt
      float mid = owVN(p * 0.9);
      float clump = smoothstep(0.35, 0.8, owFB3(p * 0.32 + 11.0));
      vec3 cg = c * (0.78 + 0.42 * mid) * mix(vec3(1.0), vec3(1.12, 1.06, 0.78), smoothstep(0.55, 0.8, big));
      cg = mix(cg, c * vec3(0.72, 0.86, 0.62), clump * 0.45);
      float pebble = smoothstep(0.82, 0.9, owVN(p * 4.0 + 7.0)) * (1.0 - clump);
      cg = mix(cg, vec3(0.42, 0.40, 0.37), pebble * 0.7);
      hG = fine * 0.35 + grit * 0.25 + clump * 0.5 + pebble * 0.6;
      detailC += cg * grassW;
    }
    if (sandW > 0.01) { // sand: wind ripples (crest lines warped by noise), fine grain
      float warp = owFB2(p * 0.08 + 3.0) * 9.0;
      float rq = dot(p, vec2(0.83, 0.56)) * 2.6 + warp;
      float rip = pow(0.5 + 0.5 * sin(rq), 2.2);
      vec3 cs = c * (0.9 + 0.16 * rip + 0.08 * (big - 0.5)) + (grit - 0.5) * 0.05;
      hS = rip * 0.55 + grit * 0.08 + owVN(p * 0.6) * 0.4;
      detailC += cs * sandW;
    }
    if (mudW > 0.01) { // mud: clods, wet pools
      float clod = owFB3(p * 1.4 + 2.0);
      pools = smoothstep(0.52, 0.66, owFB2(p * 0.11 + 5.0) + (fine - 0.5) * 0.08);
      vec3 cm = c * (0.72 + 0.5 * clod) * mix(1.0, 0.55, pools);
      cm = mix(cm, cm * vec3(1.15, 1.0, 0.82), smoothstep(0.6, 0.85, big) * 0.6);   // drier crust patches
      hM = clod * 0.8 + fine * 0.25 - pools * 0.7;
      detailC += cm * mudW;
    }
    if (rockW > 0.01) { // rock: cracks + grit
      float crack = 1.0 - smoothstep(0.0, 0.06, abs(owVN(p * 0.7 + 9.0) - 0.5));
      vec3 cr = c * (0.85 + 0.3 * fine) * (1.0 - crack * 0.45);
      hR = fine * 0.6 + grit * 0.3 - crack * 0.6;
      detailC += cr * rockW;
    }
    detailC += c * ((grassW > 0.01 ? 0.0 : grassW) + (sandW > 0.01 ? 0.0 : sandW) + (mudW > 0.01 ? 0.0 : mudW) + (rockW > 0.01 ? 0.0 : rockW));
    c = mix(c, detailC, fadeC);
    c *= mix(1.0, 0.62, ring * (1.0 - mudW * 0.5));
    diffuseColor.rgb = c;
    owHgt = (hG * grassW * 0.06 + hS * sandW * 0.09 + hM * mudW * 0.1 + hR * rockW * 0.08) * fadeN;
    owHgt *= (1.0 - pools * mudW * 0.8);
  }
  owWet = clamp(max(pools * mudW, ring) + uWetAll * 0.55, 0.0, 1.0);
}
#endif
`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.28, owWet);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
#ifdef OW_DETAIL
normal = owBump(-vViewPosition, normal, owHgt);
#endif`)
      // sky reflections only where the ground is wet; needs USE_ENVMAP off so lights_fragment_maps leaves radiance alone (no diffuse image-based light: the hemisphere light does that)
      .replace('#include <lights_fragment_maps>', `#include <lights_fragment_maps>
iblIrradiance = vec3(0.0);
radiance = uSkyRefl * (owWet * 0.32); // analytic sky colour instead of a PMREM lookup (cheaper on mobile GPUs)`);
  };
  mat.customProgramCacheKey = () => 'owf-ground-' + kind + ('OW_DETAIL' in (mat.defines ?? {}) ? '-d' : '');
}

export function setGroundDetail(mats: THREE.Material[], on: boolean) {
  for (const m of mats) {
    const has = 'OW_DETAIL' in (m.defines ?? {});
    if (has === on) continue;
    if (on) m.defines = { ...(m.defines ?? {}), OW_DETAIL: '' }; else { const d = { ...(m.defines ?? {}) }; delete d.OW_DETAIL; m.defines = d; }
    m.needsUpdate = true;
  }
}

/** Muddy puddle water: sky reflections via envMap, animated ripple normals, soft shoreline alpha.
 *  Geometry is a unit circle (scaled per puddle) so `position.xy` gives the normalised radius. */
export function makeWaterMaterial() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x2b241a, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.94, depthWrite: false, envMapIntensity: 0.42 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = groundUniforms.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vLoc; varying vec3 vW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLoc = position.xy; vW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec2 vLoc; varying vec3 vW; uniform float uTime;
${NOISE_GLSL}
${BUMP_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float rr = length(vLoc);
float shore = smoothstep(1.0, 0.72, rr + (owVN(vW.xz * 1.3) - 0.5) * 0.25);
diffuseColor.a *= shore;
diffuseColor.rgb = mix(diffuseColor.rgb * 1.6, diffuseColor.rgb, smoothstep(0.65, 0.95, shore));`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{
  vec2 q = vW.xz;
  float w = owVN(q * 2.2 + vec2(uTime * 0.35, uTime * 0.21)) * 0.6 + owVN(q * 5.1 - vec2(uTime * 0.5, -uTime * 0.3)) * 0.4;
  float fadeW = 1.0 - smoothstep(15.0, 60.0, length(vViewPosition));
  normal = owBump(-vViewPosition, normal, w * 0.035 * fadeW);
}`);
  };
  mat.customProgramCacheKey = () => 'owf-water';
  return mat;
}
