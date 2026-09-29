const fs = require('fs');

const newContent = `"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, MoveHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const SMOKE_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-[var(--color-primary)]"
];

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // "default" | "button" | "internal" | "external" | "image" | "drag"
  const [cursorState, setCursorState] = useState("default");
  
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Angle tracking
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { damping: 20, stiffness: 300, mass: 0.1 });

  // Velocity-aware smooth values
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Refs for tracking previous positions
  const posRef = useRef({ x: -1000, y: -1000, angle: 0 });
  const lastTrailRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (localStorage.getItem("sabbir_reduced_motion") === "true") return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      
      mouseX.set(cx);
      mouseY.set(cy);

      // --- Direction / Rotation Logic ---
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

      // --- Smoke Trail Logic ---
      if (lastTrailRef.current.x !== -1000) {
        const dist = Math.hypot(cx - lastTrailRef.current.x, cy - lastTrailRef.current.y);
        if (dist > 15) { // Drop a smoke particle every 15px
          const id = Date.now() + Math.random();
          const color = SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)];
          
          setTrails((prev) => [...prev.slice(-25), { id, x: cx, y: cy, color }]); // Keep max 25 elements to prevent lag
          lastTrailRef.current = { x: cx, y: cy };
          
          setTimeout(() => {
            setTrails((prev) => prev.filter((t) => t.id !== id));
          }, 500); // Fades out perfectly in 0.5s
        }
      } else {
        lastTrailRef.current = { x: cx, y: cy };
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const id = Date.now();
      const color = SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)];
      setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY, color }]);
      
      // Clean up smoke burst after 0.5s (500ms)
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

  // Determine colors based on state
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
      
      {/* Smoke Tail (Trails) */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          initial={{ opacity: 0.5, scale: 0.2, filter: "blur(3px)" }}
          animate={{ opacity: 0, scale: 1.5, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={\`absolute rounded-full pointer-events-none \${trail.color}\`}
          style={{
            left: trail.x - 10,
            top: trail.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Smoke Burst (Clicks) */}
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          initial={{ opacity: 0.8, scale: 0.2, filter: "blur(2px)" }}
          animate={{ opacity: 0, scale: 4, filter: "blur(16px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={\`absolute rounded-full pointer-events-none \${click.color}\`}
          style={{
            left: click.x - 25,
            top: click.y - 25,
            width: 50,
            height: 50,
          }}
        />
      ))}

      {/* Companion Ring */}
      <motion.div
        className={\`absolute top-0 left-0 flex items-center justify-center backdrop-blur-[2px] transition-colors duration-300 \${getBgColor()}\`}
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: cursorState === "default" ? 14 : cursorState === "button" ? 36 : 30,
          height: cursorState === "default" ? 14 : cursorState === "button" ? 36 : 30,
          borderRadius: "9999px", // ALWAYS CIRCLE
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className={\`absolute inset-0 rounded-full border \${getBorderColor()} transition-colors duration-300\`} />
        
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
