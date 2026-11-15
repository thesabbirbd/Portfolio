"use client";

import React from "react";
import { Flame, Sparkles, Filter } from "lucide-react";
import { sound } from "@/lib/sound";
import {
  LifePersona,
  PrimaryDiscoveryTab,
  LIFE_PERSONAS,
} from "@/lib/discovery/popular-new-engine";

export interface PopularNewTabsBarProps {
  activeTab: PrimaryDiscoveryTab;
  onTabChange: (tab: PrimaryDiscoveryTab) => void;
  popularCount?: number;
  newCount?: number;
  selectedPersona?: LifePersona;
  onPersonaChange?: (persona: LifePersona) => void;
  showPersonaChips?: boolean;
  className?: string;
}

export function PopularNewTabsBar({
  activeTab,
  onTabChange,
  popularCount,
  newCount,
  selectedPersona = "all",
  onPersonaChange,
  showPersonaChips = true,
  className = "",
}: PopularNewTabsBarProps) {
  const handleTabClick = (tab: PrimaryDiscoveryTab) => {
    sound.click();
    onTabChange(tab);
  };

  const handlePersonaClick = (p: LifePersona) => {
    sound.toggleSwitch();
    onPersonaChange?.(p);
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Top Level Primary Switcher: Popular vs New */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-md shadow-xl">
          {/* Tab 1: Popular */}
          <button
            type="button"
            onClick={() => handleTabClick("popular")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              activeTab === "popular"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/20 scale-[1.02]"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <Flame
              className={`w-4 h-4 ${
                activeTab === "popular" ? "text-neutral-950 animate-pulse" : "text-amber-400"
              }`}
            />
            <span>🔥 Popular (জনপ্রিয়)</span>
            {popularCount !== undefined && (
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === "popular"
                    ? "bg-neutral-950/20 text-neutral-950 font-black"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {popularCount}
              </span>
            )}
          </button>

          {/* Tab 2: New */}
          <button
            type="button"
            onClick={() => handleTabClick("new")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
              activeTab === "new"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 shadow-md shadow-emerald-500/20 scale-[1.02]"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <Sparkles
              className={`w-4 h-4 ${
                activeTab === "new" ? "text-neutral-950 animate-spin" : "text-emerald-400"
              }`}
            />
            <span>✨ New (নতুন যুক্ত)</span>
            {newCount !== undefined && (
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === "new"
                    ? "bg-neutral-950/20 text-neutral-950 font-black"
                    : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                }`}
              >
                {newCount}
              </span>
            )}
          </button>
        </div>

        {/* Small Mode Hint */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span>
            {activeTab === "popular"
              ? "Ranked by usage, views & real-world utility"
              : "Recently added & auto-discovered tools"}
          </span>
        </div>
      </div>

      {/* Optional Persona Life Category Chips */}
      {showPersonaChips && onPersonaChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LIFE_PERSONAS.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePersonaClick(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-neutral-200 text-neutral-950 font-bold shadow-sm"
                    : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80"
                }`}
                title={p.description}
              >
                <span>{p.icon}</span>
                <span>{p.labelBn}</span>
                <span className="text-[10px] text-neutral-500 font-normal">
                  ({p.labelEn.split(" ")[0]})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
