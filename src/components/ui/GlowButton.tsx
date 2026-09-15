"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  icon,
  external = false,
}: GlowButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-7 py-3.5 text-base font-semibold gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 text-white shadow-[0_0_24px_rgba(0,114,255,0.35)] hover:shadow-[0_0_32px_rgba(0,240,255,0.5)] border border-white/20",
    secondary:
      "bg-white/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm",
    outline:
      "bg-transparent text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700/80 hover:border-cyan-400/60 hover:bg-cyan-500/5",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer relative overflow-hidden group",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      {/* Light sheen effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      <span>{children}</span>
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
