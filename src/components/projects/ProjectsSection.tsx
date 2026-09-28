"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
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
import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards";

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

const CATEGORIES = [
  { label: "All Builds", key: "All" },
  { label: "Featured", key: "Featured" },
  { label: "Systems export function ProjectsSection() { Linux", key: "Systems" },
  { label: "AI export function ProjectsSection() { Models", key: "AI" },
  { label: "Hardware export function ProjectsSection() { Rigs", key: "Hardware" },
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
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionReveal className="w-full">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-4">
          SELECTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">BUILDS</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Production-grade systems, hardware experiments, and creative technology.
        </p>
      </div>

      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-center gap-2 min-w-max px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                sound.click();
                setActiveCategory(cat.key);
              }}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all relative whitespace-nowrap",
                activeCategory === cat.key
                  ? "text-blue-600 dark:text-cyan-400"
                  : "text-gray-600 dark:text-slate-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-gray-100"
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
              <TiltCard glowGradient={project.gradient} className="h-full flex flex-col justify-between overflow-hidden group border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl">
                
                {/* Image / Hero Frame */}
                {project.heroImage ? (
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-white/10">
                    <Image 
                      src={project.heroImage} 
                      alt={project.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-center">
                    <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                )}

                <div className="p-5 flex flex-col justify-between flex-grow space-y-6">
                  <div className="space-y-4">
                    {/* Top Bar with Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-400/20">
                        {project.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300">
                        {project.year}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0,4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-700 dark:text-slate-300">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                  </div>

                  {/* Footer with Status & Links */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-xs font-mono font-medium text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); sound.click(); }}
                          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); sound.click(); }}
                          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          title="View Live Resource"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </SectionReveal>
    </section>
  );
}