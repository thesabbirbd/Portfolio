const fs = require('fs');
let file = fs.readFileSync('src/app/search/page.tsx', 'utf8');

if (!file.includes('Suspense')) {
  file = file.replace(/import \{ SearchInterface \} from '.*';/, "import { SearchInterface } from '@/components/search/SearchInterface';\nimport { Suspense } from 'react';");
  file = file.replace(/<SearchInterface initialData=\{allContent\} \/>/g, "<Suspense fallback={<div>Loading search...</div>}>\n          <SearchInterface initialData={allContent} />\n        </Suspense>");
  fs.writeFileSync('src/app/search/page.tsx', file);
}
