import React from "react";
import Link from "next/link";
import { JOURNEY_STEPS } from "@/data/journey";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { MoreLink, MoreLinks } from "@/components/system/MoreLink";

/**
 * Home chapter: the Engineering Evolution at a glance. Each step is a real link to the same
 * phase in the full scroll-told timeline on /about (stable `journey-<id>` anchors).
 */
export function JourneyPreview() {
  return (
    <section id="journey" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionHeader
        index="03"
        eyebrow="Journey"
        title={<>The Engineering <Accent>Evolution</Accent></>}
        lede="A continuous journey from business strategy to systems architecture."
        className="mb-8 sm:mb-12"
      />

      <ol className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {/* Static progress rail behind the steps (desktop) */}
        <span aria-hidden="true" className="hidden lg:block absolute left-4 right-4 top-[26px] h-0.5 rounded-full bg-gradient-to-r from-brand via-brand-2 to-signal opacity-60" />
        {JOURNEY_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.id} className="relative">
              <Link
                href={`/about#journey-${step.id}`}
                className="group flex lg:flex-col items-center lg:items-start gap-2.5 lg:gap-3 h-full rounded-card surface-card bg-paper surface-interactive p-3 lg:p-3.5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span className="relative z-10 inline-flex shrink-0 items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-paper border border-line text-primary group-hover:border-primary/40 transition-colors">
                  <Icon aria-hidden="true" className="w-4 h-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] text-ink-3 truncate">0{i + 1} · {step.stage}</span>
                  <span className="block text-sm font-black tracking-tight text-ink truncate">{step.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <MoreLinks>
        <MoreLink href="/about#timeline">Explore the full journey</MoreLink>
        <MoreLink href="/experience">Experience &amp; skills</MoreLink>
      </MoreLinks>
    </section>
  );
}
