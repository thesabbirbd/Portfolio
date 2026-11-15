"use client";

import React, { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Users,
  Coins,
  Download,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Receipt,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  MenuType,
  calculateCateringIngredients,
  calculateChandaSettlement,
  ChandaMember,
  SAMPLE_CHANDA_MEMBERS,
} from "@/lib/events/event-dawat-engine";
import { sound } from "@/lib/sound";

export function EventDawatPlannerStudio() {
  const [activeTab, setActiveTab] = useState<"catering" | "chanda">("catering");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: Catering Sizer
  const [menuType, setMenuType] = useState<MenuType>("kacchi_biryani");
  const [guestCount, setGuestCount] = useState<number>(100);
  const [eventName, setEventName] = useState<string>("পারিবারিক মেজবানি ও বিয়ের ভোজ");

  // Tab 2: Chanda Splitter
  const [members, setMembers] = useState<ChandaMember[]>(SAMPLE_CHANDA_MEMBERS);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberAmount, setNewMemberAmount] = useState<number>(0);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "event-dawat-planner",
    toolName: "Dawat Catering & Chanda Planner Studio",
  });

  const cateringResult = useMemo(
    () => calculateCateringIngredients(menuType, guestCount),
    [menuType, guestCount]
  );

  const chandaResult = useMemo(
    () => calculateChandaSettlement(members),
    [members]
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    sound.click();
    const newM: ChandaMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      paidAmount: Number(newMemberAmount) || 0,
    };
    setMembers((prev) => [...prev, newM]);
    setNewMemberName("");
    setNewMemberAmount(0);
    setActiveStep(2);
  };

  const handleRemoveMember = (id: string) => {
    sound.click();
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDownloadSheet = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Dark Background
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
      ctx.fillText("🍛 THE SABBiR OS — DAWAT & PICNIC SETTLEMENT STATEMENT", 80, 95);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      const title =
        activeTab === "catering"
          ? `${cateringResult.menuTitleBn} (${guestCount} জন মেহমান)`
          : `পিকনিক ও ট্যুর চাঁদা সমবণ্টন স্টেটমেন্ট`;
      ctx.fillText(title, 80, 145);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "16px monospace";
      ctx.fillText(`Generated on: ${new Date().toLocaleDateString("bn-BD")} · sabbir.nav.bd`, 80, 180);

      // Hero Stat Box
      let y = 260;
      ctx.fillStyle = "#18181B";
      ctx.fillRect(80, y, 1040, 160);
      ctx.strokeStyle = "#27272A";
      ctx.strokeRect(80, y, 1040, 160);

      if (activeTab === "catering") {
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${cateringResult.grandTotalCostBdt.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`আনুমানিক কাঁচামাল বাজার খরচ`, 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`জনপ্রতি খরচ: ৳ ${cateringResult.costPerHeadBdt} BDT`, 640, y + 110);
      } else {
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 56px monospace";
        ctx.fillText(`৳ ${chandaResult.perHeadShare.toLocaleString("bn-BD")}`, 120, y + 95);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(`মাথাপিছু সমান চাঁদার পরিমাণ`, 640, y + 75);
        ctx.fillStyle = "#A1A1AA";
        ctx.font = "16px sans-serif";
        ctx.fillText(`মোট খরচ: ৳ ${chandaResult.totalExpense.toLocaleString("bn-BD")} (${chandaResult.memberCount} জন)`, 640, y + 110);
      }

      // Breakdown Lines
      y += 200;
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(
        activeTab === "catering"
          ? "প্রয়োজনীয় কাঁচামালের সঠিক পরিমাপ ও বাজার দর:"
          : "টাকা লেনদেন ও দেনা-পাওনা নিষ্পত্তির তালিকা (Who Pays Whom):",
        80,
        y
      );

      y += 35;
      if (activeTab === "catering") {
        for (const item of cateringResult.items) {
          ctx.fillStyle = "#18181B";
          ctx.fillRect(80, y, 1040, 44);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "16px sans-serif";
          ctx.fillText(item.nameBn, 100, y + 28);

          ctx.fillStyle = "#A1A1AA";
          ctx.font = "14px monospace";
          ctx.fillText(item.formattedQuantity, 600, y + 28);

          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 15px monospace";
          ctx.fillText(`৳ ${item.estimatedCostBdt.toLocaleString("bn-BD")}`, 1000, y + 28);

          y += 50;
        }
      } else {
        for (const set of chandaResult.settlements) {
          ctx.fillStyle = "#18181B";
          ctx.fillRect(80, y, 1040, 48);

          ctx.fillStyle = "#F87171";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(set.from, 100, y + 30);

          ctx.fillStyle = "#A1A1AA";
          ctx.font = "14px sans-serif";
          ctx.fillText("→ টাকা দেবে →", 400, y + 30);

          ctx.fillStyle = "#4ADE80";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(set.to, 600, y + 30);

          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 18px monospace";
          ctx.fillText(`৳ ${set.amount.toLocaleString("bn-BD")}`, 1000, y + 30);

          y += 56;
        }
      }

      // Watermark
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("Generated with THE SABBiR OS · sabbir.nav.bd · Smart Event Logistics", 320, 1340);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-statement-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="event-dawat-planner"
      title="Dawat, Wedding & Picnic Raw Catering Sizer & Chanda Split"
      category="Social Events & Logistics"
      popularityScore={94}
      lede="কাচ্চি বিরিয়ানি ও পোলাও রোস্টের মেহমান অনুযায়ী কাঁচামালের কেজি/লিটার হিসাব এবং বন্ধুদের পিকনিক ট্যুর চাঁদার দেনা-পাওনা অটো-সেটেলমেন্ট।"
      activeStep={activeStep}
      getSharePayload={() => ({
        cateringResult,
        chandaResult,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setGuestCount(100);
            setMenuType("kacchi_biryani");
            setMembers(SAMPLE_CHANDA_MEMBERS);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>১০০ জন কাচ্চি মেহমান লোড</span>
        </button>
      }
      exportSlot={
        <button
          onClick={handleDownloadSheet}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Statement Sheet (PNG)</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* 2 Main Studio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("catering");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "catering"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            <span>১. দাওয়াতি কাঁচামাল বাজার সায়জার (Dawat Catering Sizer)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("chanda");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "chanda"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>২. পিকনিক ও ট্যুর চাঁদা সমবণ্টন (Picnic Chanda Splitter)</span>
          </button>
        </div>

        {/* TAB 1: CATERING SIZER */}
        {activeTab === "catering" && (
          <div className="space-y-6">
            {/* Catering Hero Banner */}
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  {guestCount} জন মেহমানের আনুমানিক বাজার বাজেট
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-amber-400">
                  ৳ {cateringResult.grandTotalCostBdt.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  জনপ্রতি গড়ে আনুমানিক খরচ: <strong className="text-ink">৳ {cateringResult.costPerHeadBdt} BDT</strong>
                </p>
              </div>

              {/* Guest & Menu Controls */}
              <div className="rounded-2xl border border-line bg-surface p-5 space-y-3 min-w-[280px]">
                <div>
                  <label className="text-xs font-semibold text-ink-3">মেনু নির্বাচন করুন</label>
                  <select
                    value={menuType}
                    onChange={(e) => {
                      setMenuType(e.target.value as MenuType);
                      setActiveStep(2);
                    }}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-xs font-bold text-ink"
                  >
                    <option value="kacchi_biryani">কাচ্চি বিরিয়ানি ও বোরহানি ভোজ</option>
                    <option value="morog_polao_roast">মোরগ পোলাও ও চিকেন রোস্ট</option>
                    <option value="beef_bhuna_khichuri">গরুর ভুনা খিচুড়ি ও বেগুন ভাজা</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">মেহমান বা মানুষের সংখ্যা</label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(Math.max(1, Number(e.target.value)));
                      setActiveStep(2);
                    }}
                    min={1}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold font-mono text-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Shopping List Table */}
            <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-line bg-muted/30 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-ink">প্রয়োজনীয় কাঁচামালের বাজার তালিকা (Shopping List)</h4>
                </div>
                <span className="text-xs text-ink-3 font-mono">মোট {cateringResult.items.length} টি উপাদান</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-muted/40 text-xs font-semibold text-ink-3">
                    <tr>
                      <th className="px-6 py-3">উপাদান</th>
                      <th className="px-6 py-3 text-center">মোট পরিমাণ</th>
                      <th className="px-6 py-3 text-right">আনুমানিক খরচ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {cateringResult.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="px-6 py-3.5">
                          <div className="font-bold text-ink">{item.nameBn}</div>
                          <div className="text-xs text-ink-3 font-mono">{item.nameEn}</div>
                        </td>
                        <td className="px-6 py-3.5 text-center font-mono font-bold text-ink">
                          {item.formattedQuantity}
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono font-bold text-amber-500">
                          ৳ {item.estimatedCostBdt.toLocaleString("bn-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHANDA SPLITTER */}
        {activeTab === "chanda" && (
          <div className="space-y-6">
            {/* Chanda Hero Banner */}
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  মাথাপিছু সমান চাঁদার পরিমাণ
                </span>
                <div className="text-4xl font-extrabold text-ink md:text-6xl font-mono text-emerald-400">
                  ৳ {chandaResult.perHeadShare.toLocaleString("bn-BD")}
                </div>
                <p className="text-sm font-medium text-ink-2">
                  সর্বমোট খরচ: ৳ {chandaResult.totalExpense.toLocaleString("bn-BD")} · সদস্য সংখ্যা: {chandaResult.memberCount} জন
                </p>
              </div>

              {/* Settlement Instructions Counter */}
              <div className="rounded-2xl border border-line bg-surface p-5 text-center min-w-[240px]">
                <div className="text-xs text-ink-3">নিষ্পত্তির লেনদেন সংখ্যা</div>
                <div className="text-3xl font-extrabold text-amber-500 font-mono mt-1">
                  {chandaResult.settlements.length} টি
                </div>
                <p className="text-xs text-ink-3 mt-1 font-mono">সর্বনিম্ন সংখ্যক ট্রানজ্যাকশন</p>
              </div>
            </div>

            {/* Who Pays Whom Settlement Cards */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-emerald-500" />
                <span>কে কাকে কত টাকা দেবে (Simplified Settlements)</span>
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {chandaResult.settlements.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-line bg-muted/20 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span className="text-rose-500">{s.from}</span>
                      <span className="text-ink-3 font-normal">→</span>
                      <span className="text-emerald-500">{s.to}</span>
                    </div>
                    <div className="font-mono text-base font-extrabold text-amber-500">
                      ৳ {s.amount.toLocaleString("bn-BD")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Members Form & Balances Table */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                সদস্যদের জমার তালিকা ও হিসেব
              </h4>

              <form onSubmit={handleAddMember} className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="সদস্যের নাম (যেমন: রাকিব)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 min-w-[200px] rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                />
                <input
                  type="number"
                  placeholder="পরিশোধকৃত টাকা (BDT)"
                  value={newMemberAmount || ""}
                  onChange={(e) => setNewMemberAmount(Number(e.target.value))}
                  className="w-36 rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
                >
                  যোগ করুন
                </button>
              </form>

              <div className="divide-y divide-line pt-2">
                {chandaResult.memberBalances.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 text-xs font-mono"
                  >
                    <div className="font-bold text-sm text-ink">{m.name}</div>
                    <div className="flex items-center gap-4">
                      <span className="text-ink-3">জমা: ৳{m.paid}</span>
                      <span
                        className={`font-bold ${
                          m.balance >= 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {m.balance >= 0 ? `+৳${m.balance} পাবে` : `-৳${Math.abs(m.balance)} দেবে`}
                      </span>
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
