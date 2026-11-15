import { describe, it, expect } from "vitest";
import {
  calculateExactAge,
  calculateBmiAndBmr,
  EmergencyMedicalIdData,
} from "@/lib/health/age-health-engine";
import {
  calculateCateringIngredients,
  calculateChandaSettlement,
  ChandaMember,
} from "@/lib/events/event-dawat-engine";

describe("Exact Job Age & BMI/BMR Health Engine (Block 6)", () => {
  it("calculates exact calendar age in years, months, and days accurately", () => {
    // Birth: 1996-05-10, Target: 2026-11-15 -> 30 years, 6 months, 5 days
    const age = calculateExactAge("1996-05-10", "2026-11-15", 32);
    expect(age.years).toBe(30);
    expect(age.months).toBe(6);
    expect(age.days).toBe(5);
    expect(age.isBcsEligible).toBe(true);
    expect(age.formattedBn).toBe("30 বছর 6 মাস 5 দিন");
  });

  it("identifies candidates beyond 32 years as ineligible for general BCS quota", () => {
    // Birth: 1992-01-01, Target: 2026-11-15 -> 34 years
    const age = calculateExactAge("1992-01-01", "2026-11-15", 32);
    expect(age.years).toBe(34);
    expect(age.isBcsEligible).toBe(false);
    expect(age.cutoffStatusBn).toContain("বয়সসীমা উত্তীর্ণ");
  });

  it("calculates Mifflin-St Jeor BMR and Asian-Pacific WHO BMI classifications", () => {
    // Male, 28 years, 175cm, 70kg, sedentary (1.2)
    // BMR = 10*70 + 6.25*175 - 5*28 + 5 = 700 + 1093.75 - 140 + 5 = 1658.75 -> 1659
    // BMI = 70 / (1.75^2) = 70 / 3.0625 = 22.85 -> 22.9 (Normal in Asian-Pacific 18.5-22.9)
    const res = calculateBmiAndBmr({
      gender: "male",
      ageYears: 28,
      heightCm: 175,
      weightKg: 70,
      activityLevel: "sedentary",
    });

    expect(res.bmi).toBe(22.9);
    expect(res.bmiCategory).toBe("normal");
    expect(res.bmrCalories).toBe(1659);
    expect(res.tdeeCalories).toBe(Math.round(1659 * 1.2));
    expect(res.dailyWaterLiters).toBeGreaterThan(2.0);
  });
});

describe("Dawat Catering Sizer & Picnic Chanda Splitter Engine (Block 6)", () => {
  it("scales raw ingredients for 100 people Kacchi Biryani feast", () => {
    const catering = calculateCateringIngredients("kacchi_biryani", 100);
    expect(catering.guestCount).toBe(100);
    expect(catering.items.length).toBeGreaterThan(5);

    // Meat: 250g * 100 = 25 kg
    const meat = catering.items.find((i) => i.nameBn.includes("মাংস"));
    expect(meat).toBeDefined();
    expect(meat?.totalQuantity).toBe(25);
    expect(meat?.unit).toBe("কেজি");

    // Rice: 125g * 100 = 12.5 kg
    const rice = catering.items.find((i) => i.nameBn.includes("চাল"));
    expect(rice).toBeDefined();
    expect(rice?.totalQuantity).toBe(12.5);

    expect(catering.grandTotalCostBdt).toBeGreaterThan(20000);
    expect(catering.costPerHeadBdt).toBeGreaterThan(200);
  });

  it("calculates balanced multi-person Chanda debt settlements", () => {
    // 3 members: A paid 300, B paid 0, C paid 0. Total = 300. Per head = 100.
    // Settlements: B pays A 100, C pays A 100. Total settled = 200.
    const members: ChandaMember[] = [
      { id: "1", name: "UserA", paidAmount: 300 },
      { id: "2", name: "UserB", paidAmount: 0 },
      { id: "3", name: "UserC", paidAmount: 0 },
    ];

    const split = calculateChandaSettlement(members);
    expect(split.totalExpense).toBe(300);
    expect(split.perHeadShare).toBe(100);
    expect(split.settlements.length).toBe(2);

    const fromB = split.settlements.find((s) => s.from === "UserB");
    expect(fromB?.to).toBe("UserA");
    expect(fromB?.amount).toBe(100);

    const fromC = split.settlements.find((s) => s.from === "UserC");
    expect(fromC?.to).toBe("UserA");
    expect(fromC?.amount).toBe(100);
  });
});
