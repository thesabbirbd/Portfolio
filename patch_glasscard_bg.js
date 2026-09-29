const fs = require('fs');
let file = fs.readFileSync('src/components/ui/GlassCard.tsx', 'utf8');

file = file.replace(/background: "radial-gradient\\(400px circle at var\\(--x, 0\\) var\\(--y, 0\\), rgba\\(255,255,255,0.06\\), transparent 40%\\)",/g, 'background: "radial-gradient(circle at center, rgba(255,255,255,0.06), transparent 70%)",');

fs.writeFileSync('src/components/ui/GlassCard.tsx', file);
