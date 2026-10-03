const fs = require('fs');

let file = fs.readFileSync('src/components/content/ContentCard.tsx', 'utf8');

if (!file.includes('getCardTheme')) {
  const helper = `
const getCardTheme = (cat: string) => {
  const normalized = (cat || '').toLowerCase();
  if (normalized.includes('ai') || normalized.includes('model') || normalized.includes('llm')) {
    return "hover:border-purple-500/30 hover:bg-purple-500/5 hover:shadow-purple-500/10";
  }
  if (normalized.includes('system') || normalized.includes('linux') || normalized.includes('devops') || normalized.includes('server')) {
    return "hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-emerald-500/10";
  }
  if (normalized.includes('hardware') || normalized.includes('rig')) {
    return "hover:border-orange-500/30 hover:bg-orange-500/5 hover:shadow-orange-500/10";
  }
  if (normalized.includes('infra') || normalized.includes('network')) {
    return "hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-blue-500/10";
  }
  return "hover:border-slate-500/30 hover:bg-slate-500/5 hover:shadow-slate-500/10";
};

const getBadgeTheme = (cat: string) => {
  const normalized = (cat || '').toLowerCase();
  if (normalized.includes('ai') || normalized.includes('model') || normalized.includes('llm')) {
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
  }
  if (normalized.includes('system') || normalized.includes('linux') || normalized.includes('devops') || normalized.includes('server')) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }
  if (normalized.includes('hardware') || normalized.includes('rig')) {
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
  }
  if (normalized.includes('infra') || normalized.includes('network')) {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
};
`;

  file = file.replace('export function ContentCard', helper + '\nexport function ContentCard');

  file = file.replace(
    'className="flex flex-col h-full p-4 sm:p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-accent/5 transition-all duration-300"',
    'className={`flex flex-col h-full p-4 sm:p-6 rounded-2xl border border-border/50 bg-background/50 transition-all duration-500 hover:shadow-xl ${getCardTheme(meta.category || "")}`}'
  );

  file = file.replace(
    'className="text-[9px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary/10 text-primary"',
    'className={`text-[9px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${getBadgeTheme(meta.category || "")}`}'
  );

  fs.writeFileSync('src/components/content/ContentCard.tsx', file);
}
