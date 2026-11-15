/**
 * THE SABBiR OS — Prescription Medicine Scheduler & Pill Refill Engine
 * Parses BD shorthand (1+0+1), calculates strip refills and costs,
 * and generates RFC 5545 .ics calendar alarms.
 */

export interface MedicineDoseItem {
  id: string;
  name: string;
  strength: string; // e.g. "500mg", "20mg"
  type: "tablet" | "capsule" | "syrup" | "drop" | "injection";
  rawDosePattern: string; // e.g. "1+0+1", "1+1+1", "0+0+1", "SOS"
  morningCount: number;
  noonCount: number;
  nightCount: number;
  isSos: boolean;
  instruction: "before_meal" | "after_meal" | "empty_stomach" | "anytime";
  durationDays: number;
  unitPriceBdt: number;
  stripSize: number; // e.g. 10 or 14 tablets per strip
  notes?: string;
}

export interface RefillSummary {
  dailyDoseTotal: number;
  totalPillsNeeded: number;
  stripsToBuy: number;
  totalCostBdt: number;
  refillDate: string; // YYYY-MM-DD
}

/**
 * Parses shorthand dose string (e.g. "1+0+1", "1+1+1", "0+1+0", "0.5+0+0.5", "SOS")
 */
export function parseDosePattern(pattern: string): {
  morning: number;
  noon: number;
  night: number;
  isSos: boolean;
} {
  const clean = pattern.trim().toUpperCase();
  if (clean === "SOS" || clean.includes("প্রয়োজন")) {
    return { morning: 0, noon: 0, night: 0, isSos: true };
  }

  const parts = clean.split("+").map((p) => parseFloat(p.trim()));
  if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return {
      morning: parts[0] || 0,
      noon: parts[1] || 0,
      night: parts[2] || 0,
      isSos: false,
    };
  }

  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return {
      morning: parts[0] || 0,
      noon: 0,
      night: parts[1] || 0,
      isSos: false,
    };
  }

  if (parts.length === 1 && !isNaN(parts[0])) {
    return {
      morning: parts[0] || 0,
      noon: 0,
      night: 0,
      isSos: false,
    };
  }

  // Default fallback
  return { morning: 1, noon: 0, night: 1, isSos: false };
}

/**
 * Calculates total pills, strips to buy, cost, and refill date.
 */
export function calculateMedicineRefill(
  item: MedicineDoseItem,
  startDate: Date = new Date()
): RefillSummary {
  const daily = item.isSos ? 1 : item.morningCount + item.noonCount + item.nightCount;
  const totalPills = Math.ceil(daily * Math.max(1, item.durationDays));
  const strips = Math.ceil(totalPills / Math.max(1, item.stripSize || 10));
  const cost = totalPills * (item.unitPriceBdt || 0);

  const refillDateObj = new Date(startDate);
  refillDateObj.setDate(refillDateObj.getDate() + Math.max(1, item.durationDays));
  const refillDate = refillDateObj.toISOString().split("T")[0];

  return {
    dailyDoseTotal: daily,
    totalPillsNeeded: totalPills,
    stripsToBuy: strips,
    totalCostBdt: Math.round(cost * 10) / 10,
    refillDate,
  };
}

/**
 * Bangla text translation of instruction timing
 */
export function formatInstructionBn(instruction: MedicineDoseItem["instruction"]): string {
  switch (instruction) {
    case "before_meal":
      return "খাবার আগে (Before Meal)";
    case "after_meal":
      return "খাবার পরে (After Meal)";
    case "empty_stomach":
      return "খালি পেটে (Empty Stomach)";
    case "anytime":
      return "যেকোনো সময় (Anytime)";
  }
}

/**
 * Generates standard RFC 5545 iCalendar (.ics) string for phone alarms.
 */
export function generateIcsCalendar(
  items: MedicineDoseItem[],
  startDate: Date = new Date()
): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDateUtc = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//THE SABBiR OS//Prescription Pill Alarm//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Prescription Medicine Alarms",
    "X-WR-TIMEZONE:Asia/Dhaka",
  ];

  const times = [
    { label: "সকাল (Morning)", hour: 8, minute: 0, key: "morningCount" as const },
    { label: "দুপুর (Noon)", hour: 13, minute: 30, key: "noonCount" as const },
    { label: "রাত (Night)", hour: 21, minute: 30, key: "nightCount" as const },
  ];

  for (const time of times) {
    const medsForTime = items.filter((m) => !m.isSos && m[time.key] > 0);
    if (medsForTime.length === 0) continue;

    const eventStart = new Date(startDate);
    eventStart.setHours(time.hour, time.minute, 0, 0);
    const eventEnd = new Date(eventStart);
    eventEnd.setMinutes(eventEnd.getMinutes() + 15);

    const descList = medsForTime
      .map((m) => `• ${m.name} (${m.strength}): ${m[time.key]} ${m.type} [${formatInstructionBn(m.instruction)}]`)
      .join("\\n");

    ics.push(
      "BEGIN:VEVENT",
      `UID:med-alarm-${time.hour}-${Date.now()}@sabbir.nav.bd`,
      `DTSTAMP:${formatDateUtc(new Date())}`,
      `DTSTART:${formatDateUtc(eventStart)}`,
      `DTEND:${formatDateUtc(eventEnd)}`,
      `RRULE:FREQ=DAILY;COUNT=${Math.max(...items.map((i) => i.durationDays || 7))}`,
      `SUMMARY:💊 ওষুধ খাওয়ার সময়: ${time.label}`,
      `DESCRIPTION:${descList}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Medicine Pill Reminder",
      "TRIGGER:-PT0M",
      "END:VALARM",
      "END:VEVENT"
    );
  }

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}

/**
 * Default sample prescriptions for instant 1-click loading
 */
export const SAMPLE_PRESCRIPTION_DIABETIC: MedicineDoseItem[] = [
  {
    id: "med-1",
    name: "Metformin (Comet)",
    strength: "500mg",
    type: "tablet",
    rawDosePattern: "1+0+1",
    morningCount: 1,
    noonCount: 0,
    nightCount: 1,
    isSos: false,
    instruction: "after_meal",
    durationDays: 30,
    unitPriceBdt: 4.5,
    stripSize: 10,
    notes: "ডায়াবেটিস নিয়ন্ত্রণ - খাবারের পর",
  },
  {
    id: "med-2",
    name: "Rosuvastatin (Rovista)",
    strength: "10mg",
    type: "tablet",
    rawDosePattern: "0+0+1",
    morningCount: 0,
    noonCount: 0,
    nightCount: 1,
    isSos: false,
    instruction: "after_meal",
    durationDays: 30,
    unitPriceBdt: 18.0,
    stripSize: 10,
    notes: "কোলেস্টেরল নিয়ন্ত্রণ - রাতে খাবারের পর",
  },
  {
    id: "med-3",
    name: "Esomeprazole (Maxpro)",
    strength: "20mg",
    type: "capsule",
    rawDosePattern: "1+0+1",
    morningCount: 1,
    noonCount: 0,
    nightCount: 1,
    isSos: false,
    instruction: "before_meal",
    durationDays: 14,
    unitPriceBdt: 7.0,
    stripSize: 14,
    notes: "গ্যাস্ট্রিকের ওষুধ - সকালে ও রাতে খাবারের ২০ মিনিট আগে",
  },
  {
    id: "med-4",
    name: "Paracetamol (Napa Extra)",
    strength: "500mg+65mg",
    type: "tablet",
    rawDosePattern: "SOS",
    morningCount: 0,
    noonCount: 0,
    nightCount: 0,
    isSos: true,
    instruction: "after_meal",
    durationDays: 7,
    unitPriceBdt: 3.0,
    stripSize: 10,
    notes: "মাথাব্যথা বা জ্বর থাকলে খাবেন",
  },
];
