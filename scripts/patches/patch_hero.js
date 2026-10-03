const fs = require('fs');
let file = fs.readFileSync('src/components/hero/HeroSection.tsx', 'utf8');

file = file.replace(/className="relative min-h-\[90vh\] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 md:py-20 overflow-hidden"/, 'className="relative min-h-[70svh] md:min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 md:py-20 overflow-hidden"');

// Fix text-4xl xs:text-5xl sm:text-7xl md:text-8xl to clamp
file = file.replace(/className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter"/, 'className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-tighter leading-none"');

fs.writeFileSync('src/components/hero/HeroSection.tsx', file);
