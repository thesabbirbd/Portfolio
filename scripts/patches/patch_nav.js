const fs = require('fs');

let nav = fs.readFileSync('src/components/navigation/MorphingNav.tsx', 'utf8');

// The mobile nav
nav = nav.replace(
  'className={cn("fixed inset-x-4 bottom-4 mb-[env(safe-area-inset-bottom)] z-50 flex md:hidden justify-between items-center px-4 py-3 rounded-full glass-panel backdrop-blur-2xl bg-background/50 transition-transform duration-500", hidden ? "translate-y-[150%]" : "translate-y-0")}',
  'className={cn("fixed left-1/2 bottom-4 mb-[env(safe-area-inset-bottom)] z-50 flex md:hidden justify-between items-center px-3 py-2 gap-2 rounded-full glass-panel backdrop-blur-2xl bg-background/50 transition-transform duration-500 w-max", hidden ? "translate-y-[150%] -translate-x-1/2" : "translate-y-0 -translate-x-1/2")}'
);
nav = nav.replace(
  'className="flex items-center gap-1"',
  'className="flex items-center gap-0.5"'
);
nav = nav.replace(
  'className="relative w-8 h-8 overflow-hidden rounded-full border border-white/20"',
  'className="relative w-7 h-7 overflow-hidden rounded-full border border-white/20"'
);
nav = nav.replace(
  'className={`w-5 h-5 ${item.colorClass} icon-3d-punchy transition-transform group-hover:scale-110`}',
  'className={`w-4 h-4 ${item.colorClass} icon-3d-punchy transition-transform group-hover:scale-110`}'
);
nav = nav.replace(
  'className="p-2 text-foreground/80 hover:text-foreground group"',
  'className="p-1.5 text-foreground/80 hover:text-foreground group"'
);
nav = nav.replace(
  'className="w-5 h-5 text-fuchsia-500 icon-3d-punchy transition-transform hover:scale-110"',
  'className="w-4 h-4 text-fuchsia-500 icon-3d-punchy transition-transform hover:scale-110"'
);

fs.writeFileSync('src/components/navigation/MorphingNav.tsx', nav);
