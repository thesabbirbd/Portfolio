"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function FloatingGlassBackground() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Gentle scroll parallax offsets for different layers
  const yLayer1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], [0, 140]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 max-w-full"
    >
      {/* ================= 3 VIBRANT AMBIENT GLOW ORBS ================= */}
      {/* 1. Vibrant Electric Cyan Orb (Top-Right / Center) */}
      <motion.div
        style={{ y: yLayer1 }}
        className="absolute top-[8%] right-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-gradient-to-br from-cyan-400/25 via-blue-600/20 to-transparent blur-[90px] sm:blur-[130px] animate-float-slow"
      />

      {/* 2. Vibrant Neon Purple Orb (Mid-Left) */}
      <motion.div
        style={{ y: yLayer2 }}
        className="absolute top-[38%] left-[2%] w-[300px] sm:w-[460px] h-[300px] sm:h-[460px] rounded-full bg-gradient-to-tr from-purple-600/25 via-fuchsia-500/20 to-transparent blur-[85px] sm:blur-[120px] animate-float-reverse"
      />

      {/* 3. Vibrant Radiant Emerald Orb (Lower-Right) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-[68%] right-[8%] w-[280px] sm:w-[440px] h-[280px] sm:h-[440px] rounded-full bg-gradient-to-tl from-emerald-400/25 via-teal-500/20 to-transparent blur-[80px] sm:blur-[120px] animate-float-drift"
      />

      {/* 4. Deep Indigo Depth Core (Center-Center) */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full bg-blue-600/10 dark:bg-cyan-500/8 blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* ================= OMNIDESK SPATIAL FLOATING GLASS GEOMETRIC SHAPES ================= */}
      {/* Floating Spatial Glass Capsule 1 (Cyan Specular) */}
      <motion.div
        style={{ y: yLayer1 }}
        className="hidden md:block absolute top-[18%] left-[8%] w-36 h-20 rounded-3xl glass-spatial border border-cyan-400/30 shadow-[0_12px_36px_rgba(0,240,255,0.15)] backdrop-blur-xl animate-float-slow transform -rotate-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-cyan-400/10 rounded-3xl" />
        <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYS // NODE_01</span>
        </div>
      </motion.div>

      {/* Floating Spatial Glass Ring 2 (Purple Specular) */}
      <motion.div
        style={{ y: yLayer2 }}
        className="hidden md:block absolute top-[44%] right-[6%] w-28 h-28 rounded-full glass-spatial border border-purple-500/30 shadow-[0_12px_36px_rgba(168,85,247,0.15)] backdrop-blur-xl animate-float-reverse flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full border border-dashed border-purple-400/40 animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-3 h-3 rounded-full bg-purple-500/60 blur-xs" />
      </motion.div>

      {/* Floating Spatial Glass Capsule 3 (Emerald Specular) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="hidden md:block absolute top-[74%] left-[10%] w-40 h-16 rounded-2xl glass-emerald border border-emerald-500/30 shadow-[0_12px_36px_rgba(16,185,129,0.15)] backdrop-blur-xl animate-float-drift flex items-center px-4 justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold">SPATIAL // CORE</span>
        </div>
        <div className="text-[9px] font-mono text-emerald-300/70">v2.0</div>
      </motion.div>

      {/* Subtle Star / Dot Sparkles across the viewport */}
      <div className="absolute top-[12%] left-[45%] w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-ping" />
      <div className="absolute top-[58%] left-[82%] w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-ping" />
      <div className="absolute top-[82%] left-[28%] w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-ping" />
    </div>
  );
}
