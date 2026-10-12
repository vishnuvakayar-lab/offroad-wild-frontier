import type { DriveInput } from './vehicle';

/** Mobile control schemes:
 *  - wheel:   cockpit HUD (default) - virtual steering wheel bottom-left (drag to turn, self-centres) + accelerator / brake pedals bottom-right
 *  - buttons: ◀ ▶ steering buttons + the same pedals
 *  - tilt:    steer by tilting the phone (DeviceOrientation, iOS permission asked only when chosen) + pedals (optional auto-throttle)
 *  - halves:  hold the left / right half of the screen to steer; the car drives forward by itself; hold both = brake/reverse
 *  Pedals are progressive (ramp while held, release = 0). Brake always wins: any brake input cuts the throttle. Keyboard always works too. */
export type ControlScheme = 'wheel' | 'buttons' | 'tilt' | 'halves';
export const PEDAL = { gas0: 0.3, gasRamp: 0.5, brake0: 0.4, brakeRamp: 0.25 }; // initial value on press, seconds to reach 1
export type TiltState = 'off' | 'pending' | 'granted' | 'denied' | 'unsupported' | 'no-data';

export class Input {
  private keys = new Set<string>();
  private touch = { left: false, right: false, gas: false, brake: false, hand: false };
  private zones = new Map<string, 'L' | 'R'>();
  private steerSmooth = 0;
  /** progressive pedal values (0..1) */
  gasV = 0; brakeV = 0;
  // ---- virtual steering wheel ----
  wheelDeg = 0;             // current wheel rotation (deg, + = clockwise = steer right)
  wheelLock = 120;          // wheel degrees for full lock at sensitivity 1
  wheelSens = 1;            // Settings: 0.6 .. 1.6
  wheelHeld = false;
  onWheel: (deg: number) => void = () => {};
  override: DriveInput | null = null; // used by automated tests
  onPause: () => void = () => {};
  onReset: () => void = () => {};
  onKey: (code: string) => boolean = () => false; // return true to swallow the key
  /** touch-scheme settings (set by the game from Settings) */
  scheme: ControlScheme = 'halves';
  autoThrottle = false;
  /** true while the touch UI is shown (playing on a touch device) */
  touchActive = false;
  // ---- tilt ----
  tiltState: TiltState = 'off';
  tiltRange = 24;           // degrees of tilt for full lock
  private tiltRaw: number | null = null;
  private tiltZero = 0;
  tiltEvents = 0;
  /** first sensor sample after a fallback (game switches back to tilt) */
  onTiltData: () => void = () => {};
  private onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    if (this.tiltEvents++ === 0) this.onTiltData();
    if (this.tiltState === 'no-data' || this.tiltState === 'pending') this.tiltState = 'granted';
    const ang = (screen.orientation?.angle ?? (window as any).orientation ?? 0) as number;
    // positive = steer left. Portrait: tilt left (left edge down) => gamma < 0. Landscape: roll is beta, sign by orientation.
    const a = ((ang % 360) + 360) % 360;
    this.tiltRaw = a === 90 ? -e.beta : a === 270 ? e.beta : a === 180 ? e.gamma : -e.gamma;
  };

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!e.repeat && this.onKey(e.code)) { e.preventDefault(); return; }
      if (e.code === 'Escape' || e.code === 'KeyP') { this.onPause(); return; }
      if (e.code === 'KeyR' && !e.repeat) this.onReset();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.clearTouch(); });
  }

  clearTouch() { for (const k of Object.keys(this.touch) as (keyof typeof this.touch)[]) this.touch[k] = false; this.zones.clear(); }

  /**
   * Bind a multi-touch-safe hold button. iOS Safari: native touchstart/touchend/touchcancel listeners ({passive:false},
   * preventDefault, per-finger identifiers) are the primary path; pointer events are kept for mouse/pen and as a second
   * source. Each source is keyed separately ('t'+identifier / 'p'+pointerId) so a stray pointercancel / lostpointercapture
   * (which iOS can fire for a held finger) never releases a button that a finger is still holding; touchend with no finger
   * left on the button clears it completely, so nothing can stay stuck.
   */
  bindHold(el: HTMLElement, key: keyof Input['touch']) {
    const active = new Set<string>();
    const set = () => { this.touch[key] = active.size > 0; el.classList.toggle('active', active.size > 0); };
    const opt = { passive: false } as AddEventListenerOptions;
    el.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); for (const t of e.changedTouches) active.add('t' + t.identifier); set(); }, opt);
    const tEnd = (e: TouchEvent) => { e.preventDefault(); for (const t of e.changedTouches) active.delete('t' + t.identifier); if (e.targetTouches.length === 0) active.clear(); set(); };
    el.addEventListener('touchend', tEnd, opt); el.addEventListener('touchcancel', tEnd, opt);
    el.addEventListener('touchmove', (e) => e.preventDefault(), opt);
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); active.add('p' + e.pointerId); try { el.setPointerCapture(e.pointerId); } catch { /* */ } set(); });
    const up = (e: PointerEvent) => { active.delete('p' + e.pointerId); set(); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Full-screen touch layer for the tilt / halves schemes: each finger counts for the half it went down on (touch + pointer, as bindHold). */
  bindZones(el: HTMLElement, onChange: (l: boolean, r: boolean) => void) {
    const emit = () => { const v = [...this.zones.values()]; onChange(v.includes('L'), v.includes('R')); };
    const side = (x: number) => { const r = el.getBoundingClientRect(); return x - r.left < r.width / 2 ? 'L' : 'R'; };
    const opt = { passive: false } as AddEventListenerOptions;
    el.addEventListener('touchstart', (e) => { if ((e.target as HTMLElement).closest('button')) return; e.preventDefault(); for (const t of e.changedTouches) this.zones.set('t' + t.identifier, side(t.clientX)); emit(); }, opt);
    const tEnd = (e: TouchEvent) => { for (const t of e.changedTouches) this.zones.delete('t' + t.identifier); if (e.targetTouches.length === 0) for (const k of [...this.zones.keys()]) if (k[0] === 'p') this.zones.delete(k); emit(); };
    el.addEventListener('touchend', tEnd, opt); el.addEventListener('touchcancel', tEnd, opt);
    el.addEventListener('touchmove', (e) => e.preventDefault(), opt);
    el.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      this.zones.set('p' + e.pointerId, side(e.clientX));
      try { el.setPointerCapture(e.pointerId); } catch { /* */ }
      emit();
    });
    const up = (e: PointerEvent) => { if (this.zones.delete('p' + e.pointerId)) emit(); };
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) el.addEventListener(ev, up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Virtual steering wheel: drag around the centre to turn (continuous, multi-touch safe); releases self-centre in read(). */
  bindWheel(el: HTMLElement) {
    let id: number | null = null, lastA = 0;
    const ang = (e: PointerEvent) => { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation(); if (id !== null) return;
      id = e.pointerId; lastA = ang(e); this.wheelHeld = true; el.classList.add('active');
      try { el.setPointerCapture(e.pointerId); } catch { /* */ }
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const a = ang(e); let d = a - lastA; d = ((d + 540) % 360) - 180; lastA = a;
      const lim = this.wheelLock / this.wheelSens;
      this.wheelDeg = Math.max(-lim, Math.min(lim, this.wheelDeg + d)); this.onWheel(this.wheelDeg);
    });
    const up = (e: PointerEvent) => { if (e.pointerId !== id) return; id = null; this.wheelHeld = false; el.classList.remove('active'); };
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) el.addEventListener(ev, up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  get wheelValue() { return Math.max(-1, Math.min(1, -this.wheelDeg / (this.wheelLock / this.wheelSens))); } // + = steer left

  /** Must be called from inside a user gesture (tap/click): iOS Safari 13+ only grants motion access that way. */
  requestTilt(): Promise<TiltState> {
    const DOE = (window as any).DeviceOrientationEvent;
    if (!DOE) { this.tiltState = 'unsupported'; return Promise.resolve(this.tiltState); }
    const attach = () => { window.removeEventListener('deviceorientation', this.onOrient); window.addEventListener('deviceorientation', this.onOrient); };
    if (typeof DOE.requestPermission === 'function') {
      this.tiltState = 'pending';
      return (DOE.requestPermission() as Promise<string>).then((r) => {
        if (r === 'granted') { attach(); this.tiltState = this.tiltEvents ? 'granted' : 'no-data'; } else this.tiltState = 'denied';
        return this.tiltState;
      }).catch(() => (this.tiltState = 'denied'));
    }
    attach();
    if (this.tiltState !== 'granted') this.tiltState = this.tiltEvents ? 'granted' : 'no-data';
    return Promise.resolve(this.tiltState);
  }
  /** current phone angle becomes "straight ahead" */
  calibrateTilt() { if (this.tiltRaw !== null) this.tiltZero = this.tiltRaw; }
  get tiltValue() {
    if (this.tiltRaw === null) return 0;
    let d = this.tiltRaw - this.tiltZero; d = ((d + 180) % 360 + 360) % 360 - 180;
    const dz = 2.5; if (Math.abs(d) < dz) return 0;
    return Math.max(-1, Math.min(1, (d - Math.sign(d) * dz) / (this.tiltRange - dz)));
  }

  read(dt: number): DriveInput {
    if (this.override) return this.override;
    const k = this.keys, t = this.touch;
    const zv = [...this.zones.values()], zl = zv.includes('L'), zr = zv.includes('R');
    const kUp = k.has('KeyW') || k.has('ArrowUp'), kDown = k.has('KeyS') || k.has('ArrowDown');
    const kLeft = k.has('KeyA') || k.has('ArrowLeft'), kRight = k.has('KeyD') || k.has('ArrowRight');
    let thr = kUp ? 1 : 0, brk = kDown ? 1 : 0, left = kLeft, right = kRight, analog: number | null = null;
    // self-centring wheel when released (also when the wheel UI is hidden)
    if (!this.wheelHeld && this.wheelDeg !== 0) {
      const back = 420 * dt; this.wheelDeg = Math.abs(this.wheelDeg) <= back ? 0 : this.wheelDeg - Math.sign(this.wheelDeg) * back; this.onWheel(this.wheelDeg);
    }
    if (this.touchActive) {
      const pedals = this.scheme !== 'halves';
      if (pedals) { // progressive pedals: start value on press, ramp to 1 while held, instant release
        this.gasV = t.gas ? Math.min(1, Math.max(PEDAL.gas0, this.gasV + dt / PEDAL.gasRamp)) : 0;
        this.brakeV = t.brake ? Math.min(1, Math.max(PEDAL.brake0, this.brakeV + dt / PEDAL.brakeRamp)) : 0;
        thr = Math.max(thr, this.gasV); brk = Math.max(brk, this.brakeV);
      }
      if (this.scheme === 'halves') {
        const both = zl && zr;
        left ||= zl && !zr; right ||= zr && !zl;
        if (both || t.brake) brk = 1;
        if (brk === 0) thr = 1; // drives forward by itself
      } else if (this.scheme === 'wheel') {
        if (!kLeft && !kRight) analog = this.wheelValue;
      } else if (this.scheme === 'buttons') {
        left ||= t.left; right ||= t.right;
      } else { // tilt
        if (!kLeft && !kRight) analog = this.tiltValue;
        if (zr) thr = Math.max(thr, 1); if (zl) brk = Math.max(brk, 1);
        if (this.autoThrottle && brk === 0) thr = Math.max(thr, 1);
      }
    }
    if (brk > 0.05) thr = 0; // brake wins: never full throttle and brake together
    const target = analog ?? ((left ? 1 : 0) - (right ? 1 : 0)); // +1 = steer left
    const rate = analog !== null ? 10 : target === 0 ? 6 : 3.5;
    this.steerSmooth += Math.max(-rate * dt, Math.min(rate * dt, target - this.steerSmooth));
    return { throttle: thr, brake: brk, steer: this.steerSmooth, handbrake: k.has('Space') || t.hand };
  }
}
