/**
 * NID & Dual-Side ID Card Smart Stitcher & Safety Watermark Engine
 * Implements CR80 ISO/IEC 7810 standard dimensions and ISO 216 A4 sheet positioning.
 * Client-Side Canvas rendering with zero data leaks.
 */

export interface IdCardStitcherOptions {
  layout: "side-by-side" | "top-to-bottom" | "single-card-stacked";
  pageFormat: "A4" | "card-only";
  enhanceContrast: boolean;
  watermarkText?: string;
  watermarkOpacity?: number; // 0.1 - 0.5
  watermarkColor?: string;
  watermarkDate?: string;
  showCropGuides?: boolean;
}

export const WATERMARK_PRESETS = [
  { id: "bank", label: "ব্যাংক একাউন্ট", text: "শুধুমাত্র ব্যাংক একাউন্ট খোলার জন্য প্রযোজ্য — অন্য কোনো কাজে ব্যবহার নিষিদ্ধ" },
  { id: "sim", label: "সিম রেজিস্ট্রেশন", text: "শুধুমাত্র বায়োমেট্রিক সিম নিবন্ধনের জন্য — অন্য কোনো উদ্দেশ্যে ব্যবহার অচল" },
  { id: "job", label: "চাকরির আবেদন", text: "শুধুমাত্র চাকরির জীবনবৃত্তান্ত ও ভেরিফিকেশনের জন্য সংরক্ষিত" },
  { id: "rent", label: "বাড়ি ভাড়া চুক্তি", text: "শুধুমাত্র বাড়ি ভাড়াটিয়া নিবন্ধন ও পুলিশ ভেরিফিকেশনের জন্য" },
  { id: "visa", label: "ভিসা প্রসেসিং", text: "FOR EMBASSY VISA PROCESSING ONLY — NOT FOR SALE OR MISUSE" },
];

/**
 * Standard CR80 ID Card dimensions:
 * Physical: 85.60 mm × 53.98 mm (Aspect Ratio: ~1.586)
 * Canvas pixels at 150 DPI: 506 × 319 px
 * Canvas pixels at 300 DPI: 1012 × 638 px
 */
export const CR80_DIMENSIONS = {
  widthMm: 85.6,
  heightMm: 53.98,
  aspectRatio: 85.6 / 53.98, // ~1.5858
  width150Dpi: 506,
  height150Dpi: 319,
  width300Dpi: 1012,
  height300Dpi: 638,
};

/**
 * Standard ISO 216 A4 Sheet dimensions:
 * Physical: 210 mm × 297 mm
 * Canvas pixels at 150 DPI: 1240 × 1754 px
 * Canvas pixels at 300 DPI: 2480 × 3508 px
 */
export const A4_DIMENSIONS = {
  widthMm: 210,
  heightMm: 297,
  aspectRatio: 210 / 297,
  width150Dpi: 1240,
  height150Dpi: 1754,
  width300Dpi: 2480,
  height300Dpi: 3508,
};

export interface CardCoordinates {
  front: { x: number; y: number; width: number; height: number };
  back: { x: number; y: number; width: number; height: number };
}

/**
 * Calculate exact coordinates for placing Front and Back ID cards on an A4 sheet.
 */
export function calculateA4CardCoordinates(
  canvasWidth: number,
  canvasHeight: number,
  layout: "side-by-side" | "top-to-bottom"
): CardCoordinates {
  const cardWidth = Math.round(canvasWidth * 0.42); // ~85mm proportion on A4 width
  const cardHeight = Math.round(cardWidth / CR80_DIMENSIONS.aspectRatio);

  if (layout === "side-by-side") {
    const totalCardsWidth = cardWidth * 2 + 60;
    const startX = Math.round((canvasWidth - totalCardsWidth) / 2);
    const startY = Math.round(canvasHeight * 0.28);

    return {
      front: { x: startX, y: startY, width: cardWidth, height: cardHeight },
      back: { x: startX + cardWidth + 60, y: startY, width: cardWidth, height: cardHeight },
    };
  } else {
    // top-to-bottom
    const startX = Math.round((canvasWidth - cardWidth) / 2);
    const startY = Math.round(canvasHeight * 0.22);
    const gap = 80;

    return {
      front: { x: startX, y: startY, width: cardWidth, height: cardHeight },
      back: { x: startX, y: startY + cardHeight + gap, width: cardWidth, height: cardHeight },
    };
  }
}

/**
 * Renders anti-misuse diagonal cross safety watermarks across target rectangles.
 */
export function drawSafetyWatermark(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  text: string,
  opacity: number = 0.28,
  dateStr?: string
) {
  if (!text) return;

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.clip();

  ctx.globalAlpha = Math.min(0.5, Math.max(0.1, opacity));
  ctx.fillStyle = "#DC2626"; // Crimson safety red
  ctx.font = `bold ${Math.round(rect.width * 0.038)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fullText = dateStr ? `${text} · [তারিখ: ${dateStr}]` : text;

  // Draw 3 repeating diagonal watermarks
  const angles = [-25 * (Math.PI / 180)];
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  ctx.translate(centerX, centerY);
  ctx.rotate(angles[0]);

  ctx.fillText(fullText, 0, -rect.height * 0.22);
  ctx.fillText(fullText, 0, 0);
  ctx.fillText(fullText, 0, rect.height * 0.22);

  ctx.restore();
}
