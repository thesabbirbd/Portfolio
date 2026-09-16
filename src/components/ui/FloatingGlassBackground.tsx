"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Database, Server, Cloud, ShieldAlert, Cpu, Terminal, Layout, Fingerprint, Network } from "lucide-react";

export function FloatingGlassBackground() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Scroll Parallax: Negative values mean they move UPWARDS as you scroll DOWN.
  // Large negative values make them move faster (stronger parallax).
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const yMedium = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const yVeryFast = useTransform(scrollYProgress, [0, 1], [0, -1800]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 max-w-full"
    >
      {/* ================= VIBRANT AMBIENT GLOW ORBS ================= */}
      {/* Fixed ambient glow that doesn't scroll much */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]), background: "radial-gradient(circle, var(--vibrant-cyan) 0%, transparent 60%)", opacity: 0.25 }}
        className="absolute top-[5%] right-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full blur-[100px] sm:blur-[140px] animate-float-slow"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]), background: "radial-gradient(circle, var(--vibrant-purple) 0%, transparent 60%)", opacity: 0.25 }}
        className="absolute top-[40%] left-[2%] w-[300px] sm:w-[460px] h-[300px] sm:h-[460px] rounded-full blur-[90px] sm:blur-[130px] animate-float-reverse"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -300]), background: "radial-gradient(circle, var(--vibrant-emerald) 0%, transparent 60%)", opacity: 0.25 }}
        className="absolute top-[75%] right-[8%] w-[280px] sm:w-[440px] h-[280px] sm:h-[440px] rounded-full blur-[80px] sm:blur-[120px] animate-float-drift"
      />
      <div 
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)", opacity: 0.1 }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full blur-[110px] animate-pulse-glow" 
      />

      {/* ================= 3D IT ELEMENTS (PARALLAX SCROLLING UPWARDS) ================= */}
      {/* Reduced blur, frosted interactive glass style */}

      {/* 1. Database (Starts near top) */}
      <motion.div
        style={{ y: ySlow, borderColor: "var(--color-primary)" }}
        className="hidden md:flex absolute top-[15%] left-[8%] w-44 h-24 rounded-3xl bg-[var(--bg-card)]/40 backdrop-blur-[6px] border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] animate-float-slow transform -rotate-6 flex-col justify-center px-4 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, white 0%, transparent 50%, var(--color-primary) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
            <Database className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-wider font-bold" style={{ color: "var(--color-primary)" }}>PGSQL_DB</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-slate-500 dark:text-slate-300">99.9% UP</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Sys_Core (Starts mid-screen) */}
      <motion.div
        style={{ y: yMedium, borderColor: "var(--color-secondary)" }}
        className="hidden md:flex absolute top-[40%] right-[6%] w-36 h-36 rounded-[2rem] bg-[var(--bg-card)]/40 backdrop-blur-[6px] border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] animate-float-reverse flex-col items-center justify-center gap-3 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, white 0%, transparent 50%, var(--color-secondary) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-[2rem]" />
        <div className="relative p-3 rounded-2xl animate-pulse shadow-lg" style={{ backgroundColor: "color-mix(in srgb, var(--color-secondary) 25%, transparent)" }}>
          <Server className="w-6 h-6" style={{ color: "var(--color-secondary)" }} />
        </div>
        <div className="relative text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
          Sys_Core
        </div>
      </motion.div>

      {/* 3. AWS_Cloud (Starts lower screen) */}
      <motion.div
        style={{ y: yFast, borderColor: "var(--color-accent)" }}
        className="hidden md:flex absolute top-[75%] left-[10%] w-48 h-16 rounded-2xl bg-[var(--bg-card)]/40 backdrop-blur-[6px] border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] animate-float-drift items-center px-4 justify-between transform rotate-3 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(90deg, white 0%, transparent 50%, var(--color-accent) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-2xl" />
        <div className="relative flex items-center gap-2">
          <Cloud className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
          <span className="text-[10px] font-mono font-bold" style={{ color: "var(--color-accent)" }}>AWS_CLOUD</span>
        </div>
        <div className="relative text-[9px] font-mono font-bold opacity-70" style={{ color: "var(--color-accent)" }}>SYNCING...</div>
      </motion.div>

      {/* 4. Deep Learning AI Node (Starts off-screen bottom, scrolls up fast) */}
      <motion.div
        style={{ y: yVeryFast, borderColor: "var(--color-primary)" }}
        className="hidden lg:flex absolute top-[110%] right-[15%] w-40 h-40 rounded-full bg-[var(--bg-card)]/40 backdrop-blur-[6px] border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] animate-float-slow items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "conic-gradient(var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary))", animation: "spin 10s linear infinite" }} />
        <div className="absolute inset-[2px] bg-[var(--bg-card)]/80 backdrop-blur-md rounded-full" />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-full" />
        <div className="relative flex flex-col items-center gap-2">
          <Cpu className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: "var(--color-primary)" }}>AI_INFERENCE</span>
        </div>
      </motion.div>

      {/* 5. Terminal Log Widget (Starts off-screen bottom, scrolls up medium) */}
      <motion.div
        style={{ y: yMedium, borderColor: "var(--color-secondary)" }}
        className="hidden xl:flex absolute top-[130%] left-[20%] w-56 h-32 rounded-xl bg-[var(--bg-card)]/60 backdrop-blur-[8px] border-[0.5px] shadow-lg animate-float-reverse flex-col p-4 overflow-hidden transform -rotate-2"
      >
        <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(180deg, var(--color-secondary) 0%, transparent 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-xl" />
        <div className="relative flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: "var(--color-secondary)" }}>SYSTEM_LOGS</span>
        </div>
        <div className="relative space-y-1.5 text-[8px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex gap-2">
            <span style={{ color: "var(--color-primary)" }}>[OK]</span>
            <span>Docker containers synced</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: "var(--color-accent)" }}>[WARN]</span>
            <span>High memory usage on Node 3</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: "var(--color-secondary)" }}>[INFO]</span>
            <span>Deploying edge functions...</span>
          </div>
        </div>
      </motion.div>

      {/* 6. Biometric Auth Widget (Starts way off-screen, scrolls up fast) */}
      <motion.div
        style={{ y: yFast, borderColor: "var(--color-accent)" }}
        className="hidden lg:flex absolute top-[160%] right-[30%] w-32 h-32 rounded-3xl bg-[var(--bg-card)]/40 backdrop-blur-[6px] border-[0.5px] shadow-lg animate-float-drift items-center justify-center overflow-hidden transform rotate-6"
      >
        <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-3xl" />
        <div className="relative flex flex-col items-center gap-2">
          <Fingerprint className="w-10 h-10" style={{ color: "var(--color-accent)" }} />
          <span className="text-[8px] font-mono tracking-widest" style={{ color: "var(--color-accent)" }}>AUTH_SECURE</span>
        </div>
      </motion.div>

      {/* 7. Network Graph Widget */}
      <motion.div
        style={{ y: yVeryFast, borderColor: "var(--color-primary)" }}
        className="hidden 2xl:flex absolute top-[190%] left-[10%] w-48 h-48 rounded-full bg-[var(--bg-card)]/30 backdrop-blur-[6px] border-[0.5px] shadow-lg animate-float-slow items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-full" />
        <Network className="w-16 h-16 opacity-50" style={{ color: "var(--color-primary)" }} />
      </motion.div>
    </div>
  );
}
