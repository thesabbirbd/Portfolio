"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Check, Sparkles, Flame, Search, ArrowRight, ExternalLink, Terminal, Lightbulb, Shield, Code2, Globe } from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { HACKS_CATALOG, HackItem, HackCategory } from "@/data/hacks-catalog";
import { PopularNewTabsBar } from "@/components/ui/PopularNewTabsBar";
import { PrimaryDiscoveryTab, sortPopularOrNew } from "@/lib/discovery/popular-new-engine";

const CATEGORIES: { id: HackCategory | "all"; labelBn: string; labelEn: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", labelBn: "সব হ্যাকস", labelEn: "All Hacks (36)", icon: Sparkles },
  { id: "ai_prompts", labelBn: "এআই প্রম্পট", labelEn: "AI Prompts", icon: Lightbulb },
  { id: "github_tricks", labelBn: "গিটহাব ট্রিকস", labelEn: "GitHub Power", icon: Code2 },
  { id: "linux_devops", labelBn: "লিনাক্স ও ডেভঅপস", labelEn: "Linux One-Liners", icon: Terminal },
  { id: "bd_digital_life", labelBn: "ডিজিটাল লাইফ বিডি", labelEn: "BD Digital Life", icon: Globe },
  { id: "productivity", labelBn: "প্রোডাক্টিভিটি", labelEn: "System Shortcuts", icon: Shield },
];

export function HacksDirectoryHub() {
  const [activeTab, setActiveTab] = useState<PrimaryDiscoveryTab>("popular");
  const [selectedCategory, setSelectedCategory] = useState<HackCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHacks = useMemo(() => {
    let list = HACKS_CATALOG;

    if (selectedCategory !== "all") {
      list = list.filter((h) => h.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.banglaTitle.toLowerCase().includes(q) ||
          h.banglaSummary.toLowerCase().includes(q) ||
          h.copySnippet.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return sortPopularOrNew(list, activeTab);
  }, [activeTab, selectedCategory, searchQuery]);

  const handleCopy = async (id: string, snippet: string) => {
    sound.confirm();
    await navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    osStore.addXp(15, "Copied Tech Hack Snippet");
  };

  return (
    <div className="w-full space-y-6">
      {/* Popular vs New Switcher */}
      <PopularNewTabsBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        popularCount={HACKS_CATALOG.length}
        newCount={HACKS_CATALOG.filter((h) => h.isNew).length}
        showPersonaChips={false}
      />

      {/* Search & Category Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI prompts, Linux one-liners, GitHub shortcuts..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  sound.toggleSwitch();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 border border-neutral-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-neutral-950" : "text-amber-400"}`} />
                <span>{cat.labelBn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Hack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHacks.map((hack) => {
          const isCopied = copiedId === hack.id;
          return (
            <div
              key={hack.id}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-all duration-200 group"
            >
              <div className="space-y-3">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                    {hack.category.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hack.isNew && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        NEW
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      ★ {hack.popularityScore}
                    </span>
                  </div>
                </div>

                {/* Titles */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {hack.banglaTitle}
                  </h3>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {hack.title}
                  </div>
                </div>

                {/* Bangla Summary */}
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {hack.banglaSummary}
                </p>

                {/* Code Snippet Box */}
                <div className="relative rounded-2xl bg-neutral-950 border border-neutral-850 p-3 group/code">
                  <pre className="text-[11px] font-mono text-neutral-200 overflow-x-auto whitespace-pre-wrap break-words max-h-36 scrollbar-thin">
                    <code>{hack.copySnippet}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleCopy(hack.id, hack.copySnippet)}
                    className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                      isCopied
                        ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30"
                        : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Actions & Companion Bridge */}
              <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                {hack.companionToolHref ? (
                  <Link
                    href={hack.companionToolHref}
                    onClick={() => sound.click()}
                    className="text-[11px] text-amber-400 font-mono hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>{hack.companionToolLabel || "Open Tool"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-500">
                    #{hack.tags[0]} #{hack.tags[1]}
                  </span>
                )}

                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {hack.difficulty}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
