const fs = require('fs');

let file = fs.readFileSync('src/components/lab/EngineeringLabSection.tsx', 'utf8');

const oldFilter = `<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                sound.click();
              }}
              className={\`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium transition-all \${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                  : "glass-subtle border border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-[var(--border-glass-hover)]"
              }\`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>`;

const newFilter = `<div className="mb-6 sm:mb-10 flex overflow-x-auto snap-x hide-scrollbar px-4 sm:px-0 sm:justify-center">
        <div className="flex items-center sm:flex-wrap gap-2 sm:gap-3 pb-2 sm:pb-0 min-w-max sm:min-w-0 mx-auto sm:mx-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sound.click();
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[13px] font-semibold transition-all relative whitespace-nowrap backdrop-blur-md shrink-0 snap-center",
                  isActive ? cat.activeColors : cat.colors,
                  !isActive && "hover:border-slate-500/30 hover:bg-slate-500/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryLab"
                    className="absolute inset-0 rounded-full bg-white/5 dark:bg-black/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>`;

file = file.replace(oldFilter, newFilter);
fs.writeFileSync('src/components/lab/EngineeringLabSection.tsx', file);
