import { MISSIONS, missionById as baseById, type MissionDef, type Gate } from './missions';
import { L1_PTS, L1_FINISH as L1F } from './terrain';

/**
 * 10-level career (rework). Each level is a mission with its own id (own best time / completion), weather and rules.
 * Status is honest:
 *  - 'playable'   built and tested end to end for this level
 *  - 'prototype'  playable, but reuses an existing mission route; the level's full design is not built yet
 *  - 'online'     needs the multiplayer server to be hosted (cannot be played solo)
 *  - 'planned'    not built yet (locked in the UI, never presented as finished)
 */
export type LevelStatus = 'playable' | 'prototype' | 'online' | 'planned';
export interface LevelDef {
  n: number; id: string; title: string; objective: string; difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Extreme';
  status: LevelStatus; missionId: string | null; note?: string; unlock?: string;
}

const yawOf = (dx: number, dz: number) => Math.atan2(dx, dz);
function gatesFrom(pts: [number, number][], w: number): Gate[] {
  return pts.map(([x, z], i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; return { x, z, yaw: yawOf(b[0] - a[0], b[1] - a[1]), w }; });
}
const clone = (id: string, o: Partial<MissionDef>): MissionDef => ({ ...baseById(id)!, ...o });

// ---- Level 1: Desert Training — wide, gentle sand trail from base camp into the desert apron, coaching tips on the way
export const L1_ROUTE: [number, number][] = L1_PTS;
const L1_START = { x: 0, z: -8, yaw: yawOf(14, -6) };
const L1_FINISH = L1F;
const L1: MissionDef = {
  id: 'lv1-desert-training', mode: 'race', type: 'trail', title: 'Desert Training',
  desc: 'Learn the basics on an easy sand trail: drive through the 13 flag gates and stop inside the finish circle.',
  start: L1_START, gates: gatesFrom(L1_ROUTE, 16), limit: 90, zone: L1_FINISH, weather: 'clear',
  path: [{ x: L1_START.x, z: L1_START.z }, ...L1_ROUTE.map(([x, z]) => ({ x, z })), { x: L1_FINISH.x, z: L1_FINISH.z }],
  // targets: clean test bot 17.07 s on the Scout -> gold x1.2, silver x1.5, bronze x2 (tests/rework-block.mjs re-measures)
  targets: { gold: 20.5, silver: 25.5, bronze: 34 }, reward: 200,
  tips: {
    [-1]: 'Accelerate and steer through the flag gates',
    0: 'Good! Follow the flags towards the desert',
    1: 'Soft sand ahead — keep your momentum',
    2: 'Feather the throttle if the wheels start to spin',
    3: 'Dunes slow you down: take the gentle line',
    4: 'Brake early (S / ↓ or left half) before the turns',
    6: 'Into the dune field — climb straight, not across the slope',
    8: 'Use the handbrake (Space / HB) for a tight turn',
    10: 'Halfway — keep a steady line',
    11: 'Almost there — the finish flag is past the last gate',
    12: 'Now stop inside the finish circle',
  },
};

// ---- Level 2: Sand Dune Challenge — the 2-lap Dune Loop race at sunset with a time limit
const L2 = clone('race-loop', { id: 'lv2-dune-challenge', title: 'Sand Dune Challenge', weather: 'sunset', limit: 120,
  desc: 'Two laps through the dunes at sunset. 16 checkpoints, wrong-way and missed-gate warnings, 2:00 limit.',
  tips: { [-1]: 'Two laps — hit every checkpoint in order' }, reward: 360 });
// ---- Level 3: Mud Jungle (prototype) — Mud Crossing route in dense fog, resets allowed (3), fail if stuck 15 s
const L3 = clone('ch-mud', { id: 'lv3-mud-jungle', title: 'Mud Jungle', weather: 'fog', limit: 45, noReset: false, maxResets: 3, stuckFail: 15,
  desc: 'Cross the jungle mud basin in thick fog. Puddles and deep mud: keep moving — stuck for 15 s fails the run. 3 recoveries.',
  tips: { [-1]: 'Fog ahead — follow the gate lights. Keep moving in the mud!' }, reward: 380 });
// ---- Level 4: Rocky Mountain (prototype) — Ridge Climb switchbacks, 3 recoveries
const L4 = clone('ch-climb', { id: 'lv4-rocky-mountain', title: 'Rocky Mountain', maxResets: 3, reward: 450,
  tips: { [-1]: 'Steep loose rock: low speed, steady throttle. Do not roll over.' } });
// ---- Level 5: Night Expedition (prototype) — Canyon Dash navigation at night with headlights, 2:30 limit
const L5 = clone('race-dash', { id: 'lv5-night-expedition', title: 'Night Expedition', weather: 'night', limit: 150, maxResets: 5, reward: 500,
  desc: 'Navigate 13 checkpoints across the desert and canyon rim at night by headlight and the HUD arrow.',
  tips: { [-1]: 'Night run: follow the arrow and the amber gate lights' } });

export const LEVEL_MISSIONS: MissionDef[] = [L1, L2, L3, L4, L5];
export const missionById = (id: string) => baseById(id) ?? LEVEL_MISSIONS.find((m) => m.id === id);
export const allMissions = () => [...MISSIONS, ...LEVEL_MISSIONS];

export const LEVELS: LevelDef[] = [
  { n: 1, id: 'L1', title: 'Desert Training', difficulty: 'Easy', status: 'playable', missionId: L1.id, objective: 'Follow the flag trail into the desert and stop in the finish circle.', unlock: 'Unlocks Level 2' },
  { n: 2, id: 'L2', title: 'Sand Dune Challenge', difficulty: 'Easy', status: 'playable', missionId: L2.id, objective: 'Two laps of the dunes at sunset within 2:00.', unlock: 'Unlocks Level 3' },
  { n: 3, id: 'L3', title: 'Mud Jungle', difficulty: 'Medium', status: 'prototype', missionId: L3.id, objective: 'Cross the jungle mud basin in fog without getting stuck.', note: 'Prototype: uses the Mud Crossing route; a longer jungle trail is planned.' },
  { n: 4, id: 'L4', title: 'Rocky Mountain', difficulty: 'Medium', status: 'prototype', missionId: L4.id, objective: 'Climb the switchback trail to the summit without rolling over.', note: 'Prototype: uses the Ridge Climb route.' },
  { n: 5, id: 'L5', title: 'Night Expedition', difficulty: 'Hard', status: 'prototype', missionId: L5.id, objective: 'Navigate 13 checkpoints at night by headlight.', note: 'Prototype: uses the Canyon Dash route at night.' },
  { n: 6, id: 'L6', title: 'River Crossing', difficulty: 'Hard', status: 'planned', missionId: null, objective: 'Ford a river with slippery banks and recover the vehicle.', note: 'Not built yet: needs a river with water physics and banks.' },
  { n: 7, id: 'L7', title: 'Extreme Off-Road', difficulty: 'Expert', status: 'planned', missionId: null, objective: 'Mixed terrain, changing weather, limited recoveries.', note: 'Not built yet.' },
  { n: 8, id: 'L8', title: 'Online Convoy Expedition', difficulty: 'Medium', status: 'online', missionId: null, objective: 'Drive a convoy route together with other players.', note: 'Needs the online server to be hosted.' },
  { n: 9, id: 'L9', title: 'Competitive Off-Road Race', difficulty: 'Hard', status: 'online', missionId: null, objective: 'Race other players: positions and leaderboard.', note: 'Needs the online server to be hosted.' },
  { n: 10, id: 'L10', title: 'Ultimate Expedition', difficulty: 'Extreme', status: 'planned', missionId: null, objective: 'A long expedition across a large combined map.', note: 'Not built yet: needs the larger map.' },
];
/** a level counts as complete when its mission has a successful best time */
export const levelDone = (best: Record<string, unknown>, L: LevelDef) => !!(L.missionId && best[L.missionId]);
/** level n is unlocked when every earlier solo level is complete (online levels don't block solo progress) */
export function levelUnlocked(best: Record<string, unknown>, L: LevelDef, dev = false) {
  if (dev || L.n === 1) return true;
  if (L.status === 'planned') return false;
  return LEVELS.filter((x) => x.n < L.n && x.status !== 'online' && x.status !== 'planned').every((x) => levelDone(best, x));
}
export const levelOfMission = (id: string) => LEVELS.find((l) => l.missionId === id) ?? null;
