const fs = require('fs');
let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

file = file.replace(/className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"/, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"');
file = file.replace(/className="relative w-full h-36 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200\/50 dark:border-white\/10"/, 'className="relative w-full aspect-video sm:aspect-auto sm:h-40 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-white/10"');
file = file.replace(/className=\{`relative w-full h-36 overflow-hidden bg-gradient-to-br \$\{project.gradient\} bg-opacity-20 border-b border-slate-200\/50 dark:border-white\/10 flex flex-col items-center justify-center text-slate-800 dark:text-white`\}/, 'className={`relative w-full aspect-video sm:aspect-auto sm:h-40 overflow-hidden bg-gradient-to-br ${project.gradient} bg-opacity-20 border-b border-slate-200/50 dark:border-white/10 flex flex-col items-center justify-center text-slate-800 dark:text-white`}');

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', file);
