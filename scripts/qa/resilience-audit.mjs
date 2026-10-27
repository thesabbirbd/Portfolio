// Resilience audit: failed images, offline navigation (service worker), no-JS rendering and the
// keyboard skip link. Usage: BASE=http://localhost:3100 node scripts/qa/resilience-audit.mjs
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const results = [];
const check = (name, ok, detail = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail !== "" ? "  " + JSON.stringify(detail) : ""}`); };

// 1. Failed images: every image request blocked
{
  const cdp = await launch();
  await setViewport(cdp.send, "390x844", { scheme: "light" });
  await cdp.send("Network.enable");
  await cdp.send("Network.setBlockedURLs", { urls: ["*.jpg", "*.jpeg", "*.png", "*.webp", "*.avif", "*/_next/image*"] });
  for (const r of ["/", "/about", "/projects/omnidesk"]) {
    await goto(cdp, BASE + r, 1800);
    const o = await cdp.evaluate(`({ h1: !!document.querySelector("h1")?.textContent.trim(), text: document.querySelector("main").innerText.length, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length, noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length })`);
    check(`images blocked ${r}: content still renders, every image has alt`, o.h1 && o.text > 500 && o.noAlt === 0, o);
  }
  if (cdp.errors.length) console.log("  page errors:", JSON.stringify([...new Set(cdp.errors)]));
  check("images blocked: no page exceptions", cdp.errors.length === 0);
  cdp.close();
}

// 2. Offline: service worker serves the cached shell instead of a browser error
{
  const cdp = await launch();
  await setViewport(cdp.send, "1440x900", { scheme: "light" });
  await cdp.send("Network.enable");
  await goto(cdp, BASE + "/", 2500);
  const ready = await cdp.evaluate(`(async () => { if (!("serviceWorker" in navigator)) return "unsupported"; const r = await Promise.race([navigator.serviceWorker.ready.then(() => "ready"), new Promise((res) => setTimeout(() => res("timeout"), 6000))]); return r; })()`);
  check("service worker registers and activates", ready === "ready", ready);
  await cdp.send("Network.emulateNetworkConditions", { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await cdp.send("Page.navigate", { url: BASE + "/notes" });
  await cdp.sleep(2500);
  const o = await cdp.evaluate(`({ title: document.title, h1: document.querySelector("h1")?.textContent.trim().slice(0, 40) || "", body: document.body.innerText.slice(0, 60) })`);
  check("offline navigation shows the cached site shell (not a browser error page)", /SABBiR/i.test(o.title) || /SABBiR/i.test(o.h1), o);
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  cdp.close();
}

// 3. No-JS: server HTML is readable on key routes (nothing stuck at opacity 0)
{
  const cdp = await launch();
  await setViewport(cdp.send, "390x844", { scheme: "light", noJs: true });
  for (const r of ["/", "/about", "/projects", "/contact", "/engineering-lab"]) {
    await goto(cdp, BASE + r, 800);
    const o = await cdp.evaluate(`(() => { const h1 = document.querySelector("h1"); const hidden = [...document.querySelectorAll("main h1, main h2, main p")].filter((e) => { const s = getComputedStyle(e); return +s.opacity === 0 || s.visibility === "hidden"; }).length; return { h1: h1?.textContent.trim().slice(0, 40), h1Opacity: h1 ? getComputedStyle(h1).opacity : null, hidden, text: document.querySelector("main").innerText.length }; })()`);
    check(`no-JS ${r}: h1 visible, no invisible headings/paragraphs`, !!o.h1 && o.h1Opacity === "1" && o.hidden === 0 && o.text > 300, o);
  }
  cdp.close();
}

// 4. Keyboard: first Tab reaches the skip link; activating it moves focus to <main>
{
  const cdp = await launch();
  await setViewport(cdp.send, "1440x900", { scheme: "dark" });
  await goto(cdp, BASE + "/about", 1500);
  const press = async (key, code, vk) => { await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: vk, text: key === "Enter" ? "\r" : undefined }); await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: vk }); await cdp.sleep(300); };
  await press("Tab", "Tab", 9);
  const first = await cdp.evaluate(`({ text: document.activeElement?.textContent.trim(), visible: (() => { const r = document.activeElement.getBoundingClientRect(); return r.width > 20 && r.height > 10; })() })`);
  check("first Tab focuses a visible 'Skip to content' link", first.text === "Skip to content" && first.visible, first);
  await press("Enter", "Enter", 13);
  const after = await cdp.evaluate(`document.activeElement?.id`);
  check("Enter on the skip link moves focus to main", after === "main-content", after);
  await press("Tab", "Tab", 9);
  const ring = await cdp.evaluate(`(() => { const s = getComputedStyle(document.activeElement); return { el: document.activeElement.tagName + " " + document.activeElement.textContent.trim().slice(0, 30), outline: s.outlineStyle !== "none" && s.outlineWidth !== "0px", shadow: s.boxShadow !== "none" }; })()`);
  check("next Tab lands inside main content with a visible focus indicator", ring.outline || ring.shadow, ring);
  cdp.close();
}

console.log(`\n${results.filter(Boolean).length}/${results.length} checks passed`);
setTimeout(() => process.exit(0), 500);
