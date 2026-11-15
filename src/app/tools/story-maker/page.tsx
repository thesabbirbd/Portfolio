import { Suspense } from "react";
import { StoryMakerStudio } from "@/components/tools/StoryMakerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Social Story & Reel Cover Studio — THE SABBiR OS",
  description:
    "Canva & Story Maker alternative. Design Instagram/WhatsApp Stories (9:16), LinkedIn Carousels (4:5), and YouTube covers (16:9) with curated templates, typography, and instant export.",
  path: "/tools/story-maker",
});

export default function StoryMakerPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <Suspense fallback={<div className="py-24 text-center text-xs text-neutral-500 font-mono">Loading studio...</div>}>
        <StoryMakerStudio />
      </Suspense>
    </div>
  );
}
