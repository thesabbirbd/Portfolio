// Section screenshots. Usage: node scripts/qa/shots.mjs <url> <outDir> <viewport> <light|dark> <targets,comma> [--reduced] [--nojs]
// targets: "top" | element id | "h3:<exact heading text>" | "sel:<css selector>"
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { launch, setViewport, goto } from "./cdp.mjs";

const [url, outDir, viewport, scheme, targets = "top"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const cdp = await launch();
await setViewport(cdp.send, viewport, { scheme, reduced: process.argv.includes("--reduced"), noJs: process.argv.includes("--nojs") });
await goto(cdp, url, 2500);
const tag = new URL(url).pathname.replace(/\W+/g, "_").replace(/^_|_$/g, "") || "home";
for (const t of targets.split(",")) {
  const expr = t === "top" ? "scrollTo(0,0)"
    : t.startsWith("h3:") ? `(() => { const el = [...document.querySelectorAll('h3')].find(h => h.textContent.trim() === ${JSON.stringify(t.slice(3))}); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - 160); })()`
    : t.startsWith("sel:") ? `(() => { const el = document.querySelector(${JSON.stringify(t.slice(4))}); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); })()`
    : `(() => { const el = document.getElementById(${JSON.stringify(t)}); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - 70); })()`;
  await cdp.evaluate(expr); await cdp.sleep(1400);
  const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
  const file = path.join(outDir, `${tag}-${viewport}-${scheme}-${t.replace(/[^a-z0-9]/gi, "")}.png`);
  writeFileSync(file, Buffer.from(shot.result.data, "base64")); console.log(file);
}
if (cdp.errors.length) console.log("PAGE ERRORS:", JSON.stringify(cdp.errors));
cdp.close(); setTimeout(() => process.exit(0), 600);
