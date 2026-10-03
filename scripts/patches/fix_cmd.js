const fs = require('fs');
let file = fs.readFileSync('src/components/ui/CommandMenu.tsx', 'utf8');

file = file.replace(/<button \n                onClick=\{\(\) => setOpen\(false\)\}\n                className="p-1 rounded-full hover:bg-white\/10 transition-colors text-muted"\n              >\n                <X className="w-5 h-5" \/>\n              <\/motion\.button>/g, 
  `<button 
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-muted"
              >
                <X className="w-5 h-5" />
              </button>`);

fs.writeFileSync('src/components/ui/CommandMenu.tsx', file);
