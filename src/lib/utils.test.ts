import { test, describe, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateUniqueId, debounce } from './utils';

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
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('should call function only once after wait time', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toBeCalled();

    vi.advanceTimersByTime(100);

    expect(func).toBeCalledTimes(1);
  });

  test('should pass arguments correctly', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('test', 123);
    vi.advanceTimersByTime(100);

    expect(func).toBeCalledWith('test', 123);
  });

  test('should reset timer on subsequent calls', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);
    expect(func).not.toBeCalled();

    debouncedFunc();
    vi.advanceTimersByTime(50);
    expect(func).not.toBeCalled(); // 100ms since first call, but only 50ms since second call

    vi.advanceTimersByTime(50); // 100ms since second call
    expect(func).toBeCalledTimes(1);
  });
});
