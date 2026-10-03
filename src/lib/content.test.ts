import { describe, it, vi as mock, beforeEach, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getContentBySlug } from './content.ts';

describe('getContentBySlug', () => {
  beforeEach(() => {
    mock.restoreAllMocks();
  });

  it('should return null if neither mdx nor md file exists', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = getContentBySlug('notes', 'non-existent');
    expect(result).toBeNull();
  });

  it('should read and parse an mdx file if it exists', () => {
    mock.spyOn(fs, 'existsSync').mockImplementation((filePath: any) => filePath.endsWith('.mdx'));
    mock.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Test Note\ndescription: A test description\n---\n# Content here');

    const result = getContentBySlug('notes', 'test-note');

    expect(result).not.toBeNull();
    expect(result?.meta.title).toBe('Test Note');
    expect(result?.meta.description).toBe('A test description');
    expect(result?.content.trim()).toBe('# Content here');
  });

  it('should read and parse an md file if mdx does not exist but md does', () => {
    mock.spyOn(fs, 'existsSync').mockImplementation((filePath: any) => filePath.endsWith('.md'));
    mock.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: MD Test Note\n---\n# MD Content');

    const result = getContentBySlug('notes', 'md-test-note');

    expect(result).not.toBeNull();
    expect(result?.meta.title).toBe('MD Test Note');
    expect(result?.content.trim()).toBe('# MD Content');
  });

  it('should catch errors and return null', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
    mock.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('Read error');
    });

    const originalConsoleError = console.error;
    mock.spyOn(console, 'error').mockImplementation(() => {}); // Silencing expected error output

    const result = getContentBySlug('notes', 'error-note');

    expect(result).toBeNull();

    console.error = originalConsoleError;
  });

  it('should fallback to missing metadata when matter returns incomplete data', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
    mock.spyOn(fs, 'readFileSync').mockReturnValue('# Content only with no frontmatter');

    const result = getContentBySlug('notes', 'missing-meta');

    expect(result).not.toBeNull();
    expect(result?.meta.title).toBe('Untitled');
    expect(result?.meta.description).toBe('');
    expect(result?.meta.status).toBe('published');
    expect(result?.meta.featured).toBe(false);
    expect(result?.meta.author).toBe('Md Sabbirul Islam Khan');
    expect(result?.meta.brand).toBe('THE SABBiR');
  });

  it('should return null on generic catch block exception handling', () => {
    mock.spyOn(fs, 'existsSync').mockImplementation(() => {
      // Simulate an error inside the try block unrelated to readFileSync specifically
      throw new Error('Unexpected IO exception during existsSync');
    });

    const originalConsoleError = console.error;
    mock.spyOn(console, 'error').mockImplementation(() => {}); // Silencing expected error output

    const result = getContentBySlug('notes', 'exception-note');

    expect(result).toBeNull();

    console.error = originalConsoleError;
  });
});
