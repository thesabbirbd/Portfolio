/**
 * EAN-13 / GTIN-13 Retail Barcode Encoder (Zero External Dependencies)
 * Implements GS1 EAN-13 specification with L/G/R parity encoding,
 * check digit calculation, and guard patterns.
 */

// L-code patterns (odd parity, left side)
const L_PATTERNS = [
  "0001101", "0011001", "0010011", "0111101", "0100011",
  "0110001", "0101111", "0111011", "0110111", "0001011",
];

// G-code patterns (even parity, left side)
const G_PATTERNS = [
  "0100111", "0110011", "0011011", "0100001", "0011101",
  "0111001", "0000101", "0010001", "0001001", "0010111",
];

// R-code patterns (all right side)
const R_PATTERNS = [
  "1110010", "1100110", "1101100", "1000010", "1011100",
  "1001110", "1010000", "1000100", "1001000", "1110100",
];

// First digit parity selector for digits 2 to 7 (L = true, G = false)
const FIRST_DIGIT_PARITIES = [
  [true, true, true, true, true, true],       // 0: LLLLLL
  [true, true, false, true, false, false],    // 1: LLGLGG
  [true, true, false, false, true, false],    // 2: LLGGLG
  [true, true, false, false, false, true],    // 3: LLGGGL
  [true, false, true, true, false, false],    // 4: LGLLGG
  [true, false, false, true, true, false],    // 5: LGGLLG
  [true, false, false, false, true, true],    // 6: LGGGLL
  [true, false, true, false, true, false],    // 7: LGLGLG
  [true, false, true, false, false, true],    // 8: LGLGGL
  [true, false, false, true, false, true],    // 9: LGGLGL
];

const LEFT_GUARD = "101";
const CENTER_GUARD = "01010";
const RIGHT_GUARD = "101";

/**
 * Calculates GS1 Modulo-10 Check Digit for a 12-digit string.
 */
export function calculateEan13CheckDigit(digits12: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits12[i], 10) || 0;
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  return (10 - (sum % 10)) % 10;
}

export interface EncodedEan13 {
  valid: boolean;
  full13Digits: string;
  bitString: string;
  modules: boolean[];
}

/**
 * Encodes a 12 or 13 digit number string into an EAN-13 barcode bit sequence.
 */
export function encodeEan13(input: string): EncodedEan13 {
  const digitsOnly = input.replace(/\D/g, "");
  let digits12 = digitsOnly.slice(0, 12);
  while (digits12.length < 12) {
    digits12 = digits12.padEnd(12, "0");
  }

  const checkDigit = calculateEan13CheckDigit(digits12);
  const full13Digits = digits12 + String(checkDigit);

  const firstDigit = parseInt(full13Digits[0], 10);
  const parities = FIRST_DIGIT_PARITIES[firstDigit];

  let bits = "0000000"; // 7-module left quiet zone
  bits += LEFT_GUARD;

  // Digits 2 to 7 (Left 6 digits)
  for (let i = 1; i <= 6; i++) {
    const d = parseInt(full13Digits[i], 10);
    const useL = parities[i - 1];
    bits += useL ? L_PATTERNS[d] : G_PATTERNS[d];
  }

  bits += CENTER_GUARD;

  // Digits 8 to 13 (Right 6 digits)
  for (let i = 7; i <= 12; i++) {
    const d = parseInt(full13Digits[i], 10);
    bits += R_PATTERNS[d];
  }

  bits += RIGHT_GUARD;
  bits += "0000000"; // 7-module right quiet zone

  const modules = bits.split("").map((b) => b === "1");

  return {
    valid: true,
    full13Digits,
    bitString: bits,
    modules,
  };
}
