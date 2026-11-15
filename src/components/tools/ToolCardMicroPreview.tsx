"use client";

import React from "react";

interface ToolCardMicroPreviewProps {
  slug: string;
  category?: string;
}

export function ToolCardMicroPreview({ slug }: ToolCardMicroPreviewProps) {
  // Renders lightweight animated visual micro-previews per tool slug
  switch (slug) {
    case "audio-editor":
    case "voice-notes":
      return (
        <div className="flex items-end justify-center gap-0.5 h-6 w-12 px-1">
          <span className="w-1 bg-amber-400/80 rounded-full animate-[pulse_1s_ease-in-out_infinite] h-2" />
          <span className="w-1 bg-amber-400/90 rounded-full animate-[pulse_1.2s_ease-in-out_infinite] h-5" />
          <span className="w-1 bg-amber-400/80 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
          <span className="w-1 bg-amber-400/90 rounded-full animate-[pulse_1.4s_ease-in-out_infinite] h-6" />
          <span className="w-1 bg-amber-400/80 rounded-full animate-[pulse_1.1s_ease-in-out_infinite] h-4" />
        </div>
      );

    case "gov-photo-sizer":
    case "bg-remover":
    case "image-editor":
      return (
        <div className="relative w-8 h-8 rounded border border-dashed border-amber-400/60 flex items-center justify-center p-1">
          <div className="w-4 h-5 rounded-full border border-amber-400/80 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-400/40" />
          </div>
          <span className="absolute -top-1 -right-1 text-[8px] font-mono font-bold text-amber-400 bg-neutral-900 px-0.5 rounded">
            300
          </span>
        </div>
      );

    case "spreadsheet-grid":
    case "khata-scanner":
      return (
        <div className="grid grid-cols-2 gap-0.5 w-8 h-6 p-0.5 rounded bg-neutral-800/60 border border-neutral-700">
          <div className="bg-amber-400/40 rounded-sm" />
          <div className="bg-neutral-600/40 rounded-sm" />
          <div className="bg-neutral-600/40 rounded-sm" />
          <div className="bg-amber-400/60 rounded-sm" />
        </div>
      );

    case "barcode-studio":
    case "qr-link-bio":
      return (
        <div className="relative w-7 h-7 border border-neutral-700 rounded p-1 flex flex-col justify-between overflow-hidden">
          <div className="w-full h-0.5 bg-neutral-400" />
          <div className="w-3/4 h-0.5 bg-neutral-400" />
          <div className="w-full h-0.5 bg-neutral-400" />
          <div className="absolute inset-x-0 h-0.5 bg-amber-400 animate-[bounce_2s_infinite]" />
        </div>
      );

    case "remittance-calculator":
    case "invoice-maker":
      return (
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
          <span>৳</span>
          <span className="text-[9px] text-amber-400">+2.5%</span>
        </div>
      );

    case "typing-speed-arena":
      return (
        <div className="flex items-center gap-1 font-mono text-[10px] text-amber-400">
          <span className="animate-pulse">_</span>
          <span className="text-[9px] bg-neutral-800 px-1 rounded text-neutral-300">WPM</span>
        </div>
      );

    case "color-design-lab":
      return (
        <div className="flex items-center -space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-neutral-900" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-neutral-900" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-neutral-900" />
        </div>
      );

    case "document-scanner":
      return (
        <div className="w-6 h-7 rounded border border-neutral-600 bg-neutral-800/40 p-0.5 flex flex-col justify-between relative overflow-hidden">
          <div className="w-full h-0.5 bg-neutral-400" />
          <div className="w-2/3 h-0.5 bg-neutral-400" />
          <div className="w-4/5 h-0.5 bg-neutral-400" />
          <div className="absolute inset-0 bg-blue-500/10" />
        </div>
      );

    default:
      return null;
  }
}
