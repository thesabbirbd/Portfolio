const fs = require('fs');

let file = fs.readFileSync('src/components/content/LatestThinking.tsx', 'utf8');
file = file.replace(
  'className="py-12 md:py-24 relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6"',
  'className="py-8 sm:py-12 md:py-24 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6"'
);
file = file.replace(
  'className="flex flex-col md:flex-row justify-between items-end mb-12"',
  'className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-12"'
);
file = file.replace(
  'className="text-3xl md:text-5xl font-bold tracking-tight mb-4"',
  'className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-2 sm:mb-4"'
);
file = file.replace(
  'className="text-lg text-muted-foreground max-w-xl"',
  'className="text-xs sm:text-lg text-muted-foreground max-w-xl"'
);
file = file.replace(
  'className="mt-6 md:mt-0 flex gap-4"',
  'className="mt-4 md:mt-0 flex gap-4"'
);
fs.writeFileSync('src/components/content/LatestThinking.tsx', file);

let card = fs.readFileSync('src/components/content/ContentCard.tsx', 'utf8');
card = card.replace(
  'className="flex flex-col h-full p-6',
  'className="flex flex-col h-full p-4 sm:p-6'
);
card = card.replace(
  'className="flex items-center gap-3 mb-4"',
  'className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4"'
);
card = card.replace(
  'className="text-xs font-medium px-2.5 py-1',
  'className="text-[9px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1'
);
card = card.replace(
  'className="text-xs text-muted-foreground"',
  'className="text-[9px] sm:text-xs text-muted-foreground"'
);
card = card.replace(
  'className="text-xl font-semibold mb-2',
  'className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2'
);
card = card.replace(
  'className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4 flex-grow"',
  'className="text-muted-foreground line-clamp-2 sm:line-clamp-3 text-[11px] sm:text-sm leading-snug sm:leading-relaxed mb-2 sm:mb-4 flex-grow"'
);
card = card.replace(
  'className="flex flex-wrap gap-2 mt-auto"',
  'className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-auto"'
);
card = card.replace(
  'className="text-[10px] uppercase',
  'className="text-[8px] sm:text-[10px] uppercase'
);
fs.writeFileSync('src/components/content/ContentCard.tsx', card);
