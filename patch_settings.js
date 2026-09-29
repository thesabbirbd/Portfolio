const fs = require('fs');
let file = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');

// Add useSpatialScroll import
if (!file.includes('useSpatialScroll')) {
  file = file.replace(
    'import { useSettings } from "@/contexts/SettingsContext";',
    'import { useSettings } from "@/contexts/SettingsContext";\nimport { useSpatialScroll } from "@/hooks/useSpatialScroll";'
  );
}

if (!file.includes('useMotionValueEvent')) {
  file = file.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";'
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
  'if (!isHydrated) return null;',
  logic + '\n  if (!isHydrated) return null;'
);

// Replace button with motion.button
const oldButtonStr = `<button
        onClick={() => {
          setIsOpen(!isOpen);
          sound.click();
        }}
        aria-label="Open System Settings"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0 p-3 rounded-full glass-panel shadow-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >`;

const newButtonStr = `<motion.button
        animate={{ bottom: isNavHidden ? 16 : 80, right: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => {
          setIsOpen(!isOpen);
          sound.click();
        }}
        aria-label="Open System Settings"
        className="fixed z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0 p-3 rounded-full glass-panel shadow-lg text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >`;

file = file.replace(oldButtonStr, newButtonStr);
file = file.replace(
  '<Settings className="w-5 h-5 animate-spin-slow" />\n      </button>',
  '<Settings className="w-5 h-5 animate-spin-slow" />\n      </motion.button>'
);

fs.writeFileSync('src/components/ui/SettingsPanel.tsx', file);
