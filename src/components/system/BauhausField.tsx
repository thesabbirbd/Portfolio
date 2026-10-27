import React from "react";
import { cn } from "@/lib/utils";

/**
 * Tactile Editorial backdrop: a static Bauhaus composition (quarter disc, sun, bars, dot grid,
 * hairline arc) in brand tokens. Pure SVG — no animation, no filters — so it costs nothing at
 * runtime and still reads as dimensional, crafted geometry behind the hero portrait.
 * (Gradient stops use inline style because SVG attributes cannot resolve CSS variables.)
 */
export function BauhausField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={cn("pointer-events-none select-none", className)}
      fill="none"
    >
      <defs>
        <pattern id="bh-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" className="fill-ink-3" opacity="0.35" />
        </pattern>
        <linearGradient id="bh-disc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--brand))" }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--brand-3))" }} />
        </linearGradient>
      </defs>

      {/* Dot grid block (top-left) */}
      <rect x="18" y="26" width="98" height="98" fill="url(#bh-dots)" />

      {/* Large quarter disc (bottom-left) with a clay-like inner edge */}
      <path d="M40 372 A160 160 0 0 1 200 212 L200 372 Z" fill="url(#bh-disc)" opacity="0.92" />
      <path d="M58 372 A142 142 0 0 1 200 230" className="stroke-paper" strokeWidth="2" opacity="0.35" />

      {/* Amber sun (top-right, outside the orbit-chip ring) with offset shadow disc for tactile depth */}
      <circle cx="336" cy="46" r="32" className="fill-ink" opacity="0.08" transform="translate(6 8)" />
      <circle cx="336" cy="46" r="32" className="fill-brand-2" />

      {/* Ink bars (bottom-right, below the FastAPI chip) */}
      <rect x="300" y="332" width="72" height="10" rx="5" className="fill-ink" opacity="0.85" />
      <rect x="320" y="352" width="52" height="10" rx="5" className="fill-ink" opacity="0.55" />
      <rect x="340" y="372" width="32" height="10" rx="5" className="fill-brand" />

      {/* Hairline arc tying the composition together */}
      <path d="M96 60 A230 230 0 0 1 372 214" className="stroke-ink-3" strokeWidth="1.25" strokeDasharray="3 7" opacity="0.6" />
    </svg>
  );
}
