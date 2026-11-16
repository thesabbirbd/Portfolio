import { getAllContent } from '@/lib/content';
import { NotesBrowser } from '@/components/content/NotesBrowser';
import Link from 'next/link';
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Notes | THE SABBiR",
  description: "Technical notes, learnings, and engineering observations by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/notes",
});

export default function NotesIndexPage() {
  const notes = getAllContent('notes');

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Notes" }]}
        eyebrow="Engineering Log"
        title={<>Field <Accent>Notes</Accent> &amp; Systems Architecture</>}
        lede="Practical technical documentation, hardware experiments, and architectural insights from real-world systems built by THE SABBiR."
      />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-12">
        {/* Quick Highlights Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-border/40 text-xs font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-semibold">
            <span>⚡ {notes.length} Work Notes</span>
          </span>
          <span className="hidden sm:inline-block text-border">•</span>
          <span>AI &amp; Bengali OCR</span>
          <span className="text-border">•</span>
          <span>MikroTik &amp; BGP</span>
          <span className="text-border">•</span>
          <span>LiFePO4 Solar UPS</span>
          <span className="text-border">•</span>
          <span>Local LLM Math</span>
          <span className="text-border">•</span>
          <span>Aiyaar SaaS Architecture</span>
        </div>
        <h2 className="sr-only">All notes</h2>
        <NotesBrowser notes={notes} />
      </div>
    </div>
  );
}
