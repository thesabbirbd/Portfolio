"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Sparkles, Send, ShieldCheck } from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { GlowButton } from "@/components/ui/GlowButton";
import { SpatialCore } from "@/components/hero/SpatialCore";

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PROFILE_DATA.rotatingRoles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Typography & Dynamic Identity */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-wider shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{PROFILE_DATA.badgeStatus}</span>
          </motion.div>

          {/* Names */}
          <div className="space-y-1">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-slate-600 dark:text-slate-300"
            >
              {PROFILE_DATA.fullName}
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                {PROFILE_DATA.shortName}
              </span>
            </motion.h1>
          </div>

          {/* Dynamic Rotating Role Headline */}
          <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start overflow-hidden max-w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={roleIndex}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs sm:text-base md:text-xl font-bold tracking-tight max-w-full truncate"
              >
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500 shrink-0" />
                <span className="truncate">{PROFILE_DATA.rotatingRoles[roleIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Hero Narrative Statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-lg text-slate-700 dark:text-slate-300 max-w-xl font-normal leading-relaxed"
          >
            {PROFILE_DATA.heroStatement}
          </motion.p>

          {/* Micro-Telemetry Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start text-[11px] sm:text-xs font-mono text-slate-600 dark:text-slate-400 pt-1"
          >
            <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/40">
              ⚡ Local AI &amp; Ollama
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/40">
              🐳 Docker &amp; Containers
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/40 dark:border-slate-700/40">
              🎓 BBA Management
            </span>
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start pt-2"
          >
            <GlowButton href="#work" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Explore My Work
            </GlowButton>
            <GlowButton href="#contact" variant="secondary" size="lg" icon={<Send className="w-4 h-4" />}>
              Connect With Me
            </GlowButton>
          </motion.div>
        </div>

        {/* Right Column: 3D Spatial Core Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          <SpatialCore />
        </motion.div>
      </div>
    </section>
  );
}
