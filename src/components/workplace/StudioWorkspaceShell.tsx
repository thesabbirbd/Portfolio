"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Star,
  Maximize2,
  Minimize2,
  Command,
  Share2,
  Sparkles,
  ChevronRight,
  HelpCircle,
  X,
  Layers,
  Sliders,
  Download,
  Link2,
  Trophy,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { isToolPinned, toggleToolPin, recordToolVisit } from "@/lib/workplace/favorites-and-recents";
import { useStudioFocusMode } from "@/hooks/useStudioFocusMode";
import { StudioPipelineBridge } from "./StudioPipelineBridge";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { ShareContentModal } from "./ShareContentModal";

export interface StudioWorkspaceShellProps {
  slug: string;
  title: string;
  category: string;
  popularityScore?: number;
  lede?: string;
  children: React.ReactNode;
  /** Optional custom mobile tab rendering or slots */
  controlsSlot?: React.ReactNode;
  exportSlot?: React.ReactNode;
  sampleLoaderSlot?: React.ReactNode;
  activeStep?: 1 | 2 | 3;
  getSharePayload?: () => Record<string, unknown>;
  previewDataUrl?: string;
}

export function StudioWorkspaceShell({
  slug,
  title,
  category,
  popularityScore = 95,
  lede,
  children,
  controlsSlot,
  exportSlot,
  sampleLoaderSlot,
  activeStep = 1,
  getSharePayload,
  previewDataUrl,
}: StudioWorkspaceShellProps) {
  const [pinned, setPinned] = useState(false);
  const [showShortcutHud, setShowShortcutHud] = useState(false);
  const [mobileTab, setMobileTab] = useState<"canvas" | "controls" | "export">("canvas");
  const { isZenMode, toggleZenMode, setIsZenMode } = useStudioFocusMode();
  const { user } = useWorkplaceAuth();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [cachedPayload, setCachedPayload] = useState<Record<string, unknown>>({});

  const handleOpenShare = () => {
    sound.click();
    const payload = getSharePayload ? getSharePayload() : { tool: slug, timestamp: Date.now() };
    setCachedPayload(payload);
    setIsShareModalOpen(true);
  };

  useEffect(() => {
    recordToolVisit(slug);
    setPinned(isToolPinned(slug));

    const handleFavChange = () => setPinned(isToolPinned(slug));
    window.addEventListener("sabbir_os_favorites_changed", handleFavChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle shortcut HUD with '?' (Shift + /)
      if (
        e.key === "?" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setShowShortcutHud((prev) => !prev);
      }
      if (e.key === "Escape" && showShortcutHud) {
        e.preventDefault();
        setShowShortcutHud(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("sabbir_os_favorites_changed", handleFavChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slug]);

  const handleTogglePin = () => {
    sound.toggleSwitch();
    const nextState = toggleToolPin(slug);
    setPinned(nextState);
  };

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isZenMode ? "fixed inset-0 z-50 bg-neutral-950 p-3 sm:p-6 overflow-y-auto" : "relative pb-36"
      }`}
    >
      {/* Studio Header Bar */}
      <header className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md px-2 sm:px-3 py-2 rounded-2xl shadow-sm">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 font-mono drop-shadow-xs">
            <Link href="/explore" className="hover:text-white transition-colors">
              Explore
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
            <span className="text-white font-bold truncate drop-shadow-xs">{title}</span>
          </nav>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-neutral-900 text-neutral-200 border border-neutral-700/80 shadow-xs">
            {category}
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 shadow-xs">
            ★ {popularityScore}% Popular
          </span>
        </div>

        {/* Right: Actions (Pin, Zen Mode, Pipeline, Help, Bangla Guide, Share, XP) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Star / Pin Button */}
          <button
            type="button"
            onClick={handleTogglePin}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              pinned
                ? "bg-amber-500/20 border-amber-500/60 text-amber-400 shadow-sm shadow-amber-500/20"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
            }`}
            title={pinned ? "Unpin tool from quick dock" : "Pin tool to quick dock"}
          >
            <Star className={`w-3.5 h-3.5 ${pinned ? "fill-amber-400" : ""}`} />
          </button>

          {/* Fullscreen Zen Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              toggleZenMode();
            }}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all text-xs flex items-center gap-1"
            title="Toggle Zen Fullscreen Mode (Press 'F')"
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline font-mono text-[10px]">F</span>
          </button>

          {/* Cross-Tool Pipeline Button */}
          <StudioPipelineBridge currentSlug={slug} />

          {/* Bangla Guide Modal Button */}
          <BanglaGuideModal topic="tools" />

          {/* Share 24h Link */}
          {getSharePayload && (
            <button
              type="button"
              onClick={handleOpenShare}
              className="p-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs flex items-center gap-1 font-mono text-[10px] shadow-xs"
              title="24h Share Link"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* User XP Badge */}
          {user && (
            <Link
              href="/leaderboard"
              onClick={() => sound.click()}
              className="hidden lg:inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-xs"
            >
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{user.totalXp} XP</span>
            </Link>
          )}

          {/* Embed Widget Generator Button */}
          <Link
            href={`/tools/embed-widget-studio?widget=${slug}`}
            onClick={() => sound.click()}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-300 transition-all text-xs flex items-center gap-1 font-mono text-[10px]"
            title="Embed this tool on your website as a free widget"
          >
            <span>🧩</span>
            <span className="hidden lg:inline">Embed</span>
          </Link>

          {/* Keyboard Shortcut HUD Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              setShowShortcutHud((prev) => !prev);
            }}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all text-xs"
            title="Keyboard Shortcuts Guide (Press '?')"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3-Step Guided Progress Ribbon & Sample Loader */}
      {!isZenMode && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-xs shadow-sm">
          <div className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto scrollbar-none">
            <span
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                activeStep === 1
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 drop-shadow-xs"
                  : "text-neutral-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 inline-flex items-center justify-center text-[10px] font-bold">
                ১
              </span>
              <span>তথ্য দিন (Input)</span>
            </span>
            <span className="text-neutral-500 font-bold">➔</span>
            <span
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                activeStep === 2
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 drop-shadow-xs"
                  : "text-neutral-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 inline-flex items-center justify-center text-[10px] font-bold">
                ২
              </span>
              <span>অটো হিসাব (Process)</span>
            </span>
            <span className="text-neutral-500 font-bold">➔</span>
            <span
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                activeStep === 3
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 drop-shadow-xs"
                  : "text-neutral-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 inline-flex items-center justify-center text-[10px] font-bold">
                ৩
              </span>
              <span>ডাউনলোড বা শেয়ার (Export)</span>
            </span>
          </div>

          {sampleLoaderSlot && <div className="shrink-0">{sampleLoaderSlot}</div>}
        </div>
      )}

      {/* Lede / Quick Description */}
      {lede && !isZenMode && (
        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed mb-4 max-w-3xl drop-shadow-xs">
          {lede}
        </p>
      )}

      {/* Mobile Tab Switcher (<768px) if slots provided */}
      {(controlsSlot || exportSlot) && (
        <div className="flex md:hidden items-center justify-center p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 mb-3 gap-1">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setMobileTab("canvas");
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === "canvas" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Canvas</span>
          </button>

          {controlsSlot && (
            <button
              type="button"
              onClick={() => {
                sound.click();
                setMobileTab("controls");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mobileTab === "controls" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400"
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Controls</span>
            </button>
          )}

          {exportSlot && (
            <button
              type="button"
              onClick={() => {
                sound.click();
                setMobileTab("export");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mobileTab === "export" ? "bg-amber-500 text-neutral-950 shadow" : "text-neutral-400"
              }`}
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          )}
        </div>
      )}

      {/* Main Studio Viewport */}
      <main className="w-full">
        {/* On mobile, if controls or export tab is active, show only that slot */}
        <div className={mobileTab === "canvas" ? "block" : "hidden md:block"}>{children}</div>
        {controlsSlot && (
          <div className={mobileTab === "controls" ? "block md:hidden mt-2" : "hidden"}>
            {controlsSlot}
          </div>
        )}
        {exportSlot && (
          <div className={mobileTab === "export" ? "block md:hidden mt-2" : "hidden"}>
            {exportSlot}
          </div>
        )}
      </main>

      {/* Keyboard Shortcut HUD Modal */}
      {showShortcutHud && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio Keyboard Shortcuts"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150"
          onClick={() => setShowShortcutHud(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-neutral-950 border border-neutral-700 p-5 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowShortcutHud(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Command className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Studio Keyboard Shortcuts</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-300">Fullscreen Zen Mode</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-amber-400">
                  F
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-300">Exit Zen Mode</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-neutral-400">
                  Esc
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-300">Trigger Export</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-neutral-400">
                  Ctrl / Cmd + E
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-300">Open 24h Share Modal</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-neutral-400">
                  Ctrl / Cmd + S
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/80">
                <span className="text-neutral-300">Toggle Command Palette</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-neutral-400">
                  Ctrl / Cmd + K
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-300">Toggle Shortcut HUD</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-[11px] text-amber-400">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Share Modal */}
      {getSharePayload && (
        <ShareContentModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          toolSlug={slug}
          toolName={title}
          payload={cachedPayload}
          previewDataUrl={previewDataUrl}
        />
      )}
    </div>
  );
}
