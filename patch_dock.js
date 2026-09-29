const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

// Add clear glass styles to the dock wrapper and switch to onHover
file = file.replace(
  /<motion\.div \n          initial=\{\{ y: 50, opacity: 0 \}\}\n          animate=\{\{ y: 0, opacity: 1 \}\}\n          transition=\{\{ delay: 1, type: "spring" \}\}\n          className="flex items-center gap-1.5 spatial-glass rounded-full p-1.5 shadow-lg border border-white\/10"\n        >/g,
  `<motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="flex items-center gap-1.5 rounded-full p-1.5 shadow-2xl bg-background/20 backdrop-blur-2xl border border-white/10 dark:border-white/20"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >`
);

// We need to add the tooltips to the buttons inside the expanded area.
// We'll replace the AnimatePresence block.

const newExpanded = `
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-1.5 overflow-hidden px-0.5"
              >
                <div className="relative group flex flex-col items-center">
                  <button onClick={triggerCmdK} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all shadow-sm">
                    <Command className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">Cmd</span>
                </div>
                
                <div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); setTheme(theme === 'dark' ? 'light' : 'dark'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all shadow-sm">
                    <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">Theme</span>
                </div>

                <div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); toggle3D(); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all shadow-sm">
                    <Box className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">3D</span>
                </div>

                <div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank'); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all shadow-sm">
                    <GithubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">GitHub</span>
                </div>

                <div className="relative group flex flex-col items-center">
                  <button onClick={() => { sound.click(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all shadow-sm">
                    <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                  <span className="absolute -bottom-6 text-[10px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/50 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">Contact</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>`;

// Regex to replace the entire AnimatePresence block
file = file.replace(/<AnimatePresence>[\s\S]*?<\/AnimatePresence>/, newExpanded);

// Let's modify the Identity toggle button to just act as a manual toggle on mobile
file = file.replace(
  /<button \n            onClick=\{toggleDock\}\n            className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-\[var\(--color-primary\)\]\/15 hover:bg-\[var\(--color-primary\)\]\/25 border border-\[var\(--color-primary\)\]\/30 flex items-center justify-center text-\[var\(--color-primary\)\] dark:text-cyan-400 transition-all shrink-0 group shadow-\[0_0_10px_rgba\(0,180,216,0\.2\)\]"\n          >/g,
  `<button 
            onClick={toggleDock}
            className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/30 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] dark:text-cyan-400 transition-all shrink-0 group shadow-[0_0_15px_rgba(0,180,216,0.3)] md:hidden"
          >`
);
// We added md:hidden to the toggle button because on desktop it expands on hover! No need for the arrow button if hover works perfectly. 
// Wait, if we hide it, what about the icon? The user said "mouse nilei spread hoye jai"
// If we hide the arrow on desktop, it's cleaner. Just hover the dock and it spreads.
// But wait, the arrow indicates it's expandable. Let's keep it but just make it not rotate, or better yet, make it hidden on desktop to save space since hover opens it.
// Actually, let's keep it visible on desktop as an anchor, but rotate it when hovered!
// I will not hide it, just let the `expanded` state rotate it.

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
