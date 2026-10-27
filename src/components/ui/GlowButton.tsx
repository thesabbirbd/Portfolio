"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { hoverLift, pressScale } from "@/lib/motion-presets";
import { sound } from "@/lib/sound";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export function GlowButton({
  children,
  href,
  onClick,
  variant = "glass", // Changed default to new glass UI
  size = "md",
  className,
  icon,
  external = false,
}: GlowButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-[11px] sm:text-xs font-medium gap-1.5",
    md: "px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold gap-2",
    lg: "px-5 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold gap-2 sm:gap-2.5",
    icon: "p-2 sm:p-2.5",
  };

  // All colours come from design tokens (globals.css); on-primary flips to dark text in dark mode for AA contrast.
  const variantStyles = {
    primary:
      "relative bg-primary text-on-primary border border-white/15 shadow-[0_10px_28px_-10px_rgb(var(--primary)/0.7)] hover:shadow-[0_14px_34px_-10px_rgb(var(--primary)/0.85)] overflow-hidden",
    secondary:
      "surface-elevated text-ink hover:border-primary/40",
    outline:
      "bg-transparent text-ink border border-line-strong hover:border-primary/50 hover:bg-primary/5",
    ghost:
      "bg-transparent text-ink-2 hover:text-ink hover:bg-ink/5",
    glass:
      "relative surface-glass text-ink hover:border-primary/40 overflow-hidden",
  };


  const classes = cn(
    // Only paint properties transition in CSS; transforms are owned by Framer Motion.
    "inline-flex items-center justify-center rounded-full transition-[background-color,border-color,box-shadow,opacity,color] duration-300 select-none cursor-pointer group",
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const inner = (
    <>
      {/* Specular top edge for glass */}
      {variant === "glass" && (
        <span aria-hidden="true" className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] pointer-events-none" />
      )}

      {/* Light sheen effect on hover */}
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out-expo bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />
      
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5 z-10">{icon}</span>}
      <span className="z-10 tracking-wide">{children}</span>
    </>
  );

  const focusRing = "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (href) {
    const content = (
      <motion.span whileHover={hoverLift} whileTap={pressScale} className={classes} onClick={onClick}>
        {inner}
      </motion.span>
    );
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cn("inline-block", focusRing)}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cn("inline-block", focusRing)}>
        {content}
      </Link>
    );
  }

  // No destination: render a real <button> so it is focusable and keyboard-operable.
  return (
    <motion.button type="button" whileHover={hoverLift} whileTap={pressScale} className={cn(classes, focusRing)} onClick={onClick}>
      {inner}
    </motion.button>
  );
}
