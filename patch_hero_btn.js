const fs = require('fs');
let file = fs.readFileSync('src/components/hero/HeroSection.tsx', 'utf8');

file = file.replace(/<GlowButton href="\/#work" variant="glass" size="lg" icon=\{<ArrowRight className="w-4 h-4" \/>\}>/, `<GlowButton href="/#work" variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>`);

fs.writeFileSync('src/components/hero/HeroSection.tsx', file);
