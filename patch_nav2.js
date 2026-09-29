const fs = require('fs');
let file = fs.readFileSync('src/components/navigation/MorphingNav.tsx', 'utf8');

file = file.replace(/const \[scrolled, setScrolled\] = useState\(false\);/, 'const [scrolled, setScrolled] = useState(false);\n  const [hidden, setHidden] = useState(false);');

file = file.replace(/useMotionValueEvent\(scrollY, "change", \(latest\) => \{\n    setScrolled\(latest > 40\);\n  \}\);/, `useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });`);

file = file.replace(/<header className="fixed top-0 inset-x-0 z-50 hidden md:flex justify-center px-6 pointer-events-none transition-all duration-500" style={{ paddingTop: scrolled \? '1rem' : '2rem' }}>/g, '<header className={cn("fixed top-0 inset-x-0 z-50 hidden md:flex justify-center px-6 pointer-events-none transition-all duration-500", hidden ? "-translate-y-[120%]" : "translate-y-0")} style={{ paddingTop: scrolled ? "1rem" : "2rem" }}>');

file = file.replace(/<div className="fixed inset-x-4 bottom-4 mb-\[env\(safe-area-inset-bottom\)\] z-50 flex md:hidden justify-between items-center px-4 py-3 rounded-full spatial-glass">/g, '<div className={cn("fixed inset-x-4 bottom-4 mb-[env(safe-area-inset-bottom)] z-50 flex md:hidden justify-between items-center px-4 py-3 rounded-full spatial-glass transition-transform duration-500", hidden ? "translate-y-[150%]" : "translate-y-0")}>');

fs.writeFileSync('src/components/navigation/MorphingNav.tsx', file);
