const fs = require('fs');

let globals = fs.readFileSync('src/app/globals.css', 'utf8');

// Decrease opacity of bg-card to show background better, increase blur
globals = globals.replace(/--bg-card: rgba\(13, 18, 29, 0\.7\);/g, '--bg-card: rgba(13, 18, 29, 0.4);');
globals = globals.replace(/--bg-card: rgba\(255, 255, 255, 0\.8\);/g, '--bg-card: rgba(255, 255, 255, 0.5);');

globals = globals.replace(/backdrop-filter: blur\(10px\);/g, 'backdrop-filter: blur(16px);');
globals = globals.replace(/-webkit-backdrop-filter: blur\(10px\);/g, '-webkit-backdrop-filter: blur(16px);');

globals = globals.replace(/backdrop-filter: blur\(16px\);/g, 'backdrop-filter: blur(24px);');
globals = globals.replace(/-webkit-backdrop-filter: blur\(16px\);/g, '-webkit-backdrop-filter: blur(24px);');

fs.writeFileSync('src/app/globals.css', globals);

// Increase blur on glow buttons
let button = fs.readFileSync('src/components/ui/GlowButton.tsx', 'utf8');
button = button.replace(/backdrop-blur-\[6px\]/g, 'backdrop-blur-md');
fs.writeFileSync('src/components/ui/GlowButton.tsx', button);

