"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Terminal, Cpu, Network, Sparkles, Palette } from "lucide-react";
import { LAB_EXPERIMENTS, LabExperiment } from "@/data/experiments";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { TerminalCard } from "@/components/lab/TerminalCard";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { MoreLink, MoreLinks } from "@/components/system/MoreLink";

// Cyber AI expression: one signal accent for the whole Lab. Categories are told apart by
// icon and label, not by five competing colour themes.
const CATEGORIES = [
  { id: "all", label: "All Disciplines", icon: FlaskConical },
  { id: "infrastructure", label: "Infrastructure Lab", icon: Network },
  { id: "ai", label: "AI Lab", icon: Sparkles },
  { id: "systems", label: "Systems Lab", icon: Terminal },
  { id: "hardware", label: "Hardware Lab", icon: Cpu },
  { id: "creative", label: "Creative Lab", icon: Palette },
];

type LabSectionProps = {
  /** `teaser` = Home chapter (header, three experiments, hand-off). `full` = bench log with terminal + filters. */
  variant?: "full" | "teaser";
  index?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  lede?: string;
};

export function EngineeringLabSection({
  variant = "full",
  index,
  eyebrow = "R&D · Prototyping Space",
  title = <>Engineering <Accent tone="signal">Lab</Accent></>,
  lede = "An expandable workspace for ongoing bench tests, hardware circuits, offline AI models, and infrastructure prototypes built along the way.",
}: LabSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const teaser = variant === "teaser";

  const filtered = teaser
    ? [...LAB_EXPERIMENTS].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3)
    : selectedCategory === "all"
      ? LAB_EXPERIMENTS
      : LAB_EXPERIMENTS.filter((exp) => exp.category === selectedCategory);

  return (
    <section id="lab" className={cn("relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden scroll-mt-20", teaser ? "py-12 sm:py-16 md:py-24" : "pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-20")}>
      {/* Static signal grid behind the header (no animation, no filter) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[520px] -z-10 signal-grid pointer-events-none" />

      <SectionReveal className="w-full">
      <SectionHeader
        expression="signal"
        align="center"
        index={index}
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        className="mb-6 sm:mb-12"
      />

      {!teaser && (
      <>
      {/* Advanced Interactive Terminal */}
      <TerminalCard />

      {/* Category Filter Pills */}
      <div className="mb-6 sm:mb-10 flex overflow-x-auto snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
        <div role="group" aria-label="Filter experiments by discipline" className="flex items-center sm:flex-wrap gap-2 sm:gap-2.5 pb-2 sm:pb-0 min-w-max sm:min-w-0 mx-auto sm:mx-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                aria-pressed={isActive}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sound.click();
                }}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border font-mono text-[11px] sm:text-xs font-semibold whitespace-nowrap shrink-0 snap-center transition-colors duration-200",
                  isActive
                    ? "border-signal/45 text-ink"
                    : "surface-card shadow-none text-ink-2 hover:text-ink hover:border-signal/30"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryLab"
                    className="absolute inset-0 rounded-full bg-signal/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isActive ? "text-signal" : "text-ink-3")} />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* Experiments Grid — Framer owns transform (layout/enter/exit); CSS transitions paint only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((exp: LabExperiment) => (
            <motion.article
              key={exp.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="group relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-card surface-card signal-edge transition-[border-color,box-shadow] duration-300 hover:border-signal/35 hover:shadow-e2"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 font-mono text-[11px] sm:text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-signal/10 text-signal">
                    {exp.categoryLabel}
                  </span>
                  <span className="flex items-center gap-2 text-ink-3">
                    <span className="flex items-center gap-1 text-ok">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ok" />
                      {exp.status}
                    </span>
                    <span>{exp.date}</span>
                  </span>
                </div>

                <h3 className="text-[15px] sm:text-lg font-bold text-ink mb-1 sm:mb-2 group-hover:text-signal transition-colors">
                  {exp.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink-2 mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {exp.description}
                </p>

                {exp.notes && (
                  <div className="hidden sm:block p-3 rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-line text-xs font-mono text-ink-3 mb-4">
                    <span className="text-signal font-bold">{"// notes: "}</span>
                    {exp.notes}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="pt-3 sm:pt-4 border-t border-line">
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-ink/5 dark:bg-white/5 text-ink-2"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {teaser && (
        <MoreLinks align="center">
          <MoreLink href="/engineering-lab" tone="signal">Open the Engineering Lab</MoreLink>
        </MoreLinks>
      )}
    </SectionReveal>
    </section>
  );
}
