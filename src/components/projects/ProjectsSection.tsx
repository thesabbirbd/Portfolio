"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Terminal, 
  Layers,
  Network,
  Activity,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { PROJECTS_DATA, ProjectItem } from "@/data/projects";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const SCREENS = [
  {
    id: "dashboard",
    title: "Spatial Glass Dashboard",
    desc: "Clean desktop workspace with distraction-free modules and focus timer telemetry.",
    src: "/assets/omnidesk-glass-dashboard.png",
  },
  {
    id: "mindmap",
    title: "DAG Knowledge Mindmap",
    desc: "Graph-theoretic visual nodes connecting cross-disciplinary engineering concepts.",
    src: "/assets/omnidesk-dag-mindmap.png",
  },
  {
    id: "materials",
    title: "Materials & Ingestion Engine",
    desc: "Local-first ingestion pipeline indexing PDFs, notes, and technical textbooks.",
    src: "/assets/omnidesk-materials-engine.png",
  },
  {
    id: "focus",
    title: "Focus Telemetry & Presence",
    desc: "Real-time state tracking and deep-work study telemetry sessions.",
    src: "/assets/omnidesk-focus-timer-presence.png",
  },
];

const CATEGORY_MAP = [
  { key: "all", label: "All Builds" },
  { key: "Systems", label: "Systems & Linux" },
  { key: "AI", label: "AI & Models" },
  { key: "Hardware", label: "Hardware & Rigs" },
  { key: "Community", label: "Geospatial" },
];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const omnidesk = PROJECTS_DATA.find((p) => p.id === "omnidesk-bd") || PROJECTS_DATA[0];
  const otherProjects = PROJECTS_DATA.filter((p) => p.id !== "omnidesk-bd");

  const filteredProjects = otherProjects.filter((p) =>
    activeCategory === "all" ? true : p.category === activeCategory
  );

  const handleOpenModal = (project: ProjectItem) => {
    setSelectedProject(project);
    sound.modalOpen();
  };

  return (
    <section
      id="work"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider text-blue-600 dark:text-[var(--color-secondary)] bg-blue-500/10 border border-blue-500/20">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>03 // SELECTED BUILDS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              SELECTED{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">
                BUILDS
              </span>
              .
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
              A curated collection of production systems, developer tools, and architectural experiments built with purpose.
            </p>
          </div>
        </div>
      </div>

      {/* ================= FLAGSHIP SHOWCASE: OMNIDESK BD ================= */}
      {omnidesk && (
        <div className="rounded-3xl glass-spatial border border-slate-200/80 dark:border-white/15 p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-[var(--color-secondary)] border border-blue-500/30">
                  FLAGSHIP MASTERWORK
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] border border-[var(--color-accent)]/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  {omnidesk.status}
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  {omnidesk.year}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {omnidesk.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {omnidesk.shortDescription}
              </p>

              {/* Technologies Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {omnidesk.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenModal(omnidesk)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Architecture</span>
              </button>

              {omnidesk.githubUrl && (
                <a
                  href={omnidesk.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm glass-interactive border border-slate-200/80 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Source</span>
                </a>
              )}
            </div>
          </div>

          {/* Interactive Screen Preview Frame */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SCREENS.map((screen, idx) => (
                <button
                  key={screen.id}
                  onClick={() => {
                    setActiveScreenIndex(idx);
                    sound.click();
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border",
                    activeScreenIndex === idx
                      ? "glass-spatial border-blue-500/50 dark:border-[var(--color-secondary)]/50 bg-blue-50/50 dark:bg-slate-900/90 text-blue-700 dark:text-cyan-300 font-bold shadow-md"
                      : "glass-subtle border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]" />
                  <span>{screen.title}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={activeScreenIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-2xl p-2 sm:p-4 border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden"
            >
              {/* Window Bar */}
              <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]/10 inline-block" />
                  <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    Omnidesk BD // {SCREENS[activeScreenIndex].title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  v1.3.1 LOCAL-FIRST
                </span>
              </div>

              {/* Screen Mockup */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden mt-2 bg-slate-950 cursor-pointer" onClick={() => { setViewerOpen(true); sound.click(); }}>
                <Image
                  src={SCREENS[activeScreenIndex].src}
                  alt={SCREENS[activeScreenIndex].title}
                  fill
                  sizes="100vw"
                  quality={100}
                  unoptimized
                  className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                <p>{SCREENS[activeScreenIndex].desc}</p>
                <button
                  onClick={() => handleOpenModal(omnidesk)}
                  className="text-blue-600 dark:text-[var(--color-secondary)] font-medium hover:underline flex items-center gap-1"
                >
                  <span>View Specifications</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ================= OTHER SELECTED BUILDS GRID ================= */}
      <div className="space-y-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Additional Production Systems &amp; Lab Builds
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Low-level kernel experiments, mobile wrappers, and offline AI optimizations.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-full glass-panel border border-slate-200/70 dark:border-white/10 w-fit">
            {CATEGORY_MAP.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  sound.click();
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all relative",
                  activeCategory === cat.key
                    ? "text-blue-600 dark:text-[var(--color-secondary)] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {cat.label}
                {activeCategory === cat.key && (
                  <motion.div
                    layoutId="activeFilterBuilds"
                    className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-[var(--color-secondary)]/10 border border-blue-500/20 dark:border-[var(--color-secondary)]/20 -z-10"
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-[var(--color-secondary)] border border-blue-500/20 dark:border-[var(--color-secondary)]/20">
                        {project.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {project.year}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[var(--color-secondary)] transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {project.shortDescription}
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
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-xs font-mono text-blue-600 dark:text-[var(--color-secondary)] hover:underline flex items-center gap-1"
                    >
                      <span>Architecture</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.click()}
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
                          onClick={() => sound.click()}
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
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
