const fs = require('fs');
let file = fs.readFileSync('src/components/search/SearchInterface.tsx', 'utf8');

if (!file.includes('useSearchParams')) {
  // Add imports
  file = file.replace(
    /import \{ useState, useMemo \} from "react";/,
    'import { useState, useMemo, useEffect } from "react";\nimport { useSearchParams, useRouter, usePathname } from "next/navigation";'
  );

  // Add hooks inside component
  file = file.replace(
    /export function SearchInterface\(\{[^}]+\}: \{[^}]+\}\) \{/g,
    `export function SearchInterface({ initialData }: { initialData: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
`
  );

  // Sync initial state
  file = file.replace(
    /const \[query, setQuery\] = useState\(""\);/g,
    'const [query, setQuery] = useState(searchParams.get("q") || "");'
  );

  // Add effect to push state to URL
  const effectCode = `
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    // Update URL without refresh
    router.replace(\`\${pathname}?\${params.toString()}\`, { scroll: false });
  }, [query, pathname, router, searchParams]);
  `;

  file = file.replace('const [activeCategory, setActiveCategory] = useState', effectCode + '\n  const [activeCategory, setActiveCategory] = useState');
  
  fs.writeFileSync('src/components/search/SearchInterface.tsx', file);
}
