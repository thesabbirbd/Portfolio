const { performance } = require('perf_hooks');

const explicitContent = Array.from({ length: 50 }, (_, i) => ({ meta: { slug: `explicit-${i}` } }));
const backlinks = Array.from({ length: 50 }, (_, i) => ({ meta: { slug: i % 2 === 0 ? `explicit-${i}` : `backlink-${i}` } }));

const startOld = performance.now();
for (let j = 0; j < 10000; j++) {
  const result = [...explicitContent, ...backlinks].map((item, idx) => {
    if (idx > 0 && [...explicitContent, ...backlinks].findIndex(i => i.meta.slug === item.meta.slug) !== idx) return null;
    return item;
  }).filter(Boolean);
}
const endOld = performance.now();

const startNew = performance.now();
for (let j = 0; j < 10000; j++) {
  const seen = new Set();
  const result = [...explicitContent, ...backlinks].filter(item => {
    if (seen.has(item.meta.slug)) return false;
    seen.add(item.meta.slug);
    return true;
  }).map(item => item);
}
const endNew = performance.now();

console.log(`Old method (O(N^2)): ${endOld - startOld}ms`);
console.log(`New method (O(N)): ${endNew - startNew}ms`);
console.log(`Improvement: ${((endOld - startOld) / (endNew - startNew)).toFixed(2)}x faster`);
