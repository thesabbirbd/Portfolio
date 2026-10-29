import { SearchInterface } from '@/components/search/SearchInterface';
import { Suspense } from 'react';
import { getAllContent } from '@/lib/content';
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search | THE SABBiR",
  description: "Search the engineering knowledge base, projects, notes, and experiments.",
  path: "/search",
  noindex: true,
});

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
    type: item.meta.type ?? '',
    category: item.meta.category,
    tags: item.meta.tags || [],
    date: item.meta.date,
    url: `/${item.meta.type === 'lab' ? 'engineering-lab' : item.meta.type}/${item.meta.slug}`
  }));

  // Sort initially by date descending
  allContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Search" }]}
        eyebrow="Search"
        title={<>Search the <Accent>knowledge base</Accent></>}
        lede="Find notes, projects, lab experiments and journal entries across the site."
        className="max-w-4xl"
      />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-24">
        <h2 className="sr-only">Search results</h2>
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchInterface initialData={allContent} />
        </Suspense>
      </div>
    </div>
  );
}
