import { SlideDeckStudio } from "@/components/tools/SlideDeckStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Instant Presentation & Pitch Deck Studio — THE SABBiR OS",
  description:
    "PowerPoint & Gamma alternative. Convert markdown notes and bullet outlines into professional 16:9 presentation slide decks and 4:5 LinkedIn carousels in browser.",
  path: "/tools/slide-deck",
});

export default function SlideDeckPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <SlideDeckStudio />
    </div>
  );
}
