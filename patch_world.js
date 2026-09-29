const fs = require('fs');
let file = fs.readFileSync('src/components/about/AboutSection.tsx', 'utf8');

file = file.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"',
  'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4"'
);

file = file.replace(
  'className="relative p-3 sm:p-4 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-row sm:flex-col items-center sm:items-start text-left sm:justify-between min-h-[auto] sm:min-h-[140px] cursor-default"',
  'className="relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col items-start text-left justify-between min-h-[100px] sm:min-h-[140px] cursor-default"'
);

file = file.replace(
  'className="flex-shrink-0 mr-3 sm:mr-0 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto rounded-full bg-[var(--color-primary)]/10 sm:bg-transparent"',
  'className="flex-shrink-0 mb-1 sm:mb-0 flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto rounded-full bg-[var(--color-primary)]/10 sm:bg-transparent"'
);

fs.writeFileSync('src/components/about/AboutSection.tsx', file);
