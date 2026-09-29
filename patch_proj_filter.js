const fs = require('fs');

let file = fs.readFileSync('src/components/projects/ProjectsSection.tsx', 'utf8');

const oldFilter = `<div className="mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-center gap-2 min-w-max px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                sound.click();
                setActiveCategory(cat.key);
              }}
              className={cn(
                "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all relative whitespace-nowrap border border-transparent",
                activeCategory === cat.key
                  ? "text-blue-600 dark:text-cyan-400 border-blue-500/20 dark:border-[var(--color-secondary)]/20"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              )}
            >
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="activeCategoryProj"
                  className="absolute inset-0 bg-blue-500/10 dark:bg-cyan-400/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>`;

const newFilter = `<div className="mb-6 sm:mb-10 flex overflow-x-auto snap-x hide-scrollbar px-4 sm:justify-center">
        <div className="flex items-center gap-2 sm:gap-3 pb-2 min-w-max mx-auto">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  sound.click();
                  setActiveCategory(cat.key);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all relative whitespace-nowrap backdrop-blur-md shrink-0 snap-center",
                  isActive ? cat.activeColors : cat.colors,
                  !isActive && "hover:border-slate-500/30 hover:bg-slate-500/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryProj"
                    className="absolute inset-0 rounded-full bg-white/5 dark:bg-black/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>`;

file = file.replace(oldFilter, newFilter);

fs.writeFileSync('src/components/projects/ProjectsSection.tsx', file);
