"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Link2, Download, Trophy, ArrowLeft, Star, Maximize2, Minimize2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { isToolPinned, toggleToolPin } from "@/lib/workplace/favorites-and-recents";
import { useStudioFocusMode } from "@/hooks/useStudioFocusMode";
import { ShareContentModal } from "./ShareContentModal";
import { WorkplaceQuickDock } from "./WorkplaceQuickDock";
import { StudioPipelineBridge } from "./StudioPipelineBridge";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

interface UniversalStudioShareBarProps {
  toolSlug: string;
  toolName: string;
  category?: string;
  onExportClick?: () => void;
  getSharePayload?: () => any;
  previewDataUrl?: string;
}

export function UniversalStudioShareBar({
  toolSlug,
  toolName,
  category = "Workplace Studio",
  onExportClick,
  getSharePayload,
  previewDataUrl,
}: UniversalStudioShareBarProps) {
  const { user } = useWorkplaceAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [cachedPayload, setCachedPayload] = useState<any>(null);
  const [pinned, setPinned] = useState(false);
  const { isZenMode, toggleZenMode } = useStudioFocusMode();

  useEffect(() => {
    setPinned(isToolPinned(toolSlug));
    const handleFav = () => setPinned(isToolPinned(toolSlug));
    window.addEventListener("sabbir_os_favorites_changed", handleFav);
    return () => window.removeEventListener("sabbir_os_favorites_changed", handleFav);
  }, [toolSlug]);

  const handleTogglePin = () => {
    sound.toggleSwitch();
    const nextState = toggleToolPin(toolSlug);
    setPinned(nextState);
  };

  const handleOpenShare = () => {
    sound.click();
    const payload = getSharePayload ? getSharePayload() : { tool: toolSlug, timestamp: Date.now() };
    setCachedPayload(payload);
    setIsShareModalOpen(true);
  };

  return (
    <>
      <WorkplaceQuickDock currentSlug={toolSlug} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 backdrop-blur-md mb-6">
        {/* Left: Navigation, Tool Identity, Pin, and Zen */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/tools"
            onClick={() => sound.navigate()}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools</span>
          </Link>
          <span className="text-neutral-700">/</span>
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{toolName}</span>
              <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] text-neutral-400">
                {category}
              </span>
            </div>

            {/* ⭐ Pin Button */}
            <button
              type="button"
              onClick={handleTogglePin}
              className={`p-1 rounded-md border text-xs transition-all ${
                pinned
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                  : "bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-white"
              }`}
              title={pinned ? "Unpin tool from quick dock" : "Pin tool to quick dock"}
            >
              <Star className={`w-3 h-3 ${pinned ? "fill-amber-400" : ""}`} />
            </button>

            {/* ⚡ Zen Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                sound.click();
                toggleZenMode();
              }}
              className="p-1 rounded-md bg-neutral-800/80 border border-neutral-700 text-neutral-400 hover:text-white transition-all text-xs flex items-center gap-1"
              title="Fullscreen Zen Mode (Press 'F')"
            >
              {isZenMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Right: Actions (Pipeline, Bangla Guide, Share, Export, XP Badge) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cross-Studio Pipeline Dropdown */}
          <StudioPipelineBridge currentSlug={toolSlug} />

          {/* Bengali Guide Modal Button */}
          <BanglaGuideModal topic="tools" />

          {/* User XP Badge */}
          {user && (
            <Link
              href="/leaderboard"
              onClick={() => sound.click()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{user.totalXp} XP</span>
            </Link>
          )}

          {/* Share 24h Link */}
          <button
            type="button"
            onClick={handleOpenShare}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors shadow-sm"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Share (24h Link)</span>
          </button>

          {/* Direct Gated Export Trigger (if provided) */}
          {onExportClick && (
            <button
              type="button"
              onClick={() => {
                sound.click();
                onExportClick();
              }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareContentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        toolSlug={toolSlug}
        toolName={toolName}
        payload={cachedPayload}
        previewDataUrl={previewDataUrl}
      />
    </>
  );
}
