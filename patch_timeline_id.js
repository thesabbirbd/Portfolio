const fs = require('fs');
let file = fs.readFileSync('src/components/about/JourneyTimeline.tsx', 'utf8');

file = file.replace(/export function JourneyTimeline\(\) \{/, 'export function JourneyTimeline() {\n  return (\n    <div id="timeline">\n      <TimelineContent />\n    </div>\n  );\n}\n\nfunction TimelineContent() {');

// Rename the original export function to TimelineContent
file = file.replace(/export function JourneyTimeline\(\) \{/, 'function TimelineContent() {');

// Just an easier replace: replace the outer container
file = file.replace(/<div className="mt-24 md:mt-32">/, '<div id="timeline" className="mt-24 md:mt-32">');

fs.writeFileSync('src/components/about/JourneyTimeline.tsx', file);
