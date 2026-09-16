const fs = require('fs');
const file = 'src/components/ui/SettingsPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add state
content = content.replace(
  'const [reducedMotion, setReducedMotion] = useState(false);',
  'const [reducedMotion, setReducedMotion] = useState(false);\n  const [colorTheme, setColorTheme] = useState("orange");'
);

// Add useEffect
const useEffectStr = `useEffect(() => {
    // Sync color theme
    document.documentElement.setAttribute("data-theme-color", colorTheme);
    localStorage.setItem("sabbir_color_theme", colorTheme);
  }, [colorTheme]);`;

content = content.replace(
  'useEffect(() => {\n    // Respect system motion preference',
  useEffectStr + '\n\n  useEffect(() => {\n    // Respect system motion preference'
);

// Add initialization
content = content.replace(
  'setSpatial3D(stored3D !== "false");',
  'setSpatial3D(stored3D !== "false");\n\n    const storedColor = localStorage.getItem("sabbir_color_theme");\n    if (storedColor) setColorTheme(storedColor);'
);

// Add UI
const colorUI = `
                {/* Color Theme Selector */}
                <div>
                  <label className="block mb-2 font-medium text-[var(--text-secondary)]">Vibrant Color Palette</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setColorTheme("orange");
                        sound.click();
                      }}
                      className={\`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all \${
                        colorTheme === "orange"
                          ? "border-orange-500 bg-orange-500/10 text-orange-500 font-bold"
                          : "border-[var(--border-glass)] hover:border-orange-500/50 text-[var(--text-secondary)]"
                      }\`}
                    >
                      <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,106,0,0.8)]" /> Orange
                    </button>
                    <button
                      onClick={() => {
                        setColorTheme("blue");
                        sound.click();
                      }}
                      className={\`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all \${
                        colorTheme === "blue"
                          ? "border-cyan-400 bg-cyan-400/10 text-cyan-500 font-bold dark:text-cyan-400"
                          : "border-[var(--border-glass)] hover:border-cyan-400/50 text-[var(--text-secondary)]"
                      }\`}
                    >
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" /> Blue
                    </button>
                    <button
                      onClick={() => {
                        setColorTheme("green");
                        sound.click();
                      }}
                      className={\`flex items-center justify-center gap-2 p-2 rounded-xl border transition-all \${
                        colorTheme === "green"
                          ? "border-emerald-400 bg-emerald-400/10 text-emerald-500 font-bold dark:text-emerald-400"
                          : "border-[var(--border-glass)] hover:border-emerald-400/50 text-[var(--text-secondary)]"
                      }\`}
                    >
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Green
                    </button>
                  </div>
                </div>
`;

content = content.replace(
  '{/* Sound Effects */}',
  colorUI + '\n                {/* Sound Effects */}'
);

fs.writeFileSync(file, content);
