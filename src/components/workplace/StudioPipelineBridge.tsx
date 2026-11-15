"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { sound } from "@/lib/sound";

interface PipelineRoute {
  slug: string;
  name: string;
  description: string;
}

const PIPELINE_MAP: Record<string, PipelineRoute[]> = {
  "bg-remover": [
    { slug: "product-studio", name: "Product Studio", description: "Add studio lighting & realistic drop shadows" },
    { slug: "story-maker", name: "Story & Poster Maker", description: "Place cut-out on 9:16 Instagram/TikTok story" },
    { slug: "gov-photo-sizer", name: "BCS & Passport Sizer", description: "Convert to 300×300 white backdrop photo" },
  ],
  "document-scanner": [
    { slug: "pdf-redactor", name: "PDF Redactor", description: "Black out sensitive NID or bank account digits" },
    { slug: "khata-scanner", name: "Khata OCR Scanner", description: "Extract handwritten ledger items into tabular data" },
    { slug: "pdf-toolkit", name: "PDF Toolkit", description: "Merge multi-page scans into an optimized PDF" },
  ],
  "image-editor": [
    { slug: "gov-photo-sizer", name: "BCS & Visa Sizer", description: "Crop to exact government job specifications" },
    { slug: "image-compressor", name: "Image Compressor", description: "Target <100 KB WebP or JPG file size" },
    { slug: "story-maker", name: "Story & Reel Cover", description: "Use as background for high-contrast social typography" },
  ],
  "audio-editor": [
    { slug: "video-clipper", name: "Video Clipper", description: "Synchronize mastered audio with video footage" },
    { slug: "voice-notes", name: "Voice Transcriber", description: "Transcribe clean speech into Bangla text" },
  ],
  "spreadsheet-grid": [
    { slug: "slide-deck", name: "Presentation Slide Deck", description: "Turn grid summary rows into executive slides" },
    { slug: "invoice-maker", name: "SME Invoice Maker", description: "Generate printable billing invoice with QR code" },
  ],
  "unit-land-converter": [
    { slug: "spreadsheet-grid", name: "Khata Spreadsheet", description: "Log multiple land plots and totals in a grid" },
    { slug: "document-scanner", name: "Deed & Document Scanner", description: "Scan paper dalil / registry documents cleanly" },
  ],
  "remittance-calculator": [
    { slug: "spreadsheet-grid", name: "Earnings Grid", description: "Track annual foreign income and 2.5% incentives" },
    { slug: "invoice-maker", name: "Freelance Invoice", description: "Bill international clients via Payoneer or Wise" },
  ],
  "email-signature": [
    { slug: "qr-link-bio", name: "vCard & Desk Standee", description: "Create matching QR contact card for your desk" },
    { slug: "quick-reply-hub", name: "Quick Reply Macros", description: "Save canned replies with your signature link" },
  ],
};

const DEFAULT_ROUTES: PipelineRoute[] = [
  { slug: "image-editor", name: "Pro Image Editor", description: "Crop and adjust visual assets" },
  { slug: "story-maker", name: "Story Maker", description: "Design social posters and covers" },
  { slug: "pdf-toolkit", name: "PDF Toolkit", description: "Combine, split, and optimize documents" },
];

interface StudioPipelineBridgeProps {
  currentSlug: string;
}

export function StudioPipelineBridge({ currentSlug }: StudioPipelineBridgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const nextRoutes = PIPELINE_MAP[currentSlug] || DEFAULT_ROUTES;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => {
          sound.click();
          setIsOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900/90 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-sm shadow-amber-500/10"
        title="Send current workflow output directly to another studio"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>⚡ Send Output To...</span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-950/95 border border-neutral-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1.5 border-b border-neutral-800/80 mb-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Cross-Studio Pipeline
              </p>
              <p className="text-xs text-neutral-300 font-medium">Continue in companion tool:</p>
            </div>
            <div className="space-y-1">
              {nextRoutes.map((route) => (
                <a
                  key={route.slug}
                  href={`/tools/${route.slug}`}
                  onClick={() => {
                    sound.navigate();
                    setIsOpen(false);
                  }}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all group"
                >
                  <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors">
                      {route.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {route.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
