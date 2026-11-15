"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Camera,
  Upload,
  Layers,
  Image as ImageIcon,
  Sliders,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import {
  parseLedgerTextLines,
  preprocessReceiptImage,
  generateExcelXml,
  type ParsedKhataRow,
} from "@/lib/ocr/khata-ocr-engine";

const DEMO_PRESETS = [
  {
    label: "Grocery Baki Khata (মুদি দোকানের বাকি)",
    text: `রহিম ভাই - চাল ৫ কেজি ৩৫০ টাকা (PAID)
তেল ২ লিটার ৩৭৫ টাকা (BAKI)
ডাল ১ কেজি ১৩৫ টাকা (PAID)
চিনি ২ কেজি ২৬০ টাকা (BAKI)
পেঁয়াজ ৩ কেজি ২৭০ টাকা (BAKI)
আটা ২ কেজি ১১০ টাকা (PAID)`,
  },
  {
    label: "Pharmacy Memo (ফার্মেসি প্রেসক্রিপশন মেমো)",
    text: `Napa Extra 500mg 2 strip 50 tk (PAID)
Seclo 20mg 3 strip 210 tk (PAID)
Monas 10mg 1 strip 160 tk (BAKI)
Maxpro 20mg 2 strip 140 tk (PAID)
Alatrol 10mg 1 strip 35 tk (BAKI)`,
  },
  {
    label: "Weekly Wholesale Bazar (পাইকারি ফর্দ)",
    text: `রুই মাছ ৫ কেজি ১৮৫০ টাকা (PAID)
দেশি মুরগি ৪ কেজি ১০৮০ টাকা (PAID)
আলু ২০ কেজি ৫৫০ টাকা (BAKI)
রসুন ৩ কেজি ৪৮০ টাকা (PAID)
সয়াবিন তেল ১০ লিটার ১৮৫০ টাকা (BAKI)`,
  },
];

export function KhataScannerStudio() {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState<string>(DEMO_PRESETS[0].text);
  const [shopName, setShopName] = useState<string>("THE SABBiR RETAIL & TRADING");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Image OCR Mode States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [contrastLevel, setContrastLevel] = useState<number>(1.8);
  const [binarizeThreshold, setBinarizeThreshold] = useState<number>(135);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Parse text into structured rows
  const parsedResult = parseLedgerTextLines(inputText);
  const [rows, setRows] = useState<ParsedKhataRow[]>(parsedResult.rows);

  useEffect(() => {
    const res = parseLedgerTextLines(inputText);
    setRows(res.rows);
  }, [inputText]);

  // Handle Image Upload & Pre-processing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.launch();
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageSrc(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Run Canvas Binarization
  useEffect(() => {
    if (!imageSrc || activeTab !== "image") return;
    setIsProcessingImage(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      const raw = ctx.getImageData(0, 0, w, h);

      const processed = preprocessReceiptImage(raw, {
        contrast: contrastLevel,
        binarizeThreshold,
      });

      ctx.putImageData(processed, 0, 0);
      setIsProcessingImage(false);
    };
    img.src = imageSrc;
  }, [imageSrc, contrastLevel, binarizeThreshold, activeTab]);

  // Load Sample Receipt Photo
  const handleLoadSamplePhoto = () => {
    sound.toggleSwitch();
    // High-contrast printed receipt sample
    setImageSrc("https://images.unsplash.com/photo-1554415707-9e4901f46487?w=800&q=80");
  };

  const handleToggleStatus = (idx: number) => {
    sound.toggleSwitch();
    const updated = [...rows];
    updated[idx].status = updated[idx].status === "PAID" ? "BAKI" : "PAID";
    setRows(updated);
  };

  const handleAddRow = () => {
    sound.type();
    const newRow: ParsedKhataRow = {
      sl: rows.length + 1,
      itemName: "নতুন আইটেম (New Item)",
      quantity: "1 pc",
      price: 150,
      status: "PAID",
      rawText: "Manual entry",
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (idx: number) => {
    sound.toggleSwitch();
    const updated = rows.filter((_, i) => i !== idx);
    setRows(updated.map((r, i) => ({ ...r, sl: i + 1 })));
  };

  const totalPaid = rows.filter((r) => r.status === "PAID").reduce((a, b) => a + b.price, 0);
  const totalBaki = rows.filter((r) => r.status === "BAKI").reduce((a, b) => a + b.price, 0);
  const grandTotal = totalPaid + totalBaki;

  // Export CSV
  const handleDownloadCsv = () => {
    sound.shutter();
    osStore.addXp(25, "Exported Khata CSV");
    osStore.incrementToolRun();

    let csv = `SL,Item Description,Quantity,Price (BDT),Status\n`;
    rows.forEach((r) => {
      csv += `${r.sl},"${r.itemName}","${r.quantity}",${r.price},${r.status}\n`;
    });
    csv += `\nTotal Cash Paid,,,${totalPaid},\nTotal Baki Due,,,${totalBaki},\nGrand Total,,,${grandTotal},\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `khata-ledger-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Export Excel (.xls / .xlsx XML)
  const handleDownloadExcel = () => {
    sound.levelUp();
    osStore.addXp(35, "Exported Multi-Sheet Excel");
    osStore.incrementToolRun();

    const xml = generateExcelXml({
      rows,
      totalPaid,
      totalBaki,
      grandTotal,
      rawExtractedLines: [],
    }, shopName);

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `khata-ledger-${Date.now()}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              AI Khata &amp; Receipt to Excel OCR Scanner Studio
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Bangla-English Numeral Extraction • Baki vs Cash Segregator • Excel (.xls) &amp; CSV Export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Switch */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("text");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "text" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              Text &amp; Voice Pad
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("image");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "image" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              Camera &amp; Image OCR
            </button>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel (.xls)</span>
          </button>
        </div>
      </div>

      {/* Preset Selector (Text Mode) */}
      {activeTab === "text" ? (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
          <span className="text-ink-3 flex items-center gap-1 text-[11px] font-bold uppercase mr-1">
            <Layers className="w-3.5 h-3.5" /> Khata Presets:
          </span>
          {DEMO_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                sound.toggleSwitch();
                setInputText(p.text);
              }}
              className="px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : (
        /* Image OCR Controls */
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold flex items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Receipt Photo</span>
            </button>
            <button
              onClick={handleLoadSamplePhoto}
              className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink flex items-center gap-1.5 transition"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Load Sample Receipt</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span>Contrast:</span>
              <input
                type="range"
                min={1.0}
                max={3.0}
                step={0.1}
                value={contrastLevel}
                onChange={(e) => setContrastLevel(Number(e.target.value))}
                className="w-20 accent-primary"
              />
              <span className="font-bold">{contrastLevel}x</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Threshold:</span>
              <input
                type="range"
                min={80}
                max={200}
                value={binarizeThreshold}
                onChange={(e) => setBinarizeThreshold(Number(e.target.value))}
                className="w-20 accent-primary"
              />
              <span className="font-bold">{binarizeThreshold}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Pane */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === "text" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-ink-2">
                <span>Raw Ledger Lines (বাংলা বা ইংরেজি):</span>
                <span className="text-[10px] text-ink-3">Auto-Parses Price &amp; Status</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl bg-surface border border-line font-mono text-xs text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="রহিম ভাই - চাল ৫ কেজি ৩৫০ টাকা (PAID)..."
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-muted/10 border border-line flex flex-col items-center justify-center min-h-[360px]">
              {imageSrc ? (
                <div className="space-y-2 text-center w-full">
                  <span className="text-[11px] font-mono font-bold text-ink-2 block">
                    Binarized Pre-Processed OCR View
                  </span>
                  <div className="border border-line rounded-xl overflow-hidden max-h-[300px] flex items-center justify-center bg-white shadow-inner">
                    <canvas ref={canvasRef} className="max-w-full max-h-[290px] h-auto object-contain" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 block">
                    Ready for character-segmentation and line-parser
                  </span>
                </div>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-ink-4 mx-auto" />
                  <p className="text-xs font-mono text-ink-3">
                    Upload a photo of your paper ledger or cash memo to run in-browser OCR pre-processing.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Parsed Table Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink uppercase tracking-wider">Structured Digital Ledger</span>
            <button
              onClick={handleAddRow}
              className="px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-muted text-ink flex items-center gap-1 transition"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          <div className="border border-line rounded-2xl overflow-hidden bg-surface shadow-sm">
            <div className="max-h-[380px] overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-muted/30 border-b border-line text-ink-3 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/10 transition">
                      <td className="p-3 text-center text-ink-3 text-[11px]">{row.sl}</td>
                      <td className="p-3 font-medium text-ink">{row.itemName}</td>
                      <td className="p-3 text-ink-3 text-[11px]">{row.quantity}</td>
                      <td className="p-3 text-right font-bold text-ink">৳ {row.price}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(idx)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition ${
                            row.status === "PAID"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                          }`}
                        >
                          {row.status}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemoveRow(idx)}
                          className="text-ink-3 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer Cards */}
            <div className="p-4 bg-muted/20 border-t border-line grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-emerald-600 block font-bold uppercase">Cash Paid</span>
                <span className="text-sm font-bold text-ink">৳ {totalPaid.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-rose-600 block font-bold uppercase">Total Baki</span>
                <span className="text-sm font-bold text-rose-600">৳ {totalBaki.toLocaleString()}</span>
              </div>
              <div className="p-2 rounded-xl bg-surface border border-line">
                <span className="text-[10px] text-primary block font-bold uppercase">Grand Total</span>
                <span className="text-sm font-bold text-ink">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
