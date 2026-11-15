/**
 * THE SABBiR OS — Color Design Lab & WCAG Contrast Matrix Engine
 * Generates 50-950 Tailwind v4 shade stops, calculates WCAG 2.1 contrast ratios,
 * and generates CSS Glassmorphism tokens.
 */

export interface ShadeStop {
  stop: number;
  hex: string;
  luminance: number;
  contrastOnWhite: number;
  contrastOnBlack: number;
}

export interface WcagRating {
  ratio: number;
  aaNormal: boolean; // >= 4.5
  aaLarge: boolean; // >= 3.0
  aaaNormal: boolean; // >= 7.0
  aaaLarge: boolean; // >= 4.5
}

/**
 * Calculates relative luminance according to WCAG 2.1 (sRGB formula).
 */
export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors: (L1 + 0.05) / (L2 + 0.05).
 */
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function evaluateWcagCompliance(ratio: number): WcagRating {
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

/**
 * Generates Tailwind v4 50-950 color stops from a single base color.
 */
export function generateTailwindScale(baseHex: string): ShadeStop[] {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Convert hex to HSL
  const clean = baseHex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Lightness curve mapping for Tailwind stops
  const lightnessMap: Record<number, number> = {
    50: 0.96,
    100: 0.91,
    200: 0.82,
    300: 0.71,
    400: 0.59,
    500: l, // Base color
    600: Math.max(0.15, l * 0.85),
    700: Math.max(0.12, l * 0.72),
    800: Math.max(0.08, l * 0.55),
    900: Math.max(0.05, l * 0.38),
    950: Math.max(0.03, l * 0.22),
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  return stops.map((stop) => {
    const targetL = lightnessMap[stop];
    const hex = stop === 500 ? baseHex.toUpperCase() : hslToHex(h, s, targetL);
    const lum = getRelativeLuminance(hex);
    return {
      stop,
      hex,
      luminance: Number(lum.toFixed(4)),
      contrastOnWhite: calculateContrastRatio(hex, "#FFFFFF"),
      contrastOnBlack: calculateContrastRatio(hex, "#000000"),
    };
  });
}
