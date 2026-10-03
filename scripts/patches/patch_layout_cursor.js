const fs = require('fs');
let file = fs.readFileSync('src/app/layout.tsx', 'utf8');

file = file.replace(/import { SmoothCursor } from "@\\/components\\/lightswind\\/smooth-cursor";/, 'import { CustomCursor } from "@/components/ui/CustomCursor";');
file = file.replace(/<SmoothCursor .*\\/>/, '<CustomCursor />');

fs.writeFileSync('src/app/layout.tsx', file);
