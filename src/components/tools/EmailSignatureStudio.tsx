"use client";

import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Download,
  Eye,
  Sun,
  Moon,
  Sparkles,
  Link2,
  Share2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  EmailSignatureData,
  DEFAULT_SIGNATURE_DATA,
  generateEmailSignatureHtml,
} from "@/lib/design/email-signature-engine";

export function EmailSignatureStudio() {
  const [data, setData] = useState<EmailSignatureData>(DEFAULT_SIGNATURE_DATA);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);

  const signatureHtml = generateEmailSignatureHtml(data);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "email-signature",
    toolName: "Clickable HTML Email Signature",
  });

  const handleCopyRichText = async () => {
    sound.confirm();
    try {
      if (typeof window !== "undefined" && navigator.clipboard && window.ClipboardItem) {
        const textBlob = new Blob([signatureHtml], { type: "text/plain" });
        const htmlBlob = new Blob([signatureHtml], { type: "text/html" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": textBlob,
            "text/html": htmlBlob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        await navigator.clipboard.writeText(signatureHtml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      navigator.clipboard.writeText(signatureHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadHtml = () => {
    triggerGatedExport(() => {
      const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${data.fullName} - Signature</title></head><body>${signatureHtml}</body></html>`;
      const blob = new Blob([fullDoc], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.fullName.toLowerCase().replace(/\s+/g, "-")}-signature.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="email-signature"
        toolName="Clickable HTML Email Signature"
        category="Business & POS"
        onExportClick={handleDownloadHtml}
      />

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>Signature Configuration</span>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setData(DEFAULT_SIGNATURE_DATA);
                }}
                className="text-[11px] text-amber-400 hover:underline font-mono"
              >
                Reset Demo
              </button>
            </h3>

            {/* Template Selector */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                Template Style:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "executive", name: "Executive" },
                  { id: "founder", name: "Founder" },
                  { id: "compact", name: "Compact" },
                  { id: "mono", name: "Code Mono" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sound.click();
                      setData({ ...data, template: t.id as any });
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      data.template === t.id
                        ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold"
                        : "bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Title */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Company & URL */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={data.companyUrl}
                  onChange={(e) => setData({ ...data, companyUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Email, Phone & Location */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            {/* Avatar URL & Brand Color */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Avatar / Photo URL
                </label>
                <input
                  type="text"
                  value={data.avatarUrl}
                  onChange={(e) => setData({ ...data, avatarUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 p-1 rounded-xl">
                  <input
                    type="color"
                    value={data.brandColor}
                    onChange={(e) => setData({ ...data, brandColor: e.target.value })}
                    className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border-none"
                  />
                  <span className="text-[10px] font-mono text-neutral-300 uppercase">
                    {data.brandColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <button
                type="button"
                onClick={handleCopyRichText}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Rendered Signature for Gmail"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadHtml}
                className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .HTML Signature File</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Simulated Email Window */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              Live Gmail / Outlook Preview
            </span>
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewTheme("light")}
                className={`p-1 rounded ${
                  previewTheme === "light" ? "bg-neutral-800 text-white" : "text-neutral-500"
                }`}
                title="Light Email Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme("dark")}
                className={`p-1 rounded ${
                  previewTheme === "dark" ? "bg-neutral-800 text-white" : "text-neutral-500"
                }`}
                title="Dark Email Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Email Container Mockup */}
          <div
            className={`p-6 rounded-3xl border transition-colors shadow-2xl min-h-[360px] flex flex-col justify-between ${
              previewTheme === "dark"
                ? "bg-[#18181B] border-neutral-700 text-neutral-200"
                : "bg-white border-neutral-200 text-neutral-900"
            }`}
          >
            {/* Mock Header */}
            <div className="border-b border-neutral-500/20 pb-3 mb-6 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-500">To: client@company.com</span>
                <span className="text-[10px] text-neutral-400 font-mono">10:45 AM (Just now)</span>
              </div>
              <div className="font-bold">Subject: Project Proposal &amp; Engineering Specifications</div>
            </div>

            {/* Mock Message Body */}
            <div className="flex-1 space-y-3 text-xs leading-relaxed opacity-90 mb-8">
              <p>Hi team,</p>
              <p>
                Following our discussion, please find the technical architecture and budget sheet
                attached for your review. Let me know if you need any adjustments.
              </p>
              <p>Best regards,</p>
            </div>

            {/* Rendered Signature Block */}
            <div
              className="pt-4 border-t border-neutral-500/20"
              dangerouslySetInnerHTML={{ __html: signatureHtml }}
            />
          </div>

          <div className="p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-[11px] text-neutral-400 font-mono leading-relaxed">
            💡 <strong className="text-neutral-200">Gmail Paste Tip:</strong> Click &quot;Copy Rendered Signature&quot;, then open Gmail Settings ➔ General ➔ Signature, and press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400">Ctrl+V</kbd> to paste directly!
          </div>
        </div>
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
