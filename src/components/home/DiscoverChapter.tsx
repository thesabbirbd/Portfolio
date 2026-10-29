import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { MoreLinks, MoreLink } from "@/components/system/MoreLink";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { GAMES, NEWS, VLOGS } from "@/data/discover";
import { getAllContent } from "@/lib/content";

/** Home chapter 06: the Discover sections (articles, vlogs, news, tools, playground, games). */
export function DiscoverChapter() {
  const counts = {
    articles: `${getAllContent("articles").length} posts`,
    vlogs: `${VLOGS.length} episodes`,
    news: `${NEWS.length} takes`,
    tools: "5 tools",
    playground: "3 sims",
    games: `${GAMES.length} soon`,
  };
  return (
    <section id="discover" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      <SectionHeader
        index="06"
        eyebrow="Discover"
        title={<>Read, watch, <Accent>build &amp; play</Accent></>}
        lede="Articles, vlogs, sourced news takes, browser tools, live simulations — and games on the way."
        className="mb-8 sm:mb-12"
      />
      <DiscoverGrid counts={counts} />
      <MoreLinks align="center">
        <MoreLink href="/explore">Open the Explore hub</MoreLink>
      </MoreLinks>
    </section>
  );
}
