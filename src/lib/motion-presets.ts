import { Variants } from "framer-motion";

// Unified motion vocabulary (v4.0.1). Seconds here mirror the CSS tokens in globals.css:
// --dur-fast 150ms · --dur-base 300ms · --dur-slow 500ms · --ease-out-expo (= ease.spatial).
// Rules: animate transform/opacity only, one owner per property, reduced motion handled by
// MotionPreferences (MotionConfig) for Framer and by the global CSS rules for everything else.
export const duration = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
};

export const ease = {
  standard: [0.2, 0, 0, 1], // Deceleration
  emphasized: [0.2, 0, 0.2, 1], // Standard symmetric
  spatial: [0.16, 1, 0.3, 1], // Apple-like smooth spatial ease
  mobileStandard: [0.4, 0, 0.2, 1], // optimized for mobile
  mobileSpatial: [0.2, 0.8, 0.2, 1], // smoother for mobile
} satisfies Record<string, [number, number, number, number]>;

/** Route/content swap: a short rise + fade, used by the route template and the hero role line. */
export const swapTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

export const springs = {
  soft: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
  balanced: { type: "spring", stiffness: 200, damping: 20, mass: 1 },
  heavy: { type: "spring", stiffness: 300, damping: 30, mass: 1.5 },
} as const;

// Layout Transitions
export const layoutTransition = {
  ...springs.balanced,
};

// Common Variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.normal, ease: ease.spatial } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal, ease: ease.standard } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.balanced },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Micro-interactions
export const hoverLift = {
  scale: 1.02,
  y: -2,
  transition: springs.balanced,
};

export const pressScale = {
  scale: 0.97,
  transition: springs.balanced,
};

// Preserving legacy for backward compatibility during migration
export const springConfig = springs.soft;
export const revealUp = fadeUp;
export const revealUpStaggered = staggerContainer;
export const hoverSoft = { scale: 1.02, transition: springs.balanced };
export const pressSoft = { scale: 0.97, transition: springs.balanced };
export const glassFocus = { boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" };
