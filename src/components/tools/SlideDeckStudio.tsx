"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Presentation,
  Play,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Palette,
  Layout,
  FileText,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  DEFAULT_MARKDOWN_DECK,
  DECK_THEMES,
  DeckTheme,
  DeckAspect,
  SlideItem,
  parseMarkdownToSlides,
  renderSlideToCanvas,
} from "@/lib/slides/slide-deck-engine";

export function SlideDeckStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN_DECK);
  const [selectedTheme, setSelectedTheme] = useState<DeckTheme>("royal_orange");
  const [aspect, setAspect] = useState<DeckAspect>("16:9");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "slide-deck",
    toolName: "Instant Presentation & Pitch Deck Studio",
  });

  // Parse markdown into slides
  const slides = React.useMemo(() => {
    return parseMarkdownToSlides(markdown);
  }, [markdown]);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Render canvas
  useEffect(() => {
    if (!canvasRef.current || !activeSlide) return;
    renderSlideToCanvas(canvasRef.current, activeSlide, selectedTheme, aspect);
  }, [activeSlide, selectedTheme, aspect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
        sound.click();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
        sound.click();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  const handleExportSlide = () => {
    triggerExport(() => {
      if (!canvasRef.current) return;
      sound.shutter();
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL("image/png");
      a.download = `sabbir-slide-${currentSlideIndex + 1}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const getSharePayload = () => {
    return {
      type: "slide-deck-project",
      slidesCount: slides.length,
      theme: selectedTheme,
      aspect,
      markdown,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="slide-deck"
        toolName="Instant Presentation &amp; Pitch Deck Studio"
        category="Presentation Studio"
        onExportClick={handleExportSlide}
        getSharePayload={getSharePayload}
        previewDataUrl={canvasRef.current?.toDataURL("image/png")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Markdown Outline Editor */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Markdown Outline</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">
              {slides.length} Slides parsed
            </span>
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <textarea
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
                setCurrentSlideIndex(0);
              }}
              rows={16}
              className="w-full flex-1 rounded-2xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs text-neutral-200 font-mono leading-relaxed resize-none focus:border-amber-500 focus:outline-none"
              placeholder="Write your markdown here. Use --- to separate slides..."
            />
            <div className="text-[11px] text-neutral-500 flex justify-between">
              <span>Use <code className="text-amber-400">---</code> for new slide</span>
              <span><code className="text-amber-400">--stat: 100 : Metric</code></span>
            </div>
          </div>
        </div>

        {/* Right Column: Slide Canvas & Presentation Controls */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col justify-between space-y-4">
          {/* Top Canvas Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            {/* Theme Picker */}
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value as DeckTheme);
                  sound.click();
                }}
                className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200"
              >
                {Object.values(DECK_THEMES).map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio Toggle */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => {
                  setAspect("16:9");
                  sound.click();
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  aspect === "16:9" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                16:9 (Deck)
              </button>
              <button
                onClick={() => {
                  setAspect("4:5");
                  sound.click();
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  aspect === "4:5" ? "bg-amber-500 text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                4:5 (Carousel)
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Fullscreen Speaker Mode (F)"
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit" : "Present (F)"}</span>
            </button>
          </div>

          {/* Rendered Slide Canvas */}
          <div className="flex-1 flex items-center justify-center p-2 min-h-[360px]">
            <canvas
              ref={canvasRef}
              className="max-h-[460px] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Slide Deck Navigation Bar */}
          <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentSlideIndex((p) => Math.max(0, p - 1));
                  sound.click();
                }}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 disabled:opacity-40 hover:bg-neutral-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-neutral-300 font-bold px-2">
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
              <button
                onClick={() => {
                  setCurrentSlideIndex((p) => Math.min(slides.length - 1, p + 1));
                  sound.click();
                }}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 disabled:opacity-40 hover:bg-neutral-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExportSlide}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Slide PNG (+25 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
