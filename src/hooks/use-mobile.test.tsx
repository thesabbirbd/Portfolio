import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from './use-mobile';
import * as useMediaQueryModule from './use-media-query';

describe('useIsMobile', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  describe('Integration with useMediaQuery', () => {
    // Tests that don't mock useMediaQuery but mock window.matchMedia

    beforeEach(() => {
      // Mock window.matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('should return true when window width is below MOBILE_BREAKPOINT', () => {
      // Override matchMedia for this specific test
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(max-width: 1023px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
    });

    it('should return false when window width is above or equal to MOBILE_BREAKPOINT', () => {
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1023px)');
    });

    it('should update state when resize event triggers matchMedia change', () => {
      let changeCallback: ((e: MediaQueryListEvent) => void) | null = null;

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event, callback) => {
            if (event === 'change') {
              changeCallback = callback;
            }
          }),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);

      act(() => {
        if (changeCallback) {
          changeCallback({ matches: true } as MediaQueryListEvent);
        }
      });

      expect(result.current).toBe(true);
    });
  });

  describe('SSR behavior', () => {
    it('should return default value false when window is undefined', () => {
      // To simulate SSR without breaking React in JSDOM, we mock the underlying
      // hook that actually accesses the window object. This proves our component
      // passes through the correct default value when SSR happens.
      const spy = vi.spyOn(useMediaQueryModule, 'useMediaQuery').mockReturnValue(false);

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);

      spy.mockRestore();
    });
  });
});
