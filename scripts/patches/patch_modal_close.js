const fs = require('fs');
let file = fs.readFileSync('src/components/projects/ProjectModal.tsx', 'utf8');

file = file.replace(/aria-label="Close Project Modal"/, 'aria-label="Close Project Modal" title="Close"');

fs.writeFileSync('src/components/projects/ProjectModal.tsx', file);
