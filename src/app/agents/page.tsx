import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { AgentsDirectoryHub } from "@/components/agents/AgentsDirectoryHub";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

export const metadata = pageMetadata({
  title: "8 Autonomous AI Micro-Agents — 100% Free & Local-First | THE SABBiR OS",
  description: "Execute 8 specialized autonomous micro-agents for media, receipt OCR, PII redaction, SME POS, viral reels, Docker security, and SQL optimization with zero API costs.",
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
            <span>Autonomous Intelligence Fleet</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-mono">
            8 Domain Micro-Agents
          </h1>

          <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
            Specialized client-side agents running deterministically without external subscriptions.
            Equipped with scoped skills, step-by-step reasoning traces, and downloadable business artifacts.
          </p>
        </div>

        {/* Directory Hub */}
        <AgentsDirectoryHub />
      </div>
    </main>
  );
}
