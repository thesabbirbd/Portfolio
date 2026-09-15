"use client";

import React from "react";
import { Users, Building2, HeartHandshake, Briefcase, GraduationCap, ExternalLink, Award } from "lucide-react";
import { COMMUNITY_DATA, ActivityItem } from "@/data/community";
import { sound } from "@/lib/sound";

export function CommunitySection() {
  const leadership = COMMUNITY_DATA.activities.filter((a) => a.category === "leadership");
  const volunteering = COMMUNITY_DATA.activities.filter((a) => a.category === "volunteering");
  const professional = COMMUNITY_DATA.activities.filter((a) => a.category === "technical" || a.category === "media");

  return (
    <section id="community" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-subtle border border-[var(--border-glass)] text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-4">
          <Users className="w-3.5 h-3.5" />
          Campus Leadership &bull; Social Impact
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          🤝 Community &amp; Activities
        </h2>
        <p className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]">
          Active collegiate leadership, grassroots humanitarian volunteering, and technical operations beyond the code editor.
        </p>
      </div>

      {/* 3-Column Categorized Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Campus Leadership */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-glass)]">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Campus Leadership</h3>
          </div>

          {leadership.map((act: ActivityItem) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-3 mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
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
            <HeartHandshake className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Social Impact &amp; Volunteer</h3>
          </div>

          {volunteering.map((act: ActivityItem) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-3 mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
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
              className="p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                    {act.role}
                  </span>
                  {act.badge && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{act.badge}</span>
                  )}
                </div>
                <h4 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
                  {act.organization}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {act.description}
                </p>
              </div>
              {act.url && (
                <div className="pt-3 mt-3 border-t border-[var(--border-glass)]">
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sound.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-secondary)] hover:underline"
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
