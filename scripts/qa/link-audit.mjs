// Crawl every internal page reachable from the main routes; report non-200 links and missing #anchors.
// Usage: BASE=http://localhost:3100 node scripts/qa/link-audit.mjs
const BASE = process.env.BASE || "http://localhost:3000";
const start = ["/", "/about", "/projects", "/engineering-lab", "/notes", "/journal", "/experience", "/exploration", "/contact", "/resume", "/search"];
const seen = new Map(); const queue = [...start]; const links = []; const ext = new Map();
async function load(p) {
  if (seen.has(p)) return seen.get(p);
  const res = await fetch(BASE + p, { redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  const info = { status: res.status, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])), html };
  seen.set(p, info); return info;
}
while (queue.length) {
  const p = queue.shift(); const info = await load(p);
  if (info.status !== 200) continue;
  for (const m of info.html.matchAll(/<a\s[^>]*href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&"); links.push({ from: p, href });
    if (/^(https?:|mailto:|tel:)/.test(href)) { ext.set(href, (ext.get(href) || 0) + 1); continue; }
    const target = href.split("#")[0] || p;
    if (target.startsWith("/") && !target.startsWith("/_next") && !seen.has(target) && !queue.includes(target) && target.split("/").length <= 3) queue.push(target);
  }
}
const problems = new Set();
for (const { from, href } of links) {
  if (href === "" || href === "#") { problems.add(`EMPTY/# link on ${from}`); continue; }
  if (/^(https?:|mailto:|tel:)/.test(href)) continue;
  const [p, hash] = href.split("#"); const target = p || from; const info = await load(target);
  if (info.status !== 200) problems.add(`${info.status}  ${href}  (on ${from})`);
  else if (hash && !info.ids.has(hash)) problems.add(`MISSING #${hash} on ${target}  (link on ${from})`);
}
console.log(`Pages crawled: ${seen.size} (${[...seen.values()].filter((v) => v.status === 200).length} OK)`);
console.log("PROBLEMS:\n" + ([...problems].join("\n") || "none"));
if (process.argv.includes("--external")) console.log("EXTERNAL:\n" + [...ext.keys()].join("\n"));
process.exit(problems.size ? 1 : 0);
