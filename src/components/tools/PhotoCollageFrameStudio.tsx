"use client";

import React, { useState, useRef } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Grid,
  Heart,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";

export function PhotoCollageFrameStudio() {
  const [frameType, setFrameType] = useState<"bd_flag" | "baishakh" | "eid" | "minimal" | "none">("bd_flag");
  const [gridCount, setGridCount] = useState<2 | 3 | 4>(2);
  const [caption, setCaption] = useState("মহান বিজয় দিবস ২০২৬ — দ্য সাব্বির ওএস");
  const [accentColor, setAccentColor] = useState("#006A4E"); // BD Bottle Green
  const [collageDataUrl, setCollageDataUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerateCollage = () => {
    sound.click();
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Canvas
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, 1080, 1080);

    // Frame Elements
    if (frameType === "bd_flag") {
      // Bottle Green & Red Circle Frame
      ctx.fillStyle = "#006A4E";
      ctx.fillRect(40, 40, 1000, 1000);

      // Red Circle Accent
      ctx.fillStyle = "#F42A41";
      ctx.beginPath();
      ctx.arc(540, 500, 220, 0, Math.PI * 2);
      ctx.fill();

      // Inner Photo Cutout Frame
      ctx.fillStyle = "#121217";
      ctx.roundRect ? ctx.roundRect(100, 100, 880, 800, 24) : ctx.fillRect(100, 100, 880, 800);
      ctx.fill();
    } else if (frameType === "baishakh") {
      // Red and Yellow festive pattern
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(40, 40, 1000, 1000);
      ctx.fillStyle = "#EF4444";
      ctx.fillRect(60, 60, 960, 960);
      ctx.fillStyle = "#18181B";
      ctx.fillRect(100, 100, 880, 800);
    } else {
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 12;
      ctx.strokeRect(60, 60, 960, 960);
    }

    // Photo Grid Simulator Cells
    if (gridCount === 2) {
      ctx.fillStyle = "#27272A";
      ctx.fillRect(140, 160, 380, 660);
      ctx.fillRect(560, 160, 380, 660);

      ctx.fillStyle = "#71717A";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ছবি ১ (Photo 1)", 330, 500);
      ctx.fillText("ছবি ২ (Photo 2)", 750, 500);
    } else if (gridCount === 4) {
      ctx.fillStyle = "#27272A";
      ctx.fillRect(140, 160, 380, 310);
      ctx.fillRect(560, 160, 380, 310);
      ctx.fillRect(140, 510, 380, 310);
      ctx.fillRect(560, 510, 380, 310);

      ctx.fillStyle = "#71717A";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ফটো ১", 330, 320);
      ctx.fillText("ফটো ২", 750, 320);
      ctx.fillText("ফটো ৩", 330, 670);
      ctx.fillText("ফটো ৪", 750, 670);
    } else {
      ctx.fillStyle = "#27272A";
      ctx.fillRect(140, 160, 800, 310);
      ctx.fillRect(140, 510, 380, 310);
      ctx.fillRect(560, 510, 380, 310);
    }

    // Bottom Caption Strip
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 38px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(caption, 540, 960);

    // Watermark
    ctx.fillStyle = "#A1A1AA";
    ctx.font = "18px monospace";
    ctx.fillText("THE SABBiR OS · sabbir.nav.bd", 540, 1005);

    const url = canvas.toDataURL("image/png");
    setCollageDataUrl(url);
    sound.complete();
  };

  const handleLoadSample = () => {
    sound.click();
    setFrameType("bd_flag");
    setGridCount(2);
    setCaption("শুভ নববর্ষ ও বিজয় উৎসব ২০২৬");
    setTimeout(handleGenerateCollage, 50);
  };

  const exportPayload = {
    frameType,
    gridCount,
    caption,
    accentColor,
    dimensions: "1080x1080 PNG",
  };

  return (
    <StudioWorkspaceShell
      toolSlug="photo-collage-frame-studio"
      toolTitle="Multi-Photo Collage & BD Festival Frame Studio"
      category="Media & Studio"
      exportPayload={exportPayload}
      previewDataUrl={collageDataUrl || undefined}
      summaryHighlights={[
        { label: "Frame Type", value: frameType.toUpperCase() },
        { label: "Photo Grid", value: `${gridCount} Cells` },
        { label: "Resolution", value: "1080×1080 1:1" },
        { label: "Format", value: "Lossless PNG" },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">ফ্রেম থিম সিলেক্ট করুন</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "bd_flag", label: "🇧🇩 জাতীয় পতাকা ফ্রেম" },
                { id: "baishakh", label: "🏮 পহেলা বৈশাখ লাল-হলুদ" },
                { id: "eid", label: "🌙 ঈদ মোবারক গোল্ডেন" },
                { id: "minimal", label: "✨ মিনিমাল গোল্ড বর্ডার" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFrameType(f.id as any);
                    sound.click();
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                    frameType === f.id
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">কলাজ লেআউট (ছবির সংখ্যা)</label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setGridCount(n as any);
                    sound.click();
                  }}
                  className={`py-2 text-xs font-mono font-bold rounded-xl border ${
                    gridCount === n
                      ? "bg-amber-500 text-neutral-950 border-amber-500"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800"
                  }`}
                >
                  {n} Photos Grid
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">ক্যাপশন / শুভেচ্ছা বার্তা</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateCollage}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>১০৮০x১০৮০ কলাজ জেনারেট করুন</span>
          </button>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          <canvas ref={canvasRef} className="hidden" />
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-4 text-center space-y-4">
            {collageDataUrl ? (
              <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                <img src={collageDataUrl} alt={caption} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="py-24 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                  <Grid className="w-6 h-6" />
                </div>
                <p className="text-xs text-neutral-400">বাম পাশের বাটন চাপুন অথবা ডেমো লোড করুন।</p>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
