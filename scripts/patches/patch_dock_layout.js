const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

const oldWrapperStr = `{/* Dynamic Position Wrapper */}
      <motion.div 
        animate={{ 
          bottom: isNavHidden ? 16 : 140, 
          right: isNavHidden ? "50%" : 16,
          x: isNavHidden ? "50%" : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed z-[90] flex"
      >`;

const newWrapperStr = `{/* Dynamic Position Wrapper */}
      <div className="fixed inset-x-0 bottom-0 z-[90] pointer-events-none">
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={\`flex w-full \${
            isNavHidden 
              ? "justify-center pb-4 sm:pb-12"
              : "justify-end pb-[140px] pr-4 sm:pb-[90px] sm:pr-6"
          }\`}
        >`;

file = file.replace(oldWrapperStr, newWrapperStr);

// Also need to add layout to the inner motion.div to ensure it seamlessly participates
const innerMotionOld = `<motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-2xl bg-background/50"
        >`;

const innerMotionNew = `<motion.div 
          layout
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300, damping: 30 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="pointer-events-auto flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-2xl bg-background/50"
        >`;

file = file.replace(innerMotionOld, innerMotionNew);

// Add closing div for the new wrapper
file = file.replace(
  '        </motion.div>\n      </motion.div>\n    </>',
  '        </motion.div>\n        </motion.div>\n      </div>\n    </>'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
