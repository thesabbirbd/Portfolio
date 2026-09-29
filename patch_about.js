const fs = require('fs');
let file = fs.readFileSync('src/components/about/AboutSection.tsx', 'utf8');

file = file.replace(/className="p-5 rounded-2xl glass-interactive border border-\[var\(--border-glass\)\] space-y-2"/g, 'className="p-4 sm:p-5 rounded-2xl glass-interactive border border-[var(--border-glass)] space-y-1.5 sm:space-y-2"');

fs.writeFileSync('src/components/about/AboutSection.tsx', file);
