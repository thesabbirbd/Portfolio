import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { PdfToolkitStudio } from "@/components/tools/PdfToolkitStudio";

export const metadata = pageMetadata({
  title: "100% Private In-Browser PDF & Document Page Suite | Free Browser Tool | THE SABBiR",
  description: "Merge multiple document pages, rotate scans, reorder pages, and apply official verification stamps with 100% private in-browser execution.",
  path: "/tools/pdf-toolkit",
});

export default function PdfToolkitPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "PDF Document Suite" }]}
        eyebrow="Document Engineering"
        title={<>Private In-Browser <Accent>PDF Document Suite</Accent></>}
        lede="Combine multiple documents and scans into a single printable file, reorder or rotate pages, and apply official verification stamps with zero server uploads."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <PdfToolkitStudio />
      </div>
    </div>
  );
}
