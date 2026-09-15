"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Filter, Terminal, Cpu, Network, Sparkles, Video } from "lucide-react";
import { LAB_EXPERIMENTS, LabExperiment } from "@/data/experiments";
import { sound } from "@/lib/sound";

export function EngineeringLabSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Disciplines", icon: FlaskConical },
    { id: "infrastructure", label: "Infrastructure Lab", icon: Network },
    { id: "ai", label: "AI Lab", icon: Sparkles },
    { id: "systems", label: "Systems Lab", icon: Terminal },
    { id: "hardware", label: "Hardware Lab", icon: Cpu },
    { id: "creative", label: "Creative Lab", icon: Video },
  ];

  const filtered = selectedCategory === "all"
    ? LAB_EXPERIMENTS
    : LAB_EXPERIMENTS.filter((exp) => exp.category === selectedCategory);

  return (
    <section id="lab" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-subtle border border-[var(--border-glass)] text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-4">
          <FlaskConical className="w-3.5 h-3.5" />
          R&amp;D &bull; Prototyping Space
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          🧪 Engineering Lab
        </h2>
        <p className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]">
          An expandable workspace for ongoing bench tests, hardware circuits, offline AI models, and infrastructure prototypes built along the way.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                  : "glass-subtle border border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[var(--border-glass-hover)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((exp: LabExperiment) => (
            <motion.div
              key={exp.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between p-6 rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                    {exp.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {exp.status}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">{exp.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Test notes if present */}
                {exp.notes && (
                  <div className="p-3 rounded-xl glass-subtle border border-[var(--border-glass)] text-xs font-mono text-[var(--text-muted)] mb-4">
                    <span className="text-[var(--color-primary)] font-bold">Notes: </span>
                    {exp.notes}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="pt-4 border-t border-[var(--border-glass)]">
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
    </section>
  );
}
