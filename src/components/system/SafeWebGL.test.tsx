import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

// The problem is that the state (`webglProbe`) inside `SafeWebGL.tsx` is being shared across tests.
// Let's reset modules and require the component dynamically inside `beforeEach`.
describe('SafeWebGL', () => {
  let hasWebGL: any;
  let SafeWebGL: any;

  const originalCreateElement = document.createElement.bind(document);
  let consoleWarnMock: any;

  beforeEach(async () => {
    vi.resetModules();
    cleanup(); // clean up DOM between tests
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // We import dynamically so any module state is reset
    const mod = await import('./SafeWebGL');
    hasWebGL = mod.hasWebGL;
    SafeWebGL = mod.SafeWebGL;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  describe('hasWebGL', () => {
    it('returns true if webgl2 context is available', () => {
      const mockLoseContext = vi.fn();
      const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn((contextId: string) => {
              if (contextId === 'webgl2') {
                return { getExtension: mockGetExtension };
              }
              return null;
            })
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns true if webgl context is available as fallback', () => {
      const mockLoseContext = vi.fn();
      const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn((contextId: string) => {
              if (contextId === 'webgl') {
                return { getExtension: mockGetExtension };
              }
              return null;
            })
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns false if no webgl context is available', () => {
      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn(() => null)
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      expect(hasWebGL()).toBe(false);
    });

    it('returns false if getContext throws an error', () => {
      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn(() => {
              throw new Error('Not supported');
            })
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      expect(hasWebGL()).toBe(false);
    });
  });

  describe('SafeWebGL component', () => {
    it('renders fallback when WebGL is not supported', async () => {
      // Mock hasWebGL to return false *before* importing
      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn(() => null)
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      vi.resetModules();
      const { SafeWebGL: SafeWebGLNoWebGL } = await import('./SafeWebGL');

      render(
        <SafeWebGLNoWebGL fallback={<div data-testid="fallback">Fallback</div>}>
          <div data-testid="child">Child</div>
        </SafeWebGLNoWebGL>
      );

      expect(screen.getByTestId('fallback')).toBeDefined();
      expect(screen.queryByTestId('child')).toBeNull();
    });

    it('renders children when WebGL is supported', async () => {
      const mockLoseContext = vi.fn();
      const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn((contextId: string) => {
              if (contextId === 'webgl2') {
                return { getExtension: mockGetExtension };
              }
              return null;
            })
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      vi.resetModules();
      const { SafeWebGL: SafeWebGLWithWebGL } = await import('./SafeWebGL');

      render(
        <SafeWebGLWithWebGL fallback={<div data-testid="fallback">Fallback</div>}>
          <div data-testid="child">Child</div>
        </SafeWebGLWithWebGL>
      );

      expect(screen.getByTestId('child')).toBeDefined();
      expect(screen.queryByTestId('fallback')).toBeNull();
    });

    it('catches runtime WebGL errors and shows fallback', async () => {
      const mockLoseContext = vi.fn();
      const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });

      document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn((contextId: string) => {
              if (contextId === 'webgl2') {
                return { getExtension: mockGetExtension };
              }
              return null;
            })
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName, options);
      }) as any;

      vi.resetModules();
      const { SafeWebGL: SafeWebGLWithWebGL } = await import('./SafeWebGL');

      const ThrowError = () => {
        throw new Error('Error creating WebGL context');
        return null;
      };

      // Suppress React error logging in console just for this test to avoid noisy output
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <SafeWebGLWithWebGL fallback={<div data-testid="fallback">Fallback</div>}>
          <ThrowError />
        </SafeWebGLWithWebGL>
      );

      expect(screen.getByTestId('fallback')).toBeDefined();
      expect(consoleWarnMock).toHaveBeenCalledWith(
        "[3D] disabled after a WebGL error:",
        "Error creating WebGL context"
      );

      consoleErrorMock.mockRestore();
    });
  });
});
