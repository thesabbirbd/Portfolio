const fs = require('fs');
let settings = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');

settings = settings.replace(
  'animate={{ bottom: isNavHidden ? 16 : 80, right: 16 }}',
  'animate={{ y: isNavHidden ? 0 : -64 }}'
);
settings = settings.replace(
  'className="fixed z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0 p-3 rounded-full',
  'className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0 p-3 rounded-full'
);
fs.writeFileSync('src/components/ui/SettingsPanel.tsx', settings);

let terminal = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');
terminal = terminal.replace(
  'animate={{ bottom: isNavHidden ? 16 : 80, left: 16 }}',
  'animate={{ y: isNavHidden ? 0 : -64 }}'
);
terminal = terminal.replace(
  'className="fixed z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0"',
  'className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0"'
);
fs.writeFileSync('src/components/ui/TerminalModal.tsx', terminal);
