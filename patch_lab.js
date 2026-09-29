const fs = require('fs');

let file = fs.readFileSync('src/components/lab/EngineeringLabSection.tsx', 'utf8');

file = file.replace(
  'className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"',
  'className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"'
);

file = file.replace(
  'className="flex flex-col items-center text-center mb-12"',
  'className="flex flex-col items-center text-center mb-6 sm:mb-12"'
);

file = file.replace(
  'className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4"',
  'className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2 sm:mb-4"'
);

file = file.replace(
  'className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]"',
  'className="max-w-2xl text-xs sm:text-lg text-[var(--text-muted)] px-4 sm:px-0"'
);

file = file.replace(
  'className="flex flex-wrap items-center justify-center gap-2 mb-10"',
  'className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-10"'
);

file = file.replace(
  'className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${',
  'className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all ${'
);

file = file.replace(
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"',
  'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"'
);

file = file.replace(
  'className="group relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"',
  'className="group relative flex flex-col justify-between p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"'
);

file = file.replace(
  'className="flex items-center justify-between gap-2 mb-3"',
  'className="flex items-center justify-between gap-2 mb-2 sm:mb-3"'
);

file = file.replace(
  'className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-md',
  'className="px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-xs font-mono font-medium rounded-md'
);

file = file.replace(
  'className="text-xs px-2 py-0.5 rounded-full font-medium',
  'className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium'
);

file = file.replace(
  'className="text-xs text-[var(--text-muted)] font-mono"',
  'className="text-[9px] sm:text-xs text-[var(--text-muted)] font-mono"'
);

file = file.replace(
  'className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors"',
  'className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1 sm:mb-2 group-hover:text-[var(--color-primary)] transition-colors"'
);

file = file.replace(
  'className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed"',
  'className="text-[11px] sm:text-sm text-[var(--text-secondary)] mb-2 sm:mb-4 leading-snug sm:leading-relaxed"'
);

file = file.replace(
  'className="p-3 rounded-xl glass-subtle border border-[var(--border-glass)] text-xs font-mono text-[var(--text-muted)] mb-4"',
  'className="p-2 sm:p-3 rounded-lg sm:rounded-xl glass-subtle border border-[var(--border-glass)] text-[9px] sm:text-xs font-mono text-[var(--text-muted)] mb-2 sm:mb-4"'
);

file = file.replace(
  'className="pt-4 border-t border-[var(--border-glass)]"',
  'className="pt-2 sm:pt-4 border-t border-[var(--border-glass)]"'
);

file = file.replace(
  'className="px-2 py-1 rounded text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--color-primary)]/5 border border-[var(--border-glass)]"',
  'className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--color-primary)]/5 border border-[var(--border-glass)]"'
);

fs.writeFileSync('src/components/lab/EngineeringLabSection.tsx', file);
