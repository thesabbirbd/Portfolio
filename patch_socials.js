const fs = require('fs');

let footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
footer = footer.replace(
  'className="p-2.5 rounded-xl bg-zinc-900/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-all group"',
  'className="p-2.5 rounded-2xl bg-zinc-900/30 hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl hover:shadow-black/20"'
);

// If there are other social links elsewhere:
let identity = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');
// Actually identity dock icons are already inside a dock.

fs.writeFileSync('src/components/layout/Footer.tsx', footer);
