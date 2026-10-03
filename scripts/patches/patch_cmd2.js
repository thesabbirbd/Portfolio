const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CommandMenu.tsx', 'utf8');

file = file.replace(/<div key=\{category\} className="mb-4 last:mb-0">/, '<motion.div layout key={category} className="mb-4 last:mb-0">');
file = file.replace(/<\/div>\n                \)\)\n              \)\}/, '</motion.div>\n                ))\n              )}');
file = file.replace(/<button\n                        key=\{i\}/g, '<motion.button layout key={cmd.name}');
file = file.replace(/<\/button>/g, '</motion.button>');

fs.writeFileSync('src/components/ui/CommandMenu.tsx', file);
