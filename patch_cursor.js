const fs = require('fs');
let content = `
"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Plus } from "lucide-react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Instant values for the dot
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring values for the trailing ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (localStorage.getItem("sabbir_reduced_motion") === "true") return;

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none hidden md:block">
      {/* 1. Instant tiny dot/crosshair */}
      <motion.div
        className="fixed top-0 left-0 z-[100] flex items-center justify-center mix-blend-difference text-white"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      >
        <Plus className={\`transition-all duration-300 \${isHovering ? 'w-4 h-4 opacity-100 rotate-90' : 'w-2 h-2 opacity-50'}\`} strokeWidth={3} />
      </motion.div>

      {/* 2. Smooth trailing digital ring */}
      <motion.div
        className="fixed top-0 left-0 z-[90] rounded-full border-[1.5px] border-[var(--color-primary)] mix-blend-screen shadow-[0_0_10px_var(--color-primary)]"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
          backgroundColor: isHovering ? "color-mix(in srgb, var(--color-primary) 15%, transparent)" : "transparent",
        }}
        transition={{ type: "tween", duration: 0.2 }}
      />
    </div>
  );
}
`;

fs.writeFileSync('src/components/ui/CustomCursor.tsx', content);
