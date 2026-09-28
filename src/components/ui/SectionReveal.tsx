"use client";

import React from "react";
import { motion } from "framer-motion";
import { revealUp } from "@/lib/motion-presets";
import { useSettings } from "@/contexts/SettingsContext";

export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reducedMotion } = useSettings();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={revealUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
