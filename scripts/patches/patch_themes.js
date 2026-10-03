const fs = require('fs');
const file = 'src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

const themeCss = `
/* ==================== COLOR THEMES ==================== */
[data-theme-color="orange"] {
  --vibrant-cyan: #ff6a00;
  --vibrant-purple: #ffb800;
  --vibrant-emerald: #ff3300;
  --color-primary: #ff6a00;
  --color-secondary: #ffb800;
  --color-accent: #ff3300;
}

[data-theme-color="blue"] {
  --vibrant-cyan: #00f0ff;
  --vibrant-purple: #3b82f6;
  --vibrant-emerald: #8b5cf6;
  --color-primary: #00f0ff;
  --color-secondary: #3b82f6;
  --color-accent: #8b5cf6;
}

[data-theme-color="green"] {
  --vibrant-cyan: #00f5a0;
  --vibrant-purple: #10b981;
  --vibrant-emerald: #34d399;
  --color-primary: #00f5a0;
  --color-secondary: #10b981;
  --color-accent: #34d399;
}
`;

// Append to the end
content += themeCss;
fs.writeFileSync(file, content);
