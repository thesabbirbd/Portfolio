// @vitest-environment node
// v4.0.1 Phase 13: publishing rules checked against the real content and route tree —
// content frontmatter schema, honest dates, sitemap scope/lastmod, and per-page metadata.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import sitemap from "@/app/sitemap";
import { getAllContent } from "@/lib/content";
import { formatContentDate, isValidContentDate, lastModified, parseContentDate, rssDate } from "./content-date";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageMetadata, SITE_URL } from "./seo";

const ROOT = path.resolve(__dirname, "../..");
const CONTENT = path.join(ROOT, "content");
const SECTION: Record<string, string> = { notes: "/notes", journal: "/journal", projects: "/projects", lab: "/engineering-lab", articles: "/articles" };

const contentFiles = Object.keys(SECTION).flatMap((type) =>
  fs.readdirSync(path.join(CONTENT, type)).filter((f) => /\.mdx?$/.test(f)).map((f) => ({ type, file: path.join(CONTENT, type, f), slug: f.replace(/\.mdx?$/, "") })),
);

describe("content dates", () => {
  it("parses year, month and day precision, rejects malformed and impossible dates", () => {
    expect(parseContentDate("2025")?.precision).toBe("year");
    expect(parseContentDate("2025-03")?.precision).toBe("month");
    expect(parseContentDate("2025-03-14")?.precision).toBe("day");
    expect(parseContentDate("2026-09-07T10:00:00Z")?.precision).toBe("day");
    for (const bad of ["2024 - 2025-01-01", "2025-02-31", "2025-13", "Sep 2025", "", undefined]) expect(parseContentDate(bad)).toBeNull();
  });

  it("never displays more precision than the source has", () => {
    expect(formatContentDate("2025")).toBe("2025");
    expect(formatContentDate("2025-03")).toBe("Mar 2025");
    expect(formatContentDate("2026-09-07")).toBe("Sep 7, 2026"); // UTC: same on server and client
    expect(formatContentDate("2026-09-07", "long")).toBe("September 7, 2026");
    expect(formatContentDate("not a date")).toBe("");
  });

  it("RSS dates are valid or omitted, never 'Invalid Date'", () => {
    expect(rssDate("2026-09-07")).toBe("Mon, 07 Sep 2026 00:00:00 GMT");
    expect(rssDate("2024 - 2025-01-01")).toBeUndefined();
  });

  it("lastModified picks the later of updated/date and ignores invalid values", () => {
    expect(lastModified({ date: "2026-09-01", updated: "2026-09-20" })).toBe("2026-09-20");
    expect(lastModified({ date: "2026-09-01", updated: "soon" })).toBe("2026-09-01");
    expect(lastModified({ date: "" })).toBeUndefined();
  });
});

describe("content frontmatter schema", () => {
  it.each(contentFiles.map((c) => [`${c.type}/${c.slug}`, c] as const))("%s", (_name, { file, slug }) => {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    expect(typeof data.title === "string" && data.title.trim().length > 0).toBe(true);
    expect(typeof data.description === "string" && data.description.trim().length >= 40).toBe(true);
    // Quoted strings only: unquoted YAML dates become Date objects and lose their precision.
    expect(typeof data.date).toBe("string");
    expect(isValidContentDate(data.date)).toBe(true);
    for (const k of ["updated", "dateStarted", "dateCompleted"]) if (data[k] !== undefined) expect(isValidContentDate(data[k]), k).toBe(true);
    if (data.slug !== undefined) expect(data.slug).toBe(slug);
    expect(["published", "draft", undefined]).toContain(data.status);
    if (data.tags !== undefined) expect(Array.isArray(data.tags)).toBe(true);
    if (data.projectStatus !== undefined) expect(["idea", "prototype", "active", "experimental", "paused", "archived", "completed"]).toContain(data.projectStatus);
    for (const k of ["githubUrl", "demoUrl"]) if (data[k]) expect(String(data[k])).toMatch(/^https:\/\//);
    for (const entry of data.changelog ?? []) expect(isValidContentDate(entry.date), "changelog date").toBe(true);
    // No dates in the future relative to the newest content (guards typos like 2062).
    expect(parseContentDate(data.date)!.time).toBeLessThan(Date.UTC(2030, 0, 1));
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("lists only absolute canonical URLs on the production origin, once each", () => {
    for (const u of urls) expect(u.startsWith(SITE_URL)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((u) => /\/search|\/api\/|#|\?/.test(u))).toBe(false);
  });

  it("every static entry is a real route and every published content item is present", () => {
    for (const u of urls) {
      const p = u.slice(SITE_URL.length) || "/";
      const segs = p.split("/").filter(Boolean);
      const staticPage = path.join(ROOT, "src/app", ...segs, "page.tsx");
      const dynamicPage = path.join(ROOT, "src/app", ...segs.slice(0, -1), "[slug]", "page.tsx");
      expect(fs.existsSync(staticPage) || fs.existsSync(dynamicPage), p).toBe(true);
    }
    for (const type of Object.keys(SECTION) as ("notes" | "journal" | "projects" | "lab" | "articles")[]) {
      for (const item of getAllContent(type)) {
        const url = absoluteUrl(`${SECTION[type]}/${item.meta.slug}`);
        if (item.meta.demo) expect(urls).not.toContain(url); // demo placeholders stay out
        else expect(urls).toContain(url);
      }
    }
  });

  it("lastmod is either absent or a real content date (no fixed/build-time stamps)", () => {
    const contentDates = new Set(
      contentFiles.flatMap(({ file }) => {
        const { data } = matter(fs.readFileSync(file, "utf8"));
        return [data.date, data.updated].filter(Boolean).map(String);
      }),
    );
    for (const e of entries) if (e.lastModified !== undefined) expect(contentDates.has(String(e.lastModified)), e.url).toBe(true);
  });

  it("robots.txt points at this sitemap and blocks only non-content paths", async () => {
    const robots = (await import("@/app/robots")).default();
    expect(robots.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("page metadata", () => {
  it("pageMetadata gives each page its own canonical, share card and image", () => {
    const m = pageMetadata({ title: "Notes | THE SABBiR", description: "d", path: "/notes" });
    expect(m.alternates?.canonical).toBe(`${SITE_URL}/notes`);
    expect((m.openGraph as { url?: string })?.url).toBe(`${SITE_URL}/notes`);
    expect(JSON.stringify(m.openGraph)).toContain("the-sabbir-og-1200x630.jpg");
    expect(m.robots).toBeUndefined();
    expect(pageMetadata({ title: "t", description: "d", path: "/search", noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it("every route declares its own metadata via pageMetadata (no inherited home canonical)", () => {
    const pages: string[] = [];
    const walk = (d: string) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name === "page.tsx" && pages.push(path.join(d, e.name))));
    walk(path.join(ROOT, "src/app"));
    for (const p of pages) expect(fs.readFileSync(p, "utf8"), path.relative(ROOT, p)).toMatch(/pageMetadata\(/);
    expect(fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf8")).not.toMatch(/canonical:/);
  });

  it("breadcrumb JSON-LD is valid and safely serialised", () => {
    const ld = breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Notes", href: "/notes" }, { label: "A </script> note" }]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[1]).toMatchObject({ item: `${SITE_URL}/notes` });
    expect("item" in ld.itemListElement[2]).toBe(false);
    expect(jsonLdString(ld)).not.toContain("</script>");
  });
});
