const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CopyButton.tsx', 'utf8');

file = file.replace(/aria-label="Copy to clipboard"/, 'aria-label="Copy to clipboard"\n      title={copied ? "Copied!" : "Copy"}');

fs.writeFileSync('src/components/ui/CopyButton.tsx', file);
