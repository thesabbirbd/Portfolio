import { Suspense } from "react";
import { Gamepad2, Sparkles, Trophy } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { GameArcadeHub } from "@/components/games/GameArcadeHub";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

export const metadata = pageMetadata({
  title: "Engineering Arcade — Top 5 Browser Games | THE SABBiR OS",
  description: "Play 5 addictive in-browser engineering games by Md Sabbirul Islam Khan, known as THE SABBiR. Kernel Breach, Packet Defender, Subnet Sprint, Query Optimizer & Uptime Architect with shareable PNG scorecards.",
  path: "/games",
});

export default function GamesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SoftwareApplication",
        name: "Kernel Breach: Terminal & SQL CTF",
        applicationCategory: "GameApplication",
        operatingSystem: "Web Browser",
        description: "Interactive Linux terminal and SQL diagnostics engineering challenge.",
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Packet Defender: NOC DDoS Firewall",
        applicationCategory: "GameApplication",
        operatingSystem: "Web Browser",
        description: "3-lane real-time network packet routing and DDoS mitigation arcade.",
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Subnet Sprint: 60-Second Binary Blitz",
        applicationCategory: "GameApplication",
        operatingSystem: "Web Browser",
        description: "High-speed 8-bit binary switches and CIDR network math challenge.",
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Query Optimizer: Slow-Log Rescue",
        applicationCategory: "GameApplication",
        operatingSystem: "Web Browser",
        description: "PostgreSQL slow query plan optimization and thermal mitigation puzzle.",
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Uptime Architect: Chaos Simulator",
        applicationCategory: "GameApplication",
        operatingSystem: "Web Browser",
        description: "60-second SRE chaos simulator balancing RAM, workers, and DC-UPS battery.",
        author: {
          "@type": "Person",
          name: "Md Sabbirul Islam Khan",
          alternateName: "THE SABBiR",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Games" }]}
        eyebrow="THE SABBiR OS // ARCADE"
        title={<>Browser games &amp; <Accent>engineering challenges</Accent></>}
        lede="Hands-on interactive engineering arcade running entirely client-side. Complete missions, earn OS XP, generate shareable PNG scorecards, and claim your spot on the global leaderboard."
      />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-6 flex justify-end">
        <BanglaGuideModal topic="games" />
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-ink-3">
              Initializing arcade environment...
            </div>
          }
        >
          <GameArcadeHub />
        </Suspense>
      </div>
    </div>
  );
}
