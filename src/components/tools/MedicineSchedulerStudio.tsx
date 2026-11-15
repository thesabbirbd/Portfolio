"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Download,
  Printer,
  Sparkles,
  Clock,
  Pill,
  DollarSign,
  Sun,
  Moon,
  Sunset,
  AlertCircle,
  FileDown,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  MedicineDoseItem,
  RefillSummary,
  parseDosePattern,
  calculateMedicineRefill,
  generateIcsCalendar,
  formatInstructionBn,
  SAMPLE_PRESCRIPTION_DIABETIC,
} from "@/lib/health/medicine-schedule-engine";
import { sound } from "@/lib/sound";

export function MedicineSchedulerStudio() {
  const [patientName, setPatientName] = useState("জনাব রফিকুল ইসলাম");
  const [doctorName, setDoctorName] = useState("ডাঃ এম এ করিম (FCPS, Medicine)");
  const [items, setItems] = useState<MedicineDoseItem[]>(SAMPLE_PRESCRIPTION_DIABETIC);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // New item form state
  const [newName, setNewName] = useState("");
  const [newStrength, setNewStrength] = useState("500mg");
  const [newType, setNewType] = useState<MedicineDoseItem["type"]>("tablet");
  const [newPattern, setNewPattern] = useState("1+0+1");
  const [newInstruction, setNewInstruction] = useState<MedicineDoseItem["instruction"]>("after_meal");
  const [newDuration, setNewDuration] = useState(14);
  const [newUnitPrice, setNewUnitPrice] = useState(5);
  const [newNotes, setNewNotes] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "medicine-scheduler",
    toolName: "Prescription Dose Chart & Pill Refill Studio",
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    sound.click();
    const parsed = parseDosePattern(newPattern);
    const newItem: MedicineDoseItem = {
      id: `med-${Date.now()}`,
      name: newName.trim(),
      strength: newStrength.trim(),
      type: newType,
      rawDosePattern: newPattern,
      morningCount: parsed.morning,
      noonCount: parsed.noon,
      nightCount: parsed.night,
      isSos: parsed.isSos,
      instruction: newInstruction,
      durationDays: Number(newDuration) || 7,
      unitPriceBdt: Number(newUnitPrice) || 0,
      stripSize: 10,
      notes: newNotes.trim(),
    };

    setItems((prev) => [...prev, newItem]);
    setNewName("");
    setNewNotes("");
    setActiveStep(2);
  };

  const handleRemoveItem = (id: string) => {
    sound.click();
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleLoadSample = () => {
    sound.click();
    setItems(SAMPLE_PRESCRIPTION_DIABETIC);
    setPatientName("জনাব রফিকুল ইসলাম");
    setDoctorName("ডাঃ এম এ করিম (FCPS, Medicine)");
    setActiveStep(2);
  };

  // Grand totals
  const overallSummary = useMemo(() => {
    let totalCost = 0;
    let totalPills = 0;
    let totalStrips = 0;
    for (const item of items) {
      const ref = calculateMedicineRefill(item);
      totalCost += ref.totalCostBdt;
      totalPills += ref.totalPillsNeeded;
      totalStrips += ref.stripsToBuy;
    }
    return { totalCost, totalPills, totalStrips };
  }, [items]);

  // Download ICS Alarms
  const handleDownloadIcs = () => {
    triggerExport(() => {
      setActiveStep(3);
      const ics = generateIcsCalendar(items);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `the-sabbir-medicine-alarms.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  // Download Printable Poster PNG
  const handleDownloadPoster = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1200, 1600);

      // Top Header Banner
      ctx.fillStyle = "#09090B";
      ctx.fillRect(40, 40, 1120, 160);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("💊 THE SABBiR OS — FAMILY HEALTH & DOSE CHART", 80, 85);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText(`রোগীর নাম: ${patientName}`, 80, 135);

      ctx.fillStyle = "#A1A1AA";
      ctx.font = "18px sans-serif";
      ctx.fillText(`প্রেসক্রিপশন প্রদানকারী: ${doctorName} · তারিখ: ${new Date().toLocaleDateString("bn-BD")}`, 80, 170);

      // Table Header
      let y = 260;
      ctx.fillStyle = "#F4F4F5";
      ctx.fillRect(40, y, 1120, 50);

      ctx.fillStyle = "#18181B";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("ওষুধের নাম ও পাওয়ার", 60, y + 32);
      ctx.fillText("সকাল 🌅", 420, y + 32);
      ctx.fillText("দুপুর ☀️", 540, y + 32);
      ctx.fillText("রাত 🌙", 660, y + 32);
      ctx.fillText("খাওয়ার নিয়ম", 780, y + 32);
      ctx.fillText("মেয়াদ", 1020, y + 32);

      // Table Rows
      y += 60;
      for (const item of items) {
        ctx.fillStyle = "#FAFAFA";
        ctx.fillRect(40, y, 1120, 65);
        ctx.strokeStyle = "#E4E4E7";
        ctx.strokeRect(40, y, 1120, 65);

        ctx.fillStyle = "#09090B";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(`${item.name} (${item.strength})`, 60, y + 30);
        ctx.fillStyle = "#71717A";
        ctx.font = "13px sans-serif";
        ctx.fillText(item.notes || item.type, 60, y + 50);

        // Doses
        ctx.fillStyle = item.morningCount > 0 ? "#D97706" : "#A1A1AA";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(item.isSos ? "-" : String(item.morningCount), 440, y + 40);

        ctx.fillStyle = item.noonCount > 0 ? "#D97706" : "#A1A1AA";
        ctx.fillText(item.isSos ? "-" : String(item.noonCount), 560, y + 40);

        ctx.fillStyle = item.nightCount > 0 ? "#D97706" : "#A1A1AA";
        ctx.fillText(item.isSos ? "-" : String(item.nightCount), 680, y + 40);

        // Instruction
        ctx.fillStyle = "#09090B";
        ctx.font = "16px sans-serif";
        ctx.fillText(formatInstructionBn(item.instruction), 780, y + 40);

        // Duration
        ctx.fillText(`${item.durationDays} দিন`, 1020, y + 40);

        y += 75;
      }

      // Summary Card at bottom
      y += 20;
      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(40, y, 1120, 120);
      ctx.strokeStyle = "#F59E0B";
      ctx.strokeRect(40, y, 1120, 120);

      ctx.fillStyle = "#92400E";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`মোট প্রয়োজনীয় ওষুধ: ${overallSummary.totalPills} টি (${overallSummary.totalStrips} পাতা)`, 70, y + 45);
      ctx.fillText(`আনুমানিক সর্বমোট খরচ: ৳ ${overallSummary.totalCost} BDT`, 70, y + 85);

      // Watermark Footer
      ctx.fillStyle = "#71717A";
      ctx.font = "14px monospace";
      ctx.fillText("Generated with THE SABBiR OS · sabbir.nav.bd · Personal Health Automation", 400, 1550);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `the-sabbir-dose-chart-${patientName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="medicine-scheduler"
      title="Prescription Dose Chart & Pill Refill Studio"
      category="Family Health & Digital Life"
      popularityScore={96}
      lede="প্রেসক্রিপশনের 1+0+1 সংকেত থেকে ওয়াল-পোস্টার চার্ট তৈরি, রিফিল তারিখ ও খরচের হিসাব এবং মোবাইল ক্যালেন্ডার অ্যালার্ম (.ics)।"
      activeStep={activeStep}
      getSharePayload={() => ({
        patientName,
        doctorName,
        items,
        overallSummary,
      })}
      sampleLoaderSlot={
        <button
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>ডায়াবেটিস ও প্রেশার স্যাম্পল লোড করুন</span>
        </button>
      }
      exportSlot={
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadIcs}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted transition-colors"
            title="Download .ics alarm for Google / iPhone calendar"
          >
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            <span>.ICS Alarm</span>
          </button>
          <button
            onClick={handleDownloadPoster}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Printable Chart (PNG)</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Patient & Doctor Header Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-line bg-surface p-5">
          <div>
            <label className="text-xs font-semibold text-ink-3">রোগীর নাম (Patient Name)</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm font-semibold text-ink focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-3">প্রেসক্রিপশন / ডাক্তারের বিবরণ (Doctor/Clinic)</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3.5 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Prescription Table Canvas */}
        <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-line bg-muted/30 px-6 py-4 gap-3">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-ink">প্রেসক্রিপশন চার্ট (সকাল · দুপুর · রাত)</h3>
            </div>
            <span className="text-xs font-mono text-ink-3">মোট {items.length} টি ওষুধ তালিকাভুক্ত</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-muted/40 text-xs font-semibold text-ink-3">
                <tr>
                  <th className="px-6 py-3">ওষুধের নাম ও পাওয়ার</th>
                  <th className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <Sun className="h-3.5 w-3.5 text-amber-500" /> সকাল
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <Sunset className="h-3.5 w-3.5 text-orange-500" /> দুপুর
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <Moon className="h-3.5 w-3.5 text-blue-500" /> রাত
                    </span>
                  </th>
                  <th className="px-6 py-3">নিয়ম (খাওয়ার সময়)</th>
                  <th className="px-4 py-3 text-center">মেয়াদ</th>
                  <th className="px-4 py-3 text-right">খরচ (BDT)</th>
                  <th className="px-4 py-3 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((item) => {
                  const ref = calculateMedicineRefill(item);
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-ink">
                          {item.name} <span className="text-xs font-mono text-amber-500">{item.strength}</span>
                        </div>
                        {item.notes && <div className="text-xs text-ink-3 mt-0.5">{item.notes}</div>}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-base text-ink">
                        {item.isSos ? "-" : item.morningCount}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-base text-ink">
                        {item.isSos ? "-" : item.noonCount}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-base text-ink">
                        {item.isSos ? "-" : item.nightCount}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-ink">
                        <span className="rounded-md bg-muted px-2 py-1">
                          {formatInstructionBn(item.instruction)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-xs text-ink-3 font-mono">
                        {item.durationDays} দিন
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs text-ink">
                        ৳{ref.totalCostBdt} <span className="text-[10px] text-ink-3">({ref.totalPillsNeeded}টি)</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="rounded-lg p-1.5 text-ink-3 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                          title="ওষুধ তালিকা থেকে মুছুন"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Medicine Form */}
        <form
          onSubmit={handleAddItem}
          className="rounded-2xl border border-line bg-surface p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <Plus className="h-4 w-4 text-amber-500" />
            <h4 className="text-sm font-bold text-ink">নতুন ওষুধ যোগ করুন</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-ink-3">ওষুধের নাম (Brand Name)</label>
              <input
                type="text"
                placeholder="যেমন: Napa, Maxpro, Seclo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-3">পাওয়ার (Power)</label>
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                placeholder="500mg / 20mg"
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-3">ডোজ প্যাটার্ন (Dose)</label>
              <input
                type="text"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder="1+0+1 / SOS"
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-3">নিয়ম (Timing)</label>
              <select
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              >
                <option value="after_meal">খাবার পরে (After Meal)</option>
                <option value="before_meal">খাবার আগে (Before Meal)</option>
                <option value="empty_stomach">খালি পেটে (Empty)</option>
                <option value="anytime">যেকোনো সময় (Anytime)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-3">মেয়াদ (Days)</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                min={1}
                max={365}
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-ink-3">প্রতিটির দাম (BDT)</label>
              <input
                type="number"
                value={newUnitPrice}
                onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                step={0.5}
                min={0}
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-ink-3">বিশেষ নির্দেশনা (Notes)</label>
              <input
                type="text"
                placeholder="যেমন: কুসুম গরম পানিতে খাবেন / রাতে ঘুমানোর আগে"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>ওষুধ যোগ করুন</span>
            </button>
          </div>
        </form>

        {/* Refill Summary Card */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="text-xs font-semibold text-ink-3">সর্বমোট ওষুধ সংখ্যা</div>
            <div className="mt-1 text-2xl font-bold text-amber-500">{overallSummary.totalPills} টি</div>
            <div className="text-xs text-ink-3 mt-1 font-mono">আনুমানিক {overallSummary.totalStrips} পাতা কিনতে হবে</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="text-xs font-semibold text-ink-3">ফার্মেসি খরচের হিসাব</div>
            <div className="mt-1 text-2xl font-bold text-emerald-500">৳ {overallSummary.totalCost}</div>
            <div className="text-xs text-ink-3 mt-1 font-mono">বর্তমান বাজার মূল্যের ওপর ভিত্তি করে</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="text-xs font-semibold text-ink-3">মোবাইল অ্যালার্ম ইন্টিগ্রেশন</div>
            <div className="mt-1 text-sm font-semibold text-ink">সকাল ৮:০০ · দুপুর ১:৩০ · রাত ৯:৩০</div>
            <div className="text-xs text-emerald-500 mt-1 font-mono">.ICS ক্যালেন্ডার ডাউনলোড রেডি</div>
          </div>
        </div>
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
