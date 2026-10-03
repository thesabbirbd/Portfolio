const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

file = file.replace(
  '<motion.div \n        initial={{ y: 50, opacity: 0, x: "-50%" }}\n        animate={{ y: 0, opacity: 1, x: "-50%" }}\n        transition={{ delay: 1, type: "spring" }}\n        onMouseEnter={handleMouseEnter}\n        onMouseLeave={handleMouseLeave}\n        className="fixed bottom-12 left-1/2 z-[90] flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10"\n      >',
  `<div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[90]">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-2xl bg-background/50"
      >`
);

file = file.replace(
  /<\/motion\.div>\n    <\/div>/, // Wait, it currently ends with </motion.div>\n    </>
  '</motion.div>\n    </div>\n    </>'
);
// Actually, let's just use string replace on the exact ending.
file = file.replace(
  '        </button>\n      </motion.div>\n    </>\n  );\n}',
  '        </button>\n      </motion.div>\n      </div>\n    </>\n  );\n}'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
