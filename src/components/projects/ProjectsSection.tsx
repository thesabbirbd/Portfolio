"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Terminal, 
  Globe, 
  Layers 
} from "lucide-react";
import { PROJECTS_DATA, ProjectItem } from "@/data/projects";
import { TiltCard } from "@/components/ui/TiltCard";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

const CATEGORY_MAP = [
  { key: "all", label: "All Projects" },
  { key: "Systems", label: "Systems & Linux" },
  { key: "AI", label: "AI & Inference" },
  { key: "Community", label: "Geospatial & Community" },
  { key: "Creative", label: "Hardware & Media" },
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = PROJECTS_DATA.filter((p) =>
    activeCategory === "all" ? true : p.category === activeCategory
  );

  return (
    <section
      id="work"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>04 // LABS &amp; EXPERIMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered Systems &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
              Technical Builds
            </span>
            .
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            A portfolio of functional software implementations, kernel experiments, offline AI benchmarks, and physical hardware builds.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 p-1 rounded-full glass-panel border border-slate-200/70 dark:border-white/10 w-fit">
          {CATEGORY_MAP.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-3.5 py-1 rounded-full text-xs font-medium transition-all relative",
                activeCategory === cat.key
                  ? "text-blue-600 dark:text-cyan-400 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="activeProjFilter"
                  className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 border border-blue-500/20 dark:border-cyan-400/20 -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Tilt Project Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TiltCard glowGradient={project.gradient} className="h-full flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Top Bar with Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-400/20">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {project.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Status & Links */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {project.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="GitHub Repository"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="View Live Resource"
                        aria-label="View Live Resource"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
