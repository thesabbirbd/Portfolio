import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { PlaygroundSuite } from "@/components/discover/Playground";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engineering Playground — Rate Limiting, Load Balancing, LRU Cache | THE SABBiR",
  description: "Interactive simulations of backend building blocks by THE SABBiR: a token-bucket rate limiter, a load balancer (round-robin vs least connections) and an LRU cache.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Playground" }]}
        eyebrow="Engineering playground"
        title={<>Backend ideas, <Accent>made visible</Accent></>}
        lede="Press the buttons and watch the system react. Each simulation is a few lines of real logic you can reason about."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <PlaygroundSuite />
      </div>
    </div>
  );
}
