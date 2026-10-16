/** Driving profiles (0.8.0). Each one scales real physics parameters in Vehicle.step / setProfile:
 *  steering limit + rate, throttle curve, engine + brake force, tyre friction slip (longitudinal grip) and side stiffness,
 *  soft-terrain grip / drag, suspension stiffness + travel + damping, body-lean (weight-transfer) amount and the
 *  steering / stability assists. This is a tuned game model, not an accurate tyre simulation. */
export type ProfileId = 'pro' | 'offroad' | 'sim' | 'arcade';
export interface DriveProfile {
  id: ProfileId; label: string; desc: string;
  steerLim: number; steerRate: number; throttleExp: number; engine: number; brake: number;
  grip: number; side: number; softGrip: number; softDrag: number;
  stiff: number; travel: number; damp: number; lean: number; assist: number; yawCap: number; stability: number;
}
export const PROFILES: Record<ProfileId, DriveProfile> = {
  pro: { id: 'pro', label: 'PRO', desc: 'Balanced: the tuned default handling.', steerLim: 1, steerRate: 8, throttleExp: 1, engine: 1, brake: 1, grip: 1, side: 1, softGrip: 1, softDrag: 1, stiff: 1, travel: 1, damp: 1, lean: 1, assist: 1, yawCap: 1.1, stability: 0 },
  offroad: { id: 'offroad', label: 'OFF-ROAD', desc: 'Soft long-travel suspension, gentle throttle, extra grip and less drag in mud and sand.', steerLim: 1.05, steerRate: 6, throttleExp: 1.5, engine: 0.95, brake: 0.9, grip: 0.95, side: 0.95, softGrip: 1.3, softDrag: 0.75, stiff: 0.75, travel: 1.25, damp: 0.85, lean: 1.35, assist: 0.6, yawCap: 1.0, stability: 0 },
  sim: { id: 'sim', label: 'SIMULATION', desc: 'Slower steering, less grip, weaker brakes, minimal assists, more weight transfer.', steerLim: 0.85, steerRate: 4, throttleExp: 1.25, engine: 0.9, brake: 0.8, grip: 0.82, side: 0.82, softGrip: 0.9, softDrag: 1.1, stiff: 1.05, travel: 1, damp: 1, lean: 1.6, assist: 0.15, yawCap: 1.6, stability: 0 },
  arcade: { id: 'arcade', label: 'ARCADE', desc: 'Quick steering, strong brakes and grip, big assists, stiff and stable.', steerLim: 1.15, steerRate: 12, throttleExp: 0.75, engine: 1.2, brake: 1.4, grip: 1.25, side: 1.2, softGrip: 1.2, softDrag: 0.85, stiff: 1.2, travel: 0.9, damp: 1.2, lean: 0.6, assist: 1.9, yawCap: 1.25, stability: 0.6 },
};
export const PROFILE_ORDER: ProfileId[] = ['pro', 'offroad', 'sim', 'arcade'];
