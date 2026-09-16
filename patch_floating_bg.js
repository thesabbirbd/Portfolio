const fs = require('fs');
const file = 'src/components/ui/FloatingGlassBackground.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import SpatialScene')) {
  content = content.replace(
    'import { Database',
    'import SpatialScene from "@/components/spatial/SpatialScene";\nimport { Database'
  );
  
  content = content.replace(
    '{/* ================= VIBRANT AMBIENT GLOW ORBS ================= */}',
    '{/* True 3D Spatial Layer (Desktop only) */}\n      <div className="hidden md:block">\n        <SpatialScene />\n      </div>\n\n      {/* ================= VIBRANT AMBIENT GLOW ORBS ================= */}'
  );
  
  fs.writeFileSync(file, content);
}
