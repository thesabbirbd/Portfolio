import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { ToolsSuite } from "@/components/discover/Tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interactive Tools — Subnet, chmod, Base64, JSON, Unix Time | THE SABBiR",
  description: "Free browser tools by THE SABBiR: subnet/CIDR calculator, chmod permission calculator, Base64 encoder, JSON formatter and Unix timestamp converter. Nothing leaves your browser.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Tools" }]}
        eyebrow="Interactive tools"
        title={<>Small tools, <Accent>daily use</Accent></>}
        lede="Everyday sysadmin and backend helpers. They run entirely in your browser — nothing you type is sent anywhere."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <ToolsSuite />
      </div>
    </div>
  );
}
