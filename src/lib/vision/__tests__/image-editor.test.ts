import { describe, it, expect } from "vitest";
import {
  applyLutFilter,
  applyAdjustments,
  DEFAULT_ADJUSTMENTS,
  LUT_PRESETS,
} from "../image-editor-engine";
import {
  STORY_TEMPLATES,
  STORY_FORMATS,
  renderStoryToCanvas,
} from "../../design/story-templates";

describe("Image Editor Engine (image-editor-engine.ts)", () => {
  it("applies brightness and contrast adjustments to pixel buffers", () => {
    // 4 pixels RGBA
    const buffer = new Uint8ClampedArray([
      100, 100, 100, 255,
      50, 50, 50, 255,
      200, 200, 200, 255,
      0, 0, 0, 255,
    ]);

    applyAdjustments(buffer, {
      ...DEFAULT_ADJUSTMENTS,
      brightness: 20,
      contrast: 10,
    });

    // Pixels should be brighter
    expect(buffer[0]).toBeGreaterThan(100);
    expect(buffer[4]).toBeGreaterThan(50);
  });

  it("applies cinematic LUT filters without NaN or overflow", () => {
    const buffer = new Uint8ClampedArray([
      150, 120, 90, 255,
      80, 100, 140, 255,
    ]);

    applyLutFilter(buffer, "cinematic_teal");

    expect(Number.isNaN(buffer[0])).toBe(false);
    expect(buffer[0]).toBeGreaterThanOrEqual(0);
    expect(buffer[0]).toBeLessThanOrEqual(255);
  });

  it("verifies 12 LUT presets are defined with valid names", () => {
    expect(LUT_PRESETS.length).toBe(12);
    expect(LUT_PRESETS.some((p) => p.id === "dhaka_golden_hour")).toBe(true);
  });
});

describe("Story Templates Engine (story-templates.ts)", () => {
  it("defines standard social aspect ratios (9:16, 4:5, 1:1, 16:9)", () => {
    expect(STORY_FORMATS.story.width).toBe(1080);
    expect(STORY_FORMATS.story.height).toBe(1920);
    expect(STORY_FORMATS.portrait.height).toBe(1350);
    expect(STORY_FORMATS.square.height).toBe(1080);
    expect(STORY_FORMATS.landscape.width).toBe(1920);
  });

  it("contains curated templates with gradients and badges", () => {
    expect(STORY_TEMPLATES.length).toBeGreaterThanOrEqual(8);
    const techTmpl = STORY_TEMPLATES.find((t) => t.category === "tech");
    expect(techTmpl).toBeDefined();
    expect(techTmpl?.bgGradient.length).toBeGreaterThanOrEqual(2);
  });
});
