import { describe, it, expect } from 'vitest';
import { dockTransition } from './fixed-controls';

describe('dockTransition', () => {
  it('should return correct transition when navHidden is true', () => {
    const result = dockTransition(true);

    expect(result).toMatchObject({
      x: { type: 'spring', stiffness: 440, damping: 38 },
      y: { type: 'spring', stiffness: 300, damping: 30, mass: 0.9, delay: 0.05 },
      opacity: { duration: 0.2 }
    });
  });

  it('should return correct transition when navHidden is false', () => {
    const result = dockTransition(false);

    expect(result).toMatchObject({
      y: { type: 'spring', stiffness: 440, damping: 38 },
      x: { type: 'spring', stiffness: 300, damping: 30, mass: 0.9, delay: 0.06 },
      opacity: { duration: 0.2 }
    });
  });
});
