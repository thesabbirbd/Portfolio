const fs = require('fs');
let file = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');

file = file.replace(
  '            : "bottom-12 left-1/2 -translate-x-1/2"',
  '            : "bottom-12 left-0 right-0 justify-center"'
);

file = file.replace(
  'className={`fixed z-[90] transition-all duration-700 ease-in-out ${',
  'className={`fixed z-[90] flex transition-all duration-700 ease-in-out ${'
);

fs.writeFileSync('src/components/ui/IdentityDock.tsx', file);
