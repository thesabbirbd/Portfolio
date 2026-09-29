const fs = require('fs');
let file = fs.readFileSync('src/components/hero/SpatialCore.tsx', 'utf8');

file = file.replace(/style=\{shouldReduceMotion \? undefined : \{ rotateX, rotateY, transformStyle: "preserve-3d" \}\}/g, 'style={shouldReduceMotion || isMobile ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}');

fs.writeFileSync('src/components/hero/SpatialCore.tsx', file);
