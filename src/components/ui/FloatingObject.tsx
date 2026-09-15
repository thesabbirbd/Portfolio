"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingObjectProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
  rotate?: number;
}

export function FloatingObject({
  children,
  className,
  duration = 5,
  delay = 0,
  distance = 8,
  rotate = 1.5,
}: FloatingObjectProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
        rotate: [0, rotate, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
