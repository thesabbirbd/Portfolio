import { GovPhotoSizerStudio } from "@/components/tools/GovPhotoSizerStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "BCS, Gov Job & Visa Photo Sizer (300×300, 4R) — THE SABBiR OS",
  description:
    "Official Teletalk BCS 300×300 px photo (<100 KB), 300×80 px signature (<60 KB), BD E-Passport, US and Schengen Visa photo compressor and 4R 8-photo printable sheet studio.",
  path: "/tools/gov-photo-sizer",
});

export default function GovPhotoSizerPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <GovPhotoSizerStudio />
    </div>
  );
}
