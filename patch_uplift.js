const fs = require('fs');

const useDesktopHook = `
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
`;

// Patch TerminalModal.tsx
let term = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');
if (!term.includes('isDesktop')) {
  term = term.replace('const [isNavHidden, setIsNavHidden] = useState(false);', 'const [isNavHidden, setIsNavHidden] = useState(false);\n' + useDesktopHook);
  term = term.replace('animate={{ y: isNavHidden ? 0 : -76 }}', 'animate={{ y: (!isDesktop && !isNavHidden) ? -76 : 0 }}');
  fs.writeFileSync('src/components/ui/TerminalModal.tsx', term);
}

// Patch SettingsPanel.tsx
let sett = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');
if (!sett.includes('isDesktop')) {
  sett = sett.replace('const [isNavHidden, setIsNavHidden] = useState(false);', 'const [isNavHidden, setIsNavHidden] = useState(false);\n' + useDesktopHook);
  sett = sett.replace('animate={{ y: isNavHidden ? 0 : -76 }}', 'animate={{ y: (!isDesktop && !isNavHidden) ? -76 : 0 }}');
  fs.writeFileSync('src/components/ui/SettingsPanel.tsx', sett);
}

// Patch IdentityDock.tsx
let dock = fs.readFileSync('src/components/ui/IdentityDock.tsx', 'utf8');
if (!dock.includes('isDesktop')) {
  dock = dock.replace('const [isNavHidden, setIsNavHidden] = useState(false);', 'const [isNavHidden, setIsNavHidden] = useState(false);\n' + useDesktopHook);
  dock = dock.replace(
    /className=\{\`flex w-full \$\{\s*isNavHidden\s*\?\s*"justify-center pb-4 sm:pb-12"\s*:\s*"justify-end pb-\[150px\] pr-4 sm:pb-\[90px\] sm:pr-6"\s*\}\`\}/,
    'className={`flex w-full ${(!isDesktop && !isNavHidden) ? "justify-end pb-[90px] pr-4" : "justify-center pb-4 sm:pb-6"}`}'
  );
  fs.writeFileSync('src/components/ui/IdentityDock.tsx', dock);
}
