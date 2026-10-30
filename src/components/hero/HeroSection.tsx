"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown, ArrowUpRight, Terminal, Send } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { PROFILE_DATA } from "@/data/profile";
import { AIYAAR } from "@/data/aiyaar";
import { swapTransition } from "@/lib/motion-presets";
import { GlowButton } from "@/components/ui/GlowButton";
import { MotionLoopVideo } from "@/components/ui/MotionLoopVideo";
import { BauhausField } from "@/components/system/BauhausField";
// Server-rendered so the portrait (the LCP image) paints with the HTML and reserves its box (no layout shift).
import { SpatialCore } from "@/components/hero/SpatialCore";

/** The rotating role line. Its own component so the 2.8 s swap re-renders only this line, not the hero. */
function RotatingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PROFILE_DATA.rotatingRoles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);
  return (
    /* initial={false}: the first role renders visible in the server HTML (no-JS / slow hydration) */
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={roleIndex}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={swapTransition}
        className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-xl surface-card text-ink font-mono text-xs sm:text-sm md:text-base font-semibold tracking-tight max-w-full truncate"
      >
        <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
        <span className="truncate">{PROFILE_DATA.rotatingRoles[roleIndex]}</span>
      </motion.div>
    </AnimatePresence>
  );
}

export function HeroSection() {
  const { spatial3D } = useSettings();

  return (
    <section
      id="hero"
      className="relative min-h-[70svh] md:min-h-[90vh] landscape:min-h-0 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-4 short-portrait:pt-1 pb-10 md:py-20 landscape:py-12 overflow-hidden"
    >
      {/* Ambient motion loop: opt-in with "3D / Spatial effects" (D20 — the masked full-hero video layer was the
          largest remaining desktop frame cost). Tablet/desktop only; light mode uses the pre-rendered light variant. */}
      {spatial3D && (
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-0 -z-10 pointer-events-none opacity-35 dark:opacity-60 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black_30%,transparent_80%)]"
        >
          <MotionLoopVideo
            src="/assets/videos/ambient-cyber-loop"
            lightSrc="/assets/videos/ambient-cyber-loop-light"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Scroll exit is CSS-only (cine-exit-* scroll timelines on the two columns): no per-frame JS. */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 short-landscape:grid-cols-12 gap-5 short-portrait:gap-3 sm:gap-8 items-center">
        {/* Left Column: Typography & Dynamic Identity */}
        <div className="cine-exit-slow lg:col-span-7 short-landscape:col-span-7 flex flex-col order-2 lg:order-1 short-landscape:order-1 items-center lg:items-start short-landscape:items-start text-center lg:text-left short-landscape:text-left space-y-3.5 short-portrait:space-y-2.5 md:space-y-6 short-landscape:space-y-3">
          {/* Status Badge */}
          {/* Entrances use the CSS `rise` keyframe: visible from first paint, no hydration wait. */}
          <a
            href={AIYAAR.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Visit aiyaar.ltd (opens in a new tab)"
            className="motion-safe:animate-rise group inline-flex items-center gap-2 px-3 xs:px-3.5 py-1.5 rounded-full surface-card border-primary/30 hover:border-primary/60 text-[11px] xs:text-xs font-mono tracking-normal xs:tracking-wider whitespace-nowrap transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-ok md:motion-safe:animate-pulse" />
            <span className="text-ink-2">{AIYAAR.roleShort} @</span>
            <span className="font-bold text-primary">{AIYAAR.name}</span>
            <ArrowUpRight aria-hidden="true" className="w-3 h-3 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Names */}
          <div className="space-y-1">
            {/* Plain element: a Framer initial offset here was frozen into the HTML without JS and overlapped the wordmark */}
            <p className="motion-safe:animate-rise text-lg sm:text-xl md:text-2xl short-landscape:text-lg font-medium tracking-tight text-ink-2">
              {PROFILE_DATA.fullName}
            </p>

            <h1 className="text-display short-landscape:text-[3.25rem] font-black text-ink">
              {/* Editorial wordmark: "THE" in ink, the name in the brand display gradient.
                  Kinetic entrance: each word rises from a mask once (transform only, motion-safe). */}
              <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <span className="inline-block motion-safe:animate-reveal">{PROFILE_DATA.shortName.split(" ")[0]}</span>
              </span>{" "}
              <span className="gold-sheen inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <span style={{ animationDelay: "90ms" }} className="inline-block text-display-gradient motion-safe:animate-reveal">
                  {PROFILE_DATA.shortName.split(" ").slice(1).join(" ")}
                </span>
              </span>
            </h1>
          </div>

          {/* Dynamic Rotating Role Headline */}
          <div className="h-10 short-portrait:h-8 sm:h-12 flex items-center justify-center lg:justify-start overflow-hidden max-w-full">
            <RotatingRole />
          </div>

          {/* Hero Narrative Statement */}
          <p className="text-sm sm:text-lg text-ink-2 max-w-xl font-normal leading-relaxed text-pretty">
            {PROFILE_DATA.heroStatement}
          </p>

          {/* Micro-Telemetry Pills */}
          <div
            style={{ animationDelay: "120ms" }}
            className="motion-safe:animate-rise flex short-portrait:hidden flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start text-[11px] sm:text-xs font-mono text-ink-2 pt-1"
          >
            <span className="px-2.5 py-1 rounded-md surface-card shadow-none">
              ⚡ Local AI &amp; Ollama
            </span>
            <span className="px-2.5 py-1 rounded-md surface-card shadow-none">
              🐳 Docker &amp; Containers
            </span>
            <span className="px-2.5 py-1 rounded-md surface-card shadow-none">
              🎓 BBA Management
            </span>
          </div>

          {/* Call to Actions */}
          <div
            style={{ animationDelay: "200ms" }}
            className="motion-safe:animate-rise flex flex-wrap items-center gap-3 short-portrait:gap-2 sm:gap-4 justify-center lg:justify-start pt-2 short-portrait:pt-0"
          >
            <GlowButton href="/#projects" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Explore My Work
            </GlowButton>
            <GlowButton href="/#contact" variant="glass" size="lg" icon={<Send className="w-4 h-4" />}>
              Connect With Me
            </GlowButton>
          </div>
        </div>

        {/* Right Column: 3D Spatial Core Visualization */}
        <div className="relative lg:col-span-5 short-landscape:col-span-5 flex justify-center order-1 lg:order-2 short-landscape:order-2 motion-safe:animate-rise">
          {/* Tactile Editorial: static Bauhaus geometry anchoring the portrait core (sized to the core, never over text) */}
          <BauhausField className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[270px] xs:w-[300px] sm:w-[112%] sm:max-w-[560px] short-landscape:w-[270px] short-portrait:w-[210px] aspect-square opacity-55 sm:opacity-70 dark:opacity-50 sm:dark:opacity-60" />
          <SpatialCore />
        </div>
      </div>

      {/* Next-chapter cue: a real link to the first Home chapter (static, no looping animation) */}
      <Link
        href="#about"
        className="hidden md:inline-flex short-landscape:hidden absolute bottom-6 left-1/2 -translate-x-1/2 min-h-8 items-center gap-2 font-mono text-eyebrow uppercase text-ink-3 hover:text-primary transition-colors"
      >
        <span>01 / Identity</span>
        <ArrowDown aria-hidden="true" className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
