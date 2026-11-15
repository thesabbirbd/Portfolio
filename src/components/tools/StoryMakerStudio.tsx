"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Smartphone,
  Square,
  Layout,
  Monitor,
  Download,
  Share2,
  Sparkles,
  Palette,
  Type,
  User,
  Check,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  STORY_TEMPLATES,
  STORY_FORMATS,
  StoryFormat,
  StoryTemplate,
  StoryCustomization,
  renderStoryToCanvas,
} from "@/lib/design/story-templates";

export function StoryMakerStudio() {
  const searchParams = useSearchParams();

  // Query parameter bridge from articles/news
  const initialHeadline = searchParams.get("headline") || STORY_TEMPLATES[0].defaultHeadline;
  const initialCategory = searchParams.get("category") || "";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedFormat, setSelectedFormat] = useState<StoryFormat>("portrait");
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate>(STORY_TEMPLATES[0]);

  const [customization, setCustomization] = useState<StoryCustomization>({
    format: "portrait",
    templateId: STORY_TEMPLATES[0].id,
    badge: initialCategory ? `📌 ${initialCategory.toUpperCase()}` : STORY_TEMPLATES[0].defaultBadge,
    headline: initialHeadline,
    subtitle: STORY_TEMPLATES[0].defaultSubtitle,
    brandHandle: "sabbir.nav.bd • THE SABBiR OS",
    authorName: "Md Sabbirul Islam Khan",
    accentColor: STORY_TEMPLATES[0].accentColor,
  });

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "story-maker",
    toolName: "Social Story & Reel Cover Studio",
  });

  // Re-render canvas whenever customization, template or format changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderStoryToCanvas(canvasRef.current, selectedTemplate, {
      ...customization,
      format: selectedFormat,
    });
  }, [selectedTemplate, selectedFormat, customization]);

  const handleTemplateSelect = (tmpl: StoryTemplate) => {
    setSelectedTemplate(tmpl);
    setCustomization((prev) => ({
      ...prev,
      templateId: tmpl.id,
      badge: tmpl.defaultBadge,
      headline: prev.headline === STORY_TEMPLATES[0].defaultHeadline ? tmpl.defaultHeadline : prev.headline,
      subtitle: prev.subtitle === STORY_TEMPLATES[0].defaultSubtitle ? tmpl.defaultSubtitle : prev.subtitle,
      accentColor: tmpl.accentColor,
    }));
    sound.click();
  };

  const handleExport = () => {
    triggerExport(() => {
      if (!canvasRef.current) return;
      sound.shutter();
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL("image/png");
      a.download = `sabbir-story-poster-${selectedFormat}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const getSharePayload = () => {
    return {
      type: "story-maker-project",
      format: selectedFormat,
      templateId: selectedTemplate.id,
      badge: customization.badge,
      headline: customization.headline,
      subtitle: customization.subtitle,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="story-maker"
        toolName="Social Story &amp; Reel Cover Studio"
        category="Creative Studio"
        onExportClick={handleExport}
        getSharePayload={getSharePayload}
        previewDataUrl={canvasRef.current?.toDataURL("image/png")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col items-center justify-center min-h-[520px]">
          {/* Format Selector Pills */}
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <span className="text-xs font-mono text-neutral-400">Canvas Format:</span>
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {[
                { id: "story", label: "9:16 (Story)", icon: Smartphone },
                { id: "portrait", label: "4:5 (Post)", icon: Layout },
                { id: "square", label: "1:1 (Square)", icon: Square },
                { id: "landscape", label: "16:9 (Cover)", icon: Monitor },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setSelectedFormat(fmt.id as StoryFormat);
                    sound.click();
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedFormat === fmt.id
                      ? "bg-amber-500 text-neutral-950 font-bold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <fmt.icon className="w-3 h-3" />
                  <span>{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scaled Preview Canvas */}
          <div className="flex-1 flex items-center justify-center max-h-[580px] p-2">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>

        {/* Right Column: Customization Inspector */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-5">
          {/* Template Gallery */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Choose Curated Template</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {STORY_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl)}
                  className={`text-left rounded-xl p-2.5 border transition-all text-xs ${
                    selectedTemplate.id === tmpl.id
                      ? "border-amber-500 bg-amber-500/10 text-white font-semibold"
                      : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  }`}
                >
                  <div className="truncate text-white font-medium">{tmpl.name}</div>
                  <div className="text-[10px] text-neutral-500 capitalize">{tmpl.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text & Content Customization */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Content &amp; Typography
            </h3>

            <div>
              <label htmlFor="badge-text" className="block text-[11px] text-neutral-400 mb-1">
                Badge / Tag Text
              </label>
              <input
                id="badge-text"
                type="text"
                value={customization.badge}
                onChange={(e) => setCustomization({ ...customization, badge: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label htmlFor="headline-text" className="block text-[11px] text-neutral-400 mb-1">
                Headline (Bangla / English)
              </label>
              <textarea
                id="headline-text"
                rows={2}
                value={customization.headline}
                onChange={(e) => setCustomization({ ...customization, headline: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="subtitle-text" className="block text-[11px] text-neutral-400 mb-1">
                Subtitle / Description
              </label>
              <textarea
                id="subtitle-text"
                rows={2}
                value={customization.subtitle}
                onChange={(e) => setCustomization({ ...customization, subtitle: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="author-name" className="block text-[11px] text-neutral-400 mb-1">
                  Author Name
                </label>
                <input
                  id="author-name"
                  type="text"
                  value={customization.authorName}
                  onChange={(e) => setCustomization({ ...customization, authorName: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label htmlFor="brand-handle" className="block text-[11px] text-neutral-400 mb-1">
                  Brand / Social Handle
                </label>
                <input
                  id="brand-handle"
                  type="text"
                  value={customization.brandHandle}
                  onChange={(e) => setCustomization({ ...customization, brandHandle: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Accent &amp; Glow Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.accentColor || "#F59E0B"}
                  onChange={(e) => setCustomization({ ...customization, accentColor: e.target.value })}
                  className="h-8 w-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-xs text-neutral-300">{customization.accentColor}</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="pt-2">
            <button
              onClick={handleExport}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export HD Poster ({selectedFormat.toUpperCase()} · +25 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
