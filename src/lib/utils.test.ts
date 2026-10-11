import { test, describe, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateUniqueId, debounce } from './utils.ts';

describe('generateUniqueId', () => {
  test('should use default prefix "id" and follow the format', () => {
    const id = generateUniqueId();
    expect(id).toMatch(/^id-[a-z0-9]{1,7}$/);
  });

  test('should use custom prefix and follow the format', () => {
    const customPrefix = 'user';
    const id = generateUniqueId(customPrefix);
    expect(id).toMatch(new RegExp(`^${customPrefix}-[a-z0-9]{1,7}$`));
  });

  test('should generate unique IDs on multiple calls', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);
  });

  test('should handle empty prefix', () => {
    const id = generateUniqueId('');
    expect(id).toMatch(/^-[a-z0-9]{1,7}$/);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('should not execute immediately', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();
  });

  test('should execute after wait time', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    vi.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should only execute once for multiple calls within wait time', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    vi.advanceTimersByTime(500);
    expect(func).not.toHaveBeenCalled();

    debouncedFunc();
    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should use the latest arguments when executed', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc(1);
    debouncedFunc(2);
    debouncedFunc(3);

    vi.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(3);
  });
});
