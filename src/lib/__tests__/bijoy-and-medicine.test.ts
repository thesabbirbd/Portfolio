import { describe, it, expect } from "vitest";
import {
  convertBijoyToUnicode,
  convertUnicodeToBijoy,
  toBanglaDigits,
  BANGLA_OFFICIAL_TEMPLATES,
} from "@/lib/bangla/bijoy-unicode-engine";
import {
  parseDosePattern,
  calculateMedicineRefill,
  generateIcsCalendar,
  MedicineDoseItem,
} from "@/lib/health/medicine-schedule-engine";

describe("Bijoy ↔ Unicode Bangla Engine & Templates (Block 3)", () => {
  it("converts basic Bijoy characters and vowels to Unicode", () => {
    // "Avwg" -> "আমি" in SutonnyMJ
    const converted = convertBijoyToUnicode("Avwg");
    expect(converted).toBe("আমি");
  });

  it("converts Unicode to Bijoy", () => {
    const bijoy = convertUnicodeToBijoy("আমি");
    expect(bijoy).toBe("Avwg");
  });

  it("handles complex juktoborno like khyo, gyo, tro, kto", () => {
    // "¶gvi" -> "ক্ষমার"
    const khyo = convertBijoyToUnicode("¶gv");
    expect(khyo).toContain("ক্ষমা");

    const gyo = convertBijoyToUnicode("Ávc");
    expect(gyo).toContain("জ্ঞান");

    const tro = convertBijoyToUnicode("QvÎ");
    expect(tro).toContain("ছাত্র");
  });

  it("converts English digits to authentic Bangla digits", () => {
    expect(toBanglaDigits(2026)).toBe("২০২৬");
    expect(toBanglaDigits("01712345678")).toBe("০১৭১২৩৪৫৬৭৮");
  });

  it("verifies all 12 official administrative templates exist and contain essential placeholders", () => {
    expect(BANGLA_OFFICIAL_TEMPLATES.length).toBe(12);

    const categories = new Set(BANGLA_OFFICIAL_TEMPLATES.map((t) => t.category));
    expect(categories.has("bank")).toBe(true);
    expect(categories.has("job")).toBe(true);
    expect(categories.has("education")).toBe(true);
    expect(categories.has("police_legal")).toBe(true);
    expect(categories.has("property")).toBe(true);

    for (const tpl of BANGLA_OFFICIAL_TEMPLATES) {
      expect(tpl.id).toBeTruthy();
      expect(tpl.titleBn).toBeTruthy();
      expect(tpl.unicodeContent.length).toBeGreaterThan(50);
      expect(tpl.unicodeContent).toContain("বরাবর");
    }
  });
});

describe("Prescription Medicine Scheduler & Calendar Alarms (Block 3)", () => {
  it("parses 1+0+1, 1+1+1, 0+0+1 and SOS patterns accurately", () => {
    const d1 = parseDosePattern("1+0+1");
    expect(d1.morning).toBe(1);
    expect(d1.noon).toBe(0);
    expect(d1.night).toBe(1);
    expect(d1.isSos).toBe(false);

    const d2 = parseDosePattern("1+1+1");
    expect(d2.morning).toBe(1);
    expect(d2.noon).toBe(1);
    expect(d2.night).toBe(1);

    const d3 = parseDosePattern("0+0+1");
    expect(d3.morning).toBe(0);
    expect(d3.noon).toBe(0);
    expect(d3.night).toBe(1);

    const sos = parseDosePattern("SOS");
    expect(sos.isSos).toBe(true);
  });

  it("calculates accurate pill refill counts, strip requirements, and total cost", () => {
    const med: MedicineDoseItem = {
      id: "m-test",
      name: "Metformin",
      strength: "500mg",
      type: "tablet",
      rawDosePattern: "1+0+1",
      morningCount: 1,
      noonCount: 0,
      nightCount: 1,
      isSos: false,
      instruction: "after_meal",
      durationDays: 30, // 2 pills per day * 30 days = 60 pills
      unitPriceBdt: 5.0,
      stripSize: 10,
    };

    const refill = calculateMedicineRefill(med);
    expect(refill.dailyDoseTotal).toBe(2);
    expect(refill.totalPillsNeeded).toBe(60);
    expect(refill.stripsToBuy).toBe(6);
    expect(refill.totalCostBdt).toBe(300);
    expect(refill.refillDate).toBeDefined();
  });

  it("generates valid RFC 5545 iCalendar alarms with VALARM blocks", () => {
    const meds: MedicineDoseItem[] = [
      {
        id: "m-1",
        name: "Maxpro",
        strength: "20mg",
        type: "capsule",
        rawDosePattern: "1+0+1",
        morningCount: 1,
        noonCount: 0,
        nightCount: 1,
        isSos: false,
        instruction: "before_meal",
        durationDays: 14,
        unitPriceBdt: 7,
        stripSize: 14,
      },
    ];

    const ics = generateIcsCalendar(meds);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("Maxpro");
  });
});
