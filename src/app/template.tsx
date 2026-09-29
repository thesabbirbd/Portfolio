"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

export default function Template({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useSettings();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
