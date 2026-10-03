const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

file = file.replace(
  /const dockItems = \[\n    \{ id: "cmd", name: "Command", icon: Command, onClick: triggerCmdK \},\n    \{ id: "theme", name: "Theme", icon: Palette, onClick: \(\) => \{ sound\.click\(\); setTheme\(theme === 'dark' \? 'light' : 'dark'\); \} \},\n    \{ id: "3d", name: "3D Effect", icon: Box, onClick: \(\) => \{ sound\.click\(\); toggle3D\(\); \} \},\n    \{ id: "github", name: "GitHub", icon: GithubIcon, onClick: \(\) => \{ sound\.click\(\); window\.open\(SOCIAL_LINKS\.find\(l => l\.id === "github"\)\?\.url || "", '_blank'\); \} \},\n    \{ id: "contact", name: "Contact", icon: MessageSquare, onClick: \(\) => \{ sound\.click\(\); document\.getElementById\('contact'\)\?\.scrollIntoView\(\{ behavior: 'smooth' \}\); \} \},\n  \];/g,
  `const dockItems = [
    { id: "cmd", name: "Command", icon: Command, onClick: triggerCmdK, colorClass: "text-amber-500" },
    { id: "theme", name: "Theme", icon: Palette, onClick: () => { sound.click(); setTheme(theme === 'dark' ? 'light' : 'dark'); }, colorClass: "text-fuchsia-500" },
    { id: "3d", name: "3D Effect", icon: Box, onClick: () => { sound.click(); toggle3D(); }, colorClass: "text-cyan-500" },
    { id: "github", name: "GitHub", icon: GithubIcon, onClick: () => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank'); }, colorClass: "text-indigo-400" },
    { id: "contact", name: "Contact", icon: MessageSquare, onClick: () => { sound.click(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, colorClass: "text-emerald-500" },
  ];`
);

file = file.replace(
  /<item\.icon className="w-4 h-4" \/>/g,
  '<item.icon className={`w-5 h-5 ${item.colorClass} icon-3d-punchy drop-shadow-[0_0_8px_currentColor] transition-colors`} />'
);

file = file.replace(
  /className="w-10 h-10 rounded-full bg-white\/5 hover:bg-primary\/20 flex items-center justify-center text-foreground\/80 hover:text-primary transition-all relative z-10"/g,
  'className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all relative z-10 hover:scale-110 duration-300"'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
