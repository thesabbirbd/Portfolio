"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Terminal, HardDrive, Layers, Eye, ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { PROJECTS_DATA, ProjectItem, projectHref } from "@/data/projects";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card, RoleIcon } from "@/components/system/Card";
import { MoreLink, MoreLinks } from "@/components/system/MoreLink";
import { sound } from "@/lib/sound";

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Systems: Terminal,
  AI: Sparkles,
  Hardware: HardDrive,
};

/** One build per discipline (excluding the flagship), so the preview shows range, not repetition. */
function pickPreview(projects: ProjectItem[], count = 3) {
  const seen = new Set<string>();
  const picked: ProjectItem[] = [];
  for (const p of projects) {
    if (p.featured || seen.has(p.category)) continue;
    seen.add(p.category);
    picked.push(p);
    if (picked.length === count) break;
  }
  return picked;
}

/**
 * Home "Selected Work" chapter: chapter header → flagship spotlight (passed as children) →
 * three more builds → hand-off to /projects, which holds every case study.
 */
export function ProjectsSection({ children }: { children?: React.ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const preview = pickPreview(PROJECTS_DATA);

  return (
    <section id="projects" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      <SectionReveal className="w-full">
        <SectionHeader
          index="02"
          eyebrow="Selected Work"
          title={<>Builds, experiments &amp; <Accent>case studies</Accent></>}
          lede="A flagship learning workspace, systems labs and hardware builds — each with a write-up of what was built, what broke and what changed."
          className="mb-8 sm:mb-12"
        />

        {children}

        <h3 className="mt-10 sm:mt-14 mb-4 sm:mb-6 font-mono text-eyebrow uppercase text-ink-3">More builds</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-5">
          {preview.map((project) => {
            const Icon = CATEGORY_ICON[project.category] ?? Layers;
            return (
              <Card as="li" key={project.id} interactive className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-mono text-[11px] text-ink-3">
                    <RoleIcon role="brand" className="w-7 h-7">
                      <Icon className="w-3.5 h-3.5" />
                    </RoleIcon>
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] text-ink-3">{project.year}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-ink leading-snug">
                    <Link href={projectHref(project)} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
                      {project.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-ink-2 mt-1.5 leading-relaxed line-clamp-3">{project.shortDescription}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded text-[11px] font-mono bg-ink/5 dark:bg-white/5 text-ink-2">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                  <Link href={projectHref(project)} className="inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4">
                    Case study <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedProject(project); sound.modalOpen(); }}
                      className="p-2 rounded-full text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors"
                      aria-label={`Quick view: ${project.title}`}
                      title="Quick view"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.click()}
                        className="p-2 rounded-full text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </ul>

        <MoreLinks>
          <MoreLink href="/projects">All projects &amp; case studies</MoreLink>
        </MoreLinks>
      </SectionReveal>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
