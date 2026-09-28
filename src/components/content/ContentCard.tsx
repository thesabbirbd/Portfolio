import Link from 'next/link';
import { ContentItem } from '@/lib/content';

export function ContentCard({ item, baseUrl }: { item: ContentItem; baseUrl: string }) {
  const { meta } = item;
  
  return (
    <Link href={`${baseUrl}/${meta.slug}`} className="block group">
      <div className="flex flex-col h-full p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-accent/5 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {meta.category || 'Note'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(meta.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {meta.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4 flex-grow">
          {meta.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {meta.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80 bg-muted px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
