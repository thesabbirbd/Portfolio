import { test, describe, expect } from 'vitest';
import { generateUniqueId, formatDate } from './utils.ts';

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
});
