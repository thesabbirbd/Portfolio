import { SearchInterface } from '@/components/search/SearchInterface';
import { Suspense } from 'react';
import { getAllContent } from '@/lib/content';

export const metadata = {
  title: "Search | THE SABBiR",
  description: "Search the engineering knowledge base, projects, notes, and experiments.",
  alternates: {
    canonical: "https://sabbir.nav.bd/search",
  }
};

export default function SearchPage() {
  const allContent = [
    ...getAllContent('notes'),
    ...getAllContent('journal'),
    ...getAllContent('projects'),
    ...getAllContent('lab'),
  ].map(item => ({
    title: item.meta.title,
    description: item.meta.description,
    slug: item.meta.slug,
    type: item.meta.type,
    category: item.meta.category,
    tags: item.meta.tags || [],
    date: item.meta.date,
    url: `/${item.meta.type === 'lab' ? 'engineering-lab' : item.meta.type}/${item.meta.slug}`
  }));

  // Sort initially by date descending
  allContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col w-full pt-20">
      <div className="container mx-auto px-4 max-w-4xl mb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Search Knowledge Base</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Find notes, projects, experiments, and process logs across the platform.
        </p>

        <Suspense fallback={<div>Loading search...</div>}>
          <SearchInterface initialData={allContent} />
        </Suspense>
      </div>
    </div>
  );
}
