"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: "none" | "blue" | "cyan" | "purple";
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  glow = "blue",
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    blue: "hover:shadow-[0_12px_40px_-10px_rgba(0,114,255,0.22)] hover:border-blue-500/30",
    cyan: "hover:shadow-[0_12px_40px_-10px_rgba(0,240,255,0.22)] hover:border-[var(--color-secondary)]/30",
    purple: "hover:shadow-[0_12px_40px_-10px_rgba(121,40,202,0.22)] hover:border-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
        hoverEffect && "glass-panel-hover cursor-pointer",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {/* Subtle top edge refraction highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
