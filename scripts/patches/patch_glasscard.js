const fs = require('fs');
let file = fs.readFileSync('src/components/ui/GlassCard.tsx', 'utf8');

const newComponent = `"use client";

import React, { useRef } from "react";
import { motion, HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  heavy?: boolean;
  glare?: boolean;
  hoverEffect?: boolean;
  glow?: "none" | "blue" | "cyan" | "purple" | "primary";
}

export function GlassCard({
  children,
  className,
  heavy = false,
  glare = true,
  hoverEffect = false,
  glow = "none",
  onMouseMove,
  onMouseLeave,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    blue: "hover:shadow-[0_12px_40px_-10px_rgba(0,114,255,0.22)] hover:border-blue-500/30",
    cyan: "hover:shadow-[0_12px_40px_-10px_rgba(0,240,255,0.22)] hover:border-cyan-500/30",
    purple: "hover:shadow-[0_12px_40px_-10px_rgba(121,40,202,0.22)] hover:border-purple-500/30",
    primary: "hover:shadow-[0_12px_40px_-10px_rgba(var(--color-primary),0.22)] hover:border-primary/30",
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mouseX.set(0);
    mouseY.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "relative rounded-3xl overflow-hidden group transition-all duration-300",
        heavy ? "spatial-glass-heavy" : "spatial-glass",
        hoverEffect && "cursor-pointer",
        glow !== "none" && glowStyles[glow],
        className
      )}
      {...props}
    >
      {glare && (
        <motion.div 
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
          style={{
            background: "radial-gradient(400px circle at var(--x, 0) var(--y, 0), rgba(255,255,255,0.06), transparent 40%)",
            x: smoothX,
            y: smoothY,
            marginLeft: -200,
            marginTop: -200,
            width: 400,
            height: 400,
          }}
        />
      )}
      
      {/* Mobile Glare Fallback */}
      {glare && (
        <div className="md:hidden spatial-glare opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      )}

      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none z-10" />
      
      <div className="relative z-10 w-full h-full">{children as any}</div>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/ui/GlassCard.tsx', newComponent);
