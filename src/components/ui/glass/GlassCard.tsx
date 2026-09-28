"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  heavy?: boolean;
  glare?: boolean;
}

export function GlassCard({ children, className, heavy = false, glare = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl overflow-hidden group text-gray-900 dark:text-gray-100",
        heavy ? "spatial-glass-heavy" : "spatial-glass",
        className
      )}
      {...props}
    >
      {glare && (
        <div className="spatial-glare opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full">{children as any}</div>
    </motion.div>
  );
}
