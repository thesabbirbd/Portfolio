const fs = require('fs');

let file = fs.readFileSync('src/components/maps/MapsExplorerSection.tsx', 'utf8');

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
  'className="rounded-3xl glass-emerald p-6 sm:p-10 border border-[var(--color-accent)]/25 shadow-xl relative overflow-hidden"',
  'className="rounded-2xl sm:rounded-3xl glass-emerald p-4 sm:p-10 border border-[var(--color-accent)]/25 shadow-xl relative overflow-hidden"'
);
file = file.replace(
  'className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"',
  'className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center"'
);
file = file.replace(
  'className="lg:col-span-7 space-y-5"',
  'className="lg:col-span-7 space-y-3 sm:space-y-5"'
);
file = file.replace(
  'className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]"',
  'className="text-lg sm:text-3xl font-bold text-[var(--text-primary)] leading-tight"'
);
file = file.replace(
  'className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"',
  'className="text-[11px] sm:text-base text-[var(--text-secondary)] leading-snug sm:leading-relaxed"'
);
file = file.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"',
  'className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2"'
);
file = file.replace(
  'className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]"',
  'className="flex items-start gap-2 sm:gap-2.5 text-[10px] sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-normal"'
);
file = file.replace(
  'className="flex flex-wrap items-center gap-3 pt-4"',
  'className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4"'
);
file = file.replace(
  'className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-white transition-colors shadow-md shadow-emerald-600/20"',
  'className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-white transition-colors shadow-md shadow-emerald-600/20"'
);

fs.writeFileSync('src/components/maps/MapsExplorerSection.tsx', file);
