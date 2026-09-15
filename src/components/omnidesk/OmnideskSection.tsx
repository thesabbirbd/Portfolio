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
import { PROJECTS_DATA } from "@/data/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GithubIcon } from "@/components/ui/BrandIcons";
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

const ARCHITECTURE_NODES = [
  { id: "client", label: "Local User / Tauri UI", type: "Client Tier", icon: Terminal, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "core", label: "Omnidesk Event Router", type: "Core Dispatch", icon: Network, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "ai", label: "Ollama Offline LLM", type: "Local AI Inference", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "backend", label: "FastAPI Async Backend", type: "API & Business Logic", icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "db", label: "PostgreSQL & Docker", type: "Data Persistence", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

export function OmnideskSection() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [showArchModal, setShowArchModal] = useState(false);
  const omnidesk = PROJECTS_DATA[0];

  return (
    <section
      id="omnidesk"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/20">
          <Activity className="w-3.5 h-3.5" />
          <span>03 // FLAGSHIP MASTERWORK</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
              <span>{omnidesk.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-normal">
                {omnidesk.status}
              </span>
            </h2>
            <p className="text-base sm:text-xl font-medium text-slate-600 dark:text-slate-300 mt-1">
              Universal Learning Engine &amp; AI-Powered Study Workspace
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <GlowButton
              href={omnidesk.githubUrl}
              external
              variant="primary"
              size="md"
              icon={<GithubIcon className="w-4 h-4" />}
            >
              GitHub Source
            </GlowButton>
            <GlowButton
              onClick={() => setShowArchModal(!showArchModal)}
              variant="secondary"
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
            <GlassCard glow="cyan" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Omnidesk BD Multi-Tier Architecture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High-throughput event streaming &amp; offline LLM pipeline.
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  ACTIVE SPEC
                </span>
              </div>

              {/* Node Sequence Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {ARCHITECTURE_NODES.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className="p-4 rounded-xl glass-panel border border-slate-200/70 dark:border-white/10 flex flex-col items-center text-center space-y-2 relative"
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", node.bg, node.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {node.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {node.type}
                      </p>
                      {index < ARCHITECTURE_NODES.length - 1 && (
                        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-bold z-10">
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
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {SCREENS.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => setActiveScreenIndex(idx)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium transition-all text-left border flex items-center gap-2",
                activeScreenIndex === idx
                  ? "glass-panel border-blue-500/50 dark:border-cyan-400/50 bg-blue-50/50 dark:bg-slate-900/90 text-blue-700 dark:text-cyan-300 font-bold shadow-md"
                  : "bg-white/40 dark:bg-slate-900/30 border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                Omnidesk BD // {SCREENS[activeScreenIndex].title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              v1.3.1 STABLE
            </span>
          </div>

          {/* Actual Screen Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden mt-3 bg-slate-950">
            <Image
              src={SCREENS[activeScreenIndex].src}
              alt={SCREENS[activeScreenIndex].title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-top filter contrast-105 group-hover:scale-[1.015] transition-transform duration-700"
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
