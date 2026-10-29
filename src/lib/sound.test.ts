import { test, describe, vi as mock, beforeEach, afterEach, expect } from 'vitest';
import { sound, SoundSystem, softClipCurve, LEVEL_GAIN, DEFAULT_LEVEL, scrollSoftening } from './sound';

describe('SoundSystem Policy Block Feature', () => {
  let originalWindow: typeof globalThis.window | undefined;
  let originalLocalStorage: typeof globalThis.localStorage | undefined;

  beforeEach(() => {
    originalWindow = globalThis.window;
    originalLocalStorage = globalThis.localStorage;
    sound.setEnabled(false);
  });

  afterEach(() => {
    if (originalWindow === undefined) {
      // @ts-ignore
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocalStorage === undefined) {
      // @ts-ignore
      delete globalThis.localStorage;
    } else {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true
      });
    }
  });

  test('setEnabled(false) mutes the shared instance', () => {
    expect(sound.isEnabled()).toBe(false);
  });

  test('should be able to toggle state', () => {
    // @ts-ignore
    globalThis.window = {
      localStorage: {
        setItem: mock.fn(),
        getItem: mock.fn()
      }
    } as any;
    // @ts-ignore
    Object.defineProperty(globalThis, 'localStorage', {
      value: globalThis.window.localStorage,
      writable: true,
      configurable: true
    });

    sound.setEnabled(false);

    const newState = sound.toggle();
    expect(newState).toBe(true);
    expect(sound.isEnabled()).toBe(true);
  });

  test('should fail gracefully if AudioContext is blocked by policy or throws error', () => {
    // @ts-ignore
    globalThis.window = {
      localStorage: {
        setItem: mock.fn(),
        getItem: mock.fn()
      },
      // Mock AudioContext throwing on createOscillator to simulate blocked policy
      AudioContext: class {
        state = 'running';
        createOscillator() {
          throw new Error('Policy blocked');
        }
        createGain() {
          return {
            gain: {
              setValueAtTime: () => {},
              exponentialRampToValueAtTime: () => {}
            },
            connect: () => {}
          };
        }
        get currentTime() { return 0; }
        get destination() { return {}; }
      }
    } as any;
    // @ts-ignore
    Object.defineProperty(globalThis, 'localStorage', {
      value: globalThis.window.localStorage,
      writable: true,
      configurable: true
    });

    sound.setEnabled(true);

    // This should NOT throw an error if the try-catch block inside playBeep works
    expect(() => {
      sound.click();
      sound.milestone('linux');
      sound.toggleSwitch();
      sound.modalOpen();
      sound.success();
    }).not.toThrow();
  });

  test('should not play anything when disabled', () => {
    // @ts-ignore
    globalThis.window = {
      localStorage: {
        setItem: mock.fn(),
        getItem: mock.fn()
      },
      AudioContext: class {
        createOscillator = mock.fn(() => ({
          frequency: { setValueAtTime: () => {} },
          connect: () => {},
          start: () => {},
          stop: () => {}
        }));
        createGain = mock.fn(() => ({
          gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
          connect: () => {}
        }));
        get currentTime() { return 0; }
        get destination() { return {}; }
      }
    } as any;
    // @ts-ignore
    Object.defineProperty(globalThis, 'localStorage', {
      value: globalThis.window.localStorage,
      writable: true,
      configurable: true
    });

    sound.setEnabled(false);

    expect(() => {
      sound.click();
    }).not.toThrow();
  });

  test('scroll-driven milestone cues never create an AudioContext without a user gesture', () => {
    const ctor = mock.fn();
    // @ts-ignore
    globalThis.window = {
      AudioContext: class { constructor() { ctor(); } },
    } as any;
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: (k: string) => (k === 'sabbir_portfolio_sound' ? 'true' : null), setItem: mock.fn() },
      writable: true,
      configurable: true
    });

    const s = new SoundSystem(); // enabled from storage, but no gesture has happened yet
    expect(s.isEnabled()).toBe(true);
    s.milestone('linux');
    s.milestone('python');
    expect(ctor).not.toHaveBeenCalled();
  });

  test('throttles rapid repeats and stays silent when disabled', () => {
    const createOscillator = mock.fn(() => ({
      type: 'sine',
      frequency: { setValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {}
    }));
    // @ts-ignore
    globalThis.window = {
      AudioContext: class {
        state = 'running';
        createOscillator = createOscillator;
        createGain() {
          return { gain: { value: 1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} };
        }
        get currentTime() { return 0; }
        get destination() { return {}; }
      }
    } as any;
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: () => null, setItem: mock.fn() },
      writable: true,
      configurable: true
    });

    const s = new SoundSystem();
    expect(s.isEnabled()).toBe(true); // v4.0.1: on by default (audio still waits for a gesture)
    s.setEnabled(false);
    s.click();
    expect(createOscillator).not.toHaveBeenCalled(); // muted: true mute

    s.setEnabled(true); // user gesture: plays the 2-note preview
    const afterPreview = createOscillator.mock.calls.length;
    s.click();
    s.click(); // within the minimum gap: ignored
    expect(createOscillator.mock.calls.length).toBe(afterPreview + 2); // one click = a 2-note themed tap
  });
  // A fake AudioContext that records the graph so the signal chain and peak levels can be checked.
  function fakeAudio() {
    const peaks: number[] = [];
    const log = { limiterConnectedToDestination: false, masterGain: 0, oscillators: 0, ended: [] as (() => void)[] };
    const destination = { name: 'destination' };
    class Ctx {
      state = 'running';
      currentTime = 0;
      destination = destination;
      createOscillator() {
        log.oscillators++;
        const osc: any = { type: 'sine', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} };
        queueMicrotask(() => log.ended.push(() => osc.onended?.()));
        return osc;
      }
      createGain() {
        const gain: any = {
          value: 1,
          setValueAtTime() {},
          setTargetAtTime(v: number) { gain.value = v; },
          exponentialRampToValueAtTime(v: number) { if (v > 0.001) peaks.push(v); },
        };
        const node: any = { gain, connect() {} };
        return node;
      }
      createWaveShaper() {
        return { curve: null, oversample: 'none', connect(to: unknown) { if (to === destination) log.limiterConnectedToDestination = true; } };
      }
      resume() { return Promise.resolve(); }
      suspend() { return Promise.resolve(); }
    }
    // @ts-ignore
    globalThis.window = { AudioContext: Ctx } as any;
    return { peaks, log };
  }
  function memoryStorage(initial: Record<string, string> = {}) {
    const store = new Map(Object.entries(initial));
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) },
      writable: true,
      configurable: true
    });
    return store;
  }

  test('level: defaults to High, persists Low/Medium/High, ignores junk', () => {
    fakeAudio();
    const store = memoryStorage();
    const s = new SoundSystem();
    expect(s.getLevel()).toBe(DEFAULT_LEVEL);
    expect(DEFAULT_LEVEL).toBe('high');
    s.setLevel('low');
    expect(store.get('sabbir_portfolio_sound_level_v2')).toBe('low');
    expect(new SoundSystem().getLevel()).toBe('low');
    s.setLevel('loud' as never);
    expect(s.getLevel()).toBe('low');
  });

  test('gain: High is twice the previous maximum (1.0), levels are ordered', () => {
    expect(LEVEL_GAIN.high).toBe(2);
    expect(LEVEL_GAIN.low).toBeLessThan(LEVEL_GAIN.medium);
    expect(LEVEL_GAIN.medium).toBeLessThan(LEVEL_GAIN.high);
  });

  test('a stored "off" choice is respected (default is on only when nothing was chosen)', () => {
    fakeAudio();
    memoryStorage({ sabbir_portfolio_sound: 'false' });
    expect(new SoundSystem().isEnabled()).toBe(false);
  });

  test('scroll cues stay silent until a gesture unlocked audio, then play throttled', () => {
    const { log } = fakeAudio();
    memoryStorage();
    const s = new SoundSystem();
    for (let i = 0; i < 5; i++) { s.scrollTick(1); s.timelineTick(i / 5); s.sectionEnter(); }
    expect(log.oscillators).toBe(0);
    s.unlock(); // first tap anywhere
    s.scrollTick(1); s.scrollTick(1); // second within 55 ms: dropped
    s.timelineTick(0.5);
    s.sectionEnter();
    expect(log.oscillators).toBe(1 + 2 + 2);
  });

  test('signal chain: limiter before the speakers, peaks audible but safe', () => {
    const { peaks, log } = fakeAudio();
    memoryStorage();
    const s = new SoundSystem();
    s.setEnabled(true);
    s.click(); s.navigate(); s.copy(); s.themeSwitch(); s.error(); s.modalClose(); s.terminalSubmit();
    expect(log.limiterConnectedToDestination).toBe(true);
    const max = Math.max(...peaks);
    // Old cues peaked at 0.016–0.035 (about −30 dBFS): the root cause of "barely audible".
    expect(Math.min(...peaks.filter((p) => p > 0.1))).toBeGreaterThanOrEqual(0.14);
    expect(max).toBeLessThanOrEqual(0.3); // ≈ −10.5 dBFS per voice, headroom for overlaps
  });

  test('true mute and storm guard: nothing plays when off; simultaneous voices are capped', () => {
    const { log } = fakeAudio();
    memoryStorage();
    const s = new SoundSystem();
    s.setEnabled(false);
    s.copy(); s.error();
    expect(log.oscillators).toBe(0);
    s.setEnabled(true); // preview: 2 voices
    for (const cue of ['click', 'navigate', 'copy', 'themeSwitch', 'error', 'modalOpen', 'confirm'] as const) s[cue]();
    expect(log.oscillators).toBeLessThanOrEqual(10);
  });

  test('limiter curve: linear for normal cues, bounded below full scale for overlaps', () => {
    const c = softClipCurve(1025);
    const at = (x: number) => c[Math.round(((x + 1) / 2) * 1024)];
    expect(at(0.25)).toBeCloseTo(0.25, 2);
    expect(at(-0.5)).toBeCloseTo(-0.5, 2);
    expect(Math.max(...c)).toBeLessThan(0.96);
    expect(Math.min(...c)).toBeGreaterThan(-0.96);
  });

  test('terminal typing ticks are throttled, never one per character', () => {
    const { log } = fakeAudio();
    memoryStorage({ sabbir_portfolio_sound: 'true' });
    const s = new SoundSystem();
    for (let i = 0; i < 20; i++) s.type();
    expect(log.oscillators).toBe(1);
  });
  test('scroll ticks get quieter the harder you scroll', () => {
    expect(scrollSoftening(0.2)).toBe(1);
    expect(scrollSoftening(1)).toBeLessThan(1);
    expect(scrollSoftening(4)).toBeLessThan(scrollSoftening(1));
    expect(scrollSoftening(100)).toBe(0.25); // never fully silent, never louder than a slow scroll
    const { peaks } = fakeAudio();
    memoryStorage();
    const s = new SoundSystem();
    s.unlock();
    s.scrollTick(0.2);
    const slow = peaks.at(-1)!;
    (s as unknown as { lastPlayed: Map<string, number> }).lastPlayed.clear();
    s.scrollTick(5);
    expect(peaks.at(-1)!).toBeLessThan(slow / 2);
  });

  test('clicks are voiced per colour theme; misses get a soft low cue', () => {
    const { log } = fakeAudio();
    memoryStorage();
    const s = new SoundSystem();
    s.unlock();
    const clear = () => (s as unknown as { lastPlayed: Map<string, number> }).lastPlayed.clear();
    const counts: number[] = [];
    for (const theme of ['orange', 'green', 'blue']) {
      document.documentElement.dataset.themeColor = theme;
      clear();
      const before = log.oscillators;
      s.click();
      counts.push(log.oscillators - before);
    }
    expect(counts.every((n) => n >= 1)).toBe(true);
    clear();
    const before = log.oscillators;
    s.miss(); s.miss(); // second within 350 ms: dropped
    expect(log.oscillators - before).toBe(2);
    expect(s.playedWithin(100)).toBe(true);
  });
});
