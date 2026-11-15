import { VideoClipperStudio } from "@/components/tools/VideoClipperStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Video Trimmer & Frame Grabber Studio — THE SABBiR OS",
  description:
    "CapCut & Ezgif alternative. Client-side video trimming, aspect ratio reframing (9:16, 4:5, 1:1, 16:9), burn-in captions, and 1080p PNG frame grabber running 100% in-browser.",
  path: "/tools/video-clipper",
});

export default function VideoClipperPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <VideoClipperStudio />
    </div>
  );
}
