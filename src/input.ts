import type { DriveInput } from './vehicle';

/** Merges keyboard + on-screen touch controls into a DriveInput. */
export class Input {
  private keys = new Set<string>();
  private touch = { left: false, right: false, gas: false, brake: false, hand: false };
  private steerSmooth = 0;
  override: DriveInput | null = null; // used by automated tests
  onPause: () => void = () => {};
  onReset: () => void = () => {};
  onKey: (code: string) => boolean = () => false; // return true to swallow the key

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

  clearTouch() { for (const k of Object.keys(this.touch) as (keyof typeof this.touch)[]) this.touch[k] = false; }

  /** Bind a multi-touch-safe hold button (pointer events, capture, cancel handling). */
  bindHold(el: HTMLElement, key: keyof Input['touch']) {
    const active = new Set<number>();
    const set = () => { this.touch[key] = active.size > 0; el.classList.toggle('active', active.size > 0); };
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); active.add(e.pointerId); try { el.setPointerCapture(e.pointerId); } catch { /* */ } set(); });
    const up = (e: PointerEvent) => { active.delete(e.pointerId); set(); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  read(dt: number): DriveInput {
    if (this.override) return this.override;
    const k = this.keys, t = this.touch;
    const up = k.has('KeyW') || k.has('ArrowUp') || t.gas;
    const down = k.has('KeyS') || k.has('ArrowDown') || t.brake;
    const left = k.has('KeyA') || k.has('ArrowLeft') || t.left;
    const right = k.has('KeyD') || k.has('ArrowRight') || t.right;
    const target = (left ? 1 : 0) - (right ? 1 : 0); // +1 = steer left
    const rate = target === 0 ? 6 : 3.5;
    this.steerSmooth += Math.max(-rate * dt, Math.min(rate * dt, target - this.steerSmooth));
    return { throttle: up ? 1 : 0, brake: down ? 1 : 0, steer: this.steerSmooth, handbrake: k.has('Space') || t.hand };
  }
}
