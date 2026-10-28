import { SignalDiagram } from '@/components/system/Signal';
import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { MDXContent } from './MDXContent';
import { ConnectedKnowledge } from './ConnectedKnowledge';
import { ExternalLink, ArrowLeft, ArrowRight, Code } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    idea: 'bg-ink/5 text-ink-3 border-line',
    prototype: 'bg-accent/10 text-accent border-accent/25',
    active: 'bg-ok/10 text-ok border-ok/25',
    experimental: 'bg-signal/10 text-signal border-signal/25',
    paused: 'bg-ink/5 text-ink-3 border-line',
    archived: 'bg-ink/5 text-ink-3 border-line',
    completed: 'bg-primary/10 text-primary border-primary/25',
  };
  
  const defaultColor = 'bg-primary/10 text-primary border-primary/20';
  const colorClass = colors[status.toLowerCase()] || defaultColor;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} uppercase tracking-wider`}>
      {status}
    </span>
  );
}

function ArchitectureGraph({ nodes, edges }: { nodes: string[], edges: string[] }) {
  // Cyber AI expression: dark signal-grid figure with numbered nodes and arrowed flows.
  return <SignalDiagram nodes={nodes} edges={edges} />;
}

export function ProjectLayout({ item }: { item: ContentItem }) {
  const { meta, content } = item;
  
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <div className="container mx-auto px-4 max-w-4xl mb-24">
        
        {/* BREADCRUMBS */}
        <nav className="flex text-sm text-muted-foreground mb-12" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-foreground truncate max-w-[150px] md:max-w-xs">{meta.title}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* PROJECT HERO */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {meta.projectStatus && <StatusBadge status={meta.projectStatus} />}
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {meta.category || 'Engineering'}
            </span>
            {meta.dateStarted && (
              <span className="text-sm text-muted-foreground">
                Started: {new Date(meta.dateStarted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">{meta.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
            {meta.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {meta.demoUrl && (
              <a href={meta.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors">
                <ExternalLink className="w-4 h-4" /> View Live
              </a>
            )}
            {meta.githubUrl && (
              <a href={meta.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground font-medium border border-border/50 rounded-xl hover:bg-muted/80 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg> View Source
              </a>
            )}
          </div>
        </header>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-border/50 mb-16 bg-muted/10 rounded-2xl p-8">
          {meta.technologies && meta.technologies.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {meta.technologies.map(tech => (
                  <span key={tech} className="text-xs font-mono bg-background border border-border/50 px-2.5 py-1 rounded-md text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {meta.projectRole && (
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">My Role</h2>
              <p className="text-muted-foreground">{meta.projectRole}</p>
            </div>
          )}
        </div>
        
        {/* ARCHITECTURE (if defined) */}
        {meta.architecture && meta.architecture.nodes && (
          <ArchitectureGraph nodes={meta.architecture.nodes} edges={meta.architecture.edges || []} />
        )}

        {/* MDX CONTENT */}
        <div className="min-h-[30vh]">
          <MDXContent source={content} />
        </div>
        
        {/* CHANGELOG (if defined) */}
        {meta.changelog && meta.changelog.length > 0 && (
          <div className="mt-16 mb-8 border-t border-border/50 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-foreground">Project Changelog</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {meta.changelog.map((entry, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-foreground">{entry.title}</h3>
                      <time className="text-xs font-mono text-muted-foreground">{entry.date}</time>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ConnectedKnowledge meta={meta} />

      </div>
    </div>
  );
}
