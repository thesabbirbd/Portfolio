const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

file = file.replace(/<div ref=\{containerRef\} className="relative w-full max-w-5xl mx-auto py-24">/, '<div id="timeline" ref={containerRef} className="relative w-full max-w-5xl mx-auto py-24">');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
