const fs = require('fs');

let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

const helper = `
const getProjectCardHover = (cat: string) => {
  switch (cat) {
    case "AI": return "hover:border-purple-500/40 hover:bg-purple-500/5 hover:shadow-purple-500/10";
    case "Systems": return "hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-emerald-500/10";
    case "Hardware": return "hover:border-orange-500/40 hover:bg-orange-500/5 hover:shadow-orange-500/10";
    case "Featured": return "hover:border-amber-500/40 hover:bg-amber-500/5 hover:shadow-amber-500/10";
    default: return "hover:border-blue-500/40 hover:bg-blue-500/5 hover:shadow-blue-500/10";
  }
};
`;

if (!file.includes('getProjectCardHover')) {
  file = file.replace('const CATEGORIES = [', helper + '\nconst CATEGORIES = [');
  file = file.replace(
    'className="h-full flex flex-col justify-between overflow-hidden group border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl"',
    'className={`h-full flex flex-col justify-between overflow-hidden group border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md rounded-2xl transition-all duration-500 ${getProjectCardHover(project.category)}`}'
  );
  fs.writeFileSync('src/components/projects/ProjectsSection.tsx', file);
}
