import { describe, it, expect } from "vitest";
import {
  generateDeduplicationHash,
  extractSeoKeywords,
  generateBanglaSummary,
  generateCoverSvg,
  getOSBrainTelemetry,
} from "@/lib/autonomous/os-autonomous-engine";
import { HACKS_CATALOG } from "@/data/hacks-catalog";
import { computePopularScore, isNewlyDiscovered } from "@/lib/discovery/popular-new-engine";

describe("THE SABBiR OS Autonomous Brain Engine (Block 2)", () => {
  it("generates deterministic deduplication hash", () => {
    const hash1 = generateDeduplicationHash("Next.js 15 Release", "https://nextjs.org/blog/next-15");
    const hash2 = generateDeduplicationHash("next.js 15 release", "https://nextjs.org/blog/next-15");
    const hashDifferent = generateDeduplicationHash("Remotion 4.0", "https://remotion.dev");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashDifferent);
    expect(hash1.length).toBeGreaterThan(0);
  });

  it("extracts high-intent SEO keywords including brand tags", () => {
    const keywords = extractSeoKeywords(
      "Ollama Local LLM Fast Docker Guide",
      "Deploy deepseek-r1 locally using Docker on Linux servers with GPU acceleration."
    );

    expect(keywords).toContain("the sabbir");
    expect(keywords).toContain("sabbir.nav.bd");
    expect(keywords.length).toBeLessThanOrEqual(8);
  });

  it("synthesizes structured Bangla summary with brand prefix", () => {
    const summary = generateBanglaSummary("PostgreSQL 17 Vector Search", "High-performance vector embeddings query.");
    expect(summary).toContain("THE SABBiR OS অটোনোমাস ইঞ্জিন");
    expect(summary).toContain("PostgreSQL 17 Vector Search");
  });

  it("generates 1200x675 16:9 vector SVG banner", () => {
    const svg = generateCoverSvg("Everyday Digital Life Solutions", "PRODUCTIVITY");
    expect(svg).toContain('<svg width="1200" height="675"');
    expect(svg).toContain("PRODUCTIVITY");
    expect(svg).toContain("THE SABBiR OS");
    expect(svg).toContain("sabbir.nav.bd");
  });

  it("returns valid OS Brain Telemetry payload schema with 56 tools, 24 agents, 8 swarms, 40 hacks", () => {
    const telemetry = getOSBrainTelemetry();
    expect(telemetry.toolsCount).toBe(56);
    expect(telemetry.agentsCount).toBe(24);
    expect(telemetry.swarmsCount).toBe(8);
    expect(telemetry.hacksCount).toBe(40);
    expect(telemetry.totalIndexedRoutes).toBeGreaterThanOrEqual(160);
    expect(telemetry.status).toBe("live");
    expect(telemetry.topPopularSlugs.length).toBeGreaterThan(0);
    expect(telemetry.newlyDiscoveredSlugs.length).toBeGreaterThan(0);
  });

  it("verifies Hacks Catalog contains exactly 40 field-tested entries with complete fields", () => {
    expect(HACKS_CATALOG.length).toBe(40);
    for (const hack of HACKS_CATALOG) {
      expect(hack.id).toBeDefined();
      expect(hack.title).toBeTruthy();
      expect(hack.copySnippet).toBeTruthy();
      expect(hack.banglaSummary).toBeTruthy();
      expect(hack.tags.length).toBeGreaterThan(0);
      expect(hack.popularityScore).toBeGreaterThanOrEqual(70);
    }
  });

  it("verifies popularity and new classification integration", () => {
    const score = computePopularScore({ views: 500, runs: 120, shares: 45, isNew: true });
    expect(score).toBeGreaterThan(100);

    const isNew = isNewlyDiscovered("2026-11-15");
    expect(isNew).toBe(true);

    const isOld = isNewlyDiscovered("2025-01-01");
    expect(isOld).toBe(false);
  });
});
