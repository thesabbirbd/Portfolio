"use client";

import React from "react";
import { Building2, HeartHandshake, Briefcase, ExternalLink } from "lucide-react";
import { COMMUNITY_DATA, ActivityItem } from "@/data/community";
import { sound } from "@/lib/sound";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";

interface ActivityColumnProps {
  title: string;
  icon: React.ReactNode;
  activities: ActivityItem[];
  roleClass: string;
  linkClass: string;
  linkText: string;
}

function ActivityColumn({ title, icon, activities, roleClass, linkClass, linkText }: ActivityColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border-glass)]">
        {icon}
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      </div>

      {activities.map((act: ActivityItem) => (
        <div
          key={act.id}
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <span className={`text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${roleClass}`}>
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
                className={`inline-flex min-h-8 items-center gap-1 sm:gap-1.5 text-xs font-medium hover:underline ${linkClass}`}
              >
                {linkText} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

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
        <ActivityColumn
          title="Campus Leadership"
          icon={<Building2 className="w-5 h-5 text-[var(--color-primary)]" />}
          activities={leadership}
          roleClass="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          linkClass="text-primary"
          linkText="View Official Club Page"
        />

        <ActivityColumn
          title="Social Impact &amp; Volunteer"
          icon={<HeartHandshake className="w-5 h-5 text-[var(--color-accent)]" />}
          activities={volunteering}
          roleClass="px-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)]"
          linkClass="text-accent gap-1.5"
          linkText="View Organization"
        />

        <ActivityColumn
          title="Technical &amp; Media Work"
          icon={<Briefcase className="w-5 h-5 text-[var(--color-secondary)]" />}
          activities={professional}
          roleClass="px-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]"
          linkClass="text-signal gap-1.5"
          linkText="View Official Entity"
        />
      </div>
    </section>
  );
}
