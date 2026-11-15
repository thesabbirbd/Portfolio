import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { HacksDirectoryHub } from "@/components/discover/HacksDirectoryHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Everyday AI, GitHub & Linux Hacks Hub — 36+ Shortcuts | THE SABBiR",
  description:
    "Curated Everyday AI prompts, GitHub tricks, Linux server one-liners, and Bangladesh digital life hacks by THE SABBiR. 1-click copy with companion tool bridges.",
  path: "/hacks",
});

export default function HacksPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Hacks" }]}
        eyebrow="Quick Power Solutions"
        title={
          <>
            Everyday <Accent>Life &amp; Tech Hacks</Accent>
          </>
        }
        lede="36+ field-tested AI prompts, GitHub power moves, Linux server one-liners, and digital life shortcuts in Bangladesh. 1-click copy directly to your clipboard."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <HacksDirectoryHub />
      </div>
    </div>
  );
}
