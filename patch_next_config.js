const fs = require('fs');
let file = fs.readFileSync('next.config.ts', 'utf8');

if (!file.includes('experimental')) {
  file = file.replace(
    /const nextConfig: NextConfig = \{/g,
    \`const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },\`
  );
  fs.writeFileSync('next.config.ts', file);
}
