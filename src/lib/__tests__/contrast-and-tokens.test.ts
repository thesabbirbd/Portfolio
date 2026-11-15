import { describe, it, expect } from "vitest";
import { verifyAllThemes, contrastRatio } from "../../../scripts/qa/a11y-contrast-verify.mjs";

describe("WCAG AAA/AA Contrast & Semantic Tokens Matrix (Block 1)", () => {
  it("passes all mathematical contrast checks across 6 theme states", () => {
    const result = verifyAllThemes();
    expect(result.failures).toHaveLength(0);
    expect(result.passedChecks).toBe(result.totalChecks);
    expect(result.totalChecks).toBeGreaterThanOrEqual(78);
  });

  it("ensures ink on paper meets WCAG AAA (>= 7.0:1) in all modes", () => {
    // Orange Light
    const orangeLightRatio = contrastRatio([28, 24, 20], [250, 247, 241]);
    expect(orangeLightRatio).toBeGreaterThan(12.0);

    // Orange Dark
    const orangeDarkRatio = contrastRatio([245, 240, 232], [17, 14, 12]);
    expect(orangeDarkRatio).toBeGreaterThan(14.0);

    // Green Light
    const greenLightRatio = contrastRatio([20, 28, 23], [247, 246, 238]);
    expect(greenLightRatio).toBeGreaterThan(12.0);

    // Blue Dark
    const blueDarkRatio = contrastRatio([232, 238, 247], [8, 12, 20]);
    expect(blueDarkRatio).toBeGreaterThan(14.0);
  });
});
