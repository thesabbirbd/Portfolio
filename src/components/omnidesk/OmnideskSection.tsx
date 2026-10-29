"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Cpu, 
  Database, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Network,
  Activity,
  Maximize2
} from "lucide-react";
import { PROJECTS_DATA, projectHref } from "@/data/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { MotionLoopVideo } from "@/components/ui/MotionLoopVideo";
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

// Mirrors the architecture documented in the Omnidesk BD repository README.
const ARCHITECTURE_NODES = [
  { id: "client", label: "React Client / Tauri", type: "Client Tier", icon: Terminal, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "backend", label: "FastAPI Gateway", type: "API & User Isolation", icon: Server, color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent)]/10" },
  { id: "core", label: "Ingestion & Scheduler", type: "Core Engines", icon: Network, color: "text-[var(--color-secondary)]", bg: "bg-[var(--color-secondary)]/10" },
  { id: "ai", label: "Gemini → Ollama → Offline", type: "AI Cascade", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "db", label: "PostgreSQL & Redis", type: "Persistence & Queue", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

/**
 * Flagship spotlight. `embedded` renders it inside the Home "Selected Work" chapter
 * (no outer page padding, h3 title under the chapter's h2).
 */
export function OmnideskSection({ embedded = false }: { embedded?: boolean }) {
  const Title = embedded ? "h3" : "h2";
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [showArchModal, setShowArchModal] = useState(false);
  const omnidesk = PROJECTS_DATA[0];

  return (
    <section
      id="omnidesk"
      className={cn(
        "relative w-full space-y-8 overflow-hidden scroll-mt-24",
        embedded ? "py-2 sm:py-4 md:space-y-12" : "py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto md:space-y-16"
      )}
    >
      {/* Telemetry motion loop behind the header (decorative; pauses off-screen, hidden for reduced motion) */}
      <div aria-hidden="true" className="hidden md:block absolute inset-x-0 top-0 h-[420px] -z-10 pointer-events-none opacity-25 dark:opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_25%,transparent_75%)]">
        <MotionLoopVideo src="/assets/videos/omnidesk-telemetry-loop" lightSrc="/assets/videos/omnidesk-telemetry-loop-light" className="w-full h-full" />
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse,rgb(6_182_212/0.12),rgb(147_51_234/0.06)_50%,transparent_72%)] pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-blue-600 dark:text-[var(--color-secondary)] bg-blue-500/10 border border-blue-500/20">
          <Activity className="w-3.5 h-3.5" />
          <span>FLAGSHIP PROJECT</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <Title className="text-3xl sm:text-5xl font-black tracking-tight text-ink flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span>{omnidesk.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-mono font-normal">
                {omnidesk.status}
              </span>
            </Title>
            <p className="text-base sm:text-xl font-medium text-slate-600 dark:text-slate-300 mt-1">
              Local-First Learning &amp; Engineering Workspace
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <GlowButton
              href={omnidesk.githubUrl}
              external
              variant="glass"
              size="md"
              icon={<GithubIcon className="w-4 h-4" />}
            >
              GitHub Source
            </GlowButton>
            <GlowButton
              href={projectHref(omnidesk)}
              variant="primary"
              size="md"
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Case Study
            </GlowButton>
            <GlowButton
              onClick={() => {
                if (!showArchModal) sound.launch();
                else sound.modalClose();
                setShowArchModal(!showArchModal);
              }}
              variant="glass"
              size="md"
              icon={<Network className="w-4 h-4" />}
            >
              {showArchModal ? "Hide Blueprint" : "Architecture Blueprint"}
            </GlowButton>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {omnidesk.longDescription}
        </p>
      </div>

      {/* Architecture Node Blueprint (Expandable) */}
      <AnimatePresence>
        {showArchModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <GlassCard glow="cyan" className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Omnidesk BD Multi-Tier Architecture
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Request flow from the client through the API gateway to the engines and storage.
                  </p>
                </div>
                <span className="hidden sm:inline-block shrink-0 whitespace-nowrap text-xs font-mono text-[var(--color-secondary)] dark:text-[var(--color-secondary)] px-2.5 py-1 rounded bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20">
                  FROM REPO README
                </span>
              </div>

              {/* Node Sequence Diagram */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 relative">
                {ARCHITECTURE_NODES.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        "p-3 sm:p-4 rounded-xl glass-panel border border-slate-200/70 dark:border-white/10 flex flex-col items-center text-center space-y-2 relative",
                        index === ARCHITECTURE_NODES.length - 1 && "col-span-2 sm:col-span-1"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", node.bg, node.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {node.label}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                        {node.type}
                      </p>
                      {index < ARCHITECTURE_NODES.length - 1 && (
                        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-500 font-bold z-10">
                          →
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Media Screen Showcase */}
      <div className="space-y-6">
        {/* Screen Switcher Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-start snap-x" role="tablist" aria-label="Omnidesk BD screens">
          {SCREENS.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => {
                sound.swipe();
                setActiveScreenIndex(idx);
              }}
              role="tab"
              aria-selected={activeScreenIndex === idx}
              className={cn(
                "shrink-0 snap-start whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-xs font-medium transition-colors text-left border flex items-center gap-2",
                activeScreenIndex === idx
                  ? "glass-panel border-blue-500/50 dark:border-[var(--color-secondary)]/50 bg-blue-50/50 dark:bg-slate-900/90 text-blue-700 dark:text-cyan-300 font-bold shadow-md"
                  : "bg-white/40 dark:bg-slate-900/30 border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]" />
              <span>{screen.title}</span>
            </button>
          ))}
        </div>

        {/* Display Frame / Mockup Showcase */}
        <motion.div
          key={activeScreenIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel rounded-3xl p-3 sm:p-5 border border-slate-200/80 dark:border-white/15 shadow-2xl overflow-hidden relative group"
        >
          {/* Top Window Bar (iOS/macOS inspired) */}
          <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[var(--color-accent)]/10 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                Omnidesk BD // {SCREENS[activeScreenIndex].title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              OPEN SOURCE · MIT
            </span>
          </div>

          {/* Actual Screen Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden mt-3 bg-slate-950">
            {/* Optimised (WebP at the rendered width): the source PNGs are ~500 KB each. */}
            <Image
              src={SCREENS[activeScreenIndex].src}
              alt={SCREENS[activeScreenIndex].title}
              fill
              sizes="(min-width: 1280px) 1174px, 92vw"
              className="object-cover object-top group-hover:scale-[1.015] transition-transform duration-700"
            />
          </div>

          <div className="p-3 sm:p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <p>{SCREENS[activeScreenIndex].desc}</p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {omnidesk.technologies.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
