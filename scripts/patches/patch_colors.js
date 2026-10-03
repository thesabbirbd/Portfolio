const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('find src/components src/app -type f -name "*.tsx"').toString().split('\n').filter(Boolean);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace hardcoded orange, cyan, emerald with theme variables
  if (content.match(/orange-[0-9]{3}/)) {
    content = content.replace(/text-orange-[456]00/g, 'text-[var(--color-primary)]');
    content = content.replace(/bg-orange-[456]00\/[0-9]+/g, 'bg-[var(--color-primary)]/10');
    content = content.replace(/bg-orange-[456]00/g, 'bg-[var(--color-primary)]');
    content = content.replace(/border-orange-[456]00/g, 'border-[var(--color-primary)]');
    changed = true;
  }
  if (content.match(/cyan-[0-9]{3}/)) {
    content = content.replace(/text-cyan-[456]00/g, 'text-[var(--color-secondary)]');
    content = content.replace(/bg-cyan-[456]00\/[0-9]+/g, 'bg-[var(--color-secondary)]/10');
    content = content.replace(/bg-cyan-[456]00/g, 'bg-[var(--color-secondary)]');
    content = content.replace(/border-cyan-[456]00/g, 'border-[var(--color-secondary)]');
    changed = true;
  }
  if (content.match(/emerald-[0-9]{3}/)) {
    content = content.replace(/text-emerald-[456]00/g, 'text-[var(--color-accent)]');
    content = content.replace(/bg-emerald-[456]00\/[0-9]+/g, 'bg-[var(--color-accent)]/10');
    content = content.replace(/bg-emerald-[456]00/g, 'bg-[var(--color-accent)]');
    content = content.replace(/border-emerald-[456]00/g, 'border-[var(--color-accent)]');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
});
