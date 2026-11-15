/**
 * 18 Curated Social Story & Reel Cover Templates across 4 formats:
 * - Story: 1080x1920 (9:16)
 * - Portrait: 1080x1350 (4:5)
 * - Square: 1080x1080 (1:1)
 * - Landscape: 1920x1080 (16:9)
 */

export type StoryFormat = "story" | "portrait" | "square" | "landscape";

export interface StoryDimensions {
  width: number;
  height: number;
  aspect: string;
}

export const STORY_FORMATS: Record<StoryFormat, StoryDimensions> = {
  story: { width: 1080, height: 1920, aspect: "9:16" },
  portrait: { width: 1080, height: 1350, aspect: "4:5" },
  square: { width: 1080, height: 1080, aspect: "1:1" },
  landscape: { width: 1920, height: 1080, aspect: "16:9" },
};

export interface StoryTemplate {
  id: string;
  name: string;
  category: "tech" | "business" | "product" | "quote" | "event";
  bgGradient: [string, string, string?];
  accentColor: string;
  defaultBadge: string;
  defaultHeadline: string;
  defaultSubtitle: string;
  layoutStyle: "bold_center" | "split_editorial" | "card_glow" | "minimal_quote";
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: "tech_founder_announcement",
    name: "Tech Founder Announcement",
    category: "tech",
    bgGradient: ["#0B0F19", "#1E1B4B", "#0F172A"],
    accentColor: "#F59E0B",
    defaultBadge: "🚀 NEW RELEASE",
    defaultHeadline: "Scaling Beyond 100K Daily Requests",
    defaultSubtitle: "Architecture choices, Redis caching, and zero-downtime database migrations.",
    layoutStyle: "bold_center",
  },
  {
    id: "product_launch_glow",
    name: "Product Launch Glow",
    category: "product",
    bgGradient: ["#18181B", "#27272A", "#09090B"],
    accentColor: "#10B981",
    defaultBadge: "✨ SAAS LAUNCH",
    defaultHeadline: "Introducing THE SABBiR OS v5.2.12",
    defaultSubtitle: "43 in-browser studios, Raycast Omnibar 2.0, and 20 AI domain agents.",
    layoutStyle: "card_glow",
  },
  {
    id: "fcommerce_festive_deal",
    name: "F-Commerce Festive Deal",
    category: "business",
    bgGradient: ["#831843", "#9D174D", "#500724"],
    accentColor: "#FDE047",
    defaultBadge: "🔥 MEGA DISCOUNT",
    defaultHeadline: "ঈদ ও বৈশাখী বিশেষ অফার ৫০% ছাড়!",
    defaultSubtitle: "সারা দেশে ক্যাশ অন ডেলিভারি এবং ফ্রি ডেলিভারি সুবিধা।",
    layoutStyle: "split_editorial",
  },
  {
    id: "devops_incident_recap",
    name: "DevOps Incident Recap",
    category: "tech",
    bgGradient: ["#030712", "#111827", "#1F2937"],
    accentColor: "#EF4444",
    defaultBadge: "🛡️ POST-MORTEM",
    defaultHeadline: "Mitigating a 20Gbps SYN Flood in 90 Seconds",
    defaultSubtitle: "How token-bucket edge rate-limiting stopped distributed attacks cold.",
    layoutStyle: "bold_center",
  },
  {
    id: "bangla_business_khata",
    name: "Bangla Business Khata",
    category: "business",
    bgGradient: ["#064E3B", "#047857", "#022C22"],
    accentColor: "#FBBF24",
    defaultBadge: "📊 হিসাব ও লাভ",
    defaultHeadline: "দোকানের খাতা ও দৈনিক বাকির সহজ সমাধান",
    defaultSubtitle: "কাগজের খাতা ছেড়ে সরাসরি মোবাইলেই অটোমেটিক হিসাব রাখুন।",
    layoutStyle: "split_editorial",
  },
  {
    id: "minimalist_deep_quote",
    name: "Minimalist Deep Quote",
    category: "quote",
    bgGradient: ["#18181B", "#09090B"],
    accentColor: "#A1A1AA",
    defaultBadge: "💡 PHILOSOPHY",
    defaultHeadline: "“Simplicity is prerequisite for reliability.”",
    defaultSubtitle: "Edsger W. Dijkstra — Clean architecture wins over complex fragility.",
    layoutStyle: "minimal_quote",
  },
  {
    id: "podcast_audio_drop",
    name: "Podcast / Audio Episode",
    category: "event",
    bgGradient: ["#312E81", "#1E1B4B", "#0F172A"],
    accentColor: "#38BDF8",
    defaultBadge: "🎙️ EPISODE #42",
    defaultHeadline: "Inside Bangladeshi ISP Architecture",
    defaultSubtitle: "Mikrotik queues, BGP peering, and fiber FTTH network engineering.",
    layoutStyle: "card_glow",
  },
  {
    id: "cyber_neon_hackathon",
    name: "Cyber Neon Hackathon",
    category: "tech",
    bgGradient: ["#050505", "#1A0033", "#001A33"],
    accentColor: "#06B6D4",
    defaultBadge: "⚡ 24H BUILD",
    defaultHeadline: "Zero-Cost Serverless Mastery",
    defaultSubtitle: "Next.js 15, Drizzle ORM, and WebAudio in modern production.",
    layoutStyle: "bold_center",
  },
];

export interface StoryCustomization {
  format: StoryFormat;
  templateId: string;
  badge: string;
  headline: string;
  subtitle: string;
  brandHandle: string;
  authorName: string;
  accentColor?: string;
  customLogoUrl?: string;
}

/**
 * Render complete vector story onto an HTML5 Canvas at exact pixel dimensions.
 */
export function renderStoryToCanvas(
  canvas: HTMLCanvasElement,
  template: StoryTemplate,
  custom: StoryCustomization
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dims = STORY_FORMATS[custom.format] || STORY_FORMATS.story;
  canvas.width = dims.width;
  canvas.height = dims.height;

  const W = dims.width;
  const H = dims.height;

  // 1. Draw Background Gradient Mesh
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, template.bgGradient[0]);
  grad.addColorStop(0.5, template.bgGradient[1]);
  if (template.bgGradient[2]) {
    grad.addColorStop(1, template.bgGradient[2]);
  } else {
    grad.addColorStop(1, template.bgGradient[0]);
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 2. Draw Decorative Glow Orbs
  const accent = custom.accentColor || template.accentColor;
  ctx.save();
  ctx.filter = "blur(120px)";
  ctx.fillStyle = `${accent}25`; // 15% opacity hex
  ctx.beginPath();
  ctx.arc(W * 0.8, H * 0.2, W * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff08";
  ctx.beginPath();
  ctx.arc(W * 0.2, H * 0.8, W * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Draw Clean Tech Grid Overlay
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Draw Header Badge Pill
  const paddingX = W * 0.08;
  const topY = H * 0.12;

  ctx.save();
  const badgeText = custom.badge || template.defaultBadge;
  ctx.font = `bold ${Math.round(W * 0.026)}px sans-serif`;
  const badgeMetrics = ctx.measureText(badgeText);
  const pillW = badgeMetrics.width + 36;
  const pillH = Math.round(W * 0.05);

  ctx.fillStyle = `${accent}22`;
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(paddingX, topY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, paddingX + 18, topY + pillH / 2);
  ctx.restore();

  // 5. Draw Headline
  ctx.save();
  const headline = custom.headline || template.defaultHeadline;
  const headlineFontSize = Math.round(W * (custom.format === "story" ? 0.075 : 0.065));
  ctx.font = `900 ${headlineFontSize}px sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";

  // Wrap text
  const maxTextW = W - paddingX * 2;
  const words = headline.split(" ");
  let line = "";
  let currentY = topY + pillH + Math.round(H * 0.04);

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const testMetrics = ctx.measureText(testLine);
    if (testMetrics.width > maxTextW && n > 0) {
      ctx.fillText(line, paddingX, currentY);
      line = words[n] + " ";
      currentY += headlineFontSize * 1.25;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, paddingX, currentY);
  currentY += headlineFontSize * 1.4;
  ctx.restore();

  // 6. Draw Subtitle
  ctx.save();
  const subtitle = custom.subtitle || template.defaultSubtitle;
  const subFontSize = Math.round(W * 0.034);
  ctx.font = `400 ${subFontSize}px sans-serif`;
  ctx.fillStyle = "#A1A1AA";
  ctx.textBaseline = "top";

  const subWords = subtitle.split(" ");
  let subLine = "";
  for (let n = 0; n < subWords.length; n++) {
    const testLine = subLine + subWords[n] + " ";
    if (ctx.measureText(testLine).width > maxTextW && n > 0) {
      ctx.fillText(subLine, paddingX, currentY);
      subLine = subWords[n] + " ";
      currentY += subFontSize * 1.5;
    } else {
      subLine = testLine;
    }
  }
  ctx.fillText(subLine, paddingX, currentY);
  ctx.restore();

  // 7. Draw Footer Brand Card (Author Pill)
  const footerH = Math.round(H * 0.08);
  const footerY = H - footerH - Math.round(H * 0.06);

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(paddingX, footerY, W - paddingX * 2, footerH, 20);
  ctx.fill();
  ctx.stroke();

  // Author initials avatar
  const avatarSize = footerH * 0.65;
  const avatarX = paddingX + 16;
  const avatarY = footerY + (footerH - avatarSize) / 2;

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = `bold ${Math.round(avatarSize * 0.45)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", avatarX + avatarSize / 2, avatarY + avatarSize / 2);

  // Author & Brand text
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.round(W * 0.026)}px sans-serif`;
  ctx.fillText(custom.authorName || "Md Sabbirul Islam Khan", avatarX + avatarSize + 14, footerY + footerH * 0.38);

  ctx.fillStyle = "#A1A1AA";
  ctx.font = `400 ${Math.round(W * 0.02)}px sans-serif`;
  ctx.fillText(custom.brandHandle || "sabbir.nav.bd • THE SABBiR OS", avatarX + avatarSize + 14, footerY + footerH * 0.68);
  ctx.restore();
}
