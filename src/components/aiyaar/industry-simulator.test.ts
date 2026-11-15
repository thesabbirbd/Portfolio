import { describe, it, expect } from "vitest";
import { INDUSTRIES_22 } from "@/components/aiyaar/IndustryInteractiveSimulator";

describe("Stage 93: Aiyaar 22-Industry & Architecture Simulation Verification", () => {
  it("contains all 22 distinct industry operational workflows", () => {
    expect(INDUSTRIES_22.length).toBe(22);

    const ids = new Set(INDUSTRIES_22.map((ind) => ind.id));
    expect(ids.size).toBe(22);
  });

  it("verifies pharmacy FEFO, restaurant KOT, and supershop configurations", () => {
    const pharmacy = INDUSTRIES_22.find((ind) => ind.id === "pharmacy");
    expect(pharmacy).toBeDefined();
    expect(pharmacy?.name).toBe("Pharmacy & Healthcare");
    expect(pharmacy?.aiyaarFeature.includes("FEFO")).toBe(true);

    const restaurant = INDUSTRIES_22.find((ind) => ind.id === "restaurant");
    expect(restaurant).toBeDefined();
    expect(restaurant?.name).toBe("Restaurant & Cloud Kitchen");

    const supershop = INDUSTRIES_22.find((ind) => ind.id === "supershop");
    expect(supershop).toBeDefined();
    expect(supershop?.name).toBe("Supermarket & Grocery");
  });

  it("calculates monthly ROI leakage savings accurately", () => {
    const pharmacy = INDUSTRIES_22.find((ind) => ind.id === "pharmacy")!;
    const monthlySales = 500000;
    const staffCount = 4;

    const estimatedLeakageLoss = (monthlySales * pharmacy.leakagePct) / 100;
    const estimatedHoursSaved = staffCount * pharmacy.hoursSavedWeekly;

    expect(estimatedLeakageLoss).toBeGreaterThan(10000);
    expect(estimatedHoursSaved).toBe(56);
  });
});
