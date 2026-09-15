"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  Terminal, 
  CheckCircle2, 
  Activity, 
  GitBranch, 
  GitCommit, 
  ExternalLink,
  ShieldCheck,
  Building,
  Award
} from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { COMMUNITY_DATA } from "@/data/community";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";

export function MissionSection() {
  return (
    <section
      id="mission"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">
          <Flame className="w-3.5 h-3.5" />
          <span>05 // MISSION CONTROL &amp; TELEMETRY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Active Engineering Mission &amp;{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400">
            Field Operations
          </span>
          .
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Live command center tracking the 100-day backend &amp; DevOps sprint alongside verified organizational leadership and NOC operations.
        </p>
      </div>

      {/* Command Center Status Panel */}
      <GlassCard glow="cyan" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
                {PROFILE_DATA.mission.status}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {PROFILE_DATA.mission.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>SPRINT_TARGET: PRODUCTION_GRADE</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
          &gt; {PROFILE_DATA.mission.currentFocus}
        </p>

        {/* 5 Mission Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {PROFILE_DATA.mission.pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="p-4 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  #0{i + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* GitHub Telemetry & Verified Activities Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* GitHub Live Telemetry Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-blue-500" />
            <span>GitHub Telemetry</span>
          </h3>

          <GlassCard glow="blue" className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold">
                  S
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    thesabbirbd
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    github.com/thesabbirbd
                  </p>
                </div>
              </div>
              <a
                href="https://github.com/thesabbirbd"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
                aria-label="Visit GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
                <p className="text-xl font-bold text-blue-600 dark:text-cyan-400">
                  Omnidesk BD
                </p>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                  Flagship System
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  Active
                </p>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                  Deployment Pulse
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Architecture</span>
                <span className="text-slate-900 dark:text-white font-semibold">FastAPI + Docker</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Database</span>
                <span className="text-slate-900 dark:text-white font-semibold">PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Commit Flow</span>
                <span className="text-emerald-500 font-semibold">100-Day Sprint</span>
              </div>
            </div>

            <GlowButton
              href="https://github.com/thesabbirbd"
              external
              variant="outline"
              size="sm"
              className="w-full text-center"
              icon={<GithubIcon className="w-3.5 h-3.5" />}
            >
              Explore All Repositories
            </GlowButton>
          </GlassCard>
        </div>

        {/* Verified Activities & Operations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-500" />
            <span>Verified Engagements &amp; Operations</span>
          </h3>

          <div className="space-y-3">
            {COMMUNITY_DATA.activities.slice(0, 4).map((act) => (
              <GlassCard key={act.id} glow="none" className="p-4 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {act.organization}
                  </h4>
                  <span className="text-xs font-mono font-medium text-blue-600 dark:text-cyan-400">
                    {act.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {act.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
