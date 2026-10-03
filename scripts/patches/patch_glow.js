const fs = require('fs');
let file = fs.readFileSync('src/components/ui/GlowButton.tsx', 'utf8');

file = file.replace(/import \{ hoverSoft, pressSoft \} from "@\/lib\/motion-presets";/, 'import { hoverLift, pressScale } from "@/lib/motion-presets";');
file = file.replace(/whileHover=\{\{ scale: 1.03 \}\}\n      whileTap=\{\{ scale: 0.96 \}\}\n      transition=\{\{ type: "spring", stiffness: 400, damping: 20 \}\}/, 'whileHover={hoverLift}\n      whileTap={pressScale}');

fs.writeFileSync('src/components/ui/GlowButton.tsx', file);
