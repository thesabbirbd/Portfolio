import { describe, it, expect } from "vitest";

describe("8 New Everyday Studios (Block 7 - Stages 066-085)", () => {
  it("calculates mess meal rate and member balances accurately", () => {
    const totalBazar = 12000;
    const totalMeals = 300;
    const commonCost = 1600;
    const memberCount = 4;

    const mealRate = totalBazar / totalMeals; // 40
    expect(mealRate).toBe(40);

    const commonPerMember = commonCost / memberCount; // 400

    // Member A: 70 meals, paid 3500 bazar
    const aMeals = 70;
    const aPaid = 3500;
    const aCost = aMeals * mealRate + commonPerMember; // 2800 + 400 = 3200
    const aBalance = aPaid - aCost; // 3500 - 3200 = +300 (Refund)

    expect(aCost).toBe(3200);
    expect(aBalance).toBe(300);

    // Member B: 80 meals, paid 2500 bazar
    const bMeals = 80;
    const bPaid = 2500;
    const bCost = bMeals * mealRate + commonPerMember; // 3200 + 400 = 3600
    const bBalance = bPaid - bCost; // 2500 - 3600 = -1100 (Due)

    expect(bCost).toBe(3600);
    expect(bBalance).toBe(-1100);
  });

  it("calculates academic GPA correctly according to Bangladesh Education Board scale", () => {
    const getGpa = (marks: number) => {
      if (marks >= 80) return 5.0;
      if (marks >= 70) return 4.0;
      if (marks >= 60) return 3.5;
      if (marks >= 50) return 3.0;
      if (marks >= 40) return 2.0;
      if (marks >= 33) return 1.0;
      return 0.0;
    };

    expect(getGpa(85)).toBe(5.0);
    expect(getGpa(74)).toBe(4.0);
    expect(getGpa(63)).toBe(3.5);
    expect(getGpa(32)).toBe(0.0);

    const subjects = [85, 78, 92, 88, 72];
    const avg = subjects.reduce((sum, m) => sum + getGpa(m), 0) / subjects.length;
    expect(Number(avg.toFixed(2))).toBe(4.6);
  });

  it("calculates tailor customer due and order token financials", () => {
    const totalWage = 850;
    const advancePaid = 500;
    const dueAmount = Math.max(0, totalWage - advancePaid);

    expect(dueAmount).toBe(350);
  });

  it("compares BD courier charges including weight surcharge and COD", () => {
    const parcelWeight = 2; // KG (1st KG base + 1 KG extra)
    const codAmount = 2000;

    // Steadfast outside Dhaka
    const sfBase = 130;
    const extraWeightFee = (parcelWeight - 1) * 20; // 20
    const sfCod = (codAmount * 1.0) / 100; // 20
    const sfTotal = sfBase + extraWeightFee + sfCod; // 170

    expect(sfTotal).toBe(170);

    // Pathao outside Dhaka
    const pathaoBase = 120;
    const pathaoTotal = pathaoBase + extraWeightFee + sfCod; // 160
    expect(pathaoTotal).toBe(160);
  });
});
