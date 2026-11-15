/**
 * THE SABBiR OS — Dawat Raw Catering Sizer & Picnic Chanda Splitter Engine
 * Per-head authentic Bangladeshi catering ingredient math (Kacchi, Polao, Roast) in kg/liters
 * and equitable multi-person cost splitting with debt settlement resolution.
 */

export type MenuType = "kacchi_biryani" | "morog_polao_roast" | "beef_bhuna_khichuri";

export interface IngredientItem {
  nameBn: string;
  nameEn: string;
  perHeadGramsOrMl: number;
  unit: "কেজি" | "লিটার" | "পিস" | "গ্রাম";
  unitPriceBdt: number; // Price per kg, liter or piece
}

export interface CateringPreset {
  id: MenuType;
  titleBn: string;
  descriptionBn: string;
  ingredients: IngredientItem[];
}

export const CATERING_PRESETS: Record<MenuType, CateringPreset> = {
  kacchi_biryani: {
    id: "kacchi_biryani",
    titleBn: "কাচ্চি বিরিয়ানি ও বোরহানি ভোজ",
    descriptionBn: "খাসি বা গরুর মাংসের ঐতিহ্যবাহী কাচ্চি বিরিয়ানি, আলু ও সুস্বাদু বোরহানি।",
    ingredients: [
      { nameBn: "খাসি বা গরুর মাংস", nameEn: "Mutton / Beef Meat", perHeadGramsOrMl: 250, unit: "কেজি", unitPriceBdt: 950 },
      { nameBn: "বাসমতী বা চিনিগুঁড়া চাল", nameEn: "Basmati / Polao Rice", perHeadGramsOrMl: 125, unit: "কেজি", unitPriceBdt: 140 },
      { nameBn: "আলু (কাচ্চির টুকরা)", nameEn: "Potatoes", perHeadGramsOrMl: 80, unit: "কেজি", unitPriceBdt: 60 },
      { nameBn: "খাঁটি ঘি ও সয়াবিন তেল", nameEn: "Pure Ghee & Cooking Oil", perHeadGramsOrMl: 35, unit: "লিটার", unitPriceBdt: 450 },
      { nameBn: "পেঁয়াজ", nameEn: "Onion", perHeadGramsOrMl: 50, unit: "কেজি", unitPriceBdt: 90 },
      { nameBn: "আদা-রসুন বাটা", nameEn: "Ginger Garlic Paste", perHeadGramsOrMl: 25, unit: "কেজি", unitPriceBdt: 240 },
      { nameBn: "টক দই ও দুধ", nameEn: "Sour Curd & Milk", perHeadGramsOrMl: 30, unit: "লিটার", unitPriceBdt: 110 },
      { nameBn: "আলুবোখারা ও কিশমিশ", nameEn: "Prunes & Raisins", perHeadGramsOrMl: 10, unit: "কেজি", unitPriceBdt: 650 },
      { nameBn: "বোরহানি", nameEn: "Borhani Drink", perHeadGramsOrMl: 150, unit: "লিটার", unitPriceBdt: 120 },
    ],
  },
  morog_polao_roast: {
    id: "morog_polao_roast",
    titleBn: "মোরগ পোলাও, চিকেন রোস্ট ও জর্দা",
    descriptionBn: "বিয়ে ও সুন্নতে খতনার জনপ্রিয় মোরগ পোলাও, কোয়ার্টার চিকেন রোস্ট ও মিষ্টি জর্দা।",
    ingredients: [
      { nameBn: "রোস্টের মুরগি (কোয়ার্টার পিস)", nameEn: "Chicken Roast Quarter", perHeadGramsOrMl: 1, unit: "পিস", unitPriceBdt: 85 },
      { nameBn: "চিনিগুঁড়া পোলাও চাল", nameEn: "Chinigura Polao Rice", perHeadGramsOrMl: 125, unit: "কেজি", unitPriceBdt: 135 },
      { nameBn: "ঘি ও সয়াবিন তেল", nameEn: "Ghee & Oil", perHeadGramsOrMl: 35, unit: "লিটার", unitPriceBdt: 380 },
      { nameBn: "পেঁয়াজ ও বেরেস্তা", nameEn: "Onion", perHeadGramsOrMl: 50, unit: "কেজি", unitPriceBdt: 90 },
      { nameBn: "আদা-রসুন বাটা", nameEn: "Ginger Garlic Paste", perHeadGramsOrMl: 25, unit: "কেজি", unitPriceBdt: 240 },
      { nameBn: "টকদই ও বাদাম পেস্ট", nameEn: "Yogurt & Nut Paste", perHeadGramsOrMl: 20, unit: "কেজি", unitPriceBdt: 350 },
      { nameBn: "সিদ্ধ ডিম", nameEn: "Boiled Egg", perHeadGramsOrMl: 1, unit: "পিস", unitPriceBdt: 13 },
      { nameBn: "মিষ্টি জর্দা / ফিরনি", nameEn: "Jorda / Firni Dessert", perHeadGramsOrMl: 60, unit: "কেজি", unitPriceBdt: 180 },
    ],
  },
  beef_bhuna_khichuri: {
    id: "beef_bhuna_khichuri",
    titleBn: "গরুর ভুনা খিচুড়ি ও বেগুন ভাজা",
    descriptionBn: "বৃষ্টির দিনে বা পিকনিকের জন্য স্পেশাল ভুনা খিচুড়ি, গরুর মাংস ও বেগুন ভাজা।",
    ingredients: [
      { nameBn: "গরুর হাড়সহ মাংস", nameEn: "Beef with Bone", perHeadGramsOrMl: 200, unit: "কেজি", unitPriceBdt: 800 },
      { nameBn: "পোলাও চাল ও মুগ-মসুর ডাল", nameEn: "Rice & Lentils", perHeadGramsOrMl: 150, unit: "কেজি", unitPriceBdt: 130 },
      { nameBn: "সরিষা ও সয়াবিন তেল", nameEn: "Mustard Oil & Oil", perHeadGramsOrMl: 30, unit: "লিটার", unitPriceBdt: 260 },
      { nameBn: "পেঁয়াজ", nameEn: "Onion", perHeadGramsOrMl: 40, unit: "কেজি", unitPriceBdt: 90 },
      { nameBn: "আদা-রসুন ও খিচুড়ি মশলা", nameEn: "Ginger Garlic & Spices", perHeadGramsOrMl: 25, unit: "কেজি", unitPriceBdt: 240 },
      { nameBn: "বেগুন ভাজা", nameEn: "Fried Eggplant", perHeadGramsOrMl: 50, unit: "কেজি", unitPriceBdt: 70 },
      { nameBn: "সালাদ (শসা ও লেবু)", nameEn: "Salad", perHeadGramsOrMl: 40, unit: "কেজি", unitPriceBdt: 60 },
    ],
  },
};

export interface ScaledIngredientResult {
  nameBn: string;
  nameEn: string;
  totalQuantity: number;
  unit: string;
  formattedQuantity: string;
  estimatedCostBdt: number;
}

export interface CateringCalculationResult {
  guestCount: number;
  menuTitleBn: string;
  items: ScaledIngredientResult[];
  grandTotalCostBdt: number;
  costPerHeadBdt: number;
}

/**
 * Calculates raw ingredient shopping list in kg/liters for guest count.
 */
export function calculateCateringIngredients(
  menuType: MenuType,
  guestCount: number
): CateringCalculationResult {
  const preset = CATERING_PRESETS[menuType] || CATERING_PRESETS.kacchi_biryani;
  const count = Math.max(1, guestCount);

  let grandTotalCost = 0;
  const items: ScaledIngredientResult[] = preset.ingredients.map((ing) => {
    let totalQty = 0;
    let formattedQty = "";
    let cost = 0;

    if (ing.unit === "পিস") {
      totalQty = ing.perHeadGramsOrMl * count;
      formattedQty = `${totalQty} টি`;
      cost = totalQty * ing.unitPriceBdt;
    } else {
      // Grams or ml to kg or liters
      const totalGramsOrMl = ing.perHeadGramsOrMl * count;
      totalQty = Math.round((totalGramsOrMl / 1000) * 10) / 10;
      formattedQty = `${totalQty} ${ing.unit}`;
      cost = totalQty * ing.unitPriceBdt;
    }

    grandTotalCost += cost;

    return {
      nameBn: ing.nameBn,
      nameEn: ing.nameEn,
      totalQuantity: totalQty,
      unit: ing.unit,
      formattedQuantity: formattedQty,
      estimatedCostBdt: Math.round(cost),
    };
  });

  const costPerHead = Math.round(grandTotalCost / count);

  return {
    guestCount: count,
    menuTitleBn: preset.titleBn,
    items,
    grandTotalCostBdt: Math.round(grandTotalCost),
    costPerHeadBdt: costPerHead,
  };
}

// --- 2. MULTI-PERSON CHANDA / PICNIC COST SPLITTER ---

export interface ChandaMember {
  id: string;
  name: string;
  paidAmount: number;
}

export interface DebtSettlement {
  from: string;
  to: string;
  amount: number;
}

export interface ChandaSplitResult {
  totalExpense: number;
  memberCount: number;
  perHeadShare: number;
  settlements: DebtSettlement[];
  memberBalances: {
    name: string;
    paid: number;
    share: number;
    balance: number; // positive = receives, negative = pays
  }[];
}

/**
 * Solves multi-person cost splitting and produces minimal "Who pays whom" settlements.
 */
export function calculateChandaSettlement(members: ChandaMember[]): ChandaSplitResult {
  if (members.length === 0) {
    return {
      totalExpense: 0,
      memberCount: 0,
      perHeadShare: 0,
      settlements: [],
      memberBalances: [],
    };
  }

  const totalExpense = members.reduce((sum, m) => sum + (m.paidAmount || 0), 0);
  const perHeadShare = Math.round((totalExpense / members.length) * 100) / 100;

  interface BalanceNode {
    name: string;
    balance: number;
  }

  const debtors: BalanceNode[] = [];
  const creditors: BalanceNode[] = [];

  const memberBalances = members.map((m) => {
    const bal = Math.round((m.paidAmount - perHeadShare) * 100) / 100;
    if (bal < -0.01) {
      debtors.push({ name: m.name, balance: -bal }); // positive debt
    } else if (bal > 0.01) {
      creditors.push({ name: m.name, balance: bal });
    }
    return {
      name: m.name,
      paid: m.paidAmount,
      share: perHeadShare,
      balance: bal,
    };
  });

  const settlements: DebtSettlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settledAmount = Math.min(debtor.balance, creditor.balance);

    if (settledAmount > 0.5) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settledAmount),
      });
    }

    debtor.balance -= settledAmount;
    creditor.balance -= settledAmount;

    if (debtor.balance <= 0.5) dIdx++;
    if (creditor.balance <= 0.5) cIdx++;
  }

  return {
    totalExpense,
    memberCount: members.length,
    perHeadShare,
    settlements,
    memberBalances,
  };
}

/**
 * Default sample picnic tour members
 */
export const SAMPLE_CHANDA_MEMBERS: ChandaMember[] = [
  { id: "1", name: "সাব্বির (সাজেক বাস ভাড়া)", paidAmount: 8500 },
  { id: "2", name: "রনি (রিসোর্ট ও হোটেল বিল)", paidAmount: 12000 },
  { id: "3", name: "তানভীর (দুপুরের খাবার ও বারবিকিউ)", paidAmount: 4500 },
  { id: "4", name: "ফাহিম (নাস্তা ও ড্রাই ফ্রুটস)", paidAmount: 1800 },
  { id: "5", name: "সাকিব", paidAmount: 0 },
  { id: "6", name: "আসিফ", paidAmount: 0 },
];
