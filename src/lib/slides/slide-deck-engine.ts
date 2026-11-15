/**
 * Instant Presentation & Pitch Deck Studio Engine.
 * Converts Markdown text & bullet notes into structured slide decks.
 * 100% Client-Side Canvas rendering with Fullscreen Presentation Mode.
 */

export interface SlideItem {
  id: string;
  slideNumber: number;
  type: "title" | "content" | "quote" | "code" | "stats";
  tag?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  codeSnippet?: string;
  stats?: Array<{ label: string; value: string }>;
  author?: string;
}

export type DeckTheme = "royal_orange" | "cyber_dark" | "paper_editorial";
export type DeckAspect = "16:9" | "4:5";

export interface DeckThemeConfig {
  id: DeckTheme;
  name: string;
  bg: string;
  cardBg: string;
  text: string;
  accent: string;
  subtext: string;
  border: string;
}

export const DECK_THEMES: Record<DeckTheme, DeckThemeConfig> = {
  royal_orange: {
    id: "royal_orange",
    name: "Royal Orange (Default)",
    bg: "#0B0F19",
    cardBg: "#111827",
    text: "#FFFFFF",
    accent: "#F59E0B",
    subtext: "#9CA3AF",
    border: "rgba(245, 158, 11, 0.25)",
  },
  cyber_dark: {
    id: "cyber_dark",
    name: "Cyber Neon Slate",
    bg: "#030712",
    cardBg: "#0F172A",
    text: "#F8FAFC",
    accent: "#06B6D4",
    subtext: "#94A3B8",
    border: "rgba(6, 182, 212, 0.25)",
  },
  paper_editorial: {
    id: "paper_editorial",
    name: "Paper Alabaster",
    bg: "#FAF8F5",
    cardBg: "#FFFFFF",
    text: "#18181B",
    accent: "#D97706",
    subtext: "#71717A",
    border: "rgba(0, 0, 0, 0.12)",
  },
};

export const DEFAULT_MARKDOWN_DECK = `# Scaling Next.js Apps with Zero Cost
--tag: Architecture Masterclass
--author: Md Sabbirul Islam Khan • THE SABBiR OS
Building high-throughput production web applications on free serverless and edge infrastructure.

---
# The Architecture Challenge
--tag: System Bottlenecks
* Traditional server deployments incur $40-$200/mo standing cloud costs.
* Cold starts and unoptimized Docker images degrade Core Web Vitals (LCP).
* Unprotected API routes fall victim to automated bot scraping and DDoS bursts.
* Heavy client libraries inflate bundle sizes beyond mobile 4G network limits.

---
# The Dual-Engine Solution
--tag: Technical Core
* Drizzle ORM + Neon PostgreSQL Serverless for zero-cost serverless queries.
* In-memory token-bucket edge WAF shield blocking SQLi and DDoS in <2ms.
* Non-destructive HTML5 Canvas and WebAudio pipelines running 100% in browser.
* Ephemeral 24h content sharing with automated TTL compactor to keep storage minimal.

---
# Key Production Metrics
--tag: Performance Benchmark
--stat: 120+ : Statically Generated Routes
--stat: <1.2s : Largest Contentful Paint (LCP)
--stat: 280+ : Passing Automated Vitest Tests
--stat: 100% : Client-Side Offline Studio Execution

---
# Ready to Build Your SaaS?
--tag: Get Started Today
* Explore all 35 everyday studios at sabbir.nav.bd/tools
* Connect with the community and climb the Global Leaderboard.
* Follow @thesabbirbd for architecture blueprints and engineering vlogs.`;

/**
 * Parse raw markdown text into structured SlideItem array.
 */
export function parseMarkdownToSlides(markdown: string): SlideItem[] {
  const rawSections = markdown.split(/\n---\n/);
  const slides: SlideItem[] = [];

  rawSections.forEach((sec, idx) => {
    const lines = sec.trim().split("\n");
    let title = `Slide ${idx + 1}`;
    let subtitle = "";
    let tag = "";
    let author = "";
    const bullets: string[] = [];
    const stats: Array<{ label: string; value: string }> = [];
    let codeLines: string[] = [];
    let inCodeBlock = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (line.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(rawLine);
        continue;
      }

      if (line.startsWith("# ")) {
        title = line.slice(2).trim();
      } else if (line.startsWith("--tag:")) {
        tag = line.slice(6).trim();
      } else if (line.startsWith("--author:")) {
        author = line.slice(9).trim();
      } else if (line.startsWith("--stat:")) {
        const parts = line.slice(7).split(":");
        if (parts.length >= 2) {
          stats.push({ value: parts[0].trim(), label: parts[1].trim() });
        }
      } else if (line.startsWith("* ") || line.startsWith("- ")) {
        bullets.push(line.slice(2).trim());
      } else if (line.length > 0 && !subtitle && idx === 0) {
        subtitle = line;
      }
    }

    let type: SlideItem["type"] = "content";
    if (idx === 0) type = "title";
    else if (stats.length > 0) type = "stats";
    else if (codeLines.length > 0) type = "code";

    slides.push({
      id: `slide_${idx + 1}`,
      slideNumber: idx + 1,
      type,
      tag,
      title,
      subtitle: subtitle || undefined,
      author: author || undefined,
      bullets: bullets.length > 0 ? bullets : undefined,
      stats: stats.length > 0 ? stats : undefined,
      codeSnippet: codeLines.length > 0 ? codeLines.join("\n") : undefined,
    });
  });

  return slides;
}

/**
 * Render single slide onto HTML5 Canvas.
 */
export function renderSlideToCanvas(
  canvas: HTMLCanvasElement,
  slide: SlideItem,
  themeKey: DeckTheme = "royal_orange",
  aspect: DeckAspect = "16:9"
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = aspect === "16:9" ? 1920 : 1080;
  const H = aspect === "16:9" ? 1080 : 1350;

  canvas.width = W;
  canvas.height = H;

  const theme = DECK_THEMES[themeKey] || DECK_THEMES.royal_orange;

  // 1. Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Ambient Glow Mesh
  ctx.save();
  ctx.filter = "blur(140px)";
  ctx.fillStyle = `${theme.accent}18`;
  ctx.beginPath();
  ctx.arc(W * 0.85, H * 0.15, W * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const padX = W * 0.08;
  const topY = H * 0.12;

  // 3. Tag Badge Pill
  if (slide.tag) {
    ctx.save();
    const tagText = slide.tag.toUpperCase();
    ctx.font = `bold ${Math.round(W * 0.016)}px sans-serif`;
    const tagMetrics = ctx.measureText(tagText);
    const pillW = tagMetrics.width + 32;
    const pillH = Math.round(W * 0.035);

    ctx.fillStyle = `${theme.accent}22`;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(padX, topY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.accent;
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, padX + 16, topY + pillH / 2);
    ctx.restore();
  }

  // 4. Slide Title
  ctx.save();
  const titleY = slide.tag ? topY + Math.round(W * 0.06) : topY;
  const titleFontSize = Math.round(W * (slide.type === "title" ? 0.055 : 0.04));
  ctx.font = `800 ${titleFontSize}px sans-serif`;
  ctx.fillStyle = theme.text;
  ctx.textBaseline = "top";

  // Wrap title text
  const maxW = W - padX * 2;
  const words = slide.title.split(" ");
  let line = "";
  let currentY = titleY;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxW && i > 0) {
      ctx.fillText(line, padX, currentY);
      line = words[i] + " ";
      currentY += titleFontSize * 1.25;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, padX, currentY);
  currentY += titleFontSize * 1.4;
  ctx.restore();

  // 5. Body Content (Bullets, Stats, or Code)
  if (slide.bullets && slide.bullets.length > 0) {
    ctx.save();
    const bulletFontSize = Math.round(W * 0.022);
    ctx.font = `400 ${bulletFontSize}px sans-serif`;
    ctx.textBaseline = "top";

    for (const b of slide.bullets) {
      // Bullet Dot
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(padX + 8, currentY + bulletFontSize * 0.6, 6, 0, Math.PI * 2);
      ctx.fill();

      // Bullet Text
      ctx.fillStyle = theme.subtext;
      ctx.fillText(b, padX + 32, currentY);
      currentY += bulletFontSize * 1.8;
    }
    ctx.restore();
  } else if (slide.stats && slide.stats.length > 0) {
    // 2x2 or 4-column Stat Cards
    const cardW = (W - padX * 2 - 32) / 2;
    const cardH = Math.round(H * 0.22);

    slide.stats.slice(0, 4).forEach((stat, sIdx) => {
      const c = sIdx % 2;
      const r = Math.floor(sIdx / 2);
      const cx = padX + c * (cardW + 32);
      const cy = currentY + r * (cardH + 24);

      ctx.save();
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx, cy, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      // Big Number
      ctx.fillStyle = theme.accent;
      ctx.font = `900 ${Math.round(cardH * 0.38)}px sans-serif`;
      ctx.fillText(stat.value, cx + 24, cy + cardH * 0.45);

      // Label
      ctx.fillStyle = theme.subtext;
      ctx.font = `500 ${Math.round(cardH * 0.18)}px sans-serif`;
      ctx.fillText(stat.label, cx + 24, cy + cardH * 0.78);
      ctx.restore();
    });
  } else if (slide.subtitle) {
    ctx.save();
    const subFontSize = Math.round(W * 0.024);
    ctx.font = `400 ${subFontSize}px sans-serif`;
    ctx.fillStyle = theme.subtext;
    ctx.fillText(slide.subtitle, padX, currentY);
    ctx.restore();
  }

  // 6. Footer (Slide Number & Author)
  const footY = H - H * 0.08;
  ctx.save();
  ctx.fillStyle = theme.subtext;
  ctx.font = `bold ${Math.round(W * 0.014)}px monospace`;
  ctx.fillText(slide.author || "THE SABBiR OS • Pitch Studio", padX, footY);

  ctx.textAlign = "right";
  ctx.fillText(`SLIDE ${slide.slideNumber}`, W - padX, footY);
  ctx.restore();
}
