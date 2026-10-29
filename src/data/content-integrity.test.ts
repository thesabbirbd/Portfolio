// @vitest-environment node
// Content-integrity rules from the v4.0.1 brief, checked against the real source tree:
// the Aiyaar title, brand/name rules, canonical social URLs and internal destinations.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { AIYAAR } from "./aiyaar";
import { CURRENT_ROLE, WORK_EXPERIENCE, EDUCATION, TRAINING } from "./experience";
import { SOCIAL_LINKS } from "./socials";
import { JOURNEY_STEPS } from "./journey";
import { PROJECTS_DATA, projectHref } from "./projects";

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_DIRS = ["src", "content"];

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.(tsx?|mdx)$/.test(d.name) && !/\.test\.tsx?$/.test(d.name) ? [p] : [];
  });
}
const files = SOURCE_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const read = (f: string) => fs.readFileSync(f, "utf8");

/** Real public routes: app directories with a page, plus content slugs for the dynamic ones. */
function knownRoutes() {
  const routes = new Set<string>(["/"]);
  const app = path.join(ROOT, "src/app");
  for (const f of walk(app)) {
    if (!f.endsWith("page.tsx") || f.includes("[")) continue;
    routes.add("/" + path.relative(app, path.dirname(f)).split(path.sep).join("/"));
  }
  const dynamic: Record<string, string> = { projects: "projects", notes: "notes", journal: "journal", lab: "engineering-lab" };
  for (const [dir, base] of Object.entries(dynamic)) {
    for (const f of fs.readdirSync(path.join(ROOT, "content", dir))) {
      const slug = /^slug:\s*["']?([^"'\n]+)/m.exec(read(path.join(ROOT, "content", dir, f)))?.[1];
      if (slug) routes.add(`/${base}/${slug.trim()}`);
    }
  }
  return routes;
}

describe("Aiyaar role", () => {
  it("is Chief Product Manager (CPM) everywhere", () => {
    expect(AIYAAR.role).toBe("Chief Product Manager (CPM)");
    expect(AIYAAR.roleTitle).toBe("Chief Product Manager");
    expect(CURRENT_ROLE.title).toBe(AIYAAR.role);
    const offenders = files.filter((f) => /Chief Project Manager/i.test(read(f)));
    expect(offenders).toEqual([]);
  });
});

describe("brand and name rules", () => {
  it("never combines the person and the brand in parentheses", () => {
    const pattern = /(Md Sabbirul Islam Khan\s*\(\s*THE SABBiR\s*\)|THE SABBiR\s*\(\s*Md Sabbirul)/;
    expect(files.filter((f) => pattern.test(read(f)))).toEqual([]);
  });

  it("never uses the short/incorrect variants in visible strings", () => {
    // "Sabbir"/"SABBIR" as a standalone word; URLs, paths, ids and storage keys are excluded.
    const bad = /(?<![\w./@:-])(Sabbir|SABBIR)(?![\w./-])/;
    const offenders = files.flatMap((f) =>
      read(f).split("\n").map((line, i) => [f, i + 1, line] as const).filter(([, , line]) => bad.test(line))
    ).map(([f, n]) => `${path.relative(ROOT, f)}:${n}`);
    expect(offenders).toEqual([]);
  });
});

describe("social links", () => {
  it("match the canonical profile URLs", () => {
    const byId = Object.fromEntries(SOCIAL_LINKS.map((l) => [l.id, l.url]));
    expect(byId.github).toBe("https://github.com/thesabbirbd");
    expect(byId.linkedin).toBe("https://www.linkedin.com/in/thesabbirbd/");
    expect(byId.facebook).toBe("https://facebook.com/iamthesabbir");
    expect(byId.instagram).toBe("https://www.instagram.com/iam_thesabbir");
    expect(byId.x).toBe("https://x.com/thesabbirbd");
  });
});

describe("internal destinations", () => {
  const routes = knownRoutes();
  const internal = (href: string) => href.startsWith("/") && !href.startsWith("//");
  const pathOf = (href: string) => href.split("#")[0].split("?")[0] || "/";

  it("journey evidence links point at real pages", () => {
    const hrefs = JOURNEY_STEPS.flatMap((s) => s.evidence.map((e) => e.href)).filter(internal);
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((h) => !routes.has(pathOf(h)))).toEqual([]);
  });

  it("work history links point at real pages", () => {
    const hrefs = WORK_EXPERIENCE.map((w) => w.url).filter((u): u is string => !!u && internal(u));
    expect(hrefs.filter((h) => !routes.has(pathOf(h)))).toEqual([]);
  });

  it("every project card resolves to a case study", () => {
    expect(PROJECTS_DATA.map(projectHref).filter((h) => !routes.has(h))).toEqual([]);
  });

  it("command menu, terminals and nav only navigate to real pages and anchors", () => {
    const sources = ["src/components/ui/CommandMenu.tsx", "src/components/ui/TerminalModal.tsx", "src/components/lab/TerminalCard.tsx", "src/components/navigation/MorphingNav.tsx", "src/components/hero/SpatialCore.tsx"]
      .map((f) => read(path.join(ROOT, f))).join("\n");
    const targets = [
      ...[...sources.matchAll(/router\.push\(['"]([^'"]+)['"]\)/g)].map((m) => m[1]),
      ...[...sources.matchAll(/goToSection\([^,]+,\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
      ...[...sources.matchAll(/href:\s*['"](\/[^'"]*)['"]/g)].map((m) => m[1]),
    ];
    expect(targets.length).toBeGreaterThan(10);
    expect(targets.filter((t) => !routes.has(pathOf(t)))).toEqual([]);
    // In-page anchors (/#about, /about#timeline, /experience#skills…) must exist as a literal id.
    const allSource = files.map(read).join("\n");
    const anchors = targets.filter((t) => t.includes("#")).map((t) => t.split("#")[1]);
    expect(anchors.length).toBeGreaterThan(0);
    expect(anchors.filter((id) => !allSource.includes(`id="${id}"`))).toEqual([]);
  });

  it("no source file links to an empty or placeholder href", () => {
    const offenders = files.filter((f) => /href=["'](#|javascript:[^"']*)?["']/.test(read(f)));
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });
});

describe("timeline chronology", () => {
  it("only shows years that are documented in the CV data", () => {
    const cvText = JSON.stringify([WORK_EXPERIENCE, EDUCATION, TRAINING]);
    const years = JOURNEY_STEPS.flatMap((s) => (s.period ?? "").match(/\b20\d\d\b/g) ?? []);
    expect(years.length).toBeGreaterThan(0);
    expect(years.filter((y) => !cvText.includes(y))).toEqual([]);
  });
});
