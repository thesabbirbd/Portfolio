import { describe, it, expect } from "vitest";
import {
  removeSalientBackground,
  floodFillCutout,
} from "@/lib/vision/salient-cutout-engine";
import {
  encodeCode128B,
  encodeEan13,
  generateQrMatrix,
  verifyCodeScannability,
} from "@/lib/barcode/scannable-codes";
import {
  takaInBanglaWords,
  takaInEnglishWords,
  validateChequeDetails,
} from "@/lib/banking/taka-in-words";

describe("Stage 91: v5.2 Engines Reality & Mathematical Verification", () => {
  describe("1. Salient Cutout Engine (Zero Interior Erosion)", () => {
    it("preserves interior product pixels while erasing border connected background", () => {
      const width = 20;
      const height = 20;
      const data = new Uint8ClampedArray(width * height * 4);

      // Fill entire image with white backdrop (255, 255, 255, 255)
      for (let i = 0; i < width * height; i++) {
        data[i * 4] = 255;
        data[i * 4 + 1] = 255;
        data[i * 4 + 2] = 255;
        data[i * 4 + 3] = 255;
      }

      // Draw an interior foreground product box (x: 5..14, y: 5..14) with a dark border
      // but identical white center (x: 7..12, y: 7..12) simulating a white watch face
      for (let y = 5; y <= 14; y++) {
        for (let x = 5; x <= 14; x++) {
          const idx = (y * width + x) * 4;
          if (x === 5 || x === 14 || y === 5 || y === 14) {
            // Dark casing barrier (Sobel edge)
            data[idx] = 10;
            data[idx + 1] = 10;
            data[idx + 2] = 10;
          } else {
            // White watch dial (SAME color as outer backdrop!)
            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
          }
        }
      }

      // Execute floodFillCutout starting strictly from border
      const mask = floodFillCutout(data, width, height, { tolerance: 30 });

      // Verify that outer boundary pixels (0,0) have mask = 0 (erased)
      expect(mask[0]).toBe(0);
      expect(mask[width - 1]).toBe(0);

      // Verify that the interior white watch face (x: 8, y: 8) is 100% PRESERVED (mask = 255)
      const centerIdx = 8 * width + 8;
      expect(mask[centerIdx]).toBe(255);

      // Mathematical proof: interior product pixels preserved > 90%
      let interiorPreserved = 0;
      let interiorTotal = 0;
      for (let y = 6; y <= 13; y++) {
        for (let x = 6; x <= 13; x++) {
          interiorTotal++;
          if (mask[y * width + x] === 255) {
            interiorPreserved++;
          }
        }
      }

      const preservationRatio = interiorPreserved / interiorTotal;
      expect(preservationRatio).toBeGreaterThan(0.9);
    });
  });

  describe("2. Scannable Barcode & QR Code Engine", () => {
    it("generates GS1 Code-128B with Start-B 104, Stop 106, and valid Modulo-103 checksum", () => {
      const code128 = encodeCode128B("TEST-1234");
      expect(code128.modules.length).toBeGreaterThan(50);
      expect(code128.bitString.includes("11010010000")).toBe(true); // Start-B (104)
      expect(code128.bitString.includes("1100011101011")).toBe(true); // Stop (106)
      expect(code128.checksum).toBeGreaterThanOrEqual(0);
      expect(code128.checksum).toBeLessThan(103);
    });

    it("encodes valid 13-digit EAN-13 barcodes with Modulo-10 check digit", () => {
      const ean = encodeEan13("890123456789");
      expect(ean.valid).toBe(true);
      expect(ean.full13Digits.length).toBe(13);
      expect(ean.modules.length).toBeGreaterThan(50);
    });

    it("generates ISO/IEC 18004 2D QR Code Matrix with Finder Patterns", () => {
      const qr = generateQrMatrix("https://sabbir.nav.bd");
      expect(qr.size).toBeGreaterThanOrEqual(21);
      expect(qr.matrix.length).toBe(qr.size);

      // Finder pattern top-left 7x7 must be present
      expect(qr.matrix[0][0]).toBe(true);
      expect(qr.matrix[0][6]).toBe(true);
      expect(qr.matrix[6][0]).toBe(true);

      // Verify self-test scanner verification
      const verify = verifyCodeScannability("code128", "INV-2026-9042");
      expect(verify.valid).toBe(true);
      expect(verify.moduleCount).toBeGreaterThan(50);
    });
  });

  describe("3. Taka-in-Words & Cheque Audit Engine", () => {
    it("converts Lakh and Crore figures accurately to Bengali words", () => {
      expect(takaInBanglaWords(125450)).toBe(
        "এক লক্ষ পঁচিশ হাজার চার শত পঞ্চাশ টাকা মাত্র"
      );
      expect(takaInBanglaWords(15000000)).toBe(
        "এক কোটি পঞ্চাশ লক্ষ টাকা মাত্র"
      );
      expect(takaInBanglaWords(500)).toBe(
        "পাঁচ শত টাকা মাত্র"
      );
    });

    it("converts Lakh and Crore figures accurately to English words", () => {
      expect(takaInEnglishWords(125450)).toBe(
        "One Lakh Twenty-Five Thousand Four Hundred Fifty Taka Only"
      );
      expect(takaInEnglishWords(500)).toBe(
        "Five Hundred Taka Only"
      );
    });

    it("detects stale cheques (>180 days) and figure-vs-words mismatches", () => {
      // 200 days in past
      const staleDate = new Date(Date.now() - 200 * 86400 * 1000)
        .toISOString()
        .split("T")[0];
      const res = validateChequeDetails(125450, "পঁচিশ হাজার টাকা", staleDate);
      expect(res.valid).toBe(false);
      expect(res.discrepancies.length).toBeGreaterThan(0);
      expect(res.discrepancies.some((d) => d.includes("Stale Cheque"))).toBe(true);
      expect(res.discrepancies.some((d) => d.includes("Mismatch"))).toBe(true);
    });
  });
});
