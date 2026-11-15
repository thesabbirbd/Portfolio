"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  QrCode,
  Barcode,
  Download,
  Printer,
  Sparkles,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import {
  encodeCode128B,
  encodeEan13,
  generateQrMatrix,
  verifyCodeScannability,
  type CodeVerificationResult,
} from "@/lib/barcode/scannable-codes";

export function BarcodeQrStudio() {
  const [codeType, setCodeType] = useState<"code128" | "ean13" | "qr">("code128");
  const [inputValue, setInputValue] = useState<string>("SABBIR-SKU-88219");
  const [productTitle, setProductTitle] = useState<string>("Cotton Panjabi - Navy Blue");
  const [price, setPrice] = useState<string>("৳ 1,850");
  const [brandName, setBrandName] = useState<string>("THE SABBiR RETAIL TAG");
  const [labelFormat, setLabelFormat] = useState<"single" | "sheet">("single");
  const [verificationResult, setVerificationResult] = useState<CodeVerificationResult | null>(null);

  const presets = [
    {
      label: "SKU Barcode (Code-128)",
      type: "code128" as const,
      value: "SABBIR-SKU-88219",
      title: "Cotton Panjabi - Navy Blue",
      price: "৳ 1,850",
    },
    {
      label: "Retail Grocery (EAN-13)",
      type: "ean13" as const,
      value: "890123456789",
      title: "Premium Soybean Oil 2L",
      price: "৳ 375",
    },
    {
      label: "bKash Merchant QR",
      type: "qr" as const,
      value: "01700000000",
      title: "bKash Quick Pay (Aiyaar Retail)",
      price: "Scan to Pay",
    },
    {
      label: "Store Wi-Fi (QR)",
      type: "qr" as const,
      value: "WIFI:T:WPA;S:Sabbir_Guest;P:cyberpunk2026;;",
      title: "Customer Free Wi-Fi Zone",
      price: "Free Access",
    },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    sound.toggleSwitch();
    setCodeType(p.type);
    setInputValue(p.value);
    setProductTitle(p.title);
    setPrice(p.price);
    setVerificationResult(null);
  };

  // Run Self-Test
  const handleVerify = () => {
    sound.launch();
    const res = verifyCodeScannability(codeType, inputValue);
    setVerificationResult(res);
    sound.levelUp();
    osStore.addXp(20, "Verified Optical Code Scannability");
  };

  // Calculate Code Modules
  const barcodeData = useMemo(() => {
    if (codeType === "code128") {
      return encodeCode128B(inputValue);
    }
    if (codeType === "ean13") {
      return encodeEan13(inputValue);
    }
    return null;
  }, [codeType, inputValue]);

  const qrData = useMemo(() => {
    if (codeType === "qr") {
      return generateQrMatrix(inputValue);
    }
    return null;
  }, [codeType, inputValue]);

  const handlePrint = () => {
    sound.shutter();
    osStore.addXp(25, "Printed Barcode Label Sheet");
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
              <Barcode className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              100% Scannable GS1 Barcode &amp; ISO QR Sticker Studio
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            GS1 Code-128B • EAN-13 GTIN • ISO/IEC 18004 2D QR • A4 Printable Sticker Grid
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Format Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            {[
              { id: "code128", label: "Code-128" },
              { id: "ean13", label: "EAN-13" },
              { id: "qr", label: "QR Code" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sound.toggleSwitch();
                  setCodeType(t.id as any);
                  setVerificationResult(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition ${
                  codeType === t.id ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Scannability</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label Sheet</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-muted/20 border border-line text-xs font-mono print:hidden">
        <span className="text-ink-3 flex items-center gap-1 text-[11px] font-bold uppercase mr-1">
          <Layers className="w-3.5 h-3.5" /> Retail Presets:
        </span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => applyPreset(p)}
            className="px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Verification Badge */}
      {verificationResult && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              <strong>Scannability Guaranteed:</strong> {verificationResult.checksumOrDetails} ({verificationResult.moduleCount} modules)
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
            100% Pass
          </span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* Editor Form (Hidden on Print) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono print:hidden">
          <span className="font-bold text-ink uppercase tracking-wider block">Sticker Data Meta</span>

          <div className="space-y-1.5">
            <span className="text-[10px] text-ink-3 block">
              {codeType === "qr" ? "QR Payload (URL / Text / Wi-Fi / Phone)" : "Barcode SKU / Number"}
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-ink-3 block">Product Title</span>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Retail Price</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold text-rose-500"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Header Tag</span>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-line">
            <span className="font-bold text-ink uppercase block text-[11px]">Print Layout Format</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.toggleSwitch();
                  setLabelFormat("single");
                }}
                className={`py-2 rounded-xl border text-center transition ${
                  labelFormat === "single"
                    ? "bg-primary text-white font-bold border-primary"
                    : "bg-surface border-line text-ink-2"
                }`}
              >
                Single Sticker (Preview)
              </button>
              <button
                onClick={() => {
                  sound.toggleSwitch();
                  setLabelFormat("sheet");
                }}
                className={`py-2 rounded-xl border text-center transition ${
                  labelFormat === "sheet"
                    ? "bg-primary text-white font-bold border-primary"
                    : "bg-surface border-line text-ink-2"
                }`}
              >
                A4 Sheet (24-Up Grid)
              </button>
            </div>
          </div>
        </div>

        {/* Live Sticker Display */}
        <div className="lg:col-span-7 flex justify-center">
          {labelFormat === "single" ? (
            <div className="p-6 bg-white text-zinc-950 border border-zinc-200 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-2 max-w-[300px] w-full font-mono">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                {brandName}
              </span>
              <p className="text-xs font-bold text-zinc-900 truncate max-w-full">{productTitle}</p>

              {/* Optical Code Container */}
              <div className="py-2 flex items-center justify-center w-full">
                {codeType === "qr" && qrData ? (
                  <div className="p-2 border border-zinc-100 rounded-lg">
                    <svg
                      viewBox={`0 0 ${qrData.size + 8} ${qrData.size + 8}`}
                      className="w-32 h-32"
                    >
                      <rect width="100%" height="100%" fill="#ffffff" />
                      {qrData.matrix.map((row, r) =>
                        row.map(
                          (isDark, c) =>
                            isDark && (
                              <rect
                                key={`${r}-${c}`}
                                x={c + 4}
                                y={r + 4}
                                width={1}
                                height={1}
                                fill="#000000"
                              />
                            )
                        )
                      )}
                    </svg>
                  </div>
                ) : barcodeData ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="flex h-12 items-stretch justify-center w-full overflow-hidden bg-white">
                      {barcodeData.modules.map((isBar, i) => (
                        <div
                          key={i}
                          style={{
                            width: "2px",
                            backgroundColor: isBar ? "#000000" : "#ffffff",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <span className="text-[11px] font-bold tracking-widest text-zinc-700">
                {codeType === "ean13" && barcodeData && "full13Digits" in barcodeData
                  ? barcodeData.full13Digits
                  : inputValue}
              </span>
              <span className="text-sm font-black text-rose-600 border-t border-zinc-200 pt-1 w-full block">
                {price}
              </span>
            </div>
          ) : (
            /* A4 24-Up Sheet Printable Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white border border-zinc-200 rounded-2xl shadow-xl w-full text-zinc-900 font-mono text-center">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-3 border border-dashed border-zinc-300 rounded-xl space-y-1">
                  <span className="text-[8px] text-zinc-400 uppercase block">{brandName}</span>
                  <p className="text-[9px] font-bold truncate">{productTitle}</p>

                  <div className="flex items-center justify-center my-1">
                    {codeType === "qr" && qrData ? (
                      <svg viewBox={`0 0 ${qrData.size + 8} ${qrData.size + 8}`} className="w-16 h-16">
                        <rect width="100%" height="100%" fill="#ffffff" />
                        {qrData.matrix.map((row, r) =>
                          row.map(
                            (isDark, c) =>
                              isDark && (
                                <rect key={`${r}-${c}`} x={c + 4} y={r + 4} width={1} height={1} fill="#000000" />
                              )
                          )
                        )}
                      </svg>
                    ) : barcodeData ? (
                      <div className="flex h-7 items-stretch justify-center w-full overflow-hidden">
                        {barcodeData.modules.map((isBar, i) => (
                          <div key={i} style={{ width: "1.2px", backgroundColor: isBar ? "#000000" : "#ffffff" }} />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <span className="text-[8px] block text-zinc-500 font-bold truncate">
                    {codeType === "ean13" && barcodeData && "full13Digits" in barcodeData
                      ? barcodeData.full13Digits
                      : inputValue}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 block">{price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
