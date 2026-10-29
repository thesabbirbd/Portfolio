// Link & interaction inventory from the rendered (hydrated) DOM of every public page.
// Writes a markdown inventory and exits non-zero when it finds problems:
//  - empty / "#" / javascript: hrefs, nested anchors, target=_blank without rel=noopener
//  - internal links that do not return 200, or point at a missing #anchor
//  - form buttons without an explicit type (accidental submit)
// It also lists inbound link counts per route (orphan check), every external destination, and
// "Aiyaar" mentions that are not inside a link (for review).
// Usage: BASE=http://localhost:3100 node scripts/qa/link-inventory.mjs [out.md]
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = process.argv[2] || "docs/reports/v4.0.1/LINK_INVENTORY.md";

const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
const fromSitemap = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
const extra = ["/notes", "/journal", "/resume", "/search", "/this-route-does-not-exist"];
const pages = [...new Set([...fromSitemap, ...extra])];

const htmlCache = new Map();
async function fetchPage(p) {
  if (!htmlCache.has(p)) {
    const res = await fetch(BASE + p, { redirect: "manual" });
    const html = res.status === 200 ? await res.text() : "";
    htmlCache.set(p, { status: res.status, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) });
  }
  return htmlCache.get(p);
}

const collect = `(() => {
  const label = (a) => (a.getAttribute("aria-label") || a.innerText || a.querySelector("img")?.alt || a.title || "").trim().replace(/\\s+/g, " ").slice(0, 60);
  const anchors = [...document.querySelectorAll("a")].map((a) => ({
    href: a.getAttribute("href"), text: label(a), target: a.getAttribute("target") || "", rel: a.getAttribute("rel") || "",
    download: a.hasAttribute("download"), nested: !!a.parentElement?.closest("a"),
  }));
  const typelessFormButtons = [...document.querySelectorAll("form button:not([type])")].map((b) => (b.innerText || b.getAttribute("aria-label") || "").trim().slice(0, 40));
  const aiyaarUnlinked = [];
  const w = document.createTreeWalker(document.querySelector("main") || document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { if (/Aiyaar/.test(n.textContent) && !n.parentElement.closest("a,script,style,title,[aria-hidden=true]")) aiyaarUnlinked.push(n.textContent.trim().replace(/\\s+/g, " ").slice(0, 80)); }
  return { anchors, typelessFormButtons, aiyaarUnlinked: [...new Set(aiyaarUnlinked)], ids: [...document.querySelectorAll("[id]")].map((e) => e.id) };
})()`;

const cdp = await launch();
await setViewport(cdp.send, "1440x900", { scheme: "light" });
const problems = [];
const perPage = [];
const inbound = new Map();
const external = new Map();
const aiyaarNotes = [];

for (const p of pages) {
  await goto(cdp, BASE + p, 1200);
  const { anchors, typelessFormButtons, aiyaarUnlinked, ids } = await cdp.evaluate(collect);
  const domIds = new Set(ids);
  let internal = 0, ext = 0, mail = 0, files = 0;
  for (const a of anchors) {
    const where = `${p} → "${a.text}"`;
    if (a.href === null || a.href === "" || a.href === "#" || /^javascript:/i.test(a.href)) { problems.push(`Empty/placeholder href: ${where}`); continue; }
    if (a.nested) problems.push(`Nested anchor: ${where}`);
    if (a.target === "_blank" && !/noopener|noreferrer/.test(a.rel)) problems.push(`target=_blank without rel=noopener: ${where} (${a.href})`);
    if (/^mailto:|^tel:/.test(a.href)) { mail++; continue; }
    if (/^https?:\/\//.test(a.href)) {
      const u = new URL(a.href);
      if (u.origin === new URL(BASE).origin || u.hostname === "sabbir.nav.bd") { /* absolute self link */ }
      else { ext++; const e = external.get(a.href) || { pages: new Set(), rel: a.rel, target: a.target }; e.pages.add(p); external.set(a.href, e); continue; }
    }
    const url = new URL(a.href, BASE + p);
    const target = url.pathname;
    if (a.download || /\.(pdf|png|jpe?g|webp|svg|xml|zip)$/i.test(target)) {
      files++;
      const r = await fetch(BASE + target, { method: "HEAD" });
      if (r.status !== 200) problems.push(`File link ${r.status}: ${where} (${a.href})`);
      continue;
    }
    internal++;
    if (target === p) {
      // Same-page fragment (skip link, chapter rail…): the anchor must exist in this DOM.
      if (url.hash && !domIds.has(decodeURIComponent(url.hash.slice(1)))) problems.push(`Missing same-page anchor ${url.hash}: ${where}`);
      continue;
    }
    inbound.set(target, (inbound.get(target) || new Set()).add(p));
    const info = await fetchPage(target);
    if (info.status !== 200) problems.push(`Internal link ${info.status}: ${where} (${a.href})`);
    else if (url.hash && !info.ids.has(decodeURIComponent(url.hash.slice(1)))) problems.push(`Missing anchor ${url.hash} on ${target}: ${where}`);
  }
  for (const b of typelessFormButtons) problems.push(`Form button without type: ${p} → "${b}"`);
  for (const t of aiyaarUnlinked) aiyaarNotes.push(`${p}: "${t}"`);
  perPage.push({ p, total: anchors.length, internal, ext, mail, files });
}
cdp.close();

const orphans = fromSitemap.filter((r) => r !== "/" && !(inbound.get(r)?.size));
const md = [];
md.push(`# Link & interaction inventory — v4.0.1`, ``, `Generated by \`scripts/qa/link-inventory.mjs\` from the hydrated DOM of ${pages.length} pages (${BASE}).`, ``);
md.push(`## Problems (${problems.length})`, ``, ...(problems.length ? problems.map((x) => `- ${x}`) : ["None."]), ``);
md.push(`## Per page`, ``, `| Page | Links | Internal | External | mailto/tel | Files |`, `|---|---|---|---|---|---|`);
for (const r of perPage) md.push(`| \`${r.p}\` | ${r.total} | ${r.internal} | ${r.ext} | ${r.mail} | ${r.files} |`);
md.push(``, `## Inbound internal links per route (orphan check)`, ``, `| Route | Linked from (pages) |`, `|---|---|`);
for (const r of fromSitemap) md.push(`| \`${r}\` | ${inbound.get(r)?.size || 0} |`);
md.push(``, orphans.length ? `**Orphans (no inbound links):** ${orphans.map((o) => "`" + o + "`").join(", ")}` : `No orphan routes: every sitemap route has at least one inbound link.`, ``);
md.push(`## External destinations (${external.size})`, ``, `| URL | Pages | target / rel |`, `|---|---|---|`);
for (const [u, e] of [...external].sort()) md.push(`| ${u} | ${e.pages.size} | ${e.target || "same tab"}${e.rel ? " · " + e.rel : ""} |`);
md.push(``, `## "Aiyaar" mentions that are not links (review)`, ``, ...(aiyaarNotes.length ? aiyaarNotes.map((x) => `- ${x}`) : ["None."]), ``);
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, md.join("\n"));
console.log(`${pages.length} pages · ${perPage.reduce((a, r) => a + r.total, 0)} links · ${external.size} external destinations · ${problems.length} problems · orphans: ${orphans.length}`);
if (problems.length) console.log(problems.slice(0, 30).join("\n"));
setTimeout(() => process.exit(problems.length ? 1 : 0), 300);
