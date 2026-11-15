"use client";

import React, { useState, useMemo } from "react";
import {
  Landmark,
  Download,
  Copy,
  Check,
  Sparkles,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { convertTakaToWords } from "@/lib/banking/taka-in-words";

export function ChequeAuditStudio() {
  const [amount, setAmount] = useState<number>(125450);
  const [payeeName, setPayeeName] = useState<string>("Md Sabbirul Islam Khan");
  const [bankName, setBankName] = useState<string>("BRAC Bank PLC");
  const [branchName, setBranchName] = useState<string>("Gulshan Branch, Dhaka");
  const [chequeDate, setChequeDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [accountNo, setAccountNo] = useState<string>("1501204892182001");
  const [isCrossed, setIsCrossed] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const words = useMemo(() => convertTakaToWords(amount), [amount]);

  // Cheque audit checks
  const auditReport = useMemo(() => {
    const issues: { level: "ok" | "warn" | "danger"; msg: string }[] = [];
    const today = new Date();
    const d = new Date(chequeDate);
    const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      issues.push({
        level: "warn",
        msg: `Post-dated Cheque (${diffDays} days in the future). Cannot be encashed before ${chequeDate}.`,
      });
    } else if (diffDays < -180) {
      issues.push({
        level: "danger",
        msg: "Stale Cheque (> 180 days old). Commercial banks in Bangladesh will reject this cheque.",
      });
    } else {
      issues.push({
        level: "ok",
        msg: "Cheque date is valid for immediate clearing or transfer.",
      });
    }

    if (amount > 500000 && !isCrossed) {
      issues.push({
        level: "warn",
        msg: "High-value cheque (> 5 Lakh BDT) without 'A/C Payee Only' crossing poses bearer encashment risk.",
      });
    }

    return issues;
  }, [chequeDate, amount, isCrossed]);

  const copyText = async (text: string, type: string) => {
    sound.copy();
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    osStore.addXp(15, "Copied Taka in Words");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handlePrint = () => {
    sound.shutter();
    osStore.addXp(25, "Printed Cheque Leaf Preview");
    osStore.incrementToolRun();
    window.print();
  };

  const handleDownloadSlipCsv = () => {
    sound.shutter();
    osStore.addXp(20, "Exported Deposit Slip CSV");
    osStore.incrementToolRun();

    const csv = `Bank,Branch,Date,Account No,Payee / Beneficiary,Amount (BDT),Amount in Words (Bangla),Amount in Words (English),Crossed Status\n"${bankName}","${branchName}","${chequeDate}","${accountNo}","${payeeName}",${amount},"${words.banglaWords}","${words.englishWords}",${isCrossed ? "A/C PAYEE ONLY" : "BEARER"}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deposit-reconciliation-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Landmark className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              BD Bank Cheque, Taka-in-Words &amp; Deposit Slip Auditor
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            Bangla &amp; English Lakh/Crore Words • Cheque Stale/Post-Date Auditor • Deposit Slip CSV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSlipCsv}
            className="px-3.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-muted text-ink text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Deposit Slip CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print Cheque Leaf</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* Editor Form (Hidden on Print) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono print:hidden">
          <span className="font-bold text-ink uppercase tracking-wider block">Cheque Information</span>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Amount in Figures (BDT)</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold text-base text-rose-500"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-ink-3 block">Payee / Beneficiary Name</span>
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Bank Name</span>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Branch</span>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Cheque Date</span>
              <input
                type="date"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-ink-3 block">Account Number</span>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-line">
            <div>
              <span className="font-bold text-ink block text-[11px]">A/C Payee Crossing</span>
              <span className="text-[10px] text-ink-3 block">Enforces non-cash deposit into bank account</span>
            </div>
            <input
              type="checkbox"
              checked={isCrossed}
              onChange={(e) => setIsCrossed(e.target.checked)}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
            />
          </div>

          {/* Quick Copy Words */}
          <div className="pt-2 border-t border-line space-y-2">
            <div className="p-3 rounded-xl bg-surface border border-line space-y-1">
              <div className="flex justify-between items-center text-[10px] text-ink-3">
                <span className="font-bold text-ink">বাংলা কথায়:</span>
                <button
                  onClick={() => copyText(words.banglaWords, "bangla")}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {copiedType === "bangla" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === "bangla" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-xs font-bold text-ink leading-relaxed">{words.banglaWords}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-line space-y-1">
              <div className="flex justify-between items-center text-[10px] text-ink-3">
                <span className="font-bold text-ink">In Words (English):</span>
                <button
                  onClick={() => copyText(words.englishWords, "english")}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {copiedType === "english" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === "english" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-xs font-bold text-ink leading-relaxed">{words.englishWords}</p>
            </div>
          </div>
        </div>

        {/* Live Cheque Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-8 bg-amber-50 text-zinc-900 border-2 border-amber-300 rounded-3xl shadow-xl font-mono relative overflow-hidden space-y-4 max-w-full">
            {/* A/C Payee Crossing Header */}
            {isCrossed && (
              <div className="absolute top-4 left-4 border-l-2 border-r-2 border-zinc-800 px-3 py-1 rotate-[-12deg] text-[10px] font-black tracking-widest text-zinc-900 uppercase bg-amber-100/60 shadow-sm">
                A/C PAYEE ONLY
              </div>
            )}

            {/* Bank Header */}
            <div className="flex justify-between items-start border-b border-amber-200 pb-3">
              <div>
                <h3 className="font-black text-lg text-zinc-950 uppercase tracking-tight">{bankName}</h3>
                <p className="text-[11px] text-zinc-600 font-bold">{branchName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase block">Date (দিন / মাস / বছর)</span>
                <span className="px-3 py-1 rounded bg-white border border-amber-300 text-xs font-bold font-mono tracking-widest text-zinc-900">
                  {chequeDate}
                </span>
              </div>
            </div>

            {/* Payee Line */}
            <div className="flex items-center gap-2 border-b border-dashed border-amber-300 pb-1.5">
              <span className="text-[11px] font-bold text-zinc-600 shrink-0">Pay To / প্রাপক:</span>
              <span className="font-bold text-sm text-zinc-950 border-b border-zinc-800 flex-1 truncate px-1">
                {payeeName}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold shrink-0">or Bearer</span>
            </div>

            {/* Amount in Words */}
            <div className="space-y-1 border-b border-dashed border-amber-300 pb-2">
              <div className="flex items-start gap-2">
                <span className="text-[11px] font-bold text-zinc-600 shrink-0">কথায় / Words:</span>
                <span className="font-bold text-xs text-zinc-900 flex-1 leading-snug">
                  {words.banglaWords}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 italic pl-16">
                ({words.englishWords})
              </p>
            </div>

            {/* Amount Box & Signature Row */}
            <div className="flex justify-between items-end pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">A/C No: {accountNo}</span>
                <div className="px-4 py-2 rounded-xl bg-white border-2 border-zinc-900 font-black text-lg text-zinc-950 tracking-wider shadow-inner">
                  ৳ {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 border-b border-zinc-900 h-8"></div>
                <span className="text-[9px] text-zinc-600 uppercase font-bold block">Authorized Signature</span>
              </div>
            </div>

            {/* MICR Band Bottom */}
            <div className="pt-3 border-t border-amber-300 text-center text-zinc-500 font-mono text-[10px] tracking-widest opacity-80">
              ⑆ 002189 ⑆ 020270123 ⑆ 1501204892182001 ⑈ 10
            </div>
          </div>

          {/* Cheque Audit Results */}
          <div className="p-4 rounded-2xl bg-muted/20 border border-line space-y-2 text-xs font-mono print:hidden">
            <span className="font-bold text-ink uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Banking Clearing Validation Audit
            </span>
            <div className="space-y-1.5">
              {auditReport.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl flex items-center gap-2 ${
                    item.level === "ok"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : item.level === "warn"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-rose-500/10 text-rose-600 font-bold"
                  }`}
                >
                  {item.level === "ok" ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{item.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
