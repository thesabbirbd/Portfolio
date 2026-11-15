/**
 * THE SABBiR OS // Engineering Arcade Scorecard Canvas Generator
 * Renders high-resolution 1200x630 (landscape) & 1080x1350 (portrait) cards
 * on client-side HTML5 Canvas. Zero server round-trips.
 */

export interface ScorecardData {
  gameId: string;
  gameTitle: string;
  playerHandle: string;
  score: number;
  rankTier: string;
  accuracyPct: number;
  timeTakenSeconds: number;
  xpEarned: number;
  percentileText?: string;
  osVersion?: string;
}

export type ScorecardAspectRatio = "landscape" | "portrait";

export interface RenderOptions {
  aspectRatio?: ScorecardAspectRatio;
}

export function formatTimeSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}s`;
}

export function generateChallengeUrl(gameId: string, score: number): string {
  const base = typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : "https://sabbir.nav.bd";
  return `${base}/games?challenge=${encodeURIComponent(gameId)}&target=${score}`;
}

export function generateShareText(data: ScorecardData): string {
  const challengeUrl = generateChallengeUrl(data.gameId, data.score);
  return `⚡ I just scored ${data.score.toLocaleString()} PTS in "${data.gameTitle}" on THE SABBiR OS!\n` +
    `🏅 Rank: ${data.rankTier} | Accuracy: ${data.accuracyPct}% | XP: +${data.xpEarned}\n\n` +
    `Can you beat my score? Challenge link: ${challengeUrl}\n\n` +
    `#THESABBiR #EngineeringArcade #DevOps #SQL #Linux #NOC #CodingChallenge`;
}

/**
 * Draws the scorecard on a Canvas element.
 */
export function renderScorecardToCanvas(
  data: ScorecardData,
  options: RenderOptions = {}
): HTMLCanvasElement {
  const isPortrait = options.aspectRatio === "portrait";
  const width = isPortrait ? 1080 : 1200;
  const height = isPortrait ? 1350 : 630;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background Gradient (Dark Graphite / Deep Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#080c14");
  bgGrad.addColorStop(0.5, "#0d131f");
  bgGrad.addColorStop(1, "#070a10");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial glow at top-right
  const glow = ctx.createRadialGradient(width * 0.85, height * 0.15, 20, width * 0.85, height * 0.15, width * 0.6);
  glow.addColorStop(0, "rgba(255, 106, 0, 0.18)");
  glow.addColorStop(0.5, "rgba(245, 158, 11, 0.05)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Outer Border
  ctx.strokeStyle = "rgba(255, 106, 0, 0.4)";
  ctx.lineWidth = isPortrait ? 8 : 4;
  ctx.strokeRect(isPortrait ? 24 : 16, isPortrait ? 24 : 16, width - (isPortrait ? 48 : 32), height - (isPortrait ? 48 : 32));

  // Inner Subtle Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;
  const gridSize = isPortrait ? 60 : 40;
  for (let x = gridSize; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = gridSize; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Header Bar
  const pad = isPortrait ? 64 : 48;
  let cursorY = pad + (isPortrait ? 30 : 20);

  // Eyebrow Tag
  ctx.font = `bold ${isPortrait ? 22 : 14}px monospace`;
  ctx.fillStyle = "#ff6a00";
  ctx.fillText("⚡ THE SABBiR OS // ENGINEERING ARCADE MISSION REPORT", pad, cursorY);

  cursorY += isPortrait ? 45 : 32;

  // Game Title
  ctx.font = `bold ${isPortrait ? 52 : 36}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(data.gameTitle, pad, cursorY);

  cursorY += isPortrait ? 35 : 24;

  // Player & Version Subtitle
  ctx.font = `${isPortrait ? 24 : 16}px monospace`;
  ctx.fillStyle = "#94a3b8";
  const osVer = data.osVersion || "v5.0.10 Neon Forge";
  ctx.fillText(`OPERATOR: ${data.playerHandle.startsWith("@") ? data.playerHandle : "@" + data.playerHandle}  •  KERNEL: ${osVer}`, pad, cursorY);

  // Divider Line
  cursorY += isPortrait ? 40 : 25;
  ctx.strokeStyle = "rgba(255, 106, 0, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, cursorY);
  ctx.lineTo(width - pad, cursorY);
  ctx.stroke();

  cursorY += isPortrait ? 60 : 40;

  // Main Score Hero Box
  const heroBoxWidth = width - pad * 2;
  const heroBoxHeight = isPortrait ? 220 : 140;

  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(pad, cursorY, heroBoxWidth, heroBoxHeight);
  ctx.strokeStyle = "rgba(255, 106, 0, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, cursorY, heroBoxWidth, heroBoxHeight);

  // Score Label
  ctx.font = `bold ${isPortrait ? 24 : 15}px monospace`;
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("FINAL VERIFIED SCORE", pad + (isPortrait ? 36 : 24), cursorY + (isPortrait ? 45 : 32));

  // Score Number
  ctx.font = `900 ${isPortrait ? 88 : 64}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${data.score.toLocaleString()} PTS`, pad + (isPortrait ? 36 : 24), cursorY + (isPortrait ? 135 : 95));

  // Rank Tier Badge inside Hero Box (Right aligned)
  const rankText = data.rankTier.toUpperCase();
  ctx.font = `bold ${isPortrait ? 26 : 18}px monospace`;
  const rankWidth = ctx.measureText(rankText).width;
  const badgeX = width - pad - (isPortrait ? 36 : 24) - rankWidth - 30;
  const badgeY = cursorY + (isPortrait ? 55 : 40);

  ctx.fillStyle = "rgba(255, 106, 0, 0.15)";
  ctx.fillRect(badgeX, badgeY, rankWidth + 30, isPortrait ? 54 : 40);
  ctx.strokeStyle = "#ff6a00";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(badgeX, badgeY, rankWidth + 30, isPortrait ? 54 : 40);

  ctx.fillStyle = "#ffaa40";
  ctx.fillText(rankText, badgeX + 15, badgeY + (isPortrait ? 35 : 26));

  cursorY += heroBoxHeight + (isPortrait ? 40 : 30);

  // 3-Column Stats Grid
  const colWidth = (heroBoxWidth - (isPortrait ? 30 : 24) * 2) / 3;
  const statBoxHeight = isPortrait ? 160 : 100;
  const stats = [
    { label: "ACCURACY RATE", value: `${data.accuracyPct}%`, color: "#10b981" },
    { label: "TIME / SURVIVAL", value: formatTimeSeconds(data.timeTakenSeconds), color: "#38bdf8" },
    { label: "OS XP EARNED", value: `+${data.xpEarned} XP`, color: "#f59e0b" },
  ];

  stats.forEach((st, idx) => {
    const colX = pad + idx * (colWidth + (isPortrait ? 30 : 24));
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(colX, cursorY, colWidth, statBoxHeight);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(colX, cursorY, colWidth, statBoxHeight);

    ctx.font = `bold ${isPortrait ? 18 : 12}px monospace`;
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(st.label, colX + (isPortrait ? 24 : 16), cursorY + (isPortrait ? 38 : 26));

    ctx.font = `bold ${isPortrait ? 40 : 28}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = st.color;
    ctx.fillText(st.value, colX + (isPortrait ? 24 : 16), cursorY + (isPortrait ? 95 : 68));
  });

  cursorY += statBoxHeight + (isPortrait ? 45 : 30);

  // Percentile & Performance Bar
  const percentile = data.percentileText || "Top 5% Global Engineering Operatives";
  ctx.font = `italic ${isPortrait ? 22 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(`🏆 Performance Metric: ${percentile}`, pad, cursorY);

  cursorY += isPortrait ? 24 : 16;

  // Decorative Progress Line
  const barW = width - pad * 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(pad, cursorY, barW, isPortrait ? 12 : 8);

  const fillRatio = Math.min(1, Math.max(0.1, data.accuracyPct / 100));
  const fillGrad = ctx.createLinearGradient(pad, cursorY, pad + barW * fillRatio, cursorY);
  fillGrad.addColorStop(0, "#ff6a00");
  fillGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = fillGrad;
  ctx.fillRect(pad, cursorY, barW * fillRatio, isPortrait ? 12 : 8);

  // Footer & Watermark
  const footerY = height - (isPortrait ? 60 : 40);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, footerY - (isPortrait ? 30 : 20));
  ctx.lineTo(width - pad, footerY - (isPortrait ? 30 : 20));
  ctx.stroke();

  ctx.font = `${isPortrait ? 22 : 14}px monospace`;
  ctx.fillStyle = "#64748b";
  ctx.fillText("Official Verification URL: sabbir.nav.bd/games", pad, footerY);

  ctx.textAlign = "right";
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("ENGINEERED BY THE SABBiR", width - pad, footerY);
  ctx.textAlign = "left";

  return canvas;
}

/**
 * Exports canvas to PNG Blob.
 */
export async function exportScorecardBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

/**
 * Downloads the scorecard PNG directly to user's device.
 */
export async function downloadScorecardPNG(
  canvas: HTMLCanvasElement,
  filename = "the-sabbir-os-scorecard.png"
): Promise<void> {
  const blob = await exportScorecardBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Copies the scorecard PNG directly to clipboard via ClipboardItem.
 */
export async function copyScorecardToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write) {
    return false;
  }
  try {
    const blob = await exportScorecardBlob(canvas);
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch (err) {
    console.error("Failed to copy scorecard to clipboard:", err);
    return false;
  }
}
