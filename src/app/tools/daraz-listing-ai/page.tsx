import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { DarazListingStudio } from "@/components/tools/DarazListingStudio";

export const metadata = pageMetadata({
  title: "Daraz & F-Commerce Catalog SEO & Ad Copy Optimizer | Free Browser Tool | THE SABBiR",
  description: "Generate ranked Daraz product titles, 5-point specifications, warranty terms, and high-converting Facebook ad copies with pricing psychology.",
  path: "/tools/daraz-listing-ai",
});

export default function DarazListingPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Daraz & F-Commerce Optimizer" }]}
        eyebrow="E-Commerce & Marketing"
        title={<>Daraz &amp; F-Commerce <Accent>Catalog Optimizer</Accent></>}
        lede="Transform basic product details into SEO-ranked Daraz titles, bullet specifications, warranty tables, and 3 viral Facebook ad copies."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <DarazListingStudio />
      </div>
    </div>
  );
}
