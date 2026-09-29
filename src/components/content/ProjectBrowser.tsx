"use client";

import { useState, useMemo } from 'react';
import { ContentItem } from '@/lib/content';
import Link from 'next/link';

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

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-12">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 text-sm rounded-xl transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
        >
          All Projects
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm rounded-xl transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-border/50">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredProjects.map(project => (
            <div key={project.meta.slug} className="group flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-muted/10 border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {project.meta.title}
                  </h3>
                  {project.meta.projectStatus && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {project.meta.projectStatus}
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {project.meta.description}
                </p>

                {project.meta.technologies && project.meta.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.meta.technologies.slice(0, 5).map(tech => (
                      <span key={tech} className="text-xs font-mono px-2 py-1 bg-background border border-border/50 rounded text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                    {project.meta.technologies.length > 5 && (
                      <span className="text-xs font-mono px-2 py-1 bg-background border border-border/50 rounded text-muted-foreground">
                        +{project.meta.technologies.length - 5}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="pt-4">
                  <Link href={`/projects/${project.meta.slug}`} className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    View Case Study <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
