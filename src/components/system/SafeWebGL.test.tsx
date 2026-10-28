import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

// Common mock for document.createElement('canvas') context setup
function setupMockCanvas(originalCreateElement: any, contextId: string | null = 'webgl2', shouldThrow = false) {
  const mockLoseContext = vi.fn();
  const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

  document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
    if (tagName === 'canvas') {
      return {
        getContext: vi.fn((id: string) => {
          if (shouldThrow) {
            throw new Error('Not supported');
          }
          if (id === contextId) {
            return { getExtension: mockGetExtension };
          }
          return null;
        })
      } as unknown as HTMLCanvasElement;
    }
    return originalCreateElement(tagName, options);
  }) as any;

  return { mockGetExtension, mockLoseContext };
}

// Reusable component test setup helper
async function renderSafeWebGL(fallbackText: string = 'Fallback', childText: string = 'Child', ThrowError?: React.ComponentType) {
  vi.resetModules();
  const { SafeWebGL } = await import('./SafeWebGL');

  render(
    <SafeWebGL fallback={<div data-testid="fallback">{fallbackText}</div>}>
      {ThrowError ? <ThrowError /> : <div data-testid="child">{childText}</div>}
    </SafeWebGL>
  );
}

describe('SafeWebGL', () => {
  let hasWebGL: any;
  const originalCreateElement = document.createElement.bind(document);
  let consoleWarnMock: any;

  beforeEach(async () => {
    vi.resetModules();
    cleanup(); // clean up DOM between tests
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // We import dynamically so any module state is reset for hasWebGL tests
    const mod = await import('./SafeWebGL');
    hasWebGL = mod.hasWebGL;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  describe('hasWebGL', () => {
    it('returns true if webgl2 context is available', () => {
      const { mockGetExtension, mockLoseContext } = setupMockCanvas(originalCreateElement, 'webgl2');
      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns true if webgl context is available as fallback', () => {
      const { mockGetExtension, mockLoseContext } = setupMockCanvas(originalCreateElement, 'webgl');
      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns false if no webgl context is available', () => {
      setupMockCanvas(originalCreateElement, null);
      expect(hasWebGL()).toBe(false);
    });

    it('returns false if getContext throws an error', () => {
      setupMockCanvas(originalCreateElement, null, true);
      expect(hasWebGL()).toBe(false);
    });
  });

  describe('SafeWebGL component', () => {
    it('renders fallback when WebGL is not supported', async () => {
      setupMockCanvas(originalCreateElement, null);
      await renderSafeWebGL();

      expect(screen.getByTestId('fallback')).toBeDefined();
      expect(screen.queryByTestId('child')).toBeNull();
    });

    it('renders children when WebGL is supported', async () => {
      setupMockCanvas(originalCreateElement, 'webgl2');
      await renderSafeWebGL();

      expect(screen.getByTestId('child')).toBeDefined();
      expect(screen.queryByTestId('fallback')).toBeNull();
    });

    it('catches runtime WebGL errors and shows fallback', async () => {
      setupMockCanvas(originalCreateElement, 'webgl2');

      const ThrowError = () => {
        throw new Error('Error creating WebGL context');
        return null;
      };

      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      await renderSafeWebGL('Fallback', 'Child', ThrowError);

      expect(screen.getByTestId('fallback')).toBeDefined();
      expect(consoleWarnMock).toHaveBeenCalledWith(
        "[3D] disabled after a WebGL error:",
        "Error creating WebGL context"
      );

      consoleErrorMock.mockRestore();
    });
  });
});
