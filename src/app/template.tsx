"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";
import { swapTransition } from "@/lib/motion-presets";

// The first page load must paint immediately from server HTML. Only client-side
// navigations (after the first mount) get the soft entrance transition.
let hasMountedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useSettings();
  const animateEntrance = hasMountedOnce && !reducedMotion;

  useEffect(() => {
    // Client navigations: Next aligns the new segment's top edge, which skips the page's top
    // padding; start new pages at the real top unless the link targets an anchor.
    if (hasMountedOnce && !window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    hasMountedOnce = true;
  }, []);

  return (
    <motion.div
      initial={animateEntrance ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={swapTransition}
    >
      {children}
    </motion.div>
  );
}
