const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CommandMenu.tsx', 'utf8');

const experienceLink = `    { category: "NAVIGATION", name: "Experience & Skills", icon: Terminal, action: () => runCommand(() => window.location.href = '/experience') },\n`;
file = file.replace(/\{ category: "NAVIGATION", name: "About", icon: User, action: \(\) => runCommand\(\(\) => window\.location\.href = '\/about'\) \},/, `{ category: "NAVIGATION", name: "About", icon: User, action: () => runCommand(() => window.location.href = '/about') },\n` + experienceLink);

fs.writeFileSync('src/components/ui/CommandMenu.tsx', file);
