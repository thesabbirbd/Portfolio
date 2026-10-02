import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from './analytics';

describe('Analytics trackEvent', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
    if (typeof window !== 'undefined') {
      delete (window as any).va;
    } else {
      delete (global as any).window;
    }
  });

  it('calls window.va when available', () => {
    const mockVa = vi.fn();
    if (typeof window !== 'undefined') {
      (window as any).va = mockVa;
    } else {
      (global as any).window = { va: mockVa };
    }

    // @ts-ignore - we are simulating tracking an event
    trackEvent('content_view', { id: '123' });

    expect(mockVa).toHaveBeenCalledWith('event', 'content_view', { id: '123' });
    expect(console.log).not.toHaveBeenCalled();
  });

  it('falls back to console.log in development when window.va is not available', () => {
    process.env.NODE_ENV = 'development';
    if (typeof window !== 'undefined') {
      delete (window as any).va;
    }

    // @ts-ignore
    trackEvent('project_view', { project: 'test' });

    expect(console.log).toHaveBeenCalledWith('📊 [Analytics] project_view', { project: 'test' });
  });

  it('falls back to console.log with empty string when properties are omitted in development', () => {
    process.env.NODE_ENV = 'development';
    if (typeof window !== 'undefined') {
      delete (window as any).va;
    }

    // @ts-ignore
    trackEvent('search');

    expect(console.log).toHaveBeenCalledWith('📊 [Analytics] search', '');
  });

  it('does nothing in production when window.va is not available', () => {
    process.env.NODE_ENV = 'production';
    if (typeof window !== 'undefined') {
      delete (window as any).va;
    }

    // @ts-ignore
    trackEvent('lab_view');

    expect(console.log).not.toHaveBeenCalled();
  });
});
