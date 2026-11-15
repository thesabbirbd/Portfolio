"use client";

import React, { useState } from "react";
import { Search, BookOpen, Sparkles, Filter, Wrench, Flame, Clock, ArrowUpDown } from "lucide-react";
import { sound } from "@/lib/sound";
import { ContentItem } from "@/lib/content";
import { ContentCard } from "./ContentCard";
import { OpenSourceDirectory } from "@/components/discover/OpenSourceDirectory";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";

export interface CategorizedArticlesHubProps {
  initialArticles: ContentItem[];
}

export type ArticleCategory =
  | "All Guides & Articles"
  | "Basic & Beginner Guides"
  | "Open-Source Tools & Setup"
  | "Backend, FastAPI & SQL"
  | "DevOps, Linux & Docker"
  | "Local AI & Automation"
  | "NOC, MikroTik & Hardware";

const CATEGORIES: { label: ArticleCategory; short: string; badge?: string }[] = [
  { label: "All Guides & Articles", short: "All" },
  { label: "Basic & Beginner Guides", short: "🟢 Basic Guides", badge: "Beginner" },
  { label: "Open-Source Tools & Setup", short: "🛠️ Open-Source Stack", badge: "Arsenal" },
  { label: "Backend, FastAPI & SQL", short: "⚙️ Backend & SQL" },
  { label: "DevOps, Linux & Docker", short: "🐳 DevOps & Linux" },
  { label: "Local AI & Automation", short: "🤖 Local AI" },
  { label: "NOC, MikroTik & Hardware", short: "🌐 NOC & Hardware" },
];

export function CategorizedArticlesHub({ initialArticles }: CategorizedArticlesHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>("All Guides & Articles");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Basic" | "Intermediate" | "Advanced">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const handleCategorySelect = (cat: ArticleCategory) => {
    sound.toggleSwitch();
    setSelectedCategory(cat);
  };

  const handleDifficultySelect = (diff: "All" | "Basic" | "Intermediate" | "Advanced") => {
    sound.click();
    setSelectedDifficulty(diff);
  };

  const filteredArticles = React.useMemo(() => {
    const list = initialArticles.filter((item) => {
      const meta = item.meta;

      // Category Filter
      if (selectedCategory !== "All Guides & Articles" && selectedCategory !== "Open-Source Tools & Setup") {
        const cat = (meta.category || "").toLowerCase();

        if (selectedCategory === "Basic & Beginner Guides") {
          if (meta.difficulty !== "Basic" && !cat.includes("basic") && !cat.includes("beginner")) {
            return false;
          }
        } else if (selectedCategory === "Backend, FastAPI & SQL") {
          if (!cat.includes("sql") && !cat.includes("backend") && !cat.includes("fastapi") && !meta.tags?.some((t) => ["SQL", "PostgreSQL", "Backend"].includes(t))) {
            return false;
          }
        } else if (selectedCategory === "DevOps, Linux & Docker") {
          if (!cat.includes("linux") && !cat.includes("docker") && !cat.includes("devops") && !meta.tags?.some((t) => ["Linux", "Docker", "DevOps", "systemd"].includes(t))) {
            return false;
          }
        } else if (selectedCategory === "Local AI & Automation") {
          if (!cat.includes("ai") && !cat.includes("ollama") && !meta.tags?.some((t) => ["Local AI", "Ollama", "LLM"].includes(t))) {
            return false;
          }
        } else if (selectedCategory === "NOC, MikroTik & Hardware") {
          if (!cat.includes("networking") && !cat.includes("noc") && !cat.includes("mikrotik") && !meta.tags?.some((t) => ["CIDR", "Networking", "IPv4"].includes(t))) {
            return false;
          }
        }
      }

      // Difficulty Filter
      if (selectedDifficulty !== "All") {
        const diff = meta.difficulty || "Intermediate";
        if (diff !== selectedDifficulty) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = meta.title.toLowerCase().includes(q);
        const matchDesc = meta.description.toLowerCase().includes(q);
        const matchTags = meta.tags?.some((t) => t.toLowerCase().includes(q));
        const matchSeo = meta.seoKeywords?.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags && !matchSeo) return false;
      }

      return true;
    });

    return sortItems(list, sortBy, {
      getPopularity: (a) => (a.meta.difficulty === "Basic" ? 95 : 85) + (a.meta.tags?.length || 0) * 2,
      getImpact: (a) => (a.meta.featured ? 98 : 80),
      getDate: (a) => a.meta.date,
      getTitle: (a) => a.meta.title,
    });
  }, [initialArticles, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* 7 Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Article Categories">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleCategorySelect(cat.label)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "bg-surface border border-line text-ink-3 hover:text-ink hover:bg-muted"
              }`}
            >
              <span>{cat.short}</span>
              {cat.badge && (
                <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-sans ${
                  isActive ? "bg-white/20 text-white" : "bg-muted text-ink-2"
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-bar: Search & Difficulty Filter */}
      {selectedCategory !== "Open-Source Tools & Setup" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-line">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, tags or keywords..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface border border-line text-xs font-mono text-ink placeholder:text-ink-3 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Difficulty & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="text-ink-3 text-[11px] mr-1">Sort:</span>
              {(
                [
                  { id: "popular", label: "🔥 Popular" },
                  { id: "newest", label: "Clock Newest" },
                  { id: "impact", label: "✨ Impact" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.toggleSwitch();
                    setSortBy(opt.id as SortOption);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] transition ${
                    sortBy === opt.id
                      ? "bg-primary text-white font-bold"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 pl-2 border-l border-line">
              <span className="text-ink-3 text-[11px] mr-1">Level:</span>
              {(["All", "Basic", "Intermediate", "Advanced"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultySelect(diff)}
                  className={`px-2 py-0.5 rounded text-[11px] transition ${
                    selectedDifficulty === diff
                      ? "bg-ink text-surface dark:bg-white dark:text-black font-bold"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {selectedCategory === "Open-Source Tools & Setup" ? (
        <OpenSourceDirectory />
      ) : (
        <div>
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-line bg-muted/10 font-mono text-xs text-ink-3">
              No articles found matching &quot;{searchQuery}&quot; in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredArticles.map((item) => (
                <ContentCard key={item.meta.slug} item={item} baseUrl="/articles" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
