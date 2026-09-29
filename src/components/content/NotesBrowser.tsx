"use client";

import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { ContentItem } from '@/lib/content';
import { ContentCard } from './ContentCard';
import { Search } from 'lucide-react';


const getCategoryStyle = (cat: string) => {
  const normalized = cat.toLowerCase();
  if (normalized.includes('ai') || normalized.includes('model') || normalized.includes('llm')) {
    return { icon: Sparkles, colors: "bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 text-purple-600 dark:text-purple-400", activeColors: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/5 border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20" };
  }
  if (normalized.includes('system') || normalized.includes('linux') || normalized.includes('devops') || normalized.includes('server')) {
    return { icon: Terminal, colors: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400", activeColors: "bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20" };
  }
  if (normalized.includes('hardware') || normalized.includes('rig')) {
    return { icon: Cpu, colors: "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 text-orange-600 dark:text-orange-400", activeColors: "bg-gradient-to-r from-orange-500/20 to-red-500/5 border-orange-500/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20" };
  }
  if (normalized.includes('infra') || normalized.includes('network')) {
    return { icon: Network, colors: "bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent border border-blue-500/20 text-blue-600 dark:text-blue-400", activeColors: "bg-gradient-to-r from-blue-500/20 to-sky-500/5 border-blue-500/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20" };
  }
  return { icon: FolderGit2, colors: "bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 text-slate-700 dark:text-slate-400", activeColors: "bg-gradient-to-r from-slate-500/20 to-slate-500/5 border-slate-500/40 text-slate-900 dark:text-white ring-1 ring-slate-500/20" };
};

export function NotesBrowser({ notes }: { notes: ContentItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // ⚡ Bolt: Debounce the search query to optimize performance
  // 💡 What: Apply 300ms debounce to the search input state
  // 🎯 Why: Prevents the expensive filtering operation in useMemo from running on every keystroke
  // 📊 Impact: Significantly reduces UI thread blocking and re-renders while the user is actively typing
  // 🔬 Measurement: Observe React Profiler; filtering now only executes once after the user stops typing
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    notes.forEach(note => {
      if (note.meta.category) cats.add(note.meta.category);
    });
    return Array.from(cats).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.meta.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                            note.meta.description.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = selectedCategory ? note.meta.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [notes, debouncedQuery, selectedCategory]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm rounded-xl transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm rounded-xl transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {filteredNotes.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-border/50">
          No notes found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map(note => (
            <ContentCard key={note.meta.slug} item={note} baseUrl="/notes" />
          ))}
        </div>
      )}
    </div>
  );
}
