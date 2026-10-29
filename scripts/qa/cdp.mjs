// Minimal Chrome DevTools Protocol helper (no dependencies; Node >= 22 global WebSocket).
// Launches a throwaway headless Chrome profile and returns { send, once, on, evaluate, close }.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const CHROME = process.env.CHROME_BIN || "/usr/bin/google-chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch() {
  const dir = mkdtempSync(path.join(os.homedir(), ".cache", "sabbir-qa-"));
  const { TMPDIR, ...env } = process.env; // a long TMPDIR breaks Chrome's singleton socket path
  const port = 9300 + Math.floor(Math.random() * 600);
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--mute-audio", "--hide-scrollbars", "about:blank"], { stdio: "ignore", env });
  let targets;
  for (let i = 0; i < 150; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.length) break; } catch {}
    await sleep(200);
  }
  if (!targets) throw new Error("Chrome did not start");
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0; const pending = new Map(); const listeners = [];
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else listeners.forEach((l) => l(m)); });
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const once = (method) => new Promise((res) => { const l = (m) => { if (m.method === method) { listeners.splice(listeners.indexOf(l), 1); res(m); } }; listeners.push(l); });
  /** Subscribe to every event of `method`; returns an unsubscribe function. */
  const on = (method, fn) => { const l = (m) => { if (m.method === method) fn(m); }; listeners.push(l); return () => listeners.splice(listeners.indexOf(l), 1); };
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.result?.value;
  const errors = [];
  listeners.push((m) => { if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description?.split("\n")[0] || m.params.exceptionDetails.text); });
  await send("Page.enable"); await send("Runtime.enable");
  // NO_SW=1: bypass the service worker so byte counts reflect real network transfers.
  if (process.env.NO_SW) { await send("Network.enable"); await send("Network.setBypassServiceWorker", { bypass: true }); }
  // Deterministic QA runs (before any page script; never mutate React-owned DOM):
  //  THEME=orange|green|blue (default orange) saves that colour theme; THEME=random keeps the
  //  site's random-per-session behaviour. The entry toast is suppressed unless TOAST=1.
  const theme = process.env.THEME || "orange";
  const init = [
    theme !== "random" ? `localStorage.setItem('sabbir_color_theme','${theme}')` : "",
    process.env.TOAST ? "" : "sessionStorage.setItem('sabbir_theme_toast_seen','1')",
  ].filter(Boolean).map((x) => `try{${x}}catch(e){}`).join(";");
  if (init) await send("Page.addScriptToEvaluateOnNewDocument", { source: init });
  const close = () => { try { ws.close(); } catch {} chrome.kill("SIGKILL"); setTimeout(() => rmSync(dir, { recursive: true, force: true }), 500); };
  return { send, once, on, evaluate, close, errors, sleep };
}

/** viewport: "mobile" | "desktop" | "WxH" */
export async function setViewport(send, viewport, { scheme = "light", reduced = false, noJs = false } = {}) {
  const m = /^(\d+)x(\d+)$/.exec(viewport);
  const metrics = m ? { width: +m[1], height: +m[2], deviceScaleFactor: 2, mobile: +m[1] < 768 }
    : viewport === "mobile" ? { width: 390, height: 844, deviceScaleFactor: 3, mobile: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
  await send("Emulation.setDeviceMetricsOverride", metrics);
  if (metrics.mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  const features = [{ name: "prefers-color-scheme", value: scheme }];
  if (reduced) features.push({ name: "prefers-reduced-motion", value: "reduce" });
  await send("Emulation.setEmulatedMedia", { features });
  if (noJs) await send("Emulation.setScriptExecutionDisabled", { value: true });
}

export async function goto(cdp, url, settleMs = 2500) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await loaded;
  await cdp.sleep(settleMs);
}
