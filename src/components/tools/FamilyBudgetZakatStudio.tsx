"use client";

import React, { useState, useMemo } from "react";
import {
  Coins,
  Wallet,
  PiggyBank,
  Building,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  FamilyBudgetInput,
  calculateFamilyBudget,
  DpsFdrInput,
  calculateDpsFdrMaturity,
  ZakatInput,
  calculateIslamicZakat,
  SAMPLE_FAMILY_BUDGET,
} from "@/lib/finance/family-zakat-engine";
import { sound } from "@/lib/sound";

export function FamilyBudgetZakatStudio() {
  const [activeTab, setActiveTab] = useState<"budget" | "dps" | "zakat">("budget");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: Family 50/30/20 Hisab
  const [budgetInput, setBudgetInput] = useState<FamilyBudgetInput>(SAMPLE_FAMILY_BUDGET);

  // Tab 2: Bank DPS/FDR
  const [dpsInput, setDpsInput] = useState<DpsFdrInput>({
    type: "dps",
    amount: 5000,
    annualInterestRate: 8.5,
    tenureYears: 5,
    hasTinCertificate: true,
  });

  // Tab 3: Islamic Zakat
  const [zakatInput, setZakatInput] = useState<ZakatInput>({
    goldPricePerVori: 138000,
    silverPricePerVori: 2200,
    nisabStandard: "silver",
    cashInHandBank: 250000,
    goldOrnamentsVori: 3.5,
    silverOrnamentsVori: 10,
    businessGoodsInventory: 0,
    loanReceivables: 30000,
    investmentsShares: 50000,
    immediateDebtsAndLiabilities: 45000,
  });

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "family-budget-zakat",
    toolName: "Family Monthly Hisab & Zakat Studio",
  });

  // Calculations
  const budgetResult = useMemo(() => calculateFamilyBudget(budgetInput), [budgetInput]);
  const dpsResult = useMemo(() => calculateDpsFdrMaturity(dpsInput), [dpsInput]);
  const zakatResult = useMemo(() => calculateIslamicZakat(zakatInput), [zakatInput]);

  const handleDownloadStatement = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark theme card
      ctx.fillStyle = "#09090B";
      ctx.fillRect(0, 0, 1200, 1400);

      // Gold Border
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 1140, 1340);

      // Header Banner
      ctx.fillStyle = "#18181B";
      ctx.fillRect(40, 40, 1120, 180);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("🕌 THE SABBiR OS — HOUSEHOLD WEALTH & ZAKAT STATEMENT", 80, 95);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      const title =
        activeTab === "budget"
          ? "Monthly Family Budget Statement (50/30/20 Hisab)"
          : activeTab === "dps"
          ? `Bank ${dpsInput.type.toUpperCase()} Maturity & Tax Summary`
          : "Authentic Islamic Zakat & Nisab Certificate";
      ctx.fillText(title, 80, 145);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px monospace";
      ctx.fillText(`Generated on: ${new Date().toLocaleDateString("bn-BD")} · sabbir.nav.bd`, 80, 180);

      // Core Highlight Card
      let y = 260;
      ctx.fillStyle = "#18181B";
      ctx.fillRect(80, y, 1040, 160);
      ctx.strokeStyle = "#27272A";
      ctx.strokeRect(80, y, 1040, 160);

      if (activeTab === "budget") {
        ctx.fillStyle = budgetResult.netSurplusOrDeficit >= 0 ? "#10B981" : "#EF4444";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${budgetResult.netSurplusOrDeficit.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`মাসিক নিট উদ্বৃত্ত / ঘাটতি`, 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`মোট আয়: ৳ ${budgetResult.totalIncome.toLocaleString("bn-BD")}`, 640, y + 110);
      } else if (activeTab === "dps") {
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${dpsResult.netTakeHomeAmount.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`নিট প্রাপ্তি (ট্যাক্স ও ডিউটি বাদে)`, 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`মোট নিট লাভ: ৳ ${dpsResult.netProfitBdt.toLocaleString("bn-BD")}`, 640, y + 110);
      } else {
        ctx.fillStyle = zakatResult.isZakatEligible ? "#F59E0B" : "#A1A1AA";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${zakatResult.zakatPayableBdt.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`ওয়াজিব যাকাত (২.৫% হারে)`, 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`যাকাতযোগ্য মোট সম্পদ: ৳ ${zakatResult.netZakatableWealthBdt.toLocaleString("bn-BD")}`, 640, y + 110);
      }

      // Summary lines
      y += 220;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Financial Breakdown & Breakdown Points:", 80, y);

      y += 40;
      const details =
        activeTab === "budget"
          ? [
              ["প্রয়োজনীয় খরচ (Needs - 50% টার্গেট):", `৳ ${budgetResult.totalNeeds.toLocaleString("bn-BD")} (${budgetResult.needsPercentage}%)`],
              ["শখের খরচ (Wants - 30% টার্গেট):", `৳ ${budgetResult.totalWants.toLocaleString("bn-BD")} (${budgetResult.wantsPercentage}%)`],
              ["সঞ্চয় ও ঋণ পরিশোধ (Savings - 20% টার্গেট):", `৳ ${budgetResult.totalSavings.toLocaleString("bn-BD")} (${budgetResult.savingsPercentage}%)`],
              ["পারিবারিক আর্থিক স্বাস্থ্য:", budgetResult.summaryBn],
            ]
          : activeTab === "dps"
          ? [
              ["মোট মূল জমা (Principal):", `৳ ${dpsResult.totalDeposited.toLocaleString("bn-BD")}`],
              ["মোট মোট সুদ/মুনাফা (Gross Interest):", `৳ ${dpsResult.grossInterestEarned.toLocaleString("bn-BD")}`],
              ["উৎস কর (AIT Tax):", `৳ ${dpsResult.taxDeductedBdt.toLocaleString("bn-BD")} (${dpsResult.taxRatePercent}%)`],
              ["আবগারি শুল্ক (Excise Duty):", `৳ ${dpsResult.exciseDutyBdt.toLocaleString("bn-BD")}`],
            ]
          : [
              ["রূপার নেসাব মানদণ্ড (৫২.৫ ভরি):", `৳ ${zakatResult.silverNisabThresholdBdt.toLocaleString("bn-BD")}`],
              ["স্বর্ণের নেসাব মানদণ্ড (৭.৫ ভরি):", `৳ ${zakatResult.goldNisabThresholdBdt.toLocaleString("bn-BD")}`],
              ["যাকাতযোগ্য মোট মোট সম্পদ:", `৳ ${zakatResult.totalGrossAssetsBdt.toLocaleString("bn-BD")}`],
              ["যাকাতের আইনি অবস্থা:", zakatResult.statusBn],
            ];

      for (const [k, v] of details) {
        ctx.fillStyle = "#18181B";
        ctx.fillRect(80, y, 1040, 50);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px sans-serif";
        ctx.fillText(k, 100, y + 32);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(v, 640, y + 32);

        y += 65;
      }

      // Watermark
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("Generated with THE SABBiR OS · sabbir.nav.bd · Personal & Islamic Finance Engine", 320, 1330);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-statement-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="family-budget-zakat"
      title="Family Monthly Hisab, DPS/FDR & Islamic Zakat Studio"
      category="Household & Islamic Finance"
      popularityScore={97}
      lede="৫০/৩০/২০ পারিবারিক বাজেট বিশ্লেষণ, ব্যাংক ডিপিএস ও এফডিআরের কর কর্তন হিসাব এবং বাজুস স্বর্ণ/রৌপ্য নেসাব অনুযায়ী ২.৫% বিশুদ্ধ যাকাত ক্যালকুলেটর।"
      activeStep={activeStep}
      getSharePayload={() => ({
        budgetResult,
        dpsResult,
        zakatResult,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setBudgetInput(SAMPLE_FAMILY_BUDGET);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>পারিবারিক স্যাম্পল লোড করুন</span>
        </button>
      }
      exportSlot={
        <button
          onClick={handleDownloadStatement}
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
              setActiveTab("budget");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "budget"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>১. ৫০/৩০/২০ ফ্যামিলি বাজেট (Family Hisab)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("dps");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "dps"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>২. ব্যাংক ডিপিএস ও এফডিআর (DPS &amp; FDR Tax)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("zakat");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "zakat"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>৩. ইসলামিক যাকাত ও নেসাব ক্যালকুলেটর (Zakat &amp; Nisab)</span>
          </button>
        </div>

        {/* TAB 1: 50/30/20 FAMILY HISAB */}
        {activeTab === "budget" && (
          <div className="space-y-6">
            {/* Surplus/Deficit Hero */}
            <div
              className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg ${
                budgetResult.netSurplusOrDeficit >= 0
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                  মাসিক নিট ক্যাশফ্লো (উদ্বৃত্ত / ঘাটতি)
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono">
                  ৳ {budgetResult.netSurplusOrDeficit.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">{budgetResult.summaryBn}</p>
              </div>

              {/* 50/30/20 Ratio Bars */}
              <div className="rounded-2xl border border-line bg-surface/80 p-5 space-y-3 min-w-[280px]">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">প্রয়োজনীয় (Needs): {budgetResult.needsPercentage}%</span>
                    <span className="text-ink-3 font-mono">টার্গেট ৫০%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${budgetResult.needsPercentage > 60 ? "bg-rose-500" : "bg-blue-500"}`}
                      style={{ width: `${Math.min(100, budgetResult.needsPercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">শখ ও বিনোদন (Wants): {budgetResult.wantsPercentage}%</span>
                    <span className="text-ink-3 font-mono">টার্গেট ৩০%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${Math.min(100, budgetResult.wantsPercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">সঞ্চয় ও বিনিয়োগ (Savings): {budgetResult.savingsPercentage}%</span>
                    <span className="text-ink-3 font-mono">টার্গেট ২০%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${Math.min(100, budgetResult.savingsPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Income & Needs */}
              <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-line pb-2">
                  <Wallet className="h-4 w-4 text-blue-500" />
                  <h4 className="text-xs font-bold uppercase text-ink">মাসিক মোট আয় ও আবশ্যিক খরচ</h4>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">মাসিক মোট আয় (Income)</label>
                  <input
                    type="number"
                    value={budgetInput.monthlyIncome}
                    onChange={(e) =>
                      setBudgetInput({ ...budgetInput, monthlyIncome: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">বাড়ি ভাড়া (House Rent)</label>
                  <input
                    type="number"
                    value={budgetInput.needs.houseRent}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        needs: { ...budgetInput.needs, houseRent: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">মুদি বাজার ও খাবার (Bazar)</label>
                  <input
                    type="number"
                    value={budgetInput.needs.groceryBazar}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        needs: { ...budgetInput.needs, groceryBazar: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">বিদ্যুৎ, গ্যাস ও ওয়াইফাই বিল</label>
                  <input
                    type="number"
                    value={budgetInput.needs.utilityBills}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        needs: { ...budgetInput.needs, utilityBills: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
              </div>

              {/* Wants */}
              <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-line pb-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase text-ink">শখ, রেস্তোরাঁ ও ভ্রমণ (Wants)</h4>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">বাইরে খাওয়া (Dining Out)</label>
                  <input
                    type="number"
                    value={budgetInput.wants.diningOut}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        wants: { ...budgetInput.wants, diningOut: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">শপিং ও পোশাক (Shopping)</label>
                  <input
                    type="number"
                    value={budgetInput.wants.shoppingClothing}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        wants: { ...budgetInput.wants, shoppingClothing: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">বিনোদন ও ট্রাভেল (Travel)</label>
                  <input
                    type="number"
                    value={budgetInput.wants.gadgetsTravel}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        wants: { ...budgetInput.wants, gadgetsTravel: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
              </div>

              {/* Savings */}
              <div className="rounded-2xl border border-line bg-surface p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-line pb-2">
                  <PiggyBank className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-xs font-bold uppercase text-ink">সঞ্চয়, ডিপিএস ও ঋণ (Savings)</h4>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">ব্যাংক ডিপিএস কিস্তি (DPS)</label>
                  <input
                    type="number"
                    value={budgetInput.savings.dpsSavings}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        savings: { ...budgetInput.savings, dpsSavings: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">জরুরি আপদকালীন তহবিল (Emergency)</label>
                  <input
                    type="number"
                    value={budgetInput.savings.emergencyFund}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        savings: { ...budgetInput.savings, emergencyFund: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">লোন বা ঋণের কিস্তি (Loan EMI)</label>
                  <input
                    type="number"
                    value={budgetInput.savings.loanEmiDebt}
                    onChange={(e) =>
                      setBudgetInput({
                        ...budgetInput,
                        savings: { ...budgetInput.savings, loanEmiDebt: Number(e.target.value) },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANK DPS & FDR */}
        {activeTab === "dps" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* DPS Settings */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDpsInput({ ...dpsInput, type: "dps" })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      dpsInput.type === "dps" ? "bg-amber-500 text-black" : "bg-muted text-ink"
                    }`}
                  >
                    মাসিক ডিপিএস (DPS)
                  </button>
                  <button
                    onClick={() => setDpsInput({ ...dpsInput, type: "fdr" })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      dpsInput.type === "fdr" ? "bg-amber-500 text-black" : "bg-muted text-ink"
                    }`}
                  >
                    এককালীন এফডিআর (FDR)
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">
                    {dpsInput.type === "dps" ? "মাসিক কিস্তির পরিমাণ (BDT)" : "এককালীন জমা (Principal BDT)"}
                  </label>
                  <input
                    type="number"
                    value={dpsInput.amount}
                    onChange={(e) => setDpsInput({ ...dpsInput, amount: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-mono font-bold text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">মুনাফার হার (% p.a.)</label>
                    <input
                      type="number"
                      value={dpsInput.annualInterestRate}
                      onChange={(e) =>
                        setDpsInput({ ...dpsInput, annualInterestRate: Number(e.target.value) })
                      }
                      step={0.1}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">মেয়াদ (বছর)</label>
                    <input
                      type="number"
                      value={dpsInput.tenureYears}
                      onChange={(e) =>
                        setDpsInput({ ...dpsInput, tenureYears: Number(e.target.value) })
                      }
                      min={1}
                      max={20}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={dpsInput.hasTinCertificate}
                    onChange={(e) =>
                      setDpsInput({ ...dpsInput, hasTinCertificate: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span className="text-xs text-ink">
                    আমার TIN সার্টিফিকেট রয়েছে (১০% উৎস কর, TIN না থাকলে ১৫%)
                  </span>
                </label>
              </div>

              {/* DPS Result Card */}
              <div className="rounded-2xl border border-line bg-muted/20 p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-ink-3">পরিপক্কতায় নিট প্রাপ্তি</div>
                  <div className="mt-2 text-4xl font-extrabold text-emerald-500 font-mono">
                    ৳ {dpsResult.netTakeHomeAmount.toLocaleString("bn-BD")}
                  </div>
                  <p className="text-xs text-ink-3 mt-1">
                    মোট লাভ (মুনাফা): ৳ {dpsResult.netProfitBdt.toLocaleString("bn-BD")}
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-3">আপনার আসল জমা:</span>
                    <span className="text-ink font-bold">৳ {dpsResult.totalDeposited.toLocaleString("bn-BD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">মোট মুনাফা (Gross):</span>
                    <span className="text-emerald-500 font-bold">৳ {dpsResult.grossInterestEarned.toLocaleString("bn-BD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">উৎস কর ({dpsResult.taxRatePercent}%):</span>
                    <span className="text-rose-500">- ৳ {dpsResult.taxDeductedBdt.toLocaleString("bn-BD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">আবগারি শুল্ক (Excise):</span>
                    <span className="text-rose-500">- ৳ {dpsResult.exciseDutyBdt.toLocaleString("bn-BD")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ISLAMIC ZAKAT & NISAB */}
        {activeTab === "zakat" && (
          <div className="space-y-6">
            {/* Zakat Payable Banner */}
            <div
              className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg ${
                zakatResult.isZakatEligible
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-line bg-surface"
              }`}
            >
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                    ওয়াজিব যাকাত (২.৫% হারে হিসাবকৃত)
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-amber-400">
                  ৳ {zakatResult.zakatPayableBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2 max-w-xl">{zakatResult.statusBn}</p>
              </div>

              <div className="rounded-2xl border border-line bg-surface/80 p-4 text-xs font-mono space-y-1.5 min-w-[260px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">রূপার নেসাব (৫২.৫ ভরি):</span>
                  <span className="text-ink font-bold">৳ {zakatResult.silverNisabThresholdBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">স্বর্ণের নেসাব (৭.৫ ভরি):</span>
                  <span className="text-ink font-bold">৳ {zakatResult.goldNisabThresholdBdt.toLocaleString("bn-BD")}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">মোট যাকাতযোগ্য সম্পদ:</span>
                  <span className="text-amber-500 font-bold">৳ {zakatResult.netZakatableWealthBdt.toLocaleString("bn-BD")}</span>
                </div>
              </div>
            </div>

            {/* Zakat Asset Inputs */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                  সম্পদের বিবরণ (Asset Valuation)
                </h4>

                <div>
                  <label className="text-xs font-semibold text-ink-3">হাতে ও ব্যাংক একাউন্টে গচ্ছিত নগদ টাকা (BDT)</label>
                  <input
                    type="number"
                    value={zakatInput.cashInHandBank}
                    onChange={(e) =>
                      setZakatInput({ ...zakatInput, cashInHandBank: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">স্বর্ণ অলঙ্কার (ভরি)</label>
                    <input
                      type="number"
                      value={zakatInput.goldOrnamentsVori}
                      onChange={(e) =>
                        setZakatInput({ ...zakatInput, goldOrnamentsVori: Number(e.target.value) })
                      }
                      step={0.25}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">রূপা অলঙ্কার (ভরি)</label>
                    <input
                      type="number"
                      value={zakatInput.silverOrnamentsVori}
                      onChange={(e) =>
                        setZakatInput({ ...zakatInput, silverOrnamentsVori: Number(e.target.value) })
                      }
                      step={0.5}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">ব্যবসার বিক্রয়যোগ্য মালের বর্তমান মূল্য</label>
                  <input
                    type="number"
                    value={zakatInput.businessGoodsInventory}
                    onChange={(e) =>
                      setZakatInput({ ...zakatInput, businessGoodsInventory: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">পাওনা টাকা যা ফেরত পাওয়ার সম্ভাবনা নিশ্চিত</label>
                  <input
                    type="number"
                    value={zakatInput.loanReceivables}
                    onChange={(e) =>
                      setZakatInput({ ...zakatInput, loanReceivables: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
              </div>

              {/* Market Rates & Liabilities */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                  বাজার দর ও বর্তমান দায়-দেনা
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">স্বর্ণের ভরি দর (BAJUS 22K)</label>
                    <input
                      type="number"
                      value={zakatInput.goldPricePerVori}
                      onChange={(e) =>
                        setZakatInput({ ...zakatInput, goldPricePerVori: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">রূপার ভরি দর (BDT)</label>
                    <input
                      type="number"
                      value={zakatInput.silverPricePerVori}
                      onChange={(e) =>
                        setZakatInput({ ...zakatInput, silverPricePerVori: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">
                    নেসাব মানদণ্ড (আলেমগণ রূপাকে অগ্রাধিকার দেন)
                  </label>
                  <select
                    value={zakatInput.nisabStandard}
                    onChange={(e) =>
                      setZakatInput({ ...zakatInput, nisabStandard: e.target.value as any })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  >
                    <option value="silver">রূপার নেসাব (৫২.৫ ভরি = ৳ {zakatResult.silverNisabThresholdBdt.toLocaleString("bn-BD")}) - গরীবের জন্য উত্তম</option>
                    <option value="gold">স্বর্ণের নেসাব (৭.৫ ভরি = ৳ {zakatResult.goldNisabThresholdBdt.toLocaleString("bn-BD")})</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">
                    তাৎক্ষণিক পরিশোধযোগ্য ঋণ ও দেনা (বাদ যাবে)
                  </label>
                  <input
                    type="number"
                    value={zakatInput.immediateDebtsAndLiabilities}
                    onChange={(e) =>
                      setZakatInput({
                        ...zakatInput,
                        immediateDebtsAndLiabilities: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold text-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
