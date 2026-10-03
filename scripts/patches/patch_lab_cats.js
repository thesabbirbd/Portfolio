const fs = require('fs');

let file = fs.readFileSync('src/components/lab/EngineeringLabSection.tsx', 'utf8');

// Ensure Palette is imported
if (!file.includes('Palette')) {
  file = file.replace('FlaskConical, Filter, Terminal, Cpu, Network, Sparkles, Video', 'FlaskConical, Filter, Terminal, Cpu, Network, Sparkles, Video, Palette');
}

file = file.replace(
  /const categories = \[\s*\{ id: "all", label: "All Disciplines", icon: FlaskConical \},\s*\{ id: "infrastructure", label: "Infrastructure Lab", icon: Network \},\s*\{ id: "ai", label: "AI Lab", icon: Sparkles \},\s*\{ id: "systems", label: "Systems Lab", icon: Terminal \},\s*\{ id: "hardware", label: "Hardware Lab", icon: Cpu \},\s*\{ id: "creative", label: "Creative Lab", icon: Video \},\s*\];/,
  `const categories = [
    { id: "all", label: "All Disciplines", icon: FlaskConical, colors: "bg-gradient-to-r from-slate-500/10 to-transparent border border-slate-500/20 text-slate-700 dark:text-slate-300", activeColors: "bg-gradient-to-r from-slate-500/20 to-slate-500/5 border-slate-500/40 text-slate-900 dark:text-white ring-1 ring-slate-500/20" },
    { id: "infrastructure", label: "Infrastructure Lab", icon: Network, colors: "bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent border border-blue-500/20 text-blue-600 dark:text-blue-400", activeColors: "bg-gradient-to-r from-blue-500/20 to-sky-500/5 border-blue-500/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20" },
    { id: "ai", label: "AI Lab", icon: Sparkles, colors: "bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-transparent border border-purple-500/20 text-purple-600 dark:text-purple-400", activeColors: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/5 border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20" },
    { id: "systems", label: "Systems Lab", icon: Terminal, colors: "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-emerald-600 dark:text-emerald-400", activeColors: "bg-gradient-to-r from-emerald-500/20 to-teal-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20" },
    { id: "hardware", label: "Hardware Lab", icon: Cpu, colors: "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 text-orange-600 dark:text-orange-400", activeColors: "bg-gradient-to-r from-orange-500/20 to-red-500/5 border-orange-500/40 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20" },
    { id: "creative", label: "Creative Lab", icon: Palette, colors: "bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-transparent border border-pink-500/20 text-pink-600 dark:text-pink-400", activeColors: "bg-gradient-to-r from-pink-500/20 to-rose-500/5 border-pink-500/40 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500/20" },
  ];`
);

fs.writeFileSync('src/components/lab/EngineeringLabSection.tsx', file);
