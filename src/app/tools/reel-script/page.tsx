import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { ReelScriptStudio } from "@/components/tools/ReelScriptStudio";

export const metadata = pageMetadata({
  title: "1-Click 60s Viral Reel Script & .SRT Subtitle Generator | THE SABBiR",
  description: "Generate 3-second scroll-stopper hooks, timed 3-column scripts (Time | Voice | Visual/SFX), and downloadable .srt subtitles for Reels and Shorts.",
  path: "/tools/reel-script",
});

export default function ReelScriptPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Reel Script" }]}
        eyebrow="Content & Creators"
        title={<>60s Viral Reel & <Accent>.SRT Studio</Accent></>}
        lede="Turn ideas and products into high-retention 60-second video scripts with timed camera directions, sound effects cues, and ready-to-import subtitles."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <ReelScriptStudio />
      </div>
    </div>
  );
}
