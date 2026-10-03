const fs = require('fs');
const file = 'src/components/projects/ProjectsSection.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ImageViewer')) {
  content = content.replace(
    'import { ProjectModal } from "./ProjectModal";',
    'import { ProjectModal } from "./ProjectModal";\nimport { ImageViewer } from "@/components/ui/ImageViewer";'
  );
  
  content = content.replace(
    'const [activeScreenIndex, setActiveScreenIndex] = useState(0);',
    'const [activeScreenIndex, setActiveScreenIndex] = useState(0);\n  const [viewerOpen, setViewerOpen] = useState(false);'
  );
  
  content = content.replace(
    '<div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden mt-2 bg-slate-950">',
    '<div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden mt-2 bg-slate-950 cursor-pointer" onClick={() => { setViewerOpen(true); sound.click(); }}>'
  );
  
  content = content.replace(
    '</AnimatePresence>\n    </section>',
    '</AnimatePresence>\n      <ImageViewer isOpen={viewerOpen} images={SCREENS} initialIndex={activeScreenIndex} onClose={() => setViewerOpen(false)} />\n    </section>'
  );
  
  fs.writeFileSync(file, content);
}
