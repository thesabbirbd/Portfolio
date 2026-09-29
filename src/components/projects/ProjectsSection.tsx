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
  Terminal, Star, 
  Layers,
  Network,
  Activity,
  ChevronRight,
  Maximize2,
  HardDrive,
  Rocket
} from "lucide-react";
import { PROJECTS_DATA, ProjectItem } from "@/data/projects";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { TiltCard } from "@/components/ui/TiltCard";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";


const getProjectCardHover = (cat: string) => {
  switch (cat) {
    case "AI": return "hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-purple-500/10";
    case "Systems": return "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-emerald-500/10";
    case "Hardware": return "hover:border-orange-500/40 hover:bg-orange-500/5 hover:shadow-orange-500/10";
    case "Featured": return "hover:border-amber-500/40 hover:bg-amber-500/5 hover:shadow-amber-500/10";
    default: return "hover:border-blue-500/40 hover:bg-blue-500/5 hover:shadow-blue-500/10";
  }
};

const CATEGORIES = [
  { key: "all", label: "All Builds", icon: Layers, colors: "bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 text-slate-700 dark:text-slate-300", activeColors: "bg-gradient-to-r from-slate-500/20 to-slate-500/5 border-slate-500/40 text-slate-900 dark:text-white ring-1 ring-slate-500/20" },
  { key: "Featured", label: "Featured", icon: Star, colors: "bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-amber-600 dark:text-amber-400", activeColors: "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20" },
  { key: "Systems", label: "Systems & Linux", icon: Terminal, colors: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400", activeColors: "bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20" },
  { key: "AI", label: "AI & Models", icon: Sparkles, colors: "bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 text-purple-600 dark:text-purple-400", activeColors: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/5 border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20" },
  { key: "Hardware", label: "Hardware & Rigs", icon: Cpu, colors: "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 text-orange-600 dark:text-orange-400", activeColors: "bg-gradient-to-r from-orange-500/20 to-red-500/5 border-orange-500/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Systems": return <Terminal className="w-10 h-10 opacity-70" />;
    case "AI": return <Sparkles className="w-10 h-10 opacity-70" />;
    case "Hardware": return <HardDrive className="w-10 h-10 opacity-70" />;
    case "Featured": return <Rocket className="w-10 h-10 opacity-70" />;
    default: return <Layers className="w-10 h-10 opacity-70" />;
  }
};

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = PROJECTS_DATA.filter((p) =>
    activeCategory === "all" ? true : p.category === activeCategory
  );

  const handleOpenModal = (project: ProjectItem) => {
    setSelectedProject(project);
    sound.modalOpen();
  };

  return (
    <section id="projects" className="py-12 md:py-24 landscape:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionReveal className="w-full">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
          SELECTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">BUILDS</span>
        </h2>
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
          Production-grade systems, hardware experiments, and creative technology.
        </p>
      </div>

      <div className="mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-center gap-2 min-w-max px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                sound.click();
                setActiveCategory(cat.key);
              }}
              className={cn(
                "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all relative whitespace-nowrap border border-transparent",
                activeCategory === cat.key
                  ? "text-blue-600 dark:text-cyan-400 border-blue-500/20 dark:border-[var(--color-secondary)]/20"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="activeFilterBuilds"
                  className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-[var(--color-secondary)]/10 -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Tilt Project Cards Grid (Smaller Sizes) */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5">
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
              <TiltCard glowGradient={project.gradient} className={`h-full flex flex-col justify-between overflow-hidden group border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl transition-all duration-500 ${getProjectCardHover(project.category)}`}>
                
                {/* Banner / Hero Frame - Reduced Height to 36 */}
                {project.heroImage ? (
                  <div className="relative w-full aspect-video sm:aspect-auto h-24 sm:h-40 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-white/10">
                    <Image 
                      src={project.heroImage} 
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className={`relative w-full aspect-video sm:aspect-auto sm:h-40 overflow-hidden bg-gradient-to-br ${project.gradient} bg-opacity-20 border-b border-slate-200/50 dark:border-white/10 flex flex-col items-center justify-center text-slate-800 dark:text-white`}>
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/40 mix-blend-overlay" />
                    <div className="relative z-10 flex flex-col items-center">
                      {getCategoryIcon(project.category)}
                    </div>
                  </div>
                )}

                <div className="p-2 sm:p-4 flex flex-col justify-between flex-grow space-y-2 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-3">
                    {/* Top Bar with Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 dark:border-cyan-400/20">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {project.year}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[11px] sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1.5 leading-tight sm:leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0,3).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-500 dark:text-slate-400">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* Footer with Status & Links */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="text-[11px] font-mono font-medium text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank" rel="noopener noreferrer"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); sound.click(); }}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank" rel="noopener noreferrer"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); sound.click(); }}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          title="View Live Resource"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
