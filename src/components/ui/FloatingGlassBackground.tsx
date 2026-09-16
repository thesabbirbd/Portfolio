"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Database, Server, Cloud, Cpu, Activity, ShieldAlert } from "lucide-react";

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
      {/* ================= 3 VIBRANT AMBIENT GLOW ORBS (Vibrant Orange Theme) ================= */}
      {/* 1. Vibrant Orange Orb (Top-Right / Center) */}
      <motion.div
        style={{ y: yLayer1 }}
        className="absolute top-[8%] right-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-gradient-to-br from-orange-500/25 via-red-600/20 to-transparent blur-[90px] sm:blur-[130px] animate-float-slow"
      />

      {/* 2. Vibrant Amber Orb (Mid-Left) */}
      <motion.div
        style={{ y: yLayer2 }}
        className="absolute top-[38%] left-[2%] w-[300px] sm:w-[460px] h-[300px] sm:h-[460px] rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-transparent blur-[85px] sm:blur-[120px] animate-float-reverse"
      />

      {/* 3. Radiant Red-Orange Orb (Lower-Right) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-[68%] right-[8%] w-[280px] sm:w-[440px] h-[280px] sm:h-[440px] rounded-full bg-gradient-to-tl from-red-500/25 via-orange-600/20 to-transparent blur-[80px] sm:blur-[120px] animate-float-drift"
      />

      {/* 4. Deep Crimson Depth Core (Center-Center) */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full bg-red-600/10 dark:bg-orange-500/8 blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* ================= 3D IT ELEMENTS & FLOATING GLASS GEOMETRY ================= */}
      
      {/* Floating Database Widget (Orange Specular) */}
      <motion.div
        style={{ y: yLayer1 }}
        className="hidden md:flex absolute top-[18%] left-[8%] w-44 h-24 rounded-3xl glass-spatial border border-orange-400/30 shadow-[0_12px_36px_rgba(255,106,0,0.15)] backdrop-blur-xl animate-float-slow transform -rotate-6 flex-col justify-center px-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-orange-400/10 rounded-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-xl">
            <Database className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-orange-400/80 tracking-wider">PGSQL_DB</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-slate-500 dark:text-slate-400">99.9% UP</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Server/NOC Widget (Amber Specular) */}
      <motion.div
        style={{ y: yLayer2 }}
        className="hidden md:flex absolute top-[44%] right-[6%] w-36 h-36 rounded-[2rem] glass-spatial border border-amber-500/30 shadow-[0_12px_36px_rgba(255,184,0,0.15)] backdrop-blur-xl animate-float-reverse flex-col items-center justify-center gap-3"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-amber-500/10 rounded-[2rem]" />
        <div className="relative p-3 bg-amber-500/20 rounded-2xl animate-pulse">
          <Server className="w-6 h-6 text-amber-400" />
        </div>
        <div className="relative text-[10px] font-mono text-amber-500/90 font-bold tracking-widest uppercase">
          Sys_Core
        </div>
      </motion.div>

      {/* Floating Cloud Widget (Red-Orange Specular) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="hidden md:flex absolute top-[74%] left-[10%] w-48 h-16 rounded-2xl glass-spatial border border-red-500/30 shadow-[0_12px_36px_rgba(255,51,0,0.15)] backdrop-blur-xl animate-float-drift items-center px-4 justify-between transform rotate-3"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5 rounded-2xl" />
        <div className="relative flex items-center gap-2">
          <Cloud className="w-5 h-5 text-red-400" />
          <span className="text-[10px] font-mono text-red-400 font-bold">AWS_CLOUD</span>
        </div>
        <div className="relative text-[9px] font-mono text-red-300/70">Sync...</div>
      </motion.div>

      {/* Floating Shield/Security Widget */}
      <motion.div
        style={{ y: yLayer1 }}
        className="hidden lg:flex absolute bottom-[15%] right-[20%] w-32 h-14 rounded-xl glass-spatial border border-orange-500/20 shadow-[0_8px_24px_rgba(255,106,0,0.1)] backdrop-blur-lg animate-float-slow items-center px-3 gap-2"
      >
        <ShieldAlert className="w-4 h-4 text-orange-400" />
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-orange-400/80">WAF_ACTIVE</span>
          <span className="text-[7px] text-slate-500">SEC_LEVEL_0</span>
        </div>
      </motion.div>

      {/* Subtle Star / Dot Sparkles across the viewport */}
      <div className="absolute top-[12%] left-[45%] w-1.5 h-1.5 rounded-full bg-orange-400/60 animate-ping" />
      <div className="absolute top-[58%] left-[82%] w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-ping" />
      <div className="absolute top-[82%] left-[28%] w-1.5 h-1.5 rounded-full bg-red-400/60 animate-ping" />
    </div>
  );
}
