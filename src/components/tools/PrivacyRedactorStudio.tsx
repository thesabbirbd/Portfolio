"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ShieldAlert,
  Download,
  Copy,
  Check,
  Sparkles,
  Lock,
  EyeOff,
  FileText,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

const DEMO_DOCUMENT = `JOB APPLICATION & VERIFICATION FORM
Applicant Name: Md Tanvir Hasan
Mobile Number: +8801711234567
Secondary Phone: 01922334455
National ID (NID): 19942691523456789
Date of Birth: 14-Aug-1994
Present Address: House 24, Road 4, Sector 7, Uttara, Dhaka 1230
Bank Account: Dutch Bangla Bank A/C 2050123456789
Email Address: tanvir.hasan94@gmail.com
Emergency Contact: +8801819876543 (Brother)`;

interface RedactBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "blackout" | "pixelate";
}

export function PrivacyRedactorStudio() {
  const [activeTab, setActiveTab] = useState<"text" | "visual">("text");

  // Text Mode States
  const [inputText, setInputText] = useState<string>(DEMO_DOCUMENT);
  const [redactionMode, setRedactionMode] = useState<"blackout" | "badge" | "asterisk">("blackout");
  const [watermark, setWatermark] = useState<string>("CONFIDENTIAL — FOR VERIFICATION ONLY");
  const [customWord, setCustomWord] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Visual Canvas Mode States
  const [visualImageSrc, setVisualImageSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
  );
  const [boxes, setBoxes] = useState<RedactBox[]>([
    { id: "1", x: 120, y: 160, w: 260, h: 36, type: "blackout" },
    { id: "2", x: 120, y: 220, w: 220, h: 36, type: "blackout" },
  ]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Text Redaction Engine
  const redact = (text: string): string => {
    let result = text;

    // 1. Phone numbers
    const phoneRegex = /(\+?8801|01)[3-9]\d{8}/g;
    result = result.replace(phoneRegex, (match) => {
      if (redactionMode === "blackout") return "███████████";
      if (redactionMode === "badge") return "[PHONE_REDACTED]";
      return match.slice(0, 3) + "****" + match.slice(-3);
    });

    // 2. National ID (10, 13, 17 digits)
    const nidRegex = /\b\d{10,17}\b/g;
    result = result.replace(nidRegex, (match) => {
      if (redactionMode === "blackout") return "████████████████";
      if (redactionMode === "badge") return "[NID_REDACTED]";
      return match.slice(0, 4) + "********" + match.slice(-2);
    });

    // 3. Email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    result = result.replace(emailRegex, () => {
      if (redactionMode === "blackout") return "████████████████";
      if (redactionMode === "badge") return "[EMAIL_REDACTED]";
      return "user***@domain.com";
    });

    // 4. Custom Keyword
    if (customWord.trim()) {
      const customRegex = new RegExp(customWord.trim(), "gi");
      result = result.replace(customRegex, "█████");
    }

    return result;
  };

  const redactedOutput = redact(inputText);

  // Canvas Drawing & Rendering for Visual Redaction
  useEffect(() => {
    if (!visualImageSrc || activeTab !== "visual") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
      canvas.width = w;
      canvas.height = h;

      // Draw base image
      ctx.drawImage(img, 0, 0, w, h);

      // Draw redact boxes
      boxes.forEach((b) => {
        if (b.type === "blackout") {
          ctx.fillStyle = "#000000";
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.strokeStyle = "#e11d48";
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
      });

      // Draw official stamp
      ctx.fillStyle = "rgba(225, 29, 72, 0.15)";
      ctx.font = "bold 20px monospace";
      ctx.fillText("REDACTED & PRIVACY SHIELDED", 40, h - 30);
    };
    img.src = visualImageSrc;
  }, [visualImageSrc, boxes, activeTab]);

  // Handle Box Dragging on Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    setDrawStart({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
    setIsDrawing(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const curX = (e.clientX - rect.left) * scaleX;
    const curY = (e.clientY - rect.top) * scaleY;

    const x = Math.min(drawStart.x, curX);
    const y = Math.min(drawStart.y, curY);
    const w = Math.abs(curX - drawStart.x);
    const h = Math.abs(curY - drawStart.y);

    if (w > 10 && h > 10) {
      sound.toggleSwitch();
      setBoxes([...boxes, { id: String(Date.now()), x, y, w, h, type: "blackout" }]);
    }

    setIsDrawing(false);
    setDrawStart(null);
  };

  const handleDownloadFlattenedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.shutter();
    osStore.addXp(30, "Downloaded Flattened Redacted Image");
    osStore.incrementToolRun();

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `sanitized-doc-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    sound.copy();
    await navigator.clipboard.writeText(redactedOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    osStore.addXp(20, "Copied Redacted Text");
  };

  const handleDownloadText = () => {
    sound.shutter();
    osStore.addXp(30, "Downloaded Redacted Document");
    osStore.incrementToolRun();

    const fullContent = `--- PRIVACYSHIELD SANITIZED DOCUMENT ---\nSecurity Stamp: ${watermark}\nExported At: ${new Date().toISOString()}\n\n${redactedOutput}\n\n[Protected by THE SABBiR OS Privacy Engine]`;

    const blob = new Blob([fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sanitized-doc-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Privacy PDF &amp; Document Visual Redactor Studio
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Zero Server Uploads • Auto PII Detection (NID, Phone, Bank A/C) • Interactive Visual Blackout Canvas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Switch */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("text");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "text" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              Text Sanitizer
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("visual");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "visual" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              Visual Box Redactor
            </button>
          </div>

          {activeTab === "text" ? (
            <>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownloadText}
                className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Text</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleDownloadFlattenedImage}
              className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Flattened PNG</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "text" ? (
        /* Text Sanitizer Layout */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
            <div>
              <span className="text-[10px] text-ink-3 block mb-1">Masking Style</span>
              <div className="flex gap-1">
                {(["blackout", "badge", "asterisk"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      sound.toggleSwitch();
                      setRedactionMode(m);
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition text-[11px] ${
                      redactionMode === m
                        ? "bg-primary text-white border-primary font-bold"
                        : "bg-surface border-line text-ink-2"
                    }`}
                  >
                    {m === "blackout" ? "██ Solid" : m === "badge" ? "[REDACTED]" : "1994***89"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-ink-3 block mb-1">Custom Keyword to Scrub</span>
              <input
                type="text"
                placeholder="e.g. Salary, Uttara, Brother"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>

            <div>
              <span className="text-[10px] text-ink-3 block mb-1">Security Stamp</span>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-ink-2">Raw Document:</span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full p-4 rounded-2xl bg-surface border border-line font-mono text-xs text-ink leading-relaxed focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Sanitized Output (Safe to Share):
              </span>
              <div className="w-full p-4 rounded-2xl bg-muted/10 border border-line font-mono text-xs text-ink leading-relaxed whitespace-pre-wrap h-[216px] overflow-y-auto">
                {redactedOutput}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Canvas Redactor Layout */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (evt) => setVisualImageSrc(evt.target?.result as string);
                  reader.readAsDataURL(file);
                }}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document Image</span>
              </button>
              <button
                onClick={() => setBoxes([])}
                className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Boxes ({boxes.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-ink-3">
              Click &amp; Drag with mouse or finger to draw Blackout Bounding Boxes
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-muted/10 border border-line flex flex-col items-center justify-center">
            <div className="border border-line rounded-xl overflow-hidden shadow-lg bg-white">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="max-w-full max-h-[500px] h-auto object-contain cursor-crosshair"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
