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
      <div className="container mx-auto px-4 max-w-4xl mb-12">
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
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl leading-relaxed">
          Chronological first-person engineering documentation, workflows, and process evolution.
        </p>
        
        <div className="relative border-l border-border/70 pl-8 ml-4 md:ml-8 space-y-12">
          {journals.map(journal => (
            <div key={journal.meta.slug} className="relative group">
              <div className="absolute w-4 h-4 bg-primary/20 rounded-full -left-[41px] top-6 border-2 border-primary group-hover:scale-125 transition-transform" />
              <ContentCard item={journal} baseUrl="/journal" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
