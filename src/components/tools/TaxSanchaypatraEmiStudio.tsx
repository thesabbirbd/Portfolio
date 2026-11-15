"use client";

import React, { useState, useMemo } from "react";
import {
  Receipt,
  PiggyBank,
  Building,
  Download,
  Sparkles,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  calculateBdIncomeTax,
  calculateSanchaypatraProfit,
  calculateLoanEmi,
  TaxpayerCategory,
  LocationZone,
  SanchaypatraType,
} from "@/lib/finance/tax-sanchaypatra-engine";
import { sound } from "@/lib/sound";

export function TaxSanchaypatraEmiStudio() {
  const [activeTab, setActiveTab] = useState<"tax" | "sanchaypatra" | "emi">("tax");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: Income Tax
  const [annualIncome, setAnnualIncome] = useState<number>(850000);
  const [taxCategory, setTaxCategory] = useState<TaxpayerCategory>("general");
  const [locationZone, setLocationZone] = useState<LocationZone>("dhaka_ctg");
  const [actualInvestment, setActualInvestment] = useState<number>(100000);

  // Tab 2: Sanchaypatra
  const [scheme, setScheme] = useState<SanchaypatraType>("paribar");
  const [sanchayAmount, setSanchayAmount] = useState<number>(1000000);

  // Tab 3: Loan EMI
  const [loanPrincipal, setLoanPrincipal] = useState<number>(2000000);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(9.0);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(60);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "tax-sanchaypatra-emi",
    toolName: "BD Tax, Sanchaypatra & EMI Studio",
  });

  const taxResult = useMemo(
    () => calculateBdIncomeTax(annualIncome, taxCategory, locationZone, actualInvestment),
    [annualIncome, taxCategory, locationZone, actualInvestment]
  );

  const sanchayResult = useMemo(
    () => calculateSanchaypatraProfit(scheme, sanchayAmount),
    [scheme, sanchayAmount]
  );

  const emiResult = useMemo(
    () => calculateLoanEmi(loanPrincipal, loanInterestRate, loanTenureMonths),
    [loanPrincipal, loanInterestRate, loanTenureMonths]
  );

  const handleDownloadSheet = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = "#09090B";
      ctx.fillRect(0, 0, 1200, 1400);

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 1140, 1340);

      // Header Banner
      ctx.fillStyle = "#18181B";
      ctx.fillRect(40, 40, 1120, 180);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("📑 THE SABBiR OS — TAX & WEALTH ADVISORY STATEMENT", 80, 95);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      const title =
        activeTab === "tax"
          ? "BD Individual Income Tax Assessment (FY 2025-26)"
          : activeTab === "sanchaypatra"
          ? `${sanchayResult.schemeTitleBn} Profit Summary`
          : "Bank Loan Monthly EMI & Amortization Schedule";
      ctx.fillText(title, 80, 145);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px monospace";
      ctx.fillText(`Assessment Year: 2026-27 · sabbir.nav.bd`, 80, 180);

      // Hero Stat Card
      let y = 260;
      ctx.fillStyle = "#18181B";
      ctx.fillRect(80, y, 1040, 160);
      ctx.strokeStyle = "#27272A";
      ctx.strokeRect(80, y, 1040, 160);

      if (activeTab === "tax") {
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${taxResult.finalTaxPayableBdt.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("সর্বমোট প্রদেয় আয়কর (Net Tax)", 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`কার্যকর করের হার: ${taxResult.effectiveTaxRatePercent}%`, 640, y + 110);
      } else if (activeTab === "sanchaypatra") {
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${sanchayResult.netMonthlyTakeHomeBdt.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("নিট মাসিক মুনাফা (হাতে পাবেন)", 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`উৎসের কর কর্তন: ${sanchayResult.sourceTaxPercent}%`, 640, y + 110);
      } else {
        ctx.fillStyle = "#38BDF8";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${emiResult.monthlyEmiBdt.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("প্রতি মাসের কিস্তি (Monthly EMI)", 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`মোট সুদ: ৳ ${emiResult.totalInterestPayableBdt.toLocaleString("bn-BD")}`, 640, y + 110);
      }

      // Breakdown Lines
      y += 200;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Financial Details & Slabs Breakdown:", 80, y);

      y += 35;
      const lines =
        activeTab === "tax"
          ? taxResult.slabs.map((s) => [s.slabName, `৳ ${s.taxBdt.toLocaleString("bn-BD")}`])
          : activeTab === "sanchaypatra"
          ? [
              ["মোট মূল বিনিয়োগ (Principal):", `৳ ${sanchayResult.investmentAmount.toLocaleString("bn-BD")}`],
              ["বাৎসরিক মোট মুনাফা (Gross):", `৳ ${sanchayResult.grossAnnualProfitBdt.toLocaleString("bn-BD")}`],
              ["মাসিক কর কর্তন:", `৳ ${sanchayResult.taxDeductedMonthlyBdt.toLocaleString("bn-BD")}`],
              ["কার্যকর বার্ষিক রিটার্ন রেট:", `${sanchayResult.effectiveAnnualYieldPercent}%`],
            ]
          : [
              ["ঋণের মূল পরিমাণ (Principal):", `৳ ${emiResult.principalAmount.toLocaleString("bn-BD")}`],
              ["বার্ষিক সুদের হার:", `${emiResult.annualInterestRate}%`],
              ["মেয়াদ (মাস):", `${emiResult.tenureMonths} মাস`],
              ["সুদসহ মোট পরিশোধের পরিমাণ:", `৳ ${emiResult.totalAmountPayableBdt.toLocaleString("bn-BD")}`],
            ];

      for (const [k, v] of lines) {
        ctx.fillStyle = "#18181B";
        ctx.fillRect(80, y, 1040, 44);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px sans-serif";
        ctx.fillText(String(k), 100, y + 28);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 15px monospace";
        ctx.fillText(String(v), 1000, y + 28);

        y += 50;
      }

      // Footer
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("Generated with THE SABBiR OS · sabbir.nav.bd · Personal Financial Engineering", 320, 1340);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `tax-wealth-statement-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="tax-sanchaypatra-emi"
      title="BD Income Tax, Sanchaypatra Net Profit & Bank Loan EMI"
      category="Taxation & Wealth Engineering"
      popularityScore={98}
      lede="২০২৫-২৬ অর্থবছরের ব্যক্তি করদাতা আয়কর ধাপ, পরিবার ও পেনশনার সঞ্চয়পত্রের স্তরভিত্তিক নিট মাসিক মুনাফা এবং ব্যাংক ঋণের রিডিউসিং ব্যালেন্স ইএমআই।"
      activeStep={activeStep}
      getSharePayload={() => ({
        taxResult,
        sanchayResult,
        emiResult,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setAnnualIncome(950000);
            setSanchayAmount(1500000);
            setActualInvestment(150000);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>স্যালারি ও সেভিংস স্যাম্পল</span>
        </button>
      }
      exportSlot={
        <button
          onClick={handleDownloadSheet}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Statement Card (PNG)</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* 3 Main Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("tax");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "tax"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>১. বিডি ব্যক্তিগত আয়কর (BD Income Tax FY 2025-26)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("sanchaypatra");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "sanchaypatra"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <PiggyBank className="h-4 w-4" />
            <span>২. জাতীয় সঞ্চয়পত্র মুনাফা (Sanchaypatra Profit)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("emi");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "emi"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>৩. ব্যাংক লোন ইএমআই শিডিউল (Loan EMI Calculator)</span>
          </button>
        </div>

        {/* TAB 1: INCOME TAX */}
        {activeTab === "tax" && (
          <div className="space-y-6">
            {/* Tax Hero Banner */}
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  সর্বমোট প্রদেয় আয়কর (কর রেয়াত ও মিনিমাম কর সমন্বয়কৃত)
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-amber-400">
                  ৳ {taxResult.finalTaxPayableBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  করমুক্ত আয়: ৳ {taxResult.taxFreeLimit.toLocaleString("bn-BD")} · কার্যকর করের হার: {taxResult.effectiveTaxRatePercent}%
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-4 text-xs font-mono space-y-1.5 min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">মোট মোট কর:</span>
                  <span className="text-ink font-bold">৳ {taxResult.grossTaxBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">বিনিয়োগ রেয়াত (১৫%):</span>
                  <span className="text-emerald-500 font-bold">- ৳ {taxResult.investmentRebateBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">নূন্যতম কর প্রযোজ্য:</span>
                  <span className="text-amber-500 font-bold">{taxResult.minimumTaxApplied ? "হ্যাঁ (Yes)" : "না (No)"}</span>
                </div>
              </div>
            </div>

            {/* Tax Inputs Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-line bg-surface p-5">
              <div>
                <label className="text-xs font-semibold text-ink-3">বার্ষিক মোট আয় (Annual Income)</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => {
                    setAnnualIncome(Number(e.target.value));
                    setActiveStep(2);
                  }}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">করদাতার ক্যাটাগরি</label>
                <select
                  value={taxCategory}
                  onChange={(e) => setTaxCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-xs font-semibold text-ink"
                >
                  <option value="general">সাধারণ পুরুষ (করমুক্ত ৩.৫ লাখ)</option>
                  <option value="female_senior">নারী / ৬৫+ বয়স্ক (করমুক্ত ৪.০ লাখ)</option>
                  <option value="disabled">প্রতিবন্ধী করদাতা (করমুক্ত ৪.৭৫ লাখ)</option>
                  <option value="freedom_fighter">গেজেটভুক্ত মুক্তিযোদ্ধা (করমুক্ত ৫.০ লাখ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">অবস্থান অঞ্চল (নূন্যতম কর)</label>
                <select
                  value={locationZone}
                  onChange={(e) => setLocationZone(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-xs font-semibold text-ink"
                >
                  <option value="dhaka_ctg">ঢাকা / চট্টগ্রাম সিটি কর্পোরেশন (৳ ৫,০০০)</option>
                  <option value="other_city">অন্যান্য সিটি কর্পোরেশন (৳ ৪,০০০)</option>
                  <option value="rural">পৌরসভা ও অন্যান্য এলাকা (৳ ৩,০০০)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">অনুমোদিত বিনিয়োগ (DPS/শেয়ার)</label>
                <input
                  type="number"
                  value={actualInvestment}
                  onChange={(e) => setActualInvestment(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                />
              </div>
            </div>

            {/* Slabs Breakdown Visual */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                আয়কর ধাপভিত্তিক হিসাব (NBR Income Tax Slabs)
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {taxResult.slabs.map((slab, i) => (
                  <div key={i} className="rounded-xl border border-line bg-muted/20 p-4 space-y-1">
                    <div className="text-xs font-bold text-ink">{slab.slabName}</div>
                    <div className="flex justify-between text-xs font-mono text-ink-3 pt-1">
                      <span>৳{slab.taxableAmount.toLocaleString("bn-BD")} @ {slab.ratePercent}%</span>
                      <span className="text-amber-500 font-bold">৳{slab.taxBdt.toLocaleString("bn-BD")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SANCHAYPATRA */}
        {activeTab === "sanchaypatra" && (
          <div className="space-y-6">
            {/* Hero Sanchay */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {sanchayResult.schemeTitleBn}
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-emerald-400">
                  ৳ {sanchayResult.netMonthlyTakeHomeBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  প্রতি মাসে নিট লাভ (উৎসের {sanchayResult.sourceTaxPercent}% কর বাদে হাতে পাবেন)
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-4 text-xs font-mono space-y-1.5 min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">মাসিক মোট লাভ:</span>
                  <span className="text-ink font-bold">৳ {sanchayResult.grossMonthlyProfitBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">উৎস কর কর্তন:</span>
                  <span className="text-rose-500 font-bold">- ৳ {sanchayResult.taxDeductedMonthlyBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">বাৎসরিক নিট রিটার্ন:</span>
                  <span className="text-emerald-500 font-bold">{sanchayResult.effectiveAnnualYieldPercent}%</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-line bg-surface p-6">
              <div>
                <label className="text-xs font-semibold text-ink-3">সঞ্চয়পত্রের ধরন</label>
                <select
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink font-bold"
                >
                  <option value="paribar">পরিবার সঞ্চয়পত্র (মাসিক মুনাফা - নারীদের জন্য)</option>
                  <option value="pensioner">পেনশনার সঞ্চয়পত্র (৩ মাস অন্তর মুনাফা)</option>
                  <option value="five_year_bd">বাংলাদেশ সঞ্চয়পত্র (৫ বছর মেয়াদী)</option>
                  <option value="three_month_profit">তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">মোট বিনিয়োগের পরিমাণ (BDT)</label>
                <input
                  type="number"
                  value={sanchayAmount}
                  onChange={(e) => setSanchayAmount(Number(e.target.value))}
                  step={50000}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono font-bold text-ink"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOAN EMI */}
        {activeTab === "emi" && (
          <div className="space-y-6">
            {/* EMI Hero */}
            <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  প্রতি মাসের কিস্তির পরিমাণ (Monthly EMI)
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-blue-400">
                  ৳ {emiResult.monthlyEmiBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  সুদসহ মোট পরিশোধ করতে হবে: <strong className="text-ink">৳ {emiResult.totalAmountPayableBdt.toLocaleString("bn-BD")}</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-4 text-xs font-mono space-y-1.5 min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">আসল লোন:</span>
                  <span className="text-ink font-bold">৳ {emiResult.principalAmount.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">মোট প্রদেয় সুদ:</span>
                  <span className="text-rose-500 font-bold">৳ {emiResult.totalInterestPayableBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">সুদের হার:</span>
                  <span className="text-ink font-bold">{emiResult.annualInterestRate}% p.a.</span>
                </div>
              </div>
            </div>

            {/* Loan Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-line bg-surface p-6">
              <div>
                <label className="text-xs font-semibold text-ink-3">ঋণের পরিমাণ (Principal BDT)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  step={50000}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold text-ink"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">বার্ষিক সুদের হার (% p.a.)</label>
                <input
                  type="number"
                  value={loanInterestRate}
                  onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                  step={0.1}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">মেয়াদ (মাস)</label>
                <input
                  type="number"
                  value={loanTenureMonths}
                  onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                  min={1}
                  max={360}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
