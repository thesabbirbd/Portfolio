"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Lock, Download, ArrowRight, Copy, Check, ShieldCheck, Sparkles, AlertCircle, FileText } from "lucide-react";
import { sound } from "@/lib/sound";
import type { EphemeralShare } from "@/lib/db/workplace-store";

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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    sound.copy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPayload = () => {
    if (!shareData?.payloadJson) return;
    sound.shutter();

    const isImage = shareData.previewDataUrl?.startsWith("data:image");
    if (isImage && shareData.previewDataUrl) {
      const a = document.createElement("a");
      a.href = shareData.previewDataUrl;
      a.download = `${shareData.toolSlug}-shared-${token}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const blob = new Blob([shareData.payloadJson], { type: shareData.contentType || "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shareData.toolSlug}-shared-${token}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            THE SABBiR OS ephemeral storage engine automatically purges links after 24 hours to keep our free cloud tier light and private.
          </p>
        </div>
        <div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>Launch 35 Workplace Studios</span>
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-8 px-4">
      {/* Top Banner: TTL Countdown & Creator Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>24h Ephemeral Link</span>
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>
          <button
            onClick={handleDownloadPayload}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Copy</span>
          </button>
        </div>
      </div>

      {/* Snapshot Preview Card */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Rendered Snapshot Output</span>
          </div>
          <Link
            href={`/tools/${shareData.toolSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <span>Open &amp; Remix in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Visual Preview (if image) */}
        {shareData.previewDataUrl ? (
          <div className="flex justify-center bg-neutral-950 rounded-2xl p-4 border border-neutral-800/80">
            <img
              src={shareData.previewDataUrl}
              alt={shareData.title}
              className="max-h-[500px] w-auto object-contain rounded-xl shadow-lg"
            />
          </div>
        ) : (
          /* JSON / Code / Text Preview */
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 overflow-x-auto max-h-96">
            <pre className="font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap">
              {shareData.payloadJson}
            </pre>
          </div>
        )}
      </div>

      {/* Security Footer Notice */}
      <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Hosted by THE SABBiR OS Ephemeral Dual-Engine · Auto-purged upon expiration</span>
      </div>
    </div>
  );
}
