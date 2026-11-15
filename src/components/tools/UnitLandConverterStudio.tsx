"use client";

import React, { useState } from "react";
import {
  Ruler,
  Coins,
  Download,
  Share2,
  Sparkles,
  ArrowRightLeft,
  Building,
  Layers,
  Scale,
  Calculator,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  convertLandFromDecimal,
  convertLandFromKatha,
  convertLandFromSqft,
  convertGoldFromVori,
  convertGoldFromGrams,
  calculateGoldJewelryPrice,
  SQFT_PER_DECIMAL,
  SQFT_PER_KATHA,
} from "@/lib/calc/bd-land-gold-engine";

export function UnitLandConverterStudio() {
  const [activeTab, setActiveTab] = useState<"land" | "gold">("land");

  // Land state
  const [landInputMode, setLandInputMode] = useState<"decimal" | "katha" | "dimensions">("decimal");
  const [decimalVal, setDecimalVal] = useState<number>(10);
  const [plotLengthFt, setPlotLengthFt] = useState<number>(66);
  const [plotWidthFt, setPlotWidthFt] = useState<number>(66);

  // Gold state
  const [goldWeightVori, setGoldWeightVori] = useState<number>(1.5);
  const [goldKarat, setGoldKarat] = useState<"22K" | "21K" | "18K" | "Traditional">("22K");
  const [makingCharge, setMakingCharge] = useState<number>(4000);

  // Computed values
  const currentSqft =
    landInputMode === "dimensions"
      ? plotLengthFt * plotWidthFt
      : landInputMode === "decimal"
      ? decimalVal * SQFT_PER_DECIMAL
      : decimalVal * SQFT_PER_KATHA;

  const landResult = convertLandFromSqft(currentSqft);
  const goldResult = convertGoldFromVori(goldWeightVori);
  const goldPrice = calculateGoldJewelryPrice(goldKarat, goldWeightVori, undefined, makingCharge);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "unit-land-converter",
    toolName: "BD Land & Gold Vori Converter",
  });

  const handleExportTextReport = () => {
    triggerGatedExport(() => {
      let report = "";
      if (activeTab === "land") {
        report = `THE SABBiR OS — BANGLADESH LAND AREA CERTIFICATE\n` +
          `Date: ${new Date().toLocaleDateString()}\n\n` +
          `INPUT AREA: ${currentSqft.toFixed(2)} Square Feet\n` +
          `--------------------------------------------------\n` +
          `• Decimal (শতক/শতাংশ) : ${landResult.decimal} শতক\n` +
          `• Katha (কাঠা)        : ${landResult.katha} কাঠা\n` +
          `• Bigha (বিঘা)        : ${landResult.bigha} বিঘা\n` +
          `• Chotak (ছটাক)       : ${landResult.chotak} ছটাক\n` +
          `• Acre (একর)          : ${landResult.acre} একর\n` +
          `• Square Meter        : ${landResult.sqmeter} বর্গমিটার\n` +
          `--------------------------------------------------\n` +
          `Verified standard: 1 Decimal = 435.6 sq.ft | 1 Katha = 720 sq.ft | 1 Bigha = 20 Katha`;
      } else {
        report = `THE SABBiR OS — BAJUS GOLD & JEWELRY VALUATION CERTIFICATE\n` +
          `Date: ${new Date().toLocaleDateString()}\n\n` +
          `Gold Purity: ${goldPrice.karat}\n` +
          `Weight: ${goldPrice.weightVori} Vori (${goldPrice.weightGrams} Grams / ${goldResult.ana} Ana)\n` +
          `--------------------------------------------------\n` +
          `• Gold Rate per Vori : ৳${goldPrice.ratePerVori.toLocaleString()} BDT\n` +
          `• Gold Base Value    : ৳${goldPrice.goldBasePriceBdt.toLocaleString()} BDT\n` +
          `• Making Charge      : ৳${goldPrice.makingChargeBdt.toLocaleString()} BDT\n` +
          `• 5% Govt VAT        : ৳${goldPrice.vat5PercentBdt.toLocaleString()} BDT\n` +
          `--------------------------------------------------\n` +
          `TOTAL ESTIMATED INVOICE : ৳${goldPrice.totalInvoiceBdt.toLocaleString()} BDT\n` +
          `Standard: 1 Vori = 11.664g = 16 Ana = 96 Ratti`;
      }

      const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeTab === "land" ? "land-area-report" : "bajus-gold-report"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="unit-land-converter"
        toolName="BD Land & Gold Vori Converter"
        category="Business & POS"
        onExportClick={handleExportTextReport}
      />

      {/* Main Mode Tabs & Demo Loader */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 w-full sm:w-fit">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab("land");
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "land"
                ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>জমির পরিমাপ (BD Land Area)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab("gold");
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "gold"
                ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>স্বর্ণের ভরি ও মূল্য (BAJUS Gold)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.confirm();
            if (activeTab === "land") {
              setLandInputMode("katha");
              setDecimalVal(5);
            } else {
              setGoldWeightVori(2.25);
              setGoldKarat("22K");
              setMakingCharge(5000);
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Load Sample / Demo</span>
        </button>
      </div>

      {/* TAB 1: LAND CONVERTER */}
      {activeTab === "land" && (
        <div className="space-y-6">
          {/* Input Controls */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Land Calculation Mode
              </h3>
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setLandInputMode("decimal")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    landInputMode === "decimal"
                      ? "bg-neutral-800 text-amber-400"
                      : "text-neutral-400"
                  }`}
                >
                  By Decimal (শতক)
                </button>
                <button
                  type="button"
                  onClick={() => setLandInputMode("katha")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    landInputMode === "katha" ? "bg-neutral-800 text-amber-400" : "text-neutral-400"
                  }`}
                >
                  By Katha (কাঠা)
                </button>
                <button
                  type="button"
                  onClick={() => setLandInputMode("dimensions")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    landInputMode === "dimensions"
                      ? "bg-neutral-800 text-amber-400"
                      : "text-neutral-400"
                  }`}
                >
                  By Plot Dimensions (Feet)
                </button>
              </div>
            </div>

            {/* Inputs based on Mode */}
            {landInputMode === "dimensions" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Plot Length (দৈর্ঘ্য - Feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plotLengthFt}
                    onChange={(e) => setPlotLengthFt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-lg font-bold text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Plot Width (প্রস্থ - Feet)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plotWidthFt}
                    onChange={(e) => setPlotWidthFt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-lg font-bold text-white font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Enter {landInputMode === "decimal" ? "Decimal / শতক" : "Katha / কাঠা"}:
                </label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 px-3.5 py-2 rounded-xl focus-within:border-amber-400">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={decimalVal}
                    onChange={(e) => setDecimalVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-lg font-bold text-white font-mono outline-none"
                  />
                  <span className="text-xs font-mono text-neutral-400">
                    {landInputMode === "decimal" ? "শতক" : "কাঠা"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Simultaneous Unit Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Decimal / শতক", value: `${landResult.decimal} শতক`, sub: "1 শতক = ৪৩৫.৬ বর্গফুট" },
              { label: "Katha / কাঠা", value: `${landResult.katha} কাঠা`, sub: "1 কাঠা = ৭২০ বর্গফুট" },
              { label: "Bigha / বিঘা", value: `${landResult.bigha} বিঘা`, sub: "1 বিঘা = ২০ কাঠা = ৩৩ শতক" },
              { label: "Chotak / ছটাক", value: `${landResult.chotak} ছটাক`, sub: "1 কাঠা = ১৬ ছটাক" },
              { label: "Square Feet (বর্গফুট)", value: `${landResult.sqft.toLocaleString()} sq.ft`, sub: "মোট এলাকা" },
              { label: "Acre (একর)", value: `${landResult.acre} একর`, sub: "১০০ শতক = ১ একর" },
            ].map((card, idx) => (
              <div
                key={card.label}
                className={`p-4 rounded-2xl border ${
                  idx === 0
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                    : "bg-neutral-900/60 border-neutral-800 text-neutral-200"
                }`}
              >
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  {card.label}
                </span>
                <div className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
                  {card.value}
                </div>
                <span className="text-[10px] text-neutral-500 block mt-1">{card.sub}</span>
              </div>
            ))}
          </div>

          {/* Plot Visualizer */}
          <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Interactive 2D Land Plot Representation
            </span>
            <div className="w-full max-w-sm h-36 border-2 border-dashed border-amber-400/50 rounded-2xl bg-amber-500/5 flex flex-col items-center justify-center p-4 relative shadow-inner">
              <span className="text-xs font-bold text-white">
                {landResult.decimal} শতক ({landResult.katha} কাঠা)
              </span>
              <span className="text-[11px] font-mono text-amber-400 mt-1">
                {currentSqft.toLocaleString()} Square Feet ({landResult.sqmeter} m²)
              </span>
              <span className="absolute -bottom-3 text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 rounded">
                Standard: 1 Bigha = 14,374.8 sq.ft
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOLD & JEWELRY ESTIMATOR */}
      {activeTab === "gold" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                Gold Specifications (BAJUS Standard)
              </h3>

              {/* Weight in Vori */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Weight in Vori (ভরি / Bhori):
                </label>
                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 px-3.5 py-2 rounded-xl focus-within:border-amber-400">
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    value={goldWeightVori}
                    onChange={(e) => setGoldWeightVori(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-transparent text-lg font-bold text-white font-mono outline-none"
                  />
                  <span className="text-xs font-mono text-amber-400">ভরি</span>
                </div>
              </div>

              {/* Karat Selection */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Gold Karat (প্যুরিটি):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["22K", "21K", "18K", "Traditional"] as const).map((karat) => (
                    <button
                      key={karat}
                      type="button"
                      onClick={() => {
                        sound.click();
                        setGoldKarat(karat);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        goldKarat === karat
                          ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm"
                          : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                      }`}
                    >
                      {karat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Making Charge per Vori */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  Making Charge (মজুরি) per Vori:
                </label>
                <input
                  type="number"
                  step="500"
                  value={makingCharge}
                  onChange={(e) => setMakingCharge(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Unit Equivalents Box */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-mono space-y-1 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Weight in Grams:</span>
                  <span className="font-bold text-amber-400">{goldResult.grams} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Weight in Ana:</span>
                  <span>{goldResult.ana} আনা</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Weight in Ratti:</span>
                  <span>{goldResult.ratti} রতি</span>
                </div>
              </div>
            </div>

            {/* Estimated Invoice Card */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Estimated Jewelry Purchase Invoice
              </span>

              <div className="space-y-2.5 font-mono text-xs border-b border-neutral-800 pb-4">
                <div className="flex justify-between text-neutral-300">
                  <span>
                    Base Gold Price ({goldPrice.weightVori} Vori @ ৳{goldPrice.ratePerVori.toLocaleString()}):
                  </span>
                  <span className="font-bold text-white">
                    ৳{goldPrice.goldBasePriceBdt.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-300">
                  <span>Making Charge (মজুরি):</span>
                  <span>+৳{goldPrice.makingChargeBdt.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Government 5% VAT (ভ্যাট):</span>
                  <span>+৳{goldPrice.vat5PercentBdt.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                    Total Estimated Price
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">
                    ৳{goldPrice.totalInvoiceBdt.toLocaleString()} BDT
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExportTextReport}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Valuation Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {AuthGateModalComponent}
    </div>
  );
}
