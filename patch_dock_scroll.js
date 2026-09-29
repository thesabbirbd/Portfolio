const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

// Add imports
file = file.replace(
  'import { motion, AnimatePresence } from "framer-motion";',
  'import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";\nimport { useSpatialScroll } from "@/hooks/useSpatialScroll";'
);

// Add scroll logic inside IdentityDock component
const logicToInsert = `
  const { scrollY } = useSpatialScroll();
  const [isNavHidden, setIsNavHidden] = useState(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) {
      setIsNavHidden(true); // scrolling down -> Nav is HIDDEN -> IdentityDock should be at BOTTOM MIDDLE
    } else {
      setIsNavHidden(false); // scrolling up/idle -> Nav is VISIBLE -> IdentityDock should be at RIGHT
    }
  });
`;

file = file.replace(
  'const { spatial3D, toggle3D } = useSettings();',
  'const { spatial3D, toggle3D } = useSettings();' + logicToInsert
);

// Replace className string with dynamic cn() and motion layout
// Current: <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[90]">
// We will change it to motion.div with layout so it animates smoothly.
file = file.replace(
  '<div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[90]">',
  `{/* Dynamic Position Wrapper */}
      <motion.div 
        layout
        className={\`fixed z-[90] transition-all duration-700 ease-in-out \${
          !isNavHidden 
            ? "bottom-[130px] right-4 sm:bottom-[90px] sm:right-6" 
            : "bottom-12 left-1/2 -translate-x-1/2"
        }\`}
      >`
);

file = file.replace(
  '</motion.div>\n      </div>\n    </>',
  '</motion.div>\n      </motion.div>\n    </>'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
