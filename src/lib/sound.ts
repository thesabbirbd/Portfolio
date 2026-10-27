// Web Audio API subtle synthesizer for UI micro-interactions.
// OFF by default, opt-in only, zero external audio files (original procedural tones).
//
// Rules this module enforces:
//  - the AudioContext is only created/resumed from a user gesture (click, key press);
//    scroll-driven cues (timeline milestones) never start audio on their own
//  - multi-note cues are scheduled on the audio clock, not setTimeout, so nothing queues up
//  - each cue has a minimum gap, so rapid repeats can't stack
//  - turning sound off suspends the context immediately

type Note = [freq: number, duration: number, type: OscillatorType, gain: number, delay?: number];
export type SoundLevel = "quiet" | "normal";

const STORAGE_KEY = "sabbir_portfolio_sound";
const LEVEL_KEY = "sabbir_portfolio_sound_level";
const LEVEL_GAIN: Record<SoundLevel, number> = { quiet: 0.45, normal: 1 };

export class SoundSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private level: SoundLevel = "normal";
  private lastPlayed = new Map<string, number>();
  private lastMilestone = "";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.enabled = localStorage.getItem(STORAGE_KEY) === "true"; // default false
        this.level = localStorage.getItem(LEVEL_KEY) === "quiet" ? "quiet" : "normal";
      } catch {
        // storage unavailable: stay off
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
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = LEVEL_GAIN[this.level];
      this.master.connect(this.ctx.destination);
    }
    const state = this.ctx.state;
    if (state === "closed") return false;
    if (state === "suspended") {
      if (!fromGesture) return false;
      this.ctx.resume?.().catch(() => {});
    }
    return true;
  }

  private play(name: string, notes: Note[], { gesture = true, minGap = 60 } = {}) {
    if (!this.enabled) return;
    const now = Date.now();
    if (now - (this.lastPlayed.get(name) ?? 0) < minGap) return;
    try {
      if (!this.ensure(gesture) || !this.ctx) return;
      this.lastPlayed.set(name, now);
      const ctx = this.ctx;
      const out = this.master ?? ctx.destination;
      for (const [freq, duration, type, gainVal, delay = 0] of notes) {
        const t = ctx.currentTime + delay / 1000;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(gainVal, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain);
        gain.connect(out);
        osc.onended = () => {
          osc.disconnect?.();
          gain.disconnect?.();
        };
        osc.start(t);
        osc.stop(t + duration);
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

  /** Call from the Settings click handler: enabling counts as the user gesture that unlocks audio. */
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

  public setLevel(level: SoundLevel) {
    this.level = level;
    try {
      localStorage.setItem(LEVEL_KEY, level);
    } catch {}
    if (this.master) this.master.gain.value = LEVEL_GAIN[level];
    this.preview();
  }

  /** Short confirmation chord used as the "test sound". */
  public preview() {
    this.play("preview", [[587.33, 0.07, "sine", 0.03], [880, 0.09, "triangle", 0.03, 70]], { minGap: 250 });
  }

  public click() {
    this.play("click", [[880, 0.03, "triangle", 0.035]]);
  }

  public toggleSwitch() {
    this.play("switch", [[720, 0.04, "sine", 0.03]]);
  }

  public modalOpen() {
    this.play("modal", [[520, 0.05, "sine", 0.025], [780, 0.06, "triangle", 0.025, 40]], { minGap: 200 });
  }

  public success() {
    this.play("success", [[587.33, 0.06, "sine", 0.03], [880, 0.08, "triangle", 0.03, 70]], { minGap: 250 });
  }

  /**
   * Tiny tonal accent when the career timeline reaches a new phase. Scroll-driven, so it never
   * unlocks audio by itself, is throttled, and ignores repeats of the same phase (scroll jitter).
   */
  public milestone(id: string) {
    if (!id || id === this.lastMilestone) return;
    this.lastMilestone = id;
    this.play("milestone", [[660, 0.08, "sine", 0.02], [990, 0.1, "sine", 0.016, 60]], { gesture: false, minGap: 1200 });
  }
}

export const sound = new SoundSystem();
