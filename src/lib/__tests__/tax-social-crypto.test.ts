import { describe, it, expect } from "vitest";
import {
  calculateBdIncomeTax,
  calculateSanchaypatraProfit,
  calculateLoanEmi,
} from "@/lib/finance/tax-sanchaypatra-engine";
import {
  transformUnicodeText,
  decorateList,
  generateSeoTags,
  buildUtmUrl,
} from "@/lib/social/unicode-text-styler";
import {
  generateDicewarePassphrase,
  analyzePasswordEntropy,
} from "@/lib/security/crypto-vault-engine";
import { evaluateOmnibarExpression } from "@/lib/command/omnibar-instant-engine";

describe("Stage 070: Tax, Sanchaypatra & EMI Engine Tests", () => {
  it("calculates Bangladesh individual tax correctly with slabs and exemptions", () => {
    // 3,50,000 exempt, remaining 2,50,000: 100k @ 5% (5k) + 150k @ 10% (15k) = 20,000 gross tax
    const res = calculateBdIncomeTax(600000, "general", "dhaka_ctg", 100000);
    expect(res.taxableIncome).toBe(250000);
    expect(res.grossTaxBdt).toBe(20000);
    // Rebate: allowable is min(250k * 0.2, 100k) = 50,000 -> 15% rebate = 7,500
    // Net tax = 20,000 - 7,500 = 12,500 (which is above 5,000 minimum tax)
    expect(res.finalTaxPayableBdt).toBe(12500);
  });

  it("calculates Sanchaypatra tiered profit with 10% TDS", () => {
    // 10 Lakh Paribar Sanchaypatra: 11.52% gross = 1,15,200/yr -> 9,600/mo gross -> 10% TDS -> 8,640 net take home
    const res = calculateSanchaypatraProfit("paribar", 1000000);
    expect(res.netMonthlyTakeHomeBdt).toBe(8640);
    expect(res.sourceTaxPercent).toBe(10);
    expect(res.grossMonthlyProfitBdt).toBe(9600);
  });

  it("calculates standard Bank Loan reducing EMI correctly", () => {
    // 10 Lakh @ 12% for 12 months: EMI ~ ৳88,849
    const emi = calculateLoanEmi(1000000, 12, 12);
    expect(emi.monthlyEmiBdt).toBeGreaterThan(88000);
    expect(emi.monthlyEmiBdt).toBeLessThan(89000);
    expect(emi.totalAmountPayableBdt).toBeGreaterThan(1000000);
  });
});

describe("Stage 070: Unicode Text Styler Tests", () => {
  it("transforms Latin characters into mathematical bold sans", () => {
    const input = "THE SABBiR 123";
    const bold = transformUnicodeText(input, "sans-bold");
    expect(bold).toBe("𝗧𝗛𝗘 𝗦𝗔𝗕𝗕𝗶𝗥 𝟭𝟮𝟯");
  });

  it("transforms text into monospace and strikethrough", () => {
    const mono = transformUnicodeText("Code", "monospace");
    expect(mono).toBe("𝙲𝚘𝚍𝚎");

    const strike = transformUnicodeText("Hi", "strikethrough");
    expect(strike).toContain("\u0336");
  });

  it("decorates lists with viral bullet symbols", () => {
    const rawList = "First item\nSecond item";
    const decorated = decorateList(rawList, "🔥 ");
    expect(decorated).toBe("🔥 First item\n🔥 Second item");
  });

  it("generates YouTube/Reel SEO tags under 500 characters", () => {
    const raw = "nextjs, react, typescript, web, ai, bangladesh";
    const res = generateSeoTags(raw, 500);
    expect(res.tagCount).toBe(6);
    expect(res.charCount).toBeLessThanOrEqual(500);
    expect(res.tagsString).toBe("nextjs, react, typescript, web, ai, bangladesh");
  });

  it("builds clean UTM campaign URLs", () => {
    const url = buildUtmUrl({
      baseUrl: "https://sabbir.nav.bd/tools",
      source: "linkedin",
      medium: "post",
      campaign: "v5_launch",
    });
    expect(url).toBe("https://sabbir.nav.bd/tools?utm_source=linkedin&utm_medium=post&utm_campaign=v5_launch");
  });
});

describe("Stage 070: Security & Crypto Vault Tests", () => {
  it("generates Diceware passphrases with specified length and separator", () => {
    const pass = generateDicewarePassphrase({
      wordCount: 4,
      separator: "-",
      capitalize: true,
      includeNumber: false,
    });
    const parts = pass.split("-");
    expect(parts.length).toBe(4);
  });

  it("accurately calculates Shannon entropy and crack times", () => {
    const weak = analyzePasswordEntropy("123456");
    expect(weak.score).toBeLessThanOrEqual(1);

    const strong = analyzePasswordEntropy("X9#mK$2!pL90@qW8*");
    expect(strong.entropyBits).toBeGreaterThan(70);
    expect(strong.score).toBeGreaterThanOrEqual(3);
  });

  it("evaluates Omnibar instant Sanchaypatra and EMI expressions", () => {
    const sanchayRes = evaluateOmnibarExpression("sanchaypatra 1000000");
    expect(sanchayRes).not.toBeNull();
    expect(sanchayRes?.value).toContain("Net Monthly Profit");

    const emiRes = evaluateOmnibarExpression("emi 500000 10% 3y");
    expect(emiRes).not.toBeNull();
    expect(emiRes?.title).toContain("500,000");
    expect(emiRes?.value).toContain("BDT / Month");
  });
});
