import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { DeferredThirdParty } from './DeferredThirdParty';

const scripts = () => [...document.head.querySelectorAll('script')].map((s) => s.src);

describe('DeferredThirdParty', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.head.innerHTML = '';
    vi.stubEnv('NODE_ENV', 'production');
    // jsdom has no requestIdleCallback: the component falls back to loading directly.
    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('does not load analytics during the first seconds after load', () => {
    render(<DeferredThirdParty />);
    vi.advanceTimersByTime(3000);
    expect(scripts()).toHaveLength(0);
  });

  it('loads GA and Clarity once the page has settled', () => {
    render(<DeferredThirdParty />);
    vi.advanceTimersByTime(3600);
    const src = scripts();
    expect(src.some((s) => s.includes('googletagmanager.com/gtag/js?id=G-47T386XBN6'))).toBe(true);
    expect(src.some((s) => s.includes('clarity.ms/tag/ypf1mf272k'))).toBe(true);
  });

  it('never loads analytics outside production builds', () => {
    vi.stubEnv('NODE_ENV', 'development');
    render(<DeferredThirdParty />);
    vi.advanceTimersByTime(10000);
    expect(scripts()).toHaveLength(0);
  });
});
