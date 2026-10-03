const fs = require('fs');

let file = fs.readFileSync('src/components/skills/SkillsBento.tsx', 'utf8');
file = file.replace(
  'className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"',
  'className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"'
);
file = file.replace(
  'className="flex flex-col items-center text-center mb-16"',
  'className="flex flex-col items-center text-center mb-6 sm:mb-16"'
);
file = file.replace(
  'className="text-3xl md:text-5xl font-black tracking-tighter text-[var(--text-primary)] mb-4"',
  'className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-[var(--text-primary)] mb-2 sm:mb-4"'
);
file = file.replace(
  'className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"',
  'className="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0"'
);
file = file.replace(
  'className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"',
  'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"'
);
file = file.replace(
  'className="p-6 rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"',
  'className="p-3 sm:p-6 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] hover:border-[var(--border-glass-hover)] transition-all"'
);
file = file.replace(
  'className="flex items-center gap-4 mb-6"',
  'className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6"'
);
file = file.replace(
  'className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}',
  'className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${cat.color}`}'
);
file = file.replace(
  'className="w-6 h-6"',
  'className="w-4 h-4 sm:w-6 sm:h-6"'
);
file = file.replace(
  'className="text-xl font-bold text-[var(--text-primary)]"',
  'className="text-sm sm:text-xl font-bold text-[var(--text-primary)]"'
);
file = file.replace(
  'className="text-sm text-[var(--text-secondary)]"',
  'className="text-[10px] sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-normal"'
);
file = file.replace(
  'className="flex flex-wrap gap-2"',
  'className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-0"'
);
file = file.replace(
  'className="px-3 py-1.5 rounded-lg text-sm font-medium glass-subtle border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--color-primary)]/50 transition-colors"',
  'className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-medium glass-subtle border border-[var(--border-glass)] text-[var(--text-primary)] hover:border-[var(--color-primary)]/50 transition-colors"'
);
fs.writeFileSync('src/components/skills/SkillsBento.tsx', file);
