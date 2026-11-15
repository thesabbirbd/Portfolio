import { ImageEditorStudio } from "@/components/tools/ImageEditorStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pro Multi-Layer Image Editor Studio — THE SABBiR OS",
  description:
    "Photoshop Express & Photopea alternative. Crop, rotate, 12 cinematic LUT filters, and typography overlays running 100% in-browser on HTML5 Canvas.",
  path: "/tools/image-editor",
});

export default function ImageEditorPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <ImageEditorStudio />
    </div>
  );
}
