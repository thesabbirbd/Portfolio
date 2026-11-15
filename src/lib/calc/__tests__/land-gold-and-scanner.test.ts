import { describe, it, expect } from "vitest";
import {
  convertLandFromDecimal,
  convertLandFromKatha,
  convertLandFromBigha,
  convertGoldFromVori,
  convertGoldFromGrams,
  calculateGoldJewelryPrice,
  SQFT_PER_DECIMAL,
  SQFT_PER_KATHA,
  SQFT_PER_BIGHA,
  GRAMS_PER_VORI,
} from "../bd-land-gold-engine";

describe("BD Land & Gold BAJUS Calculator Engine (v5.2.12)", () => {
  it("converts authentic Bangladeshi land area measurements accurately", () => {
    // 33 Decimal = 1 Bigha
    const land33 = convertLandFromDecimal(33);
    expect(land33.bigha).toBeCloseTo(1.0, 2);
    expect(land33.katha).toBeCloseTo(20.0, 1);
    expect(land33.sqft).toBeCloseTo(SQFT_PER_BIGHA, 1);

    // 1 Katha = 720 Sq.Ft
    const land1Katha = convertLandFromKatha(1);
    expect(land1Katha.sqft).toBe(720);
    expect(land1Katha.chotak).toBe(16); // 16 Chotak = 1 Katha

    // 1 Decimal = 435.6 Sq.Ft
    const land1Dec = convertLandFromDecimal(1);
    expect(land1Dec.sqft).toBe(435.6);
  });

  it("converts BAJUS Gold standards accurately (1 Vori = 11.664g = 16 Ana)", () => {
    const gold1Vori = convertGoldFromVori(1);
    expect(gold1Vori.grams).toBe(11.664);
    expect(gold1Vori.ana).toBe(16);
    expect(gold1Vori.ratti).toBe(96);

    const goldGrams = convertGoldFromGrams(11.664);
    expect(goldGrams.vori).toBeCloseTo(1.0, 3);
  });

  it("calculates jewelry invoice including making charge and 5% VAT", () => {
    const calc = calculateGoldJewelryPrice("22K", 2, 140000, 5000);
    expect(calc.goldBasePriceBdt).toBe(280000); // 2 * 140,000
    expect(calc.makingChargeBdt).toBe(10000); // 2 * 5,000
    // Subtotal = 290,000, 5% VAT = 14,500
    expect(calc.vat5PercentBdt).toBe(14500);
    expect(calc.totalInvoiceBdt).toBe(304500);
  });
});
