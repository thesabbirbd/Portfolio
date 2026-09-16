const fs = require('fs');

// Fix globals.css specificity
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/\[data-theme-color="orange"\]/g, ':root[data-theme-color="orange"], .dark[data-theme-color="orange"]');
css = css.replace(/\[data-theme-color="blue"\]/g, ':root[data-theme-color="blue"], .dark[data-theme-color="blue"]');
css = css.replace(/\[data-theme-color="green"\]/g, ':root[data-theme-color="green"], .dark[data-theme-color="green"]');
fs.writeFileSync('src/app/globals.css', css);

// Fix SettingsPanel dots
let panel = fs.readFileSync('src/components/ui/SettingsPanel.tsx', 'utf8');
// Revert the wrong color-accent replacements in SettingsPanel.tsx dots
panel = panel.replace(/bg-\[var\(--color-primary\)\] shadow-\[0_0_8px_rgba\(255,106,0,0.8\)\]/g, 'bg-[#ff6a00] shadow-[0_0_8px_rgba(255,106,0,0.8)]');
panel = panel.replace(/bg-\[var\(--color-secondary\)\] shadow-\[0_0_8px_rgba\(0,240,255,0.8\)\]/g, 'bg-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.8)]');
panel = panel.replace(/bg-\[var\(--color-accent\)\] shadow-\[0_0_8px_rgba\(16,185,129,0.8\)\]/g, 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]');

fs.writeFileSync('src/components/ui/SettingsPanel.tsx', panel);
