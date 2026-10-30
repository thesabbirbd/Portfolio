import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavVisibility, useScrolledPastTop } from './useNavVisibility';

// The store reads scroll position once per animation frame, so each step flushes one frame.
function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
  window.dispatchEvent(new Event('scroll'));
  vi.advanceTimersToNextFrame();
}

describe('useNavVisibility', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] });
    scrollTo(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts visible', () => {
    const { result, unmount } = renderHook(() => useNavVisibility());
    expect(result.current.isNavHidden).toBe(false);
    unmount();
  });

  it('ignores small downward jitter but hides after sustained downward travel', () => {
    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true, writable: true });
    const { result, unmount } = renderHook(() => useNavVisibility()); // mounts mid-page
    act(() => scrollTo(410)); // 10px: below the hide threshold
    expect(result.current.isNavHidden).toBe(false);
    act(() => scrollTo(450)); // 50px of continuous downward travel
    expect(result.current.isNavHidden).toBe(true);
    unmount();
  });

  it('shows again after a small upward scroll', () => {
    const { result, unmount } = renderHook(() => useNavVisibility());
    act(() => scrollTo(400));
    act(() => scrollTo(460));
    expect(result.current.isNavHidden).toBe(true);
    act(() => scrollTo(440));
    expect(result.current.isNavHidden).toBe(false);
    unmount();
  });

  it('reappears once scrolling settles', () => {
    const { result, unmount } = renderHook(() => useNavVisibility());
    act(() => scrollTo(400));
    act(() => scrollTo(480));
    expect(result.current.isNavHidden).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isNavHidden).toBe(false);
    unmount();
  });

  it('always shows near the top of the page', () => {
    const { result, unmount } = renderHook(() => useNavVisibility());
    act(() => scrollTo(100));
    act(() => scrollTo(150));
    expect(result.current.isNavHidden).toBe(false);
    unmount();
  });

  it('reports leaving the top from the same shared listener', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const { result, unmount } = renderHook(() => ({ past: useScrolledPastTop(), nav: useNavVisibility() }));
    expect(result.current.past).toBe(false);
    act(() => scrollTo(60));
    expect(result.current.past).toBe(true);
    act(() => scrollTo(20));
    expect(result.current.past).toBe(false);
    // Both hooks share one passive scroll listener.
    expect(add.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1);
    add.mockRestore();
    unmount();
  });
});
