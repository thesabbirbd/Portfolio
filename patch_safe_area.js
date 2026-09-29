const fs = require('fs');

let terminalFile = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');
terminalFile = terminalFile.replace(
  '<div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40">',
  '<div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0">'
);
fs.writeFileSync('src/components/ui/TerminalModal.tsx', terminalFile);

let settingsFile = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');
settingsFile = settingsFile.replace(
  'className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3 rounded-full glass-interactive shadow-lg',
  'className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 mb-[env(safe-area-inset-bottom)] sm:mb-0 p-3 rounded-full glass-interactive shadow-lg'
);
fs.writeFileSync('src/components/ui/SettingsPanel.tsx', settingsFile);

