import Link from "next/link";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { MoreLinks, MoreLink } from "@/components/system/MoreLink";
import { DiscoverGrid } from "@/components/discover/DiscoverGrid";
import { GAMES, NEWS, VLOGS } from "@/data/discover";
import { getAllContent } from "@/lib/content";
import {
  Sparkles,
  Camera,
  FileSpreadsheet,
  Receipt,
  ShieldAlert,
  Bot,
  ArrowRight,
  Flame,
} from "lucide-react";

/** Home chapter 06: the Discover sections (articles, vlogs, news, tools, playground, games). */
export function DiscoverChapter() {
  const counts = {
    articles: `${getAllContent("articles").length} guides`,
    vlogs: `${VLOGS.length} episodes`,
    news: "15 tech drops",
    tools: "24 tools (12 Super-Tools)",
    playground: "3 sims",
    games: "5 arcade games",
  };

  const SPOTLIGHT_TOOLS = [
    {
      title: "AI Studio Background Remover",
      desc: "Instant client-side edge matting, studio solid/gradient colors, and WebP export.",
      href: "/tools/bg-remover",
      badge: "Most Popular",
      icon: Camera,
      score: "99",
    },
    {
      title: "Khata & Cash Memo to Excel",
      desc: "Bangla & English handwritten/typed ledger notes converted to editable Excel/CSV.",
      href: "/tools/khata-scanner",
      badge: "BD SME Hero",
      icon: FileSpreadsheet,
      score: "98",
    },
    {
      title: "BD SME Invoice & Thermal POS",
      desc: "Professional invoices, 80mm cash memos, and bKash QR payment codes in 1 click.",
      href: "/tools/invoice-maker",
      badge: "Essential",
      icon: Receipt,
      score: "98",
    },
    {
      title: "Dockerfile AST Security Scanner",
      desc: "Audit container definitions, catch root execution, and generate hardened builds.",
      href: "/tools/docker-hardener",
      badge: "DevOps Hero",
      icon: ShieldAlert,
      score: "97",
    },
  ];

  return (
    <section id="discover" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20">
      <SectionHeader
        index="06"
        eyebrow="Discover"
        title={<>Read, watch, <Accent>build &amp; play</Accent></>}
        lede="Articles, vlogs, sourced tech pulse, browser SaaS tools, simulations, and top 5 playable engineering games."
        className="mb-8 sm:mb-12"
      />

      {/* Popular Super-Tools Spotlight */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-muted/20 border border-line space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-primary" />
              <span>Spotlight · Most Popular Free Tools</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink mt-1">
              Everyday Browser Super-Tools
            </h3>
            <p className="text-xs sm:text-sm text-ink-2 mt-1">
              Zero login required, 100% private, client-side processing for creators, shops, and developers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-mono font-bold hover:bg-primary-hover transition shadow-sm"
            >
              <span>Explore All 24 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-line text-ink text-xs font-mono font-bold hover:border-primary/50 transition"
            >
              <Bot className="w-3.5 h-3.5 text-primary" />
              <span>8 Autonomous Agents</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SPOTLIGHT_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-4 rounded-2xl bg-surface border border-line hover:border-primary/50 transition flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tool.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-ink-2 line-clamp-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-ink-3">
                  <span>🔥 {tool.score} Score</span>
                  <span className="text-primary font-semibold group-hover:underline">
                    Launch →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <DiscoverGrid counts={counts} />

      <MoreLinks align="center">
        <MoreLink href="/explore">Open the Explore hub</MoreLink>
      </MoreLinks>
    </section>
  );
}
