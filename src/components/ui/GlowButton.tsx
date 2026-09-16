"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
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
    sm: "px-4 py-1.5 text-xs font-medium gap-1.5",
    md: "px-6 py-2.5 text-sm font-semibold gap-2",
    lg: "px-8 py-3.5 text-base font-semibold gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[var(--color-primary)] text-white shadow-[0_4px_24px_var(--color-primary)] opacity-90 hover:opacity-100 hover:shadow-[0_8px_32px_var(--color-primary)] border border-white/20",
    secondary:
      "bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 hover:border-[var(--color-primary)] hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm",
    outline:
      "bg-transparent text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700/80 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
    
    // New Webflow Glass UI
    glass: "relative bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-[6px] border border-[rgba(255,255,255,0.4)] dark:border-[rgba(255,255,255,0.15)] text-slate-800 dark:text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[rgba(255,255,255,0.3)] dark:hover:bg-[rgba(255,255,255,0.1)] overflow-hidden"
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-300 select-none cursor-pointer group",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      {/* Specular Inner Shadow for Glass UI */}
      {variant === "glass" && (
        <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none" />
      )}
      
      {/* Dynamic Hover Glow corresponding to Theme */}
      {variant === "glass" && (
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" style={{ background: "radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)" }} />
      )}

      {/* Light sheen effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />
      
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5 z-10">{icon}</span>}
      <span className="z-10 tracking-wide">{children}</span>
    </motion.div>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {buttonContent}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}
