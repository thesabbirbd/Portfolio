import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { ApiLoadSimulatorStudio } from "@/components/tools/ApiLoadSimulatorStudio";

export const metadata = pageMetadata({
  title: "Visual API Latency Benchmark & k6/Locust Script Studio | Free Browser Tool | THE SABBiR",
  description: "Benchmark endpoint latency (p50/p95/p99), audit security headers, and generate production k6, Locust, and cURL load scripts in your browser.",
  path: "/tools/api-load-simulator",
});

export default function ApiLoadSimulatorPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8 pb-16">
      <PageHeader
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "API Benchmark & Load Studio" }]}
        eyebrow="DevOps & Reliability"
        title={<>API Latency Benchmark &amp; <Accent>Load Studio</Accent></>}
        lede="Run live in-browser latency probes with p50/p95/p99 breakdown, audit security headers, and generate ready-to-run k6 and Locust load testing scripts."
        expression="signal"
      />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <ApiLoadSimulatorStudio />
      </div>
    </div>
  );
}
