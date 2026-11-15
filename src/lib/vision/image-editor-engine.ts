/**
 * Non-destructive HTML5 Canvas Pixel Pipeline for Pro Multi-Layer Image Editor Studio.
 * Zero external dependencies. 100% client-side in-browser canvas execution.
 */

export type CropRatio = "free" | "1:1" | "4:5" | "16:9" | "9:16";

export type LutFilter =
  | "none"
  | "cinematic_teal"
  | "studio_crisp"
  | "vintage_film"
  | "noir_bw"
  | "dhaka_golden_hour"
  | "cyber_neon"
  | "warm_faded"
  | "cool_nordic"
  | "vibrant_pop"
  | "moody_forest"
  | "retro_chrome";

export interface ImageAdjustments {
  brightness: number; // -100 to +100 (0 = normal)
  contrast: number;   // -100 to +100 (0 = normal)
  saturation: number; // -100 to +100 (0 = normal)
  warmth: number;     // -100 to +100 (0 = normal)
  vibrance: number;   // -100 to +100 (0 = normal)
  blur: number;       // 0 to 20 (0 = none)
  vignette: number;   // 0 to 100 (0 = none)
}

export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  isBold?: boolean;
}

export interface BrushStroke {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  size: number;
  isEraser?: boolean;
}

export interface ImageEditorState {
  adjustments: ImageAdjustments;
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  filter: LutFilter;
  cropRatio: CropRatio;
  cropBox?: { x: number; y: number; width: number; height: number };
  textLayers: TextLayer[];
  brushStrokes: BrushStroke[];
}

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  vibrance: 0,
  blur: 0,
  vignette: 0,
};

export const LUT_PRESETS: Array<{ id: LutFilter; name: string; desc: string }> = [
  { id: "none", name: "Original", desc: "No color filter" },
  { id: "cinematic_teal", name: "Teal & Orange", desc: "Hollywood blockbuster skin & shadows" },
  { id: "studio_crisp", name: "Studio Crisp", desc: "High dynamic range & punchy contrast" },
  { id: "vintage_film", name: "Vintage 1990", desc: "Warm analog paper tones" },
  { id: "noir_bw", name: "Noir Monochrome", desc: "High-contrast dramatic black & white" },
  { id: "dhaka_golden_hour", name: "Dhaka Golden Hour", desc: "Radiant golden sunset warmth" },
  { id: "cyber_neon", name: "Cyberpunk Neon", desc: "Cyan & magenta glow with deep blues" },
  { id: "warm_faded", name: "Warm Faded", desc: "Editorial matte finish" },
  { id: "cool_nordic", name: "Cool Nordic", desc: "Clean frosty aesthetic" },
  { id: "vibrant_pop", name: "Vibrant Pop", desc: "Saturated social-first punch" },
  { id: "moody_forest", name: "Moody Forest", desc: "Earthy shadows and rich botanical greens" },
  { id: "retro_chrome", name: "Retro Chrome", desc: "80s commercial magazine sheen" },
];

/**
 * Apply LUT color grading transformations directly to ImageData RGBA buffer.
 */
export function applyLutFilter(data: Uint8ClampedArray, filter: LutFilter): void {
  if (filter === "none") return;

  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (filter) {
      case "cinematic_teal":
        // Boost orange in highlights, teal (cyan-blue) in shadows
        if (r > 128) {
          r = Math.min(255, r * 1.15);
          g = Math.min(255, g * 1.05);
        } else {
          b = Math.min(255, b * 1.2);
          g = Math.min(255, g * 1.1);
        }
        break;

      case "studio_crisp":
        // S-curve contrast boost + slight cool tint
        r = r < 128 ? (r * r) / 128 : 255 - ((255 - r) * (255 - r)) / 128;
        g = g < 128 ? (g * g) / 128 : 255 - ((255 - g) * (255 - g)) / 128;
        b = b < 128 ? (b * b) / 128 : 255 - ((255 - b) * (255 - b)) / 128;
        b = Math.min(255, b * 1.05);
        break;

      case "noir_bw": {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        // high-contrast threshold
        const c = gray < 128 ? (gray * gray) / 128 : 255 - ((255 - gray) * (255 - gray)) / 128;
        r = g = b = c;
        break;
      }

      case "vintage_film":
        // Raised blacks, warm yellowish tint, soft greens
        r = Math.min(255, r * 1.1 + 15);
        g = Math.min(255, g * 1.05 + 10);
        b = Math.max(20, b * 0.9);
        break;

      case "dhaka_golden_hour":
        // Rich amber/gold
        r = Math.min(255, r * 1.25);
        g = Math.min(255, g * 1.12);
        b = b * 0.82;
        break;

      case "cyber_neon":
        // Magenta + Cyan
        if (g > b) {
          b = Math.min(255, b * 1.3);
          g = Math.min(255, g * 1.15);
        } else {
          r = Math.min(255, r * 1.3);
          b = Math.min(255, b * 1.2);
        }
        break;

      case "vibrant_pop": {
        // Boost distance from gray
        const avg = (r + g + b) / 3;
        r = Math.min(255, Math.max(0, avg + (r - avg) * 1.4));
        g = Math.min(255, Math.max(0, avg + (g - avg) * 1.4));
        b = Math.min(255, Math.max(0, avg + (b - avg) * 1.4));
        break;
      }

      default:
        break;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

/**
 * Apply Brightness, Contrast, Saturation, Warmth adjustments.
 */
export function applyAdjustments(data: Uint8ClampedArray, adj: ImageAdjustments): void {
  const bMult = 1 + adj.brightness / 100;
  const cFactor = (259 * (adj.contrast + 255)) / (255 * (259 - adj.contrast));
  const sMult = 1 + adj.saturation / 100;
  const warmth = adj.warmth;

  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    r *= bMult;
    g *= bMult;
    b *= bMult;

    // Contrast
    r = cFactor * (r - 128) + 128;
    g = cFactor * (g - 128) + 128;
    b = cFactor * (b - 128) + 128;

    // Saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * sMult;
    g = gray + (g - gray) * sMult;
    b = gray + (b - gray) * sMult;

    // Warmth
    if (warmth !== 0) {
      r += warmth * 0.4;
      b -= warmth * 0.4;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
}

/**
 * Render non-destructive image pipeline to target canvas.
 */
export function renderEditorPipeline(
  targetCanvas: HTMLCanvasElement,
  sourceImg: HTMLImageElement | HTMLCanvasElement,
  state: ImageEditorState
): void {
  const ctx = targetCanvas.getContext("2d");
  if (!ctx) return;

  const srcW = sourceImg.width;
  const srcH = sourceImg.height;

  // 1. Calculate Crop Bounds
  let cropX = 0;
  let cropY = 0;
  let cropW = srcW;
  let cropH = srcH;

  if (state.cropRatio !== "free") {
    let targetRatio = 1;
    if (state.cropRatio === "1:1") targetRatio = 1;
    else if (state.cropRatio === "4:5") targetRatio = 4 / 5;
    else if (state.cropRatio === "16:9") targetRatio = 16 / 9;
    else if (state.cropRatio === "9:16") targetRatio = 9 / 16;

    const currentRatio = srcW / srcH;
    if (currentRatio > targetRatio) {
      // Crop width
      cropW = Math.round(srcH * targetRatio);
      cropX = Math.round((srcW - cropW) / 2);
    } else {
      // Crop height
      cropH = Math.round(srcW / targetRatio);
      cropY = Math.round((srcH - cropH) / 2);
    }
  }

  // 2. Set Canvas Dimensions based on rotation
  const isRotated90 = state.rotation === 90 || state.rotation === 270;
  targetCanvas.width = isRotated90 ? cropH : cropW;
  targetCanvas.height = isRotated90 ? cropW : cropH;

  ctx.save();

  // 3. Apply Rotation & Flips
  ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);

  // Draw source image crop into center
  ctx.drawImage(
    sourceImg,
    cropX,
    cropY,
    cropW,
    cropH,
    -cropW / 2,
    -cropH / 2,
    cropW,
    cropH
  );

  ctx.restore();

  // 4. Pixel Buffer Adjustments (Brightness, Contrast, Saturation, LUT)
  const imgData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  applyAdjustments(imgData.data, state.adjustments);
  applyLutFilter(imgData.data, state.filter);
  ctx.putImageData(imgData, 0, 0);

  // 5. Apply Vignette if enabled
  if (state.adjustments.vignette > 0) {
    const vStrength = state.adjustments.vignette / 100;
    const cx = targetCanvas.width / 2;
    const cy = targetCanvas.height / 2;
    const radius = Math.max(cx, cy);

    const grad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${vStrength * 0.75})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  }

  // 6. Draw Freehand Retouch Brush Strokes
  if (state.brushStrokes.length > 0) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of state.brushStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
  }

  // 7. Render Typography Layers
  for (const layer of state.textLayers) {
    ctx.save();
    ctx.font = `${layer.isBold ? "bold " : ""}${layer.fontSize}px ${layer.fontFamily || "sans-serif"}`;
    ctx.fillStyle = layer.color || "#ffffff";
    ctx.textBaseline = "middle";

    // Text shadow for contrast
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(layer.text, layer.x, layer.y);
    ctx.restore();
  }
}
