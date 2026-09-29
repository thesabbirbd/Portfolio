const fs = require('fs');
let file = fs.readFileSync('src/components/navigation/MorphingNav.tsx', 'utf8');

file = file.replace(
  /const NAV_ITEMS = \[\n  \{ name: "Home", href: "\/#hero", icon: Home \},\n  \{ name: "About", href: "\/#about", icon: User \},\n  \{ name: "Work", href: "\/#work", icon: FolderGit2 \},\n  \{ name: "Lab", href: "\/#lab", icon: FlaskConical \},\n\];/g,
  `const NAV_ITEMS = [
  { name: "Home", href: "/#hero", icon: Home, colorClass: "text-blue-500" },
  { name: "About", href: "/#about", icon: User, colorClass: "text-rose-500" },
  { name: "Work", href: "/#work", icon: FolderGit2, colorClass: "text-amber-500" },
  { name: "Lab", href: "/#lab", icon: FlaskConical, colorClass: "text-emerald-500" },
];`
);

file = file.replace(
  /<item\.icon className="w-4 h-4" \/>/g,
  '<item.icon className={`w-5 h-5 ${item.colorClass} icon-3d-punchy transition-transform group-hover:scale-110`} />'
);

file = file.replace(
  /className="p-2 text-foreground\/80 hover:text-foreground"/g,
  'className="p-2 text-foreground/80 hover:text-foreground group"'
);

file = file.replace(
  /<Search className="w-4 h-4" \/>/g,
  '<Search className="w-5 h-5 text-fuchsia-500 icon-3d-punchy transition-transform hover:scale-110" />'
);

fs.writeFileSync('src/components/navigation/MorphingNav.tsx', file);
