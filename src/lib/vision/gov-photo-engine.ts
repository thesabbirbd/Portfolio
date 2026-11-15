/**
 * THE SABBiR OS — Government Job & Passport Photo Sizer Engine
 * Supports BCS Teletalk 300x300 (<100KB), Signature 300x80 (<60KB), BD E-Passport, US & Schengen Visa.
 * Includes binary-search JPEG quality optimizer and 4R 8-photo printable sheet layout.
 */

export interface PhotoPreset {
  id: string;
  name: string;
  category: "Bangladesh Gov" | "International Visa" | "Passport & NID";
  width: number;
  height: number;
  maxSizeBytes: number; // e.g. 100 * 1024
  aspectRatio: number;
  description: string;
  recommendedBg: string;
}

export const GOV_PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: "bcs-photo",
    name: "BCS / Teletalk Job Photo",
    category: "Bangladesh Gov",
    width: 300,
    height: 300,
    maxSizeBytes: 100 * 1024, // 100 KB
    aspectRatio: 1,
    description: "Official 300×300 px photo for 46th/47th BCS, Primary Teacher, Bank & Gov jobs. Max 100 KB.",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "bcs-signature",
    name: "BCS / Teletalk Signature",
    category: "Bangladesh Gov",
    width: 300,
    height: 80,
    maxSizeBytes: 60 * 1024, // 60 KB
    aspectRatio: 300 / 80,
    description: "Official 300×80 px clean white background applicant signature. Max 60 KB.",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "bd-passport",
    name: "BD E-Passport & NID",
    category: "Passport & NID",
    width: 450,
    height: 540,
    maxSizeBytes: 300 * 1024,
    aspectRatio: 450 / 540, // 35mm x 45mm
    description: "Bangladesh E-Passport, MRP Renewal and Smart NID Card standard (35×45 mm).",
    recommendedBg: "#E0F2FE", // Ice blue
  },
  {
    id: "us-visa",
    name: "US Visa & Diversity Lottery",
    category: "International Visa",
    width: 600,
    height: 600,
    maxSizeBytes: 240 * 1024,
    aspectRatio: 1, // 2x2 inch (51x51mm)
    description: "United States DS-160 Visa, Green Card & DV Lottery 2×2 inch format. Off-white background.",
    recommendedBg: "#FFFFFF",
  },
  {
    id: "schengen-visa",
    name: "Schengen & UK Visa",
    category: "International Visa",
    width: 413,
    height: 531,
    maxSizeBytes: 250 * 1024,
    aspectRatio: 413 / 531, // 35mm x 45mm at 300 DPI
    description: "European Schengen Area, UK Visa and Canadian Embassy biometric specifications.",
    recommendedBg: "#F1F5F9", // Light gray
  },
];

/**
 * Binary search to compress a canvas to a JPEG blob strictly under maxSizeBytes.
 */
export async function compressCanvasToTargetSize(
  canvas: HTMLCanvasElement,
  maxSizeBytes: number
): Promise<{ blob: Blob; quality: number; sizeBytes: number }> {
  let low = 0.3;
  let high = 0.98;
  let bestBlob: Blob = new Blob();
  let bestQuality = high;

  for (let i = 0; i < 7; i++) {
    const mid = (low + high) / 2;
    const blob: Blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", mid)
    );

    if (blob.size <= maxSizeBytes) {
      bestBlob = blob;
      bestQuality = mid;
      low = mid; // Try higher quality
    } else {
      high = mid; // Try lower quality
    }
  }

  // Fallback if initial quality exceeded
  if (!bestBlob || bestBlob.size === 0) {
    bestBlob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b || new Blob()), "image/jpeg", 0.3)
    );
    bestQuality = 0.3;
  }

  return {
    blob: bestBlob,
    quality: bestQuality,
    sizeBytes: bestBlob.size,
  };
}

/**
 * Creates a printable 4R sheet (1800x1200 px) containing 8 passport photos with subtle border guidelines.
 */
export function generate4RPrintableSheet(singlePhotoCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const sheet = document.createElement("canvas");
  sheet.width = 1800;
  sheet.height = 1200;
  const ctx = sheet.getContext("2d");
  if (!ctx) return sheet;

  // White photographic paper background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  // 4 rows x 2 cols or 2 rows x 4 cols
  const cols = 4;
  const rows = 2;
  const photoW = 380;
  const photoH = (photoW * singlePhotoCanvas.height) / singlePhotoCanvas.width;
  const gapX = (sheet.width - cols * photoW) / (cols + 1);
  const gapY = (sheet.height - rows * photoH) / (rows + 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gapX + c * (photoW + gapX);
      const y = gapY + r * (photoH + gapY);

      ctx.drawImage(singlePhotoCanvas, x, y, photoW, photoH);

      // Thin cut guideline
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoW, photoH);
    }
  }

  // Header imprint
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 14px monospace";
  ctx.fillText("THE SABBiR OS — 4R Photo Lab Print Sheet (1800x1200 px)", gapX, 30);

  return sheet;
}

/**
 * Generates an SVG demo passport face graphic as data URL for 1-click test.
 */
export function getDemoPassportPhotoUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#E2E8F0"/>
    <!-- Suit -->
    <path d="M120 600 L180 430 L300 480 L420 430 L480 600 Z" fill="#1E293B"/>
    <!-- Shirt -->
    <polygon points="250,440 300,530 350,440 300,450" fill="#FFFFFF"/>
    <!-- Tie -->
    <polygon points="290,460 310,460 315,580 300,600 285,580" fill="#991B1B"/>
    <!-- Neck -->
    <rect x="260" y="340" width="80" height="110" rx="20" fill="#FBCFE8"/>
    <!-- Head Oval -->
    <ellipse cx="300" cy="270" rx="100" ry="130" fill="#FBCFE8"/>
    <!-- Hair -->
    <path d="M190 240 Q300 120 410 240 Q380 160 300 160 Q220 160 190 240 Z" fill="#0F172A"/>
    <!-- Eyes -->
    <circle cx="260" cy="260" r="10" fill="#0F172A"/>
    <circle cx="340" cy="260" r="10" fill="#0F172A"/>
    <!-- Smile -->
    <path d="M260 330 Q300 360 340 330" stroke="#94A3B8" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
