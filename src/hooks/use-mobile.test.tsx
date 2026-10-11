import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMobile } from './use-mobile';
import { useMediaQuery } from './use-media-query';

// Mock the useMediaQuery hook
vi.mock('./use-media-query', () => ({
  useMediaQuery: vi.fn(),
}));

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useMediaQuery with the correct breakpoint query and default value', () => {
    // Setup the mock to return a specific value, though we only care about the arguments
    (useMediaQuery as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderHook(() => useIsMobile());

    // Mobile breakpoint is 1024, so it should query max-width: 1023px
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith('(max-width: 1023px)', false);
  });

  it('should return true when useMediaQuery returns true', () => {
    (useMediaQuery as ReturnType<typeof vi.fn>).mockReturnValue(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false when useMediaQuery returns false', () => {
    (useMediaQuery as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});
