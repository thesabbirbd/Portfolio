import Link from "next/link";
import { Sparkles, Cpu, Layers, Server, Terminal, ArrowUpRight, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/system/PageHeader";
import { Accent } from "@/components/system/SectionHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "What I'm Doing Now | THE SABBiR",
  description: "What Md Sabbirul Islam Khan, known as THE SABBiR, is currently building, learning, and architecting — updated November 2026.",
  path: "/now",
});

export default function NowPage() {
  return (
    <div className="flex flex-col w-full pt-6 md:pt-8">
      <PageHeader
        crumbs={[{ label: "Explore", href: "/explore" }, { label: "Now" }]}
        eyebrow="Now"
        title={<>Current focus &amp; <Accent>priorities</Accent></>}
        lede="A public snapshot of what I am actively architecting, testing in the lab, and shipping this quarter. Inspired by Derek Sivers' /now page movement."
      />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16 space-y-8">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl surface-card border border-line text-xs font-mono text-ink-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>Updated: November 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Rajshahi / Dhaka, Bangladesh</span>
          </div>
        </div>

        {/* Focus 1: Aiyaar CPM & Multi-Tenant SME SaaS */}
        <section className="rounded-card surface-card p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">Product Leadership</p>
              <h2 className="text-xl font-bold text-ink">Aiyaar Platform Engineering &amp; CPM</h2>
            </div>
          </div>
          <p className="text-ink-2 leading-relaxed mb-4">
            As Chief Product Manager (CPM) at <Link href="/aiyaar" className="text-primary font-medium hover:underline inline-flex items-center gap-1">Aiyaar<ArrowUpRight className="w-3.5 h-3.5" /></Link>,
            my core focus is designing the unified data architecture for 22 SME verticals in Bangladesh.
          </p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Pharmacy FEFO Expiry Architecture:</strong> Real-time batch-level inventory expiry tracking and auto-quarantine workflows for local pharmacies.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>POS &amp; Khata Synchronization:</strong> Low-bandwidth, offline-tolerant ledger sync using PostgreSQL transactions and idempotent event queues.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Farm &amp; Hatchery Management:</strong> Lifecycle feed-conversion metrics, mortality auditing, and supply-chain scheduling.</span>
            </li>
          </ul>
        </section>

        {/* Focus 2: Local AI & Production Video Engine */}
        <section className="rounded-card surface-card p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-accent/10 text-accent">
              <Cpu className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">AI &amp; Motion Graphics</p>
              <h2 className="text-xl font-bold text-ink">Local LLM Pipelines &amp; Remotion Studio</h2>
            </div>
          </div>
          <p className="text-ink-2 leading-relaxed mb-4">
            Running private, zero-token-leak AI workflows on edge hardware alongside programmatic motion graphics authoring.
          </p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>60 FPS Remotion Video Engine:</strong> Automated 4:5 social explainer rendering powered by ANGLE GPU offload on NVIDIA MX350.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Offline Whisper Audio Pipeline:</strong> Automated timestamp extraction and transcription running locally via faster-whisper.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Local Ollama Tuning:</strong> Quantized Qwen2.5 and DeepSeek models for code analysis and structured schema generation.</span>
            </li>
          </ul>
        </section>

        {/* Focus 3: Systems, Networking & DevOps */}
        <section className="rounded-card surface-card p-6 sm:p-8 border border-line shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Server className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-semibold">Infrastructure &amp; DevOps</p>
              <h2 className="text-xl font-bold text-ink">Homelab, MikroTik &amp; Systemd Automation</h2>
            </div>
          </div>
          <p className="text-ink-2 leading-relaxed mb-4">
            Maintaining high-availability testbeds for networking, system administration, and zero-downtime daemons.
          </p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Dual-WAN MikroTik Bench:</strong> Automated failover scripts, bandwidth queues, and telemetry logging for NOC testing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Systemd Daemons:</strong> Managing background automation services with custom timer units and auto-restart policies.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong>Zero-Cost Cloud Architecture:</strong> Pairing static Next.js frontend with Neon Serverless Postgres and Drizzle ORM.</span>
            </li>
          </ul>
        </section>

        {/* Focus 4: Active Reading & Learning */}
        <section className="rounded-card surface-card p-6 sm:p-8 border border-line shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold/10 text-gold">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gold font-semibold">Continuous Craft</p>
              <h2 className="text-xl font-bold text-ink">What I Am Reading &amp; Exploring</h2>
            </div>
          </div>
          <p className="text-ink-2 leading-relaxed text-sm">
            Deep-diving into high-throughput PostgreSQL query optimization (indexing strategies, partitioned tables, VACUUM tuning),
            container networking namespaces, and modern Web Audio API DSP synthesis.
          </p>
          <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-4 text-xs font-mono text-ink-3">
            <Link href="/tools" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>🛠️ Test the SaaS Tools</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/vlogs" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>🎥 Watch Video Lab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/articles" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>📖 Read Technical Articles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
