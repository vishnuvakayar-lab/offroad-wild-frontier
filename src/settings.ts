export type Preset = 'low' | 'medium' | 'high';
export type TouchMode = 'auto' | 'on' | 'off';
import type { WeatherId } from './weather';
import type { ControlScheme } from './input';
export interface Settings { preset: Preset; showFps: boolean; touch: TouchMode; weather: WeatherId; volume: number; muted: boolean; intro: boolean; vehicle: string; paints: Record<string, number>; controls: ControlScheme; autoThrottle: boolean; camDist: number; camHeight: number; shake: boolean; wheelSens: number; ctlV: number; }

const KEY = 'owf.settings.v1';
const CTL_V = 4;
export const isCoarse = () => window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

export function loadSettings(): Settings {
  const def: Settings = { preset: isCoarse() ? 'medium' : 'high', showFps: true, touch: 'auto', weather: 'clear', volume: 0.8, muted: false, intro: true, vehicle: 'scout', paints: {}, controls: 'wheel', autoThrottle: isCoarse(), camDist: 1, camHeight: 1, shake: true, wheelSens: 1, ctlV: CTL_V };
  try {
    const s = { ...def, ...JSON.parse(localStorage.getItem(KEY) || '{}') } as Settings;
    // control defaults changed (v4 / 0.7.3: mobile default = rotational steering wheel + GAS + BRAKE/REV; ◀ ▶ stay optional): saves from older builds are force-migrated once
    if ((s.ctlV ?? 0) < CTL_V) { s.controls = def.controls; s.autoThrottle = def.autoThrottle; s.ctlV = CTL_V; }
    return s;
  } catch { return def; }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}
export const PRESETS: Record<Preset, { pixelRatio: number; shadows: boolean; shadowSize: number; fogFar: number; headlights: boolean; aa: boolean; particles: number; rain: number; beamShadow: boolean }> = {
  low: { pixelRatio: 0.75, shadows: false, shadowSize: 512, fogFar: 170, headlights: true, aa: false, particles: 0.35, rain: 0.3, beamShadow: false },
  medium: { pixelRatio: 1.25, shadows: true, shadowSize: 1024, fogFar: 260, headlights: true, aa: true, particles: 0.7, rain: 0.6, beamShadow: true },
  high: { pixelRatio: 2, shadows: true, shadowSize: 2048, fogFar: 340, headlights: true, aa: true, particles: 1, rain: 1, beamShadow: true },
};
