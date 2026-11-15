"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Activity,
  Heart,
  Download,
  Printer,
  Sparkles,
  ShieldAlert,
  User,
  Phone,
  Droplet,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  calculateExactAge,
  calculateBmiAndBmr,
  BmiBmrInput,
  EmergencyMedicalIdData,
  SAMPLE_MEDICAL_ID,
} from "@/lib/health/age-health-engine";
import { sound } from "@/lib/sound";

export function AgeHealthCardStudio() {
  const [activeTab, setActiveTab] = useState<"age" | "card">("age");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Tab 1: Age & Health Inputs
  const [birthDate, setBirthDate] = useState<string>("1996-08-15");
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [cutoffLimitYears, setCutoffLimitYears] = useState<number>(32);

  const [gender, setGender] = useState<"male" | "female">("male");
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);
  const [activityLevel, setActivityLevel] = useState<BmiBmrInput["activityLevel"]>("moderate");

  // Tab 2: Medical ID Card
  const [cardData, setCardData] = useState<EmergencyMedicalIdData>(SAMPLE_MEDICAL_ID);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "age-health-card",
    toolName: "Job Age & Emergency Medical Card Studio",
  });

  // Age calculations
  const ageResult = useMemo(
    () => calculateExactAge(birthDate, targetDate, cutoffLimitYears),
    [birthDate, targetDate, cutoffLimitYears]
  );

  // BMI/BMR calculations
  const bmiResult = useMemo(
    () =>
      calculateBmiAndBmr({
        gender,
        ageYears: ageResult.years || 28,
        heightCm,
        weightKg,
        activityLevel,
      }),
    [gender, ageResult.years, heightCm, weightKg, activityLevel]
  );

  // Download Wallet Medical ID Card PNG
  const handleDownloadCard = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      // Credit-card ratio: 1050 x 660 px (~85.6 x 54 mm @ 300dpi)
      canvas.width = 1050;
      canvas.height = 660;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Card Background (Deep Midnight Sapphire)
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(0, 0, 1050, 660);

      // Card Border with rounded rect
      ctx.strokeStyle = "#DC2626"; // Crimson medical border
      ctx.lineWidth = 6;
      ctx.strokeRect(16, 16, 1018, 628);

      // Top Red Header
      ctx.fillStyle = "#DC2626";
      ctx.fillRect(20, 20, 1010, 90);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("EMERGENCY MEDICAL ID CARD · জরুরি স্বাস্থ্য কার্ড", 50, 75);

      // Blood Group Big Badge on Top Right
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(860, 35, 140, 60);
      ctx.fillStyle = "#DC2626";
      ctx.font = "bold 44px monospace";
      ctx.fillText(cardData.bloodGroup, 890, 80);

      // Card Content
      let y = 160;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(cardData.fullName, 50, y);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "18px monospace";
      ctx.fillText(`DOB: ${cardData.birthDate} ${cardData.nationalIdNo ? `· NID: ${cardData.nationalIdNo}` : ""}`, 50, y + 35);

      // Allergy & Chronic Warning Box
      y += 80;
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(50, y, 950, 130);
      ctx.strokeStyle = "#475569";
      ctx.strokeRect(50, y, 950, 130);

      ctx.fillStyle = "#F87171";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("⚠️ ড্রাগ এলার্জি (Allergies):", 70, y + 35);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "16px sans-serif";
      ctx.fillText(cardData.allergies || "None", 320, y + 35);

      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("🩺 ক্রনিক রোগ (Conditions):", 70, y + 75);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "16px sans-serif";
      ctx.fillText(cardData.chronicConditions || "None", 320, y + 75);

      ctx.fillStyle = "#38BDF8";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("💊 নিয়মিত ওষুধ (Meds):", 70, y + 112);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "16px sans-serif";
      ctx.fillText(cardData.currentMedications || "None", 320, y + 112);

      // Emergency Contact Section
      y += 165;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("জরুরি যোগাযোগ (Emergency Contact):", 50, y);

      y += 35;
      ctx.fillStyle = "#4ADE80";
      ctx.font = "bold 28px monospace";
      ctx.fillText(cardData.emergencyContactPhone, 50, y);

      ctx.fillStyle = "#E2E8F0";
      ctx.font = "18px sans-serif";
      ctx.fillText(`(${cardData.emergencyContactName} · ${cardData.relationWithContact})`, 380, y);

      // Footer
      ctx.fillStyle = "#64748B";
      ctx.font = "14px monospace";
      ctx.fillText("Wallet-Sized Emergency Medical Identification · Generated via sabbir.nav.bd", 50, 610);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `emergency-medical-card-${cardData.bloodGroup}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="age-health-card"
      title="Exact Job Age Calculator, BMI/BMR & Emergency Medical ID"
      category="Career & Personal Health"
      popularityScore={96}
      lede="সরকারি চাকরির আবেদনের জন্য দিন-মাস-বছর নির্ভুল বয়স ও বিসিএস ৩২ বছর বয়সসীমা যাচাই, বিএমআই/বিএমআর ডায়েট চার্ট এবং ওয়ালেট-সাইজ মেডিকেল আইডি কার্ড।"
      activeStep={activeStep}
      getSharePayload={() => ({
        ageResult,
        bmiResult,
        cardData,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setBirthDate("1996-08-15");
            setCardData(SAMPLE_MEDICAL_ID);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>বিসিএস প্রার্থী স্যাম্পল লোড</span>
        </button>
      }
      exportSlot={
        <button
          onClick={handleDownloadCard}
          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Wallet ID Card (PNG)</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* 2 Main Studio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("age");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "age"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>১. চাকরির সঠিক বয়স ও বিএমআই (Job Age &amp; BMI)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("card");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "card"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>২. ওয়ালেট মেডিকেল আইডি কার্ড (Wallet Medical ID)</span>
          </button>
        </div>

        {/* TAB 1: EXACT JOB AGE & BMI */}
        {activeTab === "age" && (
          <div className="space-y-6">
            {/* Age Hero Banner */}
            <div
              className={`rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg ${
                ageResult.isBcsEligible
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                  বিজ্ঞপ্তির তারিখে আপনার বর্তমান সঠিক বয়স
                </span>
                <div className="text-3xl font-extrabold text-ink md:text-5xl font-mono">
                  {ageResult.formattedBn}
                </div>
                <p className="text-sm font-medium text-ink-2">{ageResult.cutoffStatusBn}</p>
              </div>

              <div className="rounded-2xl border border-line bg-surface/80 p-4 text-xs font-mono space-y-1.5 min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-ink-3">মোট অতিবাহিত দিন:</span>
                  <span className="text-ink font-bold">{ageResult.totalDays.toLocaleString("bn-BD")} দিন</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">বয়সসীমা কোটা:</span>
                  <span className="text-ink font-bold">{cutoffLimitYears} বছর</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1">
                  <span className="text-ink-3">যোগ্যতা স্ট্যাটাস:</span>
                  <span
                    className={`font-bold ${
                      ageResult.isBcsEligible ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {ageResult.isBcsEligible ? "✔ আবেদনযোগ্য" : "✖ বয়সসীমা শেষ"}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-line bg-surface p-5">
              <div>
                <label className="text-xs font-semibold text-ink-3">জন্ম তারিখ (Date of Birth)</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    setActiveStep(2);
                  }}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">হিসাবের শেষ তারিখ (Cutoff Date)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => {
                    setTargetDate(e.target.value);
                    setActiveStep(2);
                  }}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-3">সরকারি বয়সসীমা কোটা</label>
                <select
                  value={cutoffLimitYears}
                  onChange={(e) => setCutoffLimitYears(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink focus:border-amber-500 focus:outline-none"
                >
                  <option value={32}>৩২ বছর (সাধারণ প্রার্থীদের বর্তমান কোটা)</option>
                  <option value={30}>৩০ বছর (পূর্ববর্তী সাধারণ কোটা)</option>
                  <option value={35}>৩৫ বছর (মুক্তিযোদ্ধা / প্রতিবন্ধী কোটা)</option>
                </select>
              </div>
            </div>

            {/* BMI & BMR Health Metrics Section */}
            <div className="rounded-2xl border border-line bg-surface p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <Activity className="h-5 w-5 text-emerald-500" />
                <h4 className="text-sm font-bold text-ink">বিএমআই (BMI) ও ক্যালোরি ব্যয় (BMR/TDEE)</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold text-ink-3">উচ্চতা (সেমি)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">ওজন (কেজি)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">লিঙ্গ</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  >
                    <option value="male">পুরুষ (Male)</option>
                    <option value="female">নারী (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">শারীরিক পরিশ্রম</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  >
                    <option value="sedentary">অফিস কাজ / কম পরিশ্রম</option>
                    <option value="light">হালকা ব্যায়াম (১-৩ দিন)</option>
                    <option value="moderate">মাঝারি পরিশ্রম (৩-৫ দিন)</option>
                    <option value="active">কঠোর পরিশ্রম (প্রতিদিন)</option>
                  </select>
                </div>
              </div>

              {/* BMI Output Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-muted/20 p-4">
                  <div className="text-xs text-ink-3 font-semibold">বডি ম্যাস ইনডেক্স (BMI)</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-emerald-500">{bmiResult.bmi}</div>
                  <div className="text-xs text-ink-2 mt-0.5">{bmiResult.bmiClassificationBn}</div>
                </div>

                <div className="rounded-xl border border-line bg-muted/20 p-4">
                  <div className="text-xs text-ink-3 font-semibold">দৈনিক ক্যালোরি চাহিদা (TDEE)</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-amber-500">
                    {bmiResult.tdeeCalories} kcal
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">বেস মেটাবলিজম: {bmiResult.bmrCalories} kcal</div>
                </div>

                <div className="rounded-xl border border-line bg-muted/20 p-4">
                  <div className="text-xs text-ink-3 font-semibold">দৈনিক পানি ও আদর্শ ওজন</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-blue-500">
                    {bmiResult.dailyWaterLiters} লিটার
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">
                    আদর্শ ওজন: {bmiResult.idealWeightRangeKg[0]}–{bmiResult.idealWeightRangeKg[1]} কেজি
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMERGENCY MEDICAL ID CARD */}
        {activeTab === "card" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Card Inputs */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                  ব্যক্তিগত ও স্বাস্থ্য তথ্য
                </h4>

                <div>
                  <label className="text-xs font-semibold text-ink-3">পুরো নাম</label>
                  <input
                    type="text"
                    value={cardData.fullName}
                    onChange={(e) => setCardData({ ...cardData, fullName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">রক্তের গ্রুপ (Blood Group)</label>
                    <select
                      value={cardData.bloodGroup}
                      onChange={(e) => setCardData({ ...cardData, bloodGroup: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-bold text-rose-500"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">জাতীয় পরিচয়পত্র (NID)</label>
                    <input
                      type="text"
                      value={cardData.nationalIdNo || ""}
                      onChange={(e) => setCardData({ ...cardData, nationalIdNo: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">ড্রাগ বা খাবারের এলার্জি (Allergies)</label>
                  <input
                    type="text"
                    value={cardData.allergies}
                    onChange={(e) => setCardData({ ...cardData, allergies: e.target.value })}
                    placeholder="যেমন: পেনিসিলিন, ডাস্ট, চিংড়ি"
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">ক্রনিক রোগ বা সমস্যা (Conditions)</label>
                  <input
                    type="text"
                    value={cardData.chronicConditions}
                    onChange={(e) => setCardData({ ...cardData, chronicConditions: e.target.value })}
                    placeholder="যেমন: ডায়াবেটিস, অ্যাজমা, উচ্চ রক্তচাপ"
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">জরুরি কন্টাক্ট নাম</label>
                    <input
                      type="text"
                      value={cardData.emergencyContactName}
                      onChange={(e) =>
                        setCardData({ ...cardData, emergencyContactName: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">জরুরি মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={cardData.emergencyContactPhone}
                      onChange={(e) =>
                        setCardData({ ...cardData, emergencyContactPhone: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Card Live Preview */}
              <div className="flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md aspect-[85.6/54] rounded-2xl border-2 border-rose-600 bg-slate-900 text-white p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex items-start justify-between border-b border-slate-700 pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                        EMERGENCY MEDICAL ID
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">{cardData.fullName}</div>
                    </div>
                    <div className="rounded-lg bg-rose-600 px-3 py-1 font-mono text-lg font-black text-white">
                      {cardData.bloodGroup}
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 py-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">এলার্জি:</span>
                      <span className="text-rose-300 font-semibold">{cardData.allergies || "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ক্রনিক রোগ:</span>
                      <span className="text-amber-300 font-semibold">{cardData.chronicConditions || "None"}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-2 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">জরুরি যোগাযোগ:</div>
                      <div className="font-mono font-bold text-emerald-400">{cardData.emergencyContactPhone}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">sabbir.nav.bd</span>
                  </div>
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
