const fs = require('fs');
let file = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');

// Add imports
if (!file.includes('useSpatialScroll')) {
  file = file.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";\nimport { useSpatialScroll } from "@/hooks/useSpatialScroll";'
  );
}

// Add scroll logic
const logic = `
  const { scrollY } = useSpatialScroll();
  const [isNavHidden, setIsNavHidden] = useState(false);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) {
      setIsNavHidden(true); // scrolling down
    } else {
      setIsNavHidden(false); // scrolling up/idle
    }
  });
`;

file = file.replace(
  '  useEffect(() => {',
  logic + '\n  useEffect(() => {'
);

// Replace fixed wrapper with motion.div
const oldWrapper = '<div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0">';
const newWrapper = `<motion.div 
        animate={{ bottom: isNavHidden ? 16 : 80, left: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0"
      >`;

file = file.replace(oldWrapper, newWrapper);
file = file.replace(
  '        </motion.button>\n      </div>',
  '        </motion.button>\n      </motion.div>'
);

fs.writeFileSync('src/components/ui/TerminalModal.tsx', file);
