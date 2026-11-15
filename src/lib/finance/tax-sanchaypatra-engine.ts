/**
 * THE SABBiR OS — BD Income Tax (FY 2025-26), Sanchaypatra Profit & Loan EMI Engine
 * NBR individual tax slabs with investment rebate, National Sanchaypatra tiered profit rates
 * with 5%/10% source tax, and reducing balance loan EMI schedule.
 */

export interface TaxSlabBreakdown {
  slabName: string;
  taxableAmount: number;
  ratePercent: number;
  taxBdt: number;
}

export interface IncomeTaxResult {
  totalAnnualIncome: number;
  taxFreeLimit: number;
  taxableIncome: number;
  slabs: TaxSlabBreakdown[];
  grossTaxBdt: number;
  investmentRebateBdt: number;
  netTaxBeforeMinBdt: number;
  minimumTaxApplied: boolean;
  finalTaxPayableBdt: number;
  effectiveTaxRatePercent: number;
}

export type TaxpayerCategory = "general" | "female_senior" | "disabled" | "freedom_fighter";
export type LocationZone = "dhaka_ctg" | "other_city" | "rural";

export function calculateBdIncomeTax(
  annualIncome: number,
  category: TaxpayerCategory = "general",
  location: LocationZone = "dhaka_ctg",
  actualInvestment: number = 0
): IncomeTaxResult {
  const income = Math.max(0, annualIncome);

  let taxFreeLimit = 350000;
  if (category === "female_senior") taxFreeLimit = 400000;
  else if (category === "disabled") taxFreeLimit = 475000;
  else if (category === "freedom_fighter") taxFreeLimit = 500000;

  const minTaxMap = {
    dhaka_ctg: 5000,
    other_city: 4000,
    rural: 3000,
  };
  const minimumTax = minTaxMap[location] || 5000;

  const slabs: TaxSlabBreakdown[] = [];
  let grossTax = 0;

  if (income <= taxFreeLimit) {
    return {
      totalAnnualIncome: income,
      taxFreeLimit,
      taxableIncome: 0,
      slabs: [
        { slabName: `করমুক্ত সীমা (০-৳ ${taxFreeLimit.toLocaleString()})`, taxableAmount: income, ratePercent: 0, taxBdt: 0 },
      ],
      grossTaxBdt: 0,
      investmentRebateBdt: 0,
      netTaxBeforeMinBdt: 0,
      minimumTaxApplied: false,
      finalTaxPayableBdt: 0,
      effectiveTaxRatePercent: 0,
    };
  }

  // Taxable amount above threshold
  let remaining = income - taxFreeLimit;
  const taxableIncome = remaining;

  slabs.push({
    slabName: `১ম ধাপ: করমুক্ত সীমা (৳ ${taxFreeLimit.toLocaleString()})`,
    taxableAmount: taxFreeLimit,
    ratePercent: 0,
    taxBdt: 0,
  });

  // Step 2: Next 100,000 @ 5%
  const s1 = Math.min(remaining, 100000);
  const t1 = s1 * 0.05;
  slabs.push({ slabName: "২য় ধাপ: পরবর্তী ১,০০,০০০ টাকা", taxableAmount: s1, ratePercent: 5, taxBdt: t1 });
  grossTax += t1;
  remaining -= s1;

  // Step 3: Next 400,000 @ 10%
  if (remaining > 0) {
    const s2 = Math.min(remaining, 400000);
    const t2 = s2 * 0.1;
    slabs.push({ slabName: "৩য় ধাপ: পরবর্তী ৪,০০,০০০ টাকা", taxableAmount: s2, ratePercent: 10, taxBdt: t2 });
    grossTax += t2;
    remaining -= s2;
  }

  // Step 4: Next 500,000 @ 15%
  if (remaining > 0) {
    const s3 = Math.min(remaining, 500000);
    const t3 = s3 * 0.15;
    slabs.push({ slabName: "৪র্থ ধাপ: পরবর্তী ৫,০০,০০০ টাকা", taxableAmount: s3, ratePercent: 15, taxBdt: t3 });
    grossTax += t3;
    remaining -= s3;
  }

  // Step 5: Next 500,000 @ 20%
  if (remaining > 0) {
    const s4 = Math.min(remaining, 500000);
    const t4 = s4 * 0.2;
    slabs.push({ slabName: "৫ম ধাপ: পরবর্তী ৫,০০,০০০ টাকা", taxableAmount: s4, ratePercent: 20, taxBdt: t4 });
    grossTax += t4;
    remaining -= s4;
  }

  // Step 6: Next 2,000,000 @ 25%
  if (remaining > 0) {
    const s5 = Math.min(remaining, 2000000);
    const t5 = s5 * 0.25;
    slabs.push({ slabName: "৬ষ্ঠ ধাপ: পরবর্তী ২০,০০,০০০ টাকা", taxableAmount: s5, ratePercent: 25, taxBdt: t5 });
    grossTax += t5;
    remaining -= s5;
  }

  // Step 7: Above balance @ 30%
  if (remaining > 0) {
    const t6 = remaining * 0.3;
    slabs.push({ slabName: "৭ম ধাপ: অবশিষ্ট পরিমাণের ওপর", taxableAmount: remaining, ratePercent: 30, taxBdt: t6 });
    grossTax += t6;
    remaining = 0;
  }

  // Investment Rebate: 15% on allowable investment (capped at 20% of taxable income or 1 crore)
  const maxAllowableInvestment = Math.min(taxableIncome * 0.2, 10000000);
  const eligibleInvestment = Math.min(actualInvestment, maxAllowableInvestment);
  const investmentRebate = Math.round(eligibleInvestment * 0.15);

  const netTaxBeforeMin = Math.max(0, grossTax - investmentRebate);
  let finalTax = netTaxBeforeMin;
  let minimumTaxApplied = false;

  if (taxableIncome > 0 && finalTax < minimumTax) {
    finalTax = minimumTax;
    minimumTaxApplied = true;
  }

  const effectiveTaxRate = income > 0 ? (finalTax / income) * 100 : 0;

  return {
    totalAnnualIncome: income,
    taxFreeLimit,
    taxableIncome,
    slabs,
    grossTaxBdt: Math.round(grossTax),
    investmentRebateBdt: investmentRebate,
    netTaxBeforeMinBdt: Math.round(netTaxBeforeMin),
    minimumTaxApplied,
    finalTaxPayableBdt: Math.round(finalTax),
    effectiveTaxRatePercent: Math.round(effectiveTaxRate * 10) / 10,
  };
}

// --- 2. SANCHAYPATRA (জাতীয় সঞ্চয়পত্র) PROFIT ENGINE ---

export type SanchaypatraType =
  | "paribar"
  | "pensioner"
  | "five_year_bd"
  | "three_month_profit";

export interface SanchaypatraProfitResult {
  investmentAmount: number;
  schemeTitleBn: string;
  sourceTaxPercent: number; // 5% if <= 5L, 10% if > 5L
  grossAnnualProfitBdt: number;
  grossMonthlyProfitBdt: number;
  taxDeductedMonthlyBdt: number;
  netMonthlyTakeHomeBdt: number;
  effectiveAnnualYieldPercent: number;
}

export function calculateSanchaypatraProfit(
  scheme: SanchaypatraType,
  investmentAmount: number
): SanchaypatraProfitResult {
  const amount = Math.max(0, investmentAmount);

  // Profit rates based on 3 investment tiers
  // Tier 1: Up to 15 Lakh
  // Tier 2: 15L to 30L
  // Tier 3: Above 30L
  const rates = {
    paribar: { t1: 11.52, t2: 10.5, t3: 9.5, title: "পরিবার সঞ্চয়পত্র (মাসিক মুনাফা)" },
    pensioner: { t1: 11.76, t2: 10.75, t3: 9.75, title: "পেনশনার সঞ্চয়পত্র (৩ মাস অন্তর)" },
    five_year_bd: { t1: 11.28, t2: 10.3, t3: 9.3, title: "বাংলাদেশ সঞ্চয়পত্র (৫ বছর মেয়াদী)" },
    three_month_profit: { t1: 11.04, t2: 10.0, t3: 9.0, title: "তিন মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র" },
  };

  const currentScheme = rates[scheme] || rates.paribar;

  let grossAnnualProfit = 0;
  let remaining = amount;

  // Tier 1 (up to 15,00,000)
  const a1 = Math.min(remaining, 1500000);
  grossAnnualProfit += a1 * (currentScheme.t1 / 100);
  remaining -= a1;

  // Tier 2 (next 15,00,000)
  if (remaining > 0) {
    const a2 = Math.min(remaining, 1500000);
    grossAnnualProfit += a2 * (currentScheme.t2 / 100);
    remaining -= a2;
  }

  // Tier 3 (remaining above 30 Lakh)
  if (remaining > 0) {
    grossAnnualProfit += remaining * (currentScheme.t3 / 100);
    remaining = 0;
  }

  const grossMonthly = grossAnnualProfit / 12;
  // Source tax: 5% if total investment <= 500,000 BDT, otherwise 10%
  const sourceTaxPercent = amount <= 500000 ? 5 : 10;
  const taxMonthly = grossMonthly * (sourceTaxPercent / 100);
  const netMonthly = grossMonthly - taxMonthly;
  const netAnnual = netMonthly * 12;
  const effectiveYield = amount > 0 ? (netAnnual / amount) * 100 : 0;

  return {
    investmentAmount: amount,
    schemeTitleBn: currentScheme.title,
    sourceTaxPercent,
    grossAnnualProfitBdt: Math.round(grossAnnualProfit),
    grossMonthlyProfitBdt: Math.round(grossMonthly),
    taxDeductedMonthlyBdt: Math.round(taxMonthly),
    netMonthlyTakeHomeBdt: Math.round(netMonthly),
    effectiveAnnualYieldPercent: Math.round(effectiveYield * 100) / 100,
  };
}

// --- 3. BANK LOAN EMI REDUCING BALANCE ENGINE ---

export interface LoanEmiResult {
  principalAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmiBdt: number;
  totalInterestPayableBdt: number;
  totalAmountPayableBdt: number;
}

export function calculateLoanEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): LoanEmiResult {
  const p = Math.max(0, principal);
  const r = annualInterestRate / 100 / 12;
  const n = Math.max(1, tenureMonths);

  if (p === 0) {
    return { principalAmount: 0, annualInterestRate, tenureMonths: n, monthlyEmiBdt: 0, totalInterestPayableBdt: 0, totalAmountPayableBdt: 0 };
  }

  if (r === 0) {
    const emi = p / n;
    return {
      principalAmount: p,
      annualInterestRate: 0,
      tenureMonths: n,
      monthlyEmiBdt: Math.round(emi),
      totalInterestPayableBdt: 0,
      totalAmountPayableBdt: p,
    };
  }

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  const totalInterest = totalPayable - p;

  return {
    principalAmount: p,
    annualInterestRate,
    tenureMonths: n,
    monthlyEmiBdt: Math.round(emi),
    totalInterestPayableBdt: Math.round(totalInterest),
    totalAmountPayableBdt: Math.round(totalPayable),
  };
}
