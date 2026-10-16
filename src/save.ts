import { VEHICLES, PAINTS, type VehicleSpec } from './vehicles';

/** Progress save (separate from display settings). Versioned + migration-safe. */
export const SAVE_KEY = 'owf.save';
export const SAVE_VERSION = 2;
export type UpgradeKind = 'engine' | 'tyres' | 'susp';
export const UPGRADE_KINDS: UpgradeKind[] = ['engine', 'tyres', 'susp'];
export const MAX_UPGRADE = 3;
export interface Best { time: number; medal: Medal; splits?: number[] }
export type Medal = 'gold' | 'silver' | 'bronze' | 'none';
export interface SaveData {
  v: number; credits: number; xp: number;
  vehicles: string[]; paints: number[];
  upgrades: Record<string, Record<UpgradeKind, number>>;
  best: Record<string, Best>;
  runs: number;
}

/** Unlock rules: level requirement + credit price (Scout is free). */
export const VEHICLE_UNLOCK: Record<string, { level: number; price: number }> = {
  scout: { level: 1, price: 0 }, f110: { level: 1, price: 0 }, pickup: { level: 2, price: 1200 }, voyager: { level: 2, price: 1600 },
  recovery: { level: 3, price: 2000 }, rally: { level: 3, price: 2400 }, sahara: { level: 4, price: 3000 },
  van: { level: 2, price: 1500 }, ltv: { level: 2, price: 1800 }, patrol: { level: 3, price: 2600 }, cargo6: { level: 4, price: 3200 }, mrap: { level: 5, price: 4000 },
};
/** paints: first three free, the rest unlock with player level */
export const PAINT_LEVEL = (hex: number) => { const i = PAINTS.findIndex((p) => p.hex === hex); return i < 3 ? 1 : Math.min(5, 2 + ((i - 3) >> 1)); };
export const XP_PER_LEVEL = 300;
export const levelOf = (xp: number) => 1 + Math.floor(xp / XP_PER_LEVEL);
export const upgradeCost = (lvl: number) => 400 * (lvl + 1);

export function defaults(): SaveData {
  return { v: SAVE_VERSION, credits: 0, xp: 0, vehicles: ['scout'], paints: PAINTS.slice(0, 3).map((p) => p.hex), upgrades: {}, best: {}, runs: 0 };
}

const num = (x: unknown, d = 0) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : d);
/** Accepts anything (missing, corrupt, v1 legacy, future fields) and returns a valid current-version save. */
export function migrate(raw: unknown): SaveData {
  const d = defaults();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Record<string, any>;
  // v1 schema (pre-release format kept for migration tests): { version: 1, cash, unlocked: string[], bestTimes: {id: seconds} }
  if (r.version === 1 && r.v === undefined) {
    d.credits = num(r.cash);
    if (Array.isArray(r.unlocked)) d.vehicles = [...new Set(['scout', ...r.unlocked.filter((id: unknown) => VEHICLES.some((v) => v.id === id))])];
    if (r.bestTimes && typeof r.bestTimes === 'object') for (const [k, t] of Object.entries(r.bestTimes)) if (num(t, -1) > 0) d.best[k] = { time: t as number, medal: 'none' };
    return d;
  }
  if (typeof r.v === 'number' && r.v > SAVE_VERSION) {
    // newer save from a future build: keep what we understand, never crash
  }
  d.credits = num(r.credits); d.xp = num(r.xp); d.runs = num(r.runs);
  if (Array.isArray(r.vehicles)) d.vehicles = [...new Set(['scout', ...r.vehicles.filter((id: unknown) => VEHICLES.some((v) => v.id === id))])];
  if (Array.isArray(r.paints)) d.paints = [...new Set([...d.paints, ...r.paints.filter((h: unknown) => PAINTS.some((p) => p.hex === h))])];
  if (r.upgrades && typeof r.upgrades === 'object') for (const [id, u] of Object.entries(r.upgrades as Record<string, any>)) {
    if (!VEHICLES.some((v) => v.id === id) || !u || typeof u !== 'object') continue;
    d.upgrades[id] = { engine: Math.min(MAX_UPGRADE, Math.floor(num(u.engine))), tyres: Math.min(MAX_UPGRADE, Math.floor(num(u.tyres))), susp: Math.min(MAX_UPGRADE, Math.floor(num(u.susp))) };
  }
  if (r.best && typeof r.best === 'object') for (const [k, b] of Object.entries(r.best as Record<string, any>)) {
    if (b && num(b.time, -1) > 0) d.best[k] = { time: b.time, medal: ['gold', 'silver', 'bronze'].includes(b.medal) ? b.medal : 'none', ...(Array.isArray(b.splits) && b.splits.every((x: unknown) => num(x, -1) >= 0) ? { splits: b.splits } : {}) };
  }
  return d;
}
export function loadSave(): SaveData {
  try { return migrate(JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')); } catch { return defaults(); }
}
export function storeSave(s: SaveData) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* private mode */ } }

/** Dev/test override: ?dev=1 in the URL or localStorage owf.dev = "1" unlocks every vehicle and paint (does not touch the save). */
export const devMode = () => { try { return /[?&]dev=1/.test(location.search) || localStorage.getItem('owf.dev') === '1'; } catch { return false; } };
export const vehicleUnlocked = (s: SaveData, id: string) => devMode() || s.vehicles.includes(id);
export const paintUnlocked = (s: SaveData, hex: number) => devMode() || s.paints.includes(hex);
export const upgradesOf = (s: SaveData, id: string): Record<UpgradeKind, number> => s.upgrades[id] ?? { engine: 0, tyres: 0, susp: 0 };

/** Effective physics spec with upgrades applied (a copy; the base spec is never mutated).
 *  engine: +9% drive force & +3% top speed per level; tyres: +7% grip on every surface & +4% lateral stiffness;
 *  suspension: +10% travel, +8% spring rate and +3 cm ride height per level. */
export function applyUpgrades(base: VehicleSpec, u: Record<UpgradeKind, number>): VehicleSpec {
  const s: VehicleSpec = { ...base, grip: { ...base.grip }, susp: { ...base.susp }, wheel: { ...base.wheel } };
  s.engine = base.engine * (1 + 0.09 * u.engine); s.topSpeed = base.topSpeed * (1 + 0.03 * u.engine);
  const g = 1 + 0.07 * u.tyres; s.grip = { ground: base.grip.ground * g, sand: base.grip.sand * g, mud: base.grip.mud * g }; s.side = base.side * (1 + 0.04 * u.tyres);
  s.susp = { ...base.susp, travel: base.susp.travel * (1 + 0.1 * u.susp), stiffness: base.susp.stiffness * (1 + 0.08 * u.susp), rest: base.susp.rest + 0.03 * u.susp };
  return s;
}

/** Credit/XP grant + new-best bookkeeping; returns what changed (pure on the passed save object). */
export function award(s: SaveData, missionId: string, time: number | null, medal: Medal, base: number) {
  const mult = { gold: 2, silver: 1.5, bronze: 1.2, none: 1 }[medal];
  const credits = time === null ? 0 : Math.round(base * mult);
  const xp = time === null ? 10 : Math.round(base * 0.6 * mult);
  const before = levelOf(s.xp);
  s.credits += credits; s.xp += xp; s.runs++;
  const prev = s.best[missionId];
  const newBest = time !== null && (!prev || time < prev.time);
  const rank = { gold: 3, silver: 2, bronze: 1, none: 0 };
  if (newBest) s.best[missionId] = { time: time!, medal: prev && rank[prev.medal] > rank[medal] ? prev.medal : medal };
  else if (prev && rank[medal] > rank[prev.medal]) prev.medal = medal;
  // level-up paint unlocks
  const lvl = levelOf(s.xp);
  for (const p of PAINTS) if (PAINT_LEVEL(p.hex) <= lvl && !s.paints.includes(p.hex)) s.paints.push(p.hex);
  return { credits, xp, newBest, levelUp: lvl > before ? lvl : 0 };
}
