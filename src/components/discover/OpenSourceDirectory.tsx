"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Terminal,
  Sparkles,
  Cpu,
} from "lucide-react";
import { sound } from "@/lib/sound";
import {
  OPENSOURCE_TOOLS,
  type OpenSourceToolItem,
  type ToolCategory,
  type ToolTier,
} from "@/data/opensource-tools";
import { UniversalFilterSortBar } from "@/components/system/UniversalFilterSortBar";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";

const CATEGORIES: ToolCategory[] = [
  "All",
  "Local AI",
  "DevOps & Containers",
  "Backend & SQL",
  "NOC & Networking",
  "Productivity",
];

export function OpenSourceDirectory() {
  const [selectedTier, setSelectedTier] = useState<"all" | ToolTier>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCommand = async (id: string, command: string) => {
    sound.copy();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = OPENSOURCE_TOOLS.filter((tool) => {
      if (selectedTier !== "all" && tool.tier !== selectedTier) return false;
      if (selectedCategory !== "All" && tool.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description.toLowerCase().includes(q);
        const matchCat = tool.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    return sortItems(list, sortBy, {
      getPopularity: (t) => t.stars || (t.tier === "built-by-sabbir" ? 95 : 80),
      getImpact: (t) => (t.tier === "built-by-sabbir" ? 100 : 85),
      getTitle: (t) => t.name,
      getDate: () => "2026-11-15",
    });
  }, [selectedTier, selectedCategory, searchQuery, sortBy]);

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
          <span className="hidden sm:inline text-ink-3">• Continuous GitHub &amp; Open-Source Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-ink-3">
            Registry: <strong className="text-emerald-500 font-semibold">{OPENSOURCE_TOOLS.length} Curated Repos</strong>
          </span>
        </div>
      </div>

      {/* Tier Selector Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-line w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={selectedTier === "all"}
          onClick={() => {
            sound.toggleSwitch();
            setSelectedTier("all");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
            selectedTier === "all"
              ? "bg-primary text-white font-bold"
              : "text-ink-3 hover:text-ink hover:bg-muted"
          }`}
        >
          All Tools ({OPENSOURCE_TOOLS.length})
        </button>
        <button
          role="tab"
          aria-selected={selectedTier === "built-by-sabbir"}
          onClick={() => {
            sound.toggleSwitch();
            setSelectedTier("built-by-sabbir");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1 ${
            selectedTier === "built-by-sabbir"
              ? "bg-primary text-white font-bold"
              : "text-ink-3 hover:text-ink hover:bg-muted"
          }`}
        >
          <Sparkles className="w-3 h-3" /> Built by THE SABBiR
        </button>
        <button
          role="tab"
          aria-selected={selectedTier === "curated-stack"}
          onClick={() => {
            sound.toggleSwitch();
            setSelectedTier("curated-stack");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
            selectedTier === "curated-stack"
              ? "bg-primary text-white font-bold"
              : "text-ink-3 hover:text-ink hover:bg-muted"
          }`}
        >
          Curated Stack
        </button>
      </div>

      {/* Universal Search, Filter & Sort Bar */}
      <UniversalFilterSortBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search open-source tools by name, tag, or description..."
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={OPENSOURCE_TOOLS.length}
        filteredCount={filteredAndSorted.length}
      />

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSorted.map((tool) => {
          const isCopied = copiedId === tool.id;
          return (
            <div
              key={tool.id}
              className="p-5 rounded-2xl border border-line surface-card flex flex-col justify-between hover:border-primary/50 transition-all shadow-sm group"
            >
              <div>
                {/* 16:9 Visual GitHub Banner */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/60 mb-3.5 border border-line/60">
                  <img
                    src={tool.coverImage}
                    alt={`${tool.name} open-source preview banner`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-center"
                  >
                    <FolderGit2 className="w-8 h-8 text-primary/60 mb-2" />
                    <span className="text-xs font-mono font-bold text-white">{tool.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-0.5">{tool.category}</span>
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                      {tool.category}
                    </span>
                    <h3 className="text-base font-bold text-ink mt-0.5 group-hover:text-primary transition">
                      {tool.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.tier === "built-by-sabbir" && (
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-primary/10 text-primary border border-primary/20">
                        Author
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-muted text-ink-3">
                      {tool.license}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-ink-2 mt-2 leading-relaxed">
                  {tool.description}
                </p>

                {/* 1-Click Install Command */}
                <div className="mt-3.5 p-2 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-300 flex items-center justify-between gap-2 border border-zinc-800">
                  <div className="truncate flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{tool.installCommand}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCommand(tool.id, tool.installCommand)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0"
                    title="Copy command"
                    aria-label={`Copy install command for ${tool.name}`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono">
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-ink-2 hover:text-primary transition"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-ink-3" />
                </a>

                {tool.webAlternativeUrl ? (
                  <a
                    href={tool.webAlternativeUrl}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:text-emerald-400 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{tool.webAlternativeLabel || "Web Tool →"}</span>
                  </a>
                ) : tool.tutorialUrl ? (
                  <a
                    href={tool.tutorialUrl}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Guide →</span>
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
