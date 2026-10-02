import { test, describe } from 'node:test';
import assert from 'node:assert';
import { generateUniqueId } from './utils.ts';

describe('generateUniqueId', () => {
  test('should use default prefix "id" and follow the format', () => {
    const id = generateUniqueId();
    assert.match(id, /^id-[a-z0-9]{1,7}$/);
  });

  test('should use custom prefix and follow the format', () => {
    const customPrefix = 'user';
    const id = generateUniqueId(customPrefix);
    assert.match(id, new RegExp(`^${customPrefix}-[a-z0-9]{1,7}$`));
  });

  test('should generate unique IDs on multiple calls', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    assert.notStrictEqual(id1, id2);
  });

  test('should handle empty prefix', () => {
    const id = generateUniqueId('');
    assert.match(id, /^-[a-z0-9]{1,7}$/);
  });
});
