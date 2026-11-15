/**
 * THE SABBiR OS — Popular & New Dual-Primary Sorting & Discovery Engine
 * Deterministic ranking with view/run/share metrics and human life-persona filtering.
 */

export type LifePersona =
  | "all"
  | "everyday"
  | "student"
  | "business"
  | "freelance"
  | "developer";

export type PrimaryDiscoveryTab = "popular" | "new";

export interface LifePersonaConfig {
  id: LifePersona;
  labelEn: string;
  labelBn: string;
  icon: string;
  description: string;
}

export const LIFE_PERSONAS: LifePersonaConfig[] = [
  {
    id: "all",
    labelEn: "All Tools",
    labelBn: "সব টুলস",
    icon: "🌐",
    description: "Every utility across the OS",
  },
  {
    id: "everyday",
    labelEn: "Everyday & Family",
    labelBn: "প্রাত্যহিক জীবন",
    icon: "👨‍👩‍👧",
    description: "Household bills, health cards, rent receipts, dawat & Islamic zakat",
  },
  {
    id: "student",
    labelEn: "Students & Jobs",
    labelBn: "শিক্ষার্থী ও চাকরি",
    icon: "🎓",
    description: "SSC/HSC GPA, University CGPA, BCS 300x300 photos & job age math",
  },
  {
    id: "business",
    labelEn: "Shop & Business",
    labelBn: "দোকান ও ব্যবসা",
    icon: "🛍️",
    description: "Dokan khata, WhatsApp macros, VAT/tax, invoice & barcodes",
  },
  {
    id: "freelance",
    labelEn: "Freelance & Office",
    labelBn: "ফ্রিল্যান্সিং ও অফিস",
    icon: "💼",
    description: "2.5% Remittance calculator, email signatures & CV privacy shield",
  },
  {
    id: "developer",
    labelEn: "Developer & DevOps",
    labelBn: "ডেভেলপার ও আইটি",
    icon: "💻",
    description: "SQL sandbox, Docker hardener, Cron explainer, Subnet & WAF",
  },
];

export interface DiscoveryMetadata {
  popularityScore?: number;
  views?: number;
  toolRuns?: number;
  shares?: number;
  addedAt?: string | Date;
  isNew?: boolean;
  autoDiscovered?: boolean;
  lifePersona?: LifePersona | LifePersona[];
}

/** Reference anchor date: November 15, 2026 */
const REFERENCE_DATE_MS = new Date("2026-11-15T00:00:00Z").getTime();

/**
 * Computes deterministic popularity score factoring in base weight,
 * live telemetry (runs, shares, views), and exponential time-decay.
 */
export function computePopularScore<T extends DiscoveryMetadata>(
  item: T,
  nowMs: number = REFERENCE_DATE_MS
): number {
  const base = item.popularityScore ?? 75;
  const runs = (item.toolRuns ?? 0) * 2.5;
  const shares = (item.shares ?? 0) * 4.0;
  const views = (item.views ?? 0) * 0.1;

  let addedMs = REFERENCE_DATE_MS;
  if (item.addedAt) {
    const parsed = new Date(item.addedAt).getTime();
    if (!isNaN(parsed) && parsed > 0) {
      addedMs = parsed;
    }
  }

  // Age in days relative to reference date (or current time)
  const ageDays = Math.max(0, (nowMs - addedMs) / (1000 * 60 * 60 * 24));
  // Mild decay over time (half-life of 180 days)
  const decayFactor = Math.pow(0.5, ageDays / 180);

  // Freshness boost for items added within the last 30 days
  const freshnessBoost = ageDays <= 30 ? 15 * (1 - ageDays / 30) : 0;

  const rawScore = (base + runs + shares + views + freshnessBoost) * decayFactor;
  return Math.round(rawScore * 10) / 10;
}

/**
 * Checks if an item is considered "Newly Discovered" or newly launched.
 */
export function isNewlyDiscovered<T extends DiscoveryMetadata>(
  item: T | string | Date,
  thresholdDays: number = 30,
  nowMs: number = REFERENCE_DATE_MS
): boolean {
  if (typeof item === "string" || item instanceof Date) {
    const addedMs = new Date(item).getTime();
    if (isNaN(addedMs)) return false;
    const diffDays = (nowMs - addedMs) / (1000 * 60 * 60 * 24);
    return diffDays >= -1 && diffDays <= thresholdDays;
  }
  if (item.isNew === true) return true;
  if (item.autoDiscovered === true) return true;
  if (!item.addedAt) return false;

  const addedMs = new Date(item.addedAt).getTime();
  if (isNaN(addedMs)) return false;

  const diffDays = (nowMs - addedMs) / (1000 * 60 * 60 * 24);
  return diffDays >= -1 && diffDays <= thresholdDays;
}

/**
 * Filters list by Life Persona.
 */
export function filterByLifePersona<T extends DiscoveryMetadata>(
  items: T[],
  persona: LifePersona
): T[] {
  if (persona === "all") return items;
  return items.filter((item) => {
    if (!item.lifePersona) return false;
    if (Array.isArray(item.lifePersona)) {
      return item.lifePersona.includes(persona);
    }
    return item.lifePersona === persona;
  });
}

/**
 * Primary Sorter: Sorts by either "popular" or "new".
 */
export function sortPopularOrNew<T extends DiscoveryMetadata>(
  items: T[],
  tab: PrimaryDiscoveryTab = "popular",
  nowMs: number = REFERENCE_DATE_MS
): T[] {
  const cloned = [...items];

  if (tab === "popular") {
    return cloned.sort((a, b) => {
      const scoreA = computePopularScore(a, nowMs);
      const scoreB = computePopularScore(b, nowMs);
      return scoreB - scoreA;
    });
  }

  // "new" tab: Sort newly discovered items first, ordered by addedAt descending
  return cloned.sort((a, b) => {
    const isNewA = isNewlyDiscovered(a, 30, nowMs);
    const isNewB = isNewlyDiscovered(b, 30, nowMs);

    if (isNewA && !isNewB) return -1;
    if (!isNewA && isNewB) return 1;

    const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
    const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;

    return computePopularScore(b, nowMs) - computePopularScore(a, nowMs);
  });
}
