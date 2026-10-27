"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sound";

export interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  magnetic?: boolean;
}

export function GlassButton({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  magnetic = true,
  onClick,
  ...props
}: GlassButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Effect physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const springY = useSpring(y, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Disable magnetic effect on touch devices and if user prefers reduced motion
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isTouch || prefersReducedMotion) return;
    }
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull strength (0.2)
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (magnetic) {
      x.set(0);
      y.set(0);
    }
  };

  const variants = {
    primary: "bg-primary hover:bg-primary/90 border-white/15 text-on-primary shadow-[0_8px_24px_-10px_rgb(var(--primary)/0.6)]",
    secondary: "surface-glass hover:border-primary/40 text-ink",
    danger: "bg-red-600/90 hover:bg-red-600 border-red-400/30 text-white",
    ghost: "hover:bg-ink/5 text-ink-2 border-transparent",
  };


  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-sm rounded-2xl gap-2",
    lg: "px-6 py-3 text-base rounded-2xl gap-2.5",
    icon: "p-2 rounded-xl",
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        sound.click();
        onClick?.(e);
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative flex items-center justify-center font-medium transition-colors border overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Glare Effect inside button */}
      <div className="spatial-glare opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Multi-stage prism depth (inner shadows) */}
      <div className="absolute inset-0 rounded-inherit shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)] pointer-events-none" />

      {icon && iconPosition === "left" && (
        <motion.span
          animate={{ x: isHovered ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {icon}
        </motion.span>
      )}

      <span className="relative z-10">{children as React.ReactNode}</span>

      {icon && iconPosition === "right" && (
        <motion.span
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
}
