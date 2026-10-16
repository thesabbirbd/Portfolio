import { test, describe, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateUniqueId, cn, debounce, formatDate } from './utils';

describe('cn', () => {
  test('should merge basic classes', () => {
    expect(cn('p-2', 'm-2')).toBe('p-2 m-2');
  });

  test('should resolve tailwind class conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  test('should handle conditional classes', () => {
    expect(cn(true && 'p-2', false && 'm-2')).toBe('p-2');
  });

  test('should handle arrays and objects', () => {
    expect(cn(['p-2'], { 'm-2': true, 'p-4': false })).toBe('p-2 m-2');
  });
});

describe('generateUniqueId', () => {
  test('should use default prefix "id" and follow the format', () => {
    const id = generateUniqueId();
    expect(id).toMatch(/^id-[a-z0-9]{1,7}$/);
  });

  test('should use custom prefix when provided', () => {
    const prefix = 'custom';
    const id = generateUniqueId(prefix);
    expect(id).toMatch(/^custom-[a-z0-9]{1,7}$/);
  });

  test('should generate different IDs on consecutive calls', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);
  });

  test('should handle empty string prefix', () => {
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

describe('formatDate', () => {
  test('should format date with default options (en-US, day: numeric, month: short, year: numeric)', () => {
    const date = new Date(2023, 0, 1); // January 1, 2023
    const formatted = formatDate(date);
    expect(formatted).toBe('Jan 1, 2023');
  });

  test('should format date with custom options', () => {
    const date = new Date(2023, 11, 25); // December 25, 2023
    const formatted = formatDate(date, { month: 'long', day: '2-digit' });
    expect(formatted).toBe('December 25, 2023');
  });

  test('should handle invalid date by throwing an error in Intl.DateTimeFormat', () => {
    const date = new Date('invalid-date');
    expect(() => formatDate(date)).toThrow('Invalid time value');
  });

  test('should completely override default options if specified', () => {
    const date = new Date(2023, 10, 5); // November 5, 2023
    const formatted = formatDate(date, { month: 'numeric', day: 'numeric', year: '2-digit' });
    expect(formatted).toBe('11/5/23');
  });

  test('should add additional options like weekday to the output', () => {
    const date = new Date(2023, 9, 31); // October 31, 2023 (Tuesday)
    const formatted = formatDate(date, { weekday: 'long' });
    expect(formatted).toBe('Tuesday, Oct 31, 2023');
  });

  test('should format time correctly when time options are provided', () => {
    // Note: Provide a specific UTC date to avoid timezone issues, or keep it localized
    // We will just use a specific date and time
    const date = new Date('2023-01-01T15:30:00.000Z');
    // Using UTC time zone in options to ensure test is deterministic regardless of the environment
    const formatted = formatDate(date, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    // Jan 1, 2023, 3:30 PM (replace narrow no-break space with regular space for Node 18+)
    expect(formatted.replace(/\u202f/gi, ' ')).toBe('Jan 1, 2023, 3:30 PM');
  });
});
