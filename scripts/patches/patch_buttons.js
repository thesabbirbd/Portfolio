const fs = require('fs');
let terminalFile = fs.readFileSync('src/components/ui/TerminalModal.tsx', 'utf8');

// Replace the container div for the terminal button
terminalFile = terminalFile.replace(
  /<div className="fixed bottom-4 left-4 z-40 hidden sm:block">/g,
  '<div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40">'
);
fs.writeFileSync('src/components/ui/TerminalModal.tsx', terminalFile);

let settingsFile = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');
// Keep it exactly matching: bottom-20 right-4 sm:bottom-6 sm:right-6 (which it already is!)
fs.writeFileSync('src/components/ui/SettingsPanel.tsx', settingsFile);
