/**
 * Bangladeshi Banking Number-to-Words & Cheque Reconciliation Engine
 * Converts numbers to exact Bangladesh standard (Crore / Lakh / Thousand / Hundred)
 * in both Bengali (বাংলা কথায়) and English (কথায়), with Paisa handling.
 */

const BANGLA_UNITS = [
  "", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ",
];

const BANGLA_TENS = [
  "", "", "বিশ", "ত্রিশ", "চল্লিশ", "পঞ্চাশ", "ষাট", "সত্তর", "আশি", "নব্বই",
];

// Exact Bengali words for 21 to 99
const BANGLA_20_TO_99: Record<number, string> = {
  20: "বিশ", 21: "একুশ", 22: "বাইশ", 23: "তেইশ", 24: "চব্বিশ", 25: "পঁচিশ",
  26: "ছাব্বিশ", 27: "সাতাশ", 28: "আঠাশ", 29: "উনত্রিশ",
  30: "ত্রিশ", 31: "একত্রিশ", 32: "বত্রিশ", 33: "তেত্রিশ", 34: "চৌত্রিশ", 35: "পঁয়ত্রিশ",
  36: "ছত্রিশ", 37: "সাঁইত্রিশ", 38: "আটত্রিশ", 39: "উনচল্লিশ",
  40: "চল্লিশ", 41: "একচল্লিশ", 42: "বিয়াল্লিশ", 43: "তেতাল্লিশ", 44: "চুয়াল্লিশ", 45: "পঁয়তাল্লিশ",
  46: "ছেচল্লিশ", 47: "সাতচল্লিশ", 48: "আটচল্লিশ", 49: "উনপঞ্চাশ",
  50: "পঞ্চাশ", 51: "একান্ন", 52: "বায়ান্ন", 53: "তিপ্পান্ন", 54: "চুয়ান্ন", 55: "পঞ্চান্ন",
  56: "ছাপ্পান্ন", 57: "সাতান্ন", 58: "আটান্ন", 59: "উনষাট",
  60: "ষাট", 61: "একষট্টি", 62: "বাষট্টি", 63: "তেষট্টি", 64: "চৌষট্টি", 65: "পঁয়ষট্টি",
  66: "ছেষট্টি", 67: "সাতষট্টি", 68: "আটষট্টি", 69: "উনসত্তর",
  70: "সত্তর", 71: "একাত্তর", 72: "বাহাত্তর", 73: "তিয়াত্তর", 74: "চুয়াত্তর", 75: "পঁচাত্তর",
  76: "ছিয়াত্তর", 77: "সাতাত্তর", 78: "আটাত্তর", 79: "উনাশি",
  80: "আশি", 81: "একাশি", 82: "বিরাশি", 83: "তিরাশি", 84: "চুরাশি", 85: "পঁচাশি",
  86: "ছিয়াশি", 87: "সাতাশি", 88: "অষ্টআশি", 89: "ঊননব্বই",
  90: "নব্বই", 91: "একানব্বই", 92: "বানব্বই", 93: "তিরানব্বই", 94: "চুরানব্বই", 95: "পঁচানব্বই",
  96: "ছিয়ানব্বই", 97: "সাতানব্বই", 98: "আটানব্বই", 99: "নিরানব্বই",
};

const ENGLISH_UNITS = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const ENGLISH_TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertBelowHundredBangla(n: number): string {
  if (n <= 0) return "";
  if (n < 20) return BANGLA_UNITS[n];
  return BANGLA_20_TO_99[n] || `${BANGLA_TENS[Math.floor(n / 10)]} ${BANGLA_UNITS[n % 10]}`.trim();
}

function convertBelowHundredEnglish(n: number): string {
  if (n <= 0) return "";
  if (n < 20) return ENGLISH_UNITS[n];
  const tens = ENGLISH_TENS[Math.floor(n / 10)];
  const units = ENGLISH_UNITS[n % 10];
  return units ? `${tens}-${units}` : tens;
}

export interface ChequeWordsResult {
  banglaWords: string;
  englishWords: string;
  amount: number;
  taka: number;
  paisa: number;
}

/**
 * Converts a numeric amount into standard Bangladeshi banking words in Bangla and English.
 */
export function convertTakaToWords(amount: number): ChequeWordsResult {
  if (isNaN(amount) || amount < 0) {
    return {
      banglaWords: "শূন্য টাকা মাত্র",
      englishWords: "Zero Taka Only",
      amount: 0,
      taka: 0,
      paisa: 0,
    };
  }

  const taka = Math.floor(amount);
  const paisa = Math.round((amount - taka) * 100);

  // Bengali Lakh-Crore Breakdown
  let bPart = "";
  let rem = taka;

  const crore = Math.floor(rem / 10000000);
  rem %= 10000000;
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  const hundred = Math.floor(rem / 100);
  rem %= 100;
  const rest = rem;

  if (crore > 0) bPart += `${convertBelowHundredBangla(crore)} কোটি `;
  if (lakh > 0) bPart += `${convertBelowHundredBangla(lakh)} লক্ষ `;
  if (thousand > 0) bPart += `${convertBelowHundredBangla(thousand)} হাজার `;
  if (hundred > 0) bPart += `${convertBelowHundredBangla(hundred)} শত `;
  if (rest > 0) bPart += `${convertBelowHundredBangla(rest)} `;

  bPart = bPart.trim() || "শূন্য";
  let banglaWords = `${bPart} টাকা`;
  if (paisa > 0) {
    banglaWords += ` ${convertBelowHundredBangla(paisa)} পয়সা`;
  }
  banglaWords += " মাত্র";

  // English Lakh-Crore Breakdown
  let ePart = "";
  if (crore > 0) ePart += `${convertBelowHundredEnglish(crore)} Crore `;
  if (lakh > 0) ePart += `${convertBelowHundredEnglish(lakh)} Lakh `;
  if (thousand > 0) ePart += `${convertBelowHundredEnglish(thousand)} Thousand `;
  if (hundred > 0) ePart += `${convertBelowHundredEnglish(hundred)} Hundred `;
  if (rest > 0) ePart += `${convertBelowHundredEnglish(rest)} `;

  ePart = ePart.trim() || "Zero";
  let englishWords = `${ePart} Taka`;
  if (paisa > 0) {
    englishWords += ` and ${convertBelowHundredEnglish(paisa)} Paisa`;
  }
  englishWords += " Only";

  return {
    banglaWords,
    englishWords,
    amount,
    taka,
    paisa,
  };
}

export function takaInBanglaWords(amount: number): string {
  return convertTakaToWords(amount).banglaWords;
}

export function takaInEnglishWords(amount: number): string {
  return convertTakaToWords(amount).englishWords;
}

export interface ChequeAuditValidation {
  valid: boolean;
  discrepancies: string[];
}

export function validateChequeDetails(
  amountNumber: number,
  wordsGiven: string,
  chequeDate: string
): ChequeAuditValidation {
  const discrepancies: string[] = [];
  const expectedBangla = takaInBanglaWords(amountNumber);
  const expectedEnglish = takaInEnglishWords(amountNumber);

  // Check 1: Date validity (stale cheque > 180 days or future date > 30 days)
  const dateDiffMs = Date.now() - new Date(chequeDate).getTime();
  const dateDiffDays = dateDiffMs / (1000 * 60 * 60 * 24);

  if (dateDiffDays > 180) {
    discrepancies.push("Stale Cheque: Issue date is older than 180 days (6 months). Banks will reject.");
  } else if (dateDiffDays < -30) {
    discrepancies.push("Post-Dated Cheque: Issue date is more than 30 days in the future.");
  }

  // Check 2: Word match (must match either Bangla or English representation)
  const cleanGiven = wordsGiven.trim().toLowerCase();
  const cleanBangla = expectedBangla.toLowerCase();
  const cleanEnglish = expectedEnglish.toLowerCase();

  if (
    !cleanBangla.includes(cleanGiven) &&
    !cleanGiven.includes(cleanBangla) &&
    !cleanEnglish.includes(cleanGiven)
  ) {
    discrepancies.push(
      `Figure-vs-Words Mismatch: ${amountNumber} ৳ requires "${expectedBangla}", but received "${wordsGiven}".`
    );
  }

  return {
    valid: discrepancies.length === 0,
    discrepancies,
  };
}
