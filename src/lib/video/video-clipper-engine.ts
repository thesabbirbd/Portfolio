/**
 * Client-Side Video Clipper, HD Frame Grabber & Subtitle Burn-In Engine.
 * 100% In-Browser. Zero server uploads.
 */

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
}

export type VideoAspectTarget = "original" | "9:16" | "4:5" | "1:1" | "16:9";

/**
 * Capture exact high-resolution frame from HTMLVideoElement onto a canvas.
 */
export function captureVideoFrame(
  video: HTMLVideoElement,
  options?: {
    captionText?: string;
    aspectTarget?: VideoAspectTarget;
  }
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const vidW = video.videoWidth || 1920;
  const vidH = video.videoHeight || 1080;

  let targetW = vidW;
  let targetH = vidH;

  const target = options?.aspectTarget || "original";
  if (target === "9:16") {
    targetW = 1080;
    targetH = 1920;
  } else if (target === "4:5") {
    targetW = 1080;
    targetH = 1350;
  } else if (target === "1:1") {
    targetW = 1080;
    targetH = 1080;
  } else if (target === "16:9") {
    targetW = 1920;
    targetH = 1080;
  }

  canvas.width = targetW;
  canvas.height = targetH;

  // Background letterbox
  ctx.fillStyle = "#0A0A0C";
  ctx.fillRect(0, 0, targetW, targetH);

  // Calculate contain fit
  const scale = Math.min(targetW / vidW, targetH / vidH);
  const drawW = vidW * scale;
  const drawH = vidH * scale;
  const drawX = (targetW - drawW) / 2;
  const drawY = (targetH - drawH) / 2;

  ctx.drawImage(video, drawX, drawY, drawW, drawH);

  // Burn in subtitle caption if provided
  if (options?.captionText && options.captionText.trim()) {
    const caption = options.captionText.trim();
    ctx.save();
    const fontSize = Math.round(targetW * 0.04);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textMetrics = ctx.measureText(caption);
    const boxW = textMetrics.width + 48;
    const boxH = fontSize * 1.8;
    const boxY = targetH - boxH - targetH * 0.08;

    // Background pill
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect((targetW - boxW) / 2, boxY, boxW, boxH, boxH / 2);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#FDE047"; // Vibrant yellow
    ctx.fillText(caption, targetW / 2, boxY + boxH / 2);
    ctx.restore();
  }

  return canvas;
}

/**
 * Generate a 6-frame visual contact sheet across the video duration.
 */
export async function generateContactSheet(
  video: HTMLVideoElement,
  frameCount: number = 6
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const cols = 3;
  const rows = Math.ceil(frameCount / cols);
  const cellW = 360;
  const cellH = 202;

  canvas.width = cols * cellW;
  canvas.height = rows * cellH;

  ctx.fillStyle = "#09090B";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const duration = video.duration || 10;
  const step = duration / (frameCount + 1);

  const initialTime = video.currentTime;

  for (let i = 0; i < frameCount; i++) {
    const targetTime = step * (i + 1);
    await new Promise<void>((resolve) => {
      video.currentTime = targetTime;
      video.onseeked = () => resolve();
    });

    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = c * cellW;
    const y = r * cellH;

    ctx.drawImage(video, x + 4, y + 4, cellW - 8, cellH - 8);

    // Timestamp badge
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(x + 10, y + cellH - 28, 54, 18);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`${targetTime.toFixed(1)}s`, x + 16, y + cellH - 15);
  }

  video.currentTime = initialTime;
  return canvas.toDataURL("image/png");
}

/**
 * Generate procedural canvas test reel when no video is uploaded.
 */
export function drawTestReelFrame(canvas: HTMLCanvasElement, timeSec: number): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Moving gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  const hue1 = (timeSec * 30) % 360;
  const hue2 = (hue1 + 90) % 360;
  grad.addColorStop(0, `hsl(${hue1}, 65%, 15%)`);
  grad.addColorStop(1, `hsl(${hue2}, 70%, 10%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Rotating target ring
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(timeSec * 1.5);
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, H * 0.28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-H * 0.35, 0);
  ctx.lineTo(H * 0.35, 0);
  ctx.moveTo(0, -H * 0.35);
  ctx.lineTo(0, H * 0.35);
  ctx.stroke();
  ctx.restore();

  // Test text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("THE SABBiR OS • 60 FPS TEST REEL", W / 2, H * 0.2);

  ctx.font = "bold 36px monospace";
  ctx.fillStyle = "#F59E0B";
  ctx.fillText(`TIME: ${timeSec.toFixed(2)}s`, W / 2, H * 0.85);
}
