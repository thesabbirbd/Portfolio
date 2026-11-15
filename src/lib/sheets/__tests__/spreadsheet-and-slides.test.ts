import { describe, it, expect } from "vitest";
import {
  evaluateCell,
  computeEntireGrid,
  exportGridToCsv,
  SPREADSHEET_TEMPLATES,
  expandRange,
} from "../formula-grid-engine";
import { parseMarkdownToSlides, DECK_THEMES } from "../../slides/slide-deck-engine";

describe("Spreadsheet & Formula Grid Engine (formula-grid-engine.ts)", () => {
  it("evaluates =SUM() across cell ranges", () => {
    const grid = {
      A1: "100",
      A2: "200",
      A3: "300",
      A4: "=SUM(A1:A3)",
    };

    const result = evaluateCell("A4", grid);
    expect(result).toBe(600);
  });

  it("evaluates =AVERAGE() accurately", () => {
    const grid = {
      B1: "10",
      B2: "20",
      B3: "30",
      B4: "=AVERAGE(B1:B3)",
    };

    const result = evaluateCell("B4", grid);
    expect(result).toBe(20);
  });

  it("evaluates conditional =IF() statements", () => {
    const grid = {
      B2: "150",
      C2: '=IF(B2>100, "VIP", "Regular")',
      B3: "50",
      C3: '=IF(B3>100, "VIP", "Regular")',
    };

    expect(evaluateCell("C2", grid)).toBe("VIP");
    expect(evaluateCell("C3", grid)).toBe("Regular");
  });

  it("detects circular references and returns #CIRCULAR! without crashing", () => {
    const grid = {
      A1: "=B1",
      B1: "=A1",
    };

    const result = evaluateCell("A1", grid);
    expect(result).toBe("#CIRCULAR!");
  });

  it("expands 2D ranges correctly (A1:B2)", () => {
    const range = expandRange("A1:B2");
    expect(range).toEqual(["A1", "B1", "A2", "B2"]);
  });

  it("verifies Bangladeshi templates are defined", () => {
    expect(SPREADSHEET_TEMPLATES.length).toBeGreaterThanOrEqual(5);
    const dokan = SPREADSHEET_TEMPLATES.find((t) => t.id === "dokan_cash_baki");
    expect(dokan).toBeDefined();
  });
});

describe("Slide Deck Engine (slide-deck-engine.ts)", () => {
  it("parses Markdown outlines into structured presentation slides", () => {
    const md = `# Slide One Title
--tag: Introduction
This is subtitle text.

---
# Architecture Core
--tag: Technical Specs
* Point 1: Next.js 15
* Point 2: Drizzle ORM
* Point 3: WebAudio DAW`;

    const slides = parseMarkdownToSlides(md);
    expect(slides.length).toBe(2);
    expect(slides[0].title).toBe("Slide One Title");
    expect(slides[0].tag).toBe("Introduction");
    expect(slides[0].subtitle).toBe("This is subtitle text.");

    expect(slides[1].title).toBe("Architecture Core");
    expect(slides[1].bullets?.length).toBe(3);
  });

  it("defines deck themes (Royal Orange, Cyber Dark, Paper Editorial)", () => {
    expect(DECK_THEMES.royal_orange.accent).toBe("#F59E0B");
    expect(DECK_THEMES.cyber_dark.accent).toBe("#06B6D4");
    expect(DECK_THEMES.paper_editorial.accent).toBe("#D97706");
  });
});
