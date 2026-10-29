import { describe, it, expect } from 'vitest';
import { dockTransition } from './fixed-controls';

describe('dockTransition', () => {
  it('returns correct transition when nav is hidden', () => {
    const result = dockTransition(true);
    expect(result).toEqual({
      x: { type: 'spring', stiffness: 440, damping: 38 },
      y: { type: 'spring', stiffness: 300, damping: 30, mass: 0.9, delay: 0.05 },
      opacity: { duration: 0.2 },
    });
  });

  it('returns correct transition when nav is visible', () => {
    const result = dockTransition(false);
    expect(result).toEqual({
      y: { type: 'spring', stiffness: 440, damping: 38 },
      x: { type: 'spring', stiffness: 300, damping: 30, mass: 0.9, delay: 0.06 },
      opacity: { duration: 0.2 },
    });
  });
});
