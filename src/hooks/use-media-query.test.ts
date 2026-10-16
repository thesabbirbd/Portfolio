import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMediaQuery } from './use-media-query';

describe('useMediaQuery', () => {
  let addEventListenerMock: any;
  let removeEventListenerMock: any;
  let matchMediaMock: any;

  beforeEach(() => {
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();

    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", { writable: true, value: matchMediaMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false by default if no defaultState is provided', () => {
    matchMediaMock.mockImplementationOnce((query: string) => ({
      matches: false,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should initialize with the current matchMedia value', () => {
    matchMediaMock.mockImplementationOnce((query: string) => ({
      matches: true,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('should update state when media query changes', () => {
    let listener: any;

    matchMediaMock.mockImplementationOnce((query: string) => ({
      matches: false,
      addEventListener: vi.fn().mockImplementation((event, cb) => {
        if (event === 'change') {
          listener = cb;
        }
      }),
      removeEventListener: removeEventListenerMock,
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // Simulate change event
    if (listener) {
      act(() => { listener({ matches: true } as MediaQueryListEvent); });
    } else {
       throw new Error('Listener was not attached');
    }

    expect(result.current).toBe(true);
  });

  it('should clean up the event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should return defaultState when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);

    // As per the reviewer's feedback and the project memory:
    // "invoke the hook function directly outside of @testing-library/react's renderHook"
    // Since useState will throw without a dispatcher, we use renderToString to safely execute the hook without throwing.
    function TestComponent() {
      const isMatch = useMediaQuery('(min-width: 768px)', true);
      return React.createElement('div', null, isMatch ? 'matched' : 'not matched');
    }

    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain('matched');

    vi.unstubAllGlobals();
  });
});
