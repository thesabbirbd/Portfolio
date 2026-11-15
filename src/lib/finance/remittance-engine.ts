/**
 * THE SABBiR OS — Freelancer Remittance & 2.5% Bangladesh Govt Incentive Engine
 * Models real-world payout corridors (Upwork, Fiverr, Payoneer, Wise, Direct SWIFT)
 * to Bangladesh Bank (with 2.5% Govt Cash Incentive) vs bKash/Nagad instant mobile wallet.
 */

export interface RemittanceCorridor {
  id: string;
  name: string;
  source: string;
  destination: string;
  exchangeRateBdt: number;
  fixedFeeUsd: number;
  percentFee: number;
  hasGovtIncentive: boolean; // 2.5% Bangladesh Bank cash incentive
  cashoutFeePercent: number; // e.g. 1.49% for bKash/Nagad agent cashout
  speed: "Instant" | "Same Day" | "1-2 Business Days" | "2-3 Business Days";
  description: string;
}

export interface CorridorCalculationResult {
  corridor: RemittanceCorridor;
  grossUsd: number;
  platformFeeUsd: number;
  netUsd: number;
  baseBdt: number;
  govtIncentiveBdt: number;
  grossBdt: number;
  cashoutFeeBdt: number;
  netInHandBdt: number;
  effectiveRatePerUsd: number;
}

export const REMITTANCE_CORRIDORS: RemittanceCorridor[] = [
  {
    id: "bank-wire-swift",
    name: "Direct Local Bank Wire (SWIFT / Bangladesh Bank)",
    source: "Upwork / Wise / Direct Client",
    destination: "Local Bank Account (BRAC, City, EBL, Islami Bank)",
    exchangeRateBdt: 122.5,
    fixedFeeUsd: 30, // SWIFT intermediate bank fee
    percentFee: 0,
    hasGovtIncentive: true,
    cashoutFeePercent: 0, // Cheque/ATM free in Bangladesh
    speed: "2-3 Business Days",
    description: "Highest net payout for transfers over $1,000. Full 2.5% cash incentive deposited into bank.",
  },
  {
    id: "payoneer-to-bank",
    name: "Payoneer ➔ Bangladeshi Bank Account",
    source: "Payoneer / Upwork / Fiverr",
    destination: "Local Bank Account",
    exchangeRateBdt: 120.5, // ~2% FX spread
    fixedFeeUsd: 0,
    percentFee: 2.0, // Payoneer withdrawal / FX fee
    hasGovtIncentive: true,
    cashoutFeePercent: 0,
    speed: "Same Day",
    description: "Most popular freelancer method. Fast bank deposit with full 2.5% Bangladesh Bank incentive.",
  },
  {
    id: "payoneer-to-bkash",
    name: "Payoneer ➔ bKash Instant Remittance",
    source: "Payoneer",
    destination: "bKash Mobile Wallet",
    exchangeRateBdt: 120.0,
    fixedFeeUsd: 0,
    percentFee: 2.0,
    hasGovtIncentive: true, // Distributed by bKash
    cashoutFeePercent: 1.49, // bKash cashout fee
    speed: "Instant",
    description: "Instant money in your bKash wallet 24/7. 2.5% Govt incentive automatically credited.",
  },
  {
    id: "wise-to-bank",
    name: "Wise (TransferWise) ➔ Bangladeshi Bank",
    source: "Wise / Direct Contract",
    destination: "Local Bank Account",
    exchangeRateBdt: 122.2, // Mid-market rate
    fixedFeeUsd: 2.5,
    percentFee: 0.65,
    hasGovtIncentive: true,
    cashoutFeePercent: 0,
    speed: "1-2 Business Days",
    description: "Transparent mid-market exchange rate with low upfront fee and full 2.5% Govt incentive.",
  },
  {
    id: "fiverr-to-bkash",
    name: "Fiverr ➔ bKash Direct Cash",
    source: "Fiverr Revenue Card",
    destination: "bKash Mobile Wallet",
    exchangeRateBdt: 119.5,
    fixedFeeUsd: 3, // Fiverr payout fee
    percentFee: 2.5,
    hasGovtIncentive: true,
    cashoutFeePercent: 1.49,
    speed: "Instant",
    description: "Quick cashout for graphic designers and micro-task freelancers directly to bKash.",
  },
];

export function calculateRemittanceCorridors(grossUsd: number): {
  results: CorridorCalculationResult[];
  winner: CorridorCalculationResult;
  bestVsWorstDifferenceBdt: number;
} {
  const results: CorridorCalculationResult[] = REMITTANCE_CORRIDORS.map((corridor) => {
    const fixedFee = corridor.fixedFeeUsd;
    const percentFee = (grossUsd * corridor.percentFee) / 100;
    const totalFeeUsd = fixedFee + percentFee;
    const netUsd = Math.max(0, grossUsd - totalFeeUsd);

    const baseBdt = Math.round(netUsd * corridor.exchangeRateBdt);
    const govtIncentiveBdt = corridor.hasGovtIncentive ? Math.round(baseBdt * 0.025) : 0;
    const grossBdt = baseBdt + govtIncentiveBdt;
    const cashoutFeeBdt = Math.round((grossBdt * corridor.cashoutFeePercent) / 100);
    const netInHandBdt = grossBdt - cashoutFeeBdt;

    const effectiveRatePerUsd = grossUsd > 0 ? Number((netInHandBdt / grossUsd).toFixed(2)) : 0;

    return {
      corridor,
      grossUsd,
      platformFeeUsd: Number(totalFeeUsd.toFixed(2)),
      netUsd: Number(netUsd.toFixed(2)),
      baseBdt,
      govtIncentiveBdt,
      grossBdt,
      cashoutFeeBdt,
      netInHandBdt,
      effectiveRatePerUsd,
    };
  });

  // Sort by netInHandBdt descending
  results.sort((a, b) => b.netInHandBdt - a.netInHandBdt);
  const winner = results[0];
  const worst = results[results.length - 1];
  const bestVsWorstDifferenceBdt = winner.netInHandBdt - worst.netInHandBdt;

  return { results, winner, bestVsWorstDifferenceBdt };
}
