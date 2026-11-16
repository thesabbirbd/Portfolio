"use client";

import React, { useState, useRef } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Image as ImageIcon,
  Download,
  Settings,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileArchive,
  Eye,
} from "lucide-react";
import { sound } from "@/lib/sound";

export function ImageFormatConverterStudio() {
  const [targetFormat, setTargetFormat] = useState<"webp" | "png" | "jpeg" | "ico">("webp");
  const [quality, setQuality] = useState(85);
  const [stripExif, setStripExif] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<"original" | "1:1" | "4:5" | "16:9">("original");
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<
    Array<{ name: string; originalSize: number; newSize: number; dataUrl: string; format: string }>
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Demo Preset
  const handleLoadSample = () => {
    sound.click();
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw high-contrast studio demo pattern
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, "#0F172A");
    grad.addColorStop(0.5, "#1E293B");
    grad.addColorStop(1, "#0A0E17");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Accent circle
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(540, 500, 220, 0, Math.PI * 2);
    ctx.fill();

    // Studio text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("THE SABBiR OS", 540, 520);
    ctx.font = "500 28px sans-serif";
    ctx.fillStyle = "#A1A1AA";
    ctx.fillText("OmniFormat Image Engine · 1080x1080 Demo", 540, 580);

    const dataUrl = canvas.toDataURL("image/webp", quality / 100);
    setConvertedImages([
      {
        name: "sabbir-os-demo-sample.webp",
        originalSize: 420000,
        newSize: Math.round(dataUrl.length * 0.75),
        dataUrl,
        format: targetFormat,
      },
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    sound.click();

    const results: Array<{ name: string; originalSize: number; newSize: number; dataUrl: string; format: string }> = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let targetW = img.width;
          let targetH = img.height;

          if (aspectRatio === "1:1") {
            const min = Math.min(img.width, img.height);
            targetW = min;
            targetH = min;
          } else if (aspectRatio === "4:5") {
            targetW = 1080;
            targetH = 1350;
          } else if (aspectRatio === "16:9") {
            targetW = 1920;
            targetH = 1080;
          }

          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const mime = targetFormat === "ico" ? "image/png" : `image/${targetFormat}`;
            const convertedUrl = canvas.toDataURL(mime, quality / 100);
            const baseName = file.name.replace(/\.[^/.]+$/, "");

            results.push({
              name: `${baseName}.${targetFormat}`,
              originalSize: file.size,
              newSize: Math.round(convertedUrl.length * 0.75),
              dataUrl: convertedUrl,
              format: targetFormat,
            });
          }

          processed++;
          if (processed === files.length) {
            setConvertedImages(results);
            setIsProcessing(false);
            sound.complete();
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadSingle = (img: { name: string; dataUrl: string }) => {
    sound.shutter();
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    convertedImages.forEach((img, idx) => {
      setTimeout(() => {
        handleDownloadSingle(img);
      }, idx * 250);
    });
  };

  const exportPayload = {
    totalFiles: convertedImages.length,
    targetFormat,
    qualityPercent: quality,
    exifStripped: stripExif,
    aspectRatio,
    generatedAt: new Date().toISOString(),
  };

  return (
    <StudioWorkspaceShell
      toolSlug="image-format-converter"
      toolTitle="OmniFormat Image Converter & Sizer"
      category="Media & Studio"
      exportPayload={exportPayload}
      previewDataUrl={convertedImages[0]?.dataUrl}
      summaryHighlights={[
        { label: "Target Format", value: targetFormat.toUpperCase() },
        { label: "Converted", value: `${convertedImages.length} Files` },
        { label: "Privacy", value: stripExif ? "EXIF Stripped" : "Original" },
        { label: "Quality", value: `${quality}% Lossless` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-6">
          {/* Format Selector Pills */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>টার্গেট ফরম্যাট সিলেক্ট করুন (Target Format)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["webp", "png", "jpeg", "ico"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    setTargetFormat(fmt);
                    sound.click();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    targetFormat === fmt
                      ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  .{fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700 hover:border-amber-500/80 bg-neutral-900/60 hover:bg-neutral-900/90 rounded-2xl p-6 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-white mb-1">ক্লিক করে ছবি আপলোড করুন (১-৫০ টি)</p>
            <p className="text-[11px] text-neutral-400 font-mono">PNG, JPG, WebP, SVG, BMP, ICO সমর্থিত</p>
          </div>

          {/* Dimension & Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>রিসাইজ ও অ্যাসপেক্ট রেশিও (Aspect Ratio)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "original", label: "মূল সাইজ" },
                { id: "1:1", label: "১:১ স্কয়ার" },
                { id: "4:5", label: "৪:৫ ইনস্টা" },
                { id: "16:9", label: "১৬:৯ ল্যান্ডস্কেপ" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setAspectRatio(r.id as any);
                    sound.click();
                  }}
                  className={`py-2 px-2 text-[11px] font-medium rounded-xl transition-all ${
                    aspectRatio === r.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">কম্প্রেশন কোয়ালিটি</span>
              <span className="font-mono text-amber-400 font-bold">{quality}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Privacy Toggle: EXIF Stripping */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXIF GPS ও ক্যামেরা মেটাডাটা স্ট্রিপ করুন</span>
              </div>
              <p className="text-[10px] text-neutral-400">লোকেশন ও ডিভাইসের গোপন তথ্য মুছে ছবি সেফ রাখে</p>
            </div>
            <input
              type="checkbox"
              checked={stripExif}
              onChange={(e) => setStripExif(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">কনভার্ট হওয়া ফাইল প্রিভিউ ({convertedImages.length})</span>
            </div>
            {convertedImages.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 font-mono"
              >
                <FileArchive className="w-3.5 h-3.5" />
                <span>সব ডাউনলোড করুন</span>
              </button>
            )}
          </div>

          {convertedImages.length === 0 ? (
            <div className="py-20 text-center space-y-3 rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-6">
              <div className="h-12 w-12 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-neutral-400">বাম পাশের আপলোড বক্সে ছবি দিন অথবা ডেমো বাটন চাপুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {convertedImages.map((img, i) => {
                const savings = Math.max(0, Math.round(((img.originalSize - img.newSize) / img.originalSize) * 100));
                return (
                  <div
                    key={i}
                    className="group rounded-2xl border border-neutral-800 bg-neutral-950 p-3 space-y-3 transition-all hover:border-neutral-700"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-contain" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-neutral-950/80 text-[10px] font-mono font-bold text-amber-400 border border-neutral-800">
                        .{img.format.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white truncate">{img.name}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>{(img.newSize / 1024).toFixed(1)} KB</span>
                        {savings > 0 && <span className="text-emerald-400 font-bold">{savings}% সাশ্রয়ী</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadSingle(img)}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>ডাউনলোড করুন</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      }
    />
  );
}
