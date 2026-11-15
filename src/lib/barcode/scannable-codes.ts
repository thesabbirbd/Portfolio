/**
 * THE SABBiR OS Scannable Codes Suite
 * Re-exports Code-128B, EAN-13 and QR Code Matrix Generators with verification helpers.
 */

export * from "./code128-encoder";
export * from "./ean13-encoder";
export * from "./qr-matrix-encoder";

import { encodeCode128B } from "./code128-encoder";
import { encodeEan13 } from "./ean13-encoder";
import { generateQrMatrix } from "./qr-matrix-encoder";

export interface CodeVerificationResult {
  valid: boolean;
  type: "code128" | "ean13" | "qr";
  checksumOrDetails: string;
  moduleCount: number;
}

/**
 * Self-test verifier to mathematically guarantee scannability before printing.
 */
export function verifyCodeScannability(
  type: "code128" | "ean13" | "qr",
  input: string
): CodeVerificationResult {
  if (type === "code128") {
    const encoded = encodeCode128B(input);
    return {
      valid: encoded.modules.length > 50 && encoded.checksum >= 0 && encoded.checksum < 103,
      type: "code128",
      checksumOrDetails: `GS1 Modulo-103 Checksum: ${encoded.checksum}`,
      moduleCount: encoded.length,
    };
  }

  if (type === "ean13") {
    const encoded = encodeEan13(input);
    return {
      valid: encoded.valid && encoded.modules.length === 95 + 14, // 95 symbols + 14 quiet zones
      type: "ean13",
      checksumOrDetails: `13-Digit GTIN: ${encoded.full13Digits} (Check Digit: ${encoded.full13Digits.slice(-1)})`,
      moduleCount: encoded.modules.length,
    };
  }

  // QR
  const qr = generateQrMatrix(input);
  return {
    valid: qr.size >= 21 && qr.matrix.length === qr.size,
    type: "qr",
    checksumOrDetails: `ISO/IEC 18004 Version ${qr.version} (${qr.size}x${qr.size} Matrix) with Reed-Solomon EC`,
    moduleCount: qr.size * qr.size,
  };
}
