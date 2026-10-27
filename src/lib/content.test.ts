import { describe, it, vi as mock, beforeEach, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getContentBySlug, getSlugs, getAllContent, getLatestContent, _clearContentCache } from './content.ts';

describe('getSlugs', () => {
  beforeEach(() => {
    mock.restoreAllMocks();
    _clearContentCache();
  });

  it('should return an empty array if the directory does not exist', () => {
    mock.spyOn(fs, 'readdirSync').mockImplementation(() => {
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getSlugs('notes');
    expect(result).toEqual([]);
  });

  it('should return an array of slugs for md and mdx files and ignore others', () => {

    mock.spyOn(fs, 'readdirSync').mockReturnValue([
      'test-note.md' as unknown as fs.Dirent,
      'image.png' as unknown as fs.Dirent,
      'data.json' as unknown as fs.Dirent,
      'draft.txt' as unknown as fs.Dirent,
      'another-note.mdx' as unknown as fs.Dirent,
    ]);

    const result = getSlugs('notes');
    expect(result).toEqual(['test-note', 'another-note']);
  });
});

describe('getContentBySlug', () => {
  beforeEach(() => {
    mock.restoreAllMocks();
    _clearContentCache();
  });

  it('should return null if neither mdx nor md file exists', () => {
    mock.spyOn(fs, 'readFileSync').mockImplementation(() => {
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getContentBySlug('notes', 'non-existent');
    expect(result).toBeNull();
  });

  it('should read and parse an mdx file if it exists', () => {

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      if (filePath.endsWith('.mdx')) {
        return '---\ntitle: Test Note\ndescription: A test description\n---\n# Content here';
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getContentBySlug('notes', 'test-note');

    expect(result).not.toBeNull();
    expect(result?.meta.title).toBe('Test Note');
    expect(result?.meta.description).toBe('A test description');
    expect(result?.content.trim()).toBe('# Content here');
  });

  it('should read and parse an md file if mdx does not exist but md does', () => {

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      if (filePath.endsWith('.md')) {
        return '---\ntitle: MD Test Note\n---\n# MD Content';
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getContentBySlug('notes', 'md-test-note');

    expect(result).not.toBeNull();
    expect(result?.meta.title).toBe('MD Test Note');
    expect(result?.content.trim()).toBe('# MD Content');
  });

  it('should catch errors and return null', () => {

    mock.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('Read error');
    });

    const originalConsoleError = console.error;
    mock.spyOn(console, 'error').mockImplementation(() => {});

    const result = getContentBySlug('notes', 'error-note');

    expect(result).toBeNull();

    console.error = originalConsoleError;
  });

  it('should fallback to missing metadata when matter returns incomplete data', () => {

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
    mock.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('Unexpected IO exception during existsSync');
    });

    const originalConsoleError = console.error;
    mock.spyOn(console, 'error').mockImplementation(() => {});

    const result = getContentBySlug('notes', 'exception-note');

    expect(result).toBeNull();

    console.error = originalConsoleError;
  });
});

describe('getAllContent', () => {
  const setupMocks = (files: Record<string, string | Error>) => {

    mock.spyOn(fs, 'readdirSync').mockReturnValue(Object.keys(files) as any);
    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      const match = Object.entries(files).find(([name]) => filePath.includes(name));
      if (match) {
        if (match[1] instanceof Error) throw match[1];
        return match[1];
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });
  };

  beforeEach(() => {
    mock.restoreAllMocks();
    mock.unstubAllEnvs();
    _clearContentCache();
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

describe('getLatestContent', () => {
  beforeEach(() => {
    mock.restoreAllMocks();
    _clearContentCache();
  });

  it('should combine, sort by date descending, and slice content across multiple types', () => {

    const readdirSyncSpy = mock.spyOn(fs, 'readdirSync').mockImplementation((dirPath) => {
      if (typeof dirPath === 'string') {
        if (dirPath.includes('notes')) return ['note1.mdx'] as any;
        if (dirPath.includes('journal')) return ['journal1.mdx'] as any;
        if (dirPath.includes('lab')) return ['lab1.mdx'] as any;
      }
      return [];
    });

    const readFileSyncSpy = mock.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
      if (typeof filePath === 'string') {
        if (filePath.includes('note1.mdx')) return '---\ntitle: Note 1\ndate: 2023-01-01T00:00:00Z\nstatus: published\n---\nNote content';
        if (filePath.includes('journal1.mdx')) return '---\ntitle: Journal 1\ndate: 2023-01-02T00:00:00Z\nstatus: published\n---\nJournal content';
        if (filePath.includes('lab1.mdx')) return '---\ntitle: Lab 1\ndate: 2023-01-03T00:00:00Z\nstatus: published\n---\nLab content';
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getLatestContent(2);

    expect(readdirSyncSpy).toHaveBeenCalled();
    expect(readFileSyncSpy).toHaveBeenCalled();

    expect(result.length).toBe(2);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-03T00:00:00.000Z');
    expect(new Date(result[1].meta.date).toISOString()).toBe('2023-01-02T00:00:00.000Z');
  });

  it('should return default count of 3 items if no count is provided', () => {

    mock.spyOn(fs, 'readdirSync').mockImplementation((dirPath) => {
      if (typeof dirPath === 'string') {
        if (dirPath.includes('notes')) return ['note1.mdx', 'note2.mdx'] as any;
        if (dirPath.includes('journal')) return ['journal1.mdx'] as any;
        if (dirPath.includes('lab')) return ['lab1.mdx'] as any;
      }
      return [];
    });

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
      if (typeof filePath === 'string') {
        if (filePath.includes('note1.mdx')) return '---\ntitle: Note 1\ndate: 2023-01-01T00:00:00Z\nstatus: published\n---\nNote content';
        if (filePath.includes('note2.mdx')) return '---\ntitle: Note 2\ndate: 2023-01-04T00:00:00Z\nstatus: published\n---\nNote content';
        if (filePath.includes('journal1.mdx')) return '---\ntitle: Journal 1\ndate: 2023-01-02T00:00:00Z\nstatus: published\n---\nJournal content';
        if (filePath.includes('lab1.mdx')) return '---\ntitle: Lab 1\ndate: 2023-01-03T00:00:00Z\nstatus: published\n---\nLab content';
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getLatestContent();

    expect(result.length).toBe(3);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-04T00:00:00.000Z');
    expect(new Date(result[1].meta.date).toISOString()).toBe('2023-01-03T00:00:00.000Z');
    expect(new Date(result[2].meta.date).toISOString()).toBe('2023-01-02T00:00:00.000Z');
  });

  it('should handle cases where there is less content than requested', () => {

    mock.spyOn(fs, 'readdirSync').mockImplementation((dirPath) => {
      if (typeof dirPath === 'string') {
        if (dirPath.includes('notes')) return ['note1.mdx'] as any;
        if (dirPath.includes('journal')) return [] as any;
        if (dirPath.includes('lab')) return [] as any;
      }
      return [];
    });

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
      if (typeof filePath === 'string') {
        if (filePath.includes('note1.mdx')) return '---\ntitle: Note 1\ndate: 2023-01-01T00:00:00Z\nstatus: published\n---\nNote content';
      }
      const err = new Error();
      (err as any).code = 'ENOENT';
      throw err;
    });

    const result = getLatestContent(5);

    expect(result.length).toBe(1);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });
});
