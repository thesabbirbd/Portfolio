import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { AutonomousPulseHub, type PulseItem } from "@/components/news/AutonomousPulseHub";
import autoPulseData from "@/data/auto-pulse.json";

export const dynamic = "force-static";

const pulseItems: PulseItem[] = autoPulseData as PulseItem[];

export const metadata = pageMetadata({
  title: "Autonomous Tech Pulse & Sourced Drops | THE SABBiR",
  description: "Daily autonomous tech news, trending open-source drops, and engineering perspectives on PostgreSQL, Linux, local AI, and Docker by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/news",
  noindex: false,
});

export default function NewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "THE SABBiR Autonomous Tech Pulse Drops",
    itemListElement: pulseItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.title,
        description: item.summary,
        url: item.sourceUrl,
        datePublished: item.publishedAt,
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
    })),
  };

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "News" }]}
        eyebrow="Autonomous Tech Pulse"
        title={<>Daily drops, <Accent>read closely</Accent></>}
        lede="Synthesized daily drops spanning local LLM developments, Linux kernel milestones, PostgreSQL updates, and trending open-source tools with hands-on engineering takeaways."
      />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-16">
        <AutonomousPulseHub initialItems={pulseItems} />
      </div>
    </div>
  );
}
