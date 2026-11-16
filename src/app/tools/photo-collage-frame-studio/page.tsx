import { PhotoCollageFrameStudio } from "@/components/tools/PhotoCollageFrameStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Multi-Photo Collage & BD Festival Frame Studio — THE SABBiR OS",
  description:
    "Design multi-photo grid collages and Bangladeshi festival profile frames (Victory Day, Independence, Baishakh, Eid) in high-resolution 1080x1080 format.",
  path: "/tools/photo-collage-frame-studio",
  keywords: [
    "photo collage maker",
    "bd festival frames",
    "victory day profile frame",
    "baishakh frame",
    "the sabbir os",
  ],
});

export default function PhotoCollageFramePage() {
  return <PhotoCollageFrameStudio />;
}
