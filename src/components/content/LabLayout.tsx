import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { MDXContent } from './MDXContent';
import { ConnectedKnowledge } from './ConnectedKnowledge';
import { FlaskConical, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

function ResultBadge({ result }: { result: string }) {
  const mapping: Record<string, { icon: React.ReactNode, class: string }> = {
    success: { icon: <CheckCircle className="w-4 h-4" />, class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    partial: { icon: <Activity className="w-4 h-4" />, class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    failed: { icon: <XCircle className="w-4 h-4" />, class: 'bg-red-500/10 text-red-500 border-red-500/20' },
    inconclusive: { icon: <AlertTriangle className="w-4 h-4" />, class: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  };
  
  const config = mapping[result.toLowerCase()] || mapping.inconclusive;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${config.class}`}>
      {config.icon} {result}
    </span>
  );
}

export function LabLayout({ item }: { item: ContentItem }) {
  const { meta, content } = item;
  
  return (
    <div className="flex flex-col w-full pt-20">
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
                <Link href="/engineering-lab" className="hover:text-primary transition-colors">Engineering Lab</Link>
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
        
        {/* HERO */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 text-sm text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              <FlaskConical className="w-4 h-4" /> Experiment
            </span>
            {meta.experimentResult && <ResultBadge result={meta.experimentResult} />}
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {meta.category || 'Research'}
            </span>
            <span className="text-sm text-muted-foreground">
              {meta.dateCompleted ? `Completed: ${meta.dateCompleted}` : `Started: ${meta.date}`}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">{meta.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
            {meta.description}
          </p>
        </header>

        {/* ENVIRONMENT METADATA */}
        {(meta.hardware || meta.software) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-border/50 mb-16 bg-muted/10 rounded-2xl p-8">
            {meta.hardware && meta.hardware.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Hardware Environment</h3>
                <ul className="space-y-2">
                  {meta.hardware.map(hw => (
                    <li key={hw} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> {hw}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {meta.software && meta.software.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Software Environment</h3>
                <ul className="space-y-2">
                  {meta.software.map(sw => (
                    <li key={sw} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> {sw}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* MEASUREMENTS TABLE */}
        {meta.measurements && meta.measurements.length > 0 && (
          <div className="mb-16 overflow-x-auto">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Benchmark & Measurements</h3>
            <table className="w-full text-sm text-left border border-border/50 rounded-xl overflow-hidden">
              <thead className="bg-muted/50 text-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Measurement</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {meta.measurements.map((m, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{m.label}</td>
                    <td className="px-6 py-4 font-mono text-primary">{m.value}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MDX CONTENT */}
        <main className="min-h-[30vh]">
          <MDXContent source={content} />
        </main>

        <ConnectedKnowledge meta={meta} />

      </div>
    </div>
  );
}
