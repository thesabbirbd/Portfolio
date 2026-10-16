import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSpatialScroll } from './useSpatialScroll';

// We define our mock outside to track calls properly
const mockUseScroll = vi.fn().mockReturnValue({
  scrollY: { current: 100 },
  scrollYProgress: { current: 0.5 },
});

// Mock framer-motion
vi.mock('framer-motion', () => {
  return {
    useScroll: (...args: any[]) => mockUseScroll(...args),
  };
});

describe('useSpatialScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseScroll.mockClear();
  });

  it('should return the data from useScroll', () => {
    const { result } = renderHook(() => useSpatialScroll());

    expect(result.current).toEqual({
      scrollY: { current: 100 },
      scrollYProgress: { current: 0.5 },
    });
  });

  it('should call framer-motion useScroll', () => {
    renderHook(() => useSpatialScroll());

    expect(mockUseScroll).toHaveBeenCalledTimes(1);
  });
});
