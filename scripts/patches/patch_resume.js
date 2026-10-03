const fs = require('fs');
let file = fs.readFileSync('src/components/resume/ResumeInterface.tsx', 'utf8');

file = file.replace(/<button onClick=\{\(\) => \{ sound\.click\(\); setRole\('all'\); \}\} className=\{`px-4 py-2 rounded-full text-xs font-bold transition-colors \$\{role === 'all' \? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'\}`\}>All Roles<\/button>/, 
  `<button onClick={() => { sound.click(); setRole('all'); }} className={\`relative px-4 py-2 rounded-full text-xs font-bold transition-colors \${role === 'all' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}\`}>
    {role === 'all' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">All Roles</span>
  </button>`);

file = file.replace(/<button onClick=\{\(\) => \{ sound\.click\(\); setRole\('engineering'\); \}\} className=\{`px-4 py-2 rounded-full text-xs font-bold transition-colors \$\{role === 'engineering' \? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'\}`\}>Engineering<\/button>/, 
  `<button onClick={() => { sound.click(); setRole('engineering'); }} className={\`relative px-4 py-2 rounded-full text-xs font-bold transition-colors \${role === 'engineering' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}\`}>
    {role === 'engineering' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">Engineering</span>
  </button>`);

file = file.replace(/<button onClick=\{\(\) => \{ sound\.click\(\); setRole\('infrastructure'\); \}\} className=\{`px-4 py-2 rounded-full text-xs font-bold transition-colors \$\{role === 'infrastructure' \? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'\}`\}>Infrastructure<\/button>/, 
  `<button onClick={() => { sound.click(); setRole('infrastructure'); }} className={\`relative px-4 py-2 rounded-full text-xs font-bold transition-colors \${role === 'infrastructure' ? 'text-primary-foreground' : 'bg-muted text-muted-foreground'}\`}>
    {role === 'infrastructure' && <motion.div layoutId="role-indicator" className="absolute inset-0 bg-primary rounded-full z-0" />}
    <span className="relative z-10">Infrastructure</span>
  </button>`);

file = file.replace(/<button onClick=\{\(\) => \{ sound\.click\(\); setMode\('visual'\); \}\} className=\{`px-4 py-2 rounded-full text-xs font-bold transition-colors \$\{mode === 'visual' \? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'\}`\}>Visual Mode<\/button>/, 
  `<button onClick={() => { sound.click(); setMode('visual'); }} className={\`relative px-4 py-2 rounded-full text-xs font-bold transition-colors \${mode === 'visual' ? 'text-background' : 'bg-muted text-muted-foreground'}\`}>
    {mode === 'visual' && <motion.div layoutId="mode-indicator" className="absolute inset-0 bg-foreground rounded-full z-0" />}
    <span className="relative z-10">Visual Mode</span>
  </button>`);

file = file.replace(/<button onClick=\{\(\) => \{ sound\.click\(\); setMode\('professional'\); \}\} className=\{`px-4 py-2 rounded-full text-xs font-bold transition-colors \$\{mode === 'professional' \? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'\}`\}>Professional Mode<\/button>/, 
  `<button onClick={() => { sound.click(); setMode('professional'); }} className={\`relative px-4 py-2 rounded-full text-xs font-bold transition-colors \${mode === 'professional' ? 'text-background' : 'bg-muted text-muted-foreground'}\`}>
    {mode === 'professional' && <motion.div layoutId="mode-indicator" className="absolute inset-0 bg-foreground rounded-full z-0" />}
    <span className="relative z-10">Professional Mode</span>
  </button>`);

fs.writeFileSync('src/components/resume/ResumeInterface.tsx', file);
