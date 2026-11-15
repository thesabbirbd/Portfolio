import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { BgRemoverStudio } from "@/components/tools/BgRemoverStudio";

export const metadata = pageMetadata({
  title: "AI Studio Background Remover & Product Matting | Free Browser Tool | THE SABBiR",
  description: "Remove image backgrounds instantly in your browser with edge matting and studio backgrounds. 100% private, zero uploads, optimized for e-commerce.",
  path: "/tools/bg-remover",
});

export default function BgRemoverPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Background Remover" }]}
        eyebrow="Media & Product Studio"
        title={<>AI Studio <Accent>Background Remover</Accent></>}
        lede="Instantly extract subjects, add studio solid/gradient backdrops, and export high-res WebP product images with 100% client-side privacy."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <BgRemoverStudio />
      </div>
    </div>
  );
}
