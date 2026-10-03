const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CommandMenu.tsx', 'utf8');

file = file.replace(/UserIcon/g, 'User');
if (!file.includes('User, ')) {
  file = file.replace(/Home, Folder, Cpu, Terminal, Globe, MessageSquare, Palette, Box, Volume2, Activity, Mail, Briefcase/, 'Home, Folder, Cpu, Terminal, Globe, MessageSquare, Palette, Box, Volume2, Activity, Mail, Briefcase, User');
}
file = file.replace(/\{ category: "NAVIGATION", name: "About & Journey", icon: User, action: \(\) => runCommand\(\(\) => window.location.href = '\/about'\) \},/, `{ category: "NAVIGATION", name: "About", icon: User, action: () => runCommand(() => window.location.href = '/about') },
    { category: "NAVIGATION", name: "Journey & Timeline", icon: Activity, action: () => runCommand(() => window.location.href = '/about#timeline') },
    { category: "NAVIGATION", name: "Resume", icon: Briefcase, action: () => runCommand(() => window.location.href = '/resume') },`);

fs.writeFileSync('src/components/ui/CommandMenu.tsx', file);
