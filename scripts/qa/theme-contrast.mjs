// Token-level WCAG contrast for every colour theme × mode, read from the computed CSS of the
// running site (not from a copy of the values). Text tokens must reach 4.5:1 on paper, cards,
// muted surfaces and the primary/10 tint; on-primary on primary 4.5:1; display gradient 3:1.
// Usage: BASE=http://localhost:3100 node scripts/qa/theme-contrast.mjs
import { launch, setViewport, goto } from "./cdp.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const cdp = await launch();
let fails = 0;
const rows = [];
for (const theme of ["orange", "green", "blue"]) {
  for (const mode of ["light", "dark"]) {
    await setViewport(cdp.send, "1440x900", { scheme: mode });
    await goto(cdp, BASE + "/", 600);
    const r = await cdp.evaluate(`(() => {
      const root = document.documentElement;
      root.setAttribute("data-theme-color", ${JSON.stringify(theme)});
      root.classList.toggle("dark", ${JSON.stringify(mode)} === "dark"); root.classList.toggle("light", ${JSON.stringify(mode)} !== "dark");
      const cs = getComputedStyle(root);
      const v = (n) => cs.getPropertyValue("--" + n).trim().split(/\\s+/).map(Number);
      const num = (n) => parseFloat(cs.getPropertyValue("--" + n));
      const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      const over = (t, a, b) => t.map((c, i) => c * a + b[i] * (1 - a));
      const paper = v("paper"), card = over(v("surface"), num("surface-alpha"), paper), muted = v("muted"), tint = over(v("primary"), 0.1, paper);
      const out = {};
      for (const fg of ["ink", "ink-2", "ink-3", "primary", "accent", "signal", "ok"]) out[fg] = Math.min(...[paper, card, muted, tint].map((bg) => cr(v(fg), bg)));
      out["on-primary"] = cr(v("on-primary"), v("primary"));
      out["display"] = Math.min(cr(v("display-from"), paper), cr(v("display-to"), paper));
      return out;
    })()`);
    const bad = Object.entries(r).filter(([k, x]) => x < (k === "display" ? 3 : 4.5));
    fails += bad.length;
    rows.push(`${theme.padEnd(6)} ${mode.padEnd(5)} ` + Object.entries(r).map(([k, x]) => `${k}=${x.toFixed(2)}`).join(" ") + (bad.length ? `  FAIL ${bad.map(([k]) => k).join(",")}` : ""));
  }
}
console.log(rows.join("\n"));
console.log(`\n${fails === 0 ? "PASS" : "FAIL"}: ${fails} token pairs below threshold`);
cdp.close(); setTimeout(() => process.exit(fails ? 1 : 0), 300);
