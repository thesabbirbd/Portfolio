const fs = require('fs');

let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

file = file.replace(
  /const CATEGORIES = \[\s*\{ key: "all", label: "All Builds" \},\s*\{ key: "Featured", label: "Featured" \},\s*\{ key: "Systems", label: "Systems & Linux" \},\s*\{ key: "AI", label: "AI & Models" \},\s*\{ key: "Hardware", label: "Hardware & Rigs" \},\s*\];/,
  `const CATEGORIES = [
  { key: "all", label: "All Builds", icon: Layers, colors: "bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 text-slate-700 dark:text-slate-300", activeColors: "bg-gradient-to-r from-slate-500/20 to-slate-500/5 border-slate-500/40 text-slate-900 dark:text-white ring-1 ring-slate-500/20" },
  { key: "Featured", label: "Featured", icon: Star, colors: "bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-amber-600 dark:text-amber-400", activeColors: "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20" },
  { key: "Systems", label: "Systems & Linux", icon: Terminal, colors: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400", activeColors: "bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20" },
  { key: "AI", label: "AI & Models", icon: Sparkles, colors: "bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 text-purple-600 dark:text-purple-400", activeColors: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/5 border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20" },
  { key: "Hardware", label: "Hardware & Rigs", icon: Cpu, colors: "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 text-orange-600 dark:text-orange-400", activeColors: "bg-gradient-to-r from-orange-500/20 to-red-500/5 border-orange-500/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20" },
];`
);

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', file);
