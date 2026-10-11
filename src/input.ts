import type { DriveInput } from './vehicle';

/** Mobile control schemes (no on-screen wheel or pedals):
 *  - tilt:    steer by tilting the phone (DeviceOrientation); hold the right half of the screen = gas, left half = brake/reverse
 *  - halves:  hold the left / right half of the screen to steer; the car drives forward by itself; hold both = brake/reverse
 *  - buttons: classic compact on-screen buttons (◀ ▶ GAS BRAKE HB)
 *  Auto-throttle (tilt / buttons): the car accelerates on its own; braking overrides it. Keyboard always works too. */
export type ControlScheme = 'tilt' | 'halves' | 'buttons';
export type TiltState = 'off' | 'pending' | 'granted' | 'denied' | 'unsupported' | 'no-data';

export class Input {
  private keys = new Set<string>();
  private touch = { left: false, right: false, gas: false, brake: false, hand: false };
  private zones = new Map<number, 'L' | 'R'>();
  private steerSmooth = 0;
  override: DriveInput | null = null; // used by automated tests
  onPause: () => void = () => {};
  onReset: () => void = () => {};
  onKey: (code: string) => boolean = () => false; // return true to swallow the key
  /** touch-scheme settings (set by the game from Settings) */
  scheme: ControlScheme = 'buttons';
  autoThrottle = false;
  /** true while the touch UI is shown (playing on a touch device) */
  touchActive = false;
  // ---- tilt ----
  tiltState: TiltState = 'off';
  tiltRange = 24;           // degrees of tilt for full lock
  private tiltRaw: number | null = null;
  private tiltZero = 0;
  tiltEvents = 0;
  private onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    this.tiltEvents++;
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

  /** Bind a multi-touch-safe hold button (pointer events, capture, cancel handling). */
  bindHold(el: HTMLElement, key: keyof Input['touch']) {
    const active = new Set<number>();
    const set = () => { this.touch[key] = active.size > 0; el.classList.toggle('active', active.size > 0); };
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); active.add(e.pointerId); try { el.setPointerCapture(e.pointerId); } catch { /* */ } set(); });
    const up = (e: PointerEvent) => { active.delete(e.pointerId); set(); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** Full-screen touch layer for the tilt / halves schemes: each finger counts for the half it went down on. */
  bindZones(el: HTMLElement, onChange: (l: boolean, r: boolean) => void) {
    const emit = () => { const v = [...this.zones.values()]; onChange(v.includes('L'), v.includes('R')); };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      this.zones.set(e.pointerId, e.clientX - r.left < r.width / 2 ? 'L' : 'R');
      try { el.setPointerCapture(e.pointerId); } catch { /* */ }
      emit();
    });
    const up = (e: PointerEvent) => { if (this.zones.delete(e.pointerId)) emit(); };
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) el.addEventListener(ev, up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

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
    let up = kUp, down = kDown, left = kLeft, right = kRight, analog: number | null = null;
    if (this.touchActive) {
      if (this.scheme === 'buttons') {
        up ||= t.gas; down ||= t.brake; left ||= t.left; right ||= t.right;
        if (this.autoThrottle && !down) up = true;
      } else if (this.scheme === 'halves') {
        const both = zl && zr;
        left ||= zl && !zr; right ||= zr && !zl; down ||= both || t.brake;
        if (!down) up = true; // drives forward by itself
      } else { // tilt
        if (!kLeft && !kRight) analog = this.tiltValue;
        up ||= zr; down ||= zl || t.brake;
        if (this.autoThrottle && !down) up = true;
      }
    }
    const target = analog ?? ((left ? 1 : 0) - (right ? 1 : 0)); // +1 = steer left
    const rate = analog !== null ? 8 : target === 0 ? 6 : 3.5;
    this.steerSmooth += Math.max(-rate * dt, Math.min(rate * dt, target - this.steerSmooth));
    return { throttle: up ? 1 : 0, brake: down ? 1 : 0, steer: this.steerSmooth, handbrake: k.has('Space') || t.hand };
  }
}
