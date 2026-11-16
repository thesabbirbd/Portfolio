"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Truck,
  PhoneCall,
  MapPin,
  Sparkles,
  Search,
  ShieldAlert,
  Clock,
  DollarSign,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface CourierTariff {
  name: string;
  insideDhaka: number;
  subDhaka: number;
  outsideDhaka: number;
  codPercent: number;
}

const COURIER_PROVIDERS: CourierTariff[] = [
  { name: "Steadfast Courier", insideDhaka: 60, subDhaka: 100, outsideDhaka: 130, codPercent: 1.0 },
  { name: "Pathao Courier", insideDhaka: 60, subDhaka: 100, outsideDhaka: 120, codPercent: 1.0 },
  { name: "RedX Delivery", insideDhaka: 70, subDhaka: 100, outsideDhaka: 130, codPercent: 1.0 },
  { name: "eCourier BD", insideDhaka: 60, subDhaka: 90, outsideDhaka: 130, codPercent: 0.5 },
  { name: "Sundarban Parcel", insideDhaka: 80, subDhaka: 110, outsideDhaka: 150, codPercent: 0.0 },
];

const EMERGENCY_HELPLINES = [
  { number: "999", name: "জাতীয় জরুরি সেবা (National Emergency)", desc: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স", tollFree: true },
  { number: "333", name: "সরকারি তথ্য ও সামাজিক সমস্যা", desc: "নাগরিক সেবা ও ত্রাণ সহায়তা", tollFree: true },
  { number: "109", name: "নারী ও শিশু নির্যাতন প্রতিরোধ", desc: "জরুরি আইনি ও পুলিশি সহায়তা", tollFree: true },
  { number: "16263", name: "স্বাস্থ্য বাতায়ন (Health Call Center)", desc: "২৪ ঘণ্টা সরকারি স্বাস্থ্য পরামর্শ", tollFree: false },
  { number: "106", name: "দুদক হটলাইন (Anti-Corruption)", desc: "দুর্নীতি ও ঘুষ প্রতিরোধ রিপোর্ট", tollFree: true },
  { number: "16122", name: "ভূমি সেবা হটলাইন (Land Ministry)", desc: "নামজারি, খতিয়ান ও জমি জমার তথ্য", tollFree: true },
];

const DISTRICT_POSTCODES = [
  { district: "Dhaka (ঢাকা)", postcode: "1000", gpo: "Dhaka GPO" },
  { district: "Rajshahi (রাজশাহী)", postcode: "6000", gpo: "Rajshahi Head PO" },
  { district: "Chattogram (চট্টগ্রাম)", postcode: "4000", gpo: "Chittagong GPO" },
  { district: "Sylhet (সিলেট)", postcode: "3100", gpo: "Sylhet Head PO" },
  { district: "Khulna (খুলনা)", postcode: "9000", gpo: "Khulna Head PO" },
  { district: "Barishal (বরিশাল)", postcode: "8200", gpo: "Barishal Head PO" },
  { district: "Rangpur (রংপুর)", postcode: "5400", gpo: "Rangpur Head PO" },
  { district: "Mymensingh (ময়মনসিংহ)", postcode: "2200", gpo: "Mymensingh Head PO" },
  { district: "Bogura (বগুড়া)", postcode: "5800", gpo: "Bogura Head PO" },
  { district: "Cumilla (কুমিল্লা)", postcode: "3500", gpo: "Cumilla Head PO" },
];

export function BdEmergencyCourierStudio() {
  const [activeSubTab, setActiveSubTab] = useState<"courier" | "helpline" | "postcode">("courier");
  const [parcelWeight, setParcelWeight] = useState(1); // in KG
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "sub" | "outside">("outside");
  const [cashOnDeliveryAmount, setCashOnDeliveryAmount] = useState(1500);
  const [postcodeSearch, setPostcodeSearch] = useState("");

  const handleLoadSample = () => {
    sound.click();
    setParcelWeight(2);
    setDeliveryArea("outside");
    setCashOnDeliveryAmount(2800);
  };

  const exportPayload = {
    parcelWeight,
    deliveryArea,
    cashOnDeliveryAmount,
    comparison: COURIER_PROVIDERS.map((c) => {
      const baseCharge = deliveryArea === "inside" ? c.insideDhaka : deliveryArea === "sub" ? c.subDhaka : c.outsideDhaka;
      const weightSurcharge = Math.max(0, parcelWeight - 1) * 20;
      const codCharge = Math.round((cashOnDeliveryAmount * c.codPercent) / 100);
      return {
        courier: c.name,
        baseCharge,
        weightSurcharge,
        codCharge,
        totalDeliveryCharge: baseCharge + weightSurcharge + codCharge,
      };
    }),
  };

  const filteredPostcodes = DISTRICT_POSTCODES.filter(
    (p) =>
      p.district.toLowerCase().includes(postcodeSearch.toLowerCase()) ||
      p.postcode.includes(postcodeSearch)
  );

  return (
    <StudioWorkspaceShell
      toolSlug="bd-emergency-courier-tracker"
      toolTitle="BD Courier Delivery Charge & National Emergency Hub"
      category="Business & Accounts"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Parcel Weight", value: `${parcelWeight} KG` },
        { label: "Destination", value: deliveryArea === "inside" ? "Inside Dhaka" : deliveryArea === "sub" ? "Sub-Dhaka" : "Outside Dhaka" },
        { label: "COD Amount", value: `৳ ${cashOnDeliveryAmount}` },
        { label: "Cheapest Courier", value: "Steadfast / Pathao" },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveSubTab("courier")}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                activeSubTab === "courier" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              কুরিয়ার চার্জ
            </button>
            <button
              onClick={() => setActiveSubTab("helpline")}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                activeSubTab === "helpline" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              জরুরি হটলাইন
            </button>
            <button
              onClick={() => setActiveSubTab("postcode")}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                activeSubTab === "postcode" ? "bg-amber-500 text-neutral-950 font-bold" : "text-neutral-400"
              }`}
            >
              পোস্টকোড ডিরেক্টরি
            </button>
          </div>

          {activeSubTab === "courier" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">পার্সেলের ওজন (কেজি)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={parcelWeight}
                  onChange={(e) => setParcelWeight(Number(e.target.value))}
                  className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">ডেলিভারি এরিয়া</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "inside", label: "ঢাকার ভেতরে" },
                    { id: "sub", label: "উপশহর / সাব-ঢাকা" },
                    { id: "outside", label: "ঢাকার বাইরে (সারা দেশ)" },
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setDeliveryArea(a.id as any)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        deliveryArea === a.id
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">ক্যাশ অন ডেলিভারি (COD) কালেকশন (৳)</label>
                <input
                  type="number"
                  value={cashOnDeliveryAmount}
                  onChange={(e) => setCashOnDeliveryAmount(Number(e.target.value))}
                  className="w-full text-xs font-mono rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-amber-400 font-bold"
                />
              </div>
            </div>
          )}

          {activeSubTab === "postcode" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={postcodeSearch}
                  onChange={(e) => setPostcodeSearch(e.target.value)}
                  placeholder="জেলা বা পোস্টকোড খুঁজুন (যেমন: Rajshahi বা 1000)..."
                  className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 pl-9 p-2.5 text-white placeholder-neutral-500"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredPostcodes.map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{p.district}</p>
                      <p className="text-[10px] text-neutral-500">{p.gpo}</p>
                    </div>
                    <span className="font-mono text-amber-400 font-bold text-sm bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {p.postcode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "helpline" && (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {EMERGENCY_HELPLINES.map((h, i) => (
                <div key={i} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-rose-400">{h.number}</span>
                      <span className="text-xs font-bold text-white">{h.name}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{h.desc}</p>
                  </div>
                  <a
                    href={`tel:${h.number}`}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>কুরিয়ার চার্জের তুলনামূলক তালিকা</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {parcelWeight} কেজি পার্সেল • {deliveryArea === "inside" ? "ঢাকার ভেতরে" : deliveryArea === "sub" ? "উপশহর" : "ঢাকার বাইরে"} • COD ৳{cashOnDeliveryAmount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {COURIER_PROVIDERS.map((c, i) => {
                const baseCharge = deliveryArea === "inside" ? c.insideDhaka : deliveryArea === "sub" ? c.subDhaka : c.outsideDhaka;
                const weightSurcharge = Math.max(0, parcelWeight - 1) * 20;
                const codCharge = Math.round((cashOnDeliveryAmount * c.codPercent) / 100);
                const total = baseCharge + weightSurcharge + codCharge;

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs transition-colors hover:border-neutral-700"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        বেজ: ৳{baseCharge} + অতিরিক্ত ওজন: ৳{weightSurcharge} + COD ({c.codPercent}%): ৳{codCharge}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-neutral-500 block uppercase">সর্বমোট খরচ</span>
                      <span className="text-lg font-bold text-amber-400">৳ {total}</span>
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
