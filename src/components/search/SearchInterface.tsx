'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Filter } from 'lucide-react';

type SearchItem = {
  title: string;
  description?: string;
  slug: string;
  type: string;
  category?: string;
  tags: string[];
  date: string;
  url: string;
};

export function SearchInterface({ initialData }: { initialData: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState('');

  // ⚡ Bolt: Debounce the search query to optimize performance
  // 💡 What: Apply 300ms debounce to the search input state
  // 🎯 Why: Prevents the expensive filtering operation in useMemo from running on every keystroke
  // 📊 Impact: Significantly reduces UI thread blocking and re-renders while the user is actively typing
  // 🔬 Measurement: Observe React Profiler; filtering now only executes once after the user stops typing
  const debouncedQuery = useDebounce(query, 300);
  const [activeType, setActiveType] = useState<string | null>(null);

  const filteredResults = useMemo(() => {
    let results = initialData;

    if (activeType) {
      results = results.filter(item => item.type === activeType);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return results;
  }, [debouncedQuery, activeType, initialData]);

  const types = ['notes', 'journal', 'projects', 'lab'];

  return (
    <div className="w-full">
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full bg-muted/50 border border-border/50 text-foreground text-lg rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          placeholder="Search by title, description, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="w-4 h-4" /> Filter by Type:
        </div>
        <button
          onClick={() => setActiveType(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeType ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          All
        </button>
        {types.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${activeType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {type === 'lab' ? 'Lab' : type}
          </button>
        ))}
      </div>

      <div className="mb-6 text-sm font-medium text-muted-foreground">
        Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
      </div>

      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map(item => (
            <Link key={item.url} href={item.url} className="block p-6 rounded-2xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors group">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                  {item.type === 'lab' ? 'Lab' : item.type}
                </span>
                {item.category && (
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                )}
                <time className="text-xs text-muted-foreground ml-auto">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              {item.description && (
                <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 border border-border/50 rounded-2xl">
          <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">Try adjusting your search query or filters.</p>
          {(query || activeType) && (
            <button 
              onClick={() => { setQuery(''); setActiveType(null); }}
              className="mt-6 px-6 py-2 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary/20 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
