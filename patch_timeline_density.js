const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

file = file.replace(/className="flex-1 space-y-16 md:space-y-48"/g, 'className="flex-1 space-y-12 md:space-y-48"');
file = file.replace(/className="p-5 md:p-10 w-full/g, 'className="p-4 md:p-10 w-full');
file = file.replace(/className="text-4xl md:text-6xl/g, 'className="text-3xl md:text-6xl');
file = file.replace(/className="text-2xl font-bold/g, 'className="text-xl md:text-2xl font-bold');
file = file.replace(/className="text-muted-foreground text-lg leading-relaxed/g, 'className="text-muted-foreground text-sm md:text-lg leading-relaxed');
file = file.replace(/className="flex items-center gap-4 mb-6"/g, 'className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6"');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
