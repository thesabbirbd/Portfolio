import React from "react";
import { Server, Container, Network, Brain, Cloud, Video, Cpu, Wrench } from "lucide-react";
import { SKILL_CATEGORIES, type SkillItem } from "@/data/skills";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card, RoleIcon } from "@/components/system/Card";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { Server, Container, Network, Brain, Cloud, Video, Cpu, Wrench };
const ROLES = { blue: "brand", cyan: "signal", emerald: "ok", purple: "accent" } as const;

const LEVELS: { level: NonNullable<SkillItem["level"]>; dot: string; hint: string }[] = [
  { level: "Active Focus", dot: "bg-primary", hint: "what I build with now" },
  { level: "Hands-on", dot: "bg-ok", hint: "used in real projects" },
  { level: "Foundational", dot: "bg-ink-3", hint: "studied, early practice" },
];
const DOT = Object.fromEntries(LEVELS.map((l) => [l.level, l.dot]));

/**
 * Capabilities matrix built from the canonical skills data (src/data/skills.ts). Every skill is
 * visible with its honest level — no hover-to-reveal, so touch devices get the same content.
 */
export function SkillsBento() {
  return (
    <section id="skills" className="relative w-full max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <SectionHeader
        eyebrow="Capabilities"
        title={<>Skills by <Accent>area</Accent></>}
        lede="Grouped by discipline, each marked with how deeply I use it today."
        className="mb-6 sm:mb-8"
      />

      <ul className="reveal flex flex-wrap gap-x-5 gap-y-2 mb-6 sm:mb-8 text-xs text-ink-2" aria-label="Skill levels">
        {LEVELS.map(({ level, dot, hint }) => (
          <li key={level} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", dot)} />
            <span><span className="font-semibold text-ink">{level}</span> — {hint}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {SKILL_CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] ?? Server;
          return (
            <Card key={cat.id} className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <RoleIcon role={ROLES[cat.color]} className="w-9 h-9 shrink-0">
                  <Icon className="w-[18px] h-[18px]" />
                </RoleIcon>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-ink leading-tight">{cat.title}</h3>
                  <p className="text-xs text-ink-3 mt-0.5 leading-snug">{cat.tagline}</p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <li
                    key={skill.name}
                    title={skill.context}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-mono text-ink-2"
                  >
                    <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT[skill.level ?? "Foundational"])} />
                    {skill.name}
                    <span className="sr-only"> ({skill.level ?? "Foundational"})</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
