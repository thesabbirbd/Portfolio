const fs = require('fs');

let comm = fs.readFileSync('src/components/community/CommunitySection.tsx', 'utf8');

comm = comm.replace(
  'className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"',
  'className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"'
);
comm = comm.replace(
  'className="flex flex-col items-center text-center mb-16"',
  'className="flex flex-col items-center text-center mb-6 sm:mb-16"'
);
comm = comm.replace(
  'className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4"',
  'className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2 sm:mb-4"'
);
comm = comm.replace(
  'className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]"',
  'className="max-w-2xl text-xs sm:text-lg text-[var(--text-muted)] px-4 sm:px-0"'
);
comm = comm.replace(
  'className="grid grid-cols-1 lg:grid-cols-3 gap-8"',
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"'
);
comm = comm.replace(
  /className="p-5 rounded-2xl glass-interactive border border-\[var\(--border-glass\)\] flex flex-col justify-between"/g,
  'className="p-3 sm:p-5 rounded-xl sm:rounded-2xl glass-interactive border border-[var(--border-glass)] flex flex-col justify-between"'
);
comm = comm.replace(
  /className="flex items-center justify-between gap-2 mb-2"/g,
  'className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2"'
);
comm = comm.replace(
  /className="text-xs font-bold px-2 py-0.5 rounded-full bg-\[var\(--color-primary\)\]\/10 text-\[var\(--color-primary\)\]"/g,
  'className="text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"'
);
comm = comm.replace(
  /className="text-base font-bold text-\[var\(--text-primary\)\] mb-1\.5"/g,
  'className="text-[11px] sm:text-base font-bold text-[var(--text-primary)] mb-1 sm:mb-1.5 leading-snug sm:leading-normal"'
);
comm = comm.replace(
  /className="text-xs sm:text-sm text-\[var\(--text-secondary\)\] leading-relaxed"/g,
  'className="text-[10px] sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-relaxed"'
);
comm = comm.replace(
  /className="pt-3 mt-3 border-t border-\[var\(--border-glass\)\]"/g,
  'className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-[var(--border-glass)]"'
);
comm = comm.replace(
  /className="inline-flex items-center gap-1\.5 text-xs font-medium text-\[var\(--color-primary\)\] hover:underline"/g,
  'className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-medium text-[var(--color-primary)] hover:underline"'
);

fs.writeFileSync('src/components/community/CommunitySection.tsx', comm);

// Mission Section
let mission = fs.readFileSync('src/components/mission/MissionSection.tsx', 'utf8');

mission = mission.replace(
  'className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"',
  'className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"'
);
mission = mission.replace(
  'className="flex flex-col items-center text-center mb-16"',
  'className="flex flex-col items-center text-center mb-6 sm:mb-16"'
);
mission = mission.replace(
  'className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4"',
  'className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2 sm:mb-4"'
);
mission = mission.replace(
  'className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]"',
  'className="max-w-2xl text-xs sm:text-lg text-[var(--text-muted)] px-4 sm:px-0"'
);
mission = mission.replace(
  'className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"',
  'className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center"'
);
mission = mission.replace(
  'className="lg:col-span-6 space-y-6"',
  'className="lg:col-span-6 space-y-4 sm:space-y-6"'
);
mission = mission.replace(
  'className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight"',
  'className="text-lg sm:text-3xl font-bold text-[var(--text-primary)] leading-tight"'
);
mission = mission.replace(
  'className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"',
  'className="text-[11px] sm:text-base text-[var(--text-secondary)] leading-snug sm:leading-relaxed"'
);
mission = mission.replace(
  'className="p-5 sm:p-6 rounded-2xl glass-panel border border-[var(--border-glass)] space-y-3"',
  'className="p-3 sm:p-6 rounded-xl sm:rounded-2xl glass-panel border border-[var(--border-glass)] space-y-2 sm:space-y-3"'
);
mission = mission.replace(
  'className="text-sm text-[var(--text-secondary)]"',
  'className="text-[10px] sm:text-sm text-[var(--text-secondary)]"'
);
mission = mission.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-glass)]"',
  'className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4 border-t border-[var(--border-glass)]"'
);
mission = mission.replace(
  /className="flex items-center gap-2\.5 text-sm font-medium text-\[var\(--text-primary\)\]"/g,
  'className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-sm font-medium text-[var(--text-primary)]"'
);

fs.writeFileSync('src/components/mission/MissionSection.tsx', mission);
