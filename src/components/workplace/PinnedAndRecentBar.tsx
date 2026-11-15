"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Clock, Sparkles } from "lucide-react";
import { getPinnedTools, getRecentTools } from "@/lib/workplace/favorites-and-recents";
import { sound } from "@/lib/sound";

const TOOL_NAMES: Record<string, string> = {
  "gov-photo-sizer": "BCS & Visa Sizer",
  "remittance-calculator": "2.5% Remittance",
  "email-signature": "HTML Signature",
  "quick-reply-hub": "Smart Quick Reply",
  "unit-land-converter": "Land & Gold Vori",
  "document-scanner": "Document Scanner",
  "typing-speed-arena": "Typing WPM Arena",
  "color-design-lab": "Color & WCAG Lab",
  "image-editor": "Pro Image Editor",
  "story-maker": "Social Story Maker",
  "audio-editor": "Audio DAW Studio",
  "video-clipper": "Video Clipper",
  "spreadsheet-grid": "Khata Spreadsheet",
  "slide-deck": "Slide Deck Studio",
  "screen-recorder": "Screen Recorder",
  "qr-link-bio": "vCard & QR Standee",
  "bg-remover": "Background Remover",
  "invoice-maker": "Invoice Maker",
  "khata-scanner": "Khata OCR Scanner",
  "pdf-redactor": "PDF Redactor",
  "product-studio": "Product Studio",
  "cheque-audit": "Bank Cheque Audit",
  "daraz-listing-ai": "Daraz SEO Optimizer",
  "cron-english": "Cron Explainer",
  "barcode-studio": "Barcode Studio",
};

export function PinnedAndRecentBar() {
  const [pinned, setPinned] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    setPinned(getPinnedTools());
    setRecents(getRecentTools());

    const onFavChange = () => setPinned(getPinnedTools());
    const onRecentChange = () => setRecents(getRecentTools());

    window.addEventListener("sabbir_os_favorites_changed", onFavChange);
    window.addEventListener("sabbir_os_recents_changed", onRecentChange);

    return () => {
      window.removeEventListener("sabbir_os_favorites_changed", onFavChange);
      window.removeEventListener("sabbir_os_recents_changed", onRecentChange);
    };
  }, []);

  if (pinned.length === 0 && recents.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md text-xs mb-6 shadow-sm">
      {/* Pinned section */}
      {pinned.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 pl-1 pr-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Pinned:</span>
          </div>
          {pinned.map((slug) => (
            <Link
              key={`pin-${slug}`}
              href={`/tools/${slug}`}
              onClick={() => sound.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-amber-500/20 hover:border-amber-500/50 transition-all font-medium text-[11px]"
            >
              <span>{TOOL_NAMES[slug] || slug}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Divider if both exist */}
      {pinned.length > 0 && recents.length > 0 && (
        <div className="hidden sm:block w-px h-4 bg-neutral-800 mx-1" />
      )}

      {/* Recents section */}
      {recents.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 pl-1 pr-1.5">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span className="hidden sm:inline">Recent:</span>
          </div>
          {recents.slice(0, 4).map((slug) => (
            <Link
              key={`recent-${slug}`}
              href={`/tools/${slug}`}
              onClick={() => sound.click()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all text-[11px]"
            >
              <span>{TOOL_NAMES[slug] || slug}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
