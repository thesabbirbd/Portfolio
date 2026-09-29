import { getLatestContent } from '@/lib/content';
import { ContentCard } from './ContentCard';
import Link from 'next/link';

export function LatestThinking() {
  const latest = getLatestContent(3);

  if (latest.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-24 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-12">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4">Latest Thinking</h2>
          <p className="text-xs sm:text-lg text-muted-foreground max-w-xl">
            Recent notes, engineering journals, and experiments from the lab.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link href="/notes" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View Notes →
          </Link>
          <Link href="/journal" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View Journal →
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
        {latest.map(item => {
          const type = item.meta.type || 'notes';
          const baseUrl = type === 'lab' ? '/engineering-lab' : `/${type}`;
          return <ContentCard key={item.meta.slug} item={item} baseUrl={baseUrl} />;
        })}
      </div>
    </section>
  );
}
