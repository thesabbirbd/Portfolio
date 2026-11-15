import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent, SectionHeader } from "@/components/system/SectionHeader";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { MyOSWorkspacePanel } from "@/components/explore/MyOSWorkspacePanel";
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
    articles: `${getAllContent("articles").length} guides`,
    vlogs: `${VLOGS.length} episodes`,
    news: "15 tech drops",
    tools: "18 Super-Tools (27 Total)",
    playground: "3 sims",
    games: "7 arcade games",
    agents: "12 agents & 4 swarms",
  };
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore" }]}
        eyebrow="Discover"
        title={<>Read, watch, <Accent>build &amp; play</Accent></>}
        lede={`${DISCOVER_SECTIONS.length} sections beyond the portfolio. New sections show a few clearly-marked demo entries until real ones are published.`}
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-8">
        <MyOSWorkspacePanel />
      </div>
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <DiscoverGrid counts={counts} />
      </div>
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <SectionHeader eyebrow="Roadmap" title={<>Also <Accent>on the way</Accent></>} className="mb-5" />
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {PLANNED_FEATURES.map((f) => {
            const isLive = f.status === "live" && f.href;
            const content = (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-ink">{f.title}</p>
                    {isLive && <ArrowUpRight className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                  </div>
                  <p className="text-sm text-ink-2 mt-1">{f.desc}</p>
                </div>
                <p className={`mt-3 font-mono text-[11px] uppercase tracking-wider ${isLive ? "text-emerald-500 font-semibold" : "text-gold"}`}>
                  {isLive ? "● Published" : "Coming soon"}
                </p>
              </div>
            );

            return (
              <li key={f.title} className="reveal">
                {isLive ? (
                  <Link
                    href={f.href!}
                    className="group block h-full rounded-card border border-line bg-surface hover:border-primary/40 p-4 sm:p-5 transition-all shadow-sm hover:shadow"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="h-full rounded-card border border-dashed border-line-strong p-4 sm:p-5">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
