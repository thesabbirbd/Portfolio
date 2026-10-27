// Dependency-free accessibility audit (a practical subset of WCAG 2.2 AA checks).
// Per route: one h1, heading-level skips, landmarks, html lang, skip link, accessible names for
// controls/links, img alt, form labels, duplicate ids, and rendered text contrast (foreground vs
// the composited background-colour stack; gradient/image backgrounds and transparent text skipped).
// Usage: BASE=http://localhost:3100 node scripts/qa/a11y-audit.mjs [light|dark] [WxH]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const scheme = process.argv[2] || "light";
const vp = process.argv[3] || "1440x900";
const routes = ["/", "/aiyaar", "/about", "/experience", "/projects", "/projects/omnidesk", "/engineering-lab", "/engineering-lab/qwen-automation-limitations", "/notes", "/notes/openwrt-nas", "/journal", "/journal/ubuntu-dev-environment", "/exploration", "/contact", "/resume", "/search", "/does-not-exist"];

const probe = `(() => {
  const out = { h1: 0, skips: [], noName: [], noAlt: [], noLabel: [], dupIds: [], lowContrast: [], main: 0, lang: document.documentElement.lang, skip: "" };
  const visible = (el) => { const s = getComputedStyle(el); if (s.display === "none" || s.visibility === "hidden") return false; if (el.closest("[aria-hidden=true],[inert]")) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const srOnly = (el) => { const r = el.getBoundingClientRect(); return r.width <= 1 && r.height <= 1; };
  const label = (el) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + " " + (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40);
  // headings
  let prev = 0;
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    if (!visible(h) && !srOnly(h)) continue;
    const lvl = +h.tagName[1]; if (lvl === 1) out.h1++;
    if (prev && lvl > prev + 1) out.skips.push("h" + prev + "→h" + lvl + " " + label(h));
    prev = lvl;
  }
  out.main = document.querySelectorAll("main").length;
  const firstFocusable = document.querySelector("a[href],button,input,[tabindex]:not([tabindex='-1'])");
  out.skip = firstFocusable ? (firstFocusable.textContent || firstFocusable.getAttribute("aria-label") || "").trim().slice(0, 30) : "";
  // names
  const name = (el) => (el.getAttribute("aria-label") || (el.getAttribute("aria-labelledby") && document.getElementById(el.getAttribute("aria-labelledby"))?.textContent) || el.textContent || el.getAttribute("title") || [...el.querySelectorAll("img[alt]")].map((i) => i.alt).join("") || "").trim();
  for (const el of document.querySelectorAll("a[href],button,[role=button],[role=switch],[role=radio],[role=tab]")) if (visible(el) && !name(el)) out.noName.push(el.outerHTML.slice(0, 90));
  for (const img of document.querySelectorAll("img")) if (!img.hasAttribute("alt")) out.noAlt.push(img.getAttribute("src")?.slice(0, 60));
  for (const f of document.querySelectorAll("input:not([type=hidden]),select,textarea")) {
    if (!visible(f)) continue;
    const ok = f.getAttribute("aria-label") || f.getAttribute("aria-labelledby") || (f.id && document.querySelector('label[for="' + f.id + '"]')) || f.closest("label");
    if (!ok) out.noLabel.push(f.outerHTML.slice(0, 90));
  }
  const ids = {}; for (const e of document.querySelectorAll("[id]")) ids[e.id] = (ids[e.id] || 0) + 1;
  out.dupIds = Object.entries(ids).filter(([, n]) => n > 1).map(([k]) => k);
  // contrast
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const pageBg = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  const seen = new Set();
  for (const el of document.body.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const s = getComputedStyle(el);
    const fg = parse(s.color); if (!fg || fg.a === 0 || s.webkitTextFillColor === "rgba(0, 0, 0, 0)") continue;
    if (+s.opacity < 1) continue;
    // composite the background stack; bail on images/gradients
    const chain = []; let img = false;
    for (let p = el; p && p !== document.documentElement; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (ps.backgroundImage !== "none" && p !== document.body) { img = true; break; }
      const c = parse(ps.backgroundColor); if (c && c.a > 0) chain.push(c);
      if (c && c.a >= 1) break;
    }
    if (img) continue;
    let bg = pageBg; for (let i = chain.length - 1; i >= 0; i--) bg = over(chain[i], bg);
    const fgc = fg.a < 1 ? over(fg, bg) : fg;
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    const r = ratio(fgc, bg);
    if (r < need) { const k = label(el) + " " + r.toFixed(2) + "<" + need; if (!seen.has(k)) { seen.add(k); out.lowContrast.push(k); } }
  }
  return out;
})()`;

const cdp = await launch();
await setViewport(cdp.send, vp, { scheme });
let total = 0;
for (const r of routes) {
  await goto(cdp, BASE + r, 1500);
  await cdp.evaluate(`scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })`); await cdp.sleep(600); // let view() reveals finish
  await cdp.evaluate(`scrollTo({ top: 0, behavior: "instant" })`); await cdp.sleep(300);
  const o = await cdp.evaluate(probe);
  const issues = [];
  if (o.h1 !== 1) issues.push(`h1 count ${o.h1}`);
  if (o.main !== 1) issues.push(`main count ${o.main}`);
  if (!o.lang) issues.push("html lang missing");
  for (const k of ["skips", "noName", "noAlt", "noLabel", "dupIds", "lowContrast"]) if (o[k].length) issues.push(`${k}: ${JSON.stringify(o[k].slice(0, 6))}${o[k].length > 6 ? ` (+${o[k].length - 6})` : ""}`);
  total += issues.length;
  console.log(`${issues.length ? "✗" : "✓"} ${r}  skip-link: "${o.skip}"` + (issues.length ? "\n   " + issues.join("\n   ") : ""));
}
console.log(`\n${scheme} ${vp}: ${total} issue groups`);
if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify([...new Set(cdp.errors)]));
cdp.close(); setTimeout(() => process.exit(0), 500);
