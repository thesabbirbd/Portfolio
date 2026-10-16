const fs = require('fs');

// Fix globals.css specificity
let css = fs.readFileSync('src/app/globals.css', 'utf8');

css = css.replace(/(?<!:root)(?<!\.dark)\[data-theme-color="orange"\]/g, ':root[data-theme-color="orange"], .dark[data-theme-color="orange"]');
css = css.replace(/(?<!:root)(?<!\.dark)\[data-theme-color="blue"\]/g, ':root[data-theme-color="blue"], .dark[data-theme-color="blue"]');
css = css.replace(/(?<!:root)(?<!\.dark)\[data-theme-color="green"\]/g, ':root[data-theme-color="green"], .dark[data-theme-color="green"]');

fs.writeFileSync('src/app/globals.css', css);

// Fix SettingsPanel dots
let panel = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');
// Revert the wrong color-accent replacements in SettingsPanel.tsx dots
panel = panel.replace(/<div className="w-3 h-3 rounded-full (?:bg-\[var\(--color-primary\)\]|bg-\[#ff6a00\]) shadow-\[0_0_8px_rgba\(255,106,0,0\.8\)\]" \/>/g, '<div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff6a00", boxShadow: "0 0 8px rgba(255,106,0,0.8)" }} />');
panel = panel.replace(/<div className="w-3 h-3 rounded-full (?:bg-\[var\(--color-secondary\)\]|bg-\[#00f0ff\]) shadow-\[0_0_8px_rgba\(0,240,255,0\.8\)\]" \/>/g, '<div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00f0ff", boxShadow: "0 0 8px rgba(0,240,255,0.8)" }} />');
panel = panel.replace(/<div className="w-3 h-3 rounded-full (?:bg-\[var\(--color-accent\)\]|bg-\[#10b981\]) shadow-\[0_0_8px_rgba\(16,185,129,0\.8\)\]" \/>/g, '<div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />');

fs.writeFileSync('src/components/ui/SettingsPanel.tsx', panel);
