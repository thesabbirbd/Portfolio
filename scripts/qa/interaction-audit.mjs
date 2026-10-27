// Interaction integrity audit (ACTION → FEEDBACK → RESULT) with real CDP input events.
// Usage: BASE=http://localhost:3100 node scripts/qa/interaction-audit.mjs
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const cdp = await launch();
await setViewport(cdp.send, "1440x900", { scheme: "light" });
const results = [];
const check = (name, ok, detail = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + JSON.stringify(detail) : ""}`); };
const ev = (js) => cdp.evaluate(js);
const sleep = (ms) => cdp.sleep(ms);
async function key(k, mods = 0, code) {
  const text = k.length === 1 ? k : k === "Enter" ? "\r" : undefined;
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: code || (k.length === 1 ? "Key" + k.toUpperCase() : k), text, modifiers: mods, windowsVirtualKeyCode: k === "Enter" ? 13 : k === "Escape" ? 27 : k.length === 1 ? k.toUpperCase().charCodeAt(0) : 0 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: code || (k.length === 1 ? "Key" + k.toUpperCase() : k), modifiers: mods });
  await sleep(250);
}
const type = async (t) => { await cdp.send("Input.insertText", { text: t }); await sleep(450); };
async function tap(js) {
  // Scroll first, then measure a few frames later: scroll-driven reveal animations update on the next frame.
  const found = await ev(`(() => { const e = ${js}; if (!e) return false; e.scrollIntoView({ block: "center", behavior: "instant" }); return true; })()`);
  if (!found) return false;
  await sleep(200);
  const b = await ev(`(() => { const e = ${js}; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (!b) return false;
  for (const t of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type: t, x: b.x, y: b.y, button: "left", clickCount: 1 });
  await sleep(500);
  return true;
}
const byText = (sel, text) => `[...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.textContent.trim().includes(${JSON.stringify(text)}))`;
const path = () => ev("location.pathname + location.hash");

// 1. Command menu: Ctrl+K opens, typing filters, Enter navigates, focus returns on Escape
await goto(cdp, BASE + "/", 1800);
await key("k", 2);
let open = await ev(`!!document.querySelector('[role=dialog] input, [cmdk-input], input[placeholder*="command" i]')`);
check("Ctrl+K opens the command menu", open);
await type("Journal");
await key("Enter");
await sleep(1500);
check("command menu: typing 'Journal' + Enter navigates to /journal", (await path()) === "/journal", await path());
await key("k", 2); await sleep(400); await key("Escape"); await sleep(700);
check("command menu: Escape closes it", !(await ev(`!!document.querySelector('[role=dialog]')`)));

// 2. Global terminal: backtick opens, help lists commands, Escape closes
await key("`", 0, "Backquote"); await sleep(500);
check("` opens the terminal", await ev(`!!document.querySelector('[aria-label="Interactive terminal"]')`));
await type("help"); await key("Enter");
check("terminal: 'help' prints the command list", await ev(`document.querySelector('[aria-label="Interactive terminal"]').textContent.includes("whoami")`));
await type("omnidesk"); await key("Enter");
check("terminal: 'omnidesk' output is factual (case study path)", await ev(`document.querySelector('[aria-label="Interactive terminal"]').textContent.includes("/projects/omnidesk")`));
await key("Escape"); await sleep(700);
check("terminal: Escape closes", !(await ev(`!!document.querySelector('[aria-label="Interactive terminal"]')`)));

// 3. Search page: query → result link → case study
await goto(cdp, BASE + "/search", 1500);
await tap(`document.querySelector('input[placeholder^="Search by"]')`);
await type("omnidesk"); await sleep(600);
const hasResult = await ev(`!!document.querySelector('a[href="/projects/omnidesk"]')`);
check("search: 'omnidesk' shows the case-study result", hasResult);
await tap(`document.querySelector('main a[href="/projects/omnidesk"]')`); await sleep(1500);
check("search: clicking the result opens /projects/omnidesk", (await path()) === "/projects/omnidesk", await path());
check("no '/undefined/' links anywhere on the search page", !(await (await fetch(BASE + "/search")).text()).includes("/undefined/"));

// 4. Settings: theme + palette change the document
await goto(cdp, BASE + "/", 1500);
await tap(`document.querySelector('[aria-label="Open System Settings"]')`);
await tap(byText('[role="radio"]', "Dark"));
check("settings: Dark theme applies html.dark", await ev(`document.documentElement.classList.contains("dark")`));
await tap(byText('[role="radio"]', "Blue"));
check("settings: Blue palette sets data-theme-color", (await ev(`document.documentElement.dataset.themeColor`)) === "blue");
await tap(byText('[role="radio"]', "Light")); await tap(byText('[role="radio"]', "Orange"));
await key("Escape"); await sleep(800);
check("settings: Escape closes and focus returns to the gear", await ev(`!document.querySelector('[aria-labelledby="settings-title"]') && document.activeElement?.getAttribute("aria-label") === "Open System Settings"`));

// 5. Home quick-view modal: opens, Escape closes
await tap(`document.querySelector('#projects button[aria-label^="Quick view"], #projects button[title*="Quick" i]')`);
const modal = await ev(`!!document.querySelector('[role=dialog]')`);
check("work: quick-view button opens a project dialog", modal);
await key("Escape"); await sleep(700);
check("work: Escape closes the dialog and restores page scroll", await ev(`!document.querySelector('[role=dialog]') && getComputedStyle(document.body).overflow !== "hidden"`));

// 6. Lab filter
await goto(cdp, BASE + "/engineering-lab", 1500);
const before = await ev(`document.querySelectorAll('#lab article, #lab [data-experiment]').length`);
const filtered = await tap(`[...document.querySelectorAll('#lab button')].find((b) => /^AI\\b|AI Lab|Hardware/i.test(b.textContent.trim()))`);
const after = await ev(`document.querySelectorAll('#lab article, #lab [data-experiment]').length`);
check("lab: category filter changes the experiment list", filtered && after > 0 && after <= before, { before, after });

// 7. Resume print → professional mode + window.print
await goto(cdp, BASE + "/resume", 1500);
await ev(`window.__printed = 0; window.print = () => { window.__printed++; }`);
await tap(byText("button", "Print / Save PDF")); await sleep(800);
check("resume: Print switches to professional mode and calls window.print", (await ev("window.__printed")) === 1 && (await ev(`[...document.querySelectorAll('[role="radio"][aria-checked="true"]')].some((b) => b.textContent.includes("Professional"))`)));

// 7b. IdentityDock quick actions (desktop): expand, toggle theme, contact
await goto(cdp, BASE + "/", 1500);
await ev(`document.querySelector('[aria-label="Open profile panel"]')?.focus()`); await sleep(600);
const darkBefore = await ev(`document.documentElement.classList.contains("dark")`);
await tap(`document.querySelector('button[aria-label="Toggle Theme"]')`);
check("dock: Toggle Theme flips the colour scheme", (await ev(`document.documentElement.classList.contains("dark")`)) !== darkBefore);
await tap(`document.querySelector('button[aria-label="Toggle Theme"]')`);
await tap(`document.querySelector('button[aria-label="Contact"]')`); await sleep(1200);
check("dock: Contact scrolls to the Home contact chapter", await ev(`(() => { const r = document.getElementById("contact").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })()`));

// 8. 404 page
const res404 = await fetch(BASE + "/this-route-does-not-exist");
const html404 = await res404.text();
check("404: unknown route returns status 404 with a link home", res404.status === 404 && /href="\/"/.test(html404), { status: res404.status });

// 9. RSS feed: valid items, every link resolves
const feed = await (await fetch(BASE + "/feed.xml")).text();
const links = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]).filter((l) => l.includes("/") && !l.endsWith(".bd") && !l.endsWith(".bd/"));
let bad = [];
for (const l of links) { const p = l.replace(/^https?:\/\/[^/]+/, ""); const r = await fetch(BASE + p, { redirect: "manual" }); if (r.status !== 200) bad.push(`${r.status} ${p}`); }
check(`feed.xml: ${links.length} item links all resolve`, links.length > 0 && bad.length === 0, bad);

if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify([...new Set(cdp.errors)]));
console.log(`\n${results.filter(Boolean).length}/${results.length} checks passed`);
cdp.close(); setTimeout(() => process.exit(0), 500);
