"use client";

import React, { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Globe,
  Sparkles,
  ExternalLink,
  Code2,
  Monitor,
  Smartphone,
  Info,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

export function SocialPreviewStudio() {
  const [url, setUrl] = useState("https://sabbir.nav.bd/tools/bg-remover");
  const [title, setTitle] = useState("Free AI Studio Background Remover & Product Photo Enhancer | THE SABBiR OS");
  const [description, setDescription] = useState("Remove image backgrounds instantly in your browser with 100% privacy. No signup required, zero server uploads, and high-res WebP export for e-commerce.");
  const [imageUrl, setImageUrl] = useState("https://sabbir.nav.bd/og-image.png");
  const [siteName, setSiteName] = useState("THE SABBiR OS");
  const [platform, setPlatform] = useState<"facebook" | "twitter" | "linkedin" | "whatsapp">("facebook");
  const [codeType, setCodeType] = useState<"html" | "nextjs">("nextjs");
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      label: "Free Tool (BG Remover)",
      url: "https://sabbir.nav.bd/tools/bg-remover",
      title: "Free AI Studio Background Remover & Product Photo Enhancer | THE SABBiR OS",
      description: "Remove image backgrounds instantly in your browser with 100% privacy. No signup required, zero server uploads, and high-res WebP export for e-commerce.",
      image: "https://sabbir.nav.bd/og-image.png",
    },
    {
      label: "Tech Deep-Dive Article",
      url: "https://sabbir.nav.bd/articles/docker-security-hardening-checklist-2026",
      title: "Docker Security Hardening in 2026: Non-Root, Distroless & Least Privilege",
      description: "A battle-tested production checklist to audit and lock down container workloads against CVEs, privilege escalations, and container escapes.",
      image: "https://sabbir.nav.bd/og-image.png",
    },
    {
      label: "Autonomous AI Agents Hub",
      url: "https://sabbir.nav.bd/agents",
      title: "8 Autonomous AI Micro-Agents for Builders & BD Businesses | THE SABBiR OS",
      description: "Explore 8 local-first micro-agents running media matting, ledger OCR, privacy redaction, and SQL schema design right inside your browser.",
      image: "https://sabbir.nav.bd/og-image.png",
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    sound.toggleSwitch();
    setUrl(p.url);
    setTitle(p.title);
    setDescription(p.description);
    setImageUrl(p.image);
  };

  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "sabbir.nav.bd";
    }
  })();

  const titleLen = title.length;
  const descLen = description.length;

  const htmlMetaCode = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@thesabbir" />
<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  const nextjsMetaCode = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title.replace(/"/g, '\\"')}",
  description: "${description.replace(/"/g, '\\"')}",
  openGraph: {
    title: "${title.replace(/"/g, '\\"')}",
    description: "${description.replace(/"/g, '\\"')}",
    url: "${url}",
    siteName: "${siteName}",
    images: [
      {
        url: "${imageUrl}",
        width: 1200,
        height: 630,
        alt: "${title.replace(/"/g, '\\"')}",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "${title.replace(/"/g, '\\"')}",
    description: "${description.replace(/"/g, '\\"')}",
    creator: "@thesabbir",
    images: ["${imageUrl}"],
  },
};`;

  const handleCopy = () => {
    sound.click();
    navigator.clipboard.writeText(codeType === "nextjs" ? nextjsMetaCode : htmlMetaCode);
    setCopied(true);
    osStore.addXp(20, "Copied Social SEO Metadata");
    osStore.incrementToolRun();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Social Preview Card & SEO Meta Studio
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                  OG Live Simulator
                </span>
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Facebook, LinkedIn, X (Twitter) ও WhatsApp-এ আপনার লিংক শেয়ার করলে কেমন দেখাবে তা লাইভ প্রিভিউ করুন
              </p>
            </div>
          </div>
        </div>

        {/* Preset Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Quick Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 text-xs">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Meta Parameters
            </h3>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Canonical Page URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-neutral-400 font-medium">SEO Title</label>
                <span className={`font-mono text-[11px] ${titleLen > 60 ? "text-amber-400" : "text-neutral-500"}`}>
                  {titleLen}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-neutral-400 font-medium">Description</label>
                <span className={`font-mono text-[11px] ${descLen > 155 ? "text-amber-400" : "text-neutral-500"}`}>
                  {descLen}/155 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">OG Image URL (1200x630 Recommended)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Live Simulator & Code Generator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Platform Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            {(["facebook", "linkedin", "twitter", "whatsapp"] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => {
                  sound.click();
                  setPlatform(plat);
                }}
                className={`flex-1 py-2 rounded-lg capitalize font-medium transition-all ${
                  platform === plat
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {plat === "twitter" ? "X / Twitter" : plat}
              </button>
            ))}
          </div>

          {/* Social Card Preview Frame */}
          <div className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-center min-h-[320px]">
            {/* FACEBOOK CARD */}
            {platform === "facebook" && (
              <div className="w-full max-w-md rounded-lg overflow-hidden border border-neutral-700/60 bg-[#242526] text-neutral-200 shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">1200 x 630 OG Image</span>
                  )}
                </div>
                <div className="p-3 bg-[#3a3b3c]/60">
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-sans truncate">{domain}</div>
                  <div className="text-sm font-semibold text-white line-clamp-1 mt-0.5">{title}</div>
                  <div className="text-xs text-neutral-300 line-clamp-1 mt-0.5">{description}</div>
                </div>
              </div>
            )}

            {/* LINKEDIN CARD */}
            {platform === "linkedin" && (
              <div className="w-full max-w-md rounded-lg overflow-hidden border border-neutral-700/60 bg-[#1b1f23] text-neutral-200 shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">1200 x 630 OG Image</span>
                  )}
                </div>
                <div className="p-3 bg-[#283038]">
                  <div className="text-sm font-semibold text-white line-clamp-2 leading-snug">{title}</div>
                  <div className="text-[11px] text-neutral-400 font-sans mt-1.5 flex items-center gap-1.5">
                    <span>{domain}</span>
                    <span>•</span>
                    <span>1 min read</span>
                  </div>
                </div>
              </div>
            )}

            {/* TWITTER / X CARD */}
            {platform === "twitter" && (
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-neutral-700/60 bg-black text-neutral-200 shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-neutral-500 font-mono">1200 x 630 OG Image</span>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {domain}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-white line-clamp-1">{title}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2 mt-0.5">{description}</div>
                </div>
              </div>
            )}

            {/* WHATSAPP CARD */}
            {platform === "whatsapp" && (
              <div className="w-full max-w-sm rounded-xl overflow-hidden bg-[#005c4b]/80 border border-emerald-800 text-white shadow-xl p-2.5">
                <div className="flex gap-2.5">
                  <div className="w-20 h-20 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden relative">
                    {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold line-clamp-1">{title}</div>
                    <div className="text-[11px] text-neutral-300 line-clamp-2 mt-0.5 leading-snug">{description}</div>
                    <div className="text-[10px] text-emerald-300 font-mono mt-1 truncate">{domain}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Code Generator Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-semibold text-white">Generated Embed Code</h4>
                <div className="flex items-center gap-1 bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
                  <button
                    onClick={() => setCodeType("nextjs")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      codeType === "nextjs" ? "bg-sky-500 text-black font-semibold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Next.js
                  </button>
                  <button
                    onClick={() => setCodeType("html")}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      codeType === "html" ? "bg-sky-500 text-black font-semibold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-48 leading-relaxed border border-neutral-800">
              {codeType === "nextjs" ? nextjsMetaCode : htmlMetaCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
