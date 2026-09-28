"use client";

import { useScroll } from "framer-motion";

/**
 * useSpatialScroll - Centralized scroll tracking using Framer Motion.
 * Lenis is initialized globally via SmoothScroll.tsx and seamlessly 
 * synchronizes with window scroll events, which Framer's useScroll hook reads.
 * 
 * Do NOT use addEventListener('scroll') in components directly.
 * Use this hook to get `scrollY` or `scrollYProgress` MotionValues.
 */
export function useSpatialScroll() {
  const scrollData = useScroll();
  return scrollData;
}
