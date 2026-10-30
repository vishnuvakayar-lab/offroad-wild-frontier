/** 0.9.0 real vehicle model data: engine / gearbox / transfer case / tyres / aero / brakes per vehicle,
 *  and the tyre-surface table. Numbers are plausible real-world values for each vehicle class (not copies of any
 *  specific model). Everything the car does (top speed, 0-50, braking distance, 4L crawl speed, bogging in sand)
 *  emerges from these values through Vehicle.step - there are no velocity caps or scripted forces. */
import { fbm, type Surface } from './terrain';

export interface Powertrain {
  /** peak torque (N m) at rpmT, peak power (kW) at rpmP, idle and redline (fuel cut) rpm */
  torque: number; rpmT: number; powerKw: number; rpmP: number; idle: number; redline: number;
  /** engine + flywheel + converter inertia (kg m^2) */
  engInertia: number;
  gears: number[]; reverse: number; final: number;
  /** transfer-case low-range reduction (1 = no low range) */
  low: number;
  /** driveline efficiency engine -> wheels */
  eff: number;
  /** aero: drag coefficient x frontal area (m^2) */
  cda: number;
  /** maximum service-brake deceleration the brake hardware can produce (g), front share of brake torque */
  brakeG: number; brakeFront: number;
  /** anti-roll bar rates front / rear (N per m of left-right travel difference) */
  arbF: number; arbR: number;
}
const AUTO6 = [4.17, 2.34, 1.52, 1.14, 0.87, 0.69];
const ALLISON6 = [3.51, 1.9, 1.44, 1.0, 0.74, 0.64];
export const POWERTRAIN: Record<string, Powertrain> = {
  // short-wheelbase classic 4x4, 3.0 l petrol V6 class
  scout: { torque: 360, rpmT: 3600, powerKw: 165, rpmP: 5400, idle: 750, redline: 6000, engInertia: 0.22, gears: [3.52, 2.04, 1.4, 1.0, 0.75], reverse: 3.22, final: 4.1, low: 2.57, eff: 0.85, cda: 1.18, brakeG: 1.2, brakeFront: 0.62, arbF: 16000, arbR: 9000 },
  // ~2300 kg expedition SUV, ~220 kW 3.0 l turbo petrol, 8-speed automatic, 2.93 low range
  f110: { torque: 400, rpmT: 2000, powerKw: 221, rpmP: 5500, idle: 700, redline: 6250, engInertia: 0.25, gears: [4.71, 3.14, 2.11, 1.67, 1.29, 1.0, 0.84, 0.67], reverse: 3.3, final: 3.73, low: 2.93, eff: 0.86, cda: 1.2, brakeG: 1.25, brakeFront: 0.62, arbF: 22000, arbR: 14000 },
  // large diesel overlander (V8 diesel class)
  voyager: { torque: 650, rpmT: 1750, powerKw: 200, rpmP: 3600, idle: 650, redline: 4600, engInertia: 0.45, gears: AUTO6, reverse: 3.3, final: 3.73, low: 2.72, eff: 0.85, cda: 1.35, brakeG: 1.2, brakeFront: 0.63, arbF: 20000, arbR: 12000 },
  // full-size desert SUV, 5.7 l petrol V8
  sahara: { torque: 540, rpmT: 3600, powerKw: 280, rpmP: 5600, idle: 650, redline: 6000, engInertia: 0.35, gears: [3.33, 1.96, 1.35, 1.0, 0.73, 0.59], reverse: 3.06, final: 3.91, low: 2.62, eff: 0.85, cda: 1.3, brakeG: 1.2, brakeFront: 0.64, arbF: 24000, arbR: 14000 },
  // double-cab diesel pickup
  pickup: { torque: 500, rpmT: 2000, powerKw: 150, rpmP: 3400, idle: 750, redline: 4400, engInertia: 0.3, gears: AUTO6, reverse: 3.4, final: 3.73, low: 2.72, eff: 0.86, cda: 1.4, brakeG: 1.15, brakeFront: 0.66, arbF: 18000, arbR: 6000 },
  // Rally4-class featherweight hatch: 1.6 l turbo, 5-speed sequential, permanent AWD
  rally: { torque: 300, rpmT: 3000, powerKw: 160, rpmP: 6200, idle: 1000, redline: 7200, engInertia: 0.12, gears: [3.0, 2.1, 1.62, 1.3, 1.08], reverse: 3.0, final: 4.4, low: 1, eff: 0.88, cda: 0.68, brakeG: 1.4, brakeFront: 0.65, arbF: 26000, arbR: 18000 },
  // cab-over 4x4 recovery rig, 7 l turbo-diesel
  recovery: { torque: 700, rpmT: 1500, powerKw: 160, rpmP: 2300, idle: 600, redline: 2700, engInertia: 1.4, gears: [6.02, 3.32, 2.07, 1.4, 1.0, 0.79], reverse: 5.5, final: 4.88, low: 1.94, eff: 0.84, cda: 4.6, brakeG: 0.95, brakeFront: 0.55, arbF: 50000, arbR: 40000 },
  // 4x4 camper van, 3.0 l diesel, 7-speed
  van: { torque: 470, rpmT: 1600, powerKw: 140, rpmP: 3600, idle: 700, redline: 4400, engInertia: 0.35, gears: [4.38, 2.86, 1.92, 1.37, 1.0, 0.82, 0.73], reverse: 3.42, final: 3.92, low: 2.42, eff: 0.85, cda: 1.75, brakeG: 1.05, brakeFront: 0.65, arbF: 26000, arbR: 14000 },
  // light tactical 4x4, 2.4 l diesel
  ltv: { torque: 400, rpmT: 2000, powerKw: 120, rpmP: 3800, idle: 750, redline: 4500, engInertia: 0.28, gears: [4.0, 2.4, 1.5, 1.0, 0.8], reverse: 3.7, final: 4.3, low: 2.6, eff: 0.85, cda: 1.6, brakeG: 1.1, brakeFront: 0.6, arbF: 12000, arbR: 7000 },
  // armored patrol truck, 6.7 l diesel + Allison 6-speed
  patrol: { torque: 760, rpmT: 1600, powerKw: 200, rpmP: 2600, idle: 650, redline: 3200, engInertia: 1.0, gears: ALLISON6, reverse: 5.1, final: 4.56, low: 2.6, eff: 0.84, cda: 3.6, brakeG: 0.95, brakeFront: 0.58, arbF: 60000, arbR: 45000 },
  // 6x6 cargo truck
  cargo6: { torque: 800, rpmT: 1400, powerKw: 180, rpmP: 2200, idle: 600, redline: 2600, engInertia: 1.6, gears: ALLISON6, reverse: 5.1, final: 5.57, low: 2.0, eff: 0.83, cda: 5.2, brakeG: 0.9, brakeFront: 0.5, arbF: 60000, arbR: 60000 },
  // MRAP-style armored vehicle
  mrap: { torque: 900, rpmT: 1500, powerKw: 220, rpmP: 2300, idle: 650, redline: 2700, engInertia: 1.8, gears: ALLISON6, reverse: 5.1, final: 4.89, low: 2.0, eff: 0.83, cda: 5.8, brakeG: 0.9, brakeFront: 0.56, arbF: 90000, arbR: 70000 },
};
export const powertrainFor = (id: string) => POWERTRAIN[id] ?? POWERTRAIN.f110;

/** Engine full-load torque (N m) at rpm: rises from idle to the torque peak, then falls along the power curve. */
export function engineTorque(p: Powertrain, rpm: number): number {
  const tPow = (p.powerKw * 1000) / (p.rpmP * Math.PI / 30); // torque at peak power
  if (rpm <= p.idle) return p.torque * 0.6;
  if (rpm <= p.rpmT) return p.torque * (0.6 + 0.4 * (rpm - p.idle) / Math.max(1, p.rpmT - p.idle));
  if (rpm <= p.rpmP) { const k = (rpm - p.rpmT) / Math.max(1, p.rpmP - p.rpmT); return p.torque + (tPow - p.torque) * k; }
  const k = Math.min(1, (rpm - p.rpmP) / Math.max(1, p.redline - p.rpmP)); return tPow * (1 - 0.18 * k);
}
/** Closed-throttle engine drag torque (pumping + friction), positive number (N m). */
export const engineDrag = (p: Powertrain, rpm: number) => p.torque * (0.04 + 0.1 * Math.min(1.3, rpm / p.redline));

export type PhysSurface = 'asphalt' | 'gravel' | 'rock' | 'sand' | 'softsand' | 'mud' | 'wet';
/** Tyre-surface table. mu = peak friction, B/C = Pacejka-style shape (stiffness / peak shape), crr = rolling
 *  resistance coefficient (C ~1.1 on soft ground: loose media keep pushing back at high slip, no sharp peak), dig = extra rolling resistance from a spinning / sinking tyre (sinkage), soft = deformable. */
export const SURF: Record<PhysSurface, { mu: number; B: number; C: number; crr: number; dig: number; soft: boolean; label: string }> = {
  asphalt: { mu: 1.0, B: 11, C: 1.65, crr: 0.013, dig: 0, soft: false, label: 'Asphalt' },
  gravel: { mu: 0.72, B: 8, C: 1.45, crr: 0.03, dig: 0.05, soft: false, label: 'Dirt' },
  rock: { mu: 0.85, B: 10, C: 1.55, crr: 0.02, dig: 0, soft: false, label: 'Rock' },
  wet: { mu: 0.55, B: 9, C: 1.5, crr: 0.035, dig: 0.05, soft: false, label: 'Wet' },
  sand: { mu: 0.6, B: 5, C: 1.1, crr: 0.08, dig: 0.05, soft: true, label: 'Sand' },
  softsand: { mu: 0.5, B: 4, C: 1.1, crr: 0.2, dig: 0.1, soft: true, label: 'Soft sand' },
  mud: { mu: 0.4, B: 5, C: 1.1, crr: 0.1, dig: 0.06, soft: true, label: 'Mud' },
};
/** Map the terrain biome (+ weather / water) to a tyre surface. Soft-sand pockets come from a fixed noise field. */
export function physSurface(s: Surface, x: number, z: number, wet: number, puddle: boolean): PhysSurface {
  if (s === 'sand') return fbm(x * 0.045 + 31, z * 0.045 - 17, 2) > 0.56 ? 'softsand' : 'sand';
  if (s === 'mud') return 'mud';
  if (puddle || wet > 0.5) return 'wet';
  return s === 'rock' ? 'rock' : 'gravel';
}
/** Pacejka-style magic formula, normalised: returns force / (mu Fz) for slip x. */
export const magic = (B: number, C: number, x: number) => Math.sin(C * Math.atan(B * x));
