export type Preset = 'low' | 'medium' | 'high';
export type TouchMode = 'auto' | 'on' | 'off';
export interface Settings { preset: Preset; showFps: boolean; touch: TouchMode; }

const KEY = 'owf.settings.v1';
export const isCoarse = () => window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

export function loadSettings(): Settings {
  const def: Settings = { preset: isCoarse() ? 'medium' : 'high', showFps: true, touch: 'auto' };
  try { return { ...def, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return def; }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}
export const PRESETS: Record<Preset, { pixelRatio: number; shadows: boolean; shadowSize: number; fogFar: number; headlights: boolean }> = {
  low: { pixelRatio: 0.75, shadows: false, shadowSize: 512, fogFar: 170, headlights: false },
  medium: { pixelRatio: 1.25, shadows: true, shadowSize: 1024, fogFar: 260, headlights: true },
  high: { pixelRatio: 2, shadows: true, shadowSize: 2048, fogFar: 340, headlights: true },
};
