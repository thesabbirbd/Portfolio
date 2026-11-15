"use client";

import React from "react";
import { Search, Flame, Sparkles, Clock, ArrowUpDown, X } from "lucide-react";
import { sound } from "@/lib/sound";
import type { SortOption } from "@/lib/popularity-ranker";

export interface UniversalFilterSortBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

const SORT_OPTIONS: { id: SortOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "popular", label: "🔥 Popular", icon: Flame },
  { id: "newest", label: "✨ New", icon: Sparkles },
  { id: "impact", label: "Impact", icon: ArrowUpDown },
  { id: "alphabetical", label: "A–Z", icon: ArrowUpDown },
];

export function UniversalFilterSortBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: UniversalFilterSortBarProps) {
  return (
    <div className="w-full space-y-3.5">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface border border-line text-xs font-mono text-ink placeholder:text-ink-3 focus:outline-none focus:border-primary shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                sound.toggleSwitch();
                onSearchChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-line text-xs font-mono shadow-sm">
            <span className="text-[10px] text-ink-3 uppercase px-2 hidden lg:inline">Sort:</span>
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.toggleSwitch();
                    onSortChange(opt.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-sm"
                      : "text-ink-3 hover:text-ink hover:bg-muted"
                  }`}
                  title={`Sort by ${opt.label}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-ink-3"}`} />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Filter Pills & Result Counter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  sound.toggleSwitch();
                  onSelectCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition ${
                  isSelected
                    ? "bg-ink text-surface dark:bg-white dark:text-black font-bold shadow-sm"
                    : "bg-surface border border-line text-ink-3 hover:text-ink hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-ink-3 shrink-0">
          Showing <span className="font-bold text-ink">{filteredCount}</span> of {totalCount}
        </div>
      </div>
    </div>
  );
}
