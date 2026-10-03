const fs = require('fs');
const files = [
  'src/components/projects/ProjectsSection.tsx',
  'src/components/omnidesk/OmnideskSection.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/sizes="\(max-width: 1200px\) 100vw, 1200px"/g, 'sizes="100vw"\n                  quality={100}\n                  unoptimized');
    content = content.replace(/className="object-cover object-top filter contrast-105"/g, 'className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"');
    fs.writeFileSync(file, content);
  }
});
