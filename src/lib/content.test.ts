import { describe, it, vi as mock, beforeEach, expect } from 'vitest';
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

  it('should combine, sort, and slice content from notes, journal, and lab correctly', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);

    mock.spyOn(fs, 'readdirSync').mockImplementation((dirPath: any) => {
      if (dirPath.includes('notes')) return ['unique-note1.md', 'unique-note2.md'];
      if (dirPath.includes('journal')) return ['unique-journal1.md'];
      if (dirPath.includes('lab')) return ['unique-lab1.md', 'unique-lab2.md'];
      return [];
    });

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      if (filePath.includes('unique-note1')) return '---\ntitle: Note 1\ndate: "2023-01-01"\n---';
      if (filePath.includes('unique-note2')) return '---\ntitle: Note 2\ndate: "2023-01-05"\n---';
      if (filePath.includes('unique-journal1')) return '---\ntitle: Journal 1\ndate: "2023-01-03"\n---';
      if (filePath.includes('unique-lab1')) return '---\ntitle: Lab 1\ndate: "2023-01-04"\n---';
      if (filePath.includes('unique-lab2')) return '---\ntitle: Lab 2\ndate: "2023-01-02"\n---';
      return '';
    });

    const result = getLatestContent(3);

    expect(result.length).toBe(3);
    // Should be sorted descending by date
    expect(result[0].meta.title).toBe('Note 2'); // 2023-01-05
    expect(result[1].meta.title).toBe('Lab 1'); // 2023-01-04
    expect(result[2].meta.title).toBe('Journal 1'); // 2023-01-03
  });

  it('should use default count of 3', () => {
    mock.spyOn(fs, 'existsSync').mockReturnValue(true);

    mock.spyOn(fs, 'readdirSync').mockImplementation((dirPath: any) => {
      if (dirPath.includes('notes')) return ['def-note1.md', 'def-note2.md'];
      if (dirPath.includes('journal')) return ['def-journal1.md'];
      if (dirPath.includes('lab')) return ['def-lab1.md'];
      return [];
    });

    mock.spyOn(fs, 'readFileSync').mockImplementation((filePath: any) => {
      if (filePath.includes('def-note1')) return '---\ntitle: Note 1\ndate: "2023-01-01"\n---';
      if (filePath.includes('def-note2')) return '---\ntitle: Note 2\ndate: "2023-01-05"\n---';
      if (filePath.includes('def-journal1')) return '---\ntitle: Journal 1\ndate: "2023-01-03"\n---';
      if (filePath.includes('def-lab1')) return '---\ntitle: Lab 1\ndate: "2023-01-04"\n---';
      return '';
    });

    const result = getLatestContent(); // No count provided

    expect(result.length).toBe(3);
    // It has 4 items in total across mock directories, should only return 3
    expect(result[0].meta.title).toBe('Note 2'); // 2023-01-05
    expect(result[1].meta.title).toBe('Lab 1'); // 2023-01-04
    expect(result[2].meta.title).toBe('Journal 1'); // 2023-01-03
  });
});
