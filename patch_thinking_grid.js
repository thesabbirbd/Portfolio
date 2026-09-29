const fs = require('fs');

let file = fs.readFileSync('src/components/content/LatestThinking.tsx', 'utf8');

file = file.replace(
  'className="grid grid-cols-1 md:grid-cols-3 gap-6"',
  'className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6"'
);

fs.writeFileSync('src/components/content/LatestThinking.tsx', file);
