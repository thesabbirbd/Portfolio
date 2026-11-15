"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Upload,
  Plus,
  Trash2,
  RotateCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown,
  Printer,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface DocumentPage {
  id: string;
  name: string;
  rotation: number; // 0, 90, 180, 270
  dataUrl: string;
  selected: boolean;
}

export function PdfToolkitStudio() {
  const [pages, setPages] = useState<DocumentPage[]>([
    {
      id: "p1",
      name: "Page 1 - National ID Scan",
      rotation: 0,
      dataUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
      selected: true,
    },
    {
      id: "p2",
      name: "Page 2 - Bank Statement Summary",
      rotation: 0,
      dataUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
      selected: true,
    },
  ]);

  const [stampText, setStampText] = useState<string>("THE SABBiR VERIFIED — CONFIDENTIAL");
  const [applyStamp, setApplyStamp] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    sound.launch();
    const newPages: DocumentPage[] = [];

    Array.from(uploaded).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        newPages.push({
          id: `upload-${Date.now()}-${idx}`,
          name: file.name,
          rotation: 0,
          dataUrl: evt.target?.result as string,
          selected: true,
        });
        if (newPages.length === uploaded.length) {
          setPages((prev) => [...prev, ...newPages]);
          sound.levelUp();
          osStore.addXp(25, "Imported Document Pages");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRotate = (id: string) => {
    sound.toggleSwitch();
    setPages(
      pages.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    sound.toggleSwitch();
    const nextIdx = direction === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= pages.length) return;

    const updated = [...pages];
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;
    setPages(updated);
  };

  const handleToggleSelect = (id: string) => {
    sound.toggleSwitch();
    setPages(
      pages.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleRemove = (id: string) => {
    sound.toggleSwitch();
    setPages(pages.filter((p) => p.id !== id));
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  const handleExportMerged = () => {
    sound.shutter();
    osStore.addXp(35, "Merged and Stamped Documents");
    osStore.incrementToolRun();
    window.print();
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              100% Private In-Browser PDF &amp; Document Page Suite
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Zero Server Uploads • Multi-Page Combiner • Page Rotation &amp; Splitter • Verification Stamp
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Pages / Scans</span>
          </button>

          <button
            onClick={handleExportMerged}
            disabled={selectedCount === 0}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Merged PDF ({selectedCount} Pages)</span>
          </button>
        </div>
      </div>

      {/* Toolkit Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-line text-xs font-mono print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={applyStamp}
              onChange={(e) => setApplyStamp(e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
            <span className="font-bold text-ink">Apply Security Stamp</span>
          </div>
          {applyStamp && (
            <input
              type="text"
              value={stampText}
              onChange={(e) => setStampText(e.target.value)}
              className="px-3 py-1 rounded-xl bg-surface border border-line text-ink text-[11px] w-64"
            />
          )}
        </div>

        <span className="text-[11px] text-ink-3">
          Total Pages: <strong className="text-ink">{pages.length}</strong> (Selected:{" "}
          <strong className="text-primary">{selectedCount}</strong>)
        </span>
      </div>

      {/* Pages Workspace Grid */}
      <div className="space-y-4 print:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:block">
          {pages.map((p, idx) => (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border transition relative space-y-3 print:border-none print:shadow-none print:p-0 print:mb-8 ${
                p.selected ? "bg-surface border-line shadow-sm" : "bg-muted/10 border-dashed border-line opacity-50"
              }`}
            >
              {/* Card Header (Controls hidden on print) */}
              <div className="flex items-center justify-between text-xs font-mono border-b border-line pb-2 print:hidden">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => handleToggleSelect(p.id)}
                    className="h-3.5 w-3.5 rounded accent-primary cursor-pointer"
                  />
                  <span className="font-bold text-ink truncate max-w-[140px]">{p.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRotate(p.id)}
                    className="p-1 rounded-lg hover:bg-muted text-ink-3 hover:text-ink transition"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-muted text-ink-3 hover:text-ink transition disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === pages.length - 1}
                    className="p-1 rounded-lg hover:bg-muted text-ink-3 hover:text-ink transition disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="p-1 rounded-lg hover:bg-muted text-rose-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Page Canvas/Image Viewer */}
              <div className="relative border border-line rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 min-h-[220px]">
                <img
                  src={p.dataUrl}
                  alt={p.name}
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                  className="max-h-[200px] w-auto object-contain transition-transform duration-200"
                />

                {/* Verification Stamp Overlay */}
                {applyStamp && p.selected && (
                  <div className="absolute bottom-2 left-2 right-2 border-t border-rose-300 bg-rose-50/90 text-rose-600 font-mono text-[9px] font-bold text-center py-1 px-2 rounded backdrop-blur-sm">
                    {stampText}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-[10px] font-mono text-ink-3 print:hidden">
                <span>Page #{idx + 1}</span>
                <span>Rotation: {p.rotation}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
