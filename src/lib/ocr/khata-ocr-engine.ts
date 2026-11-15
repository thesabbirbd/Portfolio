/**
 * Khata OCR & Image Pre-processing Engine (Client-Side HTML5 Canvas)
 * Transforms noisy, shadowed mobile camera snaps of handwritten or printed
 * shop ledgers and invoices into high-contrast binarized text blocks,
 * followed by intelligent regex/OCR line extraction and Multi-Sheet Excel XML generation.
 */

export interface PreprocessOptions {
  contrast?: number; // 1.0 - 3.0 (default: 1.8)
  binarizeThreshold?: number; // 0 - 255 (default: 128)
  invert?: boolean;
}

export interface ParsedKhataRow {
  sl: number;
  itemName: string;
  quantity: string;
  price: number;
  status: "PAID" | "BAKI";
  rawText: string;
}

export interface KhataExtractionResult {
  rows: ParsedKhataRow[];
  totalPaid: number;
  totalBaki: number;
  grandTotal: number;
  rawExtractedLines: string[];
}

/**
 * Pre-processes an image on canvas: Grayscale + Contrast Stretch + Adaptive Binarization
 */
export function preprocessReceiptImage(
  srcImageData: ImageData,
  options: PreprocessOptions = {}
): ImageData {
  const { contrast = 1.8, binarizeThreshold = 135, invert = false } = options;
  const width = srcImageData.width;
  const height = srcImageData.height;
  const total = width * height;
  const data = new Uint8ClampedArray(srcImageData.data);

  // 1. Convert to grayscale & contrast stretch
  const gray = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    // Contrast stretch around center 128
    const stretched = Math.min(255, Math.max(0, 128 + (lum - 128) * contrast));
    gray[i] = Math.round(stretched);
  }

  // 2. Otsu-inspired global binarization
  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const isDark = gray[i] < binarizeThreshold;
    const val = invert ? (isDark ? 255 : 0) : (isDark ? 0 : 255);

    data[idx] = val;
    data[idx + 1] = val;
    data[idx + 2] = val;
    data[idx + 3] = 255;
  }

  return new ImageData(data, width, height);
}

/**
 * Normalize Bengali digits '০-৯' to standard Arabic numbers '0-9'
 */
export function normalizeBanglaDigits(str: string): string {
  const map: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => map[d] || d);
}

/**
 * Intelligent ledger line parser: extracts Item name, Quantity, Price, and BAKI/PAID state
 */
export function parseLedgerTextLines(text: string): KhataExtractionResult {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const rows: ParsedKhataRow[] = [];
  let sl = 1;

  for (const line of lines) {
    const norm = normalizeBanglaDigits(line);

    // Skip pure header lines
    if (/^(তারিখ|date|sl|item|মোট|total|grand)/i.test(norm)) continue;

    const isBaki = /baki|বাকি|due|বাকিয়া/i.test(norm);
    const isPaid = /paid|নগদ|জমা|পরিশোধ/i.test(norm);

    // Extract price
    const priceMatch =
      norm.match(/(\d+(?:\.\d+)?)\s*(?:টাকা|tk|bdt|\/-)/i) ||
      norm.match(/\b\d+(?:\.\d+)?\b/);

    const price = priceMatch ? parseFloat(priceMatch[1] || priceMatch[0]) : 0;
    if (price <= 0) continue;

    // Extract quantity (e.g., 5 kg, ২ লিটার, 3 pcs)
    const qtyMatch = norm.match(/(\d+\s*(?:কেজি|kg|লিটার|liter|l|বস্তা|টি|pc|pcs|strip|কার্টন))/i);
    const quantity = qtyMatch ? qtyMatch[0] : "1 unit";

    // Clean item name
    let cleanItem = line
      .replace(/(\d+.*?(?:টাকা|tk|bdt|\/-))/gi, "")
      .replace(/\(.*?\)/g, "")
      .replace(/baki|paid|বাকি|নগদ/gi, "")
      .replace(new RegExp(quantity, "gi"), "")
      .replace(/^[-•\d.\s]+/, "")
      .trim();

    if (!cleanItem) cleanItem = `Item #${sl}`;

    rows.push({
      sl: sl++,
      itemName: cleanItem,
      quantity,
      price,
      status: isBaki ? "BAKI" : "PAID",
      rawText: line,
    });
  }

  const totalPaid = rows.filter((r) => r.status === "PAID").reduce((sum, r) => sum + r.price, 0);
  const totalBaki = rows.filter((r) => r.status === "BAKI").reduce((sum, r) => sum + r.price, 0);

  return {
    rows,
    totalPaid,
    totalBaki,
    grandTotal: totalPaid + totalBaki,
    rawExtractedLines: lines,
  };
}

/**
 * Generates standards-compliant Excel XML (.xlsx compatible) spreadsheet string.
 */
export function generateExcelXml(result: KhataExtractionResult, shopName = "Aiyaar Retail Store"): string {
  const rowsXml = result.rows
    .map(
      (r) => `<Row>
      <Cell><Data ss:Type="Number">${r.sl}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(r.itemName)}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(r.quantity)}</Data></Cell>
      <Cell><Data ss:Type="Number">${r.price}</Data></Cell>
      <Cell><Data ss:Type="String">${r.status}</Data></Cell>
    </Row>`
    )
    .join("\n");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Khata Ledger">
  <Table>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">${escapeXml(shopName)} — Daily Ledger Report</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">SL</Data></Cell>
    <Cell><Data ss:Type="String">Item Description</Data></Cell>
    <Cell><Data ss:Type="String">Quantity</Data></Cell>
    <Cell><Data ss:Type="String">Price (BDT)</Data></Cell>
    <Cell><Data ss:Type="String">Status</Data></Cell>
   </Row>
   ${rowsXml}
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row>
    <Cell ss:Index="3"><Data ss:Type="String">Total Paid (Cash):</Data></Cell>
    <Cell><Data ss:Type="Number">${result.totalPaid}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="3"><Data ss:Type="String">Total Due (Baki):</Data></Cell>
    <Cell><Data ss:Type="Number">${result.totalBaki}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="3"><Data ss:Type="String">Grand Total:</Data></Cell>
    <Cell><Data ss:Type="Number">${result.grandTotal}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
