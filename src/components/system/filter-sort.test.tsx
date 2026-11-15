import { describe, it, expect } from "vitest";
import { sortItems, type SortOption } from "@/lib/popularity-ranker";

interface TestItem {
  name: string;
  popularity: number;
  impact: number;
  date: string;
}

describe("Universal Popularity & Ranking Engine", () => {
  const items: TestItem[] = [
    { name: "Alpha", popularity: 50, impact: 90, date: "2026-01-01" },
    { name: "Zeta", popularity: 100, impact: 80, date: "2026-11-01" },
    { name: "Beta", popularity: 75, impact: 95, date: "2026-06-01" },
  ];

  it("sorts by 'popular' as default (highest popularity score first)", () => {
    const sorted = sortItems(items, "popular", {
      getPopularity: (i) => i.popularity,
    });
    expect(sorted.map((i) => i.name)).toEqual(["Zeta", "Beta", "Alpha"]);
  });

  it("sorts by 'newest' (latest date first)", () => {
    const sorted = sortItems(items, "newest", {
      getDate: (i) => i.date,
    });
    expect(sorted.map((i) => i.name)).toEqual(["Zeta", "Beta", "Alpha"]);
  });

  it("sorts by 'impact' (highest impact score first)", () => {
    const sorted = sortItems(items, "impact", {
      getImpact: (i) => i.impact,
    });
    expect(sorted.map((i) => i.name)).toEqual(["Beta", "Alpha", "Zeta"]);
  });

  it("sorts alphabetically A to Z", () => {
    const sorted = sortItems(items, "alphabetical", {
      getTitle: (i) => i.name,
    });
    expect(sorted.map((i) => i.name)).toEqual(["Alpha", "Beta", "Zeta"]);
  });
});
