"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PROFILE_DATA } from "@/data/profile";
import { ChevronRight, CheckCircle2, Compass, Shield, Terminal, Brain, Server, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGE_ICONS: Record<string, React.ReactNode> = {
  FOUNDATION: <Compass className="w-4 h-4 text-blue-500" />,
  SYSTEMS: <Shield className="w-4 h-4 text-cyan-500" />,
  COMPUTING: <Terminal className="w-4 h-4 text-amber-500" />,
  "AI & ML": <Brain className="w-4 h-4 text-purple-500" />,
  BACKEND: <Server className="w-4 h-4 text-emerald-500" />,
  "DEVOPS & FUTURE": <Cloud className="w-4 h-4 text-blue-400" />,
};

export function JourneyTimeline() {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  return (
    <div className="w-full space-y-8">
      {/* Visual Progression Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {PROFILE_DATA.journey.map((item, idx) => {
          const isSelected = selectedMilestone === idx;
          return (
            <motion.button
              key={item.period}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMilestone(idx)}
              className={cn(
                "p-3 rounded-xl text-left transition-all relative overflow-hidden border",
                isSelected
                  ? "glass-panel border-cyan-400/50 dark:border-cyan-400/40 bg-blue-50/50 dark:bg-cyan-950/20 shadow-md"
                  : "bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15"
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  0{idx + 1}
                </span>
                {STAGE_ICONS[item.period]}
              </div>
              <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 truncate">
                {item.period}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {item.stage}
              </p>

              {isSelected && (
                <motion.div
                  layoutId="timelineHighlight"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Active Stage Detail Card */}
      <motion.div
        key={selectedMilestone}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200/70 dark:border-white/10 shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 dark:bg-cyan-400/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20 dark:border-cyan-400/20">
              STAGE {selectedMilestone + 1} // {PROFILE_DATA.journey[selectedMilestone].period}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {PROFILE_DATA.journey[selectedMilestone].stage}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {PROFILE_DATA.journey[selectedMilestone].title}
          </h3>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {PROFILE_DATA.journey[selectedMilestone].description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {PROFILE_DATA.journey[selectedMilestone].tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
