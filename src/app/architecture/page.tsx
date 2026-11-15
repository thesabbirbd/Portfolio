import { PageHeader } from "@/components/system/PageHeader";
import { Accent, SectionHeader } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { ApiExplorer } from "@/components/architecture/ApiExplorer";
import { ChaosFailoverSimulator } from "@/components/architecture/ChaosFailoverSimulator";
import { TelemetryStrip } from "@/components/telemetry/TelemetryStrip";
import { Server, Database, Cpu, Network, ShieldCheck } from "lucide-react";

export const metadata = pageMetadata({
  title: "System Architecture & API Explorer | THE SABBiR",
  description: "Interactive FastAPI, PostgreSQL schema, and system architecture explorer by Md Sabbirul Islam Khan, known as THE SABBiR. Live payloads, query plans, and edge latencies.",
  path: "/architecture",
});

const PILLARS = [
  {
    icon: Server,
    title: "FastAPI & Serverless Gateway",
    detail: "High-throughput asynchronous endpoints with Pydantic validation, strict typing, and sub-15ms response latency.",
  },
  {
    icon: Database,
    title: "PostgreSQL & Drizzle ORM",
    detail: "Relational database models with ACID guarantees, FEFO batch expiry queries, and idempotent event queues.",
  },
  {
    icon: Cpu,
    title: "Local AI & GGUF Inference",
    detail: "Zero-cloud-token-leak pipelines running quantized Qwen and DeepSeek models locally with structured JSON outputs.",
  },
  {
    icon: Network,
    title: "MikroTik NOC & Edge Failover",
    detail: "Dual-WAN gateway routing, queue trees, connection tracking firewalls, and 24/7 uptime monitoring benches.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Architecture" }]}
        eyebrow="Interactive Lab"
        title={<>System architecture &amp; <Accent>API explorer</Accent></>}
        lede="Inspect live FastAPI endpoints, SQL execution plans, local AI pipelines, and network telemetry. Run queries and view responses directly in your browser."
      />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16 space-y-12">
        {/* Live Telemetry Strip */}
        <TelemetryStrip />

        {/* Live Interactive Chaos & Failover Lab */}
        <section aria-labelledby="chaos-simulator-heading">
          <h2 id="chaos-simulator-heading" className="sr-only">Interactive Chaos and Failover Simulator</h2>
          <ChaosFailoverSimulator />
        </section>

        {/* Hero Interactive API Explorer */}
        <section aria-labelledby="api-explorer-heading">
          <h2 id="api-explorer-heading" className="sr-only">Interactive API Explorer</h2>
          <ApiExplorer />
        </section>

        {/* 4 Core Architectural Pillars */}
        <section className="pt-8 border-t border-line">
          <SectionHeader
            eyebrow="Foundations"
            title={<>Core architectural <Accent>pillars</Accent></>}
            lede="The engineering standards and operational principles behind my backend, systems, and product builds."
            className="mb-6"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="p-5 rounded-2xl surface-card border border-line shadow-xs space-y-2">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-ink text-base">{p.title}</h3>
                  <p className="text-xs text-ink-2 leading-relaxed">{p.detail}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
