// Mobile composition audit: per route × viewport, report horizontal overflow, sub-11px text and
// small tap targets (< 24px, WCAG 2.2 target size; inline text links exempt).
// Usage: BASE=http://localhost:3100 node scripts/qa/mobile-audit.mjs [route,route] [WxH,WxH]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const routes = (process.argv[2] || "/,/about,/projects,/engineering-lab,/experience,/exploration,/contact,/notes,/journal,/resume,/search,/projects/omnidesk,/notes/openwrt-nas,/engineering-lab/qwen-automation-limitations,/journal/ubuntu-dev-environment,/this-route-does-not-exist").split(",");
const viewports = (process.argv[3] || "320x640,360x800,375x812,390x844,402x874,414x896,430x932,844x390,768x1024").split(",");

const probe = `(() => {
  const vw = innerWidth, out = { h: document.documentElement.scrollHeight, overflow: [], tiny: [], targets: [] };
  const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) return true; } return false; };
  const visible = (el) => { const s = getComputedStyle(el); if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) return false; if (el.closest("[aria-hidden=true],.sr-only,[hidden],[inert]")) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const label = (el) => (el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + " " + (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40));
  for (const el of document.body.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && getComputedStyle(el).position !== "fixed" && !clipped(el)) out.overflow.push(label(el) + " →" + Math.round(r.right));
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own && parseFloat(getComputedStyle(el).fontSize) < 11) out.tiny.push(label(el) + " " + getComputedStyle(el).fontSize);
    if (el.matches("a[href],button,[role=button],[role=switch],[role=radio],input,select,textarea")) {
      const inline = el.tagName === "A" && getComputedStyle(el).display === "inline" && el.closest("p,li");
      const after = getComputedStyle(el, "::after"); // stretched link: ::after covers the whole card
      const stretched = after.position === "absolute" && after.content !== "none";
      if (!inline && !stretched && (r.width < 24 || r.height < 24)) out.targets.push(label(el) + " " + Math.round(r.width) + "x" + Math.round(r.height));
    }
  }
  const uniq = (a) => [...new Set(a)];
  out.overflow = uniq(out.overflow); out.tiny = uniq(out.tiny); out.targets = uniq(out.targets);
  return out;
})()`;

const cdp = await launch();
let issues = 0;
for (const vp of viewports) {
  await setViewport(cdp.send, vp, { scheme: "light" });
  for (const route of routes) {
    await goto(cdp, BASE + route, 1200);
    const r = await cdp.evaluate(probe);
    const bad = r.overflow.length + r.tiny.length + r.targets.length;
    issues += bad;
    if (!bad) continue;
    console.log(`\n${vp} ${route}  (h ${r.h})`);
    if (r.overflow.length) console.log("  OVERFLOW", r.overflow.slice(0, 5));
    if (r.tiny.length) console.log("  TINY", r.tiny.slice(0, 6));
    if (r.targets.length) console.log("  TARGETS", r.targets.slice(0, 6));
  }
}
console.log(`\n${routes.length} routes × ${viewports.length} viewports · ${issues} findings`);
if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify([...new Set(cdp.errors)]));
cdp.close(); setTimeout(() => process.exit(0), 600);
