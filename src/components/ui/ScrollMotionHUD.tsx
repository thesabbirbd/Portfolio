"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Activity, ArrowUp } from "lucide-react";
import { sound } from "@/lib/sound";

export function ScrollMotionHUD() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [showHUD, setShowHUD] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const p = Math.round(latest * 100);
      setPercent(p);
      setShowHUD(p > 4);
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    sound.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ================= TOP GLOWING 3-COLOR PROGRESS RAIL ================= */}
      <div className="fixed top-0 inset-x-0 z-50 h-[3px] bg-slate-900/10 dark:bg-white/5 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--vibrant-cyan)] via-[var(--vibrant-purple)] to-[var(--vibrant-emerald)] shadow-[0_0_12px_rgba(0,240,255,0.8)] origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* ================= MODERN SCROLL HUD TELEMETRY CAPSULE ================= */}
      {showHUD && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-18 right-4 z-40 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full glass-spatial border border-cyan-500/25 shadow-lg backdrop-blur-xl text-slate-800 dark:text-cyan-300 font-mono text-xs select-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              HUD // SCROLL
            </span>
          </div>

          <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />

          <span className="font-bold text-cyan-600 dark:text-cyan-400 min-w-[28px] text-right">
            {percent}%
          </span>

          <button
            onClick={scrollToTop}
            title="Scroll to Top"
            aria-label="Scroll to top"
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 hover:text-cyan-500 transition-colors"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </>
  );
}
