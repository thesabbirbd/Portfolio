// Sound policy audit: instruments AudioContext before any page script runs and checks that
// audio is never created/played without an explicit opt-in + user gesture.
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

// CDP Input events count as real user gestures (unlike element.click()).
async function tap(cdp, selector) {
  const find = selector.startsWith("text:")
    ? `[...document.querySelectorAll("button,a")].find((b) => b.textContent.trim() === ${JSON.stringify(selector.slice(5))})`
    : `document.querySelector(${JSON.stringify(selector)})`;
  const box = await cdp.evaluate(`(() => { const e = ${find}; if (!e) return null; e.scrollIntoView({ block: "center", behavior: "instant" }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (!box) throw new Error("not found: " + selector);
  for (const type of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type, x: box.x, y: box.y, button: "left", clickCount: 1 });
  await cdp.sleep(400);
}
const state = (cdp) => cdp.evaluate(`({ ...window.__audio, stored: localStorage.getItem("sabbir_portfolio_sound") })`);
const scrollTimeline = (cdp) => cdp.evaluate(`(async () => { const t = document.getElementById("journey") || document.querySelector("[id^=journey-]"); const top = t.getBoundingClientRect().top + scrollY; for (let y = top - 400; y < top + 2600; y += 40) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 30)); } })()`);

const cdp = await launch();
await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: instrument });
await setViewport(cdp.send, "1440x900", { scheme: "light" });
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${JSON.stringify(detail)}`); };

// 1. Fresh visit: sound off, nothing created even after clicks and scroll
await goto(cdp, BASE + "/about", 2000);
await tap(cdp, 'header a[href="/notes"]'); await goto(cdp, BASE + "/about", 1500);
await scrollTimeline(cdp);
let s = await state(cdp);
check("fresh visit: no AudioContext, no notes (clicks + timeline scroll)", s.contexts === 0 && s.notes === 0, s);

// 2. Opt in through Settings (a real click)
await tap(cdp, '[aria-label="Open System Settings"]');
await tap(cdp, '[role="switch"][aria-label="Sound effects"]');
s = await state(cdp);
check("enable via Settings: one context + preview notes", s.contexts === 1 && s.notes >= 2 && s.stored === "true", s);
const afterEnable = s.notes;
await tap(cdp, "text:Test sound");
s = await state(cdp);
check("Test sound button plays the preview", s.notes > afterEnable, s);

// 3. Disable instantly: context suspended, further clicks silent
await tap(cdp, '[role="switch"][aria-label="Sound effects"]');
const beforeOff = (await state(cdp)).notes;
await cdp.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await cdp.sleep(300);
await tap(cdp, 'header a[href="/notes"]'); await cdp.sleep(800);
s = await state(cdp);
check("disable: context suspended, no notes afterwards", s.suspended >= 1 && s.notes === beforeOff && s.stored === "false", s);

// 4. Returning visitor with sound ON: nothing until the first gesture; timeline scroll alone stays silent
await cdp.evaluate(`localStorage.setItem("sabbir_portfolio_sound", "true")`);
await goto(cdp, BASE + "/about", 2000);
await scrollTimeline(cdp);
s = await state(cdp);
check("sound stored ON, no gesture yet: scroll milestones stay silent, no context", s.contexts === 0 && s.notes === 0, s);

// 5. After a gesture, milestones play but throttled (far fewer cues than phase changes)
await goto(cdp, BASE + "/about", 1500);
await tap(cdp, '[aria-label="Open System Settings"]'); // gesture
await cdp.evaluate(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))`); await cdp.sleep(300);
const n0 = (await state(cdp)).notes;
await scrollTimeline(cdp);
s = await state(cdp);
const cues = (s.notes - n0) / 2; // a milestone cue is 2 notes
check("after a gesture: milestone cues play, throttled (≤ 1 per 1.2s)", s.contexts === 1 && cues >= 1 && cues <= 5, { ...s, cues });

if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify(cdp.errors));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} checks passed`);
cdp.close(); setTimeout(() => process.exit(0), 500);
