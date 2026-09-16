const fs = require('fs');
let content = fs.readFileSync('src/components/hero/SpatialCore.tsx', 'utf8');

// Remove window event listeners for mousemove/touchmove
content = content.replace(
  /const handleMouseMove = \(e: MouseEvent\) => {[\s\S]*?};/,
  ''
);
content = content.replace(
  /const handleTouchMove = \(e: TouchEvent\) => {[\s\S]*?};/,
  ''
);
content = content.replace(
  /window\.addEventListener\("mousemove", handleMouseMove, { passive: true }\);\s*window\.addEventListener\("touchmove", handleTouchMove, { passive: true }\);/,
  ''
);
content = content.replace(
  /window\.removeEventListener\("mousemove", handleMouseMove\);\s*window\.removeEventListener\("touchmove", handleTouchMove\);/,
  ''
);

// Fix the return div to handle onMouseMove and onMouseLeave
const mouseEvents = `
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Fix direction: usually moving mouse right should tilt it to the right (rotateY positive)
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[500px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000"
    >
`;

content = content.replace(
  'return (\n    <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[500px] aspect-square mx-auto flex items-center justify-center select-none perspective-1000">\n      {/* 3 Vibrant Ambient Glow Backdrops */}',
  mouseEvents + '\n      {/* 3 Vibrant Ambient Glow Backdrops */}'
);

// Fix direction mapping. 
// If mouse is at top (negative Y), we want the top to tilt backwards (positive rotateX).
// If mouse is at right (positive X), we want the right to tilt backwards (positive rotateY).
content = content.replace(
  'const rotateX = useTransform(smoothY, [-180, 180], [16, -16]);',
  'const rotateX = useTransform(smoothY, [-250, 250], [-16, 16]);'
);
content = content.replace(
  'const rotateY = useTransform(smoothX, [-180, 180], [-16, 16]);',
  'const rotateY = useTransform(smoothX, [-250, 250], [16, -16]);'
);

fs.writeFileSync('src/components/hero/SpatialCore.tsx', content);
