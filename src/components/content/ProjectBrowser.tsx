"use client";

import { useState, useMemo } from 'react';
import { ContentItem } from '@/lib/content';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  active: 'text-ok bg-ok/10 border-ok/25',
  experimental: 'text-signal bg-signal/10 border-signal/25',
  completed: 'text-primary bg-primary/10 border-primary/25',
  prototype: 'text-accent bg-accent/10 border-accent/25',
};

/**
 * /projects list: a single-row, horizontally scrollable filter on phones (wraps on larger
 * screens) and level-1 cards whose title link covers the whole card for an easy touch target.
 */
export function ProjectBrowser({ projects }: { projects: ContentItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => {
      if (p.meta.category) cats.add(p.meta.category);
    });
    return Array.from(cats).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedCategory) return p.meta.category === selectedCategory;
      return true;
    });
  }, [projects, selectedCategory]);

  const filters: { value: string | null; label: string }[] = [{ value: null, label: 'All projects' }, ...categories.map(c => ({ value: c, label: c }))];

  return (
    <div className="w-full">
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:flex-wrap gap-2 mb-6 sm:mb-10 overflow-x-auto sm:overflow-visible snap-x hide-scrollbar"
      >
        {filters.map(({ value, label }) => {
          const active = selectedCategory === value;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedCategory(value)}
              className={cn(
                'shrink-0 snap-start px-3.5 py-2 min-h-10 text-sm rounded-full border transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active ? 'bg-primary border-primary text-on-primary font-semibold' : 'border-line text-ink-2 hover:text-ink hover:border-line-strong'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">{filteredProjects.length} projects shown</p>

      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-ink-3 rounded-card surface-card">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-5">
          {filteredProjects.map(project => {
            const status = project.meta.projectStatus;
            return (
              <article key={project.meta.slug} className="reveal group relative flex flex-col gap-3 p-4 sm:p-6 rounded-card surface-card surface-interactive">
                <div className="flex flex-wrap items-center gap-2">
                  {status && (
                    <span className={cn('px-2 py-0.5 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-wider', STATUS_STYLE[status] ?? 'text-ink-3 bg-muted border-line')}>
                      {status}
                    </span>
                  )}
                  {project.meta.category && <span className="text-xs font-mono text-ink-3">{project.meta.category}</span>}
                </div>
                <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
                  <Link href={`/projects/${project.meta.slug}`} className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary/50">
                    {project.meta.title}
                  </Link>
                </h3>

                <p className="text-sm sm:text-base text-ink-2 leading-relaxed line-clamp-3 sm:line-clamp-2">
                  {project.meta.description}
                </p>

                {project.meta.technologies && project.meta.technologies.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                    {project.meta.technologies.slice(0, 5).map(tech => (
                      <li key={tech} className="text-xs font-mono px-2 py-0.5 bg-muted rounded text-ink-2">
                        {tech}
                      </li>
                    ))}
                    {project.meta.technologies.length > 5 && (
                      <li className="text-xs font-mono px-2 py-0.5 bg-muted rounded text-ink-3">
                        +{project.meta.technologies.length - 5}
                      </li>
                    )}
                  </ul>
                )}

                <span aria-hidden="true" className="inline-flex items-center text-sm font-semibold text-primary">
                  View case study <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
