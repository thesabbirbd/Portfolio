import React from "react";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { COMMUNITY_DATA } from "@/data/community";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card } from "@/components/system/Card";
import { GithubIcon } from "@/components/ui/BrandIcons";

const { mission } = PROFILE_DATA;

/**
 * /experience — the current learning mission: what the sprint covers, where the code lives,
 * and a compact roll-call that hands off to the Community section further down the page.
 * Static content only (no simulated "live" telemetry).
 */
export function MissionSection() {
  return (
    <section id="mission" className="relative py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-20">
      <SectionHeader
        eyebrow="Current mission"
        title={<>100-day backend &amp; <Accent>DevOps sprint</Accent></>}
        lede={mission.currentFocus}
        className="mb-6 sm:mb-8"
      />

      <Card variant="elevated" className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-ok/25 bg-ok/10 text-ok text-[11px] font-mono font-semibold uppercase tracking-wider">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />
            {mission.status}
          </span>
          <h3 className="text-sm font-semibold text-ink-2">Five focus areas</h3>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {mission.pillars.map((pillar, i) => (
            <li key={pillar.title} className="flex gap-3 rounded-xl bg-muted/60 p-3 sm:p-4">
              <span aria-hidden="true" className="font-mono text-xs font-bold text-primary pt-0.5">0{i + 1}</span>
              <div>
                <h4 className="text-sm font-bold text-ink">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-ink-2 leading-relaxed mt-0.5">{pillar.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <Card className="p-4 sm:p-5 flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <GithubIcon aria-hidden="true" className="w-4 h-4" /> Code on GitHub
          </h3>
          <p className="text-sm text-ink-2 leading-relaxed">
            The sprint&apos;s main build is <Link href="/projects/omnidesk" className="font-semibold text-primary hover:underline underline-offset-4">Omnidesk BD</Link>, a FastAPI + PostgreSQL + Docker learning workspace with its source on GitHub.
          </p>
          <a
            href="https://github.com/thesabbirbd"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex min-h-10 items-center gap-1.5 self-start rounded-full px-4 surface-card surface-interactive text-sm font-semibold text-ink"
          >
            github.com/thesabbirbd <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
          </a>
        </Card>

        {/* Compact roll-call instead of repeating the Community section that follows on this page */}
        <a href="#community" className="reveal group flex flex-col gap-3 rounded-card surface-card surface-interactive p-4 sm:p-5">
          <span className="flex items-center gap-2 text-base font-bold text-ink">
            <Users aria-hidden="true" className="w-4 h-4 text-accent" /> Community &amp; leadership
          </span>
          <ul className="flex flex-wrap gap-1.5">
            {COMMUNITY_DATA.activities.map((act) => (
              <li key={act.id} className="px-2.5 py-1 rounded-md bg-muted text-xs text-ink-2">
                <span className="font-semibold text-ink">{act.role}</span> · {act.organization.replace(/\s*\(.*\)$/, "")}
              </li>
            ))}
          </ul>
          <span className="mt-auto text-sm font-semibold text-primary group-hover:underline underline-offset-4">
            {COMMUNITY_DATA.activities.length} engagements — details below ↓
          </span>
        </a>
      </div>
    </section>
  );
}
