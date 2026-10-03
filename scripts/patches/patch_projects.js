const fs = require('fs');

// Patch ProjectsSection.tsx
let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

file = file.replace(
  'className="flex flex-col items-center text-center mb-16"',
  'className="flex flex-col items-center text-center mb-6 sm:mb-16"'
);
file = file.replace(
  'className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-4"',
  'className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-2 sm:mb-4"'
);
file = file.replace(
  'className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"',
  'className="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0"'
);
file = file.replace(
  'className="mb-10 overflow-x-auto pb-2 scrollbar-none"',
  'className="mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none"'
);
file = file.replace(
  'px-4 py-1.5 rounded-full text-xs font-semibold',
  'px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold'
);
file = file.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"',
  'className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5"'
);
// Adjust card internal padding and text to fit grid-cols-2 on mobile
file = file.replace(
  'aspect-video sm:aspect-auto sm:h-40',
  'aspect-video sm:aspect-auto h-24 sm:h-40'
);
file = file.replace(
  'className="p-4 flex flex-col justify-between flex-grow space-y-4"',
  'className="p-2 sm:p-4 flex flex-col justify-between flex-grow space-y-2 sm:space-y-4"'
);
file = file.replace(
  'className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1"',
  'className="text-[11px] sm:text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1"'
);
file = file.replace(
  'className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2"',
  'className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1.5 leading-tight sm:leading-relaxed line-clamp-2"'
);
file = file.replace(
  'className="space-y-3"',
  'className="space-y-1.5 sm:space-y-3"'
);

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', file);
