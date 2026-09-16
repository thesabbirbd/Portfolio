const fs = require('fs');
const file = 'src/components/hero/SpatialCore.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Increase orbitRadius
content = content.replace(
  'const orbitRadius = isMobile ? 95 : 140;',
  'const orbitRadius = isMobile ? 115 : 175;'
);

// 2. Increase container max-w
content = content.replace(
  'sm:max-w-[420px]',
  'sm:max-w-[500px]'
);

// 3. Fix Image sizes and quality
content = content.replace(
  'sizes="(max-width: 640px) 144px, 208px"',
  'sizes="(max-width: 768px) 300px, 600px"\n              quality={100}'
);

// 4. Center orbital nodes
content = content.replace(
  'transform: `translate(${x}px, ${y}px)`,',
  'left: "50%",\n                top: "50%",\n                marginLeft: x,\n                marginTop: y,\n                x: "-50%",\n                y: "-50%ädt",'
);

// Ah wait, I added an 'ädt' typo. Let me fix the replace string.
content = content.replace(
  'y: "-50%ädt",',
  'y: "-50%",'
);

fs.writeFileSync(file, content);
