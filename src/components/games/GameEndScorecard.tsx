"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Copy,
  Share2,
  Trophy,
  Check,
  RefreshCw,
  X,
  Sparkles,
  Smartphone,
  Monitor,
  Link2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useOSStore, osStore } from "@/lib/os-store";
import { ShareContentModal } from "@/components/workplace/ShareContentModal";
import {
  type ScorecardData,
  type ScorecardAspectRatio,
  renderScorecardToCanvas,
  downloadScorecardPNG,
  copyScorecardToClipboard,
  generateShareText,
  formatTimeSeconds,
} from "@/lib/scorecard-canvas";

interface GameEndScorecardProps {
  data: ScorecardData;
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
}

export function GameEndScorecard({
  data,
  isOpen,
  onClose,
  onPlayAgain,
}: GameEndScorecardProps) {
  const profile = useOSStore();
  const [handle, setHandle] = useState(data.playerHandle || profile.handle);
  const [aspectRatio, setAspectRatio] = useState<ScorecardAspectRatio>("landscape");
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const activeData: ScorecardData = {
    ...data,
    playerHandle: handle,
  };

  // Re-draw canvas whenever handle or aspect ratio changes
  useEffect(() => {
    if (!isOpen) return;
    const canvas = renderScorecardToCanvas(activeData, { aspectRatio });
    canvasRef.current = canvas;

    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
      canvas.className = "w-full h-auto rounded-lg border border-line shadow-2xl";
      canvas.style.maxHeight = aspectRatio === "portrait" ? "420px" : "320px";
      canvas.style.objectFit = "contain";
      previewContainerRef.current.appendChild(canvas);
    }
  }, [isOpen, handle, aspectRatio, data]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    sound.shutter();
    const safeName = `the-sabbir-os-${data.gameId}-${data.score}.png`;
    await downloadScorecardPNG(canvasRef.current, safeName);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    sound.shutter();
    const ok = await copyScorecardToClipboard(canvasRef.current);
    if (ok) {
      sound.confirm();
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } else {
      sound.error();
    }
  };

  const handleShareText = async () => {
    const text = generateShareText(activeData);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      sound.copy();
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleSubmitScore = async () => {
    if (submitted || isSubmitting) return;
    setIsSubmitting(true);
    sound.click();

    try {
      osStore.setHandle(handle);
      osStore.recordGameScore(data.gameId, data.score);
      osStore.addXp(100, `Won Arcade Game: ${data.gameTitle}`);

      // 1. Sync to Games Leaderboard
      await fetch("/api/games/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: data.gameId,
          playerHandle: handle,
          score: data.score,
          rankTier: data.rankTier,
          accuracyPct: data.accuracyPct,
          survivalSeconds: data.timeTakenSeconds,
        }),
      }).catch(() => {});

      // 2. Sync to Global SaaS Workplace Leaderboard (+100 XP)
      await fetch("/api/workplace/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: "game_won",
          targetSlug: data.gameId,
          xpDelta: 100,
          handle,
        }),
      }).catch(() => {});

      sound.levelUp();
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorecard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[rgb(var(--surface))] dark:bg-zinc-950 border border-primary/40 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-muted/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 id="scorecard-title" className="text-base sm:text-lg font-bold text-ink">
              Mission Debrief &amp; Scorecard
            </h2>
          </div>
          <button
            onClick={() => {
              sound.modalClose();
              onClose();
            }}
            className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-muted transition"
            aria-label="Close debrief"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Top Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-muted/40 border border-line">
              <span className="block text-[11px] font-mono text-ink-3 uppercase">Score</span>
              <span className="text-lg font-extrabold text-primary">{data.score.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-line">
              <span className="block text-[11px] font-mono text-ink-3 uppercase">Accuracy</span>
              <span className="text-lg font-extrabold text-emerald-500">{data.accuracyPct}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-line">
              <span className="block text-[11px] font-mono text-ink-3 uppercase">Time</span>
              <span className="text-lg font-extrabold text-sky-400">{formatTimeSeconds(data.timeTakenSeconds)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/40 border border-line">
              <span className="block text-[11px] font-mono text-ink-3 uppercase">XP Award</span>
              <span className="text-lg font-extrabold text-amber-500">+{data.xpEarned} XP</span>
            </div>
          </div>

          {/* Player Handle Input & Format Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-line">
            <div className="flex items-center gap-2 flex-1">
              <label htmlFor="card-handle" className="text-xs font-mono text-ink-2 whitespace-nowrap">
                Callsign:
              </label>
              <input
                id="card-handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                maxLength={24}
                className="w-full px-2.5 py-1 text-sm font-mono rounded-lg bg-surface border border-line text-ink focus:outline-none focus:border-primary"
                placeholder="operative_handle"
              />
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto" role="group" aria-label="Aspect Ratio">
              <button
                type="button"
                onClick={() => {
                  sound.toggleSwitch();
                  setAspectRatio("landscape");
                }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                  aspectRatio === "landscape"
                    ? "bg-primary text-white font-bold"
                    : "text-ink-3 hover:text-ink hover:bg-muted"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> 1200×630
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.toggleSwitch();
                  setAspectRatio("portrait");
                }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-mono transition ${
                  aspectRatio === "portrait"
                    ? "bg-primary text-white font-bold"
                    : "text-ink-3 hover:text-ink hover:bg-muted"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> 1080×1350
              </button>
            </div>
          </div>

          {/* Rendered Canvas Preview */}
          <div
            ref={previewContainerRef}
            className="flex items-center justify-center p-2 rounded-xl bg-black/40 border border-line/60 overflow-hidden min-h-[220px]"
            aria-label="Scorecard Image Preview"
          />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-primary text-white font-medium text-xs hover:bg-primary-hover shadow-md transition"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={handleCopyImage}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-muted/80 hover:bg-muted text-ink font-medium text-xs border border-line transition"
            >
              {copiedImage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copiedImage ? "Copied!" : "Copy Image"}
            </button>
            <button
              onClick={() => {
                sound.click();
                setIsShareModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium text-xs transition"
            >
              <Link2 className="w-4 h-4 text-blue-400" /> Share (24h)
            </button>
            <button
              onClick={handleShareText}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-muted/80 hover:bg-muted text-ink font-medium text-xs border border-line transition"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              {copiedText ? "Copied!" : "Challenge"}
            </button>
          </div>

          {/* Secondary Row: Submit & Play Again */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-line">
            <button
              onClick={handleSubmitScore}
              disabled={submitted || isSubmitting}
              className={`flex items-center gap-2 text-xs font-mono py-1.5 px-3 rounded-lg border transition ${
                submitted
                  ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10 cursor-default"
                  : "border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {submitted ? "Saved to Global Leaderboard (+100 XP)" : "Save to Global Leaderboard (+100 XP)"}
            </button>

            {onPlayAgain && (
              <button
                onClick={() => {
                  sound.click();
                  onPlayAgain();
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-ink-2 hover:text-ink transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Play Again
              </button>
            )}
          </div>
        </div>
      </div>

      <ShareContentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        toolSlug={`arcade-${data.gameId}`}
        toolName={`Arcade Victory Pass: ${data.gameTitle}`}
        payload={{
          gameId: data.gameId,
          gameTitle: data.gameTitle,
          score: data.score,
          playerHandle: handle,
          rankTier: data.rankTier,
          accuracyPct: data.accuracyPct,
          timestamp: Date.now(),
        }}
        defaultTitle={`${data.gameTitle} Scorecard (${data.score.toLocaleString()} PTS)`}
      />
    </div>
  );
}
