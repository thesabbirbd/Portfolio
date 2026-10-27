"use client";

import { useScroll } from "framer-motion";

/**
 * useSpatialScroll - Centralized scroll tracking using Framer Motion.
 * Scrolling is native (no smooth-scroll library); Framer's useScroll reads window scroll.
 *
 * Do NOT use addEventListener('scroll') in components directly.
 * Use this hook to get `scrollY` or `scrollYProgress` MotionValues.
 */
export function useSpatialScroll() {
  const scrollData = useScroll();
  return scrollData;
}
