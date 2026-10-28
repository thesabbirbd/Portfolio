import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

function createMockCanvasContext(contextId: string, getExtensionMock: any) {
  return {
    getContext: vi.fn((id: string) => {
      if (id === contextId) {
        return { getExtension: getExtensionMock };
      }
      return null;
    })
  } as unknown as HTMLCanvasElement;
}

function mockCreateElement(tagNameMatcher: (tagName: string, options?: ElementCreationOptions) => any, originalCreateElement: any) {
  document.createElement = vi.fn((tagName: string, options?: ElementCreationOptions) => {
    const matched = tagNameMatcher(tagName, options);
    if (matched) return matched;
    return originalCreateElement(tagName, options);
  }) as any;
}

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
    const setupContextMock = (contextType: string) => {
      const mockLoseContext = vi.fn();
      const mockGetExtension = vi.fn().mockReturnValue({ loseContext: mockLoseContext });
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') return createMockCanvasContext(contextType, mockGetExtension);
        return null;
      }, originalCreateElement);
      return { mockGetExtension, mockLoseContext };
    };

    it('returns true if webgl2 context is available', () => {
      const { mockGetExtension, mockLoseContext } = setupContextMock('webgl2');
      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns true if webgl context is available as fallback', () => {
      const { mockGetExtension, mockLoseContext } = setupContextMock('webgl');
      expect(hasWebGL()).toBe(true);
      expect(mockGetExtension).toHaveBeenCalledWith('WEBGL_lose_context');
      expect(mockLoseContext).toHaveBeenCalled();
    });

    it('returns false if no webgl context is available', () => {
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') {
          return { getContext: vi.fn(() => null) } as unknown as HTMLCanvasElement;
        }
        return null;
      }, originalCreateElement);
      expect(hasWebGL()).toBe(false);
    });

    it('returns false if getContext throws an error', () => {
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') {
          return { getContext: vi.fn(() => { throw new Error('Not supported'); }) } as unknown as HTMLCanvasElement;
        }
        return null;
      }, originalCreateElement);
      expect(hasWebGL()).toBe(false);
    });
  });

  describe('SafeWebGL component', () => {
    it('renders fallback when WebGL is not supported', async () => {
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') {
          return { getContext: vi.fn(() => null) } as unknown as HTMLCanvasElement;
        }
        return null;
      }, originalCreateElement);

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
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') return createMockCanvasContext('webgl2', mockGetExtension);
        return null;
      }, originalCreateElement);

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
      mockCreateElement((tagName) => {
        if (tagName === 'canvas') return createMockCanvasContext('webgl2', mockGetExtension);
        return null;
      }, originalCreateElement);

      vi.resetModules();
      const { SafeWebGL: SafeWebGLWithWebGL } = await import('./SafeWebGL');

      const ThrowError = () => {
        throw new Error('Error creating WebGL context');
        return null;
      };

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
