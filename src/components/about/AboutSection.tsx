"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import Image from "next/image";
import { GraduationCap, MapPin, Cpu, Award } from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { SKILL_CATEGORIES } from "@/data/skills";
import { CURRENT_ROLE, LINKEDIN_URL } from "@/data/experience";
import Link from "next/link";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { sound } from "@/lib/sound";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card, RoleIcon } from "@/components/system/Card";
import { MoreLink, MoreLinks } from "@/components/system/MoreLink";
import { AiyaarName } from "@/components/system/AiyaarName";

type PhotoMode = "glass" | "spatial" | "editorial" | "clean";

const IDENTITY_FACTS = [
  { role: "brand" as const, Icon: GraduationCap, label: "Academic", value: PROFILE_DATA.academic.degree, sub: PROFILE_DATA.academic.institution, extra: `Foundation: ${PROFILE_DATA.academic.foundation}`, extraAlways: false },
  { role: "accent" as const, Icon: MapPin, label: "Base", value: PROFILE_DATA.academic.location, sub: `Roots: ${PROFILE_DATA.academic.origin}`, extra: "BST · UTC+6", extraAlways: true },
  { role: "signal" as const, Icon: Cpu, label: "Discipline", value: "Backend · AI", sub: "FastAPI, Postgres, Docker", extra: "Offline LLMs · GPU", extraAlways: false },
  { role: "ok" as const, Icon: Award, label: "Honors", value: "Google Local Guide", sub: "Google HQ gift recipient", extra: "Local Guide since 2017", extraAlways: false },
];

/** Current role (Aiyaar): a prominent, clickable card linking to /aiyaar, plus LinkedIn. */
function CurrentRole({ className = "" }: { className?: string }) {
  return (
    <div className={`reveal flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-card border border-primary/25 bg-primary/5 p-4 sm:p-5 ${className}`}>
      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 text-ok text-[11px] font-mono font-semibold uppercase tracking-wider">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" /> Currently
        </span>
        <p className="mt-1 text-lg sm:text-xl font-bold text-ink">
          {CURRENT_ROLE.title} at{" "}
          <AiyaarName>{CURRENT_ROLE.org}</AiyaarName>
        </p>
        <p className="text-sm text-ink-2">All-in-one POS, online store, inventory &amp; digital khata SaaS for Bangladeshi businesses.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/aiyaar" className="inline-flex min-h-10 items-center px-4 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-colors">About Aiyaar</Link>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">LinkedIn</a>
      </div>
    </div>
  );
}

/** The four identity facts as compact editorial cards (shared by /about and the Home overview). */
function IdentityFacts({ className }: { className?: string }) {
  return (
    <div className={className}>
      {IDENTITY_FACTS.map(({ role, Icon, label, value, sub, extra, extraAlways }) => (
        <Card key={label} deco className="p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2">
            <RoleIcon role={role} className="w-7 h-7 sm:w-9 sm:h-9">
              <Icon className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
            </RoleIcon>
            <h3 className="font-mono text-eyebrow uppercase text-ink-3">{label}</h3>
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-ink leading-snug">{value}</p>
            <p className="text-xs text-ink-2 mt-0.5 sm:mt-1 leading-snug line-clamp-2">{sub}</p>
            <p className={`${extraAlways ? "" : "hidden sm:block "}text-xs text-ink-3 pt-1 font-mono`}>{extra}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * `full` (default) renders the complete identity story used on /about: greeting, portrait,
 * identity facts, "My World" matrix and the Engineering Evolution timeline.
 * `overview` is the Home chapter: header, identity facts and a hand-off to /about.
 */
export function AboutSection({ variant = "full" }: { variant?: "full" | "overview" }) {
  if (variant === "overview") {
    return (
      <section id="about" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <SectionReveal className="w-full">
          <SectionHeader
            index="01"
            eyebrow="Identity"
            title={<>Where Business Economics Meets <Accent>Systems Engineering</Accent>.</>}
            lede={PROFILE_DATA.bioShort}
            className="mb-4"
          />
          <CurrentRole className="mb-8 sm:mb-10" />
          <IdentityFacts className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4" />
          <MoreLinks>
            <MoreLink href="/about">Read the full story</MoreLink>
            <MoreLink href="/resume">View résumé</MoreLink>
            <MoreLink href="/cv/Md-Sabbirul-Islam-Khan-CV-2026.pdf">Download CV (PDF)</MoreLink>
          </MoreLinks>
        </SectionReveal>
      </section>
    );
  }

  return <AboutFull />;
}

// "Current stack": the skills marked Active Focus in src/data/skills.ts (real data, no new claims).
const CURRENT_STACK = SKILL_CATEGORIES.flatMap((c) => c.skills.filter((sk) => sk.level === "Active Focus").map((sk) => sk.name));

const PHOTO_MODES: { id: PhotoMode; label: string; src: string }[] = [
  { id: "glass", label: "Glass", src: "/assets/about-glass.jpg" },
  { id: "spatial", label: "Spatial", src: "/assets/about-spatial.jpg" },
  { id: "editorial", label: "Editorial", src: "/assets/about-editorial.jpg" },
  { id: "clean", label: "Clean", src: "/assets/about-clean.jpg" },
];

// Frame styles per mode, on design tokens. CSS owns the (rotate) transition; no Framer layout here.
const FRAME_CLASS: Record<PhotoMode, string> = {
  glass: "surface-elevated p-3",
  spatial: "p-4 bg-gradient-to-tr from-brand/25 via-brand-2/15 to-signal/15 border border-line shadow-e2 -rotate-1 hover:rotate-0",
  editorial: "p-3 bg-paper border border-line shadow-e2",
  clean: "p-1 border border-line",
};

/**
 * The /about identity page: one intro (h1), a compact identity module (portrait + facts + stack),
 * the long-form bio once, the "My World" matrix, the full Engineering Evolution timeline, and
 * hand-offs to the evidence routes.
 */
function AboutFull() {
  const [photoMode, setPhotoMode] = useState<PhotoMode>("glass");
  const [, setHoveredWorld] = useState<string | null>(null);
  const photo = PHOTO_MODES.find((m) => m.id === photoMode)!;

  return (
    <section id="about" className="relative pb-12 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-x-clip">
      <SectionReveal className="w-full">
        <SectionHeader
          as="h1"
          eyebrow="About"
          title={<>Md Sabbirul Islam Khan — <Accent>THE SABBiR</Accent></>}
          lede="A Management student at Rajshahi College who bridges business thinking and hands-on technical problem-solving — exploring backend engineering, DevOps, Linux and local AI by building and documenting real projects."
          className="mb-4"
        />
        <CurrentRole className="mb-6 sm:mb-8" />

        {/* Spiritual greeting (requested by the owner) */}
        <div className="mb-8 sm:mb-12 inline-block px-4 py-3 rounded-card surface-card">
          <div className="text-sm font-semibold text-ink">{PROFILE_DATA.spiritualEthos.greeting}</div>
          <div className="text-xs text-ink-3 mt-0.5 font-mono">{PROFILE_DATA.spiritualEthos.smile}</div>
          <div className="text-sm font-bold text-ok mt-1">{PROFILE_DATA.spiritualEthos.alhamdulillah}</div>
          <div className="text-xs text-ink-3 font-mono">{PROFILE_DATA.spiritualEthos.jazakallah}</div>
        </div>

        {/* Identity module: portrait + facts + current stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[268px] sm:max-w-sm">
              {/* Photo modes: one scrollable row on phones */}
              <div role="group" aria-label="Portrait style" className="flex gap-1 p-1 mb-3 rounded-full surface-card overflow-x-auto hide-scrollbar">
                {PHOTO_MODES.map((m) => (
                  <button
                    key={m.id}
                    aria-pressed={photoMode === m.id}
                    onClick={() => {
                      setPhotoMode(m.id);
                      sound.click();
                    }}
                    className={`flex-1 shrink-0 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium rounded-full transition-colors ${
                      photoMode === m.id ? "bg-primary text-on-primary" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className={`relative rounded-panel overflow-hidden transition-transform duration-500 ease-out-expo ${FRAME_CLASS[photoMode]}`}>
                <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-[#0b0d12] flex flex-col items-center justify-end p-4 sm:p-6 text-center text-white">
                  <Image
                    src={photo.src}
                    alt="Md Sabbirul Islam Khan"
                    fill
                    sizes="(max-width: 640px) 268px, 400px"
                    className={`object-cover object-center transition-transform duration-700 hover:scale-105 ${photoMode === "editorial" ? "brightness-[1.20] contrast-105" : ""}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1.5">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">Md Sabbirul Islam Khan</h2>
                    <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-widest text-[rgb(var(--brand-2))]">THE SABBiR</div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-[rgb(52_211_153)]">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[rgb(52_211_153)]" />
                      ONLINE · BUILDING · LEARNING
                    </div>
                  </div>
                </div>
                {photoMode === "editorial" && (
                  <div className="pt-2.5 px-1 flex items-center justify-between text-[11px] text-ink-3 font-mono">
                    <span>THE SABBiR</span>
                    <span>RAJSHAHI · BD</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
            <IdentityFacts className="grid grid-cols-2 gap-2.5 sm:gap-4" />
            <Card className="p-4 sm:p-5">
              <h3 className="font-mono text-eyebrow uppercase text-ink-3 mb-2.5">Current stack · active focus</h3>
              <ul className="flex flex-wrap gap-1.5">
                {CURRENT_STACK.map((name) => (
                  <li key={name} className="px-2.5 py-1 rounded-md bg-ink/5 dark:bg-white/5 text-xs font-mono text-ink-2">{name}</li>
                ))}
              </ul>
              <Link href="/experience#skills" className="inline-flex min-h-8 items-center mt-2 text-sm font-semibold text-primary hover:underline underline-offset-4">
                Full skills ecosystem →
              </Link>
            </Card>
          </div>
        </div>

        {/* In my own words — the long-form bio, once */}
        <div className="mt-12 sm:mt-16 max-w-3xl">
          <h2 className="text-h3 font-bold text-ink mb-3">In my own words</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed text-pretty">
            <p>{PROFILE_DATA.bioNarrative}</p>
            <p>
              Based in Rajshahi, Bangladesh, I explore Backend Engineering, DevOps, Local AI (such as Ollama), Linux, and IT Systems.
              I believe in learning by doing, which has led me to build projects like Omnidesk BD and contribute actively as a Google Maps Local Guide.
              You can find my open-source work on{" "}
              <a href="https://github.com/thesabbirbd" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">GitHub</a>
              {" "}or connect with me professionally on{" "}
              <a href="https://www.linkedin.com/in/thesabbirbd/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">LinkedIn</a>.
            </p>
          </div>
        </div>

        {/* "My World" identity matrix */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-h3 font-bold text-ink">&ldquo;My World&rdquo; Identity Matrix</h2>
          <p className="text-sm text-ink-3 mt-1 mb-4 sm:mb-6">How curiosity translates into systems.</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {PROFILE_DATA.myWorld.map((item) => (
              <Card
                as="li"
                key={item.id}
                interactive
                onMouseEnter={() => setHoveredWorld(item.id)}
                onMouseLeave={() => setHoveredWorld(null)}
                className="p-3 sm:p-4 flex flex-col items-start gap-2 hover:-translate-y-1"
              >
                <span aria-hidden="true" className="text-xl sm:text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                  <p className="text-xs font-medium text-primary mt-0.5">{item.shortDesc}</p>
                  <p className="text-xs text-ink-3 leading-snug mt-1.5 line-clamp-3 hidden sm:block">{item.fullDesc}</p>
                </div>
              </Card>
            ))}
          </ul>
        </div>

        {/* Engineering Evolution — the full scroll-told timeline (#timeline, #journey-<id>) */}
        <div className="mt-8 sm:mt-12">
          <JourneyTimeline />
        </div>

        {/* Evidence & exploration */}
        <div className="mt-4">
          <h2 className="font-mono text-eyebrow uppercase text-ink-3">Evidence &amp; exploration</h2>
          <MoreLinks className="mt-3 sm:mt-4">
            <MoreLink href="/projects">Explore projects</MoreLink>
            <MoreLink href="/engineering-lab" tone="signal">Engineering Lab</MoreLink>
            <MoreLink href="/notes">Read notes</MoreLink>
            <MoreLink href="/journal">Process logs</MoreLink>
            <MoreLink href="/resume">Résumé</MoreLink>
          </MoreLinks>
        </div>
      </SectionReveal>
    </section>
  );
}
