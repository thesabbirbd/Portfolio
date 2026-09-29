const fs = require('fs');
let file = fs.readFileSync('src/components/about/AboutSection.tsx', 'utf8');

// Replace the 4 cards with a denser mobile design
const oldCards = /<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">.*?<\/div>\n      <\/div>\n\n      {\/\* "My World" Interactive 6-Card Identity Grid \(Section 22\) \*\/}/s;

const newCards = `<div className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-4">
          {/* Academic Card */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[9px] sm:text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider leading-tight">
                Academic
              </h3>
            </div>
            <div>
              <p className="text-xs sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                {PROFILE_DATA.academic.degree}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-0.5 sm:mt-1 leading-tight line-clamp-2">
                {PROFILE_DATA.academic.institution}
              </p>
              <p className="hidden sm:block text-[11px] text-[var(--text-muted)] pt-1">
                Foundation: {PROFILE_DATA.academic.foundation}
              </p>
            </div>
          </div>

          {/* Geographic Base */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] dark:text-[var(--color-secondary)] flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[9px] sm:text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider leading-tight">
                Base
              </h3>
            </div>
            <div>
              <p className="text-xs sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                {PROFILE_DATA.academic.location}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-0.5 sm:mt-1 leading-tight">
                Roots: {PROFILE_DATA.academic.origin}
              </p>
              <p className="text-[9px] sm:text-[11px] text-[var(--color-accent)] dark:text-[var(--color-accent)] font-mono pt-1">
                ● BST (UTC+6)
              </p>
            </div>
          </div>

          {/* Core Focus */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[9px] sm:text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider leading-tight">
                Discipline
              </h3>
            </div>
            <div>
              <p className="text-xs sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                Backend &bull; AI
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-0.5 sm:mt-1 leading-tight line-clamp-2">
                FastAPI, Postgres, Docker
              </p>
              <p className="hidden sm:block text-[11px] text-[var(--text-muted)] pt-1">
                Offline LLMs &bull; GPU
              </p>
            </div>
          </div>

          {/* Field Recognition */}
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-9 sm:h-9 shrink-0 rounded-lg sm:rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] flex items-center justify-center">
                <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-[9px] sm:text-xs font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider leading-tight">
                Honors
              </h3>
            </div>
            <div>
              <p className="text-[11px] sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                Google Local Guide 🎁
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-0.5 sm:mt-1 leading-tight line-clamp-2">
                Google HQ Gift Recipient
              </p>
              <p className="hidden sm:block text-[11px] text-[var(--text-muted)] pt-1">
                NOC Intern &bull; BHTPA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "My World" Interactive 6-Card Identity Grid (Section 22) */}`;

file = file.replace(oldCards, newCards);
fs.writeFileSync('src/components/about/AboutSection.tsx', file);
