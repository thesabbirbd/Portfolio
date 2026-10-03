const fs = require('fs');

const newContent = `"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, MoveHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // "default" | "button" | "internal" | "external" | "image" | "drag"
  const [cursorState, setCursorState] = useState("default");
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Angle tracking
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { damping: 20, stiffness: 300, mass: 0.1 });

  // Velocity-aware smooth values
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Refs for tracking previous positions for angle calculation
  const posRef = useRef({ x: -1000, y: -1000, angle: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (localStorage.getItem("sabbir_reduced_motion") === "true") return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      
      mouseX.set(cx);
      mouseY.set(cy);

      if (posRef.current.x !== -1000) {
        const dx = cx - posRef.current.x;
        const dy = cy - posRef.current.y;
        
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
          let currentAngle = posRef.current.angle;
          
          let deltaAngle = targetAngle - currentAngle;
          deltaAngle = ((deltaAngle + 180) % 360) - 180;
          if (deltaAngle < -180) deltaAngle += 360;
          
          const newAngle = currentAngle + deltaAngle;
          
          posRef.current.angle = newAngle;
          rotation.set(newAngle);
          
          posRef.current.x = cx;
          posRef.current.y = cy;
        }
      } else {
        posRef.current.x = cx;
        posRef.current.y = cy;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const id = Date.now();
      setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Clean up smoke effect after 0.5s (500ms)
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 500);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const link = target.closest("a");
      const button = target.closest("button") || target.closest("[role='button']") || target.classList.contains("cursor-pointer");
      const img = target.closest("img") || target.classList.contains("cursor-crosshair") || target.classList.contains("spatial-glass");
      const drag = target.classList.contains("cursor-grab") || target.classList.contains("cursor-grabbing");

      if (drag) {
        setCursorState("drag");
      } else if (link) {
        const href = link.getAttribute("href");
        if (href && (href.startsWith("http") || href.startsWith("mailto"))) {
          setCursorState("external");
        } else {
          setCursorState("internal");
        }
      } else if (img && !button && !link) {
        setCursorState("image");
      } else if (button) {
        setCursorState("button");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, pathname, rotation]);

  if (!isVisible) return null;

  // Determine colors based on state so it feels colorful and theme-aware
  const getIconColor = () => {
    switch(cursorState) {
      case "internal": return "text-[var(--color-primary)]";
      case "external": return "text-blue-500 dark:text-blue-400"; 
      case "image": return "text-emerald-500 dark:text-emerald-400";
      case "drag": return "text-amber-500 dark:text-amber-400";
      default: return "text-foreground";
    }
  };

  const getBorderColor = () => {
    if (cursorState === "button" || cursorState === "internal") return "border-[var(--color-primary)]";
    if (cursorState === "external") return "border-blue-500/50";
    if (cursorState === "image") return "border-emerald-500/50";
    if (cursorState === "drag") return "border-amber-500/50";
    return "border-foreground/30";
  };

  const getBgColor = () => {
    if (cursorState === "button" || cursorState === "internal") return "bg-[var(--color-primary)]/10";
    if (cursorState === "external") return "bg-blue-500/10";
    if (cursorState === "image") return "bg-emerald-500/10";
    if (cursorState === "drag") return "bg-amber-500/10";
    return "bg-transparent";
  };

  return (
    <div className="pointer-events-none hidden md:block fixed inset-0 z-[9999] overflow-hidden">
      
      {/* Smoke Effects Container */}
      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            initial={{ opacity: 0.6, scale: 0.2, filter: "blur(2px)" }}
            animate={{ opacity: 0, scale: 3.5, filter: "blur(12px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute rounded-full bg-[var(--color-primary)] pointer-events-none"
            style={{
              left: click.x - 20,
              top: click.y - 20,
              width: 40,
              height: 40,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Companion Ring */}
      <motion.div
        className={\`absolute top-0 left-0 flex items-center justify-center backdrop-blur-[2px] transition-colors duration-300 \${getBgColor()}\`}
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: cursorState === "default" ? 14 : cursorState === "button" ? 32 : 28,
          height: cursorState === "default" ? 14 : cursorState === "button" ? 32 : 28,
          borderRadius: cursorState === "button" ? "8px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className={\`absolute inset-0 rounded-inherit border \${getBorderColor()} transition-colors duration-300\`} />
        
        {/* Dynamic Colorful Icons */}
        <motion.div
          initial={false}
          animate={{ opacity: cursorState !== "default" && cursorState !== "button" ? 1 : 0 }}
          className={\`absolute flex items-center justify-center drop-shadow-md \${getIconColor()}\`}
        >
          {cursorState === "internal" && (
            <motion.div style={{ rotate: smoothRotation }}>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.div>
          )}
          {cursorState === "external" && (
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {cursorState === "image" && <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />}
          {cursorState === "drag" && <MoveHorizontal className="w-3 h-3" strokeWidth={2.5} />}
        </motion.div>
      </motion.div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/ui/CustomCursor.tsx', newContent);
