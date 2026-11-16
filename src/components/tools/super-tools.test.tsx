import { describe, it, expect } from "vitest";
import { SUPER_TOOLS_CATALOG } from "@/components/discover/Tools";

describe("Everyday & Business Super-Tools Suite", () => {
  it("contains catalogued super-tools (expanded to 56 dedicated studios in v5.2.15)", () => {
    expect(SUPER_TOOLS_CATALOG.length).toBe(56);
  });

  it("ensures every tool has valid route, popularity score and agent reference", () => {
    for (const tool of SUPER_TOOLS_CATALOG) {
      expect(tool.id).toBeDefined();
      expect(tool.slug).toBeDefined();
      expect(tool.href).toMatch(/^\/tools\//);
      expect(tool.popularityScore).toBeGreaterThanOrEqual(90);
      expect(tool.agentName).toBeDefined();
      expect(tool.category).toBeDefined();
    }
  });

  it("guarantees top tools have higher popularity scores", () => {
    const bgRemover = SUPER_TOOLS_CATALOG.find((t) => t.slug === "bg-remover");
    const khataScanner = SUPER_TOOLS_CATALOG.find((t) => t.slug === "khata-scanner");
    const invoiceMaker = SUPER_TOOLS_CATALOG.find((t) => t.slug === "invoice-maker");
    const govPhotoSizer = SUPER_TOOLS_CATALOG.find((t) => t.slug === "gov-photo-sizer");

    expect(bgRemover?.popularityScore).toBe(99);
    expect(khataScanner?.popularityScore).toBe(98);
    expect(invoiceMaker?.popularityScore).toBe(98);
    expect(govPhotoSizer?.popularityScore).toBe(99);
  });
});
