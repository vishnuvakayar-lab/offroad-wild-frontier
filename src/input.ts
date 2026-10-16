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

export type Action = 'up' | 'down' | 'left' | 'right' | 'hand' | 'camera' | 'reset' | 'lookback' | 'camreset' | 'pause';
export const ACTION_LABEL: Record<Action, string> = { up: 'Accelerate', down: 'Brake / reverse', left: 'Steer left', right: 'Steer right', hand: 'Handbrake', camera: 'Next camera', reset: 'Reset vehicle', lookback: 'Look back (hold)', camreset: 'Reset camera', pause: 'Pause' };
export const DEFAULT_BINDINGS: Record<Action, string[]> = { up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], hand: ['Space'], camera: ['KeyC'], reset: ['KeyR'], lookback: ['KeyB'], camreset: ['KeyV'], pause: ['Escape', 'KeyP'] };
const BIND_KEY = 'owf.bindings.v1';
export type Device = 'keys' | 'touch' | 'pad';
/** Gamepad (standard mapping): left stick X = steer, RT = gas, LT = brake/reverse, A = handbrake, Y = camera, X = reset,
 *  RB = look back (hold), Back/View = reset camera, Start/Menu = pause. Menus: D-pad / stick to move, A = select, B = back. */
export const PAD = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };

export interface WheelState { wheelDeg: number; wheelHeld: boolean; wheelLock: number; wheelSens: number; }

export class Input {
  private keys = new Set<string>();
  private touch = { left: false, right: false, gas: false, brake: false, hand: false };
  /** local split-screen: P1 = WASD + Space (+ the normal touch controls), P2 = arrow keys + Right Shift / Enter (+ the P2 touch set) */
  split = false;
  p2touch = { left: false, right: false, gas: false, brake: false, hand: false };
  private p2Steer = 0; p2Gas = 0; p2Brake = 0;
  p2wheel: WheelState = { wheelDeg: 0, wheelHeld: false, wheelLock: 450, wheelSens: 1 };
  onWheel2: (deg: number) => void = () => {};
  override2: DriveInput | null = null; // tests
  private zones = new Map<string, 'L' | 'R'>();
  private steerSmooth = 0;
  /** progressive pedal values (0..1) */
  gasV = 0; brakeV = 0;
  // ---- virtual steering wheel ----
  wheelDeg = 0;             // current wheel rotation (deg, + = clockwise = steer right)
  wheelLock = 450;          // wheel degrees for full lock at sensitivity 1 (matches the 3D cockpit wheel)
  wheelSens = 1;            // Settings: 0.6 .. 1.6
  wheelHeld = false;
  onWheel: (deg: number) => void = () => {};
  override: DriveInput | null = null; // used by automated tests
  onPause: () => void = () => {};
  onReset: () => void = () => {};
  onKey: (code: string) => boolean = () => false; // return true to swallow the key
  /** configurable key bindings (Settings > Controls), persisted */
  bindings: Record<Action, string[]> = Input.loadBindings();
  static loadBindings(): Record<Action, string[]> { try { return { ...DEFAULT_BINDINGS, ...JSON.parse(localStorage.getItem(BIND_KEY) || '{}') }; } catch { return { ...DEFAULT_BINDINGS }; } }
  setBinding(a: Action, codes: string[]) { this.bindings[a] = codes; try { localStorage.setItem(BIND_KEY, JSON.stringify(this.bindings)); } catch { /* */ } }
  resetBindings() { this.bindings = { ...DEFAULT_BINDINGS }; try { localStorage.removeItem(BIND_KEY); } catch { /* */ } }
  isBound(a: Action, code: string) { return this.bindings[a].includes(code); }
  /** while set, the next key press is captured for rebinding instead of driving */
  capture: ((code: string) => void) | null = null;
  /** most recently active input device: only that device drives (no summing / conflicts) */
  lastDevice: Device = 'keys';
  // ---- gamepad ----
  padDeadzone = 0.12; padSens = 1; padIndex = -1; padName = '';
  private padPrev: boolean[] = []; private padNow: boolean[] = []; private padAxes: number[] = []; private padVals: number[] = [];
  onPadAction: (a: Action) => void = () => {};
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
    if (this.scheme === 'tilt' && this.lastDevice !== 'touch' && this.tiltRaw !== null && Math.abs(this.tiltValue) > 0.15) this.lastDevice = 'touch';
    if (this.tiltState === 'no-data' || this.tiltState === 'pending') this.tiltState = 'granted';
    const ang = (screen.orientation?.angle ?? (window as any).orientation ?? 0) as number;
    // positive = steer left. Portrait: tilt left (left edge down) => gamma < 0. Landscape: roll is beta, sign by orientation.
    const a = ((ang % 360) + 360) % 360;
    this.tiltRaw = a === 90 ? -e.beta : a === 270 ? e.beta : a === 180 ? e.gamma : -e.gamma;
  };

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (this.capture) { e.preventDefault(); const c = this.capture; this.capture = null; c(e.code); return; }
      this.lastDevice = 'keys';
      if (!e.repeat && this.onKey(e.code)) { e.preventDefault(); return; }
      if (this.isBound('pause', e.code)) { this.onPause(); return; }
      if (this.isBound('reset', e.code) && !e.repeat) this.onReset();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.clearTouch(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { this.keys.clear(); this.clearTouch(); } });
  }

  /** release callbacks of every bound control (held buttons / wheels): blur, visibilitychange, phase changes */
  private releasers: (() => void)[] = [];
  clearTouch() { for (const r of this.releasers) r(); for (const k of Object.keys(this.touch) as (keyof typeof this.touch)[]) { this.touch[k] = false; this.p2touch[k] = false; } this.zones.clear(); }

  /**
   * Bind a multi-touch-safe hold button. iOS Safari: native touchstart/touchend/touchcancel listeners ({passive:false},
   * preventDefault, per-finger identifiers) are the primary path; pointer events are kept for mouse/pen and as a second
   * source. Each source is keyed separately ('t'+identifier / 'p'+pointerId) so a stray pointercancel / lostpointercapture
   * (which iOS can fire for a held finger) never releases a button that a finger is still holding; touchend with no finger
   * left on the button clears it completely, so nothing can stay stuck.
   */
  bindHold(el: HTMLElement, key: keyof Input['touch'], target: Input['touch'] = this.touch) {
    const active = new Set<string>();
    const set = () => { target[key] = active.size > 0; el.classList.toggle('active', active.size > 0); if (active.size) this.lastDevice = 'touch'; };
    this.releasers.push(() => { active.clear(); set(); });
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
    const emit = () => { const v = [...this.zones.values()]; if (v.length) this.lastDevice = 'touch'; onChange(v.includes('L'), v.includes('R')); };
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

  /** Virtual steering wheel: drag the finger AROUND the wheel centre; the change of finger angle turns the wheel (accumulates,
   *  so you can wind past 180°) up to the lock (±450° at sensitivity 1). iOS Safari: native touchstart/touchmove/touchend with
   *  {passive:false} + preventDefault (no scroll / zoom / callout), tracked by touch identifier so the GAS finger never disturbs it.
   *  Pointer events are used only for mouse / pen (touch pointers are ignored to avoid double input). Self-centres in read(). */
  bindWheel(el: HTMLElement, st: WheelState = this, onTurn: (deg: number) => void = (d) => this.onWheel(d)) {
    let tid: number | null = null, pid: number | null = null, lastA = 0;
    const ang = (x: number, y: number) => { const r = el.getBoundingClientRect(); return Math.atan2(y - (r.top + r.height / 2), x - (r.left + r.width / 2)) * 180 / Math.PI; };
    const start = (x: number, y: number) => { lastA = ang(x, y); st.wheelHeld = true; el.classList.add('active'); this.lastDevice = 'touch'; };
    const move = (x: number, y: number) => {
      const r = el.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
      if (dx * dx + dy * dy < (r.width * 0.08) ** 2) return; // too close to the centre: angle is unstable
      const a = ang(x, y); let d = a - lastA; d = ((d + 540) % 360) - 180; lastA = a;
      const lim = st.wheelLock / st.wheelSens;
      st.wheelDeg = Math.max(-lim, Math.min(lim, st.wheelDeg + d)); onTurn(st.wheelDeg);
    };
    const end = () => { st.wheelHeld = false; el.classList.remove('active'); };
    this.releasers.push(() => { tid = null; pid = null; end(); });
    const opt = { passive: false } as AddEventListenerOptions;
    el.addEventListener('touchstart', (e) => {
      e.preventDefault(); e.stopPropagation(); if (tid !== null) return;
      const t = e.changedTouches[0]; tid = t.identifier; start(t.clientX, t.clientY);
    }, opt);
    el.addEventListener('touchmove', (e) => { e.preventDefault(); for (const t of e.changedTouches) if (t.identifier === tid) move(t.clientX, t.clientY); }, opt);
    const tEnd = (e: TouchEvent) => { e.preventDefault(); for (const t of e.changedTouches) if (t.identifier === tid) { tid = null; end(); } if (e.targetTouches.length === 0 && tid !== null && ![...e.touches].some((t) => t.identifier === tid)) { tid = null; end(); } };
    el.addEventListener('touchend', tEnd, opt); el.addEventListener('touchcancel', tEnd, opt);
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; e.preventDefault(); e.stopPropagation(); if (pid !== null) return;
      pid = e.pointerId; start(e.clientX, e.clientY); try { el.setPointerCapture(e.pointerId); } catch { /* */ }
    });
    el.addEventListener('pointermove', (e) => { if (e.pointerId === pid) move(e.clientX, e.clientY); });
    const up = (e: PointerEvent) => { if (e.pointerId !== pid) return; pid = null; end(); };
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) el.addEventListener(ev, up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  /** + = steer left; small deadzone around centre, then proportional */
  static wheelOut(st: WheelState) {
    const v = -st.wheelDeg / (st.wheelLock / st.wheelSens), dz = 0.03;
    return Math.abs(v) < dz ? 0 : Math.max(-1, Math.min(1, (v - Math.sign(v) * dz) / (1 - dz)));
  }
  get wheelValue() { return Input.wheelOut(this); }
  /** smooth self-centring when released: fast far from centre, gentle near it */
  static recentre(st: WheelState, dt: number, onTurn: (d: number) => void) {
    if (st.wheelHeld || st.wheelDeg === 0) return;
    const back = Math.max(240 * dt, Math.abs(st.wheelDeg) * 7 * dt);
    st.wheelDeg = Math.abs(st.wheelDeg) <= back ? 0 : st.wheelDeg - Math.sign(st.wheelDeg) * back; onTurn(st.wheelDeg);
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

  /** Poll the Gamepad API (standard mapping). Returns true if a pad is connected. Edge-triggered actions go to onPadAction. */
  private padAt = -1e9; private padOn = false;
  pollPad(): boolean {
    const now = performance.now(); if (now - this.padAt < 4) return this.padOn; // once per frame: menus + driving share the same edges
    this.padAt = now; this.padOn = this.pollPadNow(); return this.padOn;
  }
  private pollPadNow(): boolean {
    const pads = (navigator.getGamepads?.() ?? []) as (Gamepad | null)[];
    let gp: Gamepad | null = null;
    for (const p of pads) if (p && p.connected && (p.mapping === 'standard' || !gp)) { gp = p; if (p.mapping === 'standard') break; }
    if (!gp) { this.padIndex = -1; this.padName = ''; return false; }
    this.padIndex = gp.index; this.padName = gp.id;
    this.padPrev = this.padNow; this.padNow = gp.buttons.map((b) => b.pressed || b.value > 0.5); this.padVals = gp.buttons.map((b) => b.value);
    const prevAxes = this.padAxes; this.padAxes = gp.axes.slice();
    // the pad becomes the active device only when it CHANGES (button edge or stick moved), so a resting / drifting pad never steals from keys or touch
    const dz = this.padDeadzone;
    const changed = this.padNow.some((b, i) => b !== !!this.padPrev[i]) || this.padAxes.some((a, i) => Math.abs(a - (prevAxes[i] ?? 0)) > 0.2 && Math.abs(a) > dz);
    if (changed) this.lastDevice = 'pad';
    return true;
  }
  /** pad button went down this poll */
  padPressed(i: number) { return !!this.padNow[i] && !this.padPrev[i]; }
  padHeld(i: number) { return !!this.padNow[i]; }
  padAxis(i: number) { const v = this.padAxes[i] ?? 0, dz = this.padDeadzone; return Math.abs(v) < dz ? 0 : Math.sign(v) * Math.min(1, ((Math.abs(v) - dz) / (1 - dz)) * this.padSens); }
  /** rumble via vibrationActuator where supported (Chrome / Edge / Android); silently ignored elsewhere */
  rumble(strength: number, ms = 120) {
    if (this.padIndex < 0) return; const gp = navigator.getGamepads?.()[this.padIndex] as any;
    try { gp?.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strength), weakMagnitude: Math.min(1, strength * 0.6) }); } catch { /* unsupported */ }
  }
  private held(a: Action, noArrows: boolean) { return this.bindings[a].some((c) => this.keys.has(c) && !(noArrows && c.startsWith('Arrow'))); }

  read(dt: number): DriveInput {
    if (this.override) return this.override;
    const t = this.touch;
    if (this.pollPad()) for (const [b, a] of [[PAD.Y, 'camera'], [PAD.X, 'reset'], [PAD.BACK, 'camreset'], [PAD.START, 'pause']] as const) if (this.padPressed(b)) this.onPadAction(a);
    const zv = [...this.zones.values()], zl = zv.includes('L'), zr = zv.includes('R');
    const na = this.split; // in split-screen the arrow keys belong to player 2
    // keyboard only "owns" the car while a driving key is held; otherwise touch / tilt schemes (auto-throttle, halves) keep working
    const keyHeld = (['up', 'down', 'left', 'right', 'hand'] as Action[]).some((a) => this.held(a, na));
    const dev = this.lastDevice === 'keys' && !keyHeld && this.touchActive ? 'touch' : this.lastDevice;
    let thr = 0, brk = 0, left = false, right = false, analog: number | null = null, hand = false;
    // self-centring wheel when released (also when the wheel UI is hidden)
    Input.recentre(this, dt, (d) => this.onWheel(d));
    // progressive touch pedals keep their ramp state whatever device is active
    this.gasV = this.touchActive && t.gas ? Math.min(1, Math.max(PEDAL.gas0, this.gasV + dt / PEDAL.gasRamp)) : 0;
    this.brakeV = this.touchActive && t.brake ? Math.min(1, Math.max(PEDAL.brake0, this.brakeV + dt / PEDAL.brakeRamp)) : 0;
    if (dev === 'pad' && this.padIndex >= 0) {
      analog = -this.padAxis(0); // stick right = steer right (negative)
      thr = Math.max(this.padVals[PAD.RT] ?? 0, this.padAxis(1) < -0.5 ? 1 : 0); brk = Math.max(this.padVals[PAD.LT] ?? 0, this.padAxis(1) > 0.5 ? 1 : 0);
      if (thr < 0.05) thr = 0; if (brk < 0.05) brk = 0;
      hand = this.padHeld(PAD.A);
      if (this.padHeld(PAD.LEFT)) { analog = null; left = true; } if (this.padHeld(PAD.RIGHT)) { analog = null; right = true; }
    } else if (dev === 'touch' && this.touchActive) {
      hand = t.hand;
      if (this.scheme !== 'halves') { thr = this.gasV; brk = this.brakeV; }
      if (this.scheme === 'halves') {
        const both = zl && zr; left = zl && !zr; right = zr && !zl;
        if (both || t.brake) brk = 1;
        if (brk === 0) thr = 1; // drives forward by itself
      } else if (this.scheme === 'wheel') analog = this.wheelValue;
      else if (this.scheme === 'buttons') { left = t.left; right = t.right; }
      else { // tilt
        analog = this.tiltValue;
        if (zr) thr = Math.max(thr, 1); if (zl) brk = Math.max(brk, 1);
        if (this.autoThrottle && brk === 0) thr = Math.max(thr, 1);
      }
    } else { // keyboard (also the fallback when the active device has nothing connected)
      thr = this.held('up', na) ? 1 : 0; brk = this.held('down', na) ? 1 : 0; left = this.held('left', na); right = this.held('right', na); hand = this.held('hand', false);
      if (this.touchActive && this.scheme === 'wheel' && this.wheelDeg !== 0) analog = this.wheelValue; // wheel still turning back
    }
    if (brk > 0.05) thr = 0; // brake wins: never full throttle and brake together
    const target = analog ?? ((left ? 1 : 0) - (right ? 1 : 0)); // +1 = steer left
    const rate = analog !== null ? 10 : target === 0 ? 6 : 3.5;
    this.steerSmooth += Math.max(-rate * dt, Math.min(rate * dt, target - this.steerSmooth));
    return { throttle: thr, brake: brk, steer: this.steerSmooth, handbrake: hand };
  }

  /** Player 2 (split-screen): arrow keys / P2 touch buttons; progressive touch pedals like player 1; brake wins. */
  readP2(dt: number): DriveInput {
    if (this.override2) return this.override2;
    const k = this.keys, t = this.p2touch;
    this.p2Gas = t.gas ? Math.min(1, Math.max(PEDAL.gas0, this.p2Gas + dt / PEDAL.gasRamp)) : 0;
    this.p2Brake = t.brake ? Math.min(1, Math.max(PEDAL.brake0, this.p2Brake + dt / PEDAL.brakeRamp)) : 0;
    let thr = Math.max(k.has('ArrowUp') ? 1 : 0, this.p2Gas), brk = Math.max(k.has('ArrowDown') ? 1 : 0, this.p2Brake);
    if (brk > 0.05) thr = 0;
    Input.recentre(this.p2wheel, dt, (d) => this.onWheel2(d));
    const kb = ((k.has('ArrowLeft') || t.left) ? 1 : 0) - ((k.has('ArrowRight') || t.right) ? 1 : 0);
    const analog = kb === 0 && this.touchActive;
    const target = analog ? Input.wheelOut(this.p2wheel) : kb;
    const rate = analog ? 10 : target === 0 ? 6 : 3.5;
    this.p2Steer += Math.max(-rate * dt, Math.min(rate * dt, target - this.p2Steer));
    return { throttle: thr, brake: brk, steer: this.p2Steer, handbrake: k.has('ShiftRight') || k.has('Enter') || k.has('NumpadEnter') || t.hand };
  }
}
