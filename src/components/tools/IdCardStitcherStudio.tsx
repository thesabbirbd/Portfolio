"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  CreditCard,
  Upload,
  Download,
  Printer,
  Sparkles,
  ShieldAlert,
  RotateCw,
  FileCheck,
  Check,
  Calendar,
  Layers,
  Copy,
  Sliders,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  WATERMARK_PRESETS,
  CR80_DIMENSIONS,
  A4_DIMENSIONS,
  calculateA4CardCoordinates,
  drawSafetyWatermark,
} from "@/lib/documents/id-card-stitcher-engine";
import { sound } from "@/lib/sound";

export function IdCardStitcherStudio() {
  const [layout, setLayout] = useState<"side-by-side" | "top-to-bottom">("side-by-side");
  const [pageFormat, setPageFormat] = useState<"A4" | "card-only">("A4");
  const [watermarkText, setWatermarkText] = useState(WATERMARK_PRESETS[0].text);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.28);
  const [includeDate, setIncludeDate] = useState(true);
  const [dateStr, setDateStr] = useState(() => new Date().toLocaleDateString("en-GB"));
  const [enhanceContrast, setEnhanceContrast] = useState(true);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Card images (Data URLs or object URLs)
  const [frontImageSrc, setFrontImageSrc] = useState<string | null>(null);
  const [backImageSrc, setBackImageSrc] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frontInputRef = useRef<HTMLInputElement | null>(null);
  const backInputRef = useRef<HTMLInputElement | null>(null);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "id-card-stitcher",
    toolName: "NID & Dual-Side ID Card Smart Stitcher",
  });

  // Load Sample Authentic Demo ID Cards
  const handleLoadSampleCards = useCallback(() => {
    sound.click();

    // Create Front Mock NID Canvas
    const fCanvas = document.createElement("canvas");
    fCanvas.width = CR80_DIMENSIONS.width300Dpi;
    fCanvas.height = CR80_DIMENSIONS.height300Dpi;
    const fCtx = fCanvas.getContext("2d");
    if (fCtx) {
      fCtx.fillStyle = "#E0F2FE"; // Pale govt blue
      fCtx.fillRect(0, 0, fCanvas.width, fCanvas.height);

      fCtx.fillStyle = "#0369A1";
      fCtx.fillRect(0, 0, fCanvas.width, 100);

      fCtx.fillStyle = "#FFFFFF";
      fCtx.font = "bold 32px sans-serif";
      fCtx.fillText("গণপ্রজাতন্ত্রী বাংলাদেশ সরকার", 180, 50);
      fCtx.font = "22px sans-serif";
      fCtx.fillText("Government of the People's Republic of Bangladesh / National ID Card", 180, 85);

      // Photo placeholder
      fCtx.fillStyle = "#BAE6FD";
      fCtx.fillRect(60, 140, 240, 300);
      fCtx.strokeStyle = "#0284C7";
      fCtx.lineWidth = 4;
      fCtx.strokeRect(60, 140, 240, 300);

      fCtx.fillStyle = "#0284C7";
      fCtx.font = "bold 24px sans-serif";
      fCtx.fillText("PHOTO", 130, 300);

      // Details
      fCtx.fillStyle = "#0F172A";
      fCtx.font = "bold 26px sans-serif";
      fCtx.fillText("নাম: মোঃ তানভীর রহমান", 340, 190);
      fCtx.font = "22px sans-serif";
      fCtx.fillText("Name: MD TANVIR RAHMAN", 340, 230);
      fCtx.fillText("পিতা: মোঃ রফিকুল ইসলাম", 340, 280);
      fCtx.fillText("মাতা: মোসাঃ ফাতেমা বেগম", 340, 330);
      fCtx.fillStyle = "#DC2626";
      fCtx.font = "bold 30px monospace";
      fCtx.fillText("NID NO: 1994 2692 8410 00412", 340, 400);

      // Micro chip icon
      fCtx.fillStyle = "#F59E0B";
      fCtx.fillRect(60, 480, 120, 80);
      fCtx.strokeStyle = "#D97706";
      fCtx.strokeRect(60, 480, 120, 80);

      setFrontImageSrc(fCanvas.toDataURL("image/png"));
    }

    // Create Back Mock NID Canvas
    const bCanvas = document.createElement("canvas");
    bCanvas.width = CR80_DIMENSIONS.width300Dpi;
    bCanvas.height = CR80_DIMENSIONS.height300Dpi;
    const bCtx = bCanvas.getContext("2d");
    if (bCtx) {
      bCtx.fillStyle = "#F1F5F9";
      bCtx.fillRect(0, 0, bCanvas.width, bCanvas.height);

      bCtx.fillStyle = "#0F172A";
      bCtx.font = "bold 24px sans-serif";
      bCtx.fillText("ঠিকানা: বাসা নং-৪২, রোড নং-০৪, ব্লক-সি, ধানমন্ডি, ঢাকা-১২০৫", 60, 100);
      bCtx.font = "20px sans-serif";
      bCtx.fillText("রক্তের গ্রুপ / Blood Group: B(+) Positive", 60, 160);
      bCtx.fillText("প্রদানের তারিখ: ১২/০২/২০২২", 60, 210);

      // Barcode placeholder
      bCtx.fillStyle = "#1E293B";
      for (let x = 60; x < bCanvas.width - 60; x += 12) {
        bCtx.fillRect(x, 340, (x % 5 === 0 ? 8 : 4), 160);
      }

      setBackImageSrc(bCanvas.toDataURL("image/png"));
    }

    setActiveStep(2);
  }, []);

  // Initial load
  useEffect(() => {
    handleLoadSampleCards();
  }, [handleLoadSampleCards]);

  // Handle file uploads
  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.launch();
    const reader = new FileReader();
    reader.onload = (evt) => {
      setFrontImageSrc(evt.target?.result as string);
      setActiveStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.launch();
    const reader = new FileReader();
    reader.onload = (evt) => {
      setBackImageSrc(evt.target?.result as string);
      setActiveStep(2);
    };
    reader.readAsDataURL(file);
  };

  // Render composite canvas
  const renderComposite = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (pageFormat === "A4") {
      canvas.width = A4_DIMENSIONS.width150Dpi;
      canvas.height = A4_DIMENSIONS.height150Dpi;

      // Pure White Clean A4 Paper
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle A4 Border Guideline
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Header on A4 sheet
      ctx.fillStyle = "#64748B";
      ctx.font = "bold 14px monospace";
      ctx.fillText("NID / SMART ID CARD DUAL-SIDE PHOTOCOPY SHEET", 50, 60);
      ctx.font = "12px sans-serif";
      ctx.fillText(`মুদ্রণ প্রস্তুতকরণ: THE SABBiR OS · sabbir.nav.bd · তারিখ: ${dateStr}`, 50, 85);

      const coords = calculateA4CardCoordinates(canvas.width, canvas.height, layout);

      // Draw Front Card
      if (frontImageSrc) {
        const fImg = new Image();
        fImg.onload = () => {
          ctx.save();
          ctx.drawImage(fImg, coords.front.x, coords.front.y, coords.front.width, coords.front.height);
          ctx.strokeStyle = "#CBD5E1";
          ctx.lineWidth = 2;
          ctx.strokeRect(coords.front.x, coords.front.y, coords.front.width, coords.front.height);
          ctx.restore();

          // Apply Watermark
          drawSafetyWatermark(ctx, coords.front, watermarkText, watermarkOpacity, includeDate ? dateStr : undefined);

          // Draw Back Card after Front
          if (backImageSrc) {
            const bImg = new Image();
            bImg.onload = () => {
              ctx.save();
              ctx.drawImage(bImg, coords.back.x, coords.back.y, coords.back.width, coords.back.height);
              ctx.strokeStyle = "#CBD5E1";
              ctx.lineWidth = 2;
              ctx.strokeRect(coords.back.x, coords.back.y, coords.back.width, coords.back.height);
              ctx.restore();

              // Apply Watermark
              drawSafetyWatermark(ctx, coords.back, watermarkText, watermarkOpacity, includeDate ? dateStr : undefined);
            };
            bImg.src = backImageSrc;
          }
        };
        fImg.src = frontImageSrc;
      }
    } else {
      // Single Card mode: Stacked Front + Back
      canvas.width = CR80_DIMENSIONS.width300Dpi;
      canvas.height = CR80_DIMENSIONS.height300Dpi * 2 + 60;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fRect = { x: 0, y: 0, width: canvas.width, height: CR80_DIMENSIONS.height300Dpi };
      const bRect = { x: 0, y: CR80_DIMENSIONS.height300Dpi + 60, width: canvas.width, height: CR80_DIMENSIONS.height300Dpi };

      if (frontImageSrc) {
        const fImg = new Image();
        fImg.onload = () => {
          ctx.drawImage(fImg, fRect.x, fRect.y, fRect.width, fRect.height);
          drawSafetyWatermark(ctx, fRect, watermarkText, watermarkOpacity, includeDate ? dateStr : undefined);

          if (backImageSrc) {
            const bImg = new Image();
            bImg.onload = () => {
              ctx.drawImage(bImg, bRect.x, bRect.y, bRect.width, bRect.height);
              drawSafetyWatermark(ctx, bRect, watermarkText, watermarkOpacity, includeDate ? dateStr : undefined);
            };
            bImg.src = backImageSrc;
          }
        };
        fImg.src = frontImageSrc;
      }
    }
  }, [layout, pageFormat, frontImageSrc, backImageSrc, watermarkText, watermarkOpacity, includeDate, dateStr]);

  useEffect(() => {
    renderComposite();
  }, [renderComposite]);

  const handleDownloadPng = () => {
    triggerExport(() => {
      setActiveStep(3);
      sound.shutter();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `sabbir-nid-stitched-${pageFormat.toLowerCase()}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  return (
    <StudioWorkspaceShell
      slug="id-card-stitcher"
      title="NID & Dual-Side ID Card Smart Stitcher + Watermark"
      category="Document & Identity Engineering"
      popularityScore={99}
      lede="জাতীয় পরিচয়পত্র (NID), স্মার্ট কার্ড বা ড্রাইভিং লাইসেন্সের উভয় পিঠ এক পেজে সাজিয়ে অপব্যবহার রোধে সুরক্ষা জলছাপসহ A4 প্রিন্ট করুন।"
      activeStep={activeStep}
      getSharePayload={() => ({
        layout,
        pageFormat,
        watermarkText,
        hasFront: !!frontImageSrc,
        hasBack: !!backImageSrc,
      })}
      sampleLoaderSlot={
        <button
          onClick={handleLoadSampleCards}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>ডেমো স্মার্ট কার্ড লোড করুন</span>
        </button>
      }
      exportSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted shadow-xs"
          >
            <Printer className="h-3.5 w-3.5 text-blue-500" />
            <span>সরাসরি প্রিন্ট</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-on-primary hover:opacity-95 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>ডাউনলোড (HD PNG)</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Upload Front & Back Cards */}
            <div className="p-5 rounded-3xl border border-line bg-surface shadow-xs space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> কার্ড আপলোড (সামনে ও পেছনের পিঠ)
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Front Upload Box */}
                <div>
                  <input
                    type="file"
                    ref={frontInputRef}
                    onChange={handleFrontUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => frontInputRef.current?.click()}
                    className="w-full h-28 rounded-2xl border-2 border-dashed border-line bg-surface-well hover:border-primary/50 flex flex-col items-center justify-center p-3 text-center transition-all group"
                  >
                    <Upload className="w-5 h-5 text-ink-3 group-hover:text-primary transition-colors mb-1" />
                    <span className="text-xs font-bold text-ink">১. সামনের পিঠ</span>
                    <span className="text-[10px] text-ink-3 mt-0.5">Front Side Photo</span>
                  </button>
                </div>

                {/* Back Upload Box */}
                <div>
                  <input
                    type="file"
                    ref={backInputRef}
                    onChange={handleBackUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="w-full h-28 rounded-2xl border-2 border-dashed border-line bg-surface-well hover:border-primary/50 flex flex-col items-center justify-center p-3 text-center transition-all group"
                  >
                    <Upload className="w-5 h-5 text-ink-3 group-hover:text-primary transition-colors mb-1" />
                    <span className="text-xs font-bold text-ink">২. পেছনের পিঠ</span>
                    <span className="text-[10px] text-ink-3 mt-0.5">Back Side Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Page & Layout Settings */}
            <div className="p-5 rounded-3xl border border-line bg-surface shadow-xs space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> পেজ ও লেআউট ফরমেট
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setPageFormat("A4");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    pageFormat === "A4"
                      ? "border-primary bg-primary/10 text-ink shadow-xs"
                      : "border-line bg-surface-well text-ink-3 hover:text-ink"
                  }`}
                >
                  <div className="text-xs font-bold text-ink">📄 A4 পূর্ণাঙ্গ শিট</div>
                  <div className="text-[10px] text-ink-3 mt-0.5">ফটোকপি ও প্রিন্টের জন্য</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setPageFormat("card-only");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    pageFormat === "card-only"
                      ? "border-primary bg-primary/10 text-ink shadow-xs"
                      : "border-line bg-surface-well text-ink-3 hover:text-ink"
                  }`}
                >
                  <div className="text-xs font-bold text-ink">🪪 শুধুমাত্র কার্ড ফ্রেম</div>
                  <div className="text-[10px] text-ink-3 mt-0.5">ডিজিটাল কপি সংরক্ষণের জন্য</div>
                </button>
              </div>

              {pageFormat === "A4" && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => {
                      sound.click();
                      setLayout("side-by-side");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      layout === "side-by-side"
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-line bg-surface-well text-ink-3"
                    }`}
                  >
                    পাশাপাশি (Side-by-Side)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.click();
                      setLayout("top-to-bottom");
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      layout === "top-to-bottom"
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-line bg-surface-well text-ink-3"
                    }`}
                  >
                    উপর-নিচ (Top-to-Bottom)
                  </button>
                </div>
              )}
            </div>

            {/* 3. Safety Anti-Misuse Watermark Settings */}
            <div className="p-5 rounded-3xl border border-line bg-surface shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> অপব্যবহার রোধে সুরক্ষা জলছাপ
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">
                  Anti-Fraud Protection
                </span>
              </div>

              {/* Watermark Preset Chips */}
              <div className="flex flex-wrap gap-1.5">
                {WATERMARK_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setWatermarkText(p.text);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      watermarkText === p.text
                        ? "bg-rose-500 text-white font-bold"
                        : "border border-line bg-surface-well text-ink-3 hover:text-ink"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Watermark Input */}
              <div>
                <label className="text-xs font-semibold text-ink-2 block mb-1">
                  জলছাপের লেখা (Watermark Text):
                </label>
                <textarea
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  rows={2}
                  className="pro-textarea w-full text-xs text-ink"
                  placeholder="জলছাপের উদ্দেশ্য লিখুন..."
                />
              </div>

              {/* Include Date Toggle & Date String */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  <span>তারিখ সহ প্রিন্ট করুন</span>
                </label>
                {includeDate && (
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-28 px-2 py-1 rounded-lg border border-line bg-surface-well text-xs font-mono font-bold text-ink text-center"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Live Preview Panel (Right 7 cols, Desktop Sticky) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-3">
                  লাইভ প্রিভিউ (A4 Print Preview Canvas)
                </span>
                <span className="text-[11px] font-mono text-emerald-500 font-bold">
                  ✓ ৩টি নিরাপত্তা স্তর সক্রিয়
                </span>
              </div>

              {/* Canvas Preview Container */}
              <div className="rounded-3xl border border-line bg-[#0d1117] p-4 sm:p-6 shadow-xl flex items-center justify-center overflow-hidden min-h-[460px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-[72vh] w-auto h-auto rounded-lg shadow-2xl bg-white"
                />
              </div>

              <div className="p-4 rounded-2xl border border-line bg-surface text-xs text-ink-3 leading-relaxed flex items-start gap-2.5 shadow-xs">
                <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>নিরাপত্তা টিপস:</strong> যেকোনো ব্যাংক, সিম কোম্পানি বা বাড়িওয়ালার কাছে জাতীয় পরিচয়পত্রের ফটোকপি জমা দেওয়ার আগে এই টুলের সাহায্যে অপব্যবহার-বিরোধী ডায়াগোনাল জলছাপ যুক্ত করে নিন।
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
