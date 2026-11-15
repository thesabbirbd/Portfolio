/**
 * THE SABBiR OS — Raycast-Style Omnibar Instant Calculation Engine
 * Parses raw input in Cmd+K for math, Taka-in-words, USD remittance, and BD land/gold units.
 */

export interface OmnibarInstantResult {
  type: "math" | "taka_words" | "remittance" | "land_gold";
  title: string;
  value: string;
  secondary?: string;
  category: string;
  copyText: string;
}

// Authentic Bangla words for numbers 1 to 99
const BANGLA_1_TO_99: Record<number, string> = {
  1: "এক", 2: "দুই", 3: "তিন", 4: "চার", 5: "পাঁচ", 6: "ছয়", 7: "সাত", 8: "আট", 9: "নয়", 10: "দশ",
  11: "এগারো", 12: "বারো", 13: "তেরো", 14: "চৌদ্দ", 15: "পনেরো", 16: "ষোল", 17: "সতেরো", 18: "আঠারো", 19: "উনিশ", 20: "বিশ",
  21: "একুশ", 22: "বাইশ", 23: "তেইশ", 24: "চব্বিশ", 25: "পঁচিশ", 26: "ছাব্বিশ", 27: "সাতাশ", 28: "আটাশ", 29: "ঊনত্রিশ", 30: "ত্রিশ",
  31: "একত্রিশ", 32: "বত্রিশ", 33: "তেত্রিশ", 34: "চৌত্রিশ", 35: "পঁয়ত্রিশ", 36: "ছত্রিশ", 37: "সাঁইত্রিশ", 38: "আটত্রিশ", 39: "ঊনচল্লিশ", 40: "চল্লিশ",
  41: "একচল্লিশ", 42: "বিয়াল্লিশ", 43: "তেতাল্লিশ", 44: "চুয়াল্লিশ", 45: "পঁয়তাল্লিশ", 46: "ছেচল্লিশ", 47: "সাতচল্লিশ", 48: "আটচল্লিশ", 49: "ঊনপঞ্চাশ", 50: "পঞ্চাশ",
  51: "একান্ন", 52: "বায়ান্ন", 53: "তিপ্পান্ন", 54: "চুয়ান্ন", 55: "পঞ্চান্ন", 56: "ছাপ্পান্ন", 57: "সাতান্ন", 58: "আটান্ন", 59: "ঊনষাট", 60: "ষাট",
  61: "একষট্টি", 62: "বাষট্টি", 63: "তেষট্টি", 64: "চৌষট্টি", 65: "পঁয়ষট্টি", 66: "ছেষট্টি", 67: "সাতষট্টি", 68: "আটষট্টি", 69: "ঊনসত্তর", 70: "সত্তর",
  71: "একাত্তর", 72: "বাহাত্তর", 73: "তিয়াত্তর", 74: "চুয়াত্তর", 75: "পঁচাত্তর", 76: "ছিয়াত্তর", 77: "সাতাত্তর", 78: "আটাত্তর", 79: "ঊনআশি", 80: "আশি",
  81: "একাশি", 82: "বিরাশি", 83: "তিরাশি", 84: "চুরাশি", 85: "পঁচাশি", 86: "ছিয়াশি", 87: "সাতাশি", 88: "আটাশি", 89: "ঊননব্বই", 90: "নব্বই",
  91: "একানব্বই", 92: "বানব্বই", 93: "তিরানব্বই", 94: "চুরানব্বই", 95: "পঁচানব্বই", 96: "ছিয়ানব্বই", 97: "সাতানব্বই", 98: "আটানব্বই", 99: "নিরানব্বই"
};

function numberToBanglaWords(num: number): string {
  if (num === 0) return "শূন্য";
  if (num < 0) return "মাইনাস " + numberToBanglaWords(Math.abs(num));

  let res = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  num %= 100;

  if (crore > 0) res += `${numberToBanglaWords(crore)} কোটি `;
  if (lakh > 0) res += `${BANGLA_1_TO_99[lakh] || numberToBanglaWords(lakh)} লক্ষ `;
  if (thousand > 0) res += `${BANGLA_1_TO_99[thousand] || numberToBanglaWords(thousand)} হাজার `;
  if (hundred > 0) res += `${BANGLA_1_TO_99[hundred]} শত `;

  if (num > 0) {
    res += BANGLA_1_TO_99[num] + " ";
  }

  return res.trim();
}

function numberToEnglishWords(num: number): string {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToEnglishWords(Math.abs(num));

  let str = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  num %= 100;

  if (crore > 0) str += `${numberToEnglishWords(crore)} Crore `;
  if (lakh > 0) str += `${numberToEnglishWords(lakh)} Lakh `;
  if (thousand > 0) str += `${numberToEnglishWords(thousand)} Thousand `;
  if (hundred > 0) str += `${a[hundred]} Hundred `;

  if (num > 0) {
    if (num < 20) {
      str += a[num] + " ";
    } else {
      str += b[Math.floor(num / 10)] + (num % 10 > 0 ? "-" + a[num % 10] : "") + " ";
    }
  }

  return str.trim();
}

/**
 * Safely evaluates simple math expressions (+, -, *, /, %, ^, parentheses).
 */
function safeMathEval(expr: string): number | null {
  const sanitized = expr.replace(/\^/g, "**").trim();
  if (!/^[\d\s+\-*/().%]+$/.test(sanitized)) return null;
  if (/[+\-*/]{3,}/.test(sanitized)) return null;

  try {
    const result = Function(`"use strict"; return (${sanitized});`)();
    if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Main parser entry point for Omnibar.
 */
export function evaluateOmnibarExpression(query: string): OmnibarInstantResult | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();

  // 1. Taka in Words trigger: e.g. "125000 tk", "tk 85500", "50000 taka", "টাকা ১০০০০"
  const takaMatch = q.match(/^(?:tk|taka|bdt|টাকা)\s*([\d,]+)$/) || q.match(/^([\d,]+)\s*(?:tk|taka|bdt|টাকা)$/);
  if (takaMatch) {
    const rawVal = parseInt(takaMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(rawVal) && rawVal > 0 && rawVal < 10000000000) {
      const banglaWords = `${numberToBanglaWords(rawVal)} টাকা মাত্র`;
      const englishWords = `${numberToEnglishWords(rawVal)} Taka Only`;
      return {
        type: "taka_words",
        title: `কথায় টাকা (Taka in Words): ৳${rawVal.toLocaleString()}`,
        value: banglaWords,
        secondary: englishWords,
        category: "Bangladesh Finance",
        copyText: `${banglaWords} (${englishWords})`,
      };
    }
  }

  // 2. USD Remittance Trigger: e.g. "$1000", "500 usd", "1000 usd to bdt", "$250 to bdt"
  const usdMatch = q.match(/^\$([\d,]+)(?:\s*(?:to\s*bdt)?)?$/) || q.match(/^([\d,]+)\s*usd(?:\s*to\s*bdt)?$/);
  if (usdMatch) {
    const usd = parseFloat(usdMatch[1].replace(/,/g, ""));
    if (!isNaN(usd) && usd > 0) {
      const exchangeRate = 122.5; // Benchmark rate
      const baseBdt = Math.round(usd * exchangeRate);
      const incentive = Math.round(baseBdt * 0.025); // 2.5% Govt Cash Incentive
      const totalBdt = baseBdt + incentive;
      return {
        type: "remittance",
        title: `Freelancer Remittance: $${usd.toLocaleString()} USD ➔ BDT`,
        value: `৳${totalBdt.toLocaleString()} BDT (Total with Incentive)`,
        secondary: `Base: ৳${baseBdt.toLocaleString()} (@ ৳122.50) + ৳${incentive.toLocaleString()} (2.5% Govt Incentive)`,
        category: "Freelance & Remittance",
        copyText: `৳${totalBdt.toLocaleString()} BDT ($${usd} USD @ 122.50 + 2.5% Govt Incentive)`,
      };
    }
  }

  // 3. BD Land Conversions: e.g. "10 decimal to katha", "5 katha to decimal", "2 bigha to decimal"
  const landDecimalMatch = q.match(/^([\d.]+)\s*decimal(?:\s*to)?\s*katha$/);
  if (landDecimalMatch) {
    const dec = parseFloat(landDecimalMatch[1]);
    const katha = (dec / 1.65).toFixed(3);
    const sqft = (dec * 435.6).toFixed(1);
    return {
      type: "land_gold",
      title: `Land Conversion: ${dec} Decimal (শতক)`,
      value: `${katha} Katha (কাঠা)`,
      secondary: `Equivalent to ${sqft} sq.ft (${(dec / 33).toFixed(3)} Bigha)`,
      category: "BD Land & Units",
      copyText: `${katha} Katha (${sqft} sq.ft)`,
    };
  }

  const landKathaMatch = q.match(/^([\d.]+)\s*katha(?:\s*to)?\s*decimal$/);
  if (landKathaMatch) {
    const katha = parseFloat(landKathaMatch[1]);
    const dec = (katha * 1.65).toFixed(3);
    const sqft = (katha * 720).toFixed(1);
    return {
      type: "land_gold",
      title: `Land Conversion: ${katha} Katha (কাঠা)`,
      value: `${dec} Decimal (শতক)`,
      secondary: `Equivalent to ${sqft} sq.ft (${(katha / 20).toFixed(3)} Bigha)`,
      category: "BD Land & Units",
      copyText: `${dec} Decimal (${sqft} sq.ft)`,
    };
  }

  // 4. Gold BAJUS Conversions: e.g. "2 vori to gram", "10 gram to vori"
  const goldVoriMatch = q.match(/^([\d.]+)\s*(?:vori|bhori|ভরি)(?:\s*to)?\s*gram$/);
  if (goldVoriMatch) {
    const vori = parseFloat(goldVoriMatch[1]);
    const gram = (vori * 11.664).toFixed(3);
    const ana = (vori * 16).toFixed(1);
    return {
      type: "land_gold",
      title: `Gold Conversion: ${vori} Vori (ভরি)`,
      value: `${gram} Grams (গ্রাম)`,
      secondary: `Equivalent to ${ana} Ana (আনা) / ${vori * 96} Ratti (রতি)`,
      category: "BAJUS Gold Units",
      copyText: `${gram} Grams`,
    };
  }

  const goldGramMatch = q.match(/^([\d.]+)\s*gram(?:\s*to)?\s*(?:vori|bhori|ভরি)$/);
  if (goldGramMatch) {
    const gram = parseFloat(goldGramMatch[1]);
    const vori = (gram / 11.664).toFixed(3);
    return {
      type: "land_gold",
      title: `Gold Conversion: ${gram} Grams (গ্রাম)`,
      value: `${vori} Vori (ভরি)`,
      secondary: `BAJUS Standard (1 Vori = 11.664g)`,
      category: "BAJUS Gold Units",
      copyText: `${vori} Vori`,
    };
  }

  // 4.1 Islamic Zakat Trigger: e.g. "zakat on 1000000 tk", "zakat 500000", "যাকাত"
  const zakatMatch = q.match(/^(?:zakat|jakat|যাকাত)(?:\s*on)?\s*([\d,]+)(?:\s*tk|\s*taka|\s*bdt)?$/) ||
                     q.match(/^([\d,]+)\s*(?:tk|\s*taka)?\s*(?:zakat|jakat|যাকাত)$/);
  if (zakatMatch) {
    const wealth = parseFloat(zakatMatch[1].replace(/,/g, ""));
    if (!isNaN(wealth) && wealth > 0) {
      const zakatPayable = Math.round(wealth * 0.025);
      return {
        type: "taka_words",
        title: `Islamic Zakat Calculation (2.5% of ৳${wealth.toLocaleString()})`,
        value: `৳${zakatPayable.toLocaleString()} BDT Total Zakat Payable`,
        secondary: `Nisab check: 52.5 Vori Silver or 7.5 Vori Gold. Open Family Zakat Studio for asset deduction.`,
        category: "Islamic Finance & Zakat",
        copyText: `৳${zakatPayable.toLocaleString()} BDT (2.5% Zakat on ৳${wealth.toLocaleString()})`,
      };
    }
  }

  // 4.2 Exact Age Calculation Trigger: e.g. "age from 1999-05-12", "age 1998-10-15"
  const ageMatch = q.match(/^age(?:\s*from)?\s*(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ageMatch) {
    const birthYear = parseInt(ageMatch[1], 10);
    const birthMonth = parseInt(ageMatch[2], 10) - 1;
    const birthDay = parseInt(ageMatch[3], 10);
    const birthDate = new Date(birthYear, birthMonth, birthDay);
    const now = new Date(2026, 10, 15); // Anchor: Nov 15, 2026

    if (!isNaN(birthDate.getTime()) && birthDate < now) {
      let years = now.getFullYear() - birthDate.getFullYear();
      let months = now.getMonth() - birthDate.getMonth();
      let days = now.getDate() - birthDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const govJobEligible = years < 32 || (years === 32 && months === 0 && days === 0);
      return {
        type: "math",
        title: `Exact Calendar Age: ${birthYear}-${String(birthMonth + 1).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`,
        value: `${years} Years, ${months} Months, ${days} Days`,
        secondary: `Govt Job Cutoff Status: ${govJobEligible ? "✅ Eligible (≤32 Years)" : "⚠️ Exceeded 32y General Cutoff"}. Open Age Studio.`,
        category: "Health & Career",
        copyText: `${years} Years, ${months} Months, ${days} Days`,
      };
    }
  }

  // 4.3 Sanchaypatra Profit Trigger: e.g. "sanchaypatra 1000000", "সঞ্চয়পত্র 500000"
  const sanchayMatch = q.match(/^(?:sanchaypatra|সঞ্চয়পত্র)\s*([\d,]+)$/);
  if (sanchayMatch) {
    const principal = parseFloat(sanchayMatch[1].replace(/,/g, ""));
    if (!isNaN(principal) && principal > 0) {
      // Benchmark ~11.52% gross -> 10% tax -> ~10.368% net -> ~৳864/month per Lakh
      const monthlyNet = Math.round((principal * 0.1152 * 0.9) / 12);
      return {
        type: "taka_words",
        title: `Family Sanchaypatra Profit: ৳${principal.toLocaleString()} Investment`,
        value: `~৳${monthlyNet.toLocaleString()} BDT Net Monthly Profit`,
        secondary: `Calculated after 10% source tax (TIN rate). Tier ≤15 Lakh. Open Sanchaypatra Studio.`,
        category: "Bangladesh Savings",
        copyText: `৳${monthlyNet.toLocaleString()} BDT monthly profit on ৳${principal.toLocaleString()} Sanchaypatra`,
      };
    }
  }

  // 4.4 Bank Loan EMI Trigger: e.g. "emi 1000000 9% 5y", "loan 500000 10% 3y", "emi 500000"
  const emiMatch = q.match(/^(?:emi|loan)\s*([\d,]+)(?:\s+([\d.]+)%?)?(?:\s+(\d+)y)?$/);
  if (emiMatch) {
    const principal = parseFloat(emiMatch[1].replace(/,/g, ""));
    const annualRate = emiMatch[2] ? parseFloat(emiMatch[2]) : 9; // default 9%
    const years = emiMatch[3] ? parseInt(emiMatch[3], 10) : 5; // default 5 years
    if (!isNaN(principal) && principal > 0) {
      const monthlyRate = annualRate / 12 / 100;
      const totalMonths = years * 12;
      const emi = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
      const totalPayment = emi * totalMonths;
      const totalInterest = totalPayment - principal;

      return {
        type: "taka_words",
        title: `Loan EMI: ৳${principal.toLocaleString()} @ ${annualRate}% for ${years} Years`,
        value: `৳${emi.toLocaleString()} BDT / Month`,
        secondary: `Total Interest: ৳${totalInterest.toLocaleString()} | Total Payable: ৳${totalPayment.toLocaleString()}`,
        category: "Bangladesh Finance & Loans",
        copyText: `৳${emi.toLocaleString()} BDT/month (Loan ৳${principal.toLocaleString()} @ ${annualRate}% for ${years}y)`,
      };
    }
  }

  // 5. Math calculation: e.g. "1450 * 1.15 - 120", "2500 / 4", "2^10", "15% of 8500"
  const percentMatch = q.match(/^([\d.]+)\s*%\s*of\s*([\d.]+)$/);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const ans = (pct / 100) * total;
    return {
      type: "math",
      title: `${pct}% of ${total}`,
      value: ans.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      secondary: `Formula: (${pct} / 100) * ${total}`,
      category: "Instant Calculator",
      copyText: ans.toString(),
    };
  }

  if (/^[\d\s+\-*/().^%]+$/.test(q) && /[+\-*/^%]/.test(q) && /\d/.test(q)) {
    const mathVal = safeMathEval(q);
    if (mathVal !== null) {
      return {
        type: "math",
        title: `Calculator Result: ${query.trim()}`,
        value: mathVal.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        secondary: "Press Enter or Click to copy result",
        category: "Instant Calculator",
        copyText: mathVal.toString(),
      };
    }
  }

  return null;
}
