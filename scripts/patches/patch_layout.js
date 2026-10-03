const fs = require('fs');
let file = fs.readFileSync('src/app/layout.tsx', 'utf8');

file = file.replace(/import \{ ThemeProvider \} from "@\/components\/theme\/ThemeProvider";/, 'import { ThemeProvider } from "@/components/theme/ThemeProvider";\nimport { ToastProvider } from "@/contexts/ToastContext";');
file = file.replace(/<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>/, '<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>\n          <ToastProvider>');
file = file.replace(/<\/ThemeProvider>/, '</ToastProvider>\n        </ThemeProvider>');

fs.writeFileSync('src/app/layout.tsx', file);
