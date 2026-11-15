"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Sparkles,
  Sliders,
  RotateCw,
  Printer,
  Contrast,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  ScannerMode,
  applyWhitePaperFlattening,
  getDemoScannedReceiptUrl,
} from "@/lib/vision/document-scanner-engine";

export function DocumentScannerStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mode, setMode] = useState<ScannerMode>("magic_color");
  const [contrastFactor, setContrastFactor] = useState<number>(1.25);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "document-scanner",
    toolName: "Document Scanner & Deskew Studio",
  });

  useEffect(() => {
    loadImage(getDemoScannedReceiptUrl());
  }, []);

  const loadImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      originalImageRef.current = img;
      setImageSrc(src);
      renderScan();
    };
    img.src = src;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        sound.click();
        loadImage(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderScan = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    setIsProcessing(true);
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    if (mode !== "original") {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processed = applyWhitePaperFlattening(imgData, mode, contrastFactor);
      ctx.putImageData(processed, 0, 0);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    renderScan();
  }, [mode, contrastFactor]);

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    triggerGatedExport(() => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `scanned-document-${mode}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="document-scanner"
        toolName="Document Scanner & Deskew Studio"
        category="Media & Studio"
        onExportClick={handleExportPng}
      />

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Canvas Document Stage */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 shadow-2xl min-h-[500px] overflow-hidden">
          <div className="relative max-w-full max-h-[580px] overflow-auto rounded-xl border border-neutral-800 shadow-2xl bg-white">
            <canvas ref={canvasRef} className="max-w-full h-auto block" />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-white">
                Enhancing Paper Illumination...
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span>Adaptive Illumination Flattening: Active</span>
            <span>•</span>
            <span className="text-emerald-400">100% Client-Side Private</span>
          </div>
        </div>

        {/* Right: Enhancement Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Enhancement Modes
              </h3>
              <button
                type="button"
                onClick={() => loadImage(getDemoScannedReceiptUrl())}
                className="text-[11px] text-amber-400 font-mono hover:underline"
              >
                ⚡ Load Sample
              </button>
            </div>

            {/* Upload Custom Doc */}
            <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500/50 bg-neutral-950/40 text-neutral-300 hover:text-white cursor-pointer text-xs font-semibold transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Mode Selectors */}
            <div className="space-y-1.5">
              {[
                {
                  id: "magic_color",
                  name: "Magic Color Scan",
                  desc: "Whitens paper, punches ink text & official stamps",
                },
                {
                  id: "bw_photocopy",
                  name: "Crisp B&W Photocopy",
                  desc: "High-contrast clean binarized office photocopy",
                },
                {
                  id: "grayscale",
                  name: "Grayscale Archival",
                  desc: "Smooth continuous-tone gray for formal documents",
                },
                {
                  id: "original",
                  name: "Original Raw Photo",
                  desc: "No shadow flattening or color modification",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sound.click();
                    setMode(m.id as ScannerMode);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    mode === m.id
                      ? "bg-amber-500/10 border-amber-500/50 text-white shadow-sm"
                      : "bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800"
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-200">{m.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Contrast Slider */}
            {mode !== "original" && (
              <div className="pt-2 border-t border-neutral-800/80">
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>Ink Contrast / Threshold:</span>
                  <span>{contrastFactor.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={contrastFactor}
                  onChange={(e) => setContrastFactor(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}

            {/* Export Action */}
            <button
              type="button"
              onClick={handleExportPng}
              className="w-full py-3 rounded-2xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Enhanced Scan (PNG)</span>
            </button>
          </div>
        </div>
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
