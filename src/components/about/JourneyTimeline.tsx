"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TIMELINE_STEPS, TimelineStep } from "@/data/timeline";
import { Compass, Shield, Terminal, Brain, Server, Cloud, Cpu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sound";

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "Stage 01": <Compass className="w-4 h-4 text-blue-500" />,
  "Stage 02": <Cpu className="w-4 h-4 text-[var(--color-accent)]" />,
  "Stage 03": <Shield className="w-4 h-4 text-[var(--color-secondary)]" />,
  "Stage 04": <Terminal className="w-4 h-4 text-purple-500" />,
  "Stage 05": <Brain className="w-4 h-4 text-pink-500" />,
  "Stage 06": <Server className="w-4 h-4 text-blue-500" />,
  "Stage 07": <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />,
  "Stage 08": <Cloud className="w-4 h-4 text-[var(--color-accent)]" />,
};

export function JourneyTimeline() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentStep = TIMELINE_STEPS[selectedIdx] || TIMELINE_STEPS[0];

  return (
    <div className="w-full space-y-6">
      {/* Visual Progression Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {TIMELINE_STEPS.map((item: TimelineStep, idx: number) => {
          const isSelected = selectedIdx === idx;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedIdx(idx);
                sound.click();
              }}
              className={cn(
                "p-3 rounded-2xl text-left transition-all relative overflow-hidden border",
                isSelected
                  ? "glass-featured border-[var(--color-primary)] shadow-md"
                  : "glass-subtle border-[var(--border-glass)] hover:border-[var(--border-glass-hover)]"
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-[var(--text-muted)]">
                  {item.stage}
                </span>
                {STAGE_ICONS[item.stage]}
              </div>
              <p className="text-xs font-bold font-mono text-[var(--text-primary)] truncate">
                {item.title}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                {item.period}
              </p>

              {isSelected && (
                <motion.div
                  layoutId="timelineHighlight"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Active Stage Detail Card */}
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-spatial rounded-3xl p-6 sm:p-8 border border-[var(--border-glass)] shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--color-primary)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              {currentStep.stage} // {currentStep.period}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {currentStep.subtitle}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {currentStep.title}
          </h3>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {currentStep.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {currentStep.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-xs font-mono glass-subtle text-[var(--text-secondary)] border border-[var(--border-glass)]"
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
