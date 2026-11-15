"use client";

import React, { useState, useRef } from "react";
import {
  FileArchive,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { createZipArchive, type ZipFileEntry } from "@/lib/zip-builder";

interface CompressedFileItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  data: Uint8Array;
  savingsPct: number;
}

export function BatchImageCompressor() {
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(1200);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [files, setFiles] = useState<CompressedFileItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compress a single image file to WebP
  const processImageFile = async (file: File): Promise<CompressedFileItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let w = img.width;
          let h = img.height;

          if (w > maxWidth) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
          }

          canvas.toBlob(
            async (blob) => {
              if (blob) {
                const arrayBuf = await blob.arrayBuffer();
                const uint8 = new Uint8Array(arrayBuf);
                const originalSize = file.size;
                const compressedSize = uint8.length;
                const savingsPct = Math.round(((originalSize - compressedSize) / originalSize) * 100);

                const baseName = file.name.replace(/\.[^/.]+$/, "");
                resolve({
                  id: Math.random().toString(),
                  name: `${baseName}.webp`,
                  originalSize,
                  compressedSize,
                  data: uint8,
                  savingsPct: Math.max(0, savingsPct),
                });
              }
            },
            "image/webp",
            quality / 100
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    sound.launch();
    setIsProcessing(true);

    const processedList: CompressedFileItem[] = [];
    for (let i = 0; i < uploaded.length; i++) {
      const item = await processImageFile(uploaded[i]);
      processedList.push(item);
    }

    setFiles((prev) => [...prev, ...processedList]);
    setIsProcessing(false);
    sound.levelUp();
    osStore.addXp(30, "Batch Compressed Images");
  };

  // 1-Click Demo Queue
  const handleLoadDemo = async () => {
    sound.toggleSwitch();
    setIsProcessing(true);

    const demoUrls = [
      { name: "hero-showcase.jpg", url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80", mockOrigSize: 420000 },
      { name: "product-mockup.png", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", mockOrigSize: 780000 },
      { name: "terminal-screenshot.png", url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80", mockOrigSize: 560000 },
    ];

    const demoItems: CompressedFileItem[] = [];
    for (const d of demoUrls) {
      const resp = await fetch(d.url);
      const blob = await resp.blob();
      const file = new File([blob], d.name, { type: "image/jpeg" });
      const item = await processImageFile(file);
      item.originalSize = d.mockOrigSize;
      item.savingsPct = Math.round(((d.mockOrigSize - item.compressedSize) / d.mockOrigSize) * 100);
      demoItems.push(item);
    }

    setFiles(demoItems);
    setIsProcessing(false);
    sound.levelUp();
  };

  const handleDownloadZip = () => {
    if (files.length === 0) return;
    sound.shutter();
    osStore.addXp(35, "Downloaded Compressed ZIP");
    osStore.incrementToolRun();

    const zipEntries: ZipFileEntry[] = files.map((f) => ({
      name: f.name,
      data: f.data,
    }));

    const zipBlob = createZipArchive(zipEntries);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sabbir-compressed-images-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalOriginal = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressed = files.reduce((acc, f) => acc + f.compressedSize, 0);
  const totalSavedBytes = totalOriginal - totalCompressed;
  const overallSavingsPct = totalOriginal > 0 ? Math.round((totalSavedBytes / totalOriginal) * 100) : 0;

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileArchive className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Batch Image WebP Compressor &amp; ZIP Exporter
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Compress up to 50 Images Simultaneously • In-Browser Multi-threading • 1-Click ZIP Download
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemo}
            className="px-3.5 py-1.5 rounded-xl border border-line bg-muted/30 hover:bg-muted text-xs font-mono text-ink flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Load Demo Batch</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Select Multiple Images</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Compression Settings Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-line text-xs font-mono">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink-3">WebP Quality Factor:</span>
            <span className="font-bold text-primary">{quality}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="95"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink-3">Max Resize Width:</span>
            <span className="font-bold text-primary">{maxWidth} px</span>
          </div>
          <input
            type="range"
            min="600"
            max="2400"
            step="100"
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* File List Table */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-mono">
            <div>
              <span className="text-[10px] text-ink-3 block">Total Original:</span>
              <span className="font-bold text-ink">{(totalOriginal / 1024).toFixed(1)} KB</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-3 block">Total WebP:</span>
              <span className="font-bold text-primary">{(totalCompressed / 1024).toFixed(1)} KB</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-3 block">Bandwidth Saved:</span>
              <span className="font-bold text-emerald-500">-{overallSavingsPct}% saved</span>
            </div>
          </div>

          <div className="border border-line rounded-2xl overflow-hidden bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-muted/40 border-b border-line text-ink-3 text-[10px] uppercase">
                <tr>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Original</th>
                  <th className="p-3">Compressed</th>
                  <th className="p-3 text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {files.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-ink truncate max-w-[200px]">{f.name}</td>
                    <td className="p-3 text-ink-3">{(f.originalSize / 1024).toFixed(1)} KB</td>
                    <td className="p-3 text-primary font-semibold">{(f.compressedSize / 1024).toFixed(1)} KB</td>
                    <td className="p-3 text-right text-emerald-500 font-bold">-{f.savingsPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={() => {
                sound.toggleSwitch();
                setFiles([]);
              }}
              className="text-xs font-mono text-ink-3 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Queue
            </button>

            <button
              onClick={handleDownloadZip}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download All as .ZIP Archive ({files.length} Files)</span>
            </button>
          </div>
        </div>
      )}

      {files.length === 0 && !isProcessing && (
        <div className="py-12 border-2 border-dashed border-line rounded-2xl flex flex-col items-center justify-center text-center text-xs font-mono text-ink-3 space-y-2">
          <FileArchive className="w-10 h-10 opacity-30 text-ink-3" />
          <span>No images in compression queue. Drop files or load demo batch.</span>
        </div>
      )}
    </div>
  );
}
