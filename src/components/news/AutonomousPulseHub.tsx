"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Flame,
  CheckCircle2,
  Cpu,
  BookOpen,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { formatContentDate } from "@/lib/content-date";
import { UniversalFilterSortBar } from "@/components/system/UniversalFilterSortBar";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";

export interface PulseItem {
  id: string;
  slug?: string;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  summary: string;
  engineeringTakeaway: string;
  seoKeywords: string[];
  hashtags: string[];
  points: number;
  publishedAt: string;
  coverImage?: string;
}

export function AutonomousPulseHub({ initialItems }: { initialItems: PulseItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "All",
    "AI & LLMs",
    "Trending Open-Source",
    "Backend & Cloud",
    "Security & Linux",
    "DevOps & Containers",
  ];

  const handleCopyHashtags = async (id: string, text: string) => {
    sound.copy();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = initialItems.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSum = item.summary.toLowerCase().includes(q);
        const matchTakeaway = item.engineeringTakeaway.toLowerCase().includes(q);
        const matchKeywords = item.seoKeywords?.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchSum && !matchTakeaway && !matchKeywords) return false;
      }
      return true;
    });

    return sortItems(list, sortBy, {
      getPopularity: (item) => item.points || 50,
      getImpact: (item) => item.points || 50,
      getDate: (item) => item.publishedAt,
      getTitle: (item) => item.title,
    });
  }, [initialItems, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Pipeline Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/40 border border-line text-xs font-mono">
        <div className="flex items-center gap-3">
          <Link
            href="/os-brain"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
            title="Inspect autonomous self-evolving pipeline at /os-brain"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>🤖 Auto-Synced by THE SABBiR OS Brain</span>
          </Link>
          <span className="hidden sm:inline text-ink-3">• Auto-Synced via GitHub Actions &amp; Edge Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-ink-3">
            Engine: <strong className="text-emerald-500 font-semibold">Active &amp; Self-Evolving</strong>
          </span>
        </div>
      </div>

      {/* Universal Search, Filter & Sort Bar */}
      <UniversalFilterSortBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tech drops by title, takeaway, or tag..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={initialItems.length}
        filteredCount={filteredAndSorted.length}
      />

      {/* Featured Story Banner */}
      {selectedCategory === "All" && !searchQuery.trim() && filteredAndSorted.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden border border-line bg-surface group shadow-md">
          {filteredAndSorted[0].coverImage && (
            <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] overflow-hidden bg-muted">
              <img
                src={filteredAndSorted[0].coverImage}
                alt={filteredAndSorted[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
          )}
          <div className="p-6 relative -mt-20 sm:-mt-24 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-primary text-white font-mono text-[10px] font-bold uppercase">
                Featured Drop
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white/90 font-mono text-[10px]">
                {filteredAndSorted[0].category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-mono text-xs ml-auto">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{filteredAndSorted[0].points} PTS</span>
              </div>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white group-hover:text-primary transition leading-tight">
              <Link href={`/news/${filteredAndSorted[0].slug || filteredAndSorted[0].id}`}>
                {filteredAndSorted[0].title}
              </Link>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-2xl">
              {filteredAndSorted[0].summary}
            </p>
            <div className="pt-2 flex items-center justify-between">
              <Link
                href={`/news/${filteredAndSorted[0].slug || filteredAndSorted[0].id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold transition shadow"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Full Technical Breakdown →</span>
              </Link>
              <a
                href={filteredAndSorted[0].sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1"
              >
                <span>Official Source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Articles Feed */}
      <div className="space-y-4">
        {filteredAndSorted.map((item) => {
          const isCopied = copiedId === item.id;
          const storySlug = item.slug || item.id;
          const shareableText = `${item.title}\n\n${item.engineeringTakeaway}\n\nRead more: https://sabbir.nav.bd/news/${storySlug}\n\n${item.hashtags.join(" ")}`;

          return (
            <article
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl border border-line surface-card hover:border-primary/50 transition-all shadow-sm space-y-4"
            >
              {/* 16:9 Visual Cover Image */}
              {item.coverImage && (
                <Link href={`/news/${storySlug}`} className="block relative w-full aspect-video rounded-xl overflow-hidden bg-muted border border-line/60 group">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                    <span className="text-white text-xs font-mono font-bold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Read Full Breakdown →
                    </span>
                  </div>
                </Link>
              )}

              {/* Header meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase text-[10px]">
                    {item.category}
                  </span>
                  <time dateTime={item.publishedAt} className="text-ink-3">
                    {formatContentDate(item.publishedAt)}
                  </time>
                </div>
                <div className="flex items-center gap-1 text-ink-3 text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{item.points} Virality Points</span>
                </div>
              </div>

              {/* Title & Link to dedicated news page */}
              <h2 className="text-base sm:text-lg font-bold text-ink hover:text-primary transition leading-snug">
                <Link href={`/news/${storySlug}`}>
                  {item.title}
                </Link>
              </h2>

              {/* Brief Summary */}
              <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                {item.summary}
              </p>

              {/* THE SABBiR Engineering Perspective Box */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-primary/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>THE SABBiR Engineering Perspective</span>
                </div>
                <p className="text-xs text-ink-2 leading-relaxed font-sans">
                  {item.engineeringTakeaway}
                </p>
              </div>

              {/* Actions & SEO Tags */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line/60">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/news/${storySlug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary hover:underline"
                  >
                    <span>Full Breakdown</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-ink-3 hover:text-ink inline-flex items-center gap-1"
                  >
                    <span>Source: {item.source}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyHashtags(item.id, shareableText)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-line bg-muted/30 hover:bg-muted text-ink-2 hover:text-ink transition"
                    title="Copy post snippet with SEO hashtags"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Snippet Copied!" : "Share with Hashtags"}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
