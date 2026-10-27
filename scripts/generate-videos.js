/**
 * Procedural motion-loop renderer for THE SABBiR portfolio.
 *
 * Every frame is computed in JS as raw RGB and piped into FFmpeg. All motion is a
 * function of phase p = 2π·t/DURATION with integer harmonics, so the last frame flows
 * straight back into the first: the loops are genuinely seamless.
 *
 * Videos are rendered on a near-black base and composited in the page with
 * `mix-blend-mode: screen`, so the dark pixels disappear and only the light remains.
 *
 * Usage: node scripts/generate-videos.js
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "public/assets/videos");
const FPS = 24;
const DURATION = 8; // seconds
const FRAMES = FPS * DURATION;
const TAU = Math.PI * 2;

// Brand palette (THE_SABBiR_PROJECT_CONTEXT.md): #ff6a00, #ffb800, #ff3300
const ORANGE = [255, 106, 0];
const AMBER = [255, 184, 0];
const RED = [255, 51, 0];

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

function encode(name, width, height, renderFrame, crf = 26) {
  return new Promise((resolve, reject) => {
    const mp4 = path.join(OUT_DIR, `${name}.mp4`);
    const ff = spawn(
      "ffmpeg",
      [
        "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${width}x${height}`, "-r", String(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-an", mp4,
      ],
      { stdio: ["pipe", "inherit", "inherit"] }
    );
    ff.on("error", reject);
    ff.on("close", (code) => (code === 0 ? resolve(mp4) : reject(new Error(`ffmpeg exited ${code}`))));

    const buf = Buffer.alloc(width * height * 3);
    let frame = 0;
    const pump = () => {
      while (frame < FRAMES) {
        renderFrame(buf, (frame / FRAMES) * TAU);
        frame++;
        process.stdout.write(`\r  ${name}: frame ${frame}/${FRAMES}`);
        if (!ff.stdin.write(buf)) {
          ff.stdin.once("drain", pump);
          return;
        }
      }
      process.stdout.write("\n");
      ff.stdin.end();
    };
    pump();
  });
}

function toWebm(name, crf = 38) {
  return new Promise((resolve, reject) => {
    const ff = spawn(
      "ffmpeg",
      [
        "-y", "-loglevel", "error", "-i", path.join(OUT_DIR, `${name}.mp4`),
        "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(crf), "-row-mt", "1", "-deadline", "good", "-an",
        path.join(OUT_DIR, `${name}.webm`),
      ],
      { stdio: "inherit" }
    );
    ff.on("error", reject);
    ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

/**
 * Light-mode variant: negate + 180° hue turns the near-black base white while keeping the
 * warm hues, so pages never need a per-frame CSS `invert()/hue-rotate()` filter on video.
 */
function toLight(name, crf = 28, webmCrf = 40) {
  const run = (args) => new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
    ff.on("error", reject);
    ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
  const src = path.join(OUT_DIR, `${name}.mp4`);
  const mp4 = path.join(OUT_DIR, `${name}-light.mp4`);
  return run(["-i", src, "-vf", "negate,hue=h=180", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4])
    .then(() => run(["-i", mp4, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(webmCrf), "-row-mt", "1", "-an", path.join(OUT_DIR, `${name}-light.webm`)]));
}

/* ---------------------------------------------------------------------------
 * 1. Ambient aurora — slow drifting brand-orange light fields for the Hero.
 * Rendered small: it is a soft backdrop, the browser upscales it smoothly.
 * ------------------------------------------------------------------------- */
function ambientFrame(W, H) {
  return (buf, p) => {
    const blobs = [
      { x: 0.28 + 0.14 * Math.sin(p), y: 0.38 + 0.1 * Math.cos(p), r: 0.2, c: ORANGE, a: 0.5 },
      { x: 0.72 + 0.12 * Math.cos(p + 1.3), y: 0.6 + 0.12 * Math.sin(2 * p), r: 0.17, c: AMBER, a: 0.3 },
      { x: 0.55 + 0.2 * Math.sin(2 * p + 2.1), y: 0.22 + 0.08 * Math.cos(p + 0.6), r: 0.14, c: RED, a: 0.32 },
      { x: 0.15 + 0.08 * Math.cos(3 * p), y: 0.82 + 0.06 * Math.sin(p), r: 0.12, c: AMBER, a: 0.18 },
    ];
    const pre = blobs.map((b) => ({ ...b, cx: b.x * W, cy: b.y * H, k: 1 / (2 * (b.r * W) ** 2) }));
    let i = 0;
    for (let y = 0; y < H; y++) {
      // Gentle horizontal light bands that breathe with the loop.
      const band = 0.06 * (1 + Math.sin((y / H) * TAU * 2 + p)) * 0.5;
      for (let x = 0; x < W; x++) {
        let r = 4, g = 5, b = 8;
        for (const o of pre) {
          const dx = x - o.cx, dy = y - o.cy;
          const w = Math.exp(-(dx * dx + dy * dy) * o.k) * o.a;
          r += o.c[0] * w; g += o.c[1] * w; b += o.c[2] * w;
        }
        r += 255 * band * 0.25; g += 120 * band * 0.25;
        buf[i++] = clamp(r); buf[i++] = clamp(g); buf[i++] = clamp(b);
      }
    }
  };
}

/* ---------------------------------------------------------------------------
 * 2. Telemetry — grid, three live waveform traces, a sweep and a bar meter.
 * Abstract by design: it suggests monitoring without claiming real metrics.
 * ------------------------------------------------------------------------- */
function telemetryFrame(W, H) {
  const acc = new Float32Array(W * H * 3);
  const add = (x, y, c, w) => {
    if (x < 0 || x >= W || y < 0 || y >= H || w <= 0) return;
    const j = (y * W + x) * 3;
    acc[j] += c[0] * w; acc[j + 1] += c[1] * w; acc[j + 2] += c[2] * w;
  };
  const traces = [
    { base: 0.3, amp: 0.07, c: AMBER, harm: [[3, 1, 0], [7, 2, 1.1], [13, 3, 2.3]] },
    { base: 0.52, amp: 0.09, c: ORANGE, harm: [[2, 1, 0.4], [5, -1, 2.0], [11, 2, 0.7]] },
    { base: 0.72, amp: 0.05, c: [235, 235, 245], harm: [[4, -1, 1.7], [9, 1, 0.2], [17, -2, 2.9]] },
  ];
  const GRID = Math.round(W / 24);

  return (buf, p) => {
    acc.fill(0);
    // Grid
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const onGrid = x % GRID === 0 || y % GRID === 0;
        if (onGrid) add(x, y, ORANGE, 0.07);
      }
    }
    // Waveforms: anti-aliased core + soft glow, computed per column.
    for (const t of traces) {
      for (let x = 0; x < W; x++) {
        const u = x / W;
        let v = 0;
        for (const [k, s, ph] of t.harm) v += Math.sin(TAU * k * u + s * p + ph) / k;
        const cy = (t.base + t.amp * v * 1.6) * H;
        const y0 = Math.floor(cy);
        for (let dy = -14; dy <= 14; dy++) {
          const y = y0 + dy;
          const d = Math.abs(y - cy);
          const core = Math.max(0, 1 - d / 1.4);
          const glow = Math.exp(-(d * d) / 38) * 0.28;
          add(x, y, t.c, core + glow);
        }
      }
    }
    // Sweep line travelling left → right once per loop (wraps cleanly off-screen).
    const sx = ((p / TAU) * (W + 120)) - 60;
    for (let x = Math.max(0, Math.floor(sx - 60)); x < Math.min(W, sx + 4); x++) {
      const d = sx - x;
      const w = d < 0 ? 0 : Math.exp(-d / 18) * 0.22;
      for (let y = 0; y < H; y++) add(x, y, AMBER, w);
    }
    // Bar meter along the bottom edge.
    const bars = 32, bw = W / bars, maxH = H * 0.12;
    for (let n = 0; n < bars; n++) {
      const h = maxH * (0.35 + 0.3 * Math.sin(p * 2 + n * 0.7) + 0.2 * Math.sin(p * 3 + n * 1.9) + 0.15);
      const x0 = Math.round(n * bw + 2), x1 = Math.round((n + 1) * bw - 2);
      for (let x = x0; x < x1; x++) {
        for (let y = Math.round(H - 10 - h); y < H - 10; y++) add(x, y, ORANGE, 0.3 + 0.25 * ((H - 10 - y) / h));
      }
    }
    // Resolve onto the dark base.
    let i = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const j = (y * W + x) * 3;
        buf[i++] = clamp((3 + acc[j]) );
        buf[i++] = clamp((4 + acc[j + 1]) );
        buf[i++] = clamp((8 + acc[j + 2]) );
      }
    }
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("🎥 Rendering seamless motion loops...");

  await encode("ambient-cyber-loop", 640, 360, ambientFrame(640, 360));
  await toWebm("ambient-cyber-loop");
  await toLight("ambient-cyber-loop");

  await encode("omnidesk-telemetry-loop", 960, 540, telemetryFrame(960, 540), 30);
  await toWebm("omnidesk-telemetry-loop", 46);
  await toLight("omnidesk-telemetry-loop", 30, 48);

  for (const f of fs.readdirSync(OUT_DIR)) {
    console.log(`  ${f}  ${(fs.statSync(path.join(OUT_DIR, f)).size / 1024).toFixed(0)} KB`);
  }
  console.log("✅ Done. Videos saved to public/assets/videos/");
}

main().catch((err) => {
  console.error("❌ Video generation failed:", err);
  process.exit(1);
});
