import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { formatContentDate } from '@/lib/content-date';
import { DemoBadge } from '@/components/discover/DemoBadge';

/**
 * Card for notes, journal entries and lab write-ups. Uses the level-1 surface, one category
 * chip style (no per-category colour themes) and readable type at every size (no sub-11px text).
 */
export function ContentCard({ item, baseUrl }: { item: ContentItem; baseUrl: string }) {
  const { meta } = item;

  return (
    <Link
      href={`${baseUrl}/${meta.slug}`}
      className="reveal group block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <article className="flex flex-col h-full p-4 sm:p-6 rounded-card surface-card surface-interactive group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2 sm:gap-3 mb-2.5 sm:mb-4 font-mono text-[11px] sm:text-xs">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
            {meta.category || 'Note'}
          </span>
          {meta.demo && <DemoBadge />}
          <time dateTime={meta.date} className="text-ink-3">
            {formatContentDate(meta.date)}
          </time>
        </div>
        <h3 className="text-base sm:text-xl font-bold text-ink mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {meta.title}
        </h3>
        <p className="text-sm text-ink-2 line-clamp-2 sm:line-clamp-3 leading-relaxed sm:mb-4 flex-grow">
          {meta.description}
        </p>
        {/* Tags are a desktop scanning aid; phones keep the list short (they appear on the article). */}
        <div className="hidden sm:flex flex-wrap gap-1.5 mt-auto">
          {meta.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] font-mono text-ink-3 bg-muted px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
