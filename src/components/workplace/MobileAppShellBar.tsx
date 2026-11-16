"use client";

import React from "react";
import { Edit3, Eye, Download, Share2, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

export type MobileTabMode = "input" | "preview" | "export";

export interface MobileAppShellBarProps {
  activeTab: MobileTabMode;
  onTabChange: (tab: MobileTabMode) => void;
  onDownload?: () => void;
  onShare?: () => void;
  onLoadSample?: () => void;
  downloadLabel?: string;
  shareLabel?: string;
  showStickyBottomBar?: boolean;
}

export function MobileAppShellBar({
  activeTab,
  onTabChange,
  onDownload,
  onShare,
  onLoadSample,
  downloadLabel = "ডাউনলোড",
  shareLabel = "শেয়ার",
  showStickyBottomBar = true,
}: MobileAppShellBarProps) {
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(10);
    }
  };

  const handleTabClick = (tab: MobileTabMode) => {
    sound.click();
    triggerHaptic();
    onTabChange(tab);
  };

  return (
    <>
      {/* 3-Tab Segmented App Bar (Visible on mobile screens < 768px) */}
      <div className="md:hidden sticky top-16 z-30 mb-4 bg-neutral-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-800 shadow-lg">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleTabClick("input")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "input"
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>১. ইনপুট</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("preview")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "preview"
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>২. প্রিভিউ</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick("export")}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "export"
                ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>৩. সেভ</span>
          </button>
        </div>

        {/* 1-Click Demo Data Presets Chip */}
        {onLoadSample && (
          <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between px-1 text-[11px]">
            <span className="text-neutral-400">টাইপ না করে টেস্ট করতে চান?</span>
            <button
              type="button"
              onClick={() => {
                sound.click();
                triggerHaptic();
                onLoadSample();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 font-mono"
            >
              <Sparkles className="w-3 h-3" />
              <span>⚡ ১-ক্লিক ডেমো ডেটা</span>
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar (< 768px) */}
      {showStickyBottomBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl flex items-center gap-2">
          {onShare && (
            <button
              type="button"
              onClick={() => {
                sound.click();
                triggerHaptic();
                onShare();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{shareLabel}</span>
            </button>
          )}

          {onDownload && (
            <button
              type="button"
              onClick={() => {
                sound.shutter();
                triggerHaptic();
                onDownload();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadLabel}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
