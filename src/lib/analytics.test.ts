import { test, describe, vi as mock, beforeEach, afterEach } from 'vitest';
import { trackEvent } from './analytics.ts';

describe('trackEvent', () => {
  let originalWindow: typeof globalThis.window | undefined;

  beforeEach(() => {
    originalWindow = globalThis.window;
  });

  afterEach(() => {
    // Restore global window
    if (originalWindow === undefined) {
      // @ts-ignore
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  test('should not throw if window is undefined', ({ expect }) => {
    // @ts-ignore
    delete globalThis.window;
    expect(() => {
      trackEvent('content_view');
    }).not.toThrow();
  });

  test('should not throw if window.va is undefined', ({ expect }) => {
    // @ts-ignore
    globalThis.window = {} as any;
    expect(() => {
      trackEvent('content_view');
    }).not.toThrow();
  });

  test('should call window.va with correct arguments', ({ expect }) => {
    const vaMock = mock.fn();
    // @ts-ignore
    globalThis.window = { va: vaMock } as any;

    trackEvent('project_view', { projectId: 123 });

    expect(vaMock).toHaveBeenCalledTimes(1);
    expect(vaMock).toHaveBeenCalledWith('event', 'project_view', { projectId: 123 });
  });
});
