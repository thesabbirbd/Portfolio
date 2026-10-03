const fs = require('fs');
const file = 'src/components/ui/FloatingGlassBackground.tsx';
let content = fs.readFileSync(file, 'utf8');

// Move inline useTransforms to the top
content = content.replace(
  'const yVeryFast = useTransform(scrollYProgress, [0, 1], [0, -1800]);',
  `const yVeryFast = useTransform(scrollYProgress, [0, 1], [0, -1800]);
  const yGlow1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yGlow2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const yGlow3 = useTransform(scrollYProgress, [0, 1], [0, -300]);`
);

// Replace inline usage
content = content.replace(
  /y: useTransform\(scrollYProgress, \[0, 1\], \[0, -100\]\)/g,
  'y: yGlow1'
);
content = content.replace(
  /y: useTransform\(scrollYProgress, \[0, 1\], \[0, -200\]\)/g,
  'y: yGlow2'
);
content = content.replace(
  /y: useTransform\(scrollYProgress, \[0, 1\], \[0, -300\]\)/g,
  'y: yGlow3'
);

fs.writeFileSync(file, content);
