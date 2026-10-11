import { describe, it, vi as mock, beforeEach, afterEach, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getContentBySlug, getLatestContent } from './content.ts';

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

describe('getLatestContent', () => {
  beforeEach(() => {
    mock.restoreAllMocks();
  });

  it('should combine, sort by date descending, and slice content across multiple types', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
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
      return '';
    });

    const result = getLatestContent(2);

    expect(readdirSyncSpy).toHaveBeenCalled();
    expect(readFileSyncSpy).toHaveBeenCalled();

    expect(result.length).toBe(2);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-03T00:00:00.000Z'); // Newest first
    expect(new Date(result[1].meta.date).toISOString()).toBe('2023-01-02T00:00:00.000Z'); // Second newest
  });

  it('should return default count of 3 items if no count is provided', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
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
      return '';
    });

    const result = getLatestContent();

    expect(result.length).toBe(3);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-04T00:00:00.000Z');
    expect(new Date(result[1].meta.date).toISOString()).toBe('2023-01-03T00:00:00.000Z');
    expect(new Date(result[2].meta.date).toISOString()).toBe('2023-01-02T00:00:00.000Z');
  });

  it('should handle cases where there is less content than requested', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);
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
      return '';
    });

    const result = getLatestContent(5);

    expect(result.length).toBe(1);
    expect(new Date(result[0].meta.date).toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });
});
