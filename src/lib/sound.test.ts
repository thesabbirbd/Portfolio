import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sound } from './sound';

describe('SoundSystem', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Use the toggle method to ensure enabled is false, since there isn't a
    // good way to reset the internal state cleanly if it's currently true.
    if (sound.isEnabled()) {
       sound.setEnabled(false);
    }
    // Also reset ctx to null by accessing private property if needed
    (sound as any).ctx = null;
  });

  const setupMockAudioContext = (startImplementation?: () => void) => {
    const mockStart = vi.fn().mockImplementation(startImplementation || (() => {}));
    const mockStop = vi.fn();
    const mockConnect = vi.fn();
    const mockSetValueAtTime = vi.fn();
    const mockExponentialRampToValueAtTime = vi.fn();
    const mockResume = vi.fn().mockResolvedValue(undefined);
    const mockCatch = vi.fn();
    mockResume.mockReturnValue({ catch: mockCatch });

    const mockOscillator = {
      type: 'sine',
      frequency: { setValueAtTime: mockSetValueAtTime },
      connect: mockConnect,
      start: mockStart,
      stop: mockStop,
    };

    const mockGain = {
      gain: {
        setValueAtTime: mockSetValueAtTime,
        exponentialRampToValueAtTime: mockExponentialRampToValueAtTime
      },
      connect: mockConnect,
    };

    class MockAudioContext {
      state = 'suspended';
      currentTime = 0;
      destination = {};
      createOscillator() { return mockOscillator; }
      createGain() { return mockGain; }
      resume = mockResume;
    }

    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal('window', {
      AudioContext: MockAudioContext,
      localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      }
    });

    return { mockStart, mockStop, mockConnect, mockResume };
  };

  it('should swallow exceptions thrown when AudioContext policy blocks playback', () => {
    const { mockStart } = setupMockAudioContext(() => {
      throw new Error("NotAllowedError: play() failed because the user didn't interact with the document first.");
    });

    expect(() => {
      sound.setEnabled(true);
      sound.click(); // Using click just to trigger playBeep since setEnabled may not actually call it reliably in all contexts
    }).not.toThrow();

    expect(mockStart).toHaveBeenCalled();
  });

  it('should be disabled by default', () => {
    expect(sound.isEnabled()).toBe(false);
  });

  it('should toggle enabled state', () => {
    setupMockAudioContext();
    expect(sound.isEnabled()).toBe(false);
    expect(sound.toggle()).toBe(true);
    expect(sound.isEnabled()).toBe(true);
    expect(sound.toggle()).toBe(false);
    expect(sound.isEnabled()).toBe(false);
  });

  it('should not play sound when disabled', () => {
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(false);
    sound.click();
    sound.hover();
    sound.toggleSwitch();
    sound.modalOpen();
    sound.success();
    expect(mockStart).not.toHaveBeenCalled();
  });

  it('should play hover sound', () => {
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(true);
    // setEnabled calls playBeep too, so let's clear mocks
    mockStart.mockClear();
    sound.hover();
    expect(mockStart).toHaveBeenCalled();
  });

  it('should play click sound', () => {
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(true);
    mockStart.mockClear();
    sound.click();
    expect(mockStart).toHaveBeenCalled();
  });

  it('should play toggleSwitch sound', () => {
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(true);
    mockStart.mockClear();
    sound.toggleSwitch();
    expect(mockStart).toHaveBeenCalled();
  });

  it('should play modalOpen sound', () => {
    vi.useFakeTimers();
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(true);
    mockStart.mockClear();
    sound.modalOpen();
    expect(mockStart).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(40);
    expect(mockStart).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('should play success sound', () => {
    vi.useFakeTimers();
    const { mockStart } = setupMockAudioContext();
    sound.setEnabled(true);
    mockStart.mockClear();
    sound.success();
    expect(mockStart).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(70);
    expect(mockStart).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
