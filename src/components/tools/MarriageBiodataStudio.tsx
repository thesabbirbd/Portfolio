"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Heart,
  Plus,
  Trash2,
  Sparkles,
  Download,
  Share2,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
} from "lucide-react";
import { sound } from "@/lib/sound";

export function MarriageBiodataStudio() {
  const [template, setTemplate] = useState<"islamic" | "modern">("islamic");
  const [candidateType, setCandidateType] = useState<"পাত্রের বায়োডাটা" | "পাত্রীর বায়োডাটা">("পাত্রের বায়োডাটা");
  const [name, setName] = useState("মো: সাব্বিরুল ইসলাম খান");
  const [birthYear, setBirthYear] = useState("১৯৯৮");
  const [height, setHeight] = useState("৫ ফুট ৯ ইঞ্চি");
  const [complexion, setComplexion] = useState("উজ্জ্বল শ্যামলা");
  const [education, setEducation] = useState("বিএসসি ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)");
  const [profession, setProfession] = useState("সফটওয়্যার ইঞ্জিনিয়ার ও টেক ফাউন্ডার");
  const [monthlyIncome, setMonthlyIncome] = useState("১,৫০,০০০+ ৳");
  const [religiousPractice, setReligiousPractice] = useState("পাঁচ ওয়াক্ত নামাজী, সুন্নতি দাঁড়ি রয়েছে, হালাল উপার্জনে প্রতিজ্ঞাবদ্ধ।");
  const [fatherOccupation, setFatherOccupation] = useState("অবসরপ্রাপ্ত সরকারি কর্মকর্তা");
  const [motherOccupation, setMotherOccupation] = useState("গৃহিণী");
  const [siblings, setSiblings] = useState("১ ভাই ও ১ বোন (উভয়েই বিবাহিত)");
  const [district, setDistrict] = useState("রাজশাহী");
  const [presentAddress, setPresentAddress] = useState("উত্তরা, ঢাকা");
  const [partnerExpectation, setPartnerExpectation] = useState("নম্র স্বভাবের, দ্বীনদার, পাঁচ ওয়াক্ত নামাজী ও পর্দাশীল জীবনযাপনে আগ্রহী।");

  const handleLoadSample = () => {
    sound.click();
    setCandidateType("পাত্রের বায়োডাটা");
    setName("মাহমুদুল হাসান");
    setBirthYear("১৯৯৬");
    setHeight("৫ ফুট ৮ ইঞ্চি");
    setComplexion("ফর্সা");
    setEducation("এমবিএ (ঢাকা বিশ্ববিদ্যালয়)");
    setProfession("সিনিয়র অফিসার, বেসরকারি ব্যাংক");
    setMonthlyIncome("৮৫,০০০ ৳");
    setReligiousPractice("পাঁচ ওয়াক্ত নামাজ পড়েন, ধূমপানমুক্ত।");
    setFatherOccupation("ব্যবসায়ী");
    setMotherOccupation("গৃহিণী");
    setDistrict("বগুড়া");
    setPresentAddress("ধানমন্ডি, ঢাকা");
    setPartnerExpectation("দ্বীনদার, মার্জিত ও পারিবারিক মূল্যবোধসম্পন্ন পাত্রী।");
  };

  const exportPayload = {
    template,
    candidateType,
    name,
    birthYear,
    height,
    complexion,
    education,
    profession,
    monthlyIncome,
    religiousPractice,
    family: {
      father: fatherOccupation,
      mother: motherOccupation,
      siblings,
    },
    district,
    presentAddress,
    partnerExpectation,
  };

  return (
    <StudioWorkspaceShell
      toolSlug="marriage-biodata-maker"
      toolTitle="Bangla & Islamic Marriage Biodata Studio"
      category="Family & Finance"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Candidate", value: name.slice(0, 18) },
        { label: "Type", value: candidateType },
        { label: "Education", value: education.slice(0, 20) },
        { label: "District", value: district },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setCandidateType("পাত্রের বায়োডাটা")}
              className={`py-2 text-xs font-semibold rounded-lg ${
                candidateType === "পাত্রের বায়োডাটা" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              পাত্রের বায়োডাটা
            </button>
            <button
              onClick={() => setCandidateType("পাত্রীর বায়োডাটা")}
              className={`py-2 text-xs font-semibold rounded-lg ${
                candidateType === "পাত্রীর বায়োডাটা" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              পাত্রীর বায়োডাটা
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">পূর্ণ নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">জন্মসাল</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">উচ্চতা</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">গায়ের রঙ</label>
              <input
                type="text"
                value={complexion}
                onChange={(e) => setComplexion(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">শিক্ষাগত যোগ্যতা</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">পেশা ও কর্মক্ষেত্র</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">মাসিক আয় (ঐচ্ছিক)</label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">দ্বীনি ও ইসলামিক তথ্য</label>
            <textarea
              rows={2}
              value={religiousPractice}
              onChange={(e) => setReligiousPractice(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">পিতার পেশা</label>
              <input
                type="text"
                value={fatherOccupation}
                onChange={(e) => setFatherOccupation(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">মাতার পেশা</label>
              <input
                type="text"
                value={motherOccupation}
                onChange={(e) => setMotherOccupation(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">স্থায়ী জেলা</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">বর্তমান ঠিকানা</label>
              <input
                type="text"
                value={presentAddress}
                onChange={(e) => setPresentAddress(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">কেমন জীবনসঙ্গী প্রত্যাশা করেন?</label>
            <textarea
              rows={2}
              value={partnerExpectation}
              onChange={(e) => setPartnerExpectation(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          {/* Printable Marriage Biodata Card */}
          <div className="rounded-3xl border-2 border-amber-500/30 bg-neutral-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Islamic Header */}
            <div className="text-center space-y-1 border-b border-neutral-800 pb-4">
              <p className="font-arabic text-amber-400 text-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <h2 className="text-xl font-bold text-white tracking-tight">{candidateType}</h2>
              <p className="text-xs text-neutral-400">THE SABBiR OS বায়োডাটা জেনারেটর · ১০০% গোপনীয় ও নিরাপদ</p>
            </div>

            {/* Candidate Identity */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-neutral-500 block text-[10px]">নাম</span>
                  <span className="font-bold text-white text-sm">{name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">জন্মসাল</span>
                  <span className="font-mono text-amber-400 font-bold">{birthYear}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">উচ্চতা</span>
                  <span className="text-white">{height}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">গায়ের রঙ</span>
                  <span className="text-white">{complexion}</span>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-amber-400 block mb-1">🎓 শিক্ষাগত যোগ্যতা:</span>
                  <p className="text-neutral-200">{education}</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-emerald-400 block mb-1">💼 পেশা ও উপার্জন:</span>
                  <p className="text-neutral-200">{profession} ({monthlyIncome})</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-sky-400 block mb-1">🕌 দ্বীনি জীবনযাপন:</span>
                  <p className="text-neutral-200">{religiousPractice}</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-purple-400 block mb-1">👨‍👩‍👧 পারিবারিক বিবরণ:</span>
                  <p className="text-neutral-200">
                    পিতা: {fatherOccupation} • মাতা: {motherOccupation} • ভাইবোন: {siblings}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-rose-400 block mb-1">📍 ঠিকানা:</span>
                  <p className="text-neutral-200">স্থায়ী জেলা: {district} • বর্তমান ঠিকানা: {presentAddress}</p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850">
                  <span className="text-[11px] font-bold text-amber-300 block mb-1">✨ প্রত্যাশা:</span>
                  <p className="text-neutral-200">{partnerExpectation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
