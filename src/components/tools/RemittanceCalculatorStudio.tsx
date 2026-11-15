"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Smartphone,
  Info,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import { calculateRemittanceCorridors } from "@/lib/finance/remittance-engine";

export function RemittanceCalculatorStudio() {
  const [grossUsd, setGrossUsd] = useState<number>(1000);

  const { results, winner, bestVsWorstDifferenceBdt } = calculateRemittanceCorridors(grossUsd);

  // Setup Gated Export
  const { triggerGatedExport, AuthGateModalComponent } = useGatedExport({
    toolSlug: "remittance-calculator",
    toolName: "Freelancer Remittance Calculator",
  });

  const handleExportCsv = () => {
    triggerGatedExport(() => {
      let csv = "Corridor,Gross USD,Platform Fee USD,Base BDT,2.5% Govt Incentive,Cashout Fee,Net BDT in Hand,Effective Rate\n";
      results.forEach((r) => {
        csv += `"${r.corridor.name}",${r.grossUsd},${r.platformFeeUsd},${r.baseBdt},${r.govtIncentiveBdt},${r.cashoutFeeBdt},${r.netInHandBdt},${r.effectiveRatePerUsd}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `remittance-incentive-report-${grossUsd}usd.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="remittance-calculator"
        toolName="Freelancer Remittance Calculator"
        category="Business & POS"
        onExportClick={handleExportCsv}
      />

      {/* Hero Overview & Gross USD Input */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Bangladesh Bank 2.5% Cash Incentive Eligible
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Freelancer Remittance &amp; Payout Corridor Optimizer
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl">
              Compare Payoneer, Wise, Direct SWIFT and bKash. Find out exactly how much net Taka
              you receive after platform FX spreads, ATM fees, and government cash bonuses.
            </p>
          </div>

          {/* USD Input & Presets */}
          <div className="w-full md:w-auto flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 focus-within:border-amber-400 px-3.5 py-2 rounded-2xl shadow-inner">
              <span className="text-neutral-500 font-mono text-sm">$</span>
              <input
                type="number"
                min="50"
                max="50000"
                step="50"
                value={grossUsd}
                onChange={(e) => setGrossUsd(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-28 bg-transparent text-lg font-bold text-white font-mono outline-none"
              />
              <span className="text-xs font-mono text-neutral-400">USD</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[250, 500, 1000, 2500, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    sound.click();
                    setGrossUsd(preset);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                    grossUsd === preset
                      ? "bg-amber-500 text-neutral-950 font-bold"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Winner Strip */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">HIGHEST NET PAYOUT:</span>
                <span className="text-xs text-white font-semibold">{winner.corridor.name}</span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Yields <span className="font-bold text-white">৳{winner.netInHandBdt.toLocaleString()} BDT</span> in hand (Effective Rate: ৳{winner.effectiveRatePerUsd} / $1).
              </p>
            </div>
          </div>

          {bestVsWorstDifferenceBdt > 0 && (
            <div className="text-right shrink-0">
              <span className="text-[11px] text-neutral-400 block font-mono">You save vs lowest route:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                +৳{bestVsWorstDifferenceBdt.toLocaleString()} BDT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Corridors List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          All Payout Corridors (Ranked by Net In-Hand Taka)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r, idx) => {
            const isWinner = idx === 0;
            return (
              <div
                key={r.corridor.id}
                className={`p-5 rounded-3xl border transition-all relative flex flex-col justify-between ${
                  isWinner
                    ? "bg-neutral-900/90 border-emerald-500/50 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {isWinner && (
                  <span className="absolute -top-2.5 right-6 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-neutral-950 shadow">
                    Rank #1 Best Route
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      {r.corridor.destination.includes("bKash") ? (
                        <Smartphone className="w-4 h-4 text-pink-400" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-400" />
                      )}
                      {r.corridor.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                      {r.corridor.speed}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-4">{r.corridor.description}</p>

                  {/* Financial Breakdown Table */}
                  <div className="space-y-1.5 text-xs font-mono bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80">
                    <div className="flex justify-between text-neutral-400">
                      <span>Gross USD &amp; Platform Fee:</span>
                      <span>
                        ${r.grossUsd} - ${r.platformFeeUsd} = ${r.netUsd}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-400">
                      <span>Base Conversion Rate:</span>
                      <span>@{r.corridor.exchangeRateBdt} ➔ ৳{r.baseBdt.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>+ 2.5% Bangladesh Bank Incentive:</span>
                      <span>+৳{r.govtIncentiveBdt.toLocaleString()}</span>
                    </div>

                    {r.cashoutFeeBdt > 0 && (
                      <div className="flex justify-between text-rose-400">
                        <span>- Agent Cashout Fee ({r.corridor.cashoutFeePercent}%):</span>
                        <span>-৳{r.cashoutFeeBdt.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Net in Hand Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                      Net Taka in Hand
                    </span>
                    <span className="text-lg font-bold text-white font-mono">
                      ৳{r.netInHandBdt.toLocaleString()} BDT
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                      Effective Rate
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      ৳{r.effectiveRatePerUsd} / $1
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {AuthGateModalComponent}
    </div>
  );
}
