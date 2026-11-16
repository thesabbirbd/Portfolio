"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Activity,
  Plus,
  Trash2,
  Stethoscope,
  Sparkles,
  Heart,
  Calendar,
  User,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface MedicineItem {
  id: string;
  name: string;
  dosage: string; // e.g. "১+০+১ খাবার পর"
  duration: string; // e.g. "৭ দিন"
  instruction: string;
}

export function PrescriptionHealthPadStudio() {
  const [doctorName, setDoctorName] = useState("ডা: এ. কে. এম. সাব্বির");
  const [degrees, setDegrees] = useState("MBBS (DMC), BCS (Health), FCPS (Medicine)");
  const [chamberInfo, setChamberInfo] = useState("পপুলার ডায়াগনস্টিক সেন্টার, ধানমন্ডি, ঢাকা");
  const [patientName, setPatientName] = useState("মোসা: রোকেয়া বেগম");
  const [patientAge, setPatientAge] = useState("৪৫ বছর");
  const [patientGender, setPatientGender] = useState("মহিলা");
  const [bp, setBp] = useState("120/80");
  const [weight, setWeight] = useState("64 kg");
  const [complaint, setComplaint] = useState("তীব্র মাথাব্যথা, ক্লান্তি ও হালকা জ্বর ৩ দিন ধরে।");

  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: "1", name: "Tab. Napa Extra 500mg", dosage: "১+০+১", duration: "৫ দিন", instruction: "খাবার পর" },
    { id: "2", name: "Cap. Seclo 20mg", dosage: "১+০+১", duration: "১৪ দিন", instruction: "খাবার ২০ মিনিট আগে" },
    { id: "3", name: "Tab. Bizoran 5/20", dosage: "০+০+১", duration: "চলবে", instruction: "রাতে খাবার পর" },
  ]);

  const handleAddMedicine = () => {
    sound.click();
    setMedicines([
      ...medicines,
      { id: String(Date.now()), name: "Tab. New Med 500mg", dosage: "১+০+১", duration: "৭ দিন", instruction: "খাবার পর" },
    ]);
  };

  const handleRemoveMedicine = (id: string) => {
    sound.pop();
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, field: keyof MedicineItem, val: string) => {
    setMedicines(medicines.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  const handleLoadSample = () => {
    sound.click();
    setDoctorName("ডা: মো: জামিল হোসেন");
    setDegrees("MBBS, MD (Cardiology), NICVD");
    setChamberInfo("ল্যাবএইড কার্ডিয়াক হাসপাতাল, ঢাকা");
    setPatientName("আব্দুল কাদের");
    setPatientAge("৫৮ বছর");
    setPatientGender("পুরুষ");
    setBp("135/85");
    setWeight("72 kg");
    setComplaint("বুকে ভারী ভাব, সিঁড়ি দিয়ে উঠলে শ্বাসকষ্ট।");
    setMedicines([
      { id: "1", name: "Tab. Anclog 75mg", dosage: "০+১+০", duration: "চলবে", instruction: "দুপুরে খাবার পর" },
      { id: "2", name: "Tab. Rosuva 10mg", dosage: "০+০+১", duration: "চলবে", instruction: "রাতে খাবার পর" },
      { id: "3", name: "Tab. Concor 2.5mg", dosage: "১+০+০", duration: "চলবে", instruction: "সকালে খাবার পর" },
    ]);
  };

  const exportPayload = {
    doctorName,
    degrees,
    chamberInfo,
    patientName,
    patientAge,
    bp,
    weight,
    complaint,
    medicines,
    date: new Date().toLocaleDateString("bn-BD"),
  };

  return (
    <StudioWorkspaceShell
      toolSlug="prescription-health-pad"
      toolTitle="Digital Doctor Rx Prescription Pad"
      category="Health & Life"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Doctor", value: doctorName.slice(0, 20) },
        { label: "Patient", value: `${patientName} (${patientAge})` },
        { label: "BP & Vitals", value: `${bp} mmHg · ${weight}` },
        { label: "Medicines", value: `${medicines.length} Items` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">চিকিৎসকের নাম ও পদবী</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
            <input
              type="text"
              value={degrees}
              onChange={(e) => setDegrees(e.target.value)}
              className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-neutral-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">রোগীর নাম</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">বয়স</label>
              <input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">ব্লাড প্রেশার (BP)</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">লক্ষণ ও প্রধান সমস্যা (Chief Complaints)</label>
            <textarea
              rows={2}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                <span>ঔষধের তালিকা (Rx Medicines)</span>
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> ঔষধ যোগ করুন
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {medicines.map((med) => (
                <div key={med.id} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleUpdateMedicine(med.id, "name", e.target.value)}
                      placeholder="ঔষধের নাম"
                      className="flex-1 text-xs font-bold rounded-lg border border-neutral-800 bg-neutral-950 p-1.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(med.id)}
                      className="text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleUpdateMedicine(med.id, "dosage", e.target.value)}
                      placeholder="১+০+১"
                      className="rounded border border-neutral-800 bg-neutral-950 p-1 text-amber-400 font-mono text-center"
                    />
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleUpdateMedicine(med.id, "duration", e.target.value)}
                      placeholder="৭ দিন"
                      className="rounded border border-neutral-800 bg-neutral-950 p-1 text-neutral-300 text-center"
                    />
                    <input
                      type="text"
                      value={med.instruction}
                      onChange={(e) => handleUpdateMedicine(med.id, "instruction", e.target.value)}
                      placeholder="খাবার পর"
                      className="rounded border border-neutral-800 bg-neutral-950 p-1 text-neutral-300 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          {/* Printable A4 Rx Prescription Layout */}
          <div className="rounded-3xl border-2 border-neutral-700 bg-white text-neutral-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Doctor Header */}
            <div className="border-b-2 border-neutral-900 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight text-neutral-900">{doctorName}</h2>
                <p className="text-xs font-medium text-neutral-700 font-mono">{degrees}</p>
                <p className="text-[11px] text-neutral-500">{chamberInfo}</p>
              </div>
              <div className="text-right text-xs font-mono text-neutral-600">
                <p>তারিখ: {new Date().toLocaleDateString("en-GB")}</p>
              </div>
            </div>

            {/* Patient Vitals Strip */}
            <div className="bg-neutral-100 p-3 rounded-xl border border-neutral-300 grid grid-cols-4 gap-2 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[10px]">রোগী</span>
                <span className="font-bold">{patientName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">বয়স/লিঙ্গ</span>
                <span>{patientAge} · {patientGender}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">ব্লাড প্রেশার</span>
                <span className="font-bold text-rose-700">{bp}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">ওজন</span>
                <span>{weight}</span>
              </div>
            </div>

            {/* Rx Body Layout */}
            <div className="grid grid-cols-12 gap-6 min-h-[300px]">
              {/* Complaints / Tests Left Column */}
              <div className="col-span-4 border-r border-neutral-300 pr-4 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-neutral-700 uppercase font-mono text-[10px]">C/C (অভিযোগ):</h4>
                  <p className="text-neutral-800 mt-1 leading-relaxed">{complaint}</p>
                </div>
              </div>

              {/* Rx Medicines List */}
              <div className="col-span-8 space-y-4">
                <div className="text-2xl font-serif font-black italic text-neutral-900">℞</div>
                <div className="space-y-3">
                  {medicines.map((m, idx) => (
                    <div key={m.id} className="text-xs border-b border-neutral-200 pb-2">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-sm text-neutral-900">{idx + 1}. {m.name}</span>
                        <span className="font-mono text-neutral-600 font-bold">{m.duration}</span>
                      </div>
                      <p className="font-mono text-neutral-700 mt-0.5">
                        মাত্রা: <strong className="text-neutral-900">{m.dosage}</strong> ({m.instruction})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctor Signature Footer */}
            <div className="pt-8 border-t border-neutral-200 flex justify-between items-end text-[11px] text-neutral-500">
              <span>THE SABBiR OS Digital Health Pad · sabbir.nav.bd</span>
              <div className="text-center font-mono">
                <div className="w-36 border-b border-neutral-900 mb-1" />
                <span>চিকিৎসকের স্বাক্ষর</span>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
