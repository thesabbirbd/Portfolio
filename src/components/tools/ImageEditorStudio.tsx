"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Type,
  Paintbrush,
  Undo2,
  Redo2,
  Download,
  Share2,
  Sparkles,
  Upload,
  Layers,
  Check,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  ImageEditorState,
  DEFAULT_ADJUSTMENTS,
  LUT_PRESETS,
  renderEditorPipeline,
  CropRatio,
  LutFilter,
} from "@/lib/vision/image-editor-engine";

const SAMPLE_IMAGES = [
  { name: "Urban Portrait", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80" },
  { name: "Neon Cyber City", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80" },
  { name: "Product Chrono Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" },
];

export function ImageEditorStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const [activeTab, setActiveTab] = useState<"adjust" | "filters" | "crop" | "text" | "brush">("adjust");
  const [currentImgUrl, setCurrentImgUrl] = useState<string>(SAMPLE_IMAGES[0].url);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Editor State
  const [editorState, setEditorState] = useState<ImageEditorState>({
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    rotation: 0,
    flipH: false,
    flipV: false,
    filter: "none",
    cropRatio: "free",
    textLayers: [],
    brushStrokes: [],
  });

  // Undo / Redo History Stack
  const historyRef = useRef<ImageEditorState[]>([]);
  const historyIndexRef = useRef<number>(-1);

  // Text layer draft
  const [newText, setNewText] = useState("THE SABBiR OS");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(36);

  // Gated Export Hook
  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "image-editor",
    toolName: "Pro Multi-Layer Image Editor",
  });

  // Push to history
  const pushHistory = useCallback((state: ImageEditorState) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(JSON.parse(JSON.stringify(state)));
    if (nextHistory.length > 20) nextHistory.shift();
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  }, []);

  // Load image
  useEffect(() => {
    setImgLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentImgUrl;
    img.onload = () => {
      imageElementRef.current = img;
      setImgLoaded(true);
      pushHistory(editorState);
    };
  }, [currentImgUrl]);

  // Re-render canvas on state change
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !imageElementRef.current || !imgLoaded) return;
    renderEditorPipeline(canvasRef.current, imageElementRef.current, editorState);
  }, [editorState, imgLoaded]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setEditorState(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])));
      sound.click();
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setEditorState(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])));
      sound.click();
    }
  };

  // Adjustments helper
  const updateAdjustment = (key: keyof typeof DEFAULT_ADJUSTMENTS, val: number) => {
    setEditorState((prev) => {
      const next = {
        ...prev,
        adjustments: { ...prev.adjustments, [key]: val },
      };
      return next;
    });
  };

  // Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImgUrl(url);
      sound.launch();
    }
  };

  // Add text layer
  const handleAddText = () => {
    if (!newText.trim() || !canvasRef.current) return;
    const layer = {
      id: `txt_${Date.now()}`,
      text: newText.trim(),
      x: canvasRef.current.width / 2,
      y: canvasRef.current.height / 2,
      fontSize: textSize,
      color: textColor,
      fontFamily: "sans-serif",
      isBold: true,
    };
    setEditorState((prev) => {
      const next = { ...prev, textLayers: [...prev.textLayers, layer] };
      pushHistory(next);
      return next;
    });
    sound.type();
  };

  // Export Action
  const handleExport = () => {
    triggerExport(() => {
      if (!canvasRef.current) return;
      sound.shutter();
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL("image/png");
      a.download = `sabbir-edited-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const getSharePayload = () => {
    return {
      type: "image-editor-project",
      adjustments: editorState.adjustments,
      filter: editorState.filter,
      cropRatio: editorState.cropRatio,
      rotation: editorState.rotation,
      textLayersCount: editorState.textLayers.length,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="image-editor"
        toolName="Pro Multi-Layer Image Editor"
        category="Vision Studio"
        onExportClick={handleExport}
        getSharePayload={getSharePayload}
        previewDataUrl={canvasRef.current?.toDataURL("image/png")}
      />

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Canvas Viewer & Preview */}
        <div className="lg:col-span-3 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          {/* Top Canvas Toolbar */}
          <div className="w-full flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 pl-2">
                <span>Demos:</span>
                {SAMPLE_IMAGES.map((s, idx) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setCurrentImgUrl(s.url);
                      sound.click();
                    }}
                    className={`rounded-lg px-2 py-1 text-[11px] transition-colors ${
                      currentImgUrl === s.url ? "bg-amber-500 text-black font-semibold" : "bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Undo / Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                title="Undo (Ctrl+Z)"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                title="Redo (Ctrl+Y)"
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 flex items-center justify-center max-w-full max-h-[580px] p-2">
            {!imgLoaded ? (
              <div className="text-center text-xs text-neutral-500 font-mono animate-pulse">
                Loading canvas pixel buffer...
              </div>
            ) : null}
            <canvas
              ref={canvasRef}
              className="max-h-[520px] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>

        {/* Right: Controls & Adjustments Inspector */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-5">
          {/* Tool Modes Tabs */}
          <div className="grid grid-cols-4 rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-center">
            {[
              { id: "adjust", label: "Tuning", icon: Sliders },
              { id: "filters", label: "LUTs", icon: Sparkles },
              { id: "crop", label: "Crop", icon: Crop },
              { id: "text", label: "Text", icon: Type },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  sound.click();
                }}
                className={`flex flex-col items-center justify-center py-2 text-[10px] rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-neutral-950 font-bold shadow"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 mb-0.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* SUB-VIEW 1: ADJUSTMENT SLIDERS */}
          {activeTab === "adjust" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Color &amp; Exposure Engine
              </h3>

              {[
                { label: "Brightness", key: "brightness", min: -100, max: 100 },
                { label: "Contrast", key: "contrast", min: -100, max: 100 },
                { label: "Saturation", key: "saturation", min: -100, max: 100 },
                { label: "Warmth", key: "warmth", min: -100, max: 100 },
                { label: "Vignette", key: "vignette", min: 0, max: 100 },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>{item.label}</span>
                    <span className="font-mono text-amber-400">
                      {editorState.adjustments[item.key as keyof typeof DEFAULT_ADJUSTMENTS]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={editorState.adjustments[item.key as keyof typeof DEFAULT_ADJUSTMENTS]}
                    onChange={(e) => updateAdjustment(item.key as any, parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500"
                  />
                </div>
              ))}

              <button
                onClick={() => {
                  setEditorState((prev) => ({ ...prev, adjustments: { ...DEFAULT_ADJUSTMENTS } }));
                  sound.click();
                }}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-1.5 text-xs text-neutral-300 hover:text-white"
              >
                Reset Adjustments
              </button>
            </div>
          )}

          {/* SUB-VIEW 2: CINEMATIC LUT FILTERS */}
          {activeTab === "filters" && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                12 Cinematic Color Grades
              </h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {LUT_PRESETS.map((lut) => (
                  <button
                    key={lut.id}
                    onClick={() => {
                      setEditorState((prev) => {
                        const next = { ...prev, filter: lut.id };
                        pushHistory(next);
                        return next;
                      });
                      sound.click();
                    }}
                    className={`w-full text-left rounded-xl p-2.5 border transition-all text-xs flex items-center justify-between ${
                      editorState.filter === lut.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 font-semibold"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{lut.name}</div>
                      <div className="text-[10px] text-neutral-500">{lut.desc}</div>
                    </div>
                    {editorState.filter === lut.id && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: CROP & ROTATE */}
          {activeTab === "crop" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Aspect Ratio Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(["free", "1:1", "4:5", "16:9", "9:16"] as CropRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => {
                      setEditorState((prev) => {
                        const next = { ...prev, cropRatio: ratio };
                        pushHistory(next);
                        return next;
                      });
                      sound.click();
                    }}
                    className={`rounded-xl py-2 px-3 text-xs font-medium border text-center uppercase font-mono ${
                      editorState.cropRatio === ratio
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 font-bold"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {ratio === "free" ? "Original (Free)" : ratio}
                  </button>
                ))}
              </div>

              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono pt-2">
                Rotate &amp; Flip
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setEditorState((prev) => {
                      const next = { ...prev, rotation: (prev.rotation + 90) % 360 };
                      pushHistory(next);
                      return next;
                    });
                    sound.click();
                  }}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 py-2 flex flex-col items-center justify-center text-[10px] text-neutral-300 hover:text-white"
                >
                  <RotateCw className="w-4 h-4 mb-1" />
                  <span>+90°</span>
                </button>
                <button
                  onClick={() => {
                    setEditorState((prev) => {
                      const next = { ...prev, flipH: !prev.flipH };
                      pushHistory(next);
                      return next;
                    });
                    sound.click();
                  }}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 py-2 flex flex-col items-center justify-center text-[10px] text-neutral-300 hover:text-white"
                >
                  <FlipHorizontal className="w-4 h-4 mb-1" />
                  <span>Flip H</span>
                </button>
                <button
                  onClick={() => {
                    setEditorState((prev) => {
                      const next = { ...prev, flipV: !prev.flipV };
                      pushHistory(next);
                      return next;
                    });
                    sound.click();
                  }}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 py-2 flex flex-col items-center justify-center text-[10px] text-neutral-300 hover:text-white"
                >
                  <FlipVertical className="w-4 h-4 mb-1" />
                  <span>Flip V</span>
                </button>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: TEXT LAYERS */}
          {activeTab === "text" && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Bangla &amp; English Typography
              </h3>
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Text overlay..."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="range"
                  min={16}
                  max={96}
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value, 10))}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono text-xs text-neutral-400">{textSize}px</span>
              </div>
              <button
                onClick={handleAddText}
                className="w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-400"
              >
                Add Layer to Canvas
              </button>

              {editorState.textLayers.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] text-neutral-400 mb-1">Active Layers:</div>
                  <div className="space-y-1">
                    {editorState.textLayers.map((l, i) => (
                      <div key={l.id} className="rounded-lg bg-neutral-950 p-2 text-xs text-neutral-300 flex justify-between">
                        <span className="truncate">"{l.text}"</span>
                        <button
                          onClick={() => {
                            setEditorState((prev) => ({
                              ...prev,
                              textLayers: prev.textLayers.filter((_, idx) => idx !== i),
                            }));
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export CTA in sidebar */}
          <div className="pt-4 border-t border-neutral-800">
            <button
              onClick={handleExport}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export HD Image (+25 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
