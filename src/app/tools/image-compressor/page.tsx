import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { BatchImageCompressor } from "@/components/tools/BatchImageCompressor";

export const metadata = pageMetadata({
  title: "Bulk 50-Image WebP Compressor & Client-Side ZIP Packager | THE SABBiR",
  description: "Compress up to 50 JPG/PNG photos down to lightweight WebP files right in your browser. Download individually or as an instant .ZIP archive.",
  path: "/tools/image-compressor",
});

export default function ImageCompressorPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Image Compressor" }]}
        eyebrow="Media Optimization"
        title={<>Batch WebP <Accent>Image Compressor</Accent></>}
        lede="Batch convert up to 50 images to ultra-fast modern WebP format with custom quality sliders and 100% in-browser client-side ZIP packaging."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <BatchImageCompressor />
      </div>
    </div>
  );
}
