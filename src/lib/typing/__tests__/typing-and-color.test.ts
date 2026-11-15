import { describe, it, expect } from "vitest";
import { calculateTypingMetrics, TYPING_PASSAGES } from "../typing-arena-engine";
import {
  calculateContrastRatio,
  getRelativeLuminance,
  generateTailwindScale,
  evaluateWcagCompliance,
} from "@/lib/design/color-lab-engine";

describe("Typing Speed Arena & Color Lab Engine (v5.2.12)", () => {
  it("calculates WPM and character accuracy correctly", () => {
    const target = "The quick brown fox jumps over the lazy dog";
    // Exact match in 30 seconds (43 characters = ~8.6 words in 0.5 min = ~17 Gross WPM)
    const metrics = calculateTypingMetrics(target, target, 30);
    expect(metrics.grossWpm).toBeGreaterThan(15);
    expect(metrics.accuracyPercent).toBe(100);
    expect(metrics.errorKeystrokes).toBe(0);

    // Test with errors
    const withErrors = "The quick brown fox jumps over the lazy cat";
    const metricsErr = calculateTypingMetrics(withErrors, target, 30);
    expect(metricsErr.accuracyPercent).toBeLessThan(100);
    expect(metricsErr.errorKeystrokes).toBeGreaterThan(0);
  });

  it("contains 4 curated typing tracks including Bangla Unicode", () => {
    expect(TYPING_PASSAGES.length).toBeGreaterThanOrEqual(8);
    const bangla = TYPING_PASSAGES.find((p) => p.track === "bangla");
    expect(bangla).toBeDefined();
    expect(bangla?.text).toContain("সংবিধান");
  });

  it("calculates WCAG 2.1 contrast ratios accurately (#000000 vs #FFFFFF = 21:1)", () => {
    const contrast = calculateContrastRatio("#000000", "#FFFFFF");
    expect(contrast).toBe(21);

    const compliance = evaluateWcagCompliance(contrast);
    expect(compliance.aaNormal).toBe(true);
    expect(compliance.aaaNormal).toBe(true);

    // Same color has 1:1 contrast
    const sameContrast = calculateContrastRatio("#FFFFFF", "#FFFFFF");
    expect(sameContrast).toBe(1);
    expect(evaluateWcagCompliance(sameContrast).aaNormal).toBe(false);
  });

  it("generates 11 Tailwind v4 shade stops from 50 to 950", () => {
    const scale = generateTailwindScale("#F59E0B");
    expect(scale.length).toBe(11);
    expect(scale[0].stop).toBe(50);
    expect(scale[scale.length - 1].stop).toBe(950);
    expect(scale.find((s) => s.stop === 500)?.hex).toBe("#F59E0B");
  });
});
