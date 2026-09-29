const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

// 1. Update the wrapper to trigger onMouseEnter/onMouseLeave and use heavy glassmorphism
file = file.replace(
  '<motion.div \n          initial={{ y: 50, opacity: 0 }}\n          animate={{ y: 0, opacity: 1 }}\n          transition={{ delay: 1, type: "spring" }}\n          className="flex items-center gap-1.5 spatial-glass rounded-full p-1.5 shadow-lg border border-white/10"\n        >',
  `<motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="flex items-center gap-1.5 spatial-glass-heavy rounded-full p-1.5 shadow-2xl border border-white/20 bg-background/40 backdrop-blur-3xl"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >`
);

// 2. Add tooltips to the buttons inside the dock
file = file.replace(
  '<button onClick={triggerCmdK} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Command Center (⌘K)">\n                  <Command className="w-3.5 h-3.5 md:w-4 md:h-4" />\n                </button>',
  `<div className="relative group flex flex-col items-center">
                  <button onClick={triggerCmdK} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all">
                    <Command className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-foreground pointer-events-none">Command</span>
                </div>`
);

file = file.replace(
  '<button onClick={() => { sound.click(); setTheme(theme === \'dark\' ? \'light\' : \'dark\'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Toggle Theme">\n                  <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />\n                </button>',
  `<div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); setTheme(theme === 'dark' ? 'light' : 'dark'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all">
                    <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-foreground pointer-events-none">Theme</span>
                </div>`
);

file = file.replace(
  '<button onClick={() => { sound.click(); toggle3D(); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Toggle 3D">\n                  <Box className="w-3.5 h-3.5 md:w-4 md:h-4" />\n                </button>',
  `<div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); toggle3D(); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all">
                    <Box className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-foreground pointer-events-none">3D Toggle</span>
                </div>`
);

file = file.replace(
  '<button onClick={() => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", \'_blank\'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="GitHub">\n                  <GithubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />\n                </button>',
  `<div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all">
                    <GithubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-foreground pointer-events-none">GitHub</span>
                </div>`
);

file = file.replace(
  '<button onClick={() => { sound.click(); document.getElementById(\'contact\')?.scrollIntoView({ behavior: \'smooth\' }); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Contact">\n                  <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />\n                </button>',
  `<div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all">
                    <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-foreground pointer-events-none">Contact</span>
                </div>`
);

// 3. Optional: make the right-most chevron toggle button disappear entirely on desktop so hover is the only mechanism! Or hide it gracefully.
file = file.replace(
  '<button \n            onClick={toggleDock}\n            className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] dark:text-cyan-400 transition-all shrink-0 group shadow-[0_0_10px_rgba(0,180,216,0.2)]"\n          >',
  `<button 
            onClick={toggleDock}
            className="relative w-8 h-8 md:hidden rounded-full bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] dark:text-cyan-400 transition-all shrink-0 group shadow-[0_0_10px_rgba(0,180,216,0.2)]"
          >`
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
