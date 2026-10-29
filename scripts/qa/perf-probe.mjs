// Performance root-cause probe (evidence, not a score). For one page it reports:
//  - requestAnimationFrame callbacks/s while idle and while scrolling (JS animation loops)
//  - running Web/CSS animations (infinite loops vs scroll-driven) and their targets
//  - scroll/wheel/touch/pointer/resize listeners registered by page code
//  - style recalcs, layouts and script time caused by a scripted scroll (CDP Performance metrics)
//  - expensive paint features: backdrop-filter, mix-blend-mode, filter, fixed layers, will-change
//  - long tasks during load, DOM size, image bytes
// Usage: BASE=http://localhost:3100 node scripts/qa/perf-probe.mjs <route> [mobile|desktop] [cpu]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const route = process.argv[2] || "/";
const profile = process.argv[3] || "mobile";
const cpu = Number(process.argv[4] || (profile === "mobile" ? 4 : 2));

const instrument = `(() => {
  const w = window; w.__probe = { raf: 0, listeners: {}, longtasks: [], cls: 0 };
  const raf = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => raf((t) => { w.__probe.raf++; cb(t); });
  const add = EventTarget.prototype.addEventListener;
  const watch = new Set(["scroll", "wheel", "touchmove", "touchstart", "pointermove", "mousemove", "resize"]);
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (watch.has(type)) {
      const who = this === window ? "window" : this === document ? "document" : (this.tagName || "other").toLowerCase();
      const k = type + "@" + who + (opts && opts.passive ? " (passive)" : "");
      w.__probe.listeners[k] = (w.__probe.listeners[k] || 0) + 1;
    }
    return add.call(this, type, fn, opts);
  };
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => w.__probe.longtasks.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: "longtask", buffered: true }); } catch {}
  try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) w.__probe.cls += e.value; })).observe({ type: "layout-shift", buffered: true }); } catch {}
})()`;

const cdp = await launch();
await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: instrument });
await setViewport(cdp.send, profile, { scheme: "light" });
// BLOCK_3P=1: block third-party analytics/recording scripts to measure first-party cost alone.
// BLOCK_URLS="*clarity.ms*,…": block a custom list instead.
const blocked = process.env.BLOCK_URLS ? process.env.BLOCK_URLS.split(",") : process.env.BLOCK_3P ? ["*clarity.ms*", "*googletagmanager.com*", "*google-analytics.com*", "*vercel-insights*", "*/_vercel/*"] : [];
if (blocked.length) {
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", { urls: blocked });
}
// PROFILE=1: sample the CPU during the idle and scroll windows and print the hottest functions.
const PROFILE = !!process.env.PROFILE;
if (PROFILE) { await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", { interval: 200 }); }
await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
await cdp.send("Performance.enable", { timeDomain: "timeTicks" });
await goto(cdp, BASE + route, 3000);

const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
const diff = (a, b, keys) => Object.fromEntries(keys.map((k) => [k, +(b[k] - a[k]).toFixed(k.endsWith("Duration") ? 3 : 0)]));
const KEYS = ["RecalcStyleCount", "RecalcStyleDuration", "LayoutCount", "LayoutDuration", "ScriptDuration", "TaskDuration"];

const hot = (prof) => {
  const self = new Map(); const nodes = new Map(prof.nodes.map((n) => [n.id, n]));
  const dt = prof.timeDeltas; const counts = new Map();
  prof.samples.forEach((id, i) => counts.set(id, (counts.get(id) || 0) + (dt[i] || 0)));
  for (const [id, us] of counts) { const n = nodes.get(id); const f = n.callFrame; const key = (f.functionName || "(anon)") + " " + (f.url.split("/").pop() || f.url || "native").slice(0, 40) + ":" + f.lineNumber + ":" + f.columnNumber; self.set(key, (self.get(key) || 0) + us); }
  return [...self].filter(([k]) => !/^\((idle|program|garbage collector)\)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, us]) => Math.round(us / 1000) + "ms " + k);
};
// idle window
if (PROFILE) await cdp.send("Profiler.start");
let r0 = await cdp.evaluate("window.__probe.raf"); let m0 = await metrics();
await cdp.sleep(3000);
let r1 = await cdp.evaluate("window.__probe.raf"); let m1 = await metrics();
const idleHot = PROFILE ? hot((await cdp.send("Profiler.stop")).result.profile) : undefined;
if (PROFILE) await cdp.send("Profiler.start");
const idle = { rafPerSec: Math.round((r1 - r0) / 3), ...diff(m0, m1, KEYS) };

// scroll window: 3s, smooth scripted scroll through the page
await cdp.evaluate(`(async () => { const max = document.documentElement.scrollHeight - innerHeight; const t0 = performance.now(); await new Promise((res) => { const f = () => { const k = Math.min(1, (performance.now() - t0) / 3000); scrollTo({ top: max * k, behavior: "instant" }); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); })()`);
const r2 = await cdp.evaluate("window.__probe.raf"); const m2 = await metrics();
const scroll = { rafPerSec: Math.round((r2 - r1) / 3), ...diff(m1, m2, KEYS) };
const scrollHot = PROFILE ? hot((await cdp.send("Profiler.stop")).result.profile) : undefined;

const page = await cdp.evaluate(`(() => {
  const lab = (el) => (el.tagName || "?").toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).slice(0, 3).join(".") : "");
  const anims = document.getAnimations().filter((a) => a.playState === "running").map((a) => {
    const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : {};
    const scrollDriven = a.timeline && a.timeline.constructor && /Scroll|View/.test(a.timeline.constructor.name);
    return { name: a.animationName || a.transitionProperty || a.constructor.name, infinite: t.iterations === Infinity, scrollDriven, target: a.effect && a.effect.target ? lab(a.effect.target).slice(0, 70) : "" };
  });
  const loops = anims.filter((a) => a.infinite && !a.scrollDriven);
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const all = [...document.querySelectorAll("*")];
  const feat = (pred) => all.filter((el) => vis(el) && pred(getComputedStyle(el))).map(lab).slice(0, 12);
  const imgs = performance.getEntriesByType("resource").filter((r) => r.initiatorType === "img" || /\\.(png|jpe?g|webp|avif|svg)(\\?|$)/.test(r.name));
  return {
    dom: all.length,
    infiniteLoops: loops.length, loopTargets: loops.map((a) => a.name + " → " + a.target).slice(0, 15),
    scrollDrivenAnimations: anims.filter((a) => a.scrollDriven).length,
    backdropFilter: feat((s) => s.backdropFilter && s.backdropFilter !== "none"),
    blendModes: feat((s) => s.mixBlendMode !== "normal"),
    filters: feat((s) => s.filter && s.filter !== "none"),
    fixed: feat((s) => s.position === "fixed").length,
    willChange: feat((s) => s.willChange && s.willChange !== "auto").length,
    listeners: window.__probe.listeners,
    // Long tasks split by when they started: first 3 s (load + hydration) vs later.
    longtasksFirst3s: (() => { const l = window.__probe.longtasks.filter(([t]) => t < 3000); return { count: l.length, totalMs: l.reduce((a, [, d]) => a + d, 0), maxMs: Math.max(0, ...l.map(([, d]) => d)) }; })(),
    longtasksAfter3s: (() => { const l = window.__probe.longtasks.filter(([t]) => t >= 3000); return { count: l.length, totalMs: l.reduce((a, [, d]) => a + d, 0), maxMs: Math.max(0, ...l.map(([, d]) => d)) }; })(),
    cls: +window.__probe.cls.toFixed(3),
    imageKB: Math.round(imgs.reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0) / 1024),
    largestImages: imgs.sort((a, b) => (b.encodedBodySize || 0) - (a.encodedBodySize || 0)).slice(0, 4).map((r) => r.name.split("/").pop().slice(0, 50) + " " + Math.round((r.encodedBodySize || 0) / 1024) + "KB"),
  };
})()`);

console.log(JSON.stringify({ route, profile, cpu, blocked, idle, scroll, ...page, idleHot, scrollHot }, null, 1));
if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify(cdp.errors));
cdp.close(); setTimeout(() => process.exit(0), 400);
