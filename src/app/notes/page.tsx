import { getAllContent } from '@/lib/content';
import { ContentCard } from '@/components/content/ContentCard';
import Link from 'next/link';

export const metadata = {
  title: "Engineering Notes | THE SABBiR",
  description: "Technical notes, learnings, and engineering observations by Md Sabbirul Islam Khan (THE SABBiR).",
};

export default function NotesIndexPage() {
  const notes = getAllContent('notes');

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
                <span className="text-foreground">Notes</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Engineering Notes</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
          Shorter technical documentation, learning logs, and system observations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map(note => (
            <ContentCard key={note.meta.slug} item={note} baseUrl="/notes" />
          ))}
        </div>
      </div>
    </div>
  );
}
