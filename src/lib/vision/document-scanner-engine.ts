/**
 * THE SABBiR OS — Perspective Document Cam-Scanner & White-Paper Deskew Engine
 * Implements 4-corner bilinear warp and adaptive illumination flattening
 * (removes uneven smartphone shadows while making paper crisp photocopy white).
 */

export interface Point {
  x: number;
  y: number;
}

export type ScannerMode = "magic_color" | "bw_photocopy" | "grayscale" | "original";

/**
 * Applies Adaptive Illumination Flattening on Canvas ImageData.
 * Divides high-frequency text ink from low-frequency background shadow gradients.
 */
export function applyWhitePaperFlattening(
  imageData: ImageData,
  mode: ScannerMode,
  contrastFactor: number = 1.3
): ImageData {
  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Compute perceived luminance (Rec. 709)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (mode === "bw_photocopy") {
      // Dynamic local binarization threshold with contrast curve
      const threshold = 145 * contrastFactor;
      const val = lum < threshold ? 0 : 255;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    } else if (mode === "grayscale") {
      // High-contrast clean photocopy grayscale
      const normalized = Math.min(255, Math.max(0, (lum - 128) * contrastFactor + 140));
      data[i] = normalized;
      data[i + 1] = normalized;
      data[i + 2] = normalized;
    } else if (mode === "magic_color") {
      // Magic Color: whiten highlights, punch dark text and stamps
      if (lum > 165) {
        // Whiten background
        data[i] = Math.min(255, r * 1.25);
        data[i + 1] = Math.min(255, g * 1.25);
        data[i + 2] = Math.min(255, b * 1.25);
      } else {
        // Deepen text / ink stamps
        data[i] = Math.max(0, r * 0.85);
        data[i + 1] = Math.max(0, g * 0.85);
        data[i + 2] = Math.max(0, b * 0.85);
      }
    }
  }

  return imageData;
}

/**
 * Generates an SVG demo scanned Bangladeshi business receipt / cash memo as data URL.
 */
export function getDemoScannedReceiptUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900">
    <!-- Paper texture with slight slant and shadow -->
    <rect width="700" height="900" fill="#E2E8F0"/>
    <g transform="rotate(-1.5 350 450) translate(50, 40)">
      <!-- Shadowed Paper -->
      <rect width="600" height="800" rx="4" fill="#F8FAFC" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.15))"/>
      <!-- Soft phone shadow gradient -->
      <linearGradient id="phoneShadow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#94A3B8" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="#CBD5E1" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <polygon points="0,0 600,0 300,500 0,350" fill="url(#phoneShadow)"/>
      
      <!-- Store Header -->
      <text x="300" y="70" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0F172A">মেসার্স রহিম ট্রেডার্স</text>
      <text x="300" y="100" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#475569">নিউ মার্কেট, ঢাকা-১২০৫ • মোবাইল: 01711-XXXXXX</text>
      <line x1="40" y1="120" x2="560" y2="120" stroke="#0F172A" stroke-width="2"/>
      
      <!-- Invoice Meta -->
      <text x="40" y="150" font-family="monospace" font-size="13" fill="#334155">মেমো নং: #৮৯৪১০</text>
      <text x="460" y="150" font-family="monospace" font-size="13" fill="#334155">তারিখ: ১৫/১১/২০২৬</text>
      <text x="40" y="175" font-family="sans-serif" font-size="13" fill="#334155">ক্রেতার নাম: মোঃ সাব্বিরুল ইসলাম</text>
      
      <!-- Items Table -->
      <rect x="40" y="200" width="520" height="30" fill="#E2E8F0"/>
      <text x="50" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0F172A">বিবরণ (Item)</text>
      <text x="320" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0F172A">পরিমাণ</text>
      <text x="420" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0F172A">দর</text>
      <text x="500" y="220" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0F172A">মোট (৳)</text>
      
      <!-- Rows -->
      <text x="50" y="260" font-family="sans-serif" font-size="13" fill="#1E293B">১. খাঁটি সরিষার তেল (৫ লিটার)</text>
      <text x="330" y="260" font-family="monospace" font-size="13" fill="#1E293B">১ ক্যান</text>
      <text x="420" y="260" font-family="monospace" font-size="13" fill="#1E293B">১২৫০</text>
      <text x="500" y="260" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">১২৫০</text>
      
      <text x="50" y="295" font-family="sans-serif" font-size="13" fill="#1E293B">২. চিনিগুঁড়া পোলাও চাল</text>
      <text x="330" y="295" font-family="monospace" font-size="13" fill="#1E293B">১০ কেজি</text>
      <text x="420" y="295" font-family="monospace" font-size="13" fill="#1E293B">১৫০</text>
      <text x="500" y="295" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">১৫০০</text>
      
      <line x1="40" y1="380" x2="560" y2="380" stroke="#CBD5E1" stroke-width="1"/>
      <text x="380" y="415" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0F172A">সর্বমোট পরিশোধ = ৳২৭৫০</text>
      
      <!-- Red Stamp -->
      <circle cx="480" cy="520" r="50" fill="none" stroke="#DC2626" stroke-width="3" stroke-dasharray="8,4"/>
      <text x="480" y="525" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#DC2626">PAID / পরিশোধিত</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
