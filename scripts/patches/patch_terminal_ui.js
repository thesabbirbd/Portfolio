const fs = require('fs');
let file = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');

file = file.replace(
  '<span>terminal</span>',
  '<span className="hidden sm:inline">terminal</span>'
);

file = file.replace(
  '<span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">',
  '<span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">'
);

// Match the padding to look good as a circle on mobile and a pill on desktop
file = file.replace(
  'className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel',
  'className="flex items-center justify-center gap-2 p-3 sm:px-3 sm:py-1.5 rounded-full glass-panel'
);

// Scale up the icon slightly on mobile to match the Settings icon (w-5 h-5), but keep w-3.5 h-3.5 on sm
file = file.replace(
  '<Terminal className="w-3.5 h-3.5 text-[var(--color-secondary)]" />',
  '<Terminal className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-[var(--color-secondary)]" />'
);

fs.writeFileSync('src/components/ui/TerminalModal.tsx', file);
