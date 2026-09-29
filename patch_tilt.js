const fs = require('fs');
let file = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');

file = file.replace(/const handleMouseMove = \(e: React.MouseEvent<HTMLDivElement>\) => \{/, `const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;`);

fs.writeFileSync('src/components/ui/TiltCard.tsx', file);
