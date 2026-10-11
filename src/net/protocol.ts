// Shared multiplayer protocol + simulation helpers (used by the browser client AND the Node server,
// so both run the exact same vehicle physics step).
import type RAPIER_NS from '@dimforge/rapier3d-compat';
import type { Vehicle, DriveInput } from '../vehicle';
import { VEHICLES, PAINTS } from '../vehicles';
import { heightAt, ZONES } from '../terrain';
import { missionById, type MissionDef, type Pose } from '../missions';

export const PROTO = 1;
export const STEP = 1 / 60;            // physics step (identical to single player)
export const TICK_HZ = 30;             // server simulation/network tick
export const SUBSTEPS = 2;             // physics steps per tick (30 Hz x 2 = 60 Hz physics)
export const MAX_PLAYERS = 8;
export const RECONNECT_GRACE_MS = 30_000;
export const MAX_INPUTS_PER_MSG = 40;  // ~0.66 s of 60 Hz inputs (lets a stalled tab catch up)
export type RoomMode = 'convoy' | 'race';
export type RoomState = 'free' | 'lobby' | 'countdown' | 'racing' | 'results';
export const IDLE_IN: DriveInput = { throttle: 0, brake: 0, steer: 0, handbrake: true };
export const RACE_DEF: MissionDef = missionById('race-dash')!;
export const RACE_COUNTDOWN = 3;
export const RACE_MAX_AFTER_FIRST = 60; // s: race ends this long after the first finisher (others DNF)
export const RACE_MAX_TIME = 240;

export interface PlayerInfo { id: number; name: string; vehicle: string; paint: number; away: boolean; ping: number; joinedAt: number }
export interface RacePlayer { id: number; next: number; time: number | null; place: number | null; dnf?: boolean }
export interface RoomInfo {
  id: string; code: string | null; mode: RoomMode; public: boolean; hostId: number; leaderId: number; state: RoomState;
  waypoint: { x: number; z: number; by: number } | null; players: PlayerInfo[];
  race: { startTick: number; players: RacePlayer[]; results: { id: number; name: string; time: number | null; place: number | null }[] | null } | null;
  max: number;
}

/** Inputs are validated + clamped server side; anything else in the message (positions, speeds...) is ignored. */
export function sanitizeInput(a: unknown): DriveInput | null {
  if (!Array.isArray(a) || a.length !== 4) return null;
  const [t, b, s, h] = a;
  if (typeof t !== 'number' || typeof b !== 'number' || typeof s !== 'number' || !Number.isFinite(t) || !Number.isFinite(b) || !Number.isFinite(s)) return null;
  return { throttle: Math.min(1, Math.max(0, t)), brake: Math.min(1, Math.max(0, b)), steer: Math.min(1, Math.max(-1, s)), handbrake: h === 1 || h === true };
}
export const packInput = (i: DriveInput) => [+i.throttle.toFixed(3), +i.brake.toFixed(3), +i.steer.toFixed(3), i.handbrake ? 1 : 0];
export function sanitizeName(n: unknown): string {
  const s = typeof n === 'string' ? n.replace(/[^\p{L}\p{N} _.\-]/gu, '').trim().slice(0, 16) : '';
  return s || 'Driver';
}
export const validVehicle = (id: unknown) => typeof id === 'string' && VEHICLES.some((v) => v.id === id) ? id : 'scout';
export const validPaint = (hex: unknown, vehicle: string) => typeof hex === 'number' && PAINTS.some((p) => p.hex === hex) ? hex : VEHICLES.find((v) => v.id === vehicle)!.defaultPaint;
/** short private-room code: 5 chars, no ambiguous letters/digits (0/O, 1/I/L) */
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const normCode = (c: unknown) => typeof c === 'string' ? c.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) : '';

/** spawn slots: convoy = staggered around the spawn area; race = 2-wide grid behind the first gate */
export function spawnPose(mode: RoomMode, slot: number): Pose {
  if (mode === 'race') {
    const s = RACE_DEF.start, fx = Math.sin(s.yaw), fz = Math.cos(s.yaw), rx = fz, rz = -fx;
    const row = Math.floor(slot / 2), side = slot % 2 === 0 ? -1 : 1;
    return { x: s.x + rx * side * 3.2 - fx * row * 7, z: s.z + rz * side * 3.2 - fz * row * 7, yaw: s.yaw };
  }
  const yaw = Math.atan2(ZONES.sand.x, ZONES.sand.z + 8), fx = Math.sin(yaw), fz = Math.cos(yaw), rx = fz, rz = -fx;
  const row = Math.floor(slot / 4), col = (slot % 4) - 1.5;
  return { x: rx * col * 5.5 - fx * row * 8, z: -8 + rz * col * 5.5 - fz * row * 8, yaw };
}
export const placeVehicle = (v: Vehicle, p: Pose) => v.reset(p.x, heightAt(p.x, p.z) + v.spawnLift, p.z, p.yaw);

/** Full rigid-body + steering state (what reconciliation needs). */
export interface CarState { p: [number, number, number]; q: [number, number, number, number]; lv: [number, number, number]; av: [number, number, number]; steer: number; susp: number[] }
export function readState(v: Vehicle): CarState {
  const t = v.body.translation(), r = v.body.rotation(), l = v.body.linvel(), a = v.body.angvel();
  return { p: [t.x, t.y, t.z], q: [r.x, r.y, r.z, r.w], lv: [l.x, l.y, l.z], av: [a.x, a.y, a.z], steer: v.steer, susp: v.suspLengths() };
}
export function writeState(v: Vehicle, s: CarState) {
  const b = v.body;
  b.setTranslation({ x: s.p[0], y: s.p[1], z: s.p[2] }, true); b.setRotation({ x: s.q[0], y: s.q[1], z: s.q[2], w: s.q[3] }, true);
  b.setLinvel({ x: s.lv[0], y: s.lv[1], z: s.lv[2] }, true); b.setAngvel({ x: s.av[0], y: s.av[1], z: s.av[2] }, true);
  v.steer = s.steer;
}

// ---- binary snapshot: [u8 1][u8 n][u16 0][u32 tick][u32 ack] + n x ([u8 id][u8 flags][u16 0] + 18 x f32) ----
export const SNAP = 1;
const REC = 4 + 18 * 4;
export interface SnapPlayer extends CarState { id: number; away: boolean }
export function encodeSnapshotBody(players: { id: number; away: boolean; s: CarState }[]): Uint8Array {
  const buf = new ArrayBuffer(players.length * REC), dv = new DataView(buf);
  players.forEach((pl, i) => {
    const o = i * REC, s = pl.s; dv.setUint8(o, pl.id); dv.setUint8(o + 1, pl.away ? 1 : 0);
    const f = [...s.p, ...s.q, ...s.lv, ...s.av, s.steer, ...s.susp];
    for (let k = 0; k < 18; k++) dv.setFloat32(o + 4 + k * 4, f[k], true);
  });
  return new Uint8Array(buf);
}
export function snapshotHeader(n: number, tick: number, ack: number): Uint8Array {
  const h = new ArrayBuffer(12), dv = new DataView(h);
  dv.setUint8(0, SNAP); dv.setUint8(1, n); dv.setUint32(4, tick, true); dv.setUint32(8, ack >>> 0, true);
  return new Uint8Array(h);
}
export function decodeSnapshot(buf: ArrayBuffer): { tick: number; ack: number; players: SnapPlayer[] } | null {
  const dv = new DataView(buf);
  if (buf.byteLength < 12 || dv.getUint8(0) !== SNAP) return null;
  const n = dv.getUint8(1), tick = dv.getUint32(4, true), ack = dv.getUint32(8, true), players: SnapPlayer[] = [];
  if (buf.byteLength < 12 + n * REC) return null;
  for (let i = 0; i < n; i++) {
    const o = 12 + i * REC, f: number[] = []; for (let k = 0; k < 18; k++) f.push(dv.getFloat32(o + 4 + k * 4, true));
    players.push({ id: dv.getUint8(o), away: (dv.getUint8(o + 1) & 1) === 1, p: [f[0], f[1], f[2]], q: [f[3], f[4], f[5], f[6]], lv: [f[7], f[8], f[9]], av: [f[10], f[11], f[12]], steer: f[13], susp: [f[14], f[15], f[16], f[17]] });
  }
  return { tick, ack, players };
}
export type { DriveInput };
export type RapierNS = typeof RAPIER_NS;
