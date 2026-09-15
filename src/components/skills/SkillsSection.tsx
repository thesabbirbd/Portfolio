"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Container, 
  Network, 
  Brain, 
  Cpu, 
  Video,
  Cloud,
  Check, 
  Sparkles,
  Layers
} from "lucide-react";
import { SKILL_CATEGORIES, SkillCategory } from "@/data/skills";
import { GlassCard } from "@/components/ui/GlassCard";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const ICONS_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-5 h-5 text-blue-500" />,
  Container: <Container className="w-5 h-5 text-cyan-500" />,
  Network: <Network className="w-5 h-5 text-emerald-500" />,
  Brain: <Brain className="w-5 h-5 text-purple-500" />,
  Cloud: <Cloud className="w-5 h-5 text-blue-400" />,
  Video: <Video className="w-5 h-5 text-pink-500" />,
  Cpu: <Cpu className="w-5 h-5 text-cyan-400" />,
};

export function SkillsSection() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "engineering" | "systems" | "applied">("all");

  const filterMap: Record<string, string[]> = {
    all: ["backend", "devops", "networking", "ai-data", "cloud", "creative", "hardware"],
    engineering: ["backend", "devops", "ai-data"],
    systems: ["devops", "networking", "cloud", "hardware"],
    applied: ["ai-data", "creative", "hardware"],
  };

  const filteredCategories = SKILL_CATEGORIES.filter((c) =>
    filterMap[selectedFilter].includes(c.id)
  );

  return (
    <section
      id="skills"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>05 // CAPABILITY ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineering Arsenal &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
              Technical Domains
            </span>
            .
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            A structured, interactive map of verified disciplines. No meaningless percentage bars—just real architectures, protocols, and production tools.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 p-1 rounded-full glass-panel border border-slate-200/70 dark:border-white/10 w-fit">
          {[
            { key: "all", label: "All Domains" },
            { key: "engineering", label: "Core Engineering" },
            { key: "systems", label: "Systems & NOC" },
            { key: "applied", label: "Applied & Hardware" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setSelectedFilter(tab.key as any);
                sound.click();
              }}
              className={cn(
                "px-3.5 py-1 rounded-full text-xs font-medium transition-all relative",
                selectedFilter === tab.key
                  ? "text-blue-600 dark:text-cyan-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {tab.label}
              {selectedFilter === tab.key && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 border border-blue-500/20 dark:border-cyan-400/20 -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Capability Nodes */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCategories.map((cap) => (
            <motion.div
              layout
              key={cap.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard
                glow={cap.color === "emerald" ? "cyan" : cap.color}
                className="h-full flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Top Node Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                      {ICONS_MAP[cap.icon] || <Cpu className="w-5 h-5 text-blue-500" />}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      SYS // {cap.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cap.tagline}
                    </p>
                  </div>

                  {/* Skills Tag Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cap.skills.map((skill) => (
                      <span
                        key={skill.name}
                        title={skill.context}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 group-hover:border-cyan-400/30 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-cyan-500" />
                        <span>{skill.name}</span>
                        {skill.level === "Active Focus" && (
                          <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-sans">⚡</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Verified Capability
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {cap.skills.length} skills
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
