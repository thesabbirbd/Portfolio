const fs = require('fs');
let file = fs.readFileSync('src/components/projects/ProjectModal.tsx', 'utf8');

const newLinkStr = `
            {/* Detailed Case Study Link */}
            <a 
              href={\`/projects/\${project.id}\`}
              onClick={() => sound.click()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all font-semibold text-sm"
            >
              <ExternalLink className="w-4 h-4" /> View Full Case Study
            </a>
`;

file = file.replace(/<div className="flex flex-wrap items-center gap-3 mt-8">/, `<div className="flex flex-wrap items-center gap-3 mt-8">` + newLinkStr);

fs.writeFileSync('src/components/projects/ProjectModal.tsx', file);
