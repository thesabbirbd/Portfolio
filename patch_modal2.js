const fs = require('fs');
let file = fs.readFileSync('src/components/projects/ProjectModal.tsx', 'utf8');

const newLinkStr = `
            {/* Detailed Case Study Link */}
            <a 
              href={\`/projects/\${project.id}\`}
              onClick={() => sound.click()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-all font-medium text-sm"
            >
              <ExternalLink className="w-4 h-4" /> View Full Case Study
            </a>
`;

file = file.replace(/<div className="flex flex-wrap items-center gap-3 pt-4 border-t border-\[var\(--border-glass\)\]">/, `<div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-glass)]">` + newLinkStr);

fs.writeFileSync('src/components/projects/ProjectModal.tsx', file);
