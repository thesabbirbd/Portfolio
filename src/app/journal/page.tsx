import { getAllContent } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';
import Link from 'next/link';

export const metadata = {
  title: "Engineering Journal | THE SABBiR",
  description: "Chronological engineering documentation and process logs by Md Sabbirul Islam Khan.",
};

export default function JournalIndexPage() {
  const journals = getAllContent('journal');

  return (
    <div className="flex flex-col w-full pt-20">
      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <nav className="flex text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-foreground">Journal</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineering Journal</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
          Chronological first-person engineering documentation, workflows, and process evolution.
        </p>
        
        <div className="flex flex-col gap-8 relative border-l border-border/50 pl-6 ml-2 md:ml-6">
          {journals.map(journal => (
            <div key={journal.meta.slug} className="relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[31px] top-6 ring-4 ring-background" />
              <ContentCard item={journal} baseUrl="/journal" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
