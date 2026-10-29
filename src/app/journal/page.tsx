import { getAllContent } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';
import Link from 'next/link';
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Journal | THE SABBiR",
  description: "Chronological engineering documentation and process logs by Md Sabbirul Islam Khan.",
  path: "/journal",
});

export default function JournalIndexPage() {
  const journals = getAllContent('journal');

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Journal" }]}
        eyebrow="Journal"
        title={<>Engineering <Accent>journal</Accent></>}
        lede="First-person process logs: workflows, decisions and how my setup evolves over time."
        className="max-w-4xl"
      />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-12">
        <h2 className="sr-only">All journal entries</h2>
        <div className="relative border-l border-line pl-5 ml-2 sm:pl-8 sm:ml-4 md:ml-8 space-y-6 sm:space-y-12">
          {journals.map(journal => (
            <div key={journal.meta.slug} className="relative group">
              <div aria-hidden="true" className="absolute w-4 h-4 bg-primary/20 rounded-full -left-[29px] sm:-left-[41px] top-6 border-2 border-primary group-hover:scale-125 transition-transform" />
              <ContentCard item={journal} baseUrl="/journal" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
