const fs = require('fs');
let file = fs.readFileSync('src/components/ui/glass/GlassButton.tsx', 'utf8');

file = file.replace(/const handleMouseMove = \(e: React.MouseEvent<HTMLButtonElement>\) => \{/, `const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Disable magnetic effect on touch devices and if user prefers reduced motion
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isTouch || prefersReducedMotion) return;
    }`);

file = file.replace(/whileTap=\{\{ scale: 0.95 \}\}/, 'whileTap={{ scale: 0.97 }}');

fs.writeFileSync('src/components/ui/glass/GlassButton.tsx', file);
