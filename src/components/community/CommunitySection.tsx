"use client";

import React from "react";
import { Building2, HeartHandshake, Briefcase, ExternalLink, Award } from "lucide-react";
import { COMMUNITY_DATA, ActivityItem } from "@/data/community";
import { sound } from "@/lib/sound";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";

export function CommunitySection() {
  const leadership = COMMUNITY_DATA.activities.filter((a) => a.category === "leadership");
  const volunteering = COMMUNITY_DATA.activities.filter((a) => a.category === "volunteering");
  const professional = COMMUNITY_DATA.activities.filter((a) => a.category === "technical" || a.category === "media");

  return (
    <section id="community" className="scroll-mt-20 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <SectionHeader
        eyebrow="Campus leadership · Social impact"
        title={<>Community &amp; <Accent>activities</Accent></>}
        lede="College clubs, volunteering and technical work beyond the code editor."
        className="mb-6 sm:mb-10"
      />

      {/* 3-Column Categorized Activity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Column 1: Campus Leadership */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-glass)]">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Campus Leadership</h3>
          </div>

          {leadership.map((act: ActivityItem) => (
            <div
              key={act.id}
              className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-[11px] sm:text-base font-bold text-[var(--text-primary)] mb-1 sm:mb-1.5 leading-snug sm:leading-normal">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex min-h-8 items-center gap-1 sm:gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    View Official Club Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Column 2: Social Impact & Volunteering */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-glass)]">
            <HeartHandshake className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Social Impact &amp; Volunteer</h3>
          </div>

          {volunteering.map((act: ActivityItem) => (
            <div
              key={act.id}
              className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)]">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-[11px] sm:text-base font-bold text-[var(--text-primary)] mb-1 sm:mb-1.5 leading-snug sm:leading-normal">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    View Organization <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Column 3: Technical Experience & Media */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-glass)]">
            <Briefcase className="w-5 h-5 text-[var(--color-secondary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Technical &amp; Media Work</h3>
          </div>

          {professional.map((act: ActivityItem) => (
            <div
              key={act.id}
              className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-[11px] sm:text-base font-bold text-[var(--text-primary)] mb-1 sm:mb-1.5 leading-snug sm:leading-normal">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-signal hover:underline"
                  >
                    View Official Entity <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
