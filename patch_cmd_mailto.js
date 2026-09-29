const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CommandMenu.tsx', 'utf8');

file = file.replace(/`mailto:\\\$\{SOCIAL_LINKS\.find\(l => l\.id === "gmail"\)\?\.url \|\| ""\}`/, 'SOCIAL_LINKS.find(l => l.id === "gmail")?.url || ""');

fs.writeFileSync('src/components/ui/CommandMenu.tsx', file);
