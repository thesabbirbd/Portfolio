"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  Upload,
  Download,
  RotateCw,
  ZoomIn,
  Move,
  Layers,
  Sparkles,
  Printer,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  GOV_PHOTO_PRESETS,
  PhotoPreset,
  compressCanvasToTargetSize,
  generate4RPrintableSheet,
  getDemoPassportPhotoUrl,
} from "@/lib/vision/gov-photo-engine";

export function GovPhotoSizerStudio() {
  const [selectedPreset, setSelectedPreset] = useState<PhotoPreset>(GOV_PHOTO_PRESETS[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [bgTint, setBgTint] = useState<string>("#FFFFFF");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showFaceGuide, setShowFaceGuide] = useState(true);
  const [is4RSheetMode, setIs4RSheetMode] = useState(false);
  const [compressedSizeBytes, setCompressedSizeBytes] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "gov-photo-sizer",
    toolName: "BCS & Visa Photo Sizer",
  });

  // Load initial demo
  useEffect(() => {
    loadImage(getDemoPassportPhotoUrl());
  }, []);

  const loadImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageSrc(src);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      renderCanvas();
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

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    canvas.width = selectedPreset.width;
    canvas.height = selectedPreset.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background tint
    ctx.fillStyle = bgTint;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Center transformation
    ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    const imgAspect = img.width / img.height;
    const targetAspect = canvas.width / canvas.height;
    let drawW = canvas.width;
    let drawH = canvas.height;

    if (imgAspect > targetAspect) {
      drawH = canvas.height;
      drawW = drawH * imgAspect;
    } else {
      drawW = canvas.width;
      drawH = drawW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Check compressed size preview
    const { sizeBytes } = await compressCanvasToTargetSize(canvas, selectedPreset.maxSizeBytes);
    setCompressedSizeBytes(sizeBytes);
  }, [selectedPreset, bgTint, zoom, panX, panY, rotation]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Drag/Pan on Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleExport = async () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas) return;

    triggerGatedExport(async () => {
      let exportCanvas = sourceCanvas;
      let filename = `${selectedPreset.id}-${selectedPreset.width}x${selectedPreset.height}.jpg`;

      if (is4RSheetMode) {
        exportCanvas = generate4RPrintableSheet(sourceCanvas);
        filename = `${selectedPreset.id}-4R-printable-sheet-8photos.jpg`;
      }

      const { blob } = await compressCanvasToTargetSize(
        exportCanvas,
        is4RSheetMode ? 1024 * 1024 : selectedPreset.maxSizeBytes
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="gov-photo-sizer"
        toolName="BCS & Visa Photo Sizer"
        category="Media & Studio"
        onExportClick={handleExport}
      />

      {/* Preset Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {GOV_PHOTO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              sound.click();
              setSelectedPreset(preset);
              setBgTint(preset.recommendedBg);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
              selectedPreset.id === preset.id
                ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold"
                : "bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            <span>{preset.name}</span>
            <span className="block text-[10px] opacity-80 font-mono mt-0.5">
              {preset.width}×{preset.height} px
            </span>
          </button>
        ))}
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 relative overflow-hidden shadow-2xl min-h-[460px]">
          {/* Canvas Wrapper */}
          <div
            className="relative cursor-grab active:cursor-grabbing border-2 border-dashed border-amber-500/30 rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: `${Math.min(selectedPreset.width, 360)}px`,
              height: `${Math.min(selectedPreset.height, 360)}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Biometric Face Alignment Oval Guide */}
            {showFaceGuide && selectedPreset.aspectRatio < 2 && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[58%] h-[68%] rounded-[50%] border-2 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex flex-col items-center justify-between py-3">
                  <span className="text-[9px] font-mono text-amber-300 bg-neutral-950/80 px-1 rounded">
                    Crown Top
                  </span>
                  <div className="w-full border-t border-dashed border-amber-400/30" />
                  <span className="text-[9px] font-mono text-amber-300 bg-neutral-950/80 px-1 rounded">
                    Chin Baseline
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guidance Info Pill */}
          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span>Dimensions: {selectedPreset.width}×{selectedPreset.height} px</span>
            <span>•</span>
            <span
              className={
                compressedSizeBytes <= selectedPreset.maxSizeBytes
                  ? "text-emerald-400 font-bold"
                  : "text-rose-400 font-bold"
              }
            >
              Output: {(compressedSizeBytes / 1024).toFixed(1)} KB / Max{" "}
              {selectedPreset.maxSizeBytes / 1024} KB
            </span>
          </div>
        </div>

        {/* Right Inspector Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>Studio Adjustments</span>
              <button
                type="button"
                onClick={() => loadImage(getDemoPassportPhotoUrl())}
                className="text-[11px] text-amber-400 hover:underline font-mono"
              >
                ⚡ Load Sample
              </button>
            </h3>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500/50 bg-neutral-950/40 text-neutral-300 hover:text-white cursor-pointer text-xs font-semibold transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Background Tint */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                Official Background Fill:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "White", color: "#FFFFFF" },
                  { label: "Ice Blue", color: "#E0F2FE" },
                  { label: "Formal Gray", color: "#F1F5F9" },
                ].map((tint) => (
                  <button
                    key={tint.color}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setBgTint(tint.color);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 ${
                      bgTint === tint.color
                        ? "border-amber-400 bg-neutral-800 text-white"
                        : "border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-600"
                      style={{ backgroundColor: tint.color }}
                    />
                    <span>{tint.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Zoom & Rotate */}
            <div className="space-y-3 pt-2 border-t border-neutral-800/80">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>Zoom / Scale:</span>
                  <span>{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>Rotate:</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-neutral-800/80">
              <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                <span>Show Biometric Oval Guide</span>
                <input
                  type="checkbox"
                  checked={showFaceGuide}
                  onChange={(e) => setShowFaceGuide(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                <span>4R Printable Sheet (8 Photos)</span>
                <input
                  type="checkbox"
                  checked={is4RSheetMode}
                  onChange={(e) => {
                    sound.toggleSwitch();
                    setIs4RSheetMode(e.target.checked);
                  }}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
              </label>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              className="w-full py-3 rounded-2xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>
                {is4RSheetMode ? "Download 4R 8-Photo Sheet" : "Download Verified JPG"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
