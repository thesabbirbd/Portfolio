const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CustomCursor.tsx', 'utf8');

const newContent = `"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, MoveHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // "default" | "button" | "internal" | "external" | "image" | "drag"
  const [cursorState, setCursorState] = useState("default");

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
        
        // Use a threshold so tiny jitter doesn't cause erratic spins
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
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, pathname, rotation]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none hidden md:block mix-blend-difference fixed inset-0 z-[9999] overflow-hidden">
      {/* Hyper Compact Companion */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center text-white"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: cursorState === "default" ? 8 : cursorState === "button" ? 16 : 14,
          height: cursorState === "default" ? 8 : cursorState === "button" ? 16 : 14,
          backgroundColor: cursorState === "button" ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
          border: cursorState === "default" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: cursorState === "button" ? "4px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: cursorState !== "default" && cursorState !== "button" ? 1 : 0 }}
          className="absolute flex items-center justify-center"
        >
          {cursorState === "internal" && (
            <motion.div style={{ rotate: smoothRotation }}>
              <ArrowRight className="w-2 h-2" strokeWidth={3} />
            </motion.div>
          )}
          {cursorState === "external" && (
            // External arrow doesn't rotate with mouse, it always points out
            <ArrowUpRight className="w-2 h-2" strokeWidth={3} />
          )}
          {cursorState === "image" && <Plus className="w-2 h-2" strokeWidth={3} />}
          {cursorState === "drag" && <MoveHorizontal className="w-2 h-2" strokeWidth={3} />}
        </motion.div>
      </motion.div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/ui/CustomCursor.tsx', newContent);
