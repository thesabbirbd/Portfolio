import Link from "next/link";
import { FolderGit2, Sparkles, Terminal, ArrowLeft, ArrowUpRight } from "lucide-react";
import { OpenSourceDirectory } from "@/components/discover/OpenSourceDirectory";
import { OPENSOURCE_TOOLS } from "@/data/opensource-tools";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Open-Source Hub // THE SABBiR OS",
  description:
    "Curated collection of 28+ viral open-source developer tools, local AI models, database utilities, and homelab software built or curated by THE SABBiR.",
  path: "/open-source",
});

export default function OpenSourcePage() {
  const authorToolsCount = OPENSOURCE_TOOLS.filter((t) => t.tier === "built-by-sabbir").length;
  const totalToolsCount = OPENSOURCE_TOOLS.length;

  return (
    <main className="min-h-screen bg-bg text-ink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-ink-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-primary transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to THE SABBiR OS
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/tools" className="hover:text-ink transition">
              SaaS Web Tools
            </Link>
            <span>•</span>
            <Link href="/games" className="hover:text-ink transition">
              Engineering Arcade
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-line pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Open-Source Software Matrix</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-ink">
            Visual Open-Source Directory
          </h1>

          <p className="text-sm sm:text-base text-ink-2 max-w-3xl leading-relaxed">
            A production-tested catalog of {totalToolsCount} open-source repositories spanning Local AI,
            PostgreSQL systems, Docker orchestration, and NOC utilities. Featuring {authorToolsCount} original
            tools authored by <strong>THE SABBiR</strong>, complete with verified 1-click terminal installation commands.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-surface border border-line">
              <span className="text-[10px] font-mono uppercase text-ink-3 block">Total Repos</span>
              <span className="text-xl font-bold font-mono text-ink">{totalToolsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-line">
              <span className="text-[10px] font-mono uppercase text-ink-3 block">Built by THE SABBiR</span>
              <span className="text-xl font-bold font-mono text-primary">{authorToolsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-line">
              <span className="text-[10px] font-mono uppercase text-ink-3 block">License Standard</span>
              <span className="text-xl font-bold font-mono text-emerald-500">MIT / Apache</span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-line">
              <span className="text-[10px] font-mono uppercase text-ink-3 block">Visual Previews</span>
              <span className="text-xl font-bold font-mono text-sky-500">100% 16:9</span>
            </div>
          </div>
        </div>

        {/* Interactive Directory Component */}
        <OpenSourceDirectory />

        {/* Bottom CTA / Community Bridge */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-ink">Suggest an Open-Source Utility</h3>
            <p className="text-xs text-ink-2 mt-1">
              Have a high-impact local AI or Linux devops tool you want featured in THE SABBiR OS index?
            </p>
          </div>
          <a
            href="https://github.com/thesabbirbd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shrink-0"
          >
            <span>Submit via GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </main>
  );
}
