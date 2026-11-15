"use client";

import React, { useState, useMemo } from "react";
import { StudioWorkspaceShell } from "@/components/tools/StudioWorkspaceShell";
import {
  EMBED_WIDGETS,
  generateIframeSnippet,
  type EmbedWidgetDefinition,
} from "@/lib/embed/widget-registry";
import { EmbedWidgetRenderer } from "@/components/embed/EmbedWidgetRenderer";
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Sparkles,
  ExternalLink,
  Sliders,
  Globe,
  Share2,
} from "lucide-react";

export function EmbedWidgetStudio() {
  const widgetList = useMemo(() => Object.values(EMBED_WIDGETS), []);
  const [selectedSlug, setSelectedSlug] = useState<string>("bijoy-converter");
  const [theme, setTheme] = useState<"auto" | "dark" | "light">("auto");
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [width, setWidth] = useState<string>("100%");
  const [height, setHeight] = useState<number>(540);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentWidget: EmbedWidgetDefinition = EMBED_WIDGETS[selectedSlug] || widgetList[0];

  const generatedCode = useMemo(() => {
    return generateIframeSnippet({
      slug: selectedSlug,
      theme,
      lang,
      width,
      height,
    });
  }, [selectedSlug, theme, lang, width, height]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <StudioWorkspaceShell
      title="Embeddable Micro-SaaS Widget Studio"
      badge="Studio #46"
      category="Developer Tools"
      description="Embed any of our 8 popular Bangladesh utility and finance micro-tools directly into your blog, portfolio, or client website with zero server setup."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Widget Selection */}
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Choose Micro-Tool to Embed
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
              {widgetList.map((w) => (
                <button
                  key={w.slug}
                  onClick={() => {
                    setSelectedSlug(w.slug);
                    setHeight(w.defaultHeight);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    selectedSlug === w.slug
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border/60 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground">{w.banglaName}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {w.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Controls */}
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Widget Options
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-background border border-border text-xs"
                >
                  <option value="auto">Auto (Match Host)</option>
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-background border border-border text-xs"
                >
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-muted-foreground">Widget Height</span>
                <span className="font-mono font-bold text-foreground">{height}px</span>
              </div>
              <input
                type="range"
                min={currentWidget.minHeight}
                max={800}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Generated Code Box */}
          <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary" /> Embed Snippet (HTML / Iframe)
              </span>
              <button
                onClick={() => copyToClipboard(generatedCode, "code")}
                className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1 shadow"
              >
                {copiedKey === "code" ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Snippet
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-muted/40 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto select-all text-foreground">
              {generatedCode}
            </pre>
            <p className="text-[11px] text-muted-foreground">
              Paste this snippet anywhere in WordPress, Webflow, Ghost, React, or standard HTML.
            </p>
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Sandbox */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center p-2 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Live Interactive Sandbox
              </span>
            </div>
            <a
              href={`https://sabbir.nav.bd/embed/${selectedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded hover:bg-muted text-xs text-primary flex items-center gap-1 font-medium transition-colors"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Sandbox Frame */}
          <div
            style={{ height: `${height}px` }}
            className="w-full rounded-2xl border border-border shadow-sm overflow-hidden bg-card"
          >
            <EmbedWidgetRenderer toolSlug={selectedSlug} theme={theme} lang={lang} />
          </div>
        </div>
      </div>
    </StudioWorkspaceShell>
  );
}
