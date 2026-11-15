import { TypingSpeedArenaStudio } from "@/components/tools/TypingSpeedArenaStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bangla & Code Typing Speed Arena (WPM & Accuracy) — THE SABBiR OS",
  description:
    "Test your typing speed across Bangla Unicode, English Executive Prose, TypeScript/SQL code, and Linux CLI with real-time WPM, accuracy %, and downloadable verified certificate.",
  path: "/tools/typing-speed-arena",
});

export default function TypingSpeedArenaPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <TypingSpeedArenaStudio />
    </div>
  );
}
