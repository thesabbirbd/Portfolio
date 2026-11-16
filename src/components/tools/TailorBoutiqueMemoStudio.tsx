"use client";

import React, { useState } from "react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import {
  Scissors,
  Plus,
  Trash2,
  Calendar,
  Receipt,
  User,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";

export function TailorBoutiqueMemoStudio() {
  const [tailorShopName, setTailorShopName] = useState("রয়াল টেইলার্স অ্যান্ড ফেব্রিক্স");
  const [customerName, setCustomerName] = useState("মো: ইকবাল হোসেন");
  const [customerPhone, setCustomerPhone] = useState("01715-998877");
  const [orderNo, setOrderNo] = useState("ORD-5482");
  const [deliveryDate, setDeliveryDate] = useState("২৫ নভেম্বর ২০২৬");
  const [itemType, setItemType] = useState<"panjabi" | "shirt" | "pant" | "kameez">("panjabi");

  // Measurements in inches
  const [length, setLength] = useState("42");
  const [chest, setChest] = useState("40");
  const [sleeve, setSleeve] = useState("24.5");
  const [collar, setCollar] = useState("15.5");
  const [shoulder, setShoulder] = useState("17.5");
  const [waist, setWaist] = useState("36");
  const [specialNote, setSpecialNote] = useState("ব্যান্ড কলার, সাইড পকেট ও ফিনিশ সেলাই।");

  // Financials
  const [totalCost, setTotalCost] = useState(650);
  const [advancePaid, setAdvancePaid] = useState(300);
  const dueAmount = Math.max(0, totalCost - advancePaid);

  const handleLoadSample = () => {
    sound.click();
    setTailorShopName("ভিআইপি টেইলার্স — নিউ মার্কেট, রাজশাহী");
    setCustomerName("আব্দুর রহমান");
    setCustomerPhone("01912-334455");
    setOrderNo("ORD-6120");
    setItemType("shirt");
    setLength("30");
    setChest("38");
    setSleeve("23");
    setCollar("15");
    setShoulder("17");
    setWaist("34");
    setSpecialNote("ফরমাল ফিটিং, ডাবল পকেট, রাউন্ড কাফ।");
    setTotalCost(550);
    setAdvancePaid(550);
  };

  const exportPayload = {
    tailorShopName,
    customerName,
    customerPhone,
    orderNo,
    deliveryDate,
    itemType,
    measurements: { length, chest, sleeve, collar, shoulder, waist },
    totalCost,
    advancePaid,
    dueAmount,
    specialNote,
  };

  return (
    <StudioWorkspaceShell
      toolSlug="tailor-boutique-memo"
      toolTitle="Tailor Measurement Book & Order Token"
      category="Business & Accounts"
      exportPayload={exportPayload}
      summaryHighlights={[
        { label: "Order Token", value: orderNo },
        { label: "Customer", value: customerName.slice(0, 18) },
        { label: "Total Cost", value: `৳ ${totalCost}` },
        { label: "Due Amount", value: `৳ ${dueAmount}` },
      ]}
      onLoadSample={handleLoadSample}
      inputSlot={
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">টেইলার্স / বুটিক শপের নাম</label>
            <input
              type="text"
              value={tailorShopName}
              onChange={(e) => setTailorShopName(e.target.value)}
              className="w-full text-xs rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">কাস্টমার নাম</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">মোবাইল নম্বর</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">অর্ডার টোকেন নং</label>
              <input
                type="text"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-400 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">ডেলিভারি তারিখ</label>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
          </div>

          {/* Measurements Grid (Inches) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              <span>শরীরের মাপ (ইঞ্চি)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">লম্বা (Length)</span>
                <input
                  type="text"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">ছাতি (Chest)</span>
                <input
                  type="text"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">হাতা (Sleeve)</span>
                <input
                  type="text"
                  value={sleeve}
                  onChange={(e) => setSleeve(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">গলা (Collar)</span>
                <input
                  type="text"
                  value={collar}
                  onChange={(e) => setCollar(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">পুঁট (Shoulder)</span>
                <input
                  type="text"
                  value={shoulder}
                  onChange={(e) => setShoulder(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-500">কোমর (Waist)</span>
                <input
                  type="text"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full text-xs font-mono rounded border border-neutral-800 bg-neutral-900 p-1.5 text-center text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">মোট মজুরি (৳)</label>
              <input
                type="number"
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400">অগ্রিম জমা (৳)</label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className="w-full text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-emerald-400"
              />
            </div>
          </div>
        </div>
      }
      previewSlot={
        <div className="space-y-4">
          {/* Printable Dual-Copy Order Token Card */}
          <div className="rounded-3xl border-2 border-neutral-700 bg-neutral-950 p-6 space-y-5 shadow-2xl">
            <div className="border-b border-neutral-800 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">CUSTOMER COPY // কাস্টমার কপি</span>
                <h3 className="text-base font-bold text-white">{tailorShopName}</h3>
                <p className="text-xs text-neutral-400">অর্ডার টোকেন: <strong className="text-amber-400 font-mono">{orderNo}</strong></p>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="text-neutral-500 block text-[10px]">ডেলিভারি তারিখ</span>
                <span className="text-emerald-400 font-bold">{deliveryDate}</span>
              </div>
            </div>

            <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">{customerName}</p>
                <p className="text-neutral-400 font-mono">{customerPhone}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-neutral-400 text-[11px]">বকেয়া মজুরি:</span>
                <p className="text-sm font-bold text-rose-400">৳ {dueAmount}</p>
              </div>
            </div>

            {/* Measurement Visual Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">লম্বা</span>
                <span className="font-bold text-white">{length}&quot;</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">ছাতি</span>
                <span className="font-bold text-white">{chest}&quot;</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">হাতা</span>
                <span className="font-bold text-white">{sleeve}&quot;</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">গলা</span>
                <span className="font-bold text-white">{collar}&quot;</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">পুঁট</span>
                <span className="font-bold text-white">{shoulder}&quot;</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">কোমর</span>
                <span className="font-bold text-white">{waist}&quot;</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 italic">
              নোট: {specialNote}
            </div>
          </div>
        </div>
      }
    />
  );
}
