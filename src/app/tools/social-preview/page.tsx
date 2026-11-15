import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { SocialPreviewStudio } from "@/components/tools/SocialPreviewStudio";

export const metadata = pageMetadata({
  title: "Social Preview Card & SEO Meta Tag Studio | THE SABBiR",
  description: "Live pixel-accurate link preview simulator for Facebook, LinkedIn, X (Twitter), and WhatsApp. Copy HTML and Next.js Open Graph metadata in 1 click.",
  path: "/tools/social-preview",
});

export default function SocialPreviewPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Social Preview" }]}
        eyebrow="SEO & Social Cards"
        title={<>Social Card & <Accent>SEO Meta Studio</Accent></>}
        lede="Preview how your links appear on social feeds before publishing, test title character limits, and export complete Open Graph meta tags."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <SocialPreviewStudio />
      </div>
    </div>
  );
}
