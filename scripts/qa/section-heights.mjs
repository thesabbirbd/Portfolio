// Home composition probe: height of each top-level section on the home page per viewport,
// plus the total page height. Used for the "compact after Engineering Evolution" gate.
// Usage: BASE=http://localhost:3000 node scripts/qa/section-heights.mjs [WxH,WxH] [route]
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const viewports = (process.argv[2] || "390x844").split(",");
const route = process.argv[3] || "/";

const cdp = await launch();
for (const vp of viewports) {
  await setViewport(cdp.send, vp);
  await goto(cdp, BASE + route, 2500);
  const rows = await cdp.evaluate(`(() => {
    // Outermost sections only (a section nested in another section is part of its parent).
    const blocks = [...document.querySelectorAll("main section, main [data-chapter]")].filter((s) => !s.parentElement.closest("main section"));
    const vh = innerHeight;
    return { total: document.documentElement.scrollHeight, sections: blocks.map((s) => {
      const h = s.querySelector("h1,h2");
      const r = s.getBoundingClientRect();
      const cs = getComputedStyle(s);
      return { id: s.id || "", heading: (h?.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40), h: Math.round(r.height), screens: +(r.height / vh).toFixed(2), pad: Math.round(parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) };
    }) };
  })()`);
  console.log(`\n${vp}  total ${rows.total}px`);
  for (const r of rows.sections) console.log(`  ${String(r.h).padStart(5)}px ${String(r.screens).padStart(5)} screens  pad ${String(r.pad).padStart(4)}  ${r.id.padEnd(16)} ${r.heading}`);
}
cdp.close(); setTimeout(() => process.exit(0), 300);
