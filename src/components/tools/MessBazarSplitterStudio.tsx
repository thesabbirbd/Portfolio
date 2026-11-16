"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Utensils,
  Plus,
  Trash2,
  Download,
  Share2,
  Sparkles,
  Calculator,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface MessMember {
  id: string;
  name: string;
  meals: number;
  bazarPaid: number;
}

export function MessBazarSplitterStudio() {
  const [messTitle, setMessTitle] = useState("স্বপ্নসিঁড়ি মেস — নভেম্বর ২০২৬");
  const [commonCost, setCommonCost] = useState(1200); // Khala bill, gas, wifi
  const [members, setMembers] = useState<MessMember[]>([
    { id: "1", name: "সাব্বির (ম্যানেজার)", meals: 68, bazarPaid: 4500 },
    { id: "2", name: "রাফিক", meals: 62, bazarPaid: 2800 },
    { id: "3", name: "তানভীর", meals: 54, bazarPaid: 1500 },
    { id: "4", name: "সোহেল", meals: 58, bazarPaid: 2200 },
  ]);

  // Calculations
  const totalBazar = members.reduce((sum, m) => sum + (Number(m.bazarPaid) || 0), 0);
  const totalMeals = members.reduce((sum, m) => sum + (Number(m.meals) || 0), 0);
  const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 0;
  const commonPerMember = members.length > 0 ? commonCost / members.length : 0;

  const handleAddMember = () => {
    sound.click();
    const newId = String(Date.now());
    setMembers([...members, { id: newId, name: `মেম্বার ${members.length + 1}`, meals: 50, bazarPaid: 2000 }]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    sound.pop();
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleUpdateMember = (id: string, field: keyof MessMember, value: any) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleLoadSample = () => {
    sound.click();
    setMessTitle("রাজশাহী বিশ্ববিদ্যালয় মেস — ফাইনাল হিসাব");
    setCommonCost(1800);
    setMembers([
      { id: "1", name: "সাকিব", meals: 72, bazarPaid: 5200 },
      { id: "2", name: "ইমরান", meals: 65, bazarPaid: 3100 },
      { id: "3", name: "নাঈম", meals: 58, bazarPaid: 1800 },
      { id: "4", name: "ফাহিম", meals: 64, bazarPaid: 2500 },
      { id: "5", name: "আসিফ", meals: 50, bazarPaid: 1200 },
    ]);
  };

  const exportPayload = {
    messTitle,
    totalBazar,
    totalMeals,
    mealRate: Number(mealRate.toFixed(2)),
    commonCost,
    members: members.map((m) => {
      const mealCost = m.meals * mealRate;
      const totalCharge = mealCost + commonPerMember;
      const balance = m.bazarPaid - totalCharge;
      return {
        name: m.name,
        meals: m.meals,
        bazarPaid: m.bazarPaid,
        mealCost: Math.round(mealCost),
        balance: Math.round(balance),
        status: balance >= 0 ? `ফেরত পাবে ৳${Math.round(balance)}` : `দিতে হবে ৳${Math.round(Math.abs(balance))}`,
      };
    }),
  };

  return (
    <StudioWorkspaceShell
      toolSlug="mess-bazar-splitter"
      toolTitle="Student Mess Meal Rate & Bazar Splitter"
      category="Family & Finance"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Total Bazar", value: `৳ ${totalBazar.toLocaleString()}` },
        { label: "Total Meals", value: String(totalMeals) },
        { label: "Meal Rate", value: `৳ ${mealRate.toFixed(2)}` },
        { label: "Members", value: `${members.length} জন` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">মেসের নাম / মাস</label>
            <input
              type="text"
              value={messTitle}
              onChange={(e) => setMessTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">কমন খরচ (খালা বিল, গ্যাস, ওয়াইফাই ইত্যাদি)</label>
            <input
              type="number"
              value={commonCost}
              onChange={(e) => setCommonCost(Number(e.target.value))}
              className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>মেস মেম্বার তালিকা ({members.length} জন)</span>
              </label>
              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> মেম্বার যোগ করুন
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleUpdateMember(m.id, "name", e.target.value)}
                      placeholder="নাম"
                      className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={m.meals}
                      onChange={(e) => handleUpdateMember(m.id, "meals", Number(e.target.value))}
                      placeholder="মিল"
                      title="মিল সংখ্যা"
                      className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={m.bazarPaid}
                      onChange={(e) => handleUpdateMember(m.id, "bazarPaid", Number(e.target.value))}
                      placeholder="বাজার"
                      title="বাজার জমা (৳)"
                      className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-amber-400"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">CALCULATED MEAL RATE</span>
              <h2 className="text-2xl font-bold font-mono text-white">৳ {mealRate.toFixed(2)}</h2>
              <p className="text-[11px] text-neutral-400">মোট বাজার ৳{totalBazar} ÷ মোট মিল {totalMeals}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">কমন খরচ/জন</span>
              <p className="text-lg font-bold font-mono text-neutral-200">৳ {Math.round(commonPerMember)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
            <div className="p-3 border-b border-neutral-800 font-semibold text-xs text-white">
              সদস্যভিত্তিক হিসাব ও দেনা-পাওনা
            </div>
            <div className="divide-y divide-neutral-900 text-xs">
              {members.map((m) => {
                const mealCost = m.meals * mealRate;
                const totalCost = mealCost + commonPerMember;
                const balance = m.bazarPaid - totalCost;
                const isRefund = balance >= 0;

                return (
                  <div key={m.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {m.meals} মিল × ৳{mealRate.toFixed(2)} + কমন ৳{Math.round(commonPerMember)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                          isRefund
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {isRefund ? `ফেরত পাবে +৳${Math.round(balance)}` : `দিতে হবে -৳${Math.round(Math.abs(balance))}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    />
  );
}
