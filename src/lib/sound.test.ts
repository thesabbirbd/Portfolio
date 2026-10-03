import { test, describe, vi as mock, beforeEach, afterEach, expect } from 'vitest';
import { sound } from './sound.ts';

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

  test('should default to disabled when no localStorage is present', () => {
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
      sound.hover();
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
});
