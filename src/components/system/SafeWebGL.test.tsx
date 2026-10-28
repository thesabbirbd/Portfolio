import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hasWebGL } from './SafeWebGL';

describe('hasWebGL', () => {
  let createElementSpy: any;

  beforeEach(() => {
    createElementSpy = vi.spyOn(document, 'createElement');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when webgl2 is supported', () => {
    const mockLoseContext = vi.fn();
    const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

    const mockCanvas = {
      getContext: vi.fn((contextId: string) => {
        if (contextId === 'webgl2') {
          return { getExtension: mockGetExtension };
        }
        return null;
      })
    };

    createElementSpy.mockReturnValue(mockCanvas);

    expect(hasWebGL()).toBe(true);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl2');
    expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
    expect(mockLoseContext).toHaveBeenCalled();
  });

  it('returns true when only webgl is supported', () => {
    const mockLoseContext = vi.fn();
    const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

    const mockCanvas = {
      getContext: vi.fn((contextId: string) => {
        if (contextId === 'webgl2') return null;
        if (contextId === 'webgl') return { getExtension: mockGetExtension };
        return null;
      })
    };

    createElementSpy.mockReturnValue(mockCanvas);

    expect(hasWebGL()).toBe(true);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl2');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
    expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
    expect(mockLoseContext).toHaveBeenCalled();
  });

  it('returns false when neither webgl2 nor webgl is supported', () => {
    const mockCanvas = {
      getContext: vi.fn(() => null)
    };

    createElementSpy.mockReturnValue(mockCanvas);

    expect(hasWebGL()).toBe(false);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl2');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
  });

  it('returns true even if WEBGL_lose_context extension is not available', () => {
    const mockCanvas = {
      getContext: vi.fn((contextId: string) => {
        if (contextId === 'webgl2') {
          return { getExtension: vi.fn().mockReturnValue(null) };
        }
        return null;
      })
    };

    createElementSpy.mockReturnValue(mockCanvas);

    expect(hasWebGL()).toBe(true);
  });

  it('returns false when an error is thrown', () => {
    createElementSpy.mockImplementation(() => {
      throw new Error('createElement error');
    });

    expect(hasWebGL()).toBe(false);
  });
});
