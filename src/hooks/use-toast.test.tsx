import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useToast, toast } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    const { result, unmount } = renderHook(() => useToast());

    act(() => {
      // Dismiss all toasts to clear global state
      result.current.dismiss();
    });

    act(() => {
      // Run timers to allow REMOVE_TOAST to be dispatched
      vi.runAllTimers();
    });

    unmount();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with 0 toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Test Toast', description: 'This is a test' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test');
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('should update an existing toast', () => {
    const { result } = renderHook(() => useToast());

    let t: ReturnType<typeof toast>;
    act(() => {
      t = toast({ title: 'To Update' });
    });

    act(() => {
      t.update({ title: 'Updated Now' });
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)?.title).toBe('Updated Now');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());

    let t: ReturnType<typeof toast>;
    act(() => {
      t = toast({ title: 'To Dismiss' });
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)?.open).toBe(true);

    act(() => {
      result.current.dismiss(t.id);
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)?.open).toBe(false);
  });

  it('should remove a toast after TOAST_REMOVE_DELAY', () => {
    const { result } = renderHook(() => useToast());

    let t: ReturnType<typeof toast>;
    act(() => {
      t = toast({ title: 'To Remove' });
    });

    act(() => {
      result.current.dismiss(t.id);
    });

    // Toast should still be in state but open=false
    expect(result.current.toasts.find(toast => toast.id === t.id)?.open).toBe(false);
    expect(result.current.toasts.find(toast => toast.id === t.id)).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1000); // TOAST_REMOVE_DELAY is 1000
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)).toBeUndefined();
  });

  it('should auto-dismiss a toast after duration', () => {
    const { result } = renderHook(() => useToast());

    let t: ReturnType<typeof toast>;
    act(() => {
      // Default duration is 5000
      t = toast({ title: 'Auto Dismiss' });
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)?.open).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)?.open).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000); // Wait for remove delay
    });

    expect(result.current.toasts.find(toast => toast.id === t.id)).toBeUndefined();
  });

  it('should respect TOAST_LIMIT', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      // TOAST_LIMIT is 20
      for (let i = 0; i < 25; i++) {
        toast({ title: `Toast ${i}` });
      }
    });

    expect(result.current.toasts).toHaveLength(20);
    // The newest toasts should be kept, so Toast 24 should be at index 0, Toast 5 at index 19
    expect(result.current.toasts[0].title).toBe('Toast 24');
    expect(result.current.toasts[19].title).toBe('Toast 5');
  });

  it('should create convenience toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast.default({ title: 'Default' });
      toast.destructive({ title: 'Destructive' });
      toast.success({ title: 'Success' });
      toast.warning({ title: 'Warning' });
      toast.info({ title: 'Info' });
    });

    // Note: toasts are unshifted, so the last added is at index 0
    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[1].type).toBe('warning');
    expect(result.current.toasts[2].type).toBe('success');
    expect(result.current.toasts[2].variant).toBe('success');
    expect(result.current.toasts[3].type).toBe('destructive');
    expect(result.current.toasts[4].type).toBe('default');
  });
});
