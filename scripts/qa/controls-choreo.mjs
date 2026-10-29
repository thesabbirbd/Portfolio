// Fixed-control choreography probe. Records the rects of the floating controls every animation
// frame while scripted scrolls run (slow down, stop, fast down, reverse up, stop), then reports:
//  - collisions between controls (any overlapping pair, per frame)
//  - jumps (a control moving > JUMP px in one frame)
//  - nav state flips per scroll phase (flicker)
//  - final resting positions (to compare against the intended slots)
// Usage: BASE=http://localhost:3100 node scripts/qa/controls-choreo.mjs [route] [WxH] [--reduced]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const route = process.argv[2] || "/";
const vp = process.argv[3] || "390x844";
const JUMP = 48;

const recorder = `(() => {
  const q = {
    terminal: () => document.querySelector('[aria-label="Open terminal"]'),
    settings: () => document.querySelector('[aria-label="Open System Settings"]'),
    dock: () => document.querySelector('[aria-label="Expand quick actions dock"],[aria-label="Open profile panel"]')?.parentElement,
    nav: () => [...document.querySelectorAll('nav[aria-label="Primary"]')].find((n) => getComputedStyle(n).display !== "none" && n.getBoundingClientRect().width > 0 && n.tagName === "NAV" && getComputedStyle(n).position === "fixed") || document.querySelector('header nav[aria-label="Primary"]'),
  };
  const frames = []; window.__frames = frames; window.__phase = "init";
  const tick = () => {
    const f = { t: performance.now(), y: scrollY, phase: window.__phase };
    for (const [k, get] of Object.entries(q)) { const el = get(); if (el) { const r = el.getBoundingClientRect(); f[k] = [r.left, r.top, r.right, r.bottom]; } }
    // v4.0.1: while scrolling, the phone dock deliberately tucks *behind* Settings (inert) and
    // rises back out of it in the same column. That stacked overlap is the design, not a
    // collision; it is excluded below (tucked, or horizontally centred on Settings).
    const dockEl = q.dock && q.dock();
    f.dockTucked = !!(dockEl && dockEl.closest("[inert]"));
    frames.push(f); requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})()`;

const scrollPhase = (name, px, ms) => `(async () => {
  window.__phase = ${JSON.stringify(name)};
  const start = scrollY, t0 = performance.now();
  await new Promise((res) => { const step = () => { const k = Math.min(1, (performance.now() - t0) / ${ms}); scrollTo({ top: start + ${px} * k, behavior: "instant" }); k < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
})()`;

const cdp = await launch();
await setViewport(cdp.send, vp, { scheme: "light", reduced: process.argv.includes("--reduced") });
await goto(cdp, BASE + route, 2200);
await cdp.evaluate(recorder);
await cdp.sleep(500);
const phases = [
  ["slow-down", 900, 2400], ["stop-1", 0, 1600],
  ["fast-down", 1600, 500], ["reverse-up", -500, 600], ["stop-2", 0, 1600],
  ["jitter", 6, 80], ["jitter-back", -6, 80], ["stop-3", 0, 1400],
];
for (const [name, px, ms] of phases) { await cdp.evaluate(scrollPhase(name, px, ms)); }

const res = await cdp.evaluate(`(() => {
  const F = window.__frames, keys = ["terminal", "settings", "dock", "nav"];
  const hit = (a, b) => a && b && a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1;
  const collisions = {}, jumps = [], navTop = [];
  for (let i = 0; i < F.length; i++) {
    const f = F[i];
    for (let a = 0; a < keys.length; a++) for (let b = a + 1; b < keys.length; b++) if (hit(f[keys[a]], f[keys[b]]) && !(keys[a] === "settings" && keys[b] === "dock" && (f.dockTucked || Math.abs((f.settings[0] + f.settings[2]) - (f.dock[0] + f.dock[2])) < 4))) { const k = keys[a] + "×" + keys[b] + "@" + f.phase; collisions[k] = (collisions[k] || 0) + 1; }
    if (i) for (const k of keys) { const p = F[i - 1][k], c = f[k]; if (p && c) { const d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d > ${JUMP}) jumps.push(k + "@" + f.phase + " " + Math.round(d) + "px"); } }
  }
  // nav visibility per frame: visible if its rect intersects the viewport
  const vis = F.map((f) => f.nav ? (f.nav[3] > 0 && f.nav[1] < innerHeight) : null);
  const flips = {}; for (let i = 1; i < vis.length; i++) if (vis[i] !== vis[i - 1]) flips[F[i].phase] = (flips[F[i].phase] || 0) + 1;
  const last = F[F.length - 1]; const round = (r) => r && r.map(Math.round);
  // Zig-zag check: how far the dock moves horizontally across all scroll phases.
  const dockX = F.map((f) => f.dock && f.dock[0]).filter((x) => x != null);
  const dockXTravel = dockX.length ? Math.round(Math.max(...dockX) - Math.min(...dockX)) : null;
  return { frames: F.length, dockXTravel, collisions, jumps: jumps.slice(0, 12), jumpCount: jumps.length, navFlips: flips, rest: { terminal: round(last.terminal), settings: round(last.settings), dock: round(last.dock), nav: round(last.nav) }, vw: innerWidth, vh: innerHeight };
})()`);
console.log(`${route} ${vp}${process.argv.includes("--reduced") ? " reduced" : ""}`);
console.log(JSON.stringify(res, null, 1));
if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify(cdp.errors));
cdp.close(); setTimeout(() => process.exit(0), 500);
