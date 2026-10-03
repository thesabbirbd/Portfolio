"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function LiquidBackground() {
  const { scrollY } = useScroll();
  
  // Parallax translation for the orbs based on scroll
  const y1 = useTransform(scrollY, [0, 3000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -600]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -400]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50 bg-background transition-colors duration-500">
      {/* Dark Subtle Grid */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.05] dark:opacity-[0.03] dark:invert-0 invert" />
      
      {/* Liquid Blurred Orbs with Cinematic Scroll */}
      <motion.div
        style={{ y: y1 }}
        animate={{ x: [0, 50, 0, -50, 0], scale: [1, 1.1, 1, 0.9, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen will-change-transform transform-gpu"
      />
      <motion.div
        style={{ y: y2 }}
        animate={{ x: [0, -60, 0, 60, 0], scale: [1, 0.9, 1.1, 1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen will-change-transform transform-gpu"
      />
      <motion.div
        style={{ y: y3 }}
        animate={{ x: [0, 40, -40, 0], scale: [1, 1.05, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] left-[30%] w-[35vw] h-[35vw] min-w-[350px] min-h-[350px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen will-change-transform transform-gpu"
      />
    </div>
  );
}
