import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Cpu } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { AgentInputToActionStudio } from "@/components/agents/AgentInputToActionStudio";
import { AgentsDirectoryHub } from "@/components/agents/AgentsDirectoryHub";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

export const metadata = pageMetadata({
  title: "30 Autonomous AI Agents · Input-to-Action Fleet | THE SABBiR OS",
  description:
    "Execute 30 specialized autonomous agentic workflows: 15 Input-to-Action Worker Agents with GitHub Action cloud sync + 15 scheduled cron bots and 10 multi-agent swarms with zero API costs.",
  path: "/agents",
});

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-3 hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to THE SABBiR OS</span>
          </Link>

          <BanglaGuideModal topic="agents" />
        </div>

        {/* Page Hero */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30 Real-World Agentic Workflows</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-mono">
            30 Autonomous Agentic Systems
          </h1>

          <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
            Dual-Mode Execution: 15 User Input-to-Action Worker Agents with Instant Browser WASM &amp; GitHub Actions Cloud Sync, plus 15 Autonomous Scheduled Bots and 10 Multi-Agent Swarms.
          </p>
        </div>

        {/* Input-to-Action Studio Runner */}
        <AgentInputToActionStudio />

        {/* Directory Hub & Swarms */}
        <div className="pt-6 border-t border-line">
          <h2 className="text-xl font-bold font-mono text-ink mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span>Multi-Agent Swarms &amp; Domain Directory</span>
          </h2>
          <AgentsDirectoryHub />
        </div>
      </div>
    </main>
  );
}
