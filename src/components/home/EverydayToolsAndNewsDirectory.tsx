"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Newspaper,
  Layers,
  Wrench,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface QuickChip {
  name: string;
  bangla: string;
  href: string;
  icon: string;
  badge?: string;
}

const TOP_NEW_STUDIOS: QuickChip[] = [
  { name: "NID Stitcher", bangla: "এনআইডি প্রিন্ট", href: "/tools/id-card-stitcher", icon: "🪪", badge: "A4" },
  { name: "Bijoy ↔ Unicode", bangla: "বিজয় কনভার্টার", href: "/tools/bangla-converter", icon: "🇧🇩", badge: "১২ দরখাস্ত" },
  { name: "Degree CGPA", bangla: "সিজিপিএ স্টুডিও", href: "/tools/cgpa-calculator", icon: "🎓", badge: "NU/UGC" },
  { name: "Prescription Dose", bangla: "ওষুধ শিডিউল", href: "/tools/medicine-scheduler", icon: "💊", badge: "১+০+১" },
  { name: "Budget & Zakat", bangla: "বাজেট ও যাকাত", href: "/tools/family-budget-zakat", icon: "🕌", badge: "২.৫%" },
  { name: "Electric & Solar", bangla: "বিদ্যুৎ ও সোলার", href: "/tools/electricity-solar-calculator", icon: "⚡", badge: "Slab" },
];

const COMPACT_NEWS_PULSE = [
  { title: "PostgreSQL 17 Incremental Backups", time: "Cloud", href: "/news/postgres-17-incremental-backup" },
  { title: "DeepSeek-V3 Open Architecture", time: "AI SOTA", href: "/news/deepseek-v3-architecture" },
  { title: "Node.js 22 LTS Native SQLite", time: "DevOps", href: "/news/nodejs-22-lts-features" },
];

const COMPACT_HUBS = [
  { name: "24 AI Agents", bangla: "২৪ এজেন্ট", href: "/agents", icon: "🤖" },
  { name: "8 Multi Swarms", bangla: "৮ সোয়ার্ম", href: "/agents#swarms", icon: "🐝" },
  { name: "40 OS Hacks", bangla: "৪০ হ্যাকস", href: "/hacks", icon: "⚡" },
  { name: "OS Brain Center", bangla: "ওএস ব্রেন", href: "/os-brain", icon: "🧠" },
  { name: "Aiyaar Cloud CPM", bangla: "আইয়ার পিওএস", href: "/aiyaar", icon: "🏢" },
  { name: "DevOps Arcade (6)", bangla: "৬টি গেম", href: "/games", icon: "🎮" },
];

export function EverydayToolsAndNewsDirectory() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-6 sm:my-8">
      {/* Sleek, Compact Minimalist Container */}
      <div className="rounded-3xl border border-line bg-surface/70 backdrop-blur-md p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Top Header Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-ink text-xs sm:text-sm font-mono tracking-tight flex items-center gap-1.5">
              <span>⚡ Newly Released Studios &amp; Autonomous Intelligence</span>
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink-3 hidden sm:inline">
            Client-Side Secure · Zero Cloud Dependency
          </span>
        </div>

        {/* 3 Compact Minimalist Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: Top Everyday Studios */}
          <div className="p-3.5 rounded-2xl bg-muted/20 border border-line/50 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5 font-mono">
                  <Wrench className="w-3.5 h-3.5 text-amber-500" />
                  <span>প্রাত্যহিক সুপার-স্টুডিও</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold">
                  ৫৬ Tools
                </span>
              </div>

              {/* Micro Pills Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {TOP_NEW_STUDIOS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => sound.click()}
                    className="p-1.5 rounded-xl border border-line/60 bg-surface hover:border-amber-500/50 hover:bg-muted/40 transition-all flex items-center gap-1.5 text-ink group"
                  >
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="text-[11px] font-medium truncate group-hover:text-amber-500 transition-colors">
                      {item.bangla}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/tools"
              onClick={() => sound.navigate()}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-amber-500 text-[11px] font-bold text-ink hover:text-amber-500 transition-all group"
            >
              <span>Explore 56 Super-Tools</span>
              <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Column 2: Tech & AI Pulse */}
          <div className="p-3.5 rounded-2xl bg-muted/20 border border-line/50 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5 font-mono">
                  <Newspaper className="w-3.5 h-3.5 text-cyan-500" />
                  <span>টেক ও এআই পাল্স</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 font-bold">
                  Live ISR
                </span>
              </div>

              {/* Headline Links */}
              <div className="space-y-1.5">
                {COMPACT_NEWS_PULSE.map((news, idx) => (
                  <Link
                    key={idx}
                    href={news.href}
                    onClick={() => sound.click()}
                    className="p-1.5 rounded-xl border border-line/60 bg-surface hover:border-cyan-500/50 hover:bg-muted/40 transition-all flex items-center justify-between gap-2 text-ink group"
                  >
                    <span className="text-[11px] font-medium truncate group-hover:text-cyan-500 transition-colors">
                      {news.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-ink-3 shrink-0">
                      {news.time}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/news"
              onClick={() => sound.navigate()}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-cyan-500 text-[11px] font-bold text-ink hover:text-cyan-500 transition-all group"
            >
              <span>Explore Tech &amp; AI Pulse</span>
              <ArrowRight className="w-3 h-3 text-cyan-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Column 3: Ecosystem Hubs */}
          <div className="p-3.5 rounded-2xl bg-muted/20 border border-line/50 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5 font-mono">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>প্রধান ইকোসিস্টেম হাব</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">
                  137+ Routes
                </span>
              </div>

              {/* Micro Hub Chips Grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {COMPACT_HUBS.map((hub) => (
                  <Link
                    key={hub.name}
                    href={hub.href}
                    onClick={() => sound.click()}
                    className="p-1.5 rounded-xl border border-line/60 bg-surface hover:border-blue-500/50 hover:bg-muted/40 transition-all flex items-center gap-1.5 text-ink group"
                  >
                    <span className="text-sm shrink-0">{hub.icon}</span>
                    <span className="text-[11px] font-medium truncate group-hover:text-blue-500 transition-colors">
                      {hub.bangla}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/explore"
              onClick={() => sound.navigate()}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-surface border border-line hover:border-blue-500 text-[11px] font-bold text-ink hover:text-blue-500 transition-all group"
            >
              <span>Explore Entire Ecosystem</span>
              <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
