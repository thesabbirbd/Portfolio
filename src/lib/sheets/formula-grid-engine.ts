/**
 * Reactive Spreadsheet Evaluator, Formula Engine & Bangladeshi Template Vault.
 * Supports: =SUM(), =AVERAGE(), =MIN(), =MAX(), =COUNT(), =IF() with circular reference protection.
 * 100% Client-Side. Zero external spreadsheet library dependencies.
 */

export interface SheetCell {
  raw: string;
  computed: string | number;
  isFormula: boolean;
}

export type GridData = Record<string, string>; // cellId (e.g. "A1") -> raw string

export interface SheetTemplate {
  id: string;
  name: string;
  category: "business" | "personal" | "fcommerce" | "hr" | "saas";
  description: string;
  cols: string[]; // e.g. ["A", "B", "C", "D", "E"]
  rowCount: number;
  initialData: GridData;
}

/** Convert column index (0-based) to letter (0 -> A, 1 -> B, 25 -> Z) */
export function colToLetter(colIndex: number): string {
  let letter = "";
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/** Convert column letter to index (A -> 0, B -> 1, Z -> 25) */
export function letterToCol(colStr: string): number {
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return col - 1;
}

/** Parse Cell ID like "B4" into { col: 1, row: 3 } (0-indexed) */
export function parseCellId(cellId: string): { col: number; row: number } | null {
  const match = cellId.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  return {
    col: letterToCol(match[1]),
    row: parseInt(match[2], 10) - 1,
  };
}

/** Expand range "A1:A4" into ["A1", "A2", "A3", "A4"] */
export function expandRange(rangeStr: string): string[] {
  const parts = rangeStr.split(":");
  if (parts.length !== 2) return [rangeStr.trim().toUpperCase()];

  const p1 = parseCellId(parts[0]);
  const p2 = parseCellId(parts[1]);
  if (!p1 || !p2) return [rangeStr.trim().toUpperCase()];

  const minCol = Math.min(p1.col, p2.col);
  const maxCol = Math.max(p1.col, p2.col);
  const minRow = Math.min(p1.row, p2.row);
  const maxRow = Math.max(p1.row, p2.row);

  const cells: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(`${colToLetter(c)}${r + 1}`);
    }
  }
  return cells;
}

/**
 * Evaluate single cell formula with circular reference detection.
 */
export function evaluateCell(
  cellId: string,
  grid: GridData,
  visited: Set<string> = new Set()
): string | number {
  const raw = (grid[cellId] ?? "").trim();
  if (!raw.startsWith("=")) {
    // Plain number or text
    const num = Number(raw);
    return isNaN(num) || raw === "" ? raw : num;
  }

  // Circular dependency check
  if (visited.has(cellId)) {
    return "#CIRCULAR!";
  }
  visited.add(cellId);

  try {
    const expr = raw.slice(1).trim();

    // 1. =SUM(A1:A5)
    const sumMatch = expr.match(/^SUM\(([^)]+)\)$/i);
    if (sumMatch) {
      const cells = expandRange(sumMatch[1]);
      let total = 0;
      for (const c of cells) {
        const val = evaluateCell(c, grid, new Set(visited));
        if (typeof val === "number") total += val;
      }
      return total;
    }

    // 2. =AVERAGE(A1:A5)
    const avgMatch = expr.match(/^AVERAGE\(([^)]+)\)$/i);
    if (avgMatch) {
      const cells = expandRange(avgMatch[1]);
      let total = 0;
      let count = 0;
      for (const c of cells) {
        const val = evaluateCell(c, grid, new Set(visited));
        if (typeof val === "number") {
          total += val;
          count++;
        }
      }
      return count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    }

    // 3. =MIN(A1:A5) and =MAX(A1:A5)
    const minMatch = expr.match(/^MIN\(([^)]+)\)$/i);
    if (minMatch) {
      const cells = expandRange(minMatch[1]);
      const numbers = cells
        .map((c) => evaluateCell(c, grid, new Set(visited)))
        .filter((v): v is number => typeof v === "number");
      return numbers.length > 0 ? Math.min(...numbers) : 0;
    }

    const maxMatch = expr.match(/^MAX\(([^)]+)\)$/i);
    if (maxMatch) {
      const cells = expandRange(maxMatch[1]);
      const numbers = cells
        .map((c) => evaluateCell(c, grid, new Set(visited)))
        .filter((v): v is number => typeof v === "number");
      return numbers.length > 0 ? Math.max(...numbers) : 0;
    }

    // 4. =COUNT(A1:A5)
    const countMatch = expr.match(/^COUNT\(([^)]+)\)$/i);
    if (countMatch) {
      const cells = expandRange(countMatch[1]);
      const count = cells.filter((c) => {
        const val = evaluateCell(c, grid, new Set(visited));
        return val !== "" && typeof val === "number";
      }).length;
      return count;
    }

    // 5. =IF(B2>100, "VIP", "Regular") or =IF(A1>0, 10, 0)
    const ifMatch = expr.match(/^IF\((.+?),\s*(.+?),\s*(.+?)\)$/i);
    if (ifMatch) {
      const condition = ifMatch[1].trim();
      const trueVal = ifMatch[2].trim().replace(/^["']|["']$/g, "");
      const falseVal = ifMatch[3].trim().replace(/^["']|["']$/g, "");

      // Resolve cell in condition e.g. B2 > 100
      const condParsed = condition.replace(/[A-Z]+\d+/gi, (c) => {
        const resolved = evaluateCell(c.toUpperCase(), grid, new Set(visited));
        return typeof resolved === "number" ? String(resolved) : `"${resolved}"`;
      });

      // Safe boolean comparison
      const isTrue = evaluateSimpleCondition(condParsed);
      const chosen = isTrue ? trueVal : falseVal;
      const numChosen = Number(chosen);
      return isNaN(numChosen) ? chosen : numChosen;
    }

    // 6. Basic arithmetic with cell substitution: e.g. A1 + B1 * 2
    let hasCircular = false;
    const arithmeticExpr = expr.replace(/[A-Z]+\d+/gi, (c) => {
      const resolved = evaluateCell(c.toUpperCase(), grid, new Set(visited));
      if (resolved === "#CIRCULAR!") {
        hasCircular = true;
      }
      return typeof resolved === "number" ? String(resolved) : "0";
    });

    if (hasCircular) {
      return "#CIRCULAR!";
    }

    if (/^[0-9+\-*/().\s]+$/.test(arithmeticExpr)) {
      // Safe arithmetic evaluator without arbitrary eval
      const result = Function(`"use strict"; return (${arithmeticExpr})`)();
      return typeof result === "number" && !isNaN(result) ? Math.round(result * 100) / 100 : "#ERR";
    }

    return "#ERR";
  } catch {
    return "#ERR";
  }
}

function evaluateSimpleCondition(cond: string): boolean {
  if (cond.includes(">=")) {
    const [left, right] = cond.split(">=").map((s) => Number(s.trim()));
    return left >= right;
  }
  if (cond.includes("<=")) {
    const [left, right] = cond.split("<=").map((s) => Number(s.trim()));
    return left <= right;
  }
  if (cond.includes(">")) {
    const [left, right] = cond.split(">").map((s) => Number(s.trim()));
    return left > right;
  }
  if (cond.includes("<")) {
    const [left, right] = cond.split("<").map((s) => Number(s.trim()));
    return left < right;
  }
  if (cond.includes("==") || cond.includes("=")) {
    const parts = cond.split(/={1,2}/).map((s) => s.trim().replace(/^["']|["']$/g, ""));
    return parts[0] === parts[1];
  }
  return false;
}

/**
 * Compute all cells in the grid.
 */
export function computeEntireGrid(grid: GridData): Record<string, string | number> {
  const result: Record<string, string | number> = {};
  for (const cellId of Object.keys(grid)) {
    result[cellId] = evaluateCell(cellId, grid);
  }
  return result;
}

/**
 * 5 Pre-configured Bangladeshi & SaaS Templates
 */
export const SPREADSHEET_TEMPLATES: SheetTemplate[] = [
  {
    id: "dokan_cash_baki",
    name: "Daily Dokan Cash & Baki Ledger",
    category: "business",
    description: "দোকানের দৈনিক নগদ বিক্রি, খরচ, বাকি কাস্টমার ও দিনশেষে ক্যাশ হিসাব।",
    cols: ["A", "B", "C", "D", "E"],
    rowCount: 12,
    initialData: {
      A1: "বিবরণ / আইটেম",
      B1: "ক্যাশ বিক্রি (৳)",
      C1: "দোকান খরচ (৳)",
      D1: "বাকি খাতা (৳)",
      E1: "নেট ব্যালেন্স (৳)",

      A2: "সকাল খোলার ক্যাশ",
      B2: "5000",
      C2: "0",
      D2: "0",
      E2: "=B2-C2",

      A3: "মিনিকেট চাল ও ডাল",
      B3: "8500",
      C3: "200",
      D3: "1200",
      E3: "=B3-C3",

      A4: "তেল ও চিনি পাইকারি",
      B4: "6200",
      C4: "0",
      D4: "800",
      E4: "=B4-C4",

      A5: "দোকান বিদ্যুৎ ও নাস্তা",
      B5: "0",
      C5: "450",
      D5: "0",
      E5: "=B5-C5",

      A6: "মোট যোগফল",
      B6: "=SUM(B2:B5)",
      C6: "=SUM(C2:C5)",
      D6: "=SUM(D2:D5)",
      E6: "=SUM(E2:E5)",
    },
  },
  {
    id: "family_budget_bd",
    name: "Monthly Family Budget BD",
    category: "personal",
    description: "বাড়ি ভাড়া, বাজার, স্কুল ফি, ইউটিলিটি বিল ও মাসিক সঞ্চয় ট্র্যাকার।",
    cols: ["A", "B", "C", "D"],
    rowCount: 10,
    initialData: {
      A1: "ব্যয়ের খাত",
      B1: "বাজেট (৳)",
      C1: "প্রকৃত খরচ (৳)",
      D1: "সাশ্রয় (৳)",

      A2: "বাসা ভাড়া",
      B2: "18000",
      C2: "18000",
      D2: "=B2-C2",

      A3: "মাসিক বাজার ও খাদ্য",
      B3: "15000",
      C3: "14200",
      D3: "=B3-C3",

      A4: "বিদ্যুৎ, গ্যাস ও ওয়াইফাই",
      B4: "3500",
      C4: "3100",
      D4: "=B4-C4",

      A5: "বাচ্চার স্কুলের বেতন",
      B5: "4000",
      C5: "4000",
      D5: "=B5-C5",

      A6: "জরুরি চিকিৎসা ও ঔষধ",
      B6: "3000",
      C6: "1800",
      D6: "=B6-C6",

      A7: "মোট মাসিক খরচ",
      B7: "=SUM(B2:B6)",
      C7: "=SUM(C2:C6)",
      D7: "=SUM(D2:D6)",
    },
  },
  {
    id: "fcommerce_courier",
    name: "F-Commerce Order & Courier Profit Sheet",
    category: "fcommerce",
    description: "কুরিয়ার ডেলিভারি চার্জ, রিটার্ন লস ও প্রতিটি পার্সেলে নেট মার্জিন হিসাব।",
    cols: ["A", "B", "C", "D", "E"],
    rowCount: 10,
    initialData: {
      A1: "অর্ডার আইডি",
      B1: "বিক্রি মূল্য (৳)",
      C1: "পণ্য ক্রয়মূল্য (৳)",
      D1: "কুরিয়ার ফি (৳)",
      E1: "নেট লাভ (৳)",

      A2: "ORD-101 (ঢাকা সিটি)",
      B2: "1450",
      C2: "850",
      D2: "70",
      E2: "=B2-C2-D2",

      A3: "ORD-102 (চট্টগ্রাম)",
      B3: "2200",
      C3: "1300",
      D3: "130",
      E3: "=B3-C3-D3",

      A4: "ORD-103 (রাজশাহী)",
      B4: "950",
      C4: "500",
      D4: "130",
      E4: "=B4-C4-D4",

      A5: "মোট সেলস ও লাভ",
      B5: "=SUM(B2:B4)",
      C5: "=SUM(C2:C4)",
      D5: "=SUM(D2:D4)",
      E5: "=SUM(E2:E4)",
    },
  },
  {
    id: "salary_overtime",
    name: "Employee Salary & Overtime Sheet",
    category: "hr",
    description: "স্টাফদের বেসিক বেতন, ওভারটাইম ঘণ্টা, বোনাস ও ফাইনাল পে-রোল।",
    cols: ["A", "B", "C", "D", "E"],
    rowCount: 8,
    initialData: {
      A1: "কর্মচারীর নাম",
      B1: "মূল বেতন (৳)",
      C1: "ওভারটাইম (৳)",
      D1: "বোনাস (৳)",
      E1: "মোট প্রাপ্য (৳)",

      A2: "মো. কামরুল হাসান",
      B2: "18000",
      C2: "2400",
      D2: "1000",
      E2: "=B2+C2+D2",

      A3: "ফারহানা আক্তার",
      B3: "22000",
      C3: "1200",
      D3: "1500",
      E3: "=B3+C3+D3",

      A4: "আব্দুল কাদের",
      B4: "15000",
      C4: "3000",
      D4: "1000",
      E4: "=B4+C4+D4",

      A5: "মোট পে-রোল",
      B5: "=SUM(B2:B4)",
      C5: "=SUM(C2:C4)",
      D5: "=SUM(D2:D4)",
      E5: "=SUM(E2:E4)",
    },
  },
  {
    id: "saas_mrr_forecast",
    name: "SaaS MRR & Churn Forecast",
    category: "saas",
    description: "Monthly recurring revenue, subscriber cohorts, and expansion forecasting.",
    cols: ["A", "B", "C", "D", "E"],
    rowCount: 8,
    initialData: {
      A1: "Month",
      B1: "New Subscriptions ($)",
      C1: "Expansion MRR ($)",
      D1: "Churn Loss ($)",
      E1: "Net New MRR ($)",

      A2: "January",
      B2: "4500",
      C2: "800",
      D2: "350",
      E2: "=B2+C2-D2",

      A3: "February",
      B3: "5800",
      C3: "1200",
      D3: "420",
      E3: "=B3+C3-D3",

      A4: "March",
      B4: "7200",
      C4: "1600",
      D4: "510",
      E4: "=B4+C4-D4",

      A5: "Q1 Total",
      B5: "=SUM(B2:B4)",
      C5: "=SUM(C2:C4)",
      D5: "=SUM(D2:D4)",
      E5: "=SUM(E2:E4)",
    },
  },
];

/**
 * Export grid data to clean RFC 4180 CSV string.
 */
export function exportGridToCsv(
  grid: GridData,
  cols: string[],
  rowCount: number
): string {
  const computed = computeEntireGrid(grid);
  const rows: string[] = [];

  for (let r = 1; r <= rowCount; r++) {
    const line: string[] = [];
    for (const c of cols) {
      const cellId = `${c}${r}`;
      const val = computed[cellId] ?? "";
      // Escape quotes
      const escaped = String(val).replace(/"/g, '""');
      line.push(`"${escaped}"`);
    }
    rows.push(line.join(","));
  }

  return rows.join("\n");
}
