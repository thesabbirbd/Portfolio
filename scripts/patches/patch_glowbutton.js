const fs = require('fs');
let file = fs.readFileSync('src/components/ui/GlowButton.tsx', 'utf8');

file = file.replace(/size\?: "sm" \| "md" \| "lg";/, 'size?: "sm" | "md" | "lg" | "icon";');
file = file.replace(/const sizeStyles = \{[\s\S]*?\};/, `const sizeStyles = {
    sm: "px-3 py-1.5 text-[11px] sm:text-xs font-medium gap-1.5",
    md: "px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold gap-2",
    lg: "px-5 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold gap-2 sm:gap-2.5",
    icon: "p-2 sm:p-2.5",
  };`);

fs.writeFileSync('src/components/ui/GlowButton.tsx', file);
