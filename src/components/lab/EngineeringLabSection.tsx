"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Filter, Terminal, Cpu, Network, Sparkles, Video, Palette } from "lucide-react";
import { LAB_EXPERIMENTS, LabExperiment } from "@/data/experiments";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { TerminalCard } from "@/components/lab/TerminalCard";

export function EngineeringLabSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Disciplines", icon: FlaskConical, colors: "bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 text-slate-700 dark:text-slate-300", activeColors: "bg-gradient-to-r from-slate-500/20 to-slate-500/5 border-slate-500/40 text-slate-900 dark:text-white ring-1 ring-slate-500/20" },
    { id: "infrastructure", label: "Infrastructure Lab", icon: Network, colors: "bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent border border-blue-500/20 text-blue-600 dark:text-blue-400", activeColors: "bg-gradient-to-r from-blue-500/20 to-sky-500/5 border-blue-500/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20" },
    { id: "ai", label: "AI Lab", icon: Sparkles, colors: "bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 text-purple-600 dark:text-purple-400", activeColors: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/5 border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20" },
    { id: "systems", label: "Systems Lab", icon: Terminal, colors: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400", activeColors: "bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20" },
    { id: "hardware", label: "Hardware Lab", icon: Cpu, colors: "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 text-orange-600 dark:text-orange-400", activeColors: "bg-gradient-to-r from-orange-500/20 to-red-500/5 border-orange-500/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20" },
    { id: "creative", label: "Creative Lab", icon: Palette, colors: "bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-transparent border border-pink-500/20 text-pink-600 dark:text-pink-400", activeColors: "bg-gradient-to-r from-pink-500/20 to-rose-500/5 border-pink-500/40 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500/20" },
  ];

  const filtered = selectedCategory === "all"
    ? LAB_EXPERIMENTS
    : LAB_EXPERIMENTS.filter((exp) => exp.category === selectedCategory);

  return (
    <section id="lab" className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <SectionReveal className="w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-subtle border border-[var(--border-glass)] text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-4">
          <FlaskConical className="w-3.5 h-3.5" />
          R&amp;D &bull; Prototyping Space
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2 sm:mb-4">
          🧪 Engineering Lab
        </h2>
        <p className="max-w-2xl text-xs sm:text-lg text-[var(--text-muted)] px-4 sm:px-0">
          An expandable workspace for ongoing bench tests, hardware circuits, offline AI models, and infrastructure prototypes built along the way.
        </p>
      </div>

      {/* Advanced Interactive Terminal */}
      <TerminalCard />

      {/* Category Filter Pills */}
      <div className="mb-6 sm:mb-10 flex overflow-x-auto snap-x hide-scrollbar px-4 sm:px-0 sm:justify-center">
        <div className="flex items-center sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 min-w-max sm:min-w-0 mx-auto sm:mx-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sound.click();
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[13px] font-semibold transition-all relative whitespace-nowrap backdrop-blur-md shrink-0 snap-center",
                  isActive ? cat.activeColors : cat.colors,
                  !isActive && "hover:border-slate-500/30 hover:bg-slate-500/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryLab"
                    className="absolute inset-0 rounded-full bg-white/5 dark:bg-black/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((exp: LabExperiment) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-xs font-mono font-medium rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                    {exp.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                      {exp.status}
                    </span>
                    <span className="text-[9px] sm:text-xs text-[var(--text-muted)] font-mono">{exp.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1 sm:mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-sm text-[var(--text-secondary)] mb-2 sm:mb-4 leading-snug sm:leading-relaxed">
                  {exp.description}
                </p>

                {/* Test notes if present */}
                {exp.notes && (
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl glass-subtle border border-[var(--border-glass)] text-[9px] sm:text-xs font-mono text-[var(--text-muted)] mb-2 sm:mb-4">
                    <span className="text-[var(--color-primary)] font-bold">Notes: </span>
                    {exp.notes}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="pt-2 sm:pt-4 border-t border-[var(--border-glass)]">
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SectionReveal>
    </section>
  );
}
