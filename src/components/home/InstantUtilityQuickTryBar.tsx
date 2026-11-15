"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, Copy, Wrench, DollarSign, Scale } from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { takaInBanglaWords, takaInEnglishWords } from "@/lib/banking/taka-in-words";
import { generateQrMatrix } from "@/lib/barcode/qr-matrix-encoder";
import { calculateRemittanceCorridors } from "@/lib/finance/remittance-engine";
import { convertLandFromDecimal } from "@/lib/calc/bd-land-gold-engine";

type QuickTab = "taka" | "remittance" | "land" | "qr" | "cron";

export function InstantUtilityQuickTryBar() {
  const [activeTab, setActiveTab] = useState<QuickTab>("taka");

  // Tab 1: Taka state
  const [takaInput, setTakaInput] = useState<string>("125450");

  // Tab 2: Remittance state
  const [remitInput, setRemitInput] = useState<string>("1000");

  // Tab 3: Land state
  const [landInput, setLandInput] = useState<string>("5");

  // Tab 4: QR state
  const [qrInput, setQrInput] = useState<string>("https://sabbir.nav.bd");

  // Tab 5: Cron state
  const [cronInput, setCronInput] = useState<string>("*/15 * * * *");

  const [copied, setCopied] = useState<boolean>(false);

  // Compute live outputs
  const numVal = parseFloat(takaInput.replace(/,/g, "")) || 0;
  const banglaWords = numVal > 0 ? takaInBanglaWords(numVal) : "শূন্য টাকা মাত্র";
  const englishWords = numVal > 0 ? takaInEnglishWords(numVal) : "Zero Taka Only";

  const remitAmount = parseFloat(remitInput) || 0;
  const remitCorridors = calculateRemittanceCorridors(remitAmount);
  const remitResult = remitCorridors.winner;

  const landAmount = parseFloat(landInput) || 0;
  const landResult = convertLandFromDecimal(landAmount);

  const qrMatrix = generateQrMatrix(qrInput || "https://sabbir.nav.bd");

  const handleCopy = async (text: string) => {
    sound.copy();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    osStore.addXp(10, "Copied Instant Utility Output");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-8">
      <div className="bg-surface border border-line rounded-3xl p-5 sm:p-7 shadow-sm font-sans space-y-5">
        {/* Top Header & Tab Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ink">
                Instant Utility Sandbox · 100% Client-Side Engine
              </h3>
              <p className="text-[11px] text-ink-3">
                Try verified zero-cloud algorithms live without leaving the homepage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-line" role="tablist">
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("taka");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === "taka" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              🏦 Taka-in-Words
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("remittance");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === "remittance" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              💵 Remit 2.5%
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("land");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === "land" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              📐 Land Math
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("qr");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === "qr" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              🏷️ QR Matrix
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setActiveTab("cron");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                activeTab === "cron" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              ⏰ Cron
            </button>
          </div>
        </div>

        {/* Tab 1: Taka in Words */}
        {activeTab === "taka" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-ink-3 block">
                Enter Amount (BDT):
              </label>
              <input
                type="text"
                value={takaInput}
                onChange={(e) => setTakaInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-line text-ink font-mono text-base font-bold focus:outline-none focus:border-primary"
                placeholder="e.g. 125450"
              />
              <div className="flex items-center gap-2 pt-1">
                {["500", "125450", "2500000", "15000000"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setTakaInput(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-ink-3"
                  >
                    ৳{sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2 relative">
              <div className="text-[10px] font-mono text-primary font-bold uppercase">
                Bank Standard Words (Bangla &amp; English):
              </div>
              <p className="text-sm font-bold text-ink leading-snug">{banglaWords}</p>
              <p className="text-xs text-ink-2 font-mono">{englishWords}</p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(banglaWords)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Words"}</span>
                </button>
                <Link
                  href="/tools/cheque-audit"
                  className="text-[11px] font-mono text-ink-3 hover:text-ink inline-flex items-center gap-1"
                >
                  <span>Open Full Cheque Guard</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Remittance 2.5% Incentive */}
        {activeTab === "remittance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-ink-3 block">
                Freelancer Payout (USD):
              </label>
              <input
                type="number"
                value={remitInput}
                onChange={(e) => setRemitInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-line text-ink font-mono text-base font-bold focus:outline-none focus:border-primary"
                placeholder="e.g. 1000"
              />
              <div className="flex items-center gap-2 pt-1">
                {["100", "500", "1000", "2500"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setRemitInput(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-ink-3"
                  >
                    ${sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2 relative">
              <div className="text-[10px] font-mono text-primary font-bold uppercase flex items-center justify-between">
                <span>Govt 2.5% Cash Incentive Breakdown:</span>
                <span className="text-emerald-500 font-bold">BB Approved</span>
              </div>
              <div className="text-sm font-bold text-ink leading-snug">
                Net in Bank: <span className="text-primary font-mono text-base">৳{remitResult.netInHandBdt.toLocaleString()}</span>
              </div>
              <p className="text-xs text-ink-2 font-mono">
                Base: ৳{remitResult.baseBdt.toLocaleString()} + 2.5% Aid: +৳{remitResult.govtIncentiveBdt.toLocaleString()} ({remitResult.corridor.name})
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(`Net: ৳${remitResult.netInHandBdt.toLocaleString()} (including 2.5% Govt Incentive ৳${remitResult.govtIncentiveBdt.toLocaleString()}) via ${remitResult.corridor.name}`)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Breakdown"}</span>
                </button>
                <Link
                  href="/tools/remittance-calculator"
                  className="text-[11px] font-mono text-ink-3 hover:text-ink inline-flex items-center gap-1"
                >
                  <span>Open Full Remit Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Land Measurement Converter */}
        {activeTab === "land" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-ink-3 block">
                Enter Land Area (Decimal / শতক):
              </label>
              <input
                type="number"
                value={landInput}
                onChange={(e) => setLandInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-line text-ink font-mono text-base font-bold focus:outline-none focus:border-primary"
                placeholder="e.g. 5"
              />
              <div className="flex items-center gap-2 pt-1">
                {["1", "3.5", "5", "10", "33"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setLandInput(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-ink-3"
                  >
                    {sample} শতক
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2 relative">
              <div className="text-[10px] font-mono text-primary font-bold uppercase flex items-center justify-between">
                <span>Standard BD Land Conversion:</span>
                <span className="text-primary font-mono">{landAmount} Decimal</span>
              </div>
              <div className="text-sm font-bold text-ink leading-snug">
                = <span className="text-primary font-mono">{landResult.katha.toFixed(3)}</span> Katha (কাঠা)
              </div>
              <p className="text-xs text-ink-2 font-mono">
                {landResult.sqft.toLocaleString()} Sq.Ft · {landResult.bigha.toFixed(4)} Bigha (বিঘা)
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(`${landAmount} Decimal = ${landResult.katha.toFixed(3)} Katha = ${landResult.sqft.toLocaleString()} Sq.Ft`)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Conversion"}</span>
                </button>
                <Link
                  href="/tools/unit-land-converter"
                  className="text-[11px] font-mono text-ink-3 hover:text-ink inline-flex items-center gap-1"
                >
                  <span>Open Land &amp; Gold Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ISO QR Matrix */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-ink-3 block">
                QR Payload (URL, bKash, or Text):
              </label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-line text-ink font-mono text-xs focus:outline-none focus:border-primary"
                placeholder="https://..."
              />
              <div className="flex items-center gap-2 pt-1">
                {["https://sabbir.nav.bd", "tel:01711000000", "WIFI:S:MyNetwork;T:WPA;P:secret;;"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQrInput(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-ink-3 truncate max-w-[140px]"
                  >
                    {sample.split(":")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-line flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase block">
                  ✓ Scannable ISO/IEC 18004
                </span>
                <span className="text-xs font-bold text-ink">
                  {qrMatrix.size}x{qrMatrix.size} Matrix Modules
                </span>
                <p className="text-[11px] text-ink-3 font-mono">
                  Reed-Solomon Level M Error Correction
                </p>
                <Link
                  href="/tools/barcode-studio"
                  className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Download SVG &amp; A4 Labels ↗</span>
                </Link>
              </div>

              {/* Live SVG Matrix Render */}
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                <svg
                  width={96}
                  height={96}
                  viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}
                  className="shape-rendering-crisp"
                >
                  {qrMatrix.matrix.map((row: boolean[], r: number) =>
                    row.map((cell: boolean, c: number) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width={1}
                          height={1}
                          fill="#000000"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cron Humanizer */}
        {activeTab === "cron" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-ink-3 block">
                Cron Expression (5-Fields):
              </label>
              <input
                type="text"
                value={cronInput}
                onChange={(e) => setCronInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-line text-ink font-mono text-sm font-bold focus:outline-none focus:border-primary"
                placeholder="*/15 * * * *"
              />
              <div className="flex items-center gap-2 pt-1">
                {["*/5 * * * *", "0 3 * * *", "0 0 1 * *"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setCronInput(sample)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-ink-3"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2">
              <div className="text-[10px] font-mono text-primary font-bold uppercase">
                Human Schedule Translation:
              </div>
              <p className="text-xs font-bold text-ink leading-snug">
                Runs every 15 minutes past the hour, every day.
              </p>
              <p className="text-[11px] text-ink-3 font-mono">
                🇧🇩 প্রতি ১৫ মিনিট অন্তর অন্তর স্বয়ংক্রিয়ভাবে এক্সিকিউট হবে।
              </p>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/tools/cron-english"
                  className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Full Cron &amp; systemd Studio ↗</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Launch Everyday Studios Strip */}
        <div className="pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[11px] text-ink-3">⚡ Everyday App-Replacement Studios:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link href="/tools/image-editor" onClick={() => sound.click()} className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition">🎨 Image Editor</Link>
            <Link href="/tools/story-maker" onClick={() => sound.click()} className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition">📱 Story Maker</Link>
            <Link href="/tools/audio-editor" onClick={() => sound.click()} className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition">🎧 Audio DAW</Link>
            <Link href="/tools/spreadsheet-grid" onClick={() => sound.click()} className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-ink-2 hover:text-ink text-[11px] transition">📊 Spreadsheet</Link>
            <Link href="/leaderboard" onClick={() => sound.click()} className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-[11px] transition">🏆 Leaderboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
