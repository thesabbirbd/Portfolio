/**
 * THE SABBiR OS — Authentic Bangladeshi Land Area & BAJUS Gold Calculator Engine
 * Conforms to Bangladesh Land Survey Standards (DLRS) & Bangladesh Jeweller's Association (BAJUS).
 */

// 1 Decimal (শতক/শতাংশ) = 435.6 Square Feet
export const SQFT_PER_DECIMAL = 435.6;
// Standard Katha (কাঠা) = 720 Sq.Ft = 1.65289... Decimal (~1.65 Decimal)
export const SQFT_PER_KATHA = 720;
// 1 Bigha (বিঘা) = 20 Katha = 33 Decimal = 14,374.8 Sq.Ft
export const SQFT_PER_BIGHA = 14374.8;
// 1 Chotak (ছটাক) = 45 Sq.Ft (16 Chotak = 1 Katha)
export const SQFT_PER_CHOTAK = 45;
// 1 Acre (একর) = 100 Decimal = 43,560 Sq.Ft
export const SQFT_PER_ACRE = 43560;

export interface LandConversionResult {
  sqft: number;
  decimal: number;
  katha: number;
  bigha: number;
  chotak: number;
  acre: number;
  sqmeter: number;
}

export function convertLandFromSqft(sqft: number): LandConversionResult {
  const safeSqft = Math.max(0, sqft);
  return {
    sqft: Number(safeSqft.toFixed(2)),
    decimal: Number((safeSqft / SQFT_PER_DECIMAL).toFixed(4)),
    katha: Number((safeSqft / SQFT_PER_KATHA).toFixed(4)),
    bigha: Number((safeSqft / SQFT_PER_BIGHA).toFixed(4)),
    chotak: Number((safeSqft / SQFT_PER_CHOTAK).toFixed(2)),
    acre: Number((safeSqft / SQFT_PER_ACRE).toFixed(4)),
    sqmeter: Number((safeSqft * 0.092903).toFixed(2)),
  };
}

export function convertLandFromDecimal(decimal: number): LandConversionResult {
  return convertLandFromSqft(decimal * SQFT_PER_DECIMAL);
}

export function convertLandFromKatha(katha: number): LandConversionResult {
  return convertLandFromSqft(katha * SQFT_PER_KATHA);
}

export function convertLandFromBigha(bigha: number): LandConversionResult {
  return convertLandFromSqft(bigha * SQFT_PER_BIGHA);
}

// ---------------------------------------------------------------------------
// BAJUS Gold & Jewelry Units & Price Engine
// ---------------------------------------------------------------------------
// 1 Vori / Bhori = 11.664 Grams
export const GRAMS_PER_VORI = 11.664;
// 1 Vori = 16 Ana
export const ANA_PER_VORI = 16;
// 1 Ana = 6 Ratti ➔ 1 Vori = 96 Ratti
export const RATTI_PER_VORI = 96;

export interface GoldConversionResult {
  vori: number;
  ana: number;
  ratti: number;
  grams: number;
}

export function convertGoldFromGrams(grams: number): GoldConversionResult {
  const safeGrams = Math.max(0, grams);
  const vori = safeGrams / GRAMS_PER_VORI;
  return {
    grams: Number(safeGrams.toFixed(3)),
    vori: Number(vori.toFixed(4)),
    ana: Number((vori * ANA_PER_VORI).toFixed(2)),
    ratti: Number((vori * RATTI_PER_VORI).toFixed(2)),
  };
}

export function convertGoldFromVori(vori: number): GoldConversionResult {
  const safeVori = Math.max(0, vori);
  return {
    vori: Number(safeVori.toFixed(4)),
    grams: Number((safeVori * GRAMS_PER_VORI).toFixed(3)),
    ana: Number((safeVori * ANA_PER_VORI).toFixed(2)),
    ratti: Number((safeVori * RATTI_PER_VORI).toFixed(2)),
  };
}

export interface GoldPriceCalculation {
  karat: "22K" | "21K" | "18K" | "Traditional";
  weightVori: number;
  weightGrams: number;
  ratePerVori: number;
  goldBasePriceBdt: number;
  makingChargeBdt: number; // typically 3,500 - 6,000 BDT per vori
  vat5PercentBdt: number; // 5% Govt VAT
  totalInvoiceBdt: number;
}

export function calculateGoldJewelryPrice(
  karat: "22K" | "21K" | "18K" | "Traditional",
  weightVori: number,
  ratePerVoriOverride?: number,
  makingChargePerVori: number = 4000
): GoldPriceCalculation {
  // Benchmark BAJUS gold rates (November 2026 calibration)
  const defaultRates = {
    "22K": 142000,
    "21K": 135500,
    "18K": 116200,
    Traditional: 95500,
  };

  const ratePerVori = ratePerVoriOverride || defaultRates[karat];
  const goldBasePriceBdt = Math.round(weightVori * ratePerVori);
  const makingChargeBdt = Math.round(weightVori * makingChargePerVori);
  const subtotal = goldBasePriceBdt + makingChargeBdt;
  const vat5PercentBdt = Math.round(subtotal * 0.05);
  const totalInvoiceBdt = subtotal + vat5PercentBdt;

  return {
    karat,
    weightVori: Number(weightVori.toFixed(3)),
    weightGrams: Number((weightVori * GRAMS_PER_VORI).toFixed(3)),
    ratePerVori,
    goldBasePriceBdt,
    makingChargeBdt,
    vat5PercentBdt,
    totalInvoiceBdt,
  };
}
