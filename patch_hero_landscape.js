const fs = require('fs');
let file = fs.readFileSync('src/components/hero/HeroSection.tsx', 'utf8');

file = file.replace(/className="relative min-h-\[70svh\] md:min-h-\[90vh\] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden"/g, 'className="relative min-h-[70svh] md:min-h-[90vh] landscape:min-h-0 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 landscape:py-12 overflow-hidden"');

fs.writeFileSync('src/components/hero/HeroSection.tsx', file);
