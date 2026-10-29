// Content dates in frontmatter are written at the precision that is actually known:
// "2025" (year), "2025-03" (month) or "2025-03-14" (day). Display and sorting must never add
// precision that isn't there (e.g. "2025" must not render as "Jan 1, 2025").

export type DatePrecision = "year" | "month" | "day";

const PATTERN = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/;

export function parseContentDate(value: string | undefined | null): { time: number; precision: DatePrecision } | null {
  const raw = String(value ?? "").trim();
  if (DATETIME.test(raw)) {
    const time = Date.parse(raw);
    return Number.isNaN(time) ? null : { time, precision: "day" };
  }
  const m = PATTERN.exec(raw);
  if (!m) return null;
  const [, y, mo, d] = m;
  const month = mo ? Number(mo) : 1;
  const day = d ? Number(d) : 1;
  const time = Date.UTC(Number(y), month - 1, day);
  const check = new Date(time);
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null; // e.g. 2025-02-31
  return { time, precision: d ? "day" : mo ? "month" : "year" };
}

export const isValidContentDate = (value: string | undefined | null) => parseContentDate(value) !== null;

/** Sort key (ms since epoch); unknown/invalid dates sort last. */
export const contentDateTime = (value: string | undefined | null) => parseContentDate(value)?.time ?? 0;

/** Human date at the known precision: "Mar 14, 2025" / "Mar 2025" / "2025". */
export function formatContentDate(value: string | undefined | null, monthStyle: "short" | "long" = "short"): string {
  const parsed = parseContentDate(value);
  if (!parsed) return "";
  const opts: Intl.DateTimeFormatOptions =
    parsed.precision === "day"
      ? { month: monthStyle, day: "numeric", year: "numeric", timeZone: "UTC" }
      : parsed.precision === "month"
        ? { month: monthStyle, year: "numeric", timeZone: "UTC" }
        : { year: "numeric", timeZone: "UTC" };
  return new Date(parsed.time).toLocaleDateString("en-US", opts);
}

/** RFC 822 date for RSS, or undefined when the date is unknown (pubDate is optional in RSS 2.0). */
export function rssDate(value: string | undefined | null): string | undefined {
  const parsed = parseContentDate(value);
  return parsed ? new Date(parsed.time).toUTCString() : undefined;
}

/** The latest of `updated` and `date` (for sitemap lastmod / dateModified). */
export function lastModified(meta: { date?: string; updated?: string }): string | undefined {
  const candidates = [meta.updated, meta.date].filter((d): d is string => isValidContentDate(d));
  if (!candidates.length) return undefined;
  return candidates.sort((a, b) => contentDateTime(b) - contentDateTime(a))[0];
}
