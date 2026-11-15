import { describe, it, expect } from "vitest";
import {
  CORE_BRAND_KEYWORDS,
  CATEGORY_KEYWORDS,
  ALL_KEYWORDS,
  generatePageKeywords,
  getCanonicalUrl,
} from "./seo-keywords";

describe("SEO Keywords Infrastructure", () => {
  it("should contain core brand keywords including THE SABBiR", () => {
    expect(CORE_BRAND_KEYWORDS).toContain("THE SABBiR");
    expect(CORE_BRAND_KEYWORDS).toContain("Md Sabbirul Islam Khan");
  });

  it("should generate category-specific keywords combined with custom tags", () => {
    const keywords = generatePageKeywords("database", ["acid", "transactions"]);
    expect(keywords).toContain("THE SABBiR");
    expect(keywords).toContain("postgresql b tree index");
    expect(keywords).toContain("acid");
    expect(keywords).toContain("transactions");
  });

  it("should format absolute canonical URLs with https domain", () => {
    expect(getCanonicalUrl("/open-source")).toBe("https://sabbir.nav.bd/open-source");
    expect(getCanonicalUrl("news/postgres-17")).toBe("https://sabbir.nav.bd/news/postgres-17");
  });
});
