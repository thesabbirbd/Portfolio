"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link2, Copy, Check, QrCode, Lock, ShieldCheck, X, Sparkles, ExternalLink } from "lucide-react";
import { sound } from "@/lib/sound";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { encodeQrMatrix } from "@/lib/barcode/qr-matrix-encoder";

interface ShareContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolSlug: string;
  toolName: string;
  payload: any;
  defaultTitle?: string;
  previewDataUrl?: string;
}

export function ShareContentModal({
  isOpen,
  onClose,
  toolSlug,
  toolName,
  payload,
  defaultTitle = "Shared Studio Output",
  previewDataUrl,
}: ShareContentModalProps) {
  const { user } = useWorkplaceAuth();

  const [title, setTitle] = useState(defaultTitle);
  const [creatorName, setCreatorName] = useState(user?.displayName || "Guest Creator");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shareResult, setShareResult] = useState<{
    token: string;
    shareUrl: string;
    expiresAt: string;
    qrSvg?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreateShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          title: title.trim() || defaultTitle,
          creatorName: creatorName.trim() || "Anonymous",
          payloadJson: payloadStr,
          previewDataUrl: previewDataUrl || undefined,
          pinCode: pinCode.trim() || undefined,
          durationHours: 24,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create share link");
      }

      // Generate QR Code SVG locally
      let qrSvg = "";
      try {
        const qr = encodeQrMatrix(data.shareUrl);
        qrSvg = qr.svg;
      } catch (err) {
        console.warn("QR code generation fallback:", err);
      }

      setShareResult({
        token: data.token,
        shareUrl: data.shareUrl,
        expiresAt: data.expiresAt,
        qrSvg,
      });

      sound.levelUp();
    } catch (err: any) {
      setError(err?.message || "Error generating share link");
      sound.error();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareResult) return;
    navigator.clipboard.writeText(shareResult.shareUrl);
    setCopied(true);
    sound.copy();
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-700 bg-neutral-900/95 p-6 shadow-2xl text-neutral-100 sm:p-7">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.modalClose();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          aria-label="Close share modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Link2 className="w-3.5 h-3.5" />
            <span>24-Hour Ephemeral Share</span>
          </div>
          <h2 className="mt-2 text-xl font-bold text-white">Share from {toolName}</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Creates a public snapshot link that automatically self-destructs after 24 hours.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {!shareResult ? (
          /* Share Creation Form */
          <form onSubmit={handleCreateShare} className="space-y-3.5">
            <div>
              <label htmlFor="share-title" className="block text-xs font-medium text-neutral-300 mb-1">
                Project / Output Title
              </label>
              <input
                id="share-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festive Product Reel Cover"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="share-creator" className="block text-xs font-medium text-neutral-300 mb-1">
                Creator Display Name
              </label>
              <input
                id="share-creator"
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed or Anonymous"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="share-pin" className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                <span>Optional 4-Digit Passcode / PIN</span>
                <span className="text-[10px] text-neutral-500">Lock access</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                <input
                  id="share-pin"
                  type="password"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Leave empty for public access"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-8 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-3 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center justify-between text-neutral-300">
                <span>⏱️ Link Lifetime:</span>
                <strong className="text-amber-400 font-mono">24 Hours (Strict TTL)</strong>
              </div>
              <p className="text-[10px] text-neutral-500">
                Visitors can view live previews, download copies, or remix your work in their own studio.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Generating Secure 24h Link...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate 24h Share Link</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Share Result Display */
          <div className="space-y-4 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center justify-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>24-Hour Link Created Successfully!</span>
            </div>

            {/* QR Code Container */}
            {shareResult.qrSvg && (
              <div className="flex justify-center my-3">
                <div
                  className="h-36 w-36 rounded-2xl bg-white p-2.5 shadow-md flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: shareResult.qrSvg }}
                />
              </div>
            )}

            {/* URL Box & Copy */}
            <div className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-950 p-2">
              <input
                type="text"
                readOnly
                value={shareResult.shareUrl}
                className="flex-1 bg-transparent px-2 text-xs text-neutral-200 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1">
              <span>⏳ Auto-purges on:</span>
              <strong className="text-amber-400 font-mono">
                {new Date(shareResult.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={shareResult.shareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setShareResult(null);
                  onClose();
                }}
                className="flex items-center justify-center rounded-xl bg-neutral-100 py-2 text-xs font-semibold text-neutral-900 hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
