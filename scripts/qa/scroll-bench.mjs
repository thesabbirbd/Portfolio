// Input-driven scroll benchmark: scrolls with real (synthesized) touch/wheel gestures, the way a
// visitor does, instead of calling scrollTo() from script (which itself forces style/layout and
// distorts the numbers). Reports frame pacing plus main-thread cost per second while idle and
// while scrolling. Software GPU in headless Chrome: use for before/after comparison, not real FPS.
// Usage: [BLOCK_3P=1] node scripts/qa/scroll-bench.mjs <url> [mobile|desktop] [cpuThrottle] [--json]
import { launch, setViewport, goto } from "./cdp.mjs";

const [url, profile = "mobile", rate = profile === "mobile" ? "4" : "2"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const cdp = await launch();
const { send, evaluate, sleep } = cdp;
await send("Performance.enable");
// BLOCK_3P=1 blocks analytics (Clarity/GA), whose start time otherwise lands randomly in the windows.
if (process.env.BLOCK_3P) { await send("Network.enable"); await send("Network.setBlockedURLs", { urls: ["*clarity.ms*", "*googletagmanager.com*", "*google-analytics.com*"] }); }
await setViewport(send, profile);
await send("Emulation.setCPUThrottlingRate", { rate: Number(rate) });
await goto(cdp, url, 4000);

const metrics = async () => Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
const KEYS = ["TaskDuration", "ScriptDuration", "RecalcStyleDuration", "LayoutDuration", "RecalcStyleCount"];
const perSecond = (a, b, secs) => Object.fromEntries(KEYS.map((k) => [k.replace("Duration", "Ms"), +(((b[k] - a[k]) * (k.endsWith("Count") ? 1 : 1000)) / secs).toFixed(k.endsWith("Count") ? 1 : 0)]));

const startFrames = () => evaluate(`window.__f = []; (() => { let last = performance.now(); const f = (t) => { if (!window.__f) return; window.__f.push(t - last); last = t; if (window.__f) { requestAnimationFrame(f); }; }; requestAnimationFrame(f); })(); 0`);
const stopFrames = () => evaluate(`(() => { const d = window.__f.slice(2).sort((a, b) => a - b); window.__f = null; const p = (q) => +(d[Math.floor(d.length * q)] || 0).toFixed(1);
  return { fps: +(1000 / (d.reduce((a, b) => a + b, 0) / d.length)).toFixed(1), p50: p(0.5), p95: p(0.95), longFrames: d.filter((x) => x > 33.4).length, frames: d.length }; })()`);

// Idle (top of page, 3 s)
await startFrames();
let m0 = await metrics(), t0 = Date.now();
await sleep(3000);
let m1 = await metrics();
const idle = { ...(await stopFrames()), ...perSecond(m0, m1, (Date.now() - t0) / 1000) };

// Scroll: four flings down the page, like reading on a phone
const { w, h } = await evaluate(`({ w: innerWidth, h: innerHeight })`);
await startFrames();
m0 = await metrics(); t0 = Date.now();
for (let i = 0; i < 4; i++) {
  await send("Input.synthesizeScrollGesture", { x: Math.round(w / 2), y: Math.round(h * 0.7), yDistance: -Math.round(h * 2.2), speed: 1600, gestureSourceType: profile === "mobile" ? "touch" : "mouse", repeatCount: 1 });
}
m1 = await metrics();
const scroll = { ...(await stopFrames()), ...perSecond(m0, m1, (Date.now() - t0) / 1000), scrolledTo: await evaluate("Math.round(scrollY)") };

const out = { url, profile, cpu: `${rate}x`, idle, scroll, pageErrors: cdp.errors };
const fmt = (s) => `${s.fps} fps p95 ${s.p95}ms long ${s.longFrames}/${s.frames} | main ${s.TaskMs}ms/s style ${s.RecalcStyleMs}ms/s (${s.RecalcStyleCount}/s) script ${s.ScriptMs}ms/s`;
console.log(process.argv.includes("--json") ? JSON.stringify(out) : `${profile} ${url}\n  idle   ${fmt(idle)}\n  scroll ${fmt(scroll)}${cdp.errors.length ? "\n  ERRORS " + JSON.stringify(cdp.errors) : ""}`);
cdp.close();
setTimeout(() => process.exit(0), 500);
