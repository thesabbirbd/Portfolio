const fs = require('fs');
let file = fs.readFileSync('src/components/navigation/MorphingNav.tsx', 'utf8');

file = file.replace(/if \\(latest > previous && latest > 150\\) \\{/, `if (latest > previous + 5 && latest > 150) {`);
file = file.replace(/\\} else if \\(latest < previous\\) \\{/, `} else if (latest < previous - 5) {`);

fs.writeFileSync('src/components/navigation/MorphingNav.tsx', file);
