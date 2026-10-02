import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { getContentBySlug } from './content.ts';

describe('getContentBySlug', () => {
  beforeEach(() => {
    mock.restoreAll();
  });

  it('should return null if neither mdx nor md file exists', () => {
    mock.method(fs, 'existsSync', () => false);

    const result = getContentBySlug('notes', 'non-existent');
    assert.strictEqual(result, null);
  });

  it('should read and parse an mdx file if it exists', () => {
    mock.method(fs, 'existsSync', (filePath: string) => filePath.endsWith('.mdx'));
    mock.method(fs, 'readFileSync', () => '---\ntitle: Test Note\ndescription: A test description\n---\n# Content here');

    const result = getContentBySlug('notes', 'test-note');

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.meta.title, 'Test Note');
    assert.strictEqual(result?.meta.description, 'A test description');
    assert.strictEqual(result?.content.trim(), '# Content here');
  });

  it('should read and parse an md file if mdx does not exist but md does', () => {
    mock.method(fs, 'existsSync', (filePath: string) => filePath.endsWith('.md'));
    mock.method(fs, 'readFileSync', () => '---\ntitle: MD Test Note\n---\n# MD Content');

    const result = getContentBySlug('notes', 'md-test-note');

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.meta.title, 'MD Test Note');
    assert.strictEqual(result?.content.trim(), '# MD Content');
  });

  it('should catch errors and return null', () => {
    mock.method(fs, 'existsSync', () => true);
    mock.method(fs, 'readFileSync', () => {
      throw new Error('Read error');
    });

    const originalConsoleError = console.error;
    mock.method(console, 'error', () => {}); // Silencing expected error output

    const result = getContentBySlug('notes', 'error-note');

    assert.strictEqual(result, null);

    console.error = originalConsoleError;
  });
});
