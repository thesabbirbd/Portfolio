import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Should not update immediately
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now it should be updated
    expect(result.current).toBe('updated');
  });

  it('should only update once if value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Rapidly update value multiple times
    rerender({ value: 'update1', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: 'update2', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: 'update3', delay: 500 });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Advance 499ms from the LAST update
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('initial');

    // Advance 1ms to reach 500ms from the LAST update
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Now it should be updated to the latest value
    expect(result.current).toBe('update3');
  });

  it('should clean up the timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('initial', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should update the delay dynamically', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Update value, keeping delay at 500ms. Starts a 500ms timer.
    rerender({ value: 'updated', delay: 500 });

    // Advance halfway through the timer
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Update ONLY the delay to 1000ms.
    // This should restart the timer for 1000ms from now.
    rerender({ value: 'updated', delay: 1000 });

    // Advance 250ms. If the delay wasn't updated, the original 500ms timer would complete here.
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should not be updated yet, because the new 1000ms timer is active.
    expect(result.current).toBe('initial');

    // Advance the remaining 750ms of the 1000ms timer
    act(() => {
      vi.advanceTimersByTime(750);
    });

    // Now it should be updated
    expect(result.current).toBe('updated');
  });
});
