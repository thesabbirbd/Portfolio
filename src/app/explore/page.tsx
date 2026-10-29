import { PageHeader } from "@/components/system/PageHeader";
import { Accent, SectionHeader } from "@/components/system/SectionHeader";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { DISCOVER_SECTIONS, GAMES, NEWS, PLANNED_FEATURES, VLOGS } from "@/data/discover";
import { getAllContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Explore — Articles, Tools, Playground & More | THE SABBiR",
  description: "Technical articles, vlogs, sourced news commentary, interactive tools, an engineering playground and browser games by Md Sabbirul Islam Khan, known as THE SABBiR.",
  path: "/explore",
});

export default function ExplorePage() {
  const counts = {
    articles: `${getAllContent("articles").length} posts`,
    vlogs: `${VLOGS.length} episodes`,
    news: `${NEWS.length} takes`,
    tools: "5 tools",
    playground: "3 sims",
    games: `${GAMES.length} planned`,
  };
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore" }]}
        eyebrow="Discover"
        title={<>Read, watch, <Accent>build &amp; play</Accent></>}
        lede={`${DISCOVER_SECTIONS.length} sections beyond the portfolio. New sections show a few clearly-marked demo entries until real ones are published.`}
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <DiscoverGrid counts={counts} />
      </div>
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <SectionHeader eyebrow="Planned" title={<>Also <Accent>on the way</Accent></>} className="mb-5" />
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {PLANNED_FEATURES.map((f) => (
            <li key={f.title} className="reveal rounded-card border border-dashed border-line-strong p-4 sm:p-5">
              <p className="font-bold text-ink">{f.title}</p>
              <p className="text-sm text-ink-2 mt-1">{f.desc}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gold">Coming soon</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
