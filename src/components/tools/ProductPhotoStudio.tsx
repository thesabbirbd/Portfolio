"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  Download,
  Sparkles,
  Sliders,
  Tag,
  Upload,
  Layers,
  Wand2,
  Check,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { processSalientCutout } from "@/lib/vision/salient-cutout-engine";

export function ProductPhotoStudio() {
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  );
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "16:9">("1:1");
  const [badgeText, setBadgeText] = useState<string>("HOT DEAL");
  const [badgeColor, setBadgeColor] = useState<string>("#e11d48");
  const [backdropTheme, setBackdropTheme] = useState<"alabaster" | "dark-slate" | "warm-cream" | "cyber-grid">("alabaster");
  const [brightness, setBrightness] = useState<number>(105);
  const [contrast, setContrast] = useState<number>(110);
  const [shadowBlur, setShadowBlur] = useState<number>(24);
  const [productTitle, setProductTitle] = useState<string>("Crimson Pro Runner");
  const [priceText, setPriceText] = useState<string>("৳ 2,450");
  const [brandTag, setBrandTag] = useState<string>("THE SABBiR VERIFIED");
  const [hasBridgedCutout, setHasBridgedCutout] = useState<boolean>(false);
  const [isAutoCutting, setIsAutoCutting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check for bridge data from BgRemoverStudio
  useEffect(() => {
    try {
      const bridged = sessionStorage.getItem("sabbir_cutout_bridge");
      if (bridged && bridged.length > 50) {
        setImageSrc(bridged);
        setHasBridgedCutout(true);
        sessionStorage.removeItem("sabbir_cutout_bridge");
      }
    } catch {
      // Ignore sessionStorage issues
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.launch();
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageSrc(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // In-studio automatic background removal
  const handleAutoCutout = () => {
    if (!imageSrc) return;
    sound.launch();
    setIsAutoCutting(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      if (!ctx) {
        setIsAutoCutting(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const raw = ctx.getImageData(0, 0, c.width, c.height);
      const res = processSalientCutout(raw, { tolerance: 35, edgeSoftness: 2 });
      ctx.putImageData(res.processedImageData, 0, 0);
      setImageSrc(c.toDataURL("image/png"));
      setIsAutoCutting(false);
      sound.levelUp();
      osStore.addXp(30, "Auto-cutout Product Photo");
    };
    img.src = imageSrc;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.shutter();
    osStore.addXp(25, "Marketplace Product Export");
    osStore.incrementToolRun();

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `product-showcase-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Render composite image on HTML5 Canvas
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 1080;
    let height = 1080;
    if (aspectRatio === "4:5") {
      height = 1350;
    } else if (aspectRatio === "16:9") {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1. Studio Backdrop
      if (backdropTheme === "alabaster") {
        ctx.fillStyle = "#fafaf9";
        ctx.fillRect(0, 0, width, height);
        const radial = ctx.createRadialGradient(
          width / 2,
          height * 0.45,
          50,
          width / 2,
          height * 0.45,
          width * 0.6
        );
        radial.addColorStop(0, "#ffffff");
        radial.addColorStop(1, "#f3f4f6");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      } else if (backdropTheme === "dark-slate") {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, width, height);
        const radial = ctx.createRadialGradient(
          width / 2,
          height * 0.45,
          50,
          width / 2,
          height * 0.45,
          width * 0.6
        );
        radial.addColorStop(0, "#1e293b");
        radial.addColorStop(1, "#020617");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      } else if (backdropTheme === "warm-cream") {
        ctx.fillStyle = "#fefce8";
        ctx.fillRect(0, 0, width, height);
        const radial = ctx.createRadialGradient(
          width / 2,
          height * 0.45,
          50,
          width / 2,
          height * 0.45,
          width * 0.6
        );
        radial.addColorStop(0, "#fffbeb");
        radial.addColorStop(1, "#fef3c7");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
      } else {
        // cyber-grid
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 2. 3D Contact Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.72, width * 0.32, height * 0.04, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowBlur / 100})`;
      ctx.filter = `blur(${shadowBlur * 0.8}px)`;
      ctx.fill();
      ctx.restore();

      // 3. Draw Product Image with Brightness & Contrast Filters
      ctx.save();
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      const maxDim = width * 0.72;
      const scale = Math.min(maxDim / img.width, maxDim / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = (width - drawW) / 2;
      const drawY = height * 0.44 - drawH / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // 4. Draw Ribbon Badge
      if (badgeText) {
        ctx.save();
        ctx.fillStyle = badgeColor;
        const badgeW = 220;
        const badgeH = 50;
        const badgeX = width - badgeW - 48;
        const badgeY = 48;

        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);
        ctx.restore();
      }

      // 5. Draw Brand Watermark
      if (brandTag) {
        ctx.save();
        ctx.fillStyle = backdropTheme === "dark-slate" || backdropTheme === "cyber-grid" ? "#71717a" : "#a1a1aa";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText(brandTag, 64, 76);
        ctx.restore();
      }

      // 6. Draw Product Footer Bar (Title & Price)
      ctx.save();
      ctx.fillStyle = backdropTheme === "dark-slate" || backdropTheme === "cyber-grid" ? "#ffffff" : "#18181b";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(productTitle, 64, height - 72);

      ctx.fillStyle = badgeColor;
      ctx.font = "bold 40px monospace";
      ctx.textAlign = "right";
      ctx.fillText(priceText, width - 64, height - 72);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    aspectRatio,
    badgeText,
    badgeColor,
    backdropTheme,
    brightness,
    contrast,
    shadowBlur,
    productTitle,
    priceText,
    brandTag,
  ]);

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Bridge Notification */}
      {hasBridgedCutout && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Loaded Clean Transparent Cutout from BG Remover Studio!
          </span>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Active</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              E-Commerce Product Showcase &amp; Studio Photo Maker
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Studio Lighting Backdrop • 3D Contact Shadow • Deal Badges • 1080p Export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={handleAutoCutout}
            disabled={isAutoCutting}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAutoCutting ? "Isolating..." : "Auto-Cut Background"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 1080p Showcase</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Settings Form */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Studio Controls
            </span>
            <Link
              href="/tools/bg-remover"
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              Need Cutout? Open BG Remover <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <span className="text-ink-2 block text-[11px]">Format / Aspect Ratio:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "1:1", label: "1:1 Square (1080p)" },
                { id: "4:5", label: "4:5 FB/IG (1350p)" },
                { id: "16:9", label: "16:9 Banner (1920p)" },
              ].map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    sound.toggleSwitch();
                    setAspectRatio(a.id as any);
                  }}
                  className={`py-1.5 rounded-xl border text-center transition text-[10px] ${
                    aspectRatio === a.id
                      ? "bg-primary text-white border-primary font-bold"
                      : "bg-surface border-line text-ink-2"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backdrop Themes */}
          <div className="space-y-1.5">
            <span className="text-ink-2 block text-[11px]">Studio Backdrop:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "alabaster", label: "Alabaster" },
                { id: "dark-slate", label: "Dark Slate" },
                { id: "warm-cream", label: "Cream" },
                { id: "cyber-grid", label: "Grid" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.toggleSwitch();
                    setBackdropTheme(t.id as any);
                  }}
                  className={`py-1 rounded-xl border text-center transition text-[10px] ${
                    backdropTheme === t.id
                      ? "bg-primary text-white border-primary font-bold"
                      : "bg-surface border-line text-ink-2"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Product Title</span>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Price Tag</span>
              <input
                type="text"
                value={priceText}
                onChange={(e) => setPriceText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold text-rose-500"
              />
            </div>
          </div>

          {/* Badge & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Badge Ribbon</span>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink uppercase"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Badge Color</span>
              <div className="flex items-center gap-1.5">
                {["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBadgeColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-lg transition border ${
                      badgeColor === c ? "ring-2 ring-primary scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3D Contact Shadow & Lighting */}
          <div className="space-y-2 pt-2 border-t border-line">
            <div className="space-y-1">
              <div className="flex justify-between text-ink-2 text-[10px]">
                <span>Contact Shadow Blur:</span>
                <span className="font-bold text-ink">{shadowBlur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={shadowBlur}
                onChange={(e) => setShadowBlur(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-ink-3 block">Brightness: {brightness}%</span>
                <input
                  type="range"
                  min={80}
                  max={130}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-ink-3 block">Contrast: {contrast}%</span>
                <input
                  type="range"
                  min={80}
                  max={140}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/10 border border-line">
          <div className="relative rounded-2xl border border-line overflow-hidden shadow-2xl max-w-full">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[500px] h-auto object-contain"
            />
          </div>
          <span className="text-[10px] font-mono text-ink-3 mt-3">
            Rendered at 1080p Master Resolution • 60 FPS Canvas Pipeline
          </span>
        </div>
      </div>
    </div>
  );
}
