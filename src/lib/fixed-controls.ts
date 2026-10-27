// Shared geometry for the fixed bottom controls (MorphingNav, IdentityDock, Terminal, Settings)
// on mobile. Keeping the numbers in one place stops the controls drifting into each other.

/** Gap from the screen edge to every corner control (matches Tailwind bottom-4/left-4/right-4). */
export const MOBILE_EDGE = 16;

/** Lift applied to Terminal & Settings while the mobile nav pill is visible (pill ~48px + gap). */
export const MOBILE_CORNER_RAISE = 68;

/** Lift for the collapsed IdentityDock so it rests above the raised Settings button. */
export const MOBILE_DOCK_RAISE = 124;

/** Lift for the expanded dock when the nav is hidden, so it clears the corner buttons. */
export const MOBILE_DOCK_EXPANDED_RAISE = 60;

export const CONTROL_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.9 } as const;

const QUICK = { type: "spring", stiffness: 440, damping: 38 } as const;

/**
 * Per-axis transition for the IdentityDock so its path never crosses the Settings button:
 * when the nav hides it leaves sideways first and then descends; when the nav returns it
 * rises first and then slides over into the slot above Settings.
 */
export function dockTransition(navHidden: boolean) {
  return navHidden
    ? { x: QUICK, y: { ...CONTROL_SPRING, delay: 0.05 }, opacity: { duration: 0.2 } }
    : { y: QUICK, x: { ...CONTROL_SPRING, delay: 0.06 }, opacity: { duration: 0.2 } };
}
