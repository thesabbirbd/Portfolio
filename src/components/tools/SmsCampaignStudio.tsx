"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  Check,
  Users,
  Coins,
  Send,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  due: number;
  spent: number;
  segment: "VIP" | "BAKI" | "INACTIVE";
}

const DEMO_CUSTOMERS_RAW = `Shakil Ahmed, 01711223344, 0, 18500
Rahim Uddin, 01822334455, 1250, 4200
Tania Sultana, 01933445566, 0, 24000
Kamal Hossain, 01744556677, 3400, 1500
Farzana Yasmin, 01655667788, 0, 1200
Nasir Khan, 01766778899, 450, 3100`;

export function SmsCampaignStudio() {
  const [shopName, setShopName] = useState("Aiyaar Fashion");
  const [rawCustomerInput, setRawCustomerInput] = useState(DEMO_CUSTOMERS_RAW);
  const [activeSegment, setActiveSegment] = useState<"ALL" | "VIP" | "BAKI" | "INACTIVE">("BAKI");
  const [template, setTemplate] = useState(
    "প্রিয় {name}, {shop_name}-এ আপনার বাকি আছে ৳{due}। অনুগ্রহ করে আগামী ৩ দিনের মধ্যে বিকাশে পরিশোধ করবেন। ধন্যবাদ!"
  );
  const [ratePerSms, setRatePerSms] = useState<number>(0.25); // 0.25 BDT per SMS segment

  // Parse Customers
  const customers = useMemo<CustomerRecord[]>(() => {
    const lines = rawCustomerInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    return lines.map((line, idx) => {
      const parts = line.split(",").map((p) => p.trim());
      const name = parts[0] || `Customer #${idx + 1}`;
      const phone = parts[1] || "01700000000";
      const due = parseFloat(parts[2]) || 0;
      const spent = parseFloat(parts[3]) || 0;

      let segment: "VIP" | "BAKI" | "INACTIVE" = "INACTIVE";
      if (due > 0) {
        segment = "BAKI";
      } else if (spent >= 10000) {
        segment = "VIP";
      }

      return {
        id: String(idx + 1),
        name,
        phone,
        due,
        spent,
        segment,
      };
    });
  }, [rawCustomerInput]);

  const filteredCustomers = useMemo(() => {
    if (activeSegment === "ALL") return customers;
    return customers.filter((c) => c.segment === activeSegment);
  }, [customers, activeSegment]);

  // Check Unicode vs GSM-7
  const sampleMessage = useMemo(() => {
    const first = filteredCustomers[0] || { name: "সম্মানিত গ্রাহক", due: 1250, spent: 5000 };
    return template
      .replace(/{name}/g, first.name)
      .replace(/{due}/g, String(first.due))
      .replace(/{spent}/g, String(first.spent))
      .replace(/{shop_name}/g, shopName);
  }, [template, filteredCustomers, shopName]);

  const isUnicode = useMemo(() => {
    // Check if any character code > 127
    return /[^\u0000-\u007f]/.test(sampleMessage);
  }, [sampleMessage]);

  const smsMetrics = useMemo(() => {
    const charLen = sampleMessage.length;
    let parts = 1;

    if (isUnicode) {
      // Unicode: 70 chars for 1 part, 67 per part if multi-part
      if (charLen > 70) {
        parts = Math.ceil(charLen / 67);
      }
    } else {
      // GSM-7: 160 chars for 1 part, 153 per part if multi-part
      if (charLen > 160) {
        parts = Math.ceil(charLen / 153);
      }
    }

    const totalSmsUnits = filteredCustomers.length * parts;
    const estimatedCost = totalSmsUnits * ratePerSms;

    return {
      charLen,
      parts,
      totalSmsUnits,
      estimatedCost,
      encoding: isUnicode ? "Unicode (Bangla / Special)" : "GSM-7 (Standard English)",
    };
  }, [sampleMessage, isUnicode, filteredCustomers.length, ratePerSms]);

  const handleDownloadBroadcastCsv = () => {
    sound.shutter();
    osStore.addXp(30, "Exported SMS Broadcast Queue");
    osStore.incrementToolRun();

    let csv = "Phone,Personalized Message,Segment\n";
    filteredCustomers.forEach((c) => {
      const msg = template
        .replace(/{name}/g, c.name)
        .replace(/{due}/g, String(c.due))
        .replace(/{spent}/g, String(c.spent))
        .replace(/{shop_name}/g, shopName)
        .replace(/"/g, '""');
      csv += `"${c.phone}","${msg}","${c.segment}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sms-campaign-${activeSegment.toLowerCase()}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              Customer CRM Segmenter &amp; Bangla SMS Campaign Studio
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            VIP/Baki/Inactive Segregator • Dynamic Personalization • GSM-7 vs Unicode Calculator • BDT Cost Estimator
          </p>
        </div>

        <button
          onClick={handleDownloadBroadcastCsv}
          disabled={filteredCustomers.length === 0}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Gateway Broadcast CSV ({filteredCustomers.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Customer List & Template Pane */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Shop / Business Brand Name</span>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Customer CSV Data (Name, Phone, Due, Spent)</span>
            <textarea
              rows={6}
              value={rawCustomerInput}
              onChange={(e) => setRawCustomerInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-line text-ink font-mono text-[11px] leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-ink-3">
              <span>SMS Template (Variables: &#123;name&#125;, &#123;due&#125;, &#123;spent&#125;, &#123;shop_name&#125;)</span>
            </div>
            <textarea
              rows={4}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface border border-line text-ink font-mono text-[11px] leading-relaxed"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-ink-3 block font-bold uppercase">Template Presets:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.toggleSwitch();
                  setActiveSegment("BAKI");
                  setTemplate("প্রিয় {name}, {shop_name}-এ আপনার বাকি আছে ৳{due}। অনুগ্রহ করে আগামী ৩ দিনের মধ্যে পরিশোধ করবেন। ধন্যবাদ!");
                }}
                className="py-1.5 px-2 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-[10px] text-left transition"
              >
                🔴 Baki / Due Reminder
              </button>
              <button
                onClick={() => {
                  sound.toggleSwitch();
                  setActiveSegment("VIP");
                  setTemplate("অভিনন্দন {name}! {shop_name}-এর VIP মেম্বার হিসেবে আপনার জন্য নতুন কালেকশনে থাকছে ফ্ল্যাট ২০% ডিসকাউন্ট। ভিজিট করুন!");
                }}
                className="py-1.5 px-2 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-[10px] text-left transition"
              >
                ⭐ VIP Exclusive Offer
              </button>
            </div>
          </div>
        </div>

        {/* Right Output & Analytics Pane */}
        <div className="lg:col-span-7 space-y-4 text-xs font-mono">
          {/* Segment Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/30 border border-line">
            {[
              { id: "BAKI", label: "Due / Baki Collection", count: customers.filter((c) => c.segment === "BAKI").length },
              { id: "VIP", label: "VIP High Spenders", count: customers.filter((c) => c.segment === "VIP").length },
              { id: "INACTIVE", label: "Inactive Customers", count: customers.filter((c) => c.segment === "INACTIVE").length },
              { id: "ALL", label: "All Customers", count: customers.length },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  sound.toggleSwitch();
                  setActiveSegment(s.id as any);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center transition ${
                  activeSegment === s.id
                    ? "bg-primary text-white font-bold"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                <span>{s.label}</span>
                <span className="ml-1 opacity-70">({s.count})</span>
              </button>
            ))}
          </div>

          {/* SMS Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] text-ink-3 block">Characters</span>
              <span className="text-base font-bold text-ink">{smsMetrics.charLen} chars</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] text-ink-3 block">Parts / Recipient</span>
              <span className="text-base font-bold text-primary">{smsMetrics.parts} SMS</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] text-ink-3 block">Total SMS Units</span>
              <span className="text-base font-bold text-ink">{smsMetrics.totalSmsUnits}</span>
            </div>
            <div className="p-3 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] text-emerald-600 block font-bold">Estimated Cost</span>
              <span className="text-base font-bold text-emerald-600">৳{smsMetrics.estimatedCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Encoding Notice */}
          <div className="p-2.5 rounded-xl bg-muted/20 border border-line flex items-center justify-between text-[11px]">
            <span>
              Encoding: <strong>{smsMetrics.encoding}</strong>
            </span>
            <span className="text-ink-3">Rate: ৳{ratePerSms} / SMS Part</span>
          </div>

          {/* Live Mobile Message Simulator Preview */}
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            <span className="font-bold text-ink uppercase text-[11px] block">
              Sample Personalized Preview (Recipient #1):
            </span>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200 text-xs leading-relaxed font-sans shadow-sm">
              {sampleMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
