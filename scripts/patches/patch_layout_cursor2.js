const fs = require('fs');
let file = fs.readFileSync('src/app/layout.tsx', 'utf8');

file = file.replace('import { SmoothCursor } from "@/components/lightswind/smooth-cursor";', 'import { CustomCursor } from "@/components/ui/CustomCursor";');
file = file.replace('<SmoothCursor color="#ffffff" glowEffect={false} rotateOnMove={false} scaleOnClick={true} magneticElements="button, a" magneticDistance={40} />', '<CustomCursor />');

fs.writeFileSync('src/app/layout.tsx', file);
