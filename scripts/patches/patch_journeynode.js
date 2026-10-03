const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

file = file.replace(/<GlassCard heavy className="p-8 w-full backdrop-blur-xl border-white\/10 hover:border-white\/20 transition-colors">/, '<GlassCard heavy hoverEffect={true} className="p-8 w-full backdrop-blur-xl border-white/10 hover:border-[var(--color-primary)]/50 transition-colors group/card">');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
