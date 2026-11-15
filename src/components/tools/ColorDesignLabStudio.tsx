"use client";

import React, { useState } from "react";
import {
  Palette,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  Eye,
  Sliders,
  Layers,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  generateTailwindScale,
  calculateContrastRatio,
  evaluateWcagCompliance,
  ShadeStop,
} from "@/lib/design/color-lab-engine";

export function ColorDesignLabStudio() {
  const [baseColor, setBaseColor] = useState("#F59E0B"); // Amber Gold default
  const [copiedStop, setCopiedStop] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const scale = generateTailwindScale(baseColor);
  const baseContrastWhite = calculateContrastRatio(baseColor, "#FFFFFF");
  const baseContrastBlack = calculateContrastRatio(baseColor, "#000000");
  const ratingWhite = evaluateWcagCompliance(baseContrastWhite);
  const ratingBlack = evaluateWcagCompliance(baseContrastBlack);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "color-design-lab",
    toolName: "Color Design Lab & WCAG Matrix",
  });

  const handleCopyHex = (stop: number, hex: string) => {
    navigator.clipboard.writeText(hex);
    sound.confirm();
    setCopiedStop(stop);
    setTimeout(() => setCopiedStop(null), 1500);
  };

  const generateCssVariables = (): string => {
    let css = `@theme {\n`;
    scale.forEach((s) => {
      css += `  --color-brand-${s.stop}: ${s.hex};\n`;
    });
    css += `}\n\n/* Pure CSS :root tokens */\n:root {\n`;
    scale.forEach((s) => {
      css += `  --brand-${s.stop}: ${s.hex};\n`;
    });
    css += `}\n`;
    return css;
  };

  const handleExportTokens = () => {
    triggerGatedExport(() => {
      const code = generateCssVariables();
      const blob = new Blob([code], { type: "text/css;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `brand-colors-tailwind-v4.css`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="color-design-lab"
        toolName="Color Design Lab & WCAG Matrix"
        category="Media & Studio"
        onExportClick={handleExportTokens}
      />

      {/* Top Header & Picker Bar */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Tailwind CSS v4 &amp; WCAG 2.1 Compliant
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Perceptual Palette &amp; Accessibility Contrast Studio
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl">
            Input any brand hex color. Generate smooth 50–950 shade stops, verify accessibility
            contrast ratios against white and black text, and export design tokens.
          </p>
        </div>

        {/* Color Picker Input & Presets */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            {[
              { label: "SABBiR Amber", hex: "#F59E0B" },
              { label: "Emerald", hex: "#10B981" },
              { label: "Violet", hex: "#8B5CF6" },
              { label: "Sky", hex: "#0EA5E9" },
            ].map((p) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => {
                  sound.click();
                  setBaseColor(p.hex);
                }}
                className="w-7 h-7 rounded-xl border border-neutral-700/80 transition-transform hover:scale-110"
                style={{ backgroundColor: p.hex }}
                title={`${p.label} (${p.hex})`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 bg-neutral-950 p-2 rounded-2xl border border-neutral-800 shrink-0">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
              className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border-none"
            />
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">Base Hex</span>
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                className="w-24 bg-transparent text-sm font-bold text-white font-mono outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 50–950 Tailwind Scale Swatches */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          Generated Tailwind v4 Palette Stops (50–950)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
          {scale.map((s) => {
            const isBase = s.stop === 500;
            const isCopied = copiedStop === s.stop;
            return (
              <button
                key={s.stop}
                type="button"
                onClick={() => handleCopyHex(s.stop, s.hex)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 relative group ${
                  isBase ? "ring-2 ring-amber-400 shadow-lg" : "border-neutral-800"
                }`}
                style={{ backgroundColor: s.hex }}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="text-xs font-bold font-mono px-1.5 py-0.5 rounded backdrop-blur-sm"
                    style={{
                      backgroundColor: s.contrastOnBlack > 4.5 ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                      color: s.contrastOnBlack > 4.5 ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {s.stop}
                  </span>
                  {isBase && (
                    <span className="text-[9px] font-mono font-bold bg-neutral-950 text-amber-400 px-1 rounded">
                      BASE
                    </span>
                  )}
                </div>

                <div
                  className="text-[11px] font-mono font-bold"
                  style={{ color: s.contrastOnBlack > 4.5 ? "#FFFFFF" : "#000000" }}
                >
                  {isCopied ? "Copied! ✓" : s.hex}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WCAG Contrast Ratings & Live UI Component Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: WCAG Compliance Matrix */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WCAG 2.1 Contrast Matrix (Base Color)</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* On White */}
            <div className="p-4 rounded-2xl bg-white text-neutral-900 space-y-2 border border-neutral-200">
              <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
                Contrast on White (#FFFFFF)
              </span>
              <div className="text-2xl font-bold font-mono">{baseContrastWhite}:1</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>AA Normal (≥4.5):</span>
                  <span className={ratingWhite.aaNormal ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {ratingWhite.aaNormal ? "PASS ✓" : "FAIL ✕"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AA Large (≥3.0):</span>
                  <span className={ratingWhite.aaLarge ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {ratingWhite.aaLarge ? "PASS ✓" : "FAIL ✕"}
                  </span>
                </div>
              </div>
            </div>

            {/* On Black */}
            <div className="p-4 rounded-2xl bg-neutral-950 text-white space-y-2 border border-neutral-800">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                Contrast on Black (#000000)
              </span>
              <div className="text-2xl font-bold font-mono">{baseContrastBlack}:1</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span>AA Normal (≥4.5):</span>
                  <span className={ratingBlack.aaNormal ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {ratingBlack.aaNormal ? "PASS ✓" : "FAIL ✕"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AA Large (≥3.0):</span>
                  <span className={ratingBlack.aaLarge ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {ratingBlack.aaLarge ? "PASS ✓" : "FAIL ✕"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Component Sandbox */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Live Component Preview
            </span>
            <button
              type="button"
              onClick={handleExportTokens}
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export @theme CSS</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            {/* Primary Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                style={{
                  backgroundColor: baseColor,
                  color: baseContrastBlack > 4.5 ? "#000000" : "#FFFFFF",
                }}
              >
                Primary Solid Button
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                style={{
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: "transparent",
                }}
              >
                Outline Button
              </button>

              <span
                className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
                style={{
                  backgroundColor: `${baseColor}20`,
                  color: baseColor,
                }}
              >
                Active Badge
              </span>
            </div>

            {/* Glass Card */}
            <div
              className="p-4 rounded-xl border backdrop-blur-md"
              style={{
                borderColor: `${baseColor}40`,
                backgroundColor: `${baseColor}0D`,
              }}
            >
              <h4 className="text-sm font-bold" style={{ color: baseColor }}>
                Glassmorphism Container Card
              </h4>
              <p className="text-xs text-neutral-300 mt-1">
                Subtle tint blending your brand accent with dark backdrop mode.
              </p>
            </div>
          </div>
        </div>
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
