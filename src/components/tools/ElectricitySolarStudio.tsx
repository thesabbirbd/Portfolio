"use client";

import React, { useState, useMemo } from "react";
import {
  Zap,
  BatteryCharging,
  Sun,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  ApplianceItem,
  calculateBercElectricityBill,
  calculateIpsAndSolar,
  DEFAULT_APPLIANCES,
} from "@/lib/utility/electricity-solar-engine";
import { sound } from "@/lib/sound";

export function ElectricitySolarStudio() {
  const [activeTab, setActiveTab] = useState<"bill" | "ips">("bill");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: Direct Bill Slabs or Appliance Inventory
  const [manualUnits, setManualUnits] = useState<number>(245);
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState<number>(2);
  const [useApplianceCalculator, setUseApplianceCalculator] = useState<boolean>(true);

  // Appliances
  const [appliances, setAppliances] = useState<ApplianceItem[]>(DEFAULT_APPLIANCES);
  const [desiredBackupHours, setDesiredBackupHours] = useState<number>(3);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "electricity-solar-calculator",
    toolName: "Electricity Bill & IPS Sizer Studio",
  });

  // Calculate IPS & Appliance totals
  const ipsResult = useMemo(
    () => calculateIpsAndSolar(appliances, desiredBackupHours),
    [appliances, desiredBackupHours]
  );

  const effectiveUnits = useApplianceCalculator ? ipsResult.monthlyTotalKwh : manualUnits;

  // Calculate BERC Bill
  const billResult = useMemo(
    () => calculateBercElectricityBill(effectiveUnits, sanctionedLoadKw),
    [effectiveUnits, sanctionedLoadKw]
  );

  const handleUpdateApplianceCount = (id: string, count: number) => {
    sound.click();
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, count: Math.max(0, count) } : a))
    );
    setActiveStep(2);
  };

  const handleToggleIps = (id: string) => {
    sound.click();
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, includeInIps: !a.includeInIps } : a))
    );
  };

  const handleAddAppliance = () => {
    sound.click();
    const newItem: ApplianceItem = {
      id: `app-${Date.now()}`,
      name: "নতুন ইলেকট্রনিক ডিভাইস",
      watts: 100,
      count: 1,
      hoursUsedDaily: 4,
      includeInIps: false,
    };
    setAppliances((prev) => [...prev, newItem]);
  };

  const handleRemoveAppliance = (id: string) => {
    sound.click();
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  // Download Load Audit Card PNG
  const handleDownloadAuditCard = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Card Background
      ctx.fillStyle = "#09090B";
      ctx.fillRect(0, 0, 1200, 1400);

      // Border
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 1140, 1340);

      // Header Banner
      ctx.fillStyle = "#18181B";
      ctx.fillRect(40, 40, 1120, 180);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("⚡ THE SABBiR OS — HOME LOAD & SOLAR AUDIT STATEMENT", 80, 95);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("BERC Electricity Bill & Home IPS Sizing Certificate", 80, 145);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px monospace";
      ctx.fillText(`Audited On: ${new Date().toLocaleDateString("bn-BD")} · sabbir.nav.bd`, 80, 180);

      // Score Hero
      let y = 260;
      ctx.fillStyle = "#18181B";
      ctx.fillRect(80, y, 1040, 160);
      ctx.strokeStyle = "#27272A";
      ctx.strokeRect(80, y, 1040, 160);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 60px monospace";
      ctx.fillText(`৳ ${billResult.totalBillBdt.toLocaleString("bn-BD")}`, 120, y + 95);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`আনুমানিক মাসিক বিদ্যুৎ বিল (LT-A)`, 640, y + 75);
      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px sans-serif";
      ctx.fillText(`মাসিক বিদ্যুৎ ব্যবহার: ${billResult.totalUnitsKwh} kWh (ইউনিট)`, 640, y + 110);

      // IPS Card
      y += 200;
      ctx.fillStyle = "#18181B";
      ctx.fillRect(80, y, 1040, 140);
      ctx.strokeStyle = "#10B981";
      ctx.strokeRect(80, y, 1040, 140);

      ctx.fillStyle = "#10B981";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("🔋 প্রস্তাবিত হোম আইপিএস ও ব্যাটারি সেটআপ:", 100, y + 45);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`ইনভার্টার সাইজ: ${ipsResult.recommendedInverterSize}`, 100, y + 85);
      ctx.fillText(`ব্যাটারি সাইজ: ${ipsResult.recommendedBatteryModel} (${ipsResult.recommendedBatteryCount}টি)`, 100, y + 115);

      // Slabs Breakdown Table
      y += 180;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("BERC Residential Slab Breakdown (ধাপভিত্তিক মূল্য):", 80, y);

      y += 30;
      for (const slab of billResult.slabs) {
        ctx.fillStyle = "#18181B";
        ctx.fillRect(80, y, 1040, 44);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "15px sans-serif";
        ctx.fillText(slab.slabName, 100, y + 28);

        ctx.fillStyle = "#A1A1AA";
        ctx.font = "14px monospace";
        ctx.fillText(`${slab.unitsInSlab} units @ ৳ ${slab.ratePerUnit.toFixed(2)}`, 600, y + 28);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 15px monospace";
        ctx.fillText(`৳ ${slab.costBdt.toFixed(2)}`, 1000, y + 28);

        y += 50;
      }

      // Footer
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("Verified with THE SABBiR OS · sabbir.nav.bd · Personal & Industrial Energy Sizer", 280, 1340);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `electricity-ips-audit-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="electricity-solar-calculator"
      title="BD Electricity Bill (LT-A Slab) & Home IPS/Solar Sizer"
      category="Household Energy & Utility"
      popularityScore={97}
      lede="বিইআরসির অফিশিয়াল আবাসিক ধাপভিত্তিক (LT-A) বিদ্যুৎ বিল ক্যালকুলেটর, রুমভিত্তিক লোড ইনভেন্টরি এবং লোডশেডিংয়ের জন্য সঠিক আইপিএস ও সোলার সাইজার।"
      activeStep={activeStep}
      getSharePayload={() => ({
        billResult,
        ipsResult,
        effectiveUnits,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setAppliances(DEFAULT_APPLIANCES);
            setUseApplianceCalculator(true);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>২-রুম বাসা লোড স্যাম্পল</span>
        </button>
      }
      exportSlot={
        <button
          onClick={handleDownloadAuditCard}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Audit Sheet (PNG)</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* 2 Main Studio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("bill");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "bill"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>১. বিইআরসি আবাসিক বিদ্যুৎ বিল (BERC LT-A Slab Bill)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("ips");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "ips"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <BatteryCharging className="h-4 w-4" />
            <span>২. হোম আইপিএস ও সোলার সাইজার (Home IPS &amp; Solar Sizer)</span>
          </button>
        </div>

        {/* TAB 1: BERC ELECTRICITY BILL */}
        {activeTab === "bill" && (
          <div className="space-y-6">
            {/* Bill Hero Banner */}
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  আনুমানিক সর্বমোট বিদ্যুৎ বিল (ভ্যাট ও চার্জসহ)
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-amber-400">
                  ৳ {billResult.totalBillBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  মাসিক বিদ্যুৎ খরচ: <strong className="text-ink">{billResult.totalUnitsKwh} kWh</strong> ইউনিট · অনুমোদিত লোড: {sanctionedLoadKw} kW
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-surface/80 p-4 text-xs font-mono space-y-1.5 min-w-[260px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">বিদ্যুৎ মূল্য (Energy):</span>
                  <span className="text-ink font-bold">৳ {billResult.energyChargeBdt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">ডিমান্ড চার্জ (Tk 42/kW):</span>
                  <span className="text-ink font-bold">৳ {billResult.demandChargeBdt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">মিটার ভাড়া:</span>
                  <span className="text-ink font-bold">৳ {billResult.meterRentBdt}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">সরকারি ভ্যাট (৫%):</span>
                  <span className="text-amber-500 font-bold">৳ {billResult.vat5PercentBdt.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Slab Breakdown Visual */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                ধাপভিত্তিক ইউনিটের হিসাব (BERC LT-A Residential Tariff)
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {billResult.slabs.map((slab, i) => (
                  <div key={i} className="rounded-xl border border-line bg-muted/20 p-4 space-y-1">
                    <div className="text-xs font-bold text-ink">{slab.slabName}</div>
                    <div className="flex justify-between text-xs font-mono text-ink-3 pt-1">
                      <span>{slab.unitsInSlab} units × ৳{slab.ratePerUnit.toFixed(2)}</span>
                      <span className="text-amber-500 font-bold">৳{slab.costBdt.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Units Input Mode Selector */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="calcAppliance"
                    checked={useApplianceCalculator}
                    onChange={(e) => setUseApplianceCalculator(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <label htmlFor="calcAppliance" className="text-sm font-bold text-ink cursor-pointer">
                    বাসার ফ্যান, লাইট ও ফ্রিজ তালিকা থেকে স্বয়ংক্রিয় ইউনিট হিসাব করুন
                  </label>
                </div>

                {!useApplianceCalculator && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-3">সরাসরি ইউনিট লিখুন:</span>
                    <input
                      type="number"
                      value={manualUnits}
                      onChange={(e) => setManualUnits(Number(e.target.value))}
                      min={0}
                      className="w-24 rounded-xl border border-line bg-muted/20 px-3 py-1.5 text-xs font-mono font-bold text-ink"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOME IPS & SOLAR SIZER */}
        {activeTab === "ips" && (
          <div className="space-y-6">
            {/* IPS & Solar Recommendation Banner */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* IPS Recommender */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <BatteryCharging className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    হোম আইপিএস রেকমেন্ডার ({desiredBackupHours} ঘণ্টা ব্যাকআপ)
                  </span>
                </div>

                <div>
                  <div className="text-xs text-ink-3">প্রস্তাবিত ইনভার্টার সাইজ</div>
                  <div className="text-3xl font-extrabold text-ink font-mono mt-1">
                    {ipsResult.recommendedInverterSize}
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface/90 p-4 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-3">আইপিএস কানেক্টেড লোড:</span>
                    <span className="text-ink font-bold">{ipsResult.ipsConnectedWatts} Watts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">প্রয়োজনীয় ব্যাটারি ক্ষমতা:</span>
                    <span className="text-emerald-500 font-bold">{ipsResult.batteryRequiredAh} Ah</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">প্রস্তাবিত মডেল:</span>
                    <span className="text-amber-500 font-bold">{ipsResult.recommendedBatteryModel}</span>
                  </div>
                </div>
              </div>

              {/* Solar PV Sizer */}
              <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 md:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    রুপটপ সোলার সাইজার (Net Metering Ready)
                  </span>
                </div>

                <div>
                  <div className="text-xs text-ink-3">প্রস্তাবিত সোলার প্যানেল ক্ষমতা</div>
                  <div className="text-3xl font-extrabold text-ink font-mono mt-1">
                    {ipsResult.recommendedSolarKwp} kWp (কিলোওয়াট পিক)
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface/90 p-4 text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-3">মাসিক মোট বিদ্যুৎ ব্যবহার:</span>
                    <span className="text-ink font-bold">{ipsResult.monthlyTotalKwh} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">৩৫০ ওয়াট সোলার প্যানেল প্রয়োজন:</span>
                    <span className="text-blue-400 font-bold">{ipsResult.recommendedSolarPanels} টি</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">প্রতিদিন গড় রোদ (BD Avg):</span>
                    <span className="text-amber-500 font-bold">৪.৫ ঘণ্টা</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appliance Inventory Table */}
            <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-line bg-muted/30 px-6 py-4">
                <h4 className="text-sm font-bold text-ink">বাসার ইলেকট্রনিক অ্যাপ্লায়েন্স তালিকা</h4>
                <button
                  onClick={handleAddAppliance}
                  className="inline-flex items-center gap-1 rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted/80"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-500" />
                  <span>নতুন যন্ত্র যোগ করুন</span>
                </button>
              </div>

              <div className="divide-y divide-line">
                {appliances.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <input
                        type="checkbox"
                        checked={app.includeInIps}
                        onChange={() => handleToggleIps(app.id)}
                        className="rounded text-amber-500"
                        title="আইপিএস কানেকশনে রাখবেন?"
                      />
                      <input
                        type="text"
                        value={app.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAppliances((prev) =>
                            prev.map((a) => (a.id === app.id ? { ...a, name: val } : a))
                          );
                        }}
                        className="rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold text-ink hover:border-line focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-ink-3 mr-1">ওয়াট:</span>
                        <input
                          type="number"
                          value={app.watts}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAppliances((prev) =>
                              prev.map((a) => (a.id === app.id ? { ...a, watts: val } : a))
                            );
                          }}
                          className="w-16 rounded-lg border border-line bg-muted/30 px-2 py-1 font-mono text-ink"
                        />
                      </div>

                      <div>
                        <span className="text-ink-3 mr-1">সংখ্যা:</span>
                        <input
                          type="number"
                          value={app.count}
                          onChange={(e) => handleUpdateApplianceCount(app.id, Number(e.target.value))}
                          min={0}
                          className="w-14 rounded-lg border border-line bg-muted/30 px-2 py-1 font-mono text-ink"
                        />
                      </div>

                      <div>
                        <span className="text-ink-3 mr-1">ঘণ্টা/দিন:</span>
                        <input
                          type="number"
                          value={app.hoursUsedDaily}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAppliances((prev) =>
                              prev.map((a) => (a.id === app.id ? { ...a, hoursUsedDaily: val } : a))
                            );
                          }}
                          min={1}
                          max={24}
                          className="w-14 rounded-lg border border-line bg-muted/30 px-2 py-1 font-mono text-ink"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveAppliance(app.id)}
                        className="rounded-lg p-1.5 text-ink-3 hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
