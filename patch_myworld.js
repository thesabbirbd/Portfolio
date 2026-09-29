const fs = require('fs');
let file = fs.readFileSync('src/components/about/AboutSection.tsx', 'utf8');

const oldGrid = '<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">';
const newGrid = '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">';

const oldCard = `              <motion.div
                key={item.id}
                onMouseEnter={() => {
                  setHoveredWorld(item.id);
                  sound.hover();
                }}
                onMouseLeave={() => setHoveredWorld(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative p-4 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between min-h-[140px] cursor-default"
              >
                <div>
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-xs font-medium text-[var(--color-primary)] mt-0.5">{item.shortDesc}</p>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-2 line-clamp-2">
                  {item.fullDesc}
                </p>
              </motion.div>`;

const newCard = `              <motion.div
                key={item.id}
                onMouseEnter={() => {
                  setHoveredWorld(item.id);
                  sound.hover();
                }}
                onMouseLeave={() => setHoveredWorld(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative p-3 sm:p-4 rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-row sm:flex-col items-center sm:items-start text-left sm:justify-between min-h-[auto] sm:min-h-[140px] cursor-default"
              >
                <div className="flex-shrink-0 mr-3 sm:mr-0 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto rounded-full bg-[var(--color-primary)]/10 sm:bg-transparent">
                  <div className="text-xl sm:text-2xl">{item.emoji}</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-xs font-medium text-[var(--color-primary)] mt-0.5">{item.shortDesc}</p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-1 sm:mt-2 line-clamp-2 hidden sm:block">
                    {item.fullDesc}
                  </p>
                </div>
              </motion.div>`;

file = file.replace(oldGrid, newGrid);
file = file.replace(oldCard, newCard);

fs.writeFileSync('src/components/about/AboutSection.tsx', file);
