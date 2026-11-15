"use client";

import React, { useState, useMemo } from "react";
import { EMBED_WIDGETS } from "@/lib/embed/widget-registry";
import { convertBijoyToUnicode, convertUnicodeToBijoy } from "@/lib/bangla/bijoy-unicode-engine";
import { calculateIslamicZakat } from "@/lib/finance/family-zakat-engine";
import { calculateUniversityCgpa } from "@/lib/education/cgpa-grade-engine";
import { calculateBercElectricityBill } from "@/lib/utility/electricity-solar-engine";
import { calculateExactAge } from "@/lib/health/age-health-engine";
import { calculateSanchaypatraProfit, calculateLoanEmi } from "@/lib/finance/tax-sanchaypatra-engine";
import { ExternalLink, Copy, Check, ArrowRightLeft, Sparkles } from "lucide-react";

interface Props {
  toolSlug: string;
  theme?: string;
  lang?: string;
}

export function EmbedWidgetRenderer({ toolSlug, theme = "auto", lang = "bn" }: Props) {
  const widget = EMBED_WIDGETS[toolSlug];
  const [copied, setCopied] = useState(false);

  // 1. Bijoy State
  const [bijoyText, setBijoyText] = useState("Avgvi †mvbvi evsjv, Avwg †Zvgvq fvልevwm|");
  const [bijoyMode, setBijoyMode] = useState<"toUnicode" | "toBijoy">("toUnicode");

  // 2. Land / Gold State
  const [landDecimal, setLandDecimal] = useState("5");
  const [goldVori, setGoldVori] = useState("2");

  // 3. Zakat State
  const [zakatCash, setZakatCash] = useState("500000");

  // 4. CGPA State
  const [cgpaCourses, setCgpaCourses] = useState([
    { credit: 3, gpa: 3.75 },
    { credit: 3, gpa: 4.0 },
    { credit: 3, gpa: 3.5 },
  ]);

  // 5. Remittance State
  const [usdAmount, setUsdAmount] = useState("1000");

  // 6. Electricity State
  const [unitsUsed, setUnitsUsed] = useState("250");

  // 7. Age State
  const [birthDateStr, setBirthDateStr] = useState("1998-05-15");

  // 8. Sanchaypatra & EMI State
  const [sanchayAmount, setSanchayAmount] = useState("1000000");
  const [loanPrincipal, setLoanPrincipal] = useState("500000");

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!widget) {
    return (
      <div className="p-8 text-center text-muted-foreground font-sans">
        <p className="text-sm font-semibold">Widget not found: {toolSlug}</p>
        <a
          href="https://sabbir.nav.bd/tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs underline mt-2 inline-block"
        >
          Explore All Tools on THE SABBiR OS
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-card text-card-foreground p-4 sm:p-5 font-sans select-text">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            {lang === "bn" ? widget.banglaName : widget.name}
          </h2>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{widget.description}</p>
        </div>
        <a
          href={`https://sabbir.nav.bd${widget.studioHref}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary hover:underline flex items-center gap-1 shrink-0 font-medium"
        >
          <span>Full Studio</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Widget Interactive Body */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* 1. BIJOY CONVERTER */}
        {toolSlug === "bijoy-converter" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <button
                onClick={() => setBijoyMode(bijoyMode === "toUnicode" ? "toBijoy" : "toUnicode")}
                className="px-2.5 py-1 rounded bg-primary/10 text-primary font-semibold flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                {bijoyMode === "toUnicode" ? "Bijoy (ANSI) ➔ Unicode" : "Unicode ➔ Bijoy (ANSI)"}
              </button>
            </div>
            <textarea
              value={bijoyText}
              onChange={(e) => setBijoyText(e.target.value)}
              placeholder="Paste text here..."
              rows={3}
              className="w-full p-2.5 rounded-lg bg-background border border-border text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="p-3 bg-muted/40 rounded-lg space-y-2 border border-border/40">
              <div className="flex justify-between items-center text-[11px] text-muted-foreground font-semibold">
                <span>Converted Output</span>
                <button
                  onClick={() =>
                    copyText(
                      bijoyMode === "toUnicode"
                        ? convertBijoyToUnicode(bijoyText)
                        : convertUnicodeToBijoy(bijoyText)
                    )
                  }
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-xs font-medium whitespace-pre-wrap select-all">
                {bijoyMode === "toUnicode"
                  ? convertBijoyToUnicode(bijoyText)
                  : convertUnicodeToBijoy(bijoyText)}
              </p>
            </div>
          </div>
        )}

        {/* 2. LAND / GOLD */}
        {toolSlug === "land-gold-converter" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card/50 space-y-2">
              <label className="font-semibold block">Land: Decimal (শতক) to Katha & SqFt</label>
              <input
                type="number"
                value={landDecimal}
                onChange={(e) => setLandDecimal(e.target.value)}
                className="w-full p-2 rounded bg-background border border-border text-xs"
              />
              <p className="text-primary font-bold text-sm">
                {(Number(landDecimal) / 1.65).toFixed(2)} Katha ({(Number(landDecimal) * 435.6).toFixed(1)} Sq.Ft)
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card/50 space-y-2">
              <label className="font-semibold block">Gold: Vori (ভরি) to Grams</label>
              <input
                type="number"
                value={goldVori}
                onChange={(e) => setGoldVori(e.target.value)}
                className="w-full p-2 rounded bg-background border border-border text-xs"
              />
              <p className="text-amber-500 font-bold text-sm">
                {(Number(goldVori) * 11.664).toFixed(3)} Grams (BAJUS Standard)
              </p>
            </div>
          </div>
        )}

        {/* 3. ZAKAT CALCULATOR */}
        {toolSlug === "zakat-calculator" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Total Net Zakatable Wealth (BDT)</label>
              <input
                type="number"
                value={zakatCash}
                onChange={(e) => setZakatCash(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border text-xs"
              />
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 space-y-1">
              <span className="text-[11px] font-semibold">2.5% Zakat Payable</span>
              <p className="text-xl font-bold">
                ৳{Math.round(Number(zakatCash) * 0.025).toLocaleString()} BDT
              </p>
              <p className="text-[10px] opacity-80">
                Nisab: 52.5 Vori Silver (~৳1,15,500) or 7.5 Vori Gold (~৳9,00,000)
              </p>
            </div>
          </div>
        )}

        {/* 4. CGPA CALCULATOR */}
        {toolSlug === "cgpa-calculator" && (
          <div className="space-y-3 text-xs">
            <span className="font-semibold block">Semester Courses CGPA (UGC Scale 4.00)</span>
            <div className="space-y-2">
              {cgpaCourses.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-[11px] text-muted-foreground w-16">Course {i + 1}</span>
                  <input
                    type="number"
                    value={c.credit}
                    placeholder="Credit"
                    onChange={(e) => {
                      const updated = [...cgpaCourses];
                      updated[i].credit = Number(e.target.value);
                      setCgpaCourses(updated);
                    }}
                    className="w-20 p-1.5 rounded bg-background border border-border text-xs text-center"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={c.gpa}
                    placeholder="GPA"
                    onChange={(e) => {
                      const updated = [...cgpaCourses];
                      updated[i].gpa = Number(e.target.value);
                      setCgpaCourses(updated);
                    }}
                    className="w-20 p-1.5 rounded bg-background border border-border text-xs text-center font-bold"
                  />
                </div>
              ))}
            </div>
            {(() => {
              const res = calculateUniversityCgpa(
                cgpaCourses.map((c, i) => ({ id: `c-${i}`, name: `C${i + 1}`, credits: c.credit, gradePoint: c.gpa }))
              );
              return (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center">
                  <span className="font-semibold text-primary">Semester CGPA:</span>
                  <span className="text-xl font-bold text-primary">{res.cgpa.toFixed(2)}</span>
                </div>
              );
            })()}
          </div>
        )}

        {/* 5. REMITTANCE */}
        {toolSlug === "remittance-calculator" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Freelance Remittance (USD)</label>
              <input
                type="number"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border text-xs"
              />
            </div>
            {(() => {
              const usd = Number(usdAmount);
              const base = Math.round(usd * 122.5);
              const inc = Math.round(base * 0.025);
              const total = base + inc;
              return (
                <div className="p-3 bg-card border border-border rounded-lg space-y-1">
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Base (@ ৳122.50):</span>
                    <span>৳{base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <span>2.5% Govt Incentive:</span>
                    <span>+৳{inc.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border/50">
                    <span>Total Cash in Hand:</span>
                    <span className="text-primary">৳{total.toLocaleString()} BDT</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. ELECTRICITY */}
        {toolSlug === "electricity-bill" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Monthly Electricity Units (kWh)</label>
              <input
                type="number"
                value={unitsUsed}
                onChange={(e) => setUnitsUsed(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border text-xs"
              />
            </div>
            {(() => {
              const bill = calculateBercElectricityBill(Number(unitsUsed));
              return (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg space-y-1 text-primary">
                  <div className="flex justify-between text-xs">
                    <span>Energy Charge:</span>
                    <span>৳{bill.energyChargeBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-primary/20">
                    <span>Estimated Total Bill:</span>
                    <span>৳{bill.totalBillBdt.toLocaleString()} BDT</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 7. AGE */}
        {toolSlug === "age-calculator" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Date of Birth</label>
              <input
                type="date"
                value={birthDateStr}
                onChange={(e) => setBirthDateStr(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-background border border-border text-xs"
              />
            </div>
            {(() => {
              const age = calculateExactAge(birthDateStr, "2026-11-15");
              return (
                <div className="p-3 bg-card border border-border rounded-lg space-y-1">
                  <span className="text-muted-foreground text-[11px]">Exact Age</span>
                  <p className="text-base font-bold text-foreground">
                    {age.years} Yrs, {age.months} Mos, {age.days} Days
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {age.isBcsEligible ? "✅ Eligible for Govt Jobs (≤32 Years)" : "⚠️ Exceeded 32y Cutoff"}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* 8. SANCHAYPATRA & EMI */}
        {toolSlug === "sanchaypatra-emi" && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-card border border-border rounded-lg space-y-1.5">
              <label className="font-semibold block">Paribar Sanchaypatra (৳ Amount)</label>
              <input
                type="number"
                value={sanchayAmount}
                onChange={(e) => setSanchayAmount(e.target.value)}
                className="w-full p-1.5 rounded bg-background border border-border text-xs"
              />
              {(() => {
                const s = calculateSanchaypatraProfit("paribar", Number(sanchayAmount));
                return (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Net Monthly Profit: ৳{s.netMonthlyTakeHomeBdt.toLocaleString()} BDT
                  </p>
                );
              })()}
            </div>

            <div className="p-3 bg-card border border-border rounded-lg space-y-1.5">
              <label className="font-semibold block">Bank Loan EMI (9% for 5 Years)</label>
              <input
                type="number"
                value={loanPrincipal}
                onChange={(e) => setLoanPrincipal(e.target.value)}
                className="w-full p-1.5 rounded bg-background border border-border text-xs"
              />
              {(() => {
                const emi = calculateLoanEmi(Number(loanPrincipal), 9, 60);
                return (
                  <p className="text-primary font-bold">
                    Monthly EMI: ৳{emi.monthlyEmiBdt.toLocaleString()} BDT
                  </p>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Sleek Bottom Attribution Bar */}
      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Free & Client-Side</span>
        <a
          href="https://sabbir.nav.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary font-semibold flex items-center gap-1 transition-colors"
        >
          <span>⚡ Powered by THE SABBiR OS</span>
          <span className="text-[10px] opacity-70">· sabbir.nav.bd</span>
        </a>
      </div>
    </div>
  );
}
