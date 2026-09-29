const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

const oldBtn = `<button 
            onClick={toggleDock}
            className="w-6 h-8 md:w-8 md:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0"
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.div>
          </button>`;

const newBtn = `<button 
            onClick={toggleDock}
            className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] dark:text-cyan-400 transition-all shrink-0 group shadow-[0_0_10px_rgba(0,180,216,0.2)]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="relative z-10">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
            </motion.div>
          </button>`;

file = file.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
