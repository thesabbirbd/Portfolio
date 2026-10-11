import { describe, it, vi as mock, beforeEach, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getContentBySlug, getAllContent } from './content.ts';

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

describe('getAllContent', () => {
  const setupMocks = (files: Record<string, string | Error>) => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
    mock.spyOn(fs, 'readdirSync').mockReturnValue(Object.keys(files) as any);
    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      const match = Object.entries(files).find(([name]) => filePath.includes(name));
      if (match) {
        if (match[1] instanceof Error) throw match[1];
        return match[1];
      }
      return '';
    });
  };

  beforeEach(() => {
    mock.restoreAllMocks();
    mock.unstubAllEnvs();
  });

  it('should return all content sorted by date descending', () => {
    setupMocks({
      'sort-post1.mdx': '---\ntitle: Sort Post 1\ndate: 2023-01-01T00:00:00.000Z\nstatus: published\n---\nContent 1',
      'sort-post2.mdx': '---\ntitle: Sort Post 2\ndate: 2023-01-02T00:00:00.000Z\nstatus: published\n---\nContent 2'
    });

    const results = getAllContent('notes');
    expect(results).toHaveLength(2);
    expect(results[0].meta.title).toBe('Sort Post 2');
    expect(results[1].meta.title).toBe('Sort Post 1');
  });

  it('should filter out draft items in production', () => {
    mock.stubEnv('NODE_ENV', 'production');
    setupMocks({
      'prod-draft.mdx': '---\ntitle: Prod Draft\nstatus: draft\ndate: 2023-01-02T00:00:00.000Z\n---\nDraft Content',
      'prod-published.mdx': '---\ntitle: Prod Published\nstatus: published\ndate: 2023-01-01T00:00:00.000Z\n---\nPublished Content'
    });

    const results = getAllContent('notes');
    expect(results).toHaveLength(1);
    expect(results[0].meta.title).toBe('Prod Published');
  });

  it('should include draft items in development', () => {
    mock.stubEnv('NODE_ENV', 'development');
    setupMocks({
      'dev-draft.mdx': '---\ntitle: Dev Draft\nstatus: draft\ndate: 2023-01-02T00:00:00.000Z\n---\nDraft Content',
      'dev-published.mdx': '---\ntitle: Dev Published\nstatus: published\ndate: 2023-01-01T00:00:00.000Z\n---\nPublished Content'
    });

    const results = getAllContent('notes');
    expect(results).toHaveLength(2);
    expect(results[0].meta.title).toBe('Dev Draft');
    expect(results[1].meta.title).toBe('Dev Published');
  });

  it('should filter out null items (failed to read/parse)', () => {
    mock.stubEnv('NODE_ENV', 'production');
    setupMocks({
      'null-invalid.mdx': new Error('Failed to read'),
      'null-valid.mdx': '---\ntitle: Null Valid\nstatus: published\ndate: 2023-01-01T00:00:00.000Z\n---\nValid Content'
    });

    const originalConsoleError = console.error;
    mock.spyOn(console, 'error').mockImplementation(() => {});

    const results = getAllContent('notes');
    expect(results).toHaveLength(1);
    expect(results[0].meta.title).toBe('Null Valid');

    console.error = originalConsoleError;
  });
});
