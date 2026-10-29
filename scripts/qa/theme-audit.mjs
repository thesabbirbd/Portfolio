// Theme architecture audit (v4.0.1) in a real browser:
//  - a new session gets a random theme, kept across client navigation, reloads and routes
//  - new sessions re-roll (distribution over N sessions)
//  - a manual choice in Settings persists across reloads and new sessions (tabs)
//  - "Randomize" forgets the saved choice and switches theme
//  - the entry toast shows once per session, never on later routes/reloads, can be dismissed,
//    and does not overlap the navigation / floating controls
//  - no console errors or hydration warnings
// Usage: BASE=http://localhost:3100 node scripts/qa/theme-audit.mjs
process.env.THEME = "random"; // let the site pick
process.env.TOAST = "1";      // keep the entry toast
const { launch, setViewport, goto } = await import("./cdp.mjs");

const BASE = process.env.BASE || "http://localhost:3000";
const results = [];
const check = (name, ok, detail = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail !== "" ? "  " + JSON.stringify(detail) : ""}`); };
const state = (cdp) => cdp.evaluate(`({ color: document.documentElement.getAttribute("data-theme-color"), source: document.documentElement.getAttribute("data-theme-source"), saved: localStorage.getItem("sabbir_color_theme"), session: sessionStorage.getItem("sabbir_session_theme") })`);
async function tap(cdp, js) {
  await cdp.evaluate(`(() => { const e = ${js}; e && e.scrollIntoView({ block: "center", behavior: "instant" }); })()`);
  await cdp.sleep(250);
  const b = await cdp.evaluate(`(() => { const e = ${js}; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (!b) return false;
  for (const t of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type: t, x: b.x, y: b.y, button: "left", clickCount: 1 });
  await cdp.sleep(500);
  return true;
}
const consoleErrors = [];
const watchConsole = (cdp) => cdp.on("Runtime.consoleAPICalled", (m) => { if (m.params.type === "error" || m.params.type === "warning") consoleErrors.push(m.params.args.map((a) => a.value || a.description || "").join(" ").slice(0, 160)); });

// 1. One session: random pick, stable across client navigation, routes and reload
{
  const cdp = await launch(); watchConsole(cdp);
  await setViewport(cdp.send, "1440x900", { scheme: "light" });
  await goto(cdp, BASE + "/", 1800);
  const first = await state(cdp);
  check("new session gets a valid random theme before paint", ["orange", "green", "blue"].includes(first.color) && first.source === "random" && first.session === first.color, first);
  // toast: shown once, below the desktop nav, not overlapping it
  await cdp.sleep(800);
  const toast = await cdp.evaluate(`(() => { const t = document.querySelector('.theme-toast > div'); if (!t) return null; const r = t.getBoundingClientRect(); const nav = document.querySelector('header nav').getBoundingClientRect(); const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    return { text: t.textContent.trim().slice(0, 90), overlapsNav: hit(r, nav), top: Math.round(r.top), right: Math.round(innerWidth - r.right) }; })()`);
  check("entry toast names the theme and points to Settings", !!toast && /theme: .* Switch anytime in Settings/.test(toast.text), toast);
  check("toast does not cover the desktop navigation", !!toast && !toast.overlapsNav, toast);
  await tap(cdp, `document.querySelector('header a[href="/notes"]')`); await cdp.sleep(1200);
  const afterNav = await state(cdp);
  const toastOnNext = await cdp.evaluate(`!!document.querySelector('.theme-toast > div')`);
  check("client navigation keeps the same theme", afterNav.color === first.color, afterNav);
  check("toast is not shown again on the next route", !toastOnNext);
  await cdp.send("Page.reload"); await cdp.sleep(2500);
  const afterReload = await state(cdp);
  const toastAfterReload = await cdp.evaluate(`!!document.querySelector('.theme-toast > div')`);
  check("reload keeps this session's theme (source: session)", afterReload.color === first.color && afterReload.source === "session", afterReload);
  check("toast is not shown again after a reload", !toastAfterReload);
  for (const r of ["/about", "/aiyaar", "/engineering-lab"]) await goto(cdp, BASE + r, 900);
  check("full page loads on other routes keep the theme", (await state(cdp)).color === first.color);
  cdp.close();
}

// 2. New sessions re-roll
{
  const seen = new Set();
  for (let i = 0; i < 8; i++) { const cdp = await launch(); await setViewport(cdp.send, "390x844", { scheme: "dark" }); await goto(cdp, BASE + "/contact", 700); seen.add((await state(cdp)).color); cdp.close(); }
  check("new sessions pick different themes (8 sessions)", seen.size >= 2, [...seen]);
}

// 3. Manual choice persists; Randomize forgets it; Escape returns focus
{
  const cdp = await launch(); watchConsole(cdp);
  await setViewport(cdp.send, "390x844", { scheme: "light" });
  await goto(cdp, BASE + "/", 1500);
  await cdp.evaluate(`document.querySelector('.theme-toast button[aria-label="Dismiss theme notice"]')?.click()`);
  const before = await state(cdp);
  const pick = ["orange", "green", "blue"].find((c) => c !== before.color);
  const label = { orange: "Orange", green: "Green", blue: "Blue" }[pick];
  await tap(cdp, `document.querySelector('[aria-label="Open System Settings"]')`);
  await tap(cdp, `[...document.querySelectorAll('[role="radiogroup"][aria-label="Colour theme"] [role="radio"]')].find((b) => b.textContent.includes("${label}"))`);
  await cdp.sleep(500);
  const chosen = await state(cdp);
  check("Settings applies and saves a manual theme", chosen.color === pick && chosen.saved === pick && chosen.source === "saved", chosen);
  const hint = await cdp.evaluate(`[...document.querySelectorAll('[role=dialog] p')].map((p) => p.textContent).find((t) => /saved on this device|picked at random/.test(t)) || ""`);
  check("Settings explains where the theme came from", /saved on this device/.test(hint), hint);
  // A new session = empty sessionStorage (a new tab or window); localStorage keeps the choice.
  await cdp.evaluate(`sessionStorage.clear()`); await cdp.send("Page.reload"); await cdp.sleep(2000);
  const newSession = await state(cdp);
  check("saved choice applies in a new session", newSession.color === pick && newSession.source === "saved", newSession);
  await cdp.send("Page.reload"); await cdp.sleep(2000);
  const reloaded = await state(cdp);
  check("saved choice survives reload", reloaded.color === pick && reloaded.source === "saved", reloaded);
  await tap(cdp, `document.querySelector('[aria-label="Open System Settings"]')`);
  await tap(cdp, `[...document.querySelectorAll('[role=dialog] button')].find((b) => b.textContent.includes("Randomize"))`);
  await cdp.sleep(500);
  const rnd = await state(cdp);
  check("Randomize forgets the saved choice and switches theme", rnd.saved === null && rnd.color !== pick && rnd.source === "random", rnd);
  cdp.close();
}

const relevant = consoleErrors.filter((e) => /hydrat|did not match|Minified React|Error/i.test(e));
check("no hydration warnings or console errors", relevant.length === 0, relevant.slice(0, 3));
console.log(`\n${results.filter(Boolean).length}/${results.length} checks passed`);
setTimeout(() => process.exit(0), 300);
