import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast, toast } from './use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Dismiss all existing toasts to isolate tests
    const { result } = renderHook(() => useToast());
    act(() => {
      // Empty the memoryState toasts by forcing an action that doesn't rely on existing state structure cleanly
      // Or simply dismiss them and wait for removal
      result.current.toasts.forEach(t => {
        result.current.dismiss(t.id);
      });
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add a toast and update the hook state', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Test Toast',
        description: 'Test Description',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      description: 'Test Description',
      open: true,
    });
  });

  it('should auto-dismiss and remove a toast after its duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Auto Dismiss Toast',
        duration: 3000,
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(true);

    // Fast-forward past the duration
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should be dismissed (open: false)
    expect(result.current.toasts[0].open).toBe(false);

    // Fast-forward past the remove delay (1000ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should be removed from state
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should allow manually dismissing a specific toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const t = toast({ title: 'Dismiss Me' });
      toastId = t.id;
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should allow updating an existing toast', () => {
    const { result } = renderHook(() => useToast());

    let t: ReturnType<typeof toast>;
    act(() => {
      t = toast({ title: 'Original Title' });
    });

    expect(result.current.toasts[0].title).toBe('Original Title');

    act(() => {
      t.update({ title: 'Updated Title', description: 'Added description' });
    });

    expect(result.current.toasts[0].title).toBe('Updated Title');
    expect(result.current.toasts[0].description).toBe('Added description');
  });

  it('should respect the maximum toast limit', () => {
    const { result } = renderHook(() => useToast());
    const TOAST_LIMIT = 20;

    act(() => {
      for (let i = 0; i < TOAST_LIMIT + 5; i++) {
        toast({ title: `Toast ${i}` });
      }
    });

    // We added 25 toasts, but state should only hold the TOAST_LIMIT newest ones
    expect(result.current.toasts).toHaveLength(TOAST_LIMIT);
    // The newest toast (Toast 24) should be at the front
    expect(result.current.toasts[0].title).toBe('Toast 24');
  });

  it('should provide utility functions for different toast variants', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast.default({ title: 'Default' });
      toast.destructive({ title: 'Destructive' });
      toast.success({ title: 'Success' });
      toast.warning({ title: 'Warning' });
      toast.info({ title: 'Info' });
    });

    expect(result.current.toasts).toHaveLength(5);
    // Since toasts are unshifted, they are in reverse order of addition
    expect(result.current.toasts[0]).toMatchObject({ title: 'Info', type: 'info' });
    expect(result.current.toasts[1]).toMatchObject({ title: 'Warning', type: 'warning' });
    expect(result.current.toasts[2]).toMatchObject({ title: 'Success', type: 'success', variant: 'success' });
    expect(result.current.toasts[3]).toMatchObject({ title: 'Destructive', type: 'destructive' });
    expect(result.current.toasts[4]).toMatchObject({ title: 'Default', type: 'default' });
  });

  it('should handle infinite duration correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({
        title: 'Infinite Toast',
        duration: Infinity,
      });
    });

    // Advance by a large amount of time
    act(() => {
      vi.advanceTimersByTime(1000000);
    });

    // Should still be open
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(true);
  });
});
