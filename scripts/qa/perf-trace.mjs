// Main-thread trace during a scripted scroll: where does frame time go (script, style, layout,
// paint, layerize, commit…) and which DOM nodes are repainted most. Evidence for perf fixes.
// Usage: BASE=http://localhost:3100 node scripts/qa/perf-trace.mjs <route> [mobile|desktop] [cpu]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const route = process.argv[2] || "/";
const profile = process.argv[3] || "mobile";
const cpu = Number(process.argv[4] || (profile === "mobile" ? 4 : 2));

const cdp = await launch();
await setViewport(cdp.send, profile, { scheme: "light" });
if (process.env.BLOCK_3P) {
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", { urls: ["*clarity.ms*", "*googletagmanager.com*", "*google-analytics.com*"] });
}
await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
await goto(cdp, BASE + route, 3500);
await cdp.send("DOM.enable");
await cdp.send("DOM.getDocument", { depth: -1 });

const events = [];
const off = cdp.on("Tracing.dataCollected", (m) => events.push(...m.params.value));
await cdp.send("Tracing.start", { traceConfig: { includedCategories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "blink", "cc"] }, transferMode: "ReportEvents" });
await cdp.evaluate(`(async () => { const max = document.documentElement.scrollHeight - innerHeight; const t0 = performance.now(); await new Promise((res) => { const f = () => { const k = Math.min(1, (performance.now() - t0) / 3000); scrollTo({ top: max * k, behavior: "instant" }); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); })()`);
const complete = cdp.once("Tracing.tracingComplete");
await cdp.send("Tracing.end");
await complete; off();

// main renderer thread = the thread with the most "RunTask" duration that has FunctionCall/Paint
const byTid = new Map();
for (const e of events) if (e.ph === "X" && e.name === "RunTask") byTid.set(e.tid, (byTid.get(e.tid) || 0) + (e.dur || 0));
const threadNames = new Map(events.filter((e) => e.name === "thread_name").map((e) => [e.tid, e.args.name]));
const mainTid = [...byTid].filter(([tid]) => threadNames.get(tid) === "CrRendererMain").sort((a, b) => b[1] - a[1])[0]?.[0];
const main = events.filter((e) => e.tid === mainTid && e.ph === "X");
const NAMES = ["RunTask", "FunctionCall", "EvaluateScript", "TimerFire", "FireAnimationFrame", "EventDispatch", "UpdateLayoutTree", "Layout", "PrePaint", "Paint", "PaintImage", "Layerize", "UpdateLayer", "Commit", "HitTest", "ScrollLayer", "Decode Image", "ParseHTML", "GPUTask", "RasterTask"];
const sum = {};
for (const e of main) if (NAMES.includes(e.name)) sum[e.name] = (sum[e.name] || 0) + e.dur / 1000;
const paints = main.filter((e) => e.name === "Paint");
const nodeCounts = new Map();
for (const p of paints) { const id = p.args?.data?.nodeId; if (id) nodeCounts.set(id, (nodeCounts.get(id) || { n: 0, ms: 0 })), nodeCounts.get(id).n++, nodeCounts.get(id).ms += p.dur / 1000; }
const top = [...nodeCounts].sort((a, b) => b[1].ms - a[1].ms).slice(0, 10);
const describe = async (backendNodeId) => {
  try { const d = (await cdp.send("DOM.describeNode", { backendNodeId })).result.node; const attrs = d.attributes || []; const get = (k) => { const i = attrs.indexOf(k); return i >= 0 ? attrs[i + 1] : ""; }; return (d.localName || d.nodeName) + (get("id") ? "#" + get("id") : "") + (get("class") ? "." + get("class").split(/\s+/).slice(0, 4).join(".") : ""); } catch { return "node " + backendNodeId; }
};
const repainted = [];
for (const [id, v] of top) repainted.push(`${v.n}× ${v.ms.toFixed(1)}ms  ${(await describe(id)).slice(0, 110)}`);
const frames = events.filter((e) => e.name === "DrawFrame" || e.name === "BeginMainThreadFrame").length;
// Forced (synchronous) style/layout = UpdateLayoutTree/Layout that starts inside a JS call.
const js = main.filter((e) => e.name === "FunctionCall" || e.name === "EventDispatch" || e.name === "FireAnimationFrame" || e.name === "TimerFire");
const inside = (e) => js.some((j) => e.ts >= j.ts && e.ts + e.dur <= j.ts + j.dur);
const recalcs = main.filter((e) => e.name === "UpdateLayoutTree");
const forced = recalcs.filter(inside);
const recalcSummary = { total: recalcs.length, forced: forced.length, forcedMs: Math.round(forced.reduce((a, e) => a + e.dur, 0) / 1000), frameMs: Math.round(recalcs.filter((e) => !inside(e)).reduce((a, e) => a + e.dur, 0) / 1000), avgElements: Math.round(recalcs.reduce((a, e) => a + (e.args?.elementCount || 0), 0) / Math.max(1, recalcs.length)) };
const byEvent = {};
for (const e of main.filter((e) => e.name === "EventDispatch")) { const t = e.args?.data?.type || "?"; byEvent[t] = (byEvent[t] || 0) + e.dur / 1000; }
const eventMs = Object.fromEntries(Object.entries(byEvent).map(([k, v]) => [k, Math.round(v)]).sort((a, b) => b[1] - a[1]));
console.log(JSON.stringify({ route, profile, cpu, mainThreadMs: Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, Math.round(v)]).sort((a, b) => b[1] - a[1])), paintEvents: paints.length, topRepaintedNodes: repainted, recalcSummary, eventMs }, null, 1));
cdp.close(); setTimeout(() => process.exit(0), 400);
