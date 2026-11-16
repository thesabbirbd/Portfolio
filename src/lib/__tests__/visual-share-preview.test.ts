import { describe, it, expect } from "vitest";
import { generateSvgDataUrl, extractHighlights } from "@/lib/share/visual-snapshot-generator";

describe("Visual Share Card Engine (Block 3 - Stages 021-030)", () => {
  it("generates a high-contrast 1200x630 SVG data URL with title and creator", () => {
    const dataUrl = generateSvgDataUrl({
      title: "Student Mess Meal Rate Hisab",
      toolSlug: "mess-bazar-splitter",
      creatorName: "Sabbir Khan",
      highlights: [
        { label: "Total Bazar", value: "৳ 12,450" },
        { label: "Total Meals", value: "312" },
        { label: "Meal Rate", value: "৳ 39.90" },
      ],
      accentColor: "#10B981",
    });

    expect(dataUrl).toBeDefined();
    expect(dataUrl.startsWith("data:image/svg+xml;base64,")).toBe(true);

    const base64Data = dataUrl.replace("data:image/svg+xml;base64,", "");
    const decodedSvg = Buffer.from(base64Data, "base64").toString("utf-8");

    expect(decodedSvg).toContain("1200");
    expect(decodedSvg).toContain("630");
    expect(decodedSvg).toContain("Student Mess Meal Rate Hisab");
    expect(decodedSvg).toContain("Sabbir Khan");
    expect(decodedSvg).toContain("MESS BAZAR SPLITTER");
    expect(decodedSvg).toContain("THE SABBiR OS");
    expect(decodedSvg).toContain("sabbir.nav.bd/s");
    expect(decodedSvg).toContain("39.90");
  });

  it("extracts highlights from structured studio JSON payloads cleanly", () => {
    const samplePayload = JSON.stringify({
      totalCost: 15500,
      itemCount: 42,
      status: "APPROVED",
      clientName: "Rahim Enterprise",
      unrelatedNested: { ignore: true },
    });

    const highlights = extractHighlights(samplePayload);
    expect(highlights.length).toBeGreaterThanOrEqual(2);
    expect(highlights.some((h) => h.value.includes("15,500") || h.value.includes("15500"))).toBe(true);
    expect(highlights.some((h) => h.label.toLowerCase().includes("cost") || h.label.toLowerCase().includes("item"))).toBe(true);
  });

  it("handles empty or invalid JSON payload gracefully in extractHighlights", () => {
    const emptyHighlights = extractHighlights("");
    expect(Array.isArray(emptyHighlights)).toBe(true);
    expect(emptyHighlights.length).toBe(0);

    const stringHighlights = extractHighlights("Plain text memo notes");
    expect(Array.isArray(stringHighlights)).toBe(true);
  });
});
