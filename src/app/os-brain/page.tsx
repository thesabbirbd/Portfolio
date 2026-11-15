import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { OSBrainDashboard } from "@/components/autonomous/OSBrainDashboard";
import { getOSBrainTelemetry } from "@/lib/autonomous/os-autonomous-engine";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Autonomous OS Brain & Self-Evolution Center | THE SABBiR",
  description:
    "Live dashboard of THE SABBiR OS Autonomous Self-Evolving Engine. Real-time telemetry, 5-stage discovery pipeline, deterministic SVG covers, and auto-curated tech assets.",
  path: "/os-brain",
});

export default function OSBrainPage() {
  const telemetry = getOSBrainTelemetry();

  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "OS Brain" }]}
        eyebrow="Autonomous Core"
        title={
          <>
            THE SABBiR OS <Accent>Autonomous Brain</Accent>
          </>
        }
        lede="Self-evolving technical intelligence and everyday automation hub. Continuously indexing workplace tools, open-source discoveries, and life hacks with zero human latency."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-20">
        <OSBrainDashboard initialTelemetry={telemetry} />
      </div>
    </div>
  );
}
