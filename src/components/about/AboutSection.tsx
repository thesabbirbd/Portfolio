"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, MapPin, Cpu, Award, Compass, Sparkles, Heart, Layers } from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { sound } from "@/lib/sound";

type PhotoMode = "glass" | "spatial" | "editorial" | "clean";

export function AboutSection() {
  const [photoMode, setPhotoMode] = useState<PhotoMode>("glass");
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);

  const photoModes: { id: PhotoMode; label: string }[] = [
    { id: "glass", label: "Glass Frame" },
    { id: "spatial", label: "Spatial Depth" },
    { id: "editorial", label: "Editorial Card" },
    { id: "clean", label: "Clean" },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20 overflow-hidden">
      {/* Section Heading & Spiritual Greeting */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
          <Compass className="w-3.5 h-3.5" />
          <span>01 // IDENTITY &amp; PERSPECTIVE</span>
        </div>

        {/* Spiritual Greeting Bio (requested in prompt) */}
        <div className="p-4 rounded-2xl glass-subtle border border-[var(--border-glass)] inline-block text-left max-w-md">
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {PROFILE_DATA.spiritualEthos.greeting}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
            {PROFILE_DATA.spiritualEthos.smile}
          </div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {PROFILE_DATA.spiritualEthos.alhamdulillah}
          </div>
          <div className="text-xs text-[var(--text-muted)] font-mono">
            {PROFILE_DATA.spiritualEthos.jazakallah}
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Where Business Economics Meets{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600">
            Systems Engineering
          </span>
          .
        </h2>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          {PROFILE_DATA.bioNarrative}
        </p>
      </div>

      {/* Portrait & Profile Presentation System (Sections 32 & 33) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Professional Portrait Frame */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm">
            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 mb-4 rounded-2xl sm:rounded-full glass-subtle border border-[var(--border-glass)]">
              {photoModes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setPhotoMode(m.id);
                    sound.click();
                  }}
                  className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium rounded-full transition-all ${
                    photoMode === m.id
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Portrait Frame Container */}
            <motion.div
              layout
              className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                photoMode === "glass"
                  ? "glass-spatial p-4 border border-[var(--color-primary)]/30 shadow-2xl"
                  : photoMode === "spatial"
                  ? "p-6 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-cyan-400/20 border border-white/20 shadow-2xl transform -rotate-1 hover:rotate-0"
                  : photoMode === "editorial"
                  ? "p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                  : "p-1 rounded-2xl border border-[var(--border-glass)]"
              }`}
            >
              {/* Photo Box */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-end p-6 text-center text-white">
                {/* Visual Ambient Rings */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,180,216,0.35),transparent_70%)]" />
                <div className="absolute top-1/3 w-36 h-36 rounded-full border border-cyan-400/30 animate-spin-slow" />
                <div className="absolute top-1/3 w-48 h-48 rounded-full border border-purple-500/20" />

                {/* Portrait Core Branding Badge */}
                <div className="relative z-10 space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl glass-spatial border border-cyan-400/40 flex items-center justify-center text-2xl font-black text-cyan-300 shadow-lg">
                    S
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white">Md Sabbirul Islam Khan</h3>
                  <div className="text-xs font-mono font-semibold tracking-widest text-cyan-300 uppercase">
                    SABBiR &bull; Digital Space
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-mono text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE &bull; BUILDING &bull; LEARNING
                  </div>
                </div>
              </div>

              {/* Editorial Mode Badge */}
              {photoMode === "editorial" && (
                <div className="pt-3 px-2 flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>SABBiR DIGITAL IDENTITY</span>
                  <span>EST. 2026</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right: Academic & Engineering Alignment */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Academic Card */}
          <div className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Academic Degree
            </h3>
            <p className="text-base font-bold text-[var(--text-primary)]">
              {PROFILE_DATA.academic.degree}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {PROFILE_DATA.academic.institution}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] pt-1">
              Foundation: {PROFILE_DATA.academic.foundation}
            </p>
          </div>

          {/* Geographic Base */}
          <div className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Geographic Base
            </h3>
            <p className="text-base font-bold text-[var(--text-primary)]">
              {PROFILE_DATA.academic.location}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Roots: {PROFILE_DATA.academic.origin}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono pt-1">
              ● Timezone: BST (UTC+6)
            </p>
          </div>

          {/* Core Focus */}
          <div className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Core Discipline
            </h3>
            <p className="text-base font-bold text-[var(--text-primary)]">
              Backend &bull; DevOps &bull; AI
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              FastAPI &bull; PostgreSQL &bull; Docker
            </p>
            <p className="text-[11px] text-[var(--text-muted)] pt-1">
              Offline LLMs via Ollama &bull; Dedicated GPU
            </p>
          </div>

          {/* Field Recognition */}
          <div className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Field Recognition
            </h3>
            <p className="text-base font-bold text-[var(--text-primary)]">
              Google Local Guide 🎁
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Official Google HQ Gift Recipient
            </p>
            <p className="text-[11px] text-[var(--text-muted)] pt-1">
              NOC Intern at Shunno IT &bull; BHTPA Python
            </p>
          </div>
        </div>
      </div>

      {/* "My World" Interactive 6-Card Identity Grid (Section 22) */}
      <div className="space-y-6 pt-4">
        <div className="text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            🌐 &ldquo;My World&rdquo; Identity Matrix
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Hover or tap each facet to explore how curiosity translates into systems.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {PROFILE_DATA.myWorld.map((item) => {
            const isHovered = hoveredWorld === item.id;
            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => {
                  setHoveredWorld(item.id);
                  sound.hover();
                }}
                onMouseLeave={() => setHoveredWorld(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative p-4 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between min-h-[140px] cursor-default"
              >
                <div>
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-xs font-medium text-[var(--color-primary)] mt-0.5">{item.shortDesc}</p>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-2 line-clamp-2">
                  {item.fullDesc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Engineering Journey Progression Timeline (Section 23) */}
      <div className="space-y-6 pt-8">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            🚀 Engineering Progression Timeline
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            A chronological roadmap from business economics to production DevOps and scalable systems.
          </p>
        </div>
        <JourneyTimeline />
      </div>
    </section>
  );
}
