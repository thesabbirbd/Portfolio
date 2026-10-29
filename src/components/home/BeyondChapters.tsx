import React from "react";
import Link from "next/link";
import { Layers, Flame, Users, MapPinned, ArrowUpRight } from "lucide-react";
import { SKILL_CATEGORIES } from "@/data/skills";
import { PROFILE_DATA } from "@/data/profile";
import { COMMUNITY_DATA } from "@/data/community";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { RoleIcon } from "@/components/system/Card";

/**
 * Home chapter that hands off to the long-form sections which used to stack on Home
 * (Skills, Mission, Community, Maps). Every card is a real link; every fact comes from data.
 */
const CHAPTERS = [
  {
    href: "/experience#skills",
    role: "signal" as const,
    Icon: Layers,
    label: "Capabilities",
    title: "Skills ecosystem",
    fact: `${SKILL_CATEGORIES.length} areas — ${SKILL_CATEGORIES[0].title} to ${SKILL_CATEGORIES[SKILL_CATEGORIES.length - 1].title}`,
  },
  {
    href: "/experience#mission",
    role: "brand" as const,
    Icon: Flame,
    label: "Now",
    title: "Active mission",
    fact: PROFILE_DATA.mission.title,
  },
  {
    href: "/experience#community",
    role: "ok" as const,
    Icon: Users,
    label: "Community",
    title: "Leadership & volunteering",
    fact: `${COMMUNITY_DATA.activities.length} campus, volunteer and field roles`,
  },
  {
    href: "/exploration",
    role: "accent" as const,
    Icon: MapPinned,
    label: "Exploration",
    title: "Maps & Street View",
    fact: `Google Local Guide · ${COMMUNITY_DATA.maps.stats.status}`,
  },
];

export function BeyondChapters() {
  return (
    <section id="beyond" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <SectionHeader
        index="07"
        eyebrow="Beyond the code"
        title={<>Skills, mission &amp; <Accent>community</Accent></>}
        lede="The rest of the story lives on its own pages — pick a chapter."
        className="mb-8 sm:mb-12"
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {CHAPTERS.map(({ href, role, Icon, label, title, fact }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex sm:flex-col gap-3 h-full rounded-card surface-card surface-interactive p-4 sm:p-5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <RoleIcon role={role} className="w-9 h-9 sm:w-10 sm:h-10">
                <Icon className="w-[18px] h-[18px]" />
              </RoleIcon>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-eyebrow uppercase text-ink-3">{label}</span>
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4 text-ink-3 group-hover:text-primary transition-colors" />
                </span>
                <span className="block text-base font-bold text-ink mt-1">{title}</span>
                <span className="block text-sm text-ink-2 mt-1 leading-snug">{fact}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
