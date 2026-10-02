import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { getContentBySlug } from '../content';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  },
}));

describe('content.ts - getContentBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when fs.readFileSync throws an error', () => {
    // Setup existsSync to return true so we reach readFileSync
    vi.mocked(fs.existsSync).mockReturnValue(true);

    // Make readFileSync throw an error
    const testError = new Error('Simulated read error');
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw testError;
    });

    // Mock console.error to prevent test output clutter
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function
    const result = getContentBySlug('notes', 'test-slug');

    // Assertions
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error reading notes/test-slug', testError);

    consoleSpy.mockRestore();
  });
});
