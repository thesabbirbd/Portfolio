"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Home,
  Receipt,
  FileText,
  Download,
  Printer,
  Sparkles,
  QrCode,
  Phone,
  Copy,
  Check,
  Building,
  CheckCircle2,
} from "lucide-react";
import { StudioWorkspaceShell } from "@/components/workplace/StudioWorkspaceShell";
import { useGatedExport } from "@/hooks/useGatedExport";
import {
  RentReceiptData,
  calculateRentReceipt,
  ToLetPosterData,
  generateToLetWhatsAppUrl,
  generateTenancyAgreement,
  SAMPLE_RENT_DATA,
  SAMPLE_TOLET_DATA,
} from "@/lib/property/house-rent-engine";
import { encodeQrMatrix } from "@/lib/barcode/qr-matrix-encoder";
import { sound } from "@/lib/sound";

export function HouseRentStudio() {
  const [activeTab, setActiveTab] = useState<"receipt" | "tolet" | "agreement">("receipt");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Receipt state
  const [receiptData, setReceiptData] = useState<RentReceiptData>(SAMPLE_RENT_DATA);

  // To-Let Poster state
  const [toletData, setToletData] = useState<ToLetPosterData>(SAMPLE_TOLET_DATA);

  // Agreement Copy state
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "house-rent-studio",
    toolName: "House Rent Receipt & To-Let Studio",
  });

  const receiptCalc = useMemo(() => calculateRentReceipt(receiptData), [receiptData]);
  const waUrl = useMemo(() => generateToLetWhatsAppUrl(toletData), [toletData]);
  const agreementText = useMemo(() => generateTenancyAgreement(receiptData), [receiptData]);

  const handleCopyAgreement = async () => {
    sound.copy();
    await navigator.clipboard.writeText(agreementText);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 2000);
  };

  // Download Dual-Copy Rent Receipt PNG
  const handleDownloadReceipt = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 1600, 1100);

      // Draw two perforated copies: Left = Landlord copy, Right = Tenant copy
      const drawSingleCopy = (offsetX: number, label: string) => {
        // Outer Border
        ctx.strokeStyle = "#18181B";
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX + 30, 30, 740, 1040);

        // Header
        ctx.fillStyle = "#09090B";
        ctx.fillRect(offsetX + 40, 40, 720, 100);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`🏠 বাড়ি ভাড়ার রশিদ (${label})`, offsetX + 70, 75);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(receiptData.landlordName, offsetX + 70, 115);

        // Details Subheader
        let y = 170;
        ctx.fillStyle = "#71717A";
        ctx.font = "14px sans-serif";
        ctx.fillText(`রশিদ নং: ${receiptData.receiptNo} · তারিখ: ${receiptData.dateBn}`, offsetX + 50, y);
        ctx.fillText(`ভাড়ার মাস: ${receiptData.monthYearBn}`, offsetX + 500, y);

        y += 35;
        ctx.fillStyle = "#18181B";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`ভাড়াটিয়ার নাম: ${receiptData.tenantName}`, offsetX + 50, y);
        y += 25;
        ctx.font = "14px sans-serif";
        ctx.fillText(`ফ্ল্যাট/ইউনিট: ${receiptData.flatUnitNo} · মোবাইল: ${receiptData.tenantMobile}`, offsetX + 50, y);
        y += 25;
        ctx.fillText(`ঠিকানা: ${receiptData.houseAddress}`, offsetX + 50, y);

        // Table Header
        y += 45;
        ctx.fillStyle = "#F4F4F5";
        ctx.fillRect(offsetX + 50, y, 700, 40);
        ctx.fillStyle = "#18181B";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("বিবরণ", offsetX + 70, y + 26);
        ctx.fillText("টাকার পরিমাণ (BDT)", offsetX + 520, y + 26);

        // Rows
        const items: [string, number][] = [
          ["মূল বাড়ি ভাড়া (House Rent)", receiptData.rentAmount],
          ["গ্যাস বিল (Gas Bill)", receiptData.gasBill],
          ["পানি বিল (Water Bill)", receiptData.waterBill],
          ["বিদ্যুৎ বিল (Electricity)", receiptData.electricityBill],
          ["সার্ভিস চার্জ ও সিকিউরিটি", receiptData.serviceCharge],
          ["পূর্বের বকেয়া (Arrears)", receiptData.arrears],
          ["অগ্রিম থেকে সমন্বয় (Deduction)", -receiptData.advanceDeduction],
        ];

        y += 45;
        for (const [k, v] of items) {
          if (v === 0 && (k.includes("বকেয়া") || k.includes("অগ্রিম"))) continue;
          ctx.fillStyle = "#18181B";
          ctx.font = "14px sans-serif";
          ctx.fillText(String(k), offsetX + 70, y + 22);

          ctx.font = "bold 14px monospace";
          ctx.fillText(`৳ ${Number(v).toLocaleString("bn-BD")}`, offsetX + 540, y + 22);

          ctx.strokeStyle = "#E4E4E7";
          ctx.beginPath();
          ctx.moveTo(offsetX + 50, y + 32);
          ctx.lineTo(offsetX + 750, y + 32);
          ctx.stroke();

          y += 36;
        }

        // Grand Total Box
        y += 10;
        ctx.fillStyle = "#FEF3C7";
        ctx.fillRect(offsetX + 50, y, 700, 60);
        ctx.strokeStyle = "#F59E0B";
        ctx.strokeRect(offsetX + 50, y, 700, 60);

        ctx.fillStyle = "#92400E";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("সর্বমোট আদায়কৃত টাকা:", offsetX + 70, y + 38);
        ctx.font = "bold 24px monospace";
        ctx.fillText(`৳ ${receiptCalc.totalAmountBdt.toLocaleString("bn-BD")}`, offsetX + 520, y + 40);

        // Taka in Words
        y += 85;
        ctx.fillStyle = "#18181B";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`টাকা কথায়: ${receiptCalc.takaInWordsBn}`, offsetX + 50, y);

        y += 25;
        ctx.font = "13px sans-serif";
        ctx.fillStyle = "#52525B";
        ctx.fillText(`পরিশোধের মাধ্যম: ${receiptData.paymentMethod} ${receiptData.transactionId ? `(Txn: ${receiptData.transactionId})` : ""}`, offsetX + 50, y);

        // Signature Boxes
        y += 120;
        ctx.strokeStyle = "#71717A";
        ctx.beginPath();
        ctx.moveTo(offsetX + 80, y);
        ctx.lineTo(offsetX + 280, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(offsetX + 520, y);
        ctx.lineTo(offsetX + 720, y);
        ctx.stroke();

        ctx.fillStyle = "#71717A";
        ctx.font = "14px sans-serif";
        ctx.fillText("ভাড়াটিয়ার স্বাক্ষর", offsetX + 130, y + 25);
        ctx.fillText("বাড়িওয়ালার স্বাক্ষর", offsetX + 570, y + 25);
      };

      drawSingleCopy(0, "মালিকের কপি / Landlord Copy");

      // Perforation line in middle
      ctx.strokeStyle = "#A1A1AA";
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(800, 20);
      ctx.lineTo(800, 1080);
      ctx.stroke();
      ctx.setLineDash([]);

      drawSingleCopy(800, "ভাড়াটিয়ার কপি / Tenant Copy");

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `rent-receipt-${receiptData.receiptNo}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Download Printable A4 To-Let Poster PNG
  const handleDownloadToLet = () => {
    triggerExport(() => {
      setActiveStep(3);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // High-contrast Yellow background
      ctx.fillStyle = "#FBBF24";
      ctx.fillRect(0, 0, 1200, 1600);

      // Black Outer Border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1140, 1540);

      // Top Giant Title
      ctx.fillStyle = "#000000";
      ctx.fillRect(40, 40, 1120, 220);

      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 96px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("TO-LET", 600, 150);

      ctx.font = "bold 44px sans-serif";
      ctx.fillText("বাসা ভাড়া হবে", 600, 220);

      // Available From Banner
      let y = 330;
      ctx.fillStyle = "#000000";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(`উপলব্ধ: ${toletData.availableFromBn}`, 600, y);

      ctx.fillStyle = "#18181B";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`ভাড়ার ধরন: ${toletData.targetTenant}`, 600, y + 55);

      // Big Specs Grid
      y += 120;
      ctx.textAlign = "left";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(80, y, 1040, 280);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeRect(80, y, 1040, 280);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText(`🛏️ ${toletData.flatDetails.bedrooms} টি বেডরুম`, 120, y + 70);
      ctx.fillText(`🚿 ${toletData.flatDetails.bathrooms} টি বাথরুম`, 600, y + 70);

      ctx.fillText(`🌅 ${toletData.flatDetails.balconies} টি বারান্দা`, 120, y + 140);
      ctx.fillText(`🏢 ${toletData.flatDetails.floorNoBn}`, 600, y + 140);

      ctx.fillText(`🍽️ ড্রয়িং, ডাইনিং ও রান্নাঘর`, 120, y + 210);
      if (toletData.flatDetails.squareFeet) {
        ctx.fillText(`📐 প্রায় ${toletData.flatDetails.squareFeet} স্কয়ার ফিট`, 600, y + 210);
      }

      // Facilities Badges
      y += 330;
      ctx.fillStyle = "#000000";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("সুযোগ-সুবিধাসমূহ:", 80, y);

      y += 45;
      const facilities = [
        toletData.features.gasType,
        toletData.features.hasLift ? "লিফট সুবিধা" : null,
        toletData.features.hasGenerator ? "জেনারেটর ব্যাকআপ" : null,
        toletData.features.hasCctvGuard ? "২৪ ঘণ্টা সিসিটিভি ও দারোয়ান" : null,
        toletData.features.hasCarParking ? "গাড়ি পার্কিং সুবিধা" : null,
      ].filter(Boolean) as string[];

      ctx.font = "bold 26px sans-serif";
      for (const f of facilities) {
        ctx.fillText(`✔ ${f}`, 100, y);
        y += 42;
      }

      // Rent & Address
      y += 20;
      ctx.fillStyle = "#000000";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText(`ভাড়া: ${toletData.rentAmountBn}`, 80, y);
      y += 45;
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(`ঠিকানা: ${toletData.addressBn}`, 80, y);

      // Bottom Contact & QR Code Section
      y += 60;
      ctx.fillStyle = "#000000";
      ctx.fillRect(80, y, 1040, 240);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("সরাসরি যোগাযোগের নম্বর:", 120, y + 60);

      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 44px monospace";
      ctx.fillText(toletData.contactPhone1, 120, y + 120);
      if (toletData.contactPhone2) {
        ctx.fillText(toletData.contactPhone2, 120, y + 175);
      }

      // Draw QR Code
      const qrResult = encodeQrMatrix(waUrl);
      const qrMatrix = qrResult.matrix;
      const qrSize = 180;
      const cellSize = qrSize / qrMatrix.length;
      const qrX = 900;
      const qrY = y + 30;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      ctx.fillStyle = "#000000";
      for (let r = 0; r < qrMatrix.length; r++) {
        for (let c = 0; c < qrMatrix[r].length; c++) {
          if (qrMatrix[r][c]) {
            ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize);
          }
        }
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px sans-serif";
      ctx.fillText("WhatsApp স্ক্যান করুন", qrX, qrY + qrSize + 15);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `to-let-poster-a4.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <StudioWorkspaceShell
      slug="house-rent-studio"
      title="Bariwala-Bharatiya Rent Receipt, To-Let Poster & Agreement"
      category="Household & Property Utility"
      popularityScore={95}
      lede="মালিক ও ভাড়াটিয়ার দ্বৈত কপি বাড়ি ভাড়ার রশিদ, বাংলায় কথায় টাকা, হোয়াটসঅ্যাপ কিউআর যুক্ত A4 টু-লেট পোস্টার এবং প্রমিত বাড়ি ভাড়ার চুক্তিপত্র।"
      activeStep={activeStep}
      getSharePayload={() => ({
        receiptData,
        receiptCalc,
        toletData,
      })}
      sampleLoaderSlot={
        <button
          onClick={() => {
            sound.click();
            setReceiptData(SAMPLE_RENT_DATA);
            setToletData(SAMPLE_TOLET_DATA);
            setActiveStep(2);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>মিরপুর/উত্তরা অ্যাপার্টমেন্ট স্যাম্পল</span>
        </button>
      }
      exportSlot={
        activeTab === "receipt" ? (
          <button
            onClick={handleDownloadReceipt}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Dual Receipt (PNG)</span>
          </button>
        ) : activeTab === "tolet" ? (
          <button
            onClick={handleDownloadToLet}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Printable A4 Poster (PNG)</span>
          </button>
        ) : (
          <button
            onClick={handleCopyAgreement}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
          >
            {copiedAgreement ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAgreement ? "কপি হয়েছে!" : "Copy Agreement"}</span>
          </button>
        )
      }
    >
      <div className="space-y-8">
        {/* 3 Main Studio Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-4" role="tablist">
          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("receipt");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "receipt"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>১. বাড়ি ভাড়ার রশিদ (Dual-Copy Receipt)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("tolet");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "tolet"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>২. এ৪ টু-লেট পোস্টার (Printable A4 Poster &amp; QR)</span>
          </button>

          <button
            onClick={() => {
              sound.toggleSwitch();
              setActiveTab("agreement");
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "agreement"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-line bg-surface text-ink-3 hover:text-ink hover:bg-muted"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>৩. বাড়ি ভাড়ার চুক্তিপত্র (Tenancy Agreement)</span>
          </button>
        </div>

        {/* TAB 1: RENT RECEIPT */}
        {activeTab === "receipt" && (
          <div className="space-y-6">
            {/* Live Receipt Card Preview */}
            <div className="rounded-3xl border border-amber-500/30 bg-surface p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between border-b border-line pb-4 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    মাসিক বাড়ি ভাড়ার রশিদ (Dual Copy)
                  </span>
                  <h3 className="text-xl font-extrabold text-ink">{receiptData.landlordName}</h3>
                  <p className="text-xs text-ink-3">{receiptData.houseAddress}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-ink-3">রশিদ নং: {receiptData.receiptNo}</div>
                  <div className="text-sm font-bold text-ink mt-0.5">{receiptData.monthYearBn}</div>
                </div>
              </div>

              {/* Total & Words Hero */}
              <div className="rounded-2xl border border-line bg-muted/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs text-ink-3 font-semibold">আদায়কৃত সর্বমোট টাকা</div>
                  <div className="text-4xl font-extrabold text-amber-500 font-mono mt-1">
                    ৳ {receiptCalc.totalAmountBdt.toLocaleString("bn-BD")}
                  </div>
                  <div className="text-sm font-bold text-ink mt-2">
                    কথায়: <span className="text-amber-400">{receiptCalc.takaInWordsBn}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4 text-xs space-y-1 text-ink-3 font-mono min-w-[220px]">
                  <div>ভাড়াটিয়া: {receiptData.tenantName}</div>
                  <div>ফ্ল্যাট: {receiptData.flatUnitNo}</div>
                  <div>মাধ্যম: {receiptData.paymentMethod}</div>
                </div>
              </div>

              {/* Breakdown Grid Form */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 border-t border-line pt-4">
                <div>
                  <label className="text-xs font-semibold text-ink-3">মূল ভাড়া (Rent)</label>
                  <input
                    type="number"
                    value={receiptData.rentAmount}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, rentAmount: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs font-bold text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">গ্যাস বিল</label>
                  <input
                    type="number"
                    value={receiptData.gasBill}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, gasBill: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">পানি বিল</label>
                  <input
                    type="number"
                    value={receiptData.waterBill}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, waterBill: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">বিদ্যুৎ বিল</label>
                  <input
                    type="number"
                    value={receiptData.electricityBill}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, electricityBill: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">সার্ভিস চার্জ</label>
                  <input
                    type="number"
                    value={receiptData.serviceCharge}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, serviceCharge: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs text-ink"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-3">অগ্রিম কর্তন</label>
                  <input
                    type="number"
                    value={receiptData.advanceDeduction}
                    onChange={(e) =>
                      setReceiptData({ ...receiptData, advanceDeduction: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-xl border border-line bg-muted/30 px-3 py-1.5 text-xs text-rose-500 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TO-LET POSTER */}
        {activeTab === "tolet" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Poster Inputs */}
              <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase text-ink border-b border-line pb-2">
                  টু-লেট বিজ্ঞাপন বিবরণ
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">কবে হতে ভাড়া হবে</label>
                    <input
                      type="text"
                      value={toletData.availableFromBn}
                      onChange={(e) => setToletData({ ...toletData, availableFromBn: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">ভাড়ার ধরন</label>
                    <select
                      value={toletData.targetTenant}
                      onChange={(e) => setToletData({ ...toletData, targetTenant: e.target.value as any })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    >
                      <option value="ফ্যামিলি (Family)">ফ্যামিলি (Family)</option>
                      <option value="ব্যাচেলর (Bachelor)">ব্যাচেলর (Bachelor)</option>
                      <option value="অফিস / বাণিজ্যিক (Commercial)">অফিস / বাণিজ্যিক</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">বেডরুম</label>
                    <input
                      type="number"
                      value={toletData.flatDetails.bedrooms}
                      onChange={(e) =>
                        setToletData({
                          ...toletData,
                          flatDetails: { ...toletData.flatDetails, bedrooms: Number(e.target.value) },
                        })
                      }
                      min={1}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">বাথরুম</label>
                    <input
                      type="number"
                      value={toletData.flatDetails.bathrooms}
                      onChange={(e) =>
                        setToletData({
                          ...toletData,
                          flatDetails: { ...toletData.flatDetails, bathrooms: Number(e.target.value) },
                        })
                      }
                      min={1}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">বারান্দা</label>
                    <input
                      type="number"
                      value={toletData.flatDetails.balconies}
                      onChange={(e) =>
                        setToletData({
                          ...toletData,
                          flatDetails: { ...toletData.flatDetails, balconies: Number(e.target.value) },
                        })
                      }
                      min={0}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">মাসিক ভাড়া</label>
                  <input
                    type="text"
                    value={toletData.rentAmountBn}
                    onChange={(e) => setToletData({ ...toletData, rentAmountBn: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-3">ঠিকানা</label>
                  <input
                    type="text"
                    value={toletData.addressBn}
                    onChange={(e) => setToletData({ ...toletData, addressBn: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-3">মোবাইল ১</label>
                    <input
                      type="text"
                      value={toletData.contactPhone1}
                      onChange={(e) => setToletData({ ...toletData, contactPhone1: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-3">WhatsApp নম্বর</label>
                    <input
                      type="text"
                      value={toletData.whatsappNumber}
                      onChange={(e) => setToletData({ ...toletData, whatsappNumber: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-line bg-muted/20 px-3 py-2 text-sm font-mono text-ink"
                    />
                  </div>
                </div>
              </div>

              {/* Poster Live Preview */}
              <div className="rounded-2xl border-4 border-amber-500 bg-amber-400 text-black p-8 flex flex-col justify-between shadow-2xl">
                <div className="text-center space-y-2 border-b-4 border-black pb-4">
                  <div className="text-5xl font-extrabold tracking-tight">TO-LET</div>
                  <div className="text-2xl font-bold">বাসা ভাড়া হবে</div>
                  <div className="text-sm font-semibold mt-1">উপলব্ধ: {toletData.availableFromBn}</div>
                </div>

                <div className="py-6 space-y-3 font-bold text-lg">
                  <div>🛏️ {toletData.flatDetails.bedrooms} বেড · 🚿 {toletData.flatDetails.bathrooms} বাথ · 🌅 {toletData.flatDetails.balconies} বারান্দা</div>
                  <div>🏢 {toletData.flatDetails.floorNoBn}</div>
                  <div>🔥 {toletData.features.gasType} {toletData.features.hasLift && "· 🛗 লিফট"}</div>
                  <div className="text-xl font-extrabold pt-2">ভাড়া: {toletData.rentAmountBn}</div>
                  <div className="text-sm font-medium">ঠিকানা: {toletData.addressBn}</div>
                </div>

                <div className="border-t-4 border-black pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase font-extrabold">যোগাযোগ:</div>
                    <div className="text-2xl font-black font-mono">{toletData.contactPhone1}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold block">WhatsApp QR Auto-Enabled</span>
                    <span className="text-xs font-semibold underline">সরাসরি চ্যাট করতে স্ক্যান</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TENANCY AGREEMENT */}
        {activeTab === "agreement" && (
          <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h4 className="text-sm font-bold text-ink">প্রমিত বাড়ি ভাড়ার চুক্তিপত্র ও ডিএমপি ফরম</h4>
              <button
                onClick={handleCopyAgreement}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-muted/40 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-muted"
              >
                {copiedAgreement ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedAgreement ? "কপি হয়েছে!" : "Copy Text"}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={agreementText}
              rows={16}
              className="w-full rounded-xl border border-line bg-muted/20 p-4 font-mono text-xs text-ink leading-relaxed focus:outline-none"
            />
          </div>
        )}
      </div>

      {GateModal}
    </StudioWorkspaceShell>
  );
}
