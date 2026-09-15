// Web Audio API subtle synthesizer for UI micro-interactions
// Respects user preference, defaults to OFF, zero external MP3 dependencies

class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sabbir_portfolio_sound");
      this.enabled = stored === "true"; // Default to false if not set
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== "undefined") {
      localStorage.setItem("sabbir_portfolio_sound", val ? "true" : "false");
    }
    if (val) {
      this.init();
      this.playBeep(640, 0.04, "sine");
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private playBeep(freq: number, duration: number, type: OscillatorType = "sine", gainVal: number = 0.03) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy safe catch
    }
  }

  public click() {
    this.playBeep(880, 0.03, "triangle", 0.04);
  }

  public hover() {
    this.playBeep(440, 0.02, "sine", 0.015);
  }

  public toggleSwitch() {
    this.playBeep(720, 0.04, "sine", 0.03);
  }

  public modalOpen() {
    if (!this.enabled) return;
    this.playBeep(520, 0.05, "sine", 0.03);
    setTimeout(() => this.playBeep(780, 0.06, "triangle", 0.03), 40);
  }

  public success() {
    if (!this.enabled) return;
    this.playBeep(587.33, 0.06, "sine", 0.03);
    setTimeout(() => this.playBeep(880, 0.08, "triangle", 0.035), 70);
  }
}

export const sound = new SoundSystem();
