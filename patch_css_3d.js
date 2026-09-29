const fs = require('fs');
let file = fs.readFileSync('src/app/globals.css', 'utf8');

file += `\n
.icon-3d-punchy {
  filter: drop-shadow(0px 2px 8px currentColor) drop-shadow(0px 4px 16px currentColor);
  transform: translateZ(0);
}

.icon-3d-glow {
  filter: drop-shadow(0 0 12px currentColor);
  transform: translateZ(0);
}
`;

fs.writeFileSync('src/app/globals.css', file);
