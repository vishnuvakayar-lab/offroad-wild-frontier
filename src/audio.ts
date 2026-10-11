/**
 * Procedural Web Audio: engine (RPM/throttle driven), ambience (wind, birds/crickets, rain)
 * and surface noise (dirt/gravel, sand hiss, mud squelch), splashes.
 * The AudioContext is only created inside a user-gesture handler (required by iOS Safari / Chrome autoplay).
 */
export interface AudioFrame {
  rpm: number; throttle: number; speed: number;
  mud: number; sand: number; ground: number; rock?: number; // 0..1 fraction of wheels on each surface
  slip: number; active: boolean; weather: string;
}

export class GameAudio {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private engineGain!: GainNode;
  private oscA!: OscillatorNode;
  private oscB!: OscillatorNode;
  private engineFilter!: BiquadFilterNode;
  analyser!: AnalyserNode;
  private noise!: AudioBuffer;
  private wind!: GainNode; private windF!: BiquadFilterNode;
  private rain!: GainNode;
  private rockG!: GainNode; private rockF!: BiquadFilterNode; private nextCrunch = 0; rockLevel = 0;
  private dirt!: GainNode; private sandG!: GainNode; private mudG!: GainNode; private mudF!: BiquadFilterNode;
  private nextChirp = 0; private nextSquelch = 0;
  volume = 0.8; muted = false;
  engineHz = 0;
  private suspendedByPage = false;

  constructor() {
    const unlock = () => {
      this.unlock();
      if (this.ctx && this.ctx.state === 'running') {
        for (const ev of ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']) window.removeEventListener(ev, unlock, true);
      }
    };
    for (const ev of ['pointerdown', 'pointerup', 'touchend', 'keydown', 'click']) window.addEventListener(ev, unlock, true);
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) { this.suspendedByPage = true; this.ctx.suspend(); }
      else if (this.suspendedByPage) { this.suspendedByPage = false; this.ctx.resume(); }
    });
  }

  get state(): string { return this.ctx ? this.ctx.state : 'none'; }

  /** Must run inside a user gesture. Safe to call repeatedly. */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.build();
    }
    const ctx = this.ctx!;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    // iOS: play a 1-sample silent buffer inside the gesture to fully unlock output
    const b = ctx.createBuffer(1, 1, 22050); const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0);
  }

  private loopNoise(): AudioBufferSourceNode {
    const s = this.ctx!.createBufferSource(); s.buffer = this.noise; s.loop = true;
    s.start(0, Math.random() * 2); return s;
  }
  private bp(type: BiquadFilterType, f: number, q = 1) { const b = this.ctx!.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  private gain(v = 0) { const g = this.ctx!.createGain(); g.gain.value = v; return g; }

  private build() {
    const ctx = this.ctx!;
    this.master = this.gain(this.muted ? 0 : this.volume);
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(ctx.destination);
    // white-noise buffer shared by all noise voices
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = this.noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    // engine: saw + square sub-harmonic -> soft clip -> lowpass
    this.oscA = ctx.createOscillator(); this.oscA.type = 'sawtooth'; this.oscA.frequency.value = 30;
    this.oscB = ctx.createOscillator(); this.oscB.type = 'square'; this.oscB.frequency.value = 15;
    const gB = this.gain(0.45);
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = (i / 1023) * 2 - 1; curve[i] = Math.tanh(x * 2.2); }
    shaper.curve = curve;
    this.engineFilter = this.bp('lowpass', 500, 2.5);
    this.engineGain = this.gain(0);
    const pre = this.gain(0.5);
    this.oscA.connect(pre); this.oscB.connect(gB).connect(pre);
    pre.connect(shaper).connect(this.engineFilter).connect(this.engineGain).connect(this.master);
    // a little exhaust rumble: low-passed noise amplitude-modulated by the engine
    const rumbleF = this.bp('lowpass', 160, 0.7); const rumble = this.gain(0.12);
    this.loopNoise().connect(rumbleF).connect(rumble).connect(this.engineGain);
    this.oscA.start(); this.oscB.start();
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 8192;
    this.engineGain.connect(this.analyser);

    // ambience
    this.windF = this.bp('lowpass', 420, 0.6); this.wind = this.gain(0);
    this.loopNoise().connect(this.windF).connect(this.wind).connect(this.master);
    const rainF = this.bp('highpass', 1800, 0.5); this.rain = this.gain(0);
    this.loopNoise().connect(rainF).connect(this.rain).connect(this.master);
    // surfaces
    const dF = this.bp('bandpass', 900, 0.7); this.dirt = this.gain(0);
    this.loopNoise().connect(dF).connect(this.dirt).connect(this.master);
    const sF = this.bp('bandpass', 3200, 0.8); this.sandG = this.gain(0);
    this.loopNoise().connect(sF).connect(this.sandG).connect(this.master);
    // rock / gravel: crackly mid-high band bursts (stones popping under the tyres)
    this.rockF = this.bp('bandpass', 1800, 1.3); this.rockG = this.gain(0);
    this.loopNoise().connect(this.rockF).connect(this.rockG).connect(this.master);
    this.mudF = this.bp('bandpass', 320, 2.5); this.mudG = this.gain(0);
    this.loopNoise().connect(this.mudF).connect(this.mudG).connect(this.master);
  }

  setVolume(v: number, muted: boolean) {
    this.volume = v; this.muted = muted;
    if (this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : v, this.ctx.currentTime, 0.05);
  }

  splash(strength: number) {
    const ctx = this.ctx; if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.bp('lowpass', 900 + strength * 1800, 0.8);
    const g = this.gain(0);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.35 * Math.min(1, strength), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + strength * 0.4);
    s.connect(f).connect(g).connect(this.master); s.start(t, Math.random()); s.stop(t + 1.2);
  }

  /** collision / hard landing: low body thump + metallic-noise crunch, scaled by impact speed change */
  impacts = 0;
  impact(strength: number) {
    const ctx = this.ctx; if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime, k = Math.min(1, strength); this.impacts++;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(95 + k * 40, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.25);
    const go = this.gain(0); go.gain.setValueAtTime(0.0001, t); go.gain.linearRampToValueAtTime(0.55 * k, t + 0.008); go.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(go).connect(this.master); o.start(t); o.stop(t + 0.4);
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.bp('bandpass', 1400 + k * 1600, 1.4); const gn = this.gain(0);
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.28 * k, t + 0.005); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.18 + k * 0.12);
    s.connect(f).connect(gn).connect(this.master); s.start(t, Math.random()); s.stop(t + 0.5);
  }

  private chirp(night: boolean) {
    const ctx = this.ctx!; const t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = this.gain(0);
    o.type = 'sine';
    if (night) { // cricket: fast AM pulses at ~4.4 kHz
      o.frequency.value = 4400;
      for (let k = 0; k < 6; k++) { g.gain.setValueAtTime(0.02, t + k * 0.05); g.gain.setValueAtTime(0, t + k * 0.05 + 0.025); }
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.35);
    } else { // bird: quick downward/upward sweep
      const f0 = 2500 + Math.random() * 1500;
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * (Math.random() < 0.5 ? 0.6 : 1.5), t + 0.12);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.15);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.2);
    }
  }

  update(f: AudioFrame) {
    const ctx = this.ctx; if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime, k = 0.06;
    const act = f.active ? 1 : 0.35; // quieter behind menus
    // engine: 4-stroke 4-cyl firing frequency = rpm/60*2
    const hz = (f.rpm / 60) * 2;
    this.engineHz = hz;
    this.oscA.frequency.setTargetAtTime(hz, t, k);
    this.oscB.frequency.setTargetAtTime(hz / 2, t, k);
    this.engineFilter.frequency.setTargetAtTime(300 + f.throttle * 1600 + hz * 4, t, k);
    this.engineGain.gain.setTargetAtTime((0.16 + f.throttle * 0.22) * act, t, k);

    const sp = Math.min(1, Math.abs(f.speed) / 25);
    const w = f.weather;
    const windBase = w === 'fog' ? 0.03 : w === 'rain' ? 0.08 : w === 'sunset' ? 0.07 : 0.05;
    this.wind.gain.setTargetAtTime(windBase + sp * 0.12, t, 0.3);
    this.windF.frequency.setTargetAtTime(350 + sp * 700, t, 0.3);
    this.rain.gain.setTargetAtTime(w === 'rain' ? 0.16 : 0, t, 0.5);
    const roll = Math.min(1, Math.abs(f.speed) / 12);
    this.dirt.gain.setTargetAtTime(f.ground * roll * 0.08 * act, t, k);
    this.sandG.gain.setTargetAtTime(f.sand * (roll * 0.06 + f.slip * 0.1) * act, t, k);
    // gravel crunch on rock: fast random bursts, louder with speed and wheelspin
    this.rockLevel = (f.rock ?? 0) * (roll * 0.11 + f.slip * 0.12) * act;
    if (t > this.nextCrunch) {
      this.nextCrunch = t + 0.02 + Math.random() * 0.05;
      this.rockF.frequency.setTargetAtTime(1200 + Math.random() * 1800, t, 0.01);
      this.rockG.gain.setTargetAtTime(this.rockLevel * (0.3 + Math.random() * 0.9), t, 0.012);
    }
    // mud squelch: randomly modulated low band-pass bursts
    const mudLevel = f.mud * (roll * 0.5 + f.slip * 0.8) * act;
    if (t > this.nextSquelch) {
      this.nextSquelch = t + 0.07 + Math.random() * 0.15;
      this.mudF.frequency.setTargetAtTime(220 + Math.random() * 380, t, 0.03);
      this.mudG.gain.setTargetAtTime(mudLevel * (0.15 + Math.random() * 0.35), t, 0.03);
    }
    if (f.active && w !== 'rain' && w !== 'fog' && t > this.nextChirp) {
      this.nextChirp = t + (w === 'night' ? 0.8 + Math.random() * 1.5 : 2 + Math.random() * 5);
      this.chirp(w === 'night');
    }
  }

  /** Dominant frequency of the engine bus (Hz), measured with an FFT; used by tests. */
  measureEngineHz(): number {
    if (!this.analyser) return 0;
    const n = this.analyser.frequencyBinCount; const buf = new Float32Array(n);
    this.analyser.getFloatFrequencyData(buf);
    const binHz = this.ctx!.sampleRate / this.analyser.fftSize;
    let best = -Infinity, bi = 0;
    for (let i = Math.floor(20 / binHz); i < Math.floor(600 / binHz); i++) if (buf[i] > best) { best = buf[i]; bi = i; }
    return best === -Infinity ? 0 : bi * binHz;
  }
}
