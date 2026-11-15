"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Bot,
  Gamepad2,
  FolderGit2,
  Sparkles,
  ArrowRight,
  Trophy,
  Command,
  Search,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { openCommandMenu } from "@/lib/ui-events";

interface QuickLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  badge?: string;
  color: string;
}

const QUICK_MODULES: QuickLinkItem[] = [
  {
    name: "56 Workplace Tools",
    href: "/tools",
    icon: Wrench,
    tag: "Free Everyday Studios",
    badge: "56 Tools",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500",
  },
  {
    name: "Autonomous Agents",
    href: "/agents",
    icon: Bot,
    tag: "24 AI Domain Agents",
    badge: "8 Swarms",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400",
  },
  {
    name: "Live Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    tag: "Real-Time XP & Badges",
    badge: "Global XP",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400",
  },
  {
    name: "OS Brain Center",
    href: "/os-brain",
    icon: Sparkles,
    tag: "Autonomous Evolution Hub",
    badge: "Auto Sync",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
  },
  {
    name: "Everyday Hacks Hub",
    href: "/hacks",
    icon: FolderGit2,
    tag: "40+ AI & Life Hacks",
    badge: "40 Hacks",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400",
  },
];

type SegmentTab = "everyday" | "bd_essential" | "agents" | "leaderboard";

const SEGMENT_TABS: { id: SegmentTab; label: string; icon: string }[] = [
  { id: "everyday", label: "🔥 Top Everyday Studios", icon: "🔥" },
  { id: "bd_essential", label: "🇧🇩 Bangladesh Essential Tools", icon: "🇧🇩" },
  { id: "agents", label: "🤖 AI Agents & Swarms", icon: "🤖" },
  { id: "leaderboard", label: "🏆 Live Leaderboard", icon: "🏆" },
];

const SEGMENT_CONTENT: Record<SegmentTab, { name: string; href: string; badge?: string }[]> = {
  everyday: [
    { name: "✍️ Bijoy ↔ Unicode", href: "/tools/bangla-converter", badge: "দরখাস্ত" },
    { name: "⚡ Electricity & Solar Sizer", href: "/tools/electricity-solar-calculator", badge: "BERC Slab" },
    { name: "💊 Medicine Dose Routine", href: "/tools/medicine-scheduler", badge: "১+০+১" },
    { name: "📸 Gov Photo Sizer", href: "/tools/gov-photo-sizer", badge: "BCS 300x300" },
    { name: "💵 Remittance Calc", href: "/tools/remittance-calculator", badge: "2.5% Aid" },
    { name: "🎓 SSC/HSC & Univ CGPA", href: "/tools/cgpa-calculator", badge: "4th Subj" },
    { name: "🏠 House Rent & To-Let", href: "/tools/house-rent-studio", badge: "রশিদ" },
    { name: "🎂 Job Age & Health ID", href: "/tools/age-health-card", badge: "বয়স" },
    { name: "🎉 Event & Dawat Planner", href: "/tools/event-dawat-planner", badge: "বাবুর্চি" },
  ],
  bd_essential: [
    { name: "🏛️ BCS & Visa Photo", href: "/tools/gov-photo-sizer", badge: "300x300 & Sign" },
    { name: "💸 2.5% Remittance", href: "/tools/remittance-calculator", badge: "BB Cash Aid" },
    { name: "📐 Land (শতক-কাঠা)", href: "/tools/unit-land-converter", badge: "Plot Math" },
    { name: "👑 BAJUS Gold (ভরি-আনা)", href: "/tools/unit-land-converter", badge: "22K/21K/18K" },
    { name: "🕌 Family Zakat & Nisab", href: "/tools/family-budget-zakat", badge: "2.5% Zakat" },
    { name: "🏦 Sanchaypatra & Tax", href: "/tools/tax-sanchaypatra-emi", badge: "Profit" },
    { name: "📑 Khata Memo OCR", href: "/tools/khata-scanner", badge: "Baki Khata" },
    { name: "💬 WhatsApp Macros", href: "/tools/quick-reply-hub", badge: "36 Replies" },
  ],
  agents: [
    { name: "🤖 GovDoc Agent", href: "/agents#gov-doc", badge: "BCS/Visa Doc" },
    { name: "🤖 RemitAdvisor Agent", href: "/agents#remit-advisor", badge: "Payoneer/Bank" },
    { name: "🤖 SupportMacro Agent", href: "/agents#support-macro", badge: "F-Commerce" },
    { name: "🤖 FamilyCFO Agent", href: "/agents#family-cfo", badge: "Zakat/Tax" },
    { name: "🤖 HealthRoutine Agent", href: "/agents#health-routine", badge: "Medicine" },
    { name: "🤖 AcademicCoach Agent", href: "/agents#academic-coach", badge: "CGPA Sprint" },
    { name: "⚡ Freelancer Career Swarm", href: "/agents", badge: "Swarm 06" },
  ],
  leaderboard: [
    { name: "🏆 Global Leaderboard", href: "/leaderboard", badge: "Rank #1" },
    { name: "⭐ Pinned & Recent Tools", href: "/tools", badge: "My Dock" },
    { name: "🎯 Novice to Kernel Legend", href: "/leaderboard", badge: "7 Tiers" },
    { name: "⚡ 24h Share Links", href: "/explore", badge: "/s/[token]" },
    { name: "🎮 Arcade High Scores", href: "/games", badge: "+50 XP" },
  ],
};

export function HeroQuickExploreBar() {
  const [activeSegment, setActiveSegment] = useState<SegmentTab>("everyday");

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 pt-4 border-t border-line/60">
      {/* Stage 062: Interactive Omnibar Trigger Pill */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            sound.launch();
            openCommandMenu();
          }}
          className="w-full group flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border border-primary/30 hover:border-primary/60 transition-all shadow-sm hover:shadow-md cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="p-1 rounded-lg bg-primary text-white shadow-sm">
              <Command className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-ink group-hover:text-primary transition-colors truncate">
              ⌨️ Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-line text-[11px] font-mono font-bold text-ink">Ctrl+K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-muted border border-line text-[11px] font-mono font-bold text-ink">⌘K</kbd> — Try Instant Taka, USD Remittance, Land &amp; Tool Omnibar 2.0
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary shrink-0">
            <Search className="w-3 h-3" />
            <span>Launch Raycast Omnibar →</span>
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-primary/10 text-primary">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
            Explore THE SABBiR OS Ecosystem · 56 Tools &amp; 24 Agents
          </span>
        </div>
        <Link
          href="/explore"
          onClick={() => sound.navigate()}
          className="text-[11px] font-mono text-ink-3 hover:text-primary transition flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View Master Directory (137+ Routes)</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid of Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {QUICK_MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => sound.navigate()}
              className="p-3 rounded-xl border border-line bg-surface/80 hover:bg-muted/40 hover:border-primary/50 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-ink-3 group-hover:text-ink transition">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold font-mono text-ink group-hover:text-primary transition truncate">
                  {item.name}
                </div>
              </div>
              <div className="text-[10px] text-ink-3 truncate mt-1">
                {item.tag}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stage 061: Segmented Switcher Tabs */}
      <div className="mt-4 pt-3 border-t border-line/40 space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-xl bg-muted/30 border border-line/60">
          {SEGMENT_TABS.map((tab) => {
            const isActive = activeSegment === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.toggleSwitch();
                  setActiveSegment(tab.id);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white font-bold shadow-sm"
                    : "text-ink-2 hover:text-ink hover:bg-muted/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Studio Pills for Selected Segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {SEGMENT_CONTENT[activeSegment].map((pill) => (
            <Link
              key={pill.name}
              href={pill.href}
              onClick={() => sound.click()}
              className="shrink-0 px-2.5 py-1.5 rounded-lg bg-surface hover:bg-muted border border-line text-[11px] font-medium text-ink-2 hover:text-ink hover:border-primary/40 transition flex items-center gap-1.5 group shadow-2xs"
            >
              <span>{pill.name}</span>
              {pill.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  {pill.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
