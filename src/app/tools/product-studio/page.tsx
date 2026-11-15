import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { ProductPhotoStudio } from "@/components/tools/ProductPhotoStudio";

export const metadata = pageMetadata({
  title: "Daraz & Facebook Marketplace Product Photo Studio | Free Tool | THE SABBiR",
  description: "Enhance product photos with preset aspect ratios (1:1, 4:5, 16:9), price badges, COD delivery trust tags, and shadow effects for BD e-commerce.",
  path: "/tools/product-studio",
});

export default function ProductStudioPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Product Studio" }]}
        eyebrow="E-Commerce & Marketing"
        title={<>Daraz & Social <Accent>Product Photo Studio</Accent></>}
        lede="Turn raw mobile photos into high-converting Daraz, Facebook Shop, and Instagram catalog assets with branded badges and discount stamps."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <ProductPhotoStudio />
      </div>
    </div>
  );
}
