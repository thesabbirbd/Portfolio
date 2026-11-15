import { describe, it, expect } from "vitest";
import {
  CR80_DIMENSIONS,
  A4_DIMENSIONS,
  calculateA4CardCoordinates,
  WATERMARK_PRESETS,
} from "@/lib/documents/id-card-stitcher-engine";

describe("NID & Dual-Side ID Card Smart Stitcher Engine (Block 3)", () => {
  it("enforces authentic CR80 ISO/IEC 7810 aspect ratio (~1.586)", () => {
    expect(CR80_DIMENSIONS.aspectRatio).toBeCloseTo(1.5858, 2);
    expect(CR80_DIMENSIONS.widthMm).toBe(85.6);
    expect(CR80_DIMENSIONS.heightMm).toBe(53.98);
  });

  it("calculates exact Side-by-Side card placement on A4 sheet", () => {
    const a4Width = 1240;
    const a4Height = 1754;
    const coords = calculateA4CardCoordinates(a4Width, a4Height, "side-by-side");

    expect(coords.front.width).toBeGreaterThan(400);
    expect(coords.front.height).toBeGreaterThan(250);
    expect(coords.back.width).toBe(coords.front.width);
    expect(coords.back.x).toBeGreaterThan(coords.front.x + coords.front.width);
    expect(coords.front.y).toBe(coords.back.y);
  });

  it("calculates exact Top-to-Bottom card placement on A4 sheet", () => {
    const a4Width = 1240;
    const a4Height = 1754;
    const coords = calculateA4CardCoordinates(a4Width, a4Height, "top-to-bottom");

    expect(coords.front.x).toBe(coords.back.x);
    expect(coords.back.y).toBeGreaterThan(coords.front.y + coords.front.height);
  });

  it("provides comprehensive anti-misuse watermark presets", () => {
    expect(WATERMARK_PRESETS.length).toBeGreaterThanOrEqual(5);
    const bankPreset = WATERMARK_PRESETS.find((p) => p.id === "bank");
    expect(bankPreset).toBeDefined();
    expect(bankPreset?.text).toContain("ব্যাংক একাউন্ট");
  });
});
