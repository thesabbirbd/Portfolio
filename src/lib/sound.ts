// Web Audio API synthesizer for UI and scroll cues. Zero external audio files (original
// procedural tones).
//
// v4.0.1 (owner request): sound is ON by default at the High level, and the site has a scroll
// soundscape (soft ticks while scrolling, a clock-like "tik… tiik" through the career timeline,
// a sweep when a new chapter enters). Browsers still require a user gesture before any audio
// can start, so the first tap / click / key press anywhere unlocks the context; nothing plays
// before that. Turning sound off in Settings is a true mute and is remembered.
//
// Rules this module enforces:
//  - the AudioContext is only created/resumed from a user gesture; scroll-driven cues never
//    start audio on their own (they play only once a gesture has unlocked the context)
//  - multi-note cues are scheduled on the audio clock, not setTimeout, so nothing queues up
//  - each cue has a minimum gap and simultaneous voices are capped: no "sound storms"
//  - muting is immediate: nothing is scheduled and the context is suspended
//
// Signal chain: oscillator → per-note envelope → master level → soft-clip limiter → speakers.
// Peaks: per-note 0.07–0.24 × master (Low 1.2 · Medium 2.4 · High 4.0). High is twice the
// previous maximum (2.0 → 4.0, 2x master volume boost); the limiter is linear up to ±0.6 and bends
// anything above smoothly below ±0.95, so overlaps can never clip.

type Note = [freq: number, duration: number, type: OscillatorType, peak: number, delay?: number, glideTo?: number];

export type SoundLevel = "low" | "medium" | "high";
export const SOUND_LEVELS: SoundLevel[] = ["low", "medium", "high"];
export const LEVEL_GAIN: Record<SoundLevel, number> = { low: 1.2, medium: 2.4, high: 4 };
export const DEFAULT_LEVEL: SoundLevel = "high";

const STORAGE_KEY = "sabbir_portfolio_sound"; // "true" | "false"; absent → on (default)
const LEVEL_KEY = "sabbir_portfolio_sound_level_v2";

const MAX_VOICES = 10;
const ATTACK = 0.005; // seconds: a short fade-in avoids the click/pop of a hard start

/** Linear to ±0.6, then a tanh knee that never exceeds ±0.95 (inputs beyond ±1 are clamped). */
export function softClipCurve(points = 1024): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * 2 - 1;
    const m = Math.abs(x);
    curve[i] = m <= 0.6 ? x : Math.sign(x) * (0.6 + 0.35 * Math.tanh((m - 0.6) / 0.35));
  }
  return curve;
}

/**
 * Scroll cues get quieter the harder you scroll (owner request): a gentle scroll ticks at full
 * level, a fast fling fades to a quarter. `speed` is px/ms (≈ 0.3 slow, 1 brisk, 4+ a fling).
 */
export const scrollSoftening = (speed: number) => Math.max(0.25, Math.min(1, 1 / (1 + Math.max(0, speed - 0.3) * 0.9)));

const isLevel = (v: unknown): v is SoundLevel => typeof v === "string" && (SOUND_LEVELS as string[]).includes(v);

export class SoundSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private level: SoundLevel = DEFAULT_LEVEL;
  private voices = 0;
  private lastPlayed = new Map<string, number>();
  private lastMilestone = "";
  private tickFlip = false;
  private lastAny = 0;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.enabled = localStorage.getItem(STORAGE_KEY) !== "false"; // default ON
        const saved = localStorage.getItem(LEVEL_KEY);
        if (isLevel(saved)) this.level = saved;
      } catch {
        // storage unavailable: defaults (on, high)
      }
    }
  }

  /** Create or resume the context. Without a user gesture, only an already-running context is used. */
  private ensure(fromGesture: boolean): boolean {
    if (typeof window === "undefined") return false;
    if (!this.ctx) {
      if (!fromGesture) return false;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = LEVEL_GAIN[this.level];
      // Safety limiter: a soft-clip curve (exactly linear for every single cue) rather than a
      // DynamicsCompressor, whose automatic makeup gain flattened volume differences in testing.
      const limiter = ctx.createWaveShaper?.();
      if (limiter) {
        limiter.curve = softClipCurve();
        limiter.oversample = "2x";
        this.master.connect(limiter);
        limiter.connect(ctx.destination);
      } else {
        this.master.connect(ctx.destination);
      }
    }
    const state = this.ctx.state;
    if (state === "closed") return false;
    if (state === "suspended") {
      if (!fromGesture) return false;
      this.ctx.resume?.().catch(() => {});
    }
    return true;
  }

  /** Called on user gestures anywhere on the page (see SoundUnlock) until audio is running. */
  public unlock() {
    if (!this.enabled) return;
    try {
      this.ensure(true);
    } catch {
      // blocked or unsupported: stay silent
    }
  }

  /** Did any cue play in the last `ms` milliseconds? (the global click layer avoids doubling up) */
  public playedWithin(ms: number): boolean {
    return Date.now() - this.lastAny < ms;
  }

  /** True once audio can play without a further gesture. */
  public isUnlocked(): boolean {
    return !!this.ctx && this.ctx.state === "running";
  }

  private play(name: string, notes: Note[], { gesture = true, minGap = 60 } = {}) {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - (this.lastPlayed.get(name) ?? 0) < minGap) return;
    if (this.voices + notes.length > MAX_VOICES) return;
    try {
      if (!this.ensure(gesture) || !this.ctx) return;
      this.lastPlayed.set(name, now);
      this.lastAny = now;
      const ctx = this.ctx;
      const out = this.master ?? ctx.destination;
      for (const [freq, duration, type, peak, delay = 0, glideTo] of notes) {
        const t = ctx.currentTime + delay / 1000;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (glideTo) osc.frequency.exponentialRampToValueAtTime?.(glideTo, t + duration);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(peak, t + ATTACK);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain);
        gain.connect(out);
        this.voices++;
        osc.onended = () => {
          this.voices = Math.max(0, this.voices - 1);
          osc.disconnect?.();
          gain.disconnect?.();
        };
        osc.start(t);
        osc.stop(t + duration + 0.02);
      }
    } catch {
      // AudioContext blocked by policy or unsupported: stay silent
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getLevel(): SoundLevel {
    return this.level;
  }

  /** Call from a click handler: enabling counts as the user gesture that unlocks audio. */
  public setEnabled(val: boolean) {
    this.enabled = val;
    try {
      localStorage.setItem(STORAGE_KEY, val ? "true" : "false");
    } catch {}
    if (val) {
      this.preview();
    } else {
      this.ctx?.suspend?.().catch(() => {});
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  /** Low / Medium / High. Ramps smoothly (no zipper noise) and auditions the new level. */
  public setLevel(level: SoundLevel) {
    if (!isLevel(level)) return;
    this.level = level;
    try {
      localStorage.setItem(LEVEL_KEY, level);
    } catch {}
    const g = this.master?.gain;
    if (g && this.ctx) {
      if (g.setTargetAtTime) g.setTargetAtTime(LEVEL_GAIN[level], this.ctx.currentTime, 0.03);
      else g.value = LEVEL_GAIN[level];
    }
    this.preview();
  }

  // ---------------------------------------------------------------- interaction cues

  /** The "Test sound" cue: a clear two-note confirmation at the current level. */
  public preview() {
    this.play("preview", [[659.25, 0.09, "triangle", 0.24], [987.77, 0.14, "triangle", 0.22, 80]], { minGap: 200 });
  }

  /**
   * Tap for anything clickable, voiced per colour theme (read from <html data-theme-color>):
   *  orange "Royal"  → a small gold bell (triangle + soft octave)
   *  green  "Studio" → a soft wooden knock (low sine pair)
   *  blue   "Tech"   → a crisp digital blip (short square with an upward glide)
   */
  public click() {
    const theme = typeof document !== "undefined" ? document.documentElement.dataset.themeColor : undefined;
    if (theme === "green") this.play("click", [[523.25, 0.06, "sine", 0.24], [784, 0.04, "sine", 0.1, 8]], { minGap: 50 });
    else if (theme === "blue") this.play("click", [[1567.98, 0.035, "square", 0.07, 0, 2349.32], [3135.96, 0.02, "triangle", 0.08, 18]], { minGap: 50 });
    else this.play("click", [[1318.51, 0.07, "triangle", 0.2], [2637.02, 0.09, "sine", 0.06, 6]], { minGap: 50 });
  }

  /** Tap on something that isn't clickable: a soft, low "nope" (never harsh, throttled). */
  public miss() {
    this.play("miss", [[196, 0.1, "sine", 0.2, 0, 147], [233.08, 0.06, "triangle", 0.08, 30]], { minGap: 350 });
  }

  public toggleSwitch() {
    this.play("switch", [[784, 0.06, "triangle", 0.2, 0, 1046.5]], { minGap: 60 });
  }

  /** Primary call-to-action confirmed (send, open, download). */
  public confirm() {
    this.play("confirm", [[587.33, 0.08, "triangle", 0.24], [880, 0.12, "triangle", 0.22, 70]], { minGap: 200 });
  }

  /** Route / section change: a short upward glide. */
  public navigate() {
    this.play("navigate", [[620, 0.11, "sine", 0.24, 0, 930]], { minGap: 150 });
  }

  /** Swipe / drag / horizontal pan between items. */
  public swipe() {
    this.play("swipe", [[480, 0.09, "triangle", 0.18, 0, 760]], { minGap: 180 });
  }

  public modalOpen() {
    this.play("modal-open", [[523.25, 0.07, "sine", 0.24], [783.99, 0.1, "triangle", 0.22, 50]], { minGap: 200 });
  }

  public modalClose() {
    this.play("modal-close", [[783.99, 0.06, "triangle", 0.2], [523.25, 0.09, "sine", 0.22, 45]], { minGap: 200 });
  }

  /** Terminal typing feedback: throttled (≥ 70 ms apart) so it never plays per character. */
  public type() {
    this.play("type", [[1760, 0.022, "triangle", 0.08]], { minGap: 70 });
  }

  /** Terminal command submitted and understood. */
  public terminalSubmit() {
    this.play("terminal", [[880, 0.05, "square", 0.07], [1318.5, 0.08, "triangle", 0.2, 55]], { minGap: 120 });
  }

  public copy() {
    this.play("copy", [[880, 0.06, "sine", 0.22], [1108.73, 0.06, "sine", 0.22, 55], [1318.51, 0.11, "sine", 0.22, 110]], { minGap: 250 });
  }

  public themeSwitch() {
    this.play("theme", [[587.33, 0.16, "sine", 0.24, 0, 880], [1174.66, 0.12, "triangle", 0.14, 100]], { minGap: 250 });
  }

  /** Error / attention: two short low notes. Never the only signal (text always explains). */
  public error() {
    this.play("error", [[392, 0.1, "square", 0.08], [311.13, 0.14, "square", 0.08, 110]], { minGap: 400 });
  }

  /** Kept for existing call sites: a positive outcome (form handed to the mail app, etc.). */
  public success() {
    this.confirm();
  }

  // ---------------------------------------------------------------- scroll soundscape
  // Never unlocks audio (gesture: false) and is throttled hard.

  /** Launching a tool, terminal, command palette, project demo or modal. */
  public launch() {
    this.play("launch", [
      [440, 0.08, "triangle", 0.22, 0, 880],
      [880, 0.12, "sine", 0.20, 35, 1320],
      [1760, 0.09, "sine", 0.14, 75],
    ], { minGap: 180 });
  }

  /** Micro-interaction hover on 3D interactive nodes or motion graphic items. */
  public hover() {
    this.play("hover", [
      [1567.98, 0.03, "sine", 0.10, 0, 2093],
    ], { gesture: false, minGap: 100 });
  }

  /** Reaching the bottom boundary / footer of the page. */
  public bottom() {
    this.play("bottom", [
      [261.63, 0.18, "sine", 0.24, 0, 196],
      [392, 0.22, "triangle", 0.18, 50],
      [523.25, 0.26, "sine", 0.15, 110],
    ], { gesture: false, minGap: 2500 });
  }

  /**
   * Soft mechanical "ratchet" while scrolling: two alternating pitches with a little drift so
   * it never sounds like one sample on repeat. `speed` (px/ms) lifts the pitch slightly.
   * Boosted 2x to match interaction clicks.
   */
  public scrollTick(speed = 0) {
    this.tickFlip = !this.tickFlip;
    const base = (this.tickFlip ? 1880 : 1580) * (1 + Math.min(0.25, speed * 0.08)) * (0.98 + Math.random() * 0.04);
    this.play("scroll", [[base, 0.022, "triangle", 0.14 * scrollSoftening(speed)]], { gesture: false, minGap: 50 });
  }

  /**
   * Career-timeline clock: "tik… tikk… tiiik". Pitch and length grow with progress (0–1)
   * through the timeline, like a clock spring winding up.
   * Boosted 2x to match interaction clicks.
   */
  public timelineTick(progress: number, speed = 0) {
    const p = Math.min(1, Math.max(0, progress));
    const len = 0.012 + p * 0.05;
    const k = scrollSoftening(speed);
    this.play("timeline", [[1250 + p * 1350, len, "square", 0.09 * k], [2500 + p * 1200, len * 0.6, "triangle", 0.10 * k, 4]], { gesture: false, minGap: 65 });
  }

  /** A new chapter scrolls into view: a short low-to-high sweep, like a motion-graphics cut. */
  public sectionEnter() {
    this.play("section", [[220, 0.22, "sine", 0.14, 0, 660], [1320, 0.08, "triangle", 0.06, 120]], { gesture: false, minGap: 700 });
  }

  /**
   * Tonal accent when the career timeline reaches a new phase. Scroll-driven, so it never
   * unlocks audio by itself, is throttled, and ignores repeats of the same phase (scroll jitter).
   */
  public milestone(id: string) {
    if (!id || id === this.lastMilestone) return;
    this.lastMilestone = id;
    this.play("milestone", [[659.25, 0.1, "sine", 0.18], [987.77, 0.14, "sine", 0.15, 70]], { gesture: false, minGap: 1200 });
  }
}

export const sound = new SoundSystem();
