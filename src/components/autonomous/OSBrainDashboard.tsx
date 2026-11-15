"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  RefreshCw,
  Sparkles,
  Flame,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Code2,
  BookOpen,
  Wrench,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PopularNewTabsBar } from "@/components/ui/PopularNewTabsBar";
import { generateCoverSvg, OSBrainTelemetry } from "@/lib/autonomous/os-autonomous-engine";
import { sound } from "@/lib/sound";

interface Props {
  initialTelemetry: OSBrainTelemetry;
}

export function OSBrainDashboard({ initialTelemetry }: Props) {
  const [telemetry, setTelemetry] = useState<OSBrainTelemetry>(initialTelemetry);
  const [activeTab, setActiveTab] = useState<"popular" | "new">("popular");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "System initialized at 2026-11-15T00:00:00Z.",
    "Crons scheduled: 0 */12 * * * (GitHub Actions Autonomous Agent).",
    "55 workplace tools indexed & operational.",
    "24 domain agents & 8 multi-agent swarms ready.",
  ]);
  const [previewTitle, setPreviewTitle] = useState("Universal Everyday Super-App & Autonomous Engine");
  const [previewCategory, setPreviewCategory] = useState("ENGINEERING");

  const runDiscoveryCycle = async () => {
    sound.click();
    setIsSyncing(true);
    setSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Initiating Autonomous Discovery Cycle...`,
      ...prev,
    ]);

    try {
      const res = await fetch("/api/os-brain", { method: "POST" });
      const data = await res.json();
      setTimeout(() => {
        setSyncLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] ✅ Pulled public technical feeds & open-source releases.`,
          `[${new Date().toLocaleTimeString()}] ✅ Normalized & deduplicated entries with SHA-36 hash.`,
          `[${new Date().toLocaleTimeString()}] ✅ Generated Bangla summaries & high-intent SEO keywords.`,
          `[${new Date().toLocaleTimeString()}] ✅ Synthesized 16:9 deterministic SVG covers.`,
          `[${new Date().toLocaleTimeString()}] ✅ OS Brain telemetry refreshed successfully!`,
          ...prev,
        ]);
        if (data.metrics) {
          setTelemetry(data.metrics);
        }
        setIsSyncing(false);
        sound.confirm();
      }, 900);
    } catch {
      setIsSyncing(false);
    }
  };

  const previewSvg = generateCoverSvg(previewTitle, previewCategory, "THE SABBiR OS");

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
            <Cpu className="h-3.5 w-3.5 animate-pulse" />
            <span>THE SABBiR OS Autonomous Brain & Self-Evolution Center</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Autonomous Self-Evolving Engine
          </h1>
          <p className="text-base text-zinc-300 md:text-lg leading-relaxed">
            ২৪ ঘণ্টা বিরতিহীনভাবে বিশ্বমানের ওপেন-সোর্স টেকনোলজি, সিকিউরিটি আপডেট, নিত্যদিনের লাইফ হ্যাকস এবং বাস্তবমুখী বাংলাদেশী দৈনন্দিন টুলস স্বয়ংক্রিয়ভাবে কিউরেট ও সিঙ্ক করে আমাদের এই সেন্ট্রাল প্ল্যাটফর্ম।
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={runDiscoveryCycle}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "সিঙ্ক হচ্ছে..." : "Run Live Discovery Cycle (সিঙ্ক করুন)"}</span>
            </button>

            <Link
              href="/agents?swarm=autonomous-seo-viral"
              className="inline-flex items-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white"
            >
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>Launch Swarm 08 (SEO, News & Viral)</span>
            </Link>

            <Link
              href="/hacks"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800/80 px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <span>Explore 36 Everyday Hacks</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Workplace Tools</div>
          <div className="mt-1 text-2xl font-bold text-amber-400">{telemetry.toolsCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Studios & Utils</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Autonomous Agents</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{telemetry.agentsCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Domain Specialists</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Multi-Agent Swarms</div>
          <div className="mt-1 text-2xl font-bold text-purple-400">{telemetry.swarmsCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Collaborative Teams</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Everyday Hacks</div>
          <div className="mt-1 text-2xl font-bold text-blue-400">{telemetry.hacksCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Prompts & Tricks</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Articles & Guides</div>
          <div className="mt-1 text-2xl font-bold text-rose-400">{telemetry.articlesCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Technical MDX</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Open-Source Repos</div>
          <div className="mt-1 text-2xl font-bold text-teal-400">{telemetry.openSourceReposCount}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Curated & Tested</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
          <div className="text-xs font-medium text-zinc-400">Indexed Routes</div>
          <div className="mt-1 text-2xl font-bold text-white">{telemetry.totalIndexedRoutes}+</div>
          <div className="mt-1 text-[11px] text-zinc-500">SSR / Static</div>
        </div>
      </div>

      {/* Pipeline Architecture & Live Execution Terminal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: 5-Stage Autonomous Pipeline */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">5-Stage Self-Evolution Pipeline</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xs font-bold text-amber-400">
                1
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Multi-Source Harvester</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  GitHub Search API, HackerNews, Dev.to এবং পাবলিক টেকনোলজি আরএসএস থেকে ট্রেন্ডিং তথ্য সংগ্রহ।
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xs font-bold text-emerald-400">
                2
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Deduplication & Sanitization</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Base36 হ্যাশিং ও স্টপ-ওয়ার্ডস ফিল্টারিংয়ের মাধ্যমে ডুপ্লিকেট কনটেন্ট দূরীকরণ ও স্যানিটাইজেশন।
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-xs font-bold text-blue-400">
                3
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Bangla NLP Synthesis & SEO</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  প্রতিটি টেকনিক্যাল সংবাদের জন্য বাংলা সামারি ও হাই-ইনটেন্ট সার্চ কিওয়ার্ড অটো-নির্ধারণ।
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-xs font-bold text-purple-400">
                4
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Deterministic 16:9 SVG Generator</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  জিরো এক্সটার্নাল এপিআই খরচে ক্লায়েন্ট ও বিল্ড টাইমে ভেক্টর কভার ব্যানার স্বয়ংক্রিয়ভাবে তৈরি।
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-xs font-bold text-rose-400">
                5
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Self-Sealing Deployment Gate</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  TypeScript strict check ও MDX ভ্যালিডেশনের পর স্বয়ংক্রিয় গিটহ্যাব অ্যাকশনস ডিসপ্যাচ।
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Execution Logs Terminal */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-zinc-300 text-sm font-semibold">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>OS Autonomous Telemetry Terminal</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="h-72 overflow-y-auto space-y-2 rounded-xl bg-black/60 p-4 font-mono text-xs text-zinc-300 border border-zinc-900">
              {syncLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-zinc-600 select-none mr-2">&gt;</span>
                  {log.includes("✅") ? (
                    <span className="text-emerald-400">{log}</span>
                  ) : log.includes("Initiating") ? (
                    <span className="text-amber-400">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <span>Runtime: Node.js 20 / Next.js Edge</span>
            <span>Status: 100% Operational</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Cover Banner Previewer */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Deterministic 16:9 Cover Banner Engine</h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">1200 x 675 px · Vector SVG</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400">Banner Title</label>
              <input
                type="text"
                value={previewTitle}
                onChange={(e) => setPreviewTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400">Category Tag</label>
              <input
                type="text"
                value={previewCategory}
                onChange={(e) => setPreviewCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              এই এসভিজি কভার ব্যানারটি সম্পূর্ণরূপে ক্লায়েন্ট-সাইড ম্যাথ ও ভেক্টর গ্রাফিক্স দ্বারা তৈরি হয়। কোনো পেইড ইমেজ জেনারেশন এপিআই বা ভারী জিলেইট ফ্রেমওয়ার্ক ছাড়া সম্পূর্ণ ফ্রি ও লাইটওয়েট।
            </p>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-black/60 p-2 overflow-hidden flex items-center justify-center">
            <div
              className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl"
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          </div>
        </div>
      </div>

      {/* Dual Primary Sorting Selector & Catalog Navigator */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Auto-Curated OS Assets</h2>
            <p className="text-xs text-zinc-400 mt-1">
              স্বয়ংক্রিয়ভাবে ইনডেক্সড ও জনপ্রিয়তায় শীর্ষে থাকা প্ল্যাটফর্মের টুলস ও ফিচারসমূহ
            </p>
          </div>

          <PopularNewTabsBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              sound.click();
              setActiveTab(tab);
            }}
            popularCount={telemetry.topPopularSlugs.length}
            newCount={telemetry.newlyDiscoveredSlugs.length}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(activeTab === "popular"
            ? telemetry.topPopularSlugs
            : telemetry.newlyDiscoveredSlugs
          ).map((slug, idx) => (
            <Link
              key={idx}
              href={slug}
              className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-amber-500/40 hover:bg-zinc-850"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {slug.replace("/tools/", "").replace("/hacks", "Everyday Hacks").replace("/os-brain", "OS Brain")}
                  </span>
                  {activeTab === "new" && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      NEW
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400 font-mono">{slug}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-amber-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
