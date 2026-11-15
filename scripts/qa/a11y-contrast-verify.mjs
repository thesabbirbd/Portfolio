// Mathematical WCAG AAA/AA Contrast Verification for THE SABBiR OS tokens
// Evaluates Light & Dark modes across Orange, Green, Blue theme palettes
// Run: node scripts/qa/a11y-contrast-verify.mjs

const THEMES = {
  orange: {
    light: {
      paper: [250, 247, 241],
      surface: [255, 255, 255],
      surfaceAlpha: 0.72,
      surfaceWell: [243, 239, 234],
      muted: [241, 234, 222],
      ink: [28, 24, 20],
      ink2: [66, 60, 54],
      ink3: [87, 80, 72],
      primary: [178, 58, 10],
      accent: [156, 78, 8],
      signal: [12, 104, 130],
      ok: [4, 108, 79],
      onPrimary: [255, 255, 255],
    },
    dark: {
      paper: [17, 14, 12],
      surface: [31, 27, 24],
      surfaceAlpha: 0.66,
      surfaceWell: [20, 17, 15],
      muted: [38, 33, 29],
      ink: [245, 240, 232],
      ink2: [219, 211, 201],
      ink3: [173, 163, 151],
      primary: [255, 106, 0],
      accent: [255, 184, 0],
      signal: [34, 211, 238],
      ok: [52, 211, 153],
      onPrimary: [17, 14, 12],
    },
  },
  green: {
    light: {
      paper: [247, 246, 238],
      surface: [255, 255, 252],
      surfaceAlpha: 0.74,
      surfaceWell: [238, 237, 228],
      muted: [237, 236, 224],
      ink: [20, 28, 23],
      ink2: [55, 66, 58],
      ink3: [76, 86, 79],
      primary: [4, 106, 77],
      accent: [13, 104, 97],
      signal: [12, 104, 130],
      ok: [4, 108, 79],
      onPrimary: [255, 255, 255],
    },
    dark: {
      paper: [11, 17, 14],
      surface: [21, 30, 25],
      surfaceAlpha: 0.68,
      surfaceWell: [14, 20, 17],
      muted: [27, 37, 31],
      ink: [236, 243, 238],
      ink2: [205, 218, 210],
      ink3: [156, 173, 163],
      primary: [52, 211, 153],
      accent: [163, 230, 53],
      signal: [34, 211, 238],
      ok: [52, 211, 153],
      onPrimary: [11, 17, 14],
    },
  },
  blue: {
    light: {
      paper: [246, 248, 251],
      surface: [255, 255, 255],
      surfaceAlpha: 0.74,
      surfaceWell: [236, 241, 248],
      muted: [233, 238, 245],
      ink: [15, 23, 42],
      ink2: [51, 65, 85],
      ink3: [71, 85, 105],
      primary: [29, 78, 216],
      accent: [12, 104, 130],
      signal: [12, 104, 130],
      ok: [4, 108, 79],
      onPrimary: [255, 255, 255],
    },
    dark: {
      paper: [8, 12, 20],
      surface: [17, 24, 38],
      surfaceAlpha: 0.68,
      surfaceWell: [11, 16, 26],
      muted: [23, 31, 48],
      ink: [232, 238, 247],
      ink2: [203, 213, 225],
      ink3: [148, 163, 184],
      primary: [96, 165, 250],
      accent: [34, 211, 238],
      signal: [34, 211, 238],
      ok: [52, 211, 153],
      onPrimary: [8, 12, 20],
    },
  },
};

function relLuminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(rgb1, rgb2) {
  const l1 = relLuminance(rgb1);
  const l2 = relLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function blend(top, alpha, bottom) {
  return [
    Math.round(top[0] * alpha + bottom[0] * (1 - alpha)),
    Math.round(top[1] * alpha + bottom[1] * (1 - alpha)),
    Math.round(top[2] * alpha + bottom[2] * (1 - alpha)),
  ];
}

export function verifyAllThemes() {
  let totalChecks = 0;
  let passedChecks = 0;
  const failures = [];

  for (const [themeName, modes] of Object.entries(THEMES)) {
    for (const [modeName, t] of Object.entries(modes)) {
      const card = blend(t.surface, t.surfaceAlpha, t.paper);
      const bgSurfaces = [
        { name: "paper", rgb: t.paper },
        { name: "card", rgb: card },
        { name: "surfaceWell", rgb: t.surfaceWell },
        { name: "muted", rgb: t.muted },
      ];

      // Body text tokens must meet WCAG AAA (>= 7.0 for ink) or AA (>= 4.5 for ink-2, ink-3)
      for (const bg of bgSurfaces) {
        const crInk = contrastRatio(t.ink, bg.rgb);
        totalChecks++;
        if (crInk >= 7.0) passedChecks++;
        else failures.push(`${themeName} ${modeName} ink on ${bg.name}: ${crInk.toFixed(2)} < 7.0`);

        const crInk2 = contrastRatio(t.ink2, bg.rgb);
        totalChecks++;
        if (crInk2 >= 4.5) passedChecks++;
        else failures.push(`${themeName} ${modeName} ink2 on ${bg.name}: ${crInk2.toFixed(2)} < 4.5`);

        const crInk3 = contrastRatio(t.ink3, bg.rgb);
        totalChecks++;
        if (crInk3 >= 4.5) passedChecks++;
        else failures.push(`${themeName} ${modeName} ink3 on ${bg.name}: ${crInk3.toFixed(2)} < 4.5`);
      }

      // onPrimary on primary must be >= 4.5:1
      const crOnPrimary = contrastRatio(t.onPrimary, t.primary);
      totalChecks++;
      if (crOnPrimary >= 4.5) passedChecks++;
      else failures.push(`${themeName} ${modeName} onPrimary on primary: ${crOnPrimary.toFixed(2)} < 4.5`);
    }
  }

  return { totalChecks, passedChecks, failures };
}

console.log("🔍 Running THE SABBiR OS Mathematical Contrast Audit...");
const result = verifyAllThemes();
console.log(`Passed ${result.passedChecks} / ${result.totalChecks} checks.`);
if (result.failures.length > 0) {
  console.error("FAILURES:\n" + result.failures.join("\n"));
  process.exit(1);
} else {
  console.log("✅ ALL TOKEN PAIRS PASS WCAG AAA / AA ACROSS ALL 6 THEMES!");
}
