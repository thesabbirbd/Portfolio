const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

const replacement = `
      {/* Sticky Timeline Rail */}
      <div className="hidden md:flex flex-col items-center sticky top-32 h-[60vh] w-24 shrink-0">
        <div ref={railRef} className="w-1.5 bg-muted/50 rounded-full h-full relative cursor-pointer" onClick={(e) => {
            if(!railRef.current || !containerRef.current) return;
            const rect = railRef.current.getBoundingClientRect();
            const percent = (e.clientY - rect.top) / rect.height;
            const scrollableDistance = containerRef.current.getBoundingClientRect().height - window.innerHeight + 200;
            const targetScrollY = window.scrollY + containerRef.current.getBoundingClientRect().top + (scrollableDistance * Math.max(0, Math.min(1, percent)));
            window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        }}>
          <motion.div 
            className="absolute top-0 w-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] pointer-events-none"
            style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
          />
          
          <motion.div
            drag="y"
            dragConstraints={railRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(e, info) => {
                if(!railRef.current || !containerRef.current) return;
                const rect = railRef.current.getBoundingClientRect();
                const percent = (info.point.y - rect.top) / rect.height;
                const scrollableDistance = containerRef.current.getBoundingClientRect().height - window.innerHeight + 200;
                const targetScrollY = window.scrollY + containerRef.current.getBoundingClientRect().top + (scrollableDistance * Math.max(0, Math.min(1, percent)));
                window.scrollTo({ top: targetScrollY, behavior: 'instant' });
            }}
            className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground shadow-lg cursor-grab active:cursor-grabbing border-4 border-background z-10"
            style={{ top: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
      </div>
`;

// Also need to add railRef definition
const topReplacement = `
function TimelineExplorerView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
`;

file = file.replace(/function TimelineExplorerView\(\) \{[\s\S]*?const containerRef = useRef<HTMLDivElement>\(null\);/, topReplacement);

const railPattern = /\{\/\* Sticky Timeline Rail \*\/\}.*?\{\/\* Content Stream \*\/\}/s;
file = file.replace(railPattern, replacement.trim() + '\n\n      {/* Content Stream */}');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
