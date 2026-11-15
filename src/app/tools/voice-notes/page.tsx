import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { VoiceMemoStudio } from "@/components/tools/VoiceMemoStudio";

export const metadata = pageMetadata({
  title: "Bangla & English Voice Memo Summarizer & Action Pad | THE SABBiR",
  description: "Live browser speech-to-text recording with real-time waveform visualization, automatic key points extraction, action items checklist, and summary export.",
  path: "/tools/voice-notes",
});

export default function VoiceNotesPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Voice Notes" }]}
        eyebrow="Productivity & Audio"
        title={<>Bangla & English <Accent>Voice Action Pad</Accent></>}
        lede="Record quick voice memos or paste meeting transcripts to extract executive summaries, checkable to-do lists, and key dates instantly."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <VoiceMemoStudio />
      </div>
    </div>
  );
}
