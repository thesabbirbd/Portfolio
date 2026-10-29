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
        eyebrow="Notes"
        title={<>Engineering <Accent>notes</Accent></>}
        lede="Shorter technical documentation, learning logs and system observations."
      />
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 mb-12">
        <h2 className="sr-only">All notes</h2>
        <NotesBrowser notes={notes} />
      </div>
    </div>
  );
}
