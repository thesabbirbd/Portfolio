import { describe, it, expect } from "vitest";
import {
  computePopularScore,
  isNewlyDiscovered,
  filterByLifePersona,
  sortPopularOrNew,
  DiscoveryMetadata,
  LIFE_PERSONAS,
} from "../discovery/popular-new-engine";

interface TestItem extends DiscoveryMetadata {
  id: string;
  name: string;
}

describe("Popular & New Dual-Primary Sorting Engine (v5.2.13)", () => {
  const refTime = new Date("2026-11-15T00:00:00Z").getTime();

  it("computes popularity scores deterministically with runs, shares, views, and decay", () => {
    const itemA: TestItem = {
      id: "a",
      name: "Popular Tool",
      popularityScore: 90,
      toolRuns: 50,
      shares: 20,
      views: 300,
      addedAt: "2026-11-10T00:00:00Z",
    };

    const itemB: TestItem = {
      id: "b",
      name: "Average Tool",
      popularityScore: 70,
      toolRuns: 5,
      shares: 1,
      views: 50,
      addedAt: "2026-05-01T00:00:00Z", // Older, should decay
    };

    const scoreA = computePopularScore(itemA, refTime);
    const scoreB = computePopularScore(itemB, refTime);

    expect(scoreA).toBeGreaterThan(scoreB);
    expect(scoreA).toBeGreaterThan(150);
  });

  it("detects newly discovered items accurately based on flags and addedAt", () => {
    const recentItem: TestItem = {
      id: "recent",
      name: "Recent Addition",
      addedAt: "2026-11-05T00:00:00Z",
    };

    const flaggedNew: TestItem = {
      id: "flagged",
      name: "Flagged New",
      isNew: true,
    };

    const autoCurated: TestItem = {
      id: "auto",
      name: "Auto Discovered",
      autoDiscovered: true,
    };

    const oldItem: TestItem = {
      id: "old",
      name: "Old Tool",
      addedAt: "2026-08-01T00:00:00Z",
    };

    expect(isNewlyDiscovered(recentItem, 30, refTime)).toBe(true);
    expect(isNewlyDiscovered(flaggedNew, 30, refTime)).toBe(true);
    expect(isNewlyDiscovered(autoCurated, 30, refTime)).toBe(true);
    expect(isNewlyDiscovered(oldItem, 30, refTime)).toBe(false);
  });

  it("filters items by life persona cleanly", () => {
    const items: TestItem[] = [
      { id: "1", name: "Zakat Calc", lifePersona: "everyday" },
      { id: "2", name: "CGPA Calc", lifePersona: "student" },
      { id: "3", name: "Invoice Maker", lifePersona: "business" },
      { id: "4", name: "Multi-Role", lifePersona: ["everyday", "student"] },
    ];

    expect(filterByLifePersona(items, "all")).toHaveLength(4);
    expect(filterByLifePersona(items, "everyday")).toHaveLength(2);
    expect(filterByLifePersona(items, "student")).toHaveLength(2);
    expect(filterByLifePersona(items, "business")).toHaveLength(1);
    expect(filterByLifePersona(items, "developer")).toHaveLength(0);
  });

  it("sorts by Popular vs New modes reliably", () => {
    const items: TestItem[] = [
      {
        id: "classic-popular",
        name: "Classic High Runs",
        popularityScore: 98,
        toolRuns: 100,
        addedAt: "2026-06-01T00:00:00Z",
      },
      {
        id: "brand-new",
        name: "Brand New Studio",
        popularityScore: 80,
        isNew: true,
        addedAt: "2026-11-14T00:00:00Z",
      },
      {
        id: "moderate-tool",
        name: "Moderate Tool",
        popularityScore: 60,
        addedAt: "2026-09-01T00:00:00Z",
      },
    ];

    // Popular sort: highest popularity score / runs wins
    const popularSorted = sortPopularOrNew(items, "popular", refTime);
    expect(popularSorted[0].id).toBe("classic-popular");

    // New sort: newly added item wins
    const newSorted = sortPopularOrNew(items, "new", refTime);
    expect(newSorted[0].id).toBe("brand-new");
  });

  it("verifies all 6 life persona definitions exist", () => {
    expect(LIFE_PERSONAS).toHaveLength(6);
    const ids = LIFE_PERSONAS.map((p) => p.id);
    expect(ids).toContain("all");
    expect(ids).toContain("everyday");
    expect(ids).toContain("student");
    expect(ids).toContain("business");
    expect(ids).toContain("freelance");
    expect(ids).toContain("developer");
  });
});
