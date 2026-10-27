"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useTransform } from "framer-motion";
import { useSpatialScroll } from "@/hooks/useSpatialScroll";
import { Database, Server, Cloud, Cpu, Terminal, Fingerprint, Network } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { SafeWebGL } from "@/components/system/SafeWebGL";

// three.js + React Three Fiber (~290 KB gzipped) load only when the visitor turns 3D on.
const SpatialScene = dynamic(() => import("@/components/spatial/SpatialScene"), { ssr: false });

// One static, filter-free atmosphere. It replaces four infinitely animated 80–140px blur
// orbs whose CSS keyframes and scroll parallax fought over `transform` on every frame.
const ATMOSPHERE = [
  "radial-gradient(ellipse 42% 36% at 88% 10%, color-mix(in srgb, var(--vibrant-cyan) 20%, transparent), transparent 72%)",
  "radial-gradient(ellipse 38% 34% at 6% 46%, color-mix(in srgb, var(--vibrant-purple) 18%, transparent), transparent 72%)",
  "radial-gradient(ellipse 36% 32% at 86% 84%, color-mix(in srgb, var(--vibrant-emerald) 16%, transparent), transparent 72%)",
  "radial-gradient(ellipse 48% 40% at 50% 50%, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 72%)",
].join(", ");

export function FloatingGlassBackground() {
  const { spatial3D } = useSettings();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useSpatialScroll();

  // Scroll parallax for the optional 3D-mode chips only (negative = moves up as you scroll down).
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const yMedium = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -1200]);
  const yVeryFast = useTransform(scrollYProgress, [0, 1], [0, -1800]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-40 max-w-full"
    >
      {/* ================= AMBIENT ATMOSPHERE (static) ================= */}
      <div className="absolute inset-0" style={{ background: ATMOSPHERE }} />

      {mounted && spatial3D && (
        <>
          {/* True 3D Spatial Layer (Desktop only) */}
          <div className="hidden md:block">
            <SafeWebGL>
              <SpatialScene />
            </SafeWebGL>
          </div>

          {/* ================= 3D IT ELEMENTS (PARALLAX SCROLLING UPWARDS) ================= */}
      {/* Reduced blur, frosted interactive glass style */}

      {/* 1. Database (Starts near top) */}
      <motion.div
        style={{ y: ySlow, borderColor: "var(--color-primary)" }}
        className="hidden md:flex absolute top-[15%] left-[8%] w-32 h-16 rounded-2xl bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] transform -rotate-6 flex-col justify-center px-4 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, white 0%, transparent 50%, var(--color-primary) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
            <Database className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-mono tracking-wider font-bold" style={{ color: "var(--color-primary)" }}>PGSQL_DB</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] text-slate-700 dark:text-slate-300">PostgreSQL</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Sys_Core (Starts mid-screen) */}
      <motion.div
        style={{ y: yMedium, borderColor: "var(--color-secondary)" }}
        className="hidden md:flex absolute top-[40%] right-[6%] w-24 h-24 rounded-3xl bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] flex-col items-center justify-center gap-3 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, white 0%, transparent 50%, var(--color-secondary) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-[2rem]" />
        <div className="relative p-3 rounded-2xl animate-pulse shadow-lg" style={{ backgroundColor: "color-mix(in srgb, var(--color-secondary) 25%, transparent)" }}>
          <Server className="w-5 h-5" style={{ color: "var(--color-secondary)" }} />
        </div>
        <div className="relative text-[8px] font-mono font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
          Sys_Core
        </div>
      </motion.div>

      {/* 3. AWS_Cloud (Starts lower screen) */}
      <motion.div
        style={{ y: yFast, borderColor: "var(--color-accent)" }}
        className="hidden md:flex absolute top-[75%] left-[10%] w-36 h-12 rounded-xl bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] items-center px-4 justify-between transform rotate-3 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(90deg, white 0%, transparent 50%, var(--color-accent) 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-2xl" />
        <div className="relative flex items-center gap-2">
          <Cloud className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <span className="text-[8px] font-mono font-bold" style={{ color: "var(--color-accent)" }}>CLOUD</span>
        </div>
        <div className="relative text-[9px] font-mono font-bold opacity-70" style={{ color: "var(--color-accent)" }}>Learning</div>
      </motion.div>

      {/* 4. Deep Learning AI Node (Starts off-screen bottom, scrolls up fast) */}
      <motion.div
        style={{ y: yVeryFast, borderColor: "var(--color-primary)" }}
        className="hidden lg:flex absolute top-[110%] right-[15%] w-28 h-28 rounded-full bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-[0_12px_36px_rgba(0,0,0,0.1)] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: "conic-gradient(var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary))", animation: "spin 10s linear infinite" }} />
        <div className="absolute inset-[2px] bg-[var(--bg-card)]/80 rounded-full" />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-full" />
        <div className="relative flex flex-col items-center gap-2">
          <Cpu className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: "var(--color-primary)" }}>LOCAL_AI</span>
        </div>
      </motion.div>

      {/* 5. Terminal Log Widget (Starts off-screen bottom, scrolls up medium) */}
      <motion.div
        style={{ y: yMedium, borderColor: "var(--color-secondary)" }}
        className="hidden xl:flex absolute top-[130%] left-[20%] w-48 h-24 rounded-xl bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-lg flex-col p-4 overflow-hidden transform -rotate-2"
      >
        <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(180deg, var(--color-secondary) 0%, transparent 100%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-xl" />
        <div className="relative flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
          <span className="text-[9px] font-mono font-bold" style={{ color: "var(--color-secondary)" }}>SYSTEM_LOGS</span>
        </div>
        <div className="relative space-y-1.5 text-[8px] font-mono text-slate-600 dark:text-slate-400">
          <div className="flex gap-2">
            <span style={{ color: "var(--color-primary)" }}>[OK]</span>
            <span>docker compose up</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: "var(--color-accent)" }}>[WARN]</span>
            <span>ollama run qwen</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: "var(--color-secondary)" }}>[INFO]</span>
            <span>pytest -q</span>
          </div>
        </div>
      </motion.div>

      {/* 6. Biometric Auth Widget (Starts way off-screen, scrolls up fast) */}
      <motion.div
        style={{ y: yFast, borderColor: "var(--color-accent)" }}
        className="hidden lg:flex absolute top-[160%] right-[30%] w-24 h-24 rounded-2xl bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-lg items-center justify-center overflow-hidden transform rotate-6"
      >
        <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-3xl" />
        <div className="relative flex flex-col items-center gap-2">
          <Fingerprint className="w-10 h-10" style={{ color: "var(--color-accent)" }} />
          <span className="text-[8px] font-mono tracking-widest" style={{ color: "var(--color-accent)" }}>AUTH</span>
        </div>
      </motion.div>

      {/* 7. Network Graph Widget */}
      <motion.div
        style={{ y: yVeryFast, borderColor: "var(--color-primary)" }}
        className="hidden 2xl:flex absolute top-[190%] left-[10%] w-32 h-32 rounded-full bg-[var(--bg-card)]/10 opacity-60 hover:opacity-100 transition-opacity border-[0.5px] shadow-lg items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-full" />
        <Network className="w-16 h-16 opacity-50" style={{ color: "var(--color-primary)" }} />
      </motion.div>
        </>
      )}
    </div>
  );
}
