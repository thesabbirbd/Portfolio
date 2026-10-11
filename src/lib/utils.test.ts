import { test, describe, expect } from 'vitest';
import { generateUniqueId, cn } from './utils.ts';

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
