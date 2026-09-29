const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

// I will make sure the dock wrapper uses the global glass-panel or glass-interactive styles 
file = file.replace(
  'className="flex items-center gap-1.5 spatial-glass-heavy rounded-full p-1.5 shadow-2xl border border-white/20 bg-background/40 backdrop-blur-3xl"',
  'className="flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/20"'
);

// I will also make sure the tooltips have a nice glass effect
file = file.replace(
  /bg-background\/80 backdrop-blur-md/g,
  'glass-panel backdrop-blur-lg'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
