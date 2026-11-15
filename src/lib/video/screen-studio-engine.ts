/**
 * Screen Recorder & Circular Webcam PiP Studio Engine.
 * Composites screen stream + circular webcam overlay + microphone audio
 * onto a unified 60fps HTML5 Canvas with zero watermarks.
 * 100% Client-Side. Zero cloud relay.
 */

export type PipCorner = "bottom-right" | "bottom-left" | "top-right" | "hidden";

export interface ScreenStudioConfig {
  pipCorner: PipCorner;
  pipDiameterRatio: number; // e.g. 0.22 (22% of screen width)
  showBorder: boolean;
  borderColor: string;
}

export const DEFAULT_STUDIO_CONFIG: ScreenStudioConfig = {
  pipCorner: "bottom-right",
  pipDiameterRatio: 0.22,
  showBorder: true,
  borderColor: "#F59E0B",
};

/**
 * Composite Screen + Circular Webcam PiP onto target canvas.
 */
export function compositeScreenAndWebcam(
  canvas: HTMLCanvasElement,
  screenVideo: HTMLVideoElement | null,
  webcamVideo: HTMLVideoElement | null,
  config: ScreenStudioConfig = DEFAULT_STUDIO_CONFIG
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // 1. Draw Screen Capture or Placeholder
  if (screenVideo && screenVideo.readyState >= 2) {
    ctx.drawImage(screenVideo, 0, 0, W, H);
  } else {
    // Elegant Dark Fallback Grid
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    ctx.fillStyle = "#71717A";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Click 'Select Screen to Record' to Begin", W / 2, H / 2);
  }

  // 2. Draw Circular Webcam PiP (if active and not hidden)
  if (
    config.pipCorner !== "hidden" &&
    webcamVideo &&
    webcamVideo.readyState >= 2
  ) {
    const diameter = Math.round(W * config.pipDiameterRatio);
    const radius = diameter / 2;
    const margin = Math.round(W * 0.03);

    let cx = W - radius - margin;
    let cy = H - radius - margin;

    if (config.pipCorner === "bottom-left") {
      cx = radius + margin;
      cy = H - radius - margin;
    } else if (config.pipCorner === "top-right") {
      cx = W - radius - margin;
      cy = radius + margin;
    }

    ctx.save();

    // Subtle drop shadow behind PiP
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Clip circular path
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();

    // Draw square cropped webcam
    const vw = webcamVideo.videoWidth || 640;
    const vh = webcamVideo.videoHeight || 480;
    const cropSize = Math.min(vw, vh);
    const sx = (vw - cropSize) / 2;
    const sy = (vh - cropSize) / 2;

    ctx.drawImage(
      webcamVideo,
      sx,
      sy,
      cropSize,
      cropSize,
      cx - radius,
      cy - radius,
      diameter,
      diameter
    );
    ctx.restore();

    // Circular Glowing Border
    if (config.showBorder) {
      ctx.strokeStyle = config.borderColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
