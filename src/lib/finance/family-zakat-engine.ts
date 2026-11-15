/**
 * THE SABBiR OS — Family Monthly Hisab, Bank DPS/FDR & Islamic Zakat Engine
 * Authentic BAJUS Gold/Silver Nisab thresholds (7.5 Vori / 52.5 Vori) at 2.5%,
 * 50/30/20 Family Budgeting, and Bank DPS/FDR compound tax math.
 */

// --- 1. FAMILY 50/30/20 BUDGET ENGINE ---

export interface FamilyBudgetInput {
  monthlyIncome: number;
  needs: {
    houseRent: number;
    groceryBazar: number;
    utilityBills: number;
    educationFees: number;
    medicalHealth: number;
    otherNeeds: number;
  };
  wants: {
    diningOut: number;
    entertainment: number;
    shoppingClothing: number;
    gadgetsTravel: number;
  };
  savings: {
    dpsSavings: number;
    emergencyFund: number;
    loanEmiDebt: number;
  };
}

export interface FamilyBudgetResult {
  totalIncome: number;
  totalNeeds: number;
  totalWants: number;
  totalSavings: number;
  totalExpenses: number;
  netSurplusOrDeficit: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  healthGrade: "optimal" | "balanced" | "warning" | "deficit";
  summaryBn: string;
}

export function calculateFamilyBudget(input: FamilyBudgetInput): FamilyBudgetResult {
  const { monthlyIncome, needs, wants, savings } = input;

  const totalNeeds =
    needs.houseRent +
    needs.groceryBazar +
    needs.utilityBills +
    needs.educationFees +
    needs.medicalHealth +
    needs.otherNeeds;

  const totalWants =
    wants.diningOut +
    wants.entertainment +
    wants.shoppingClothing +
    wants.gadgetsTravel;

  const totalSavings =
    savings.dpsSavings +
    savings.emergencyFund +
    savings.loanEmiDebt;

  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const netSurplusOrDeficit = monthlyIncome - totalExpenses;

  const income = Math.max(1, monthlyIncome);
  const needsPercentage = Math.round((totalNeeds / income) * 100);
  const wantsPercentage = Math.round((totalWants / income) * 100);
  const savingsPercentage = Math.round((totalSavings / income) * 100);

  let healthGrade: FamilyBudgetResult["healthGrade"] = "balanced";
  let summaryBn = "";

  if (netSurplusOrDeficit < 0) {
    healthGrade = "deficit";
    summaryBn = `বাজেটে ঘাটতি রয়েছে! প্রতি মাসে ৳ ${Math.abs(netSurplusOrDeficit).toLocaleString("bn-BD")} ধার বা সঞ্চয় ভেঙে চলতে হচ্ছে। অনাবশ্যক খরচ কমান।`;
  } else if (needsPercentage <= 50 && savingsPercentage >= 20) {
    healthGrade = "optimal";
    summaryBn = "চমৎকার আর্থিক শৃঙ্খলা! ৫০/৩০/২০ নিয়মে আপনার সঞ্চয় ও প্রয়োজনীয় খরচ নিখুঁত অনুপাতে রয়েছে।";
  } else if (needsPercentage > 65) {
    healthGrade = "warning";
    summaryBn = "প্রয়োজনীয় খরচের চাপ বেশি (৬৫%+)। বিলাসবহুল খরচ কমিয়ে আপদকালীন তহবিল বাড়ানো প্রয়োজন।";
  } else {
    healthGrade = "balanced";
    summaryBn = `স্থিতিশীল পারিবারিক বাজেট। মাস শেষে উদ্বৃত্ত রয়েছে ৳ ${netSurplusOrDeficit.toLocaleString("bn-BD")}।`;
  }

  return {
    totalIncome: monthlyIncome,
    totalNeeds,
    totalWants,
    totalSavings,
    totalExpenses,
    netSurplusOrDeficit,
    needsPercentage,
    wantsPercentage,
    savingsPercentage,
    healthGrade,
    summaryBn,
  };
}

// --- 2. BANK DPS & FDR COMPOUND MATURITY ENGINE ---

export interface DpsFdrInput {
  type: "dps" | "fdr";
  amount: number; // Monthly installment for DPS, or One-time Principal for FDR
  annualInterestRate: number; // e.g. 8.5%
  tenureYears: number; // e.g. 3, 5, 10
  hasTinCertificate: boolean; // 10% tax with TIN, 15% without TIN
}

export interface DpsFdrResult {
  totalDeposited: number;
  grossInterestEarned: number;
  totalMaturityGross: number;
  taxRatePercent: number;
  taxDeductedBdt: number;
  exciseDutyBdt: number;
  netTakeHomeAmount: number;
  netProfitBdt: number;
}

export function calculateExciseDuty(totalBalance: number): number {
  if (totalBalance <= 100000) return 0;
  if (totalBalance <= 500000) return 150;
  if (totalBalance <= 1000000) return 500;
  if (totalBalance <= 10000000) return 3000;
  if (totalBalance <= 50000000) return 15000;
  return 50000;
}

export function calculateDpsFdrMaturity(input: DpsFdrInput): DpsFdrResult {
  const { type, amount, annualInterestRate, tenureYears, hasTinCertificate } = input;
  const rateMonthly = annualInterestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  let totalDeposited = 0;
  let maturityGross = 0;

  if (type === "dps") {
    totalDeposited = amount * totalMonths;
    // Compound monthly annuity formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    if (rateMonthly > 0) {
      maturityGross = amount * ((Math.pow(1 + rateMonthly, totalMonths) - 1) / rateMonthly) * (1 + rateMonthly);
    } else {
      maturityGross = totalDeposited;
    }
  } else {
    // FDR (Fixed Deposit) - One-time lump sum compounded annually
    totalDeposited = amount;
    maturityGross = amount * Math.pow(1 + annualInterestRate / 100, tenureYears);
  }

  const grossInterest = Math.max(0, maturityGross - totalDeposited);
  const taxRatePercent = hasTinCertificate ? 10 : 15;
  const taxDeducted = grossInterest * (taxRatePercent / 100);
  const exciseDuty = calculateExciseDuty(maturityGross);
  const netTakeHome = Math.max(0, maturityGross - taxDeducted - exciseDuty);
  const netProfit = Math.max(0, netTakeHome - totalDeposited);

  return {
    totalDeposited: Math.round(totalDeposited),
    grossInterestEarned: Math.round(grossInterest),
    totalMaturityGross: Math.round(maturityGross),
    taxRatePercent,
    taxDeductedBdt: Math.round(taxDeducted),
    exciseDutyBdt: exciseDuty,
    netTakeHomeAmount: Math.round(netTakeHome),
    netProfitBdt: Math.round(netProfit),
  };
}

// --- 3. AUTHENTIC ISLAMIC ZAKAT & NISAB ENGINE ---

export interface ZakatInput {
  goldPricePerVori: number; // e.g. 135,000 BDT
  silverPricePerVori: number; // e.g. 2,100 BDT
  nisabStandard: "silver" | "gold"; // Scholars recommend Silver for charity maximization
  cashInHandBank: number;
  goldOrnamentsVori: number;
  silverOrnamentsVori: number;
  businessGoodsInventory: number;
  loanReceivables: number;
  investmentsShares: number;
  immediateDebtsAndLiabilities: number;
}

export interface ZakatResult {
  goldNisabThresholdBdt: number;
  silverNisabThresholdBdt: number;
  effectiveNisabBdt: number;
  totalGrossAssetsBdt: number;
  netZakatableWealthBdt: number;
  isZakatEligible: boolean;
  zakatPayableBdt: number;
  zakatPercentage: number;
  statusBn: string;
}

export function calculateIslamicZakat(input: ZakatInput): ZakatResult {
  const {
    goldPricePerVori,
    silverPricePerVori,
    nisabStandard,
    cashInHandBank,
    goldOrnamentsVori,
    silverOrnamentsVori,
    businessGoodsInventory,
    loanReceivables,
    investmentsShares,
    immediateDebtsAndLiabilities,
  } = input;

  // Authentic Nisab Weights: 7.5 Vori Gold (87.48g) & 52.5 Vori Silver (612.36g)
  const goldNisabThresholdBdt = 7.5 * goldPricePerVori;
  const silverNisabThresholdBdt = 52.5 * silverPricePerVori;
  const effectiveNisabBdt =
    nisabStandard === "silver" ? silverNisabThresholdBdt : goldNisabThresholdBdt;

  const goldValuation = goldOrnamentsVori * goldPricePerVori;
  const silverValuation = silverOrnamentsVori * silverPricePerVori;

  const totalGrossAssetsBdt =
    cashInHandBank +
    goldValuation +
    silverValuation +
    businessGoodsInventory +
    loanReceivables +
    investmentsShares;

  const netZakatableWealthBdt = Math.max(0, totalGrossAssetsBdt - immediateDebtsAndLiabilities);
  const isZakatEligible = netZakatableWealthBdt >= effectiveNisabBdt;
  const zakatPayableBdt = isZakatEligible ? Math.round(netZakatableWealthBdt * 0.025) : 0;

  const statusBn = isZakatEligible
    ? `আপনার মোট যাকাতযোগ্য সম্পদ (৳ ${netZakatableWealthBdt.toLocaleString("bn-BD")}) নেসাব সীমা অতিক্রম করেছে। আপনার ওপর ২.৫% হারে যাকাত আদায় করা ফরজ।`
    : `আপনার মোট সম্পদ নেসাব সীমার (৳ ${effectiveNisabBdt.toLocaleString("bn-BD")}) নিচে। আপনার ওপর এই বছর যাকাত ফরজ নয়।`;

  return {
    goldNisabThresholdBdt: Math.round(goldNisabThresholdBdt),
    silverNisabThresholdBdt: Math.round(silverNisabThresholdBdt),
    effectiveNisabBdt: Math.round(effectiveNisabBdt),
    totalGrossAssetsBdt: Math.round(totalGrossAssetsBdt),
    netZakatableWealthBdt: Math.round(netZakatableWealthBdt),
    isZakatEligible,
    zakatPayableBdt,
    zakatPercentage: 2.5,
    statusBn,
  };
}

/**
 * Sample BD Family Budget Default
 */
export const SAMPLE_FAMILY_BUDGET: FamilyBudgetInput = {
  monthlyIncome: 75000,
  needs: {
    houseRent: 20000,
    groceryBazar: 16000,
    utilityBills: 4000,
    educationFees: 5000,
    medicalHealth: 2500,
    otherNeeds: 1500,
  },
  wants: {
    diningOut: 3000,
    entertainment: 1500,
    shoppingClothing: 3500,
    gadgetsTravel: 2000,
  },
  savings: {
    dpsSavings: 5000,
    emergencyFund: 2000,
    loanEmiDebt: 0,
  },
};
