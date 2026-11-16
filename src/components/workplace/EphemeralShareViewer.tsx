"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Lock,
  Download,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Share2,
  Maximize2,
  X,
  Code,
  ExternalLink,
} from "lucide-react";
import { sound } from "@/lib/sound";
import type { EphemeralShare } from "@/lib/db/workplace-store";
import { generateSvgDataUrl, extractHighlights } from "@/lib/share/visual-snapshot-generator";

interface EphemeralShareViewerProps {
  token: string;
}

export function EphemeralShareViewer({ token }: EphemeralShareViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<EphemeralShare | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetchShare = async (pin?: string) => {
    setLoading(true);
    setPinError(null);
    try {
      const url = `/api/share?token=${encodeURIComponent(token)}${pin ? `&pin=${encodeURIComponent(pin)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 410) {
          setError("410_EXPIRED");
        } else {
          setError(data.error || "Failed to load share");
        }
        return;
      }

      if (data.locked) {
        setIsLocked(true);
        setShareData(data as any);
      } else {
        setIsLocked(false);
        setShareData(data.share);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to retrieve share snapshot");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShare();
  }, [token]);

  // Live countdown timer
  useEffect(() => {
    if (!shareData?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(shareData.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemainingTime("Expired");
        setError("410_EXPIRED");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / 3600_000);
      const minutes = Math.floor((diff % 3600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);

      setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [shareData?.expiresAt]);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError("Please enter the passcode.");
      return;
    }
    fetchShare(pinInput.trim());
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      sound.copy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const text = encodeURIComponent(`Check out "${shareData?.title || "Studio Output"}" on THE SABBiR OS: ${url}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
      sound.click();
    }
  };

  const handleDownloadImage = () => {
    if (!shareData) return;
    sound.shutter();

    const visualUrl =
      shareData.previewDataUrl ||
      generateSvgDataUrl({
        title: shareData.title,
        toolSlug: shareData.toolSlug,
        creatorName: shareData.creatorName,
        highlights: extractHighlights(shareData.payloadJson || "{}"),
      });

    const a = document.createElement("a");
    a.href = visualUrl;
    a.download = `${shareData.toolSlug}-visual-card-${token.slice(0, 8)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="h-10 w-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-400 font-mono">Retrieving encrypted 24h ephemeral share...</p>
      </div>
    );
  }

  if (error === "410_EXPIRED") {
    return (
      <div className="max-w-lg mx-auto my-16 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 text-center space-y-5 backdrop-blur-md">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-3xl">
          ⏳
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">This 24-Hour Link Has Expired</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            THE SABBiR OS ephemeral storage engine automatically purges links after 24 hours to keep our cloud tier light, private and zero-leakage.
          </p>
        </div>
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>Explore 64 Workplace Studios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="max-w-md mx-auto my-16 rounded-3xl border border-neutral-700 bg-neutral-900/95 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Passcode Protected Content</h2>
          <p className="mt-1 text-xs text-neutral-400">
            <strong>{shareData?.creatorName}</strong> has locked this snapshot with a passcode.
          </p>
        </div>

        {pinError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
            {pinError}
          </div>
        )}

        <form onSubmit={handleUnlockPin} className="space-y-3">
          <input
            type="password"
            autoFocus
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Enter 4-Digit PIN..."
            className="w-full text-center tracking-widest text-lg rounded-xl border border-neutral-700 bg-neutral-950 py-3 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-md"
          >
            Unlock Content
          </button>
        </form>

        <div className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Expires in: {remainingTime || "Calculating..."}</span>
        </div>
      </div>
    );
  }

  if (!shareData) return null;

  // Resolve visual card image data URL
  const visualCardUrl =
    shareData.previewDataUrl ||
    generateSvgDataUrl({
      title: shareData.title,
      toolSlug: shareData.toolSlug,
      creatorName: shareData.creatorName,
      highlights: extractHighlights(shareData.payloadJson || "{}"),
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-8 px-4">
      {/* Top Banner: TTL Countdown & Creator Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>24h Ephemeral Card</span>
            <span>•</span>
            <span className="font-mono text-amber-400 font-bold">{remainingTime || "Active"} remaining</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{shareData.title}</h1>
          <p className="text-xs text-neutral-400">
            Created by <strong className="text-neutral-200">{shareData.creatorName}</strong> in{" "}
            <span className="text-amber-400 font-mono capitalize">{shareData.toolSlug.replace(/-/g, " ")} Studio</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "লিংক কপি"}</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-600/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleDownloadImage}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ইমেজ ডাউনলোড (PNG)</span>
          </button>
        </div>
      </div>

      {/* FRONT & CENTER: Visual Result Card */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-4 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ভিজ্যুয়াল শেয়ার কার্ড (High-Contrast Result Card)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLightboxOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>বড় করে দেখুন</span>
            </button>
            <Link
              href={`/tools/${shareData.toolSlug}`}
              className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <span>🎨 স্টুডিওতে এডিট করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Visual Card Image Display */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative group cursor-zoom-in rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl transition-transform hover:scale-[1.005]"
        >
          <img
            src={visualCardUrl}
            alt={shareData.title}
            className="w-full h-auto object-contain max-h-[580px] mx-auto block"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-neutral-900/90 border border-neutral-700 text-white text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-1.5 shadow-xl">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> ক্লিক করে ফুল-স্ক্রিন দেখুন
            </span>
          </div>
        </div>
      </div>

      {/* COLLAPSED DEVELOPER ACCORDION: Raw Technical Data */}
      <details className="group rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 transition-colors hover:border-neutral-700">
        <summary className="cursor-pointer text-xs font-mono text-neutral-400 hover:text-white flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-neutral-500" />
            <span>🔧 টেকনিক্যাল ডেটা (Raw Payload — Developers Only)</span>
          </div>
          <span className="text-[11px] text-neutral-600 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-neutral-800/80">
          <pre className="font-mono text-[11px] text-emerald-300/90 leading-relaxed overflow-x-auto max-h-60 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/50">
            {shareData.payloadJson}
          </pre>
        </div>
      </details>

      {/* Security Footer Notice */}
      <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>THE SABBiR OS Ephemeral Dual-Engine · Zero Plaintext Leakage · ২৪ ঘণ্টা পর স্বয়ংক্রিয়ভাবে মুছে যায়</span>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={visualCardUrl}
            alt={shareData.title}
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-neutral-800"
          />
        </div>
      )}
    </div>
  );
}
