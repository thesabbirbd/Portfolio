import { describe, it, expect } from "vitest";
import { evaluateOmnibarExpression } from "../omnibar-instant-engine";

describe("Omnibar Instant Engine (v5.2.12)", () => {
  it("evaluates math expressions accurately", () => {
    const res1 = evaluateOmnibarExpression("1450 * 1.15");
    expect(res1).not.toBeNull();
    expect(res1?.type).toBe("math");
    expect(res1?.value).toBe("1,667.5");

    const res2 = evaluateOmnibarExpression("2500 / 4 + 125");
    expect(res2?.value).toBe("750");

    const res3 = evaluateOmnibarExpression("15% of 8000");
    expect(res3?.value).toBe("1,200");
  });

  it("converts numbers to Bangla and English words (Taka in Words)", () => {
    const res = evaluateOmnibarExpression("125000 tk");
    expect(res).not.toBeNull();
    expect(res?.type).toBe("taka_words");
    expect(res?.value).toContain("এক লক্ষ পঁচিশ হাজার টাকা মাত্র");
    expect(res?.secondary).toContain("One Lakh Twenty-Five Thousand Taka Only");

    const res2 = evaluateOmnibarExpression("টাকা 50000");
    expect(res2?.value).toContain("পঞ্চাশ হাজার টাকা মাত্র");
  });

  it("calculates USD remittance with 2.5% Bangladesh Govt incentive", () => {
    const res = evaluateOmnibarExpression("$1000");
    expect(res).not.toBeNull();
    expect(res?.type).toBe("remittance");
    // $1000 * 122.5 = 122,500 + 2.5% (3,063) = 125,563 or 125,562
    expect(res?.value).toContain("BDT");
    expect(res?.secondary).toContain("2.5% Govt Incentive");

    const res2 = evaluateOmnibarExpression("500 usd to bdt");
    expect(res2?.value).toContain("BDT");
  });

  it("converts authentic BD Land units (Decimal <-> Katha)", () => {
    const res = evaluateOmnibarExpression("10 decimal to katha");
    expect(res).not.toBeNull();
    expect(res?.type).toBe("land_gold");
    expect(res?.value).toContain("Katha");
    expect(res?.secondary).toContain("sq.ft");

    const res2 = evaluateOmnibarExpression("5 katha to decimal");
    expect(res2?.value).toContain("8.250 Decimal");
  });

  it("converts BAJUS Gold units (Vori <-> Gram)", () => {
    const res = evaluateOmnibarExpression("2 vori to gram");
    expect(res).not.toBeNull();
    expect(res?.type).toBe("land_gold");
    expect(res?.value).toBe("23.328 Grams (গ্রাম)");

    const res2 = evaluateOmnibarExpression("11.664 gram to vori");
    expect(res2?.value).toBe("1.000 Vori (ভরি)");
  });

  it("returns null for non-calculator queries", () => {
    expect(evaluateOmnibarExpression("hello world")).toBeNull();
    expect(evaluateOmnibarExpression("tools")).toBeNull();
    expect(evaluateOmnibarExpression("")).toBeNull();
  });

  it("handles edge cases gracefully without throwing", () => {
    expect(evaluateOmnibarExpression("10 / 0")).toBeNull();
    expect(evaluateOmnibarExpression("+++---")).toBeNull();
    expect(evaluateOmnibarExpression("(()))")).toBeNull();
    expect(evaluateOmnibarExpression("random text with 123")).toBeNull();
    expect(evaluateOmnibarExpression("-50 + 20")).not.toBeNull();
    expect(evaluateOmnibarExpression("0 / 5")).not.toBeNull();
    expect(evaluateOmnibarExpression("999999999999999999999999999")).toBeNull();
    expect(evaluateOmnibarExpression("alert('xss')")).toBeNull();
    expect(evaluateOmnibarExpression("<script>1+1</script>")).toBeNull();
  });
});
