const fs = require('fs');
let content = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');

// Replace the classes for the three buttons so they represent their true colors
content = content.replace(
  'colorTheme === "orange"\n                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"\n                          : "border-[var(--border-glass)] hover:border-[var(--color-primary)]/50 text-[var(--text-secondary)]"',
  'colorTheme === "orange" ? "border-[#ff6a00] bg-[#ff6a00]/10 text-[#ff6a00] font-bold" : "border-[var(--border-glass)] hover:border-[#ff6a00]/50 text-[var(--text-secondary)]"'
);

content = content.replace(
  'colorTheme === "blue"\n                          ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-bold dark:text-[var(--color-secondary)]"\n                          : "border-[var(--border-glass)] hover:border-[var(--color-secondary)]/50 text-[var(--text-secondary)]"',
  'colorTheme === "blue" ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] font-bold" : "border-[var(--border-glass)] hover:border-[#00f0ff]/50 text-[var(--text-secondary)]"'
);

content = content.replace(
  'colorTheme === "green"\n                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold dark:text-[var(--color-accent)]"\n                          : "border-[var(--border-glass)] hover:border-[var(--color-accent)]/50 text-[var(--text-secondary)]"',
  'colorTheme === "green" ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981] font-bold" : "border-[var(--border-glass)] hover:border-[#10b981]/50 text-[var(--text-secondary)]"'
);

fs.writeFileSync('src/components/ui/SettingsPanel.tsx', content);
