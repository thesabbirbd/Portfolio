import { ScreenRecorderStudio } from "@/components/tools/ScreenRecorderStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Screen Recorder & Circular PiP Webcam Studio — THE SABBiR OS",
  description:
    "Loom & OBS Web alternative. In-browser 1080p 60fps screen recording, circular webcam PiP overlay, microphone audio, and teleprompter with zero watermarks.",
  path: "/tools/screen-recorder",
});

export default function ScreenRecorderPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <ScreenRecorderStudio />
    </div>
  );
}
