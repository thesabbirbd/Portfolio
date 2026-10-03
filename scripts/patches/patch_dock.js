const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

// Find the Dynamic Position Wrapper
const searchStr = '{/* Dynamic Position Wrapper */}';
const startIndex = file.indexOf(searchStr);
const motionEndIndex = file.indexOf('>', startIndex + searchStr.length); // End of the motion.div opening tag

const newWrapper = `      {/* Dynamic Position Wrapper */}
      <motion.div 
        animate={{ 
          bottom: isNavHidden ? 16 : 140, 
          right: isNavHidden ? "50%" : 16,
          x: isNavHidden ? "50%" : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed z-[90] flex"
      >`;

file = file.substring(0, startIndex) + newWrapper + file.substring(motionEndIndex + 1);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
