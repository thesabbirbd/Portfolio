// Headless Chrome perf benchmark (software GPU; for before/after comparison, not real-device FPS).
// Usage: node scripts/qa/perf-bench.mjs <url> [mobile|desktop] [cpuThrottle] [setupJS]
import { launch, setViewport, goto } from "./cdp.mjs";

const [url, profile = "mobile", rate = profile === "mobile" ? "4" : "2", setup = ""] = process.argv.slice(2);
const cdp = await launch();
const { send, evaluate, sleep } = cdp;
await send("Performance.enable"); await send("Network.enable"); await send("Network.setCacheDisabled", { cacheDisabled: true });
// BLOCK_URLS="*clarity.ms*,…" blocks those requests (e.g. to separate first-party cost from analytics).
if (process.env.BLOCK_URLS) await send("Network.setBlockedURLs", { urls: process.env.BLOCK_URLS.split(",") });
await setViewport(send, profile);
if (profile === "mobile") await send("Network.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36" });
await send("Emulation.setCPUThrottlingRate", { rate: Number(rate) });
await goto(cdp, url, 5000);
if (setup) { await evaluate(setup); await sleep(500); }
const metrics = async () => Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
const m0 = await metrics();
const stats = `const stats = d => { d = d.slice(1).sort((a, b) => a - b); const p = q => +(d[Math.floor(d.length * q)] || 0).toFixed(1);
  return { fps: +(1000 / (d.reduce((a, b) => a + b, 0) / d.length)).toFixed(1), p50: p(.5), p95: p(.95), jank: d.filter(x => x > 33.4).length, frames: d.length }; };`;
const page = await evaluate(`(async () => {
  let cls = 0; new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  let lcp = 0; new PerformanceObserver(l => { const e = l.getEntries(); lcp = e[e.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  await new Promise(r => setTimeout(r, 100));
  const js = performance.getEntriesByType('resource').filter(r => /\\.js(\\?|$)/.test(r.name));
  return { lcp: Math.round(lcp), cls: +cls.toFixed(3), jsKB: Math.round(js.reduce((a, r) => a + (r.transferSize || r.encodedBodySize), 0) / 1024), docH: document.documentElement.scrollHeight };
})()`);
const idle = await evaluate(`(async () => { ${stats} scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
  const d = []; let last = performance.now(); const end = last + 3000;
  await new Promise(res => { const f = t => { d.push(t - last); last = t; if (t < end) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); return stats(d); })()`);
const scroll = await evaluate(`(async () => { ${stats} const H = Math.min(document.documentElement.scrollHeight - innerHeight, 12000);
  const d = []; let last = performance.now(); const t0 = last;
  await new Promise(res => { const f = t => { d.push(t - last); last = t; const k = Math.min(1, (t - t0) / 10000); scrollTo(0, H * k); if (k < 1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); return stats(d); })()`);
const out = { url, profile, cpu: `${rate}x`, ...page, loadMainThreadMs: Math.round(m0.TaskDuration * 1000), idle, scroll, pageErrors: cdp.errors };
console.log(process.argv.includes("--json") ? JSON.stringify(out) :
  `${profile.padEnd(7)} js ${page.jsKB}KB  LCP ${page.lcp}ms  CLS ${page.cls}  docH ${page.docH}  | idle ${idle.fps} fps (p95 ${idle.p95})  | scroll ${scroll.fps} fps p50 ${scroll.p50} p95 ${scroll.p95}${cdp.errors.length ? "  ERRORS " + JSON.stringify(cdp.errors) : ""}`);
cdp.close(); setTimeout(() => process.exit(0), 600);
