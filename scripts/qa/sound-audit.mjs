// Sound policy audit (v4.0.1 "on by default" model): instruments AudioContext before any page
// script runs and checks that audio never starts before a user gesture, that the first gesture
// unlocks it, that scroll / timeline / chapter cues then play throttled, that muting is a true
// mute, and measures the real output level per Low / Medium / High (offline render).
// Usage: BASE=http://localhost:3100 node scripts/qa/sound-audit.mjs
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const instrument = `(() => {
  const Real = window.AudioContext; if (!Real) return;
  window.__audio = { contexts: 0, notes: 0, suspended: 0 };
  window.AudioContext = class extends Real {
    constructor(...a) { super(...a); window.__audio.contexts++; }
    createOscillator() { const o = super.createOscillator(); const start = o.start.bind(o); o.start = (...a) => { window.__audio.notes++; return start(...a); }; return o; }
    suspend() { window.__audio.suspended++; return super.suspend(); }
  };
})()`;

// Level measurement: the app's real sound engine renders into an OfflineAudioContext (exact
// samples, no dependence on a headless audio device), and the audit reads the peak.
const offline = `(() => {
  if (localStorage.getItem("__qa_offline") !== "1") return;
  window.AudioContext = class extends OfflineAudioContext {
    constructor() { super(1, 48000, 48000); window.__off = this; }
    get state() { return "running"; }
    resume() { return Promise.resolve(); }
    suspend() { return Promise.resolve(); }
  };
})()`;

// CDP Input events count as real user gestures (unlike element.click()).
async function tap(cdp, selector) {
  const find = selector.startsWith("text:")
    ? `[...document.querySelectorAll("button,a")].find((b) => b.textContent.trim() === ${JSON.stringify(selector.slice(5))})`
    : `document.querySelector(${JSON.stringify(selector)})`;
  let box = null;
  for (let i = 0; i < 25 && !box; i++) { // controls mount after hydration: wait up to ~5 s
    box = await cdp.evaluate(`(() => { const e = ${find}; if (!e) return null; e.scrollIntoView({ block: "center", behavior: "instant" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    if (!box) await cdp.sleep(200);
  }
  if (!box) throw new Error("not found: " + selector);
  for (const type of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type, x: box.x, y: box.y, button: "left", clickCount: 1 });
  await cdp.sleep(400);
}
const state = (cdp) => cdp.evaluate(`({ ...window.__audio, stored: localStorage.getItem("sabbir_portfolio_sound") })`);
const scrollTimeline = (cdp) => cdp.evaluate(`(async () => { const t = document.querySelector("[data-sound-zone=timeline]"); const top = t.getBoundingClientRect().top + scrollY; for (let y = top - 400; y < top + 2600; y += 40) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 30)); } })()`);

const cdp = await launch();
await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: offline });
await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: instrument });
await setViewport(cdp.send, "1440x900", { scheme: "light" });
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${JSON.stringify(detail)}`); };

// 1. Fresh visit (sound on by default): nothing may play before a gesture, even while scrolling
await goto(cdp, BASE + "/about", 2000);
await scrollTimeline(cdp);
let s = await state(cdp);
check("fresh visit, no gesture yet: no AudioContext, no notes (timeline scroll)", s.contexts === 0 && s.notes === 0, s);

// 2. First gesture anywhere unlocks audio; the click itself plays its cue
await goto(cdp, BASE + "/", 2000);
await tap(cdp, 'header a[href="/notes"], nav a[href="/notes"]');
s = await state(cdp);
check("first tap unlocks audio (default on) and plays the tap cue", s.contexts === 1 && s.notes >= 1, s);

// 3. After unlock: scroll ticks, timeline clock and chapter sweeps play, throttled
await goto(cdp, BASE + "/", 1500);
await tap(cdp, 'button[aria-label="Open System Settings"]');
await cdp.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await cdp.sleep(400);
const n0 = (await state(cdp)).notes;
const scrollPage = await cdp.evaluate(`(async () => { const t0 = performance.now(); for (let y = 0; y < 5200; y += 40) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 25)); } return performance.now() - t0; })()`);
s = await state(cdp);
const scrollNotes = s.notes - n0;
const perSecond = scrollNotes / (scrollPage / 1000);
check("scroll soundscape plays after unlock, throttled (≤ 25 notes/s)", scrollNotes >= 5 && perSecond <= 25, { scrollNotes, perSecond: +perSecond.toFixed(1) });

// 4. Speaker icon = true mute: context suspended, nothing plays afterwards (scroll or taps)
await tap(cdp, 'button[aria-label="Open System Settings"]');
await tap(cdp, 'button[aria-label="Mute sound effects"]');
const beforeMute = (await state(cdp)).notes;
await cdp.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await cdp.sleep(300);
await cdp.evaluate(`(async () => { for (let y = 0; y < 3000; y += 40) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 25)); } })()`);
await tap(cdp, 'header a[href="/notes"], nav a[href="/notes"]');
s = await state(cdp);
check("mute: context suspended, stored off, no notes afterwards", s.suspended >= 1 && s.stored === "false" && s.notes === beforeMute, s);

// 5. Muted choice is remembered across reloads (no context even after a tap)
await goto(cdp, BASE + "/about", 1500);
await tap(cdp, 'header a[href="/notes"], nav a[href="/notes"]');
s = await state(cdp);
check("muted choice persists: no AudioContext after reload + tap", s.contexts === 0 && s.notes === 0, s);

// 6. Unmute via the speaker icon plays the preview; Low/Medium/High persist
await goto(cdp, BASE + "/about", 1500);
await tap(cdp, 'button[aria-label="Open System Settings"]');
await tap(cdp, 'button[aria-label="Turn sound effects on"]');
s = await state(cdp);
check("unmute via speaker icon: context + preview notes", s.contexts === 1 && s.notes >= 2 && s.stored === "true", s);
await tap(cdp, "text:Medium");
const lvl = await cdp.evaluate(`({ stored: localStorage.getItem("sabbir_portfolio_sound_level_v2"), checked: document.querySelector('[role=radiogroup][aria-label="Sound level"] [aria-checked=true]')?.textContent })`);
check("level control: Medium selected and persisted", lvl.stored === "medium" && /Medium/.test(lvl.checked || ""), lvl);

// 7. Output level per level, rendered offline from the app's own engine (the cue is the
//    Settings panel's open sound, triggered by a real tap on the gear).
const db = (p) => +(20 * Math.log10(Math.max(p, 1e-6))).toFixed(1);
const levels = {};
for (const v of ["low", "medium", "high"]) {
  await cdp.evaluate(`localStorage.setItem("__qa_offline", "1"); localStorage.setItem("sabbir_portfolio_sound", "true"); localStorage.setItem("sabbir_portfolio_sound_level_v2", "${v}")`);
  await goto(cdp, BASE + "/about", 1500);
  await tap(cdp, '[aria-label="Open System Settings"]');
  levels[v] = await cdp.evaluate(`(async () => { const b = await window.__off.startRendering(); let p = 0; for (const x of b.getChannelData(0)) p = Math.max(p, Math.abs(x)); return p; })()`);
}
await cdp.evaluate(`localStorage.removeItem("__qa_offline"); localStorage.removeItem("sabbir_portfolio_sound_level_v2")`);
const lv = { lowDb: db(levels.low), mediumDb: db(levels.medium), highDb: db(levels.high) };
// v4.0.1 previous maximum (100 %) was −12.6 dBFS; High must be ~+6 dB (2×) and never clip.
check("output level: low < medium < high, High ≈ 2× old max (≥ −7.5 dBFS), peak < 0 dBFS", levels.high < 1 && levels.high > levels.medium && levels.medium > levels.low && lv.highDb >= -7.5, lv);

if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify(cdp.errors));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} checks passed`);
cdp.close(); setTimeout(() => process.exit(0), 500);
