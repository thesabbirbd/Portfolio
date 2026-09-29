const fs = require('fs');
let file = fs.readFileSync('src/components/hero/SpatialCore.tsx', 'utf8');

file = file.replace(/className="absolute w-\[260px\] xs:w-\[310px\] sm:w-\[440px\] h-\[260px\] xs:h-\[310px\] sm:h-\[440px\]/g, 'className="absolute w-[min(240px,70vw)] xs:w-[min(280px,75vw)] sm:w-[440px] h-[min(240px,70vw)] xs:h-[min(280px,75vw)] sm:h-[440px]');

file = file.replace(/className="absolute w-\[240px\] xs:w-\[280px\] sm:w-\[400px\] h-\[240px\] xs:h-\[280px\] sm:h-\[400px\]/g, 'className="absolute w-[min(220px,65vw)] xs:w-[min(250px,70vw)] sm:w-[400px] h-[min(220px,65vw)] xs:h-[min(250px,70vw)] sm:h-[400px]');

file = file.replace(/className="absolute w-\[190px\] xs:w-\[210px\] sm:w-\[310px\] h-\[190px\] xs:h-\[210px\] sm:h-\[310px\]/g, 'className="absolute w-[min(170px,50vw)] xs:w-[min(190px,55vw)] sm:w-[310px] h-[min(170px,50vw)] xs:h-[min(190px,55vw)] sm:h-[310px]');

file = file.replace(/className="relative z-10 w-48 xs:w-56 sm:w-80 h-48 xs:h-56 sm:h-80/g, 'className="relative z-10 w-[min(160px,45vw)] xs:w-[min(190px,50vw)] sm:w-80 h-[min(160px,45vw)] xs:h-[min(190px,50vw)] sm:h-80');

fs.writeFileSync('src/components/hero/SpatialCore.tsx', file);
