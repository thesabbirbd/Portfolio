"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Image,
  Sparkles,
  Music,
  Video,
  Table,
  Presentation,
  VideoOff,
  QrCode,
  FileText,
  Layers,
  ChevronDown,
  Trophy,
  UserCheck,
  DollarSign,
  Scale,
  ScanLine,
  Keyboard,
  Palette,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface QuickDockItem {
  slug: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  color: string;
}

const QUICK_STUDIOS: QuickDockItem[] = [
  { slug: "gov-photo-sizer", name: "Gov Photo Sizer", shortName: "BCS Photo", icon: UserCheck, tag: "300x300", color: "text-emerald-400" },
  { slug: "remittance-calculator", name: "Remittance Calc", shortName: "Remit 2.5%", icon: DollarSign, tag: "Incentive", color: "text-amber-400" },
  { slug: "unit-land-converter", name: "Land & Gold", shortName: "Land/Gold", icon: Scale, tag: "Katha/Vori", color: "text-yellow-400" },
  { slug: "document-scanner", name: "Doc Scanner", shortName: "Scanner", icon: ScanLine, tag: "Photocopy", color: "text-cyan-400" },
  { slug: "typing-speed-arena", name: "Typing Arena", shortName: "Typing", icon: Keyboard, tag: "WPM Cert", color: "text-blue-400" },
  { slug: "color-design-lab", name: "Color Lab", shortName: "Colors", icon: Palette, tag: "Tailwind v4", color: "text-pink-400" },
  { slug: "image-editor", name: "Image Editor", shortName: "Image", icon: Image, tag: "Pro 4:5", color: "text-amber-400" },
  { slug: "story-maker", name: "Story & Banner", shortName: "Story", icon: Sparkles, tag: "9:16 Social", color: "text-pink-400" },
  { slug: "audio-editor", name: "Audio DAW", shortName: "Audio", icon: Music, tag: "Waveform", color: "text-purple-400" },
  { slug: "video-clipper", name: "Video Clipper", shortName: "Clipper", icon: Video, tag: "Trim/Still", color: "text-red-400" },
  { slug: "spreadsheet-grid", name: "Spreadsheet", shortName: "Sheets", icon: Table, tag: "Khata Grid", color: "text-emerald-400" },
  { slug: "slide-deck", name: "Slide Deck", shortName: "Slides", icon: Presentation, tag: "16:9 Pitch", color: "text-blue-400" },
  { slug: "screen-recorder", name: "Screen Studio", shortName: "Record", icon: VideoOff, tag: "PiP 60fps", color: "text-cyan-400" },
  { slug: "qr-link-bio", name: "QR Standee", shortName: "Standee", icon: QrCode, tag: "vCard BD", color: "text-amber-300" },
  { slug: "pdf-toolkit", name: "PDF Toolkit", shortName: "PDF", icon: FileText, tag: "Merge/Stamp", color: "text-rose-400" },
];

export function WorkplaceQuickDock({ currentSlug }: { currentSlug?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-300">⚡ Workplace Quick-Switch Dock</span>
          <span className="hidden sm:inline text-[11px] text-neutral-500 font-mono">
            (Jump between 43 Everyday Studios)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/leaderboard"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Trophy className="w-3 h-3" />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>
          <span className="text-neutral-700">|</span>
          <Link
            href="/tools"
            onClick={() => sound.navigate()}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-300 hover:text-white transition-colors"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>All 43 Tools</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden p-1 text-neutral-400 hover:text-white rounded"
            aria-label="Toggle Quick Dock"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Dock Ribbon */}
      <div
        className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 rounded-xl border border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md ${
          isExpanded ? "flex-wrap" : "flex-nowrap"
        }`}
      >
        {QUICK_STUDIOS.map((studio) => {
          const isActive = currentSlug === studio.slug;
          const Icon = studio.icon;
          return (
            <Link
              key={studio.slug}
              href={`/tools/${studio.slug}`}
              onClick={() => sound.click()}
              className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-sm shadow-amber-500/20"
                  : "bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800/50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-neutral-950" : studio.color}`} />
              <span className="whitespace-nowrap">{studio.name}</span>
              <span
                className={`hidden md:inline text-[9px] uppercase font-mono px-1 py-0.2 rounded ${
                  isActive ? "bg-neutral-950/20 text-neutral-900" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {studio.tag}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
