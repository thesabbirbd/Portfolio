"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Cpu, Award, ArrowUpRight, Compass } from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { GlassCard } from "@/components/ui/GlassCard";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16"
    >
      {/* Section Heading */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-400/10 border border-blue-500/20 dark:border-cyan-400/20">
          <Compass className="w-3.5 h-3.5" />
          <span>01 // IDENTITY &amp; PERSPECTIVE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Where Business Strategy Meets{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-400">
            Systems Engineering
          </span>
          .
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {PROFILE_DATA.bioNarrative}
        </p>
      </div>

      {/* 4 Identity Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Academic Card */}
        <GlassCard glow="blue" className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {PROFILE_DATA.academic.degree}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {PROFILE_DATA.academic.institution}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
              {PROFILE_DATA.academic.foundation}
            </p>
          </div>
        </GlassCard>

        {/* Base Location */}
        <GlassCard glow="cyan" className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Geographic Base
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {PROFILE_DATA.academic.location}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Root: {PROFILE_DATA.academic.origin}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              ● Timezone: BST (UTC+6)
            </p>
          </div>
        </GlassCard>

        {/* Technical Core */}
        <GlassCard glow="purple" className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Core Orientation
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Backend × DevOps × AI
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              FastAPI • PostgreSQL • Docker
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
              Local LLMs via Ollama &amp; Linux
            </p>
          </div>
        </GlassCard>

        {/* Field Experience */}
        <GlassCard glow="blue" className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Field Recognition
            </h3>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Google Local Guide
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Direct Google HQ Gifts Recipient
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
              NOC Intern at Shunno IT &amp; BHTPA
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Engineering Journey Timeline */}
      <div className="space-y-6 pt-6">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Interactive Engineering Journey
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select each milestone to inspect the architectural evolution.
          </p>
        </div>
        <JourneyTimeline />
      </div>
    </section>
  );
}
