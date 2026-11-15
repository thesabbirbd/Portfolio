"use client";

import React, { useRef, useEffect, useState } from "react";
import { Download, Check, Sparkles, X, ShieldCheck } from "lucide-react";
import { sound } from "@/lib/sound";
import { useOSStore } from "@/lib/os-store";

interface CareerPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CareerPassportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const profile = useOSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Render 1080x675 Hi-DPI Passport
    const w = canvas.width;
    const h = canvas.height;

    // Background Dark Slate & Radial Mesh
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w / 2, 0, 50, w / 2, h / 2, w / 1.2);
    grad.addColorStop(0, "rgba(255, 106, 0, 0.22)");
    grad.addColorStop(0.5, "rgba(14, 165, 233, 0.12)");
    grad.addColorStop(1, "rgba(10, 15, 29, 0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Holographic Border
    ctx.strokeStyle = "rgba(255, 106, 0, 0.6)";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    // Header Logo & Brand
    ctx.font = "bold 28px 'Courier New', monospace";
    ctx.fillStyle = "#ff6a00";
    ctx.fillText("THE SABBiR OS // SYSTEMS ARCHITECT PASSPORT", 50, 75);

    ctx.font = "14px 'Courier New', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("VERIFIED INFRASTRUCTURE & AUTONOMOUS AGENT RUNTIME · sabbir.nav.bd", 50, 102);

    // Divider
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(w - 50, 120);
    ctx.stroke();

    // User Profile Section
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`OPERATOR: @${profile.handle || "architect"}`, 50, 165);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`RANK: ${profile.rank.title} ${profile.rank.badge}`, 50, 195);

    ctx.font = "bold 32px 'Courier New', monospace";
    ctx.fillStyle = "#ff6a00";
    ctx.fillText(`TOTAL OS XP: ${profile.totalXp} XP`, 50, 250);

    // Stats Grid
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(50, 280, w - 100, 140);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeRect(50, 280, w - 100, 140);

    // Stats Columns
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("ENGINEERING GAMES", 70, 310);
    ctx.fillText("ACTIVE SUPER-TOOLS", 270, 310);
    ctx.fillText("SWARM PIPELINES", 470, 310);
    ctx.fillText("SECURITY PROTOCOL", 670, 310);

    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("7 PLAYED", 70, 350);
    ctx.fillText("18 VERIFIED", 270, 350);
    ctx.fillText("4 AUTONOMOUS", 470, 350);
    ctx.fillStyle = "#10b981";
    ctx.fillText("ZERO-CLOUD PASS", 670, 350);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("High Score: " + Math.max(...Object.values(profile.highScores || { none: 0 })), 70, 385);
    ctx.fillText("Client-Side WASM / Canvas", 270, 385);
    ctx.fillText("Multi-Agent DAG Swarms", 470, 385);
    ctx.fillText("Cryptographic Checksum OK", 670, 385);

    // Bottom Authority Signature
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(50, 460);
    ctx.lineTo(w - 50, 460);
    ctx.stroke();

    ctx.font = "13px 'Courier New', monospace";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("AUTHENTICATED BY: Md Sabbirul Islam Khan · Chief Product Manager (CPM)", 50, 495);
    ctx.fillText("ISSUED: " + new Date().toISOString().split("T")[0] + " · HOST: sabbir.nav.bd", 50, 520);

    // Draw Verification Stamp Icon
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.beginPath();
    ctx.arc(w - 100, 500, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 10px 'Courier New', monospace";
    ctx.fillStyle = "#10b981";
    ctx.textAlign = "center";
    ctx.fillText("VERIFIED", w - 100, 495);
    ctx.fillText("SYSTEMS", w - 100, 508);
    ctx.fillText("ARCHITECT", w - 100, 520);
    ctx.textAlign = "left";

    setDownloadUrl(canvas.toDataURL("image/png"));
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    sound.levelUp();
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `THE_SABBIR_OS_PASSPORT_${profile.handle || "ARCHITECT"}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-muted hover:bg-muted/80 text-ink transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">THE SABBiR OS Career Passport</h3>
            <p className="text-xs text-ink-3">
              Official verifiable holographic credential card generated from your OS experience.
            </p>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="w-full overflow-hidden rounded-2xl border border-line shadow-inner bg-black">
          <canvas
            ref={canvasRef}
            width={900}
            height={560}
            className="w-full h-auto block"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="text-xs font-mono text-ink-3">
            Format: High-Res PNG (900x560px) · Ready for LinkedIn / Portfolio
          </span>
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Passport (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
