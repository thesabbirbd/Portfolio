import { AudioEditorStudio } from "@/components/tools/AudioEditorStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "WebAudio Waveform DAW & Audio Studio — THE SABBiR OS",
  description:
    "Audacity & WavePad alternative. In-browser waveform zoom, region trimming, 3-band EQ, volume normalization, mic recording, and sample-accurate 16-bit WAV export.",
  path: "/tools/audio-editor",
});

export default function AudioEditorPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <AudioEditorStudio />
    </div>
  );
}
