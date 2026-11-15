/**
 * Unicode Text Styler & Social Growth Engine
 * High-performance Unicode glyph mapping, social bullet decorators,
 * YouTube/Reel tag builder, and UTM URL generator.
 */

export type UnicodeStyleKey =
  | "sans-bold"
  | "sans-italic"
  | "sans-bold-italic"
  | "serif-bold"
  | "monospace"
  | "circled"
  | "fullwidth"
  | "strikethrough";

export interface UnicodeStyleOption {
  key: UnicodeStyleKey;
  label: string;
  preview: string;
}

export const UNICODE_STYLES: UnicodeStyleOption[] = [
  { key: "sans-bold", label: "Sans Bold", preview: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱" },
  { key: "sans-italic", label: "Sans Italic", preview: "𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤" },
  { key: "sans-bold-italic", label: "Sans Bold Italic", preview: "𝙎𝙖𝙣𝙨 𝗕𝗼𝗹𝗱 𝘐𝘵𝘢𝘭𝘪𝘤" },
  { key: "serif-bold", label: "Serif Bold", preview: "𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝" },
  { key: "monospace", label: "Monospace Code", preview: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎" },
  { key: "circled", label: "Circled Bubbles", preview: "Ⓒⓘⓡⓒⓛⓔⓓ" },
  { key: "fullwidth", label: "Spaced / Fullwidth", preview: "Ｓｐａｃｅｄ" },
  { key: "strikethrough", label: "Strikethrough", preview: "S̶t̶r̶i̶k̶e̶" },
];

// Helper to convert character offset
function charOffset(code: number, base: number, targetBase: number): string {
  return String.fromCodePoint(targetBase + (code - base));
}

export function transformUnicodeText(text: string, style: UnicodeStyleKey): string {
  if (!text) return "";

  if (style === "strikethrough") {
    return text
      .split("")
      .map((char) => (char === "\n" || char === " " ? char : `${char}\u0336`))
      .join("");
  }

  let result = "";
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;

    switch (style) {
      case "sans-bold":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x1d5d4);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x1d5ee);
        } else if (code >= 0x30 && code <= 0x39) {
          result += charOffset(code, 0x30, 0x1d7ec);
        } else {
          result += char;
        }
        break;

      case "sans-italic":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x1d608);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x1d622);
        } else {
          result += char;
        }
        break;

      case "sans-bold-italic":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x1d63c);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x1d656);
        } else if (code >= 0x30 && code <= 0x39) {
          result += charOffset(code, 0x30, 0x1d7ec);
        } else {
          result += char;
        }
        break;

      case "serif-bold":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x1d400);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x1d41a);
        } else if (code >= 0x30 && code <= 0x39) {
          result += charOffset(code, 0x30, 0x1d7ce);
        } else {
          result += char;
        }
        break;

      case "monospace":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x1d670);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x1d68a);
        } else if (code >= 0x30 && code <= 0x39) {
          result += charOffset(code, 0x30, 0x1d7f6);
        } else {
          result += char;
        }
        break;

      case "circled":
        if (code >= 0x41 && code <= 0x5a) {
          result += charOffset(code, 0x41, 0x24b6);
        } else if (code >= 0x61 && code <= 0x7a) {
          result += charOffset(code, 0x61, 0x24d0);
        } else if (code >= 0x31 && code <= 0x39) {
          result += charOffset(code, 0x31, 0x2460);
        } else if (code === 0x30) {
          result += String.fromCodePoint(0x24ea);
        } else {
          result += char;
        }
        break;

      case "fullwidth":
        if (code >= 0x21 && code <= 0x7e) {
          result += charOffset(code, 0x21, 0xff01);
        } else if (code === 0x20) {
          result += "\u3000"; // Fullwidth space
        } else {
          result += char;
        }
        break;

      default:
        result += char;
    }
  }

  return result;
}

export interface BulletDecorator {
  id: string;
  icon: string;
  name: string;
}

export const BULLET_DECORATORS: BulletDecorator[] = [
  { id: "sparkle", icon: "✦ ", name: "Diamond Sparkle" },
  { id: "fire", icon: "🔥 ", name: "Trending Fire" },
  { id: "check", icon: "✅ ", name: "Green Verified" },
  { id: "arrow", icon: "👉 ", name: "Pointer Finger" },
  { id: "pin", icon: "📌 ", name: "Pushpin" },
  { id: "bolt", icon: "⚡ ", name: "Electric Bolt" },
  { id: "triangle", icon: "► ", name: "Modern Arrow" },
  { id: "target", icon: "🎯 ", name: "Target Bullseye" },
];

export function decorateList(text: string, bullet: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      // Strip any existing bullet or numbers if present
      const cleaned = trimmed.replace(/^([-*•✦🔥✅👉📌⚡►🎯]|\d+\.)\s*/, "");
      return `${bullet}${cleaned}`;
    })
    .join("\n");
}

export interface TagGeneratorResult {
  tagsString: string;
  tagCount: number;
  charCount: number;
  isOverLimit: boolean;
  tagsList: string[];
}

export function generateSeoTags(rawInput: string, maxChars = 500): TagGeneratorResult {
  if (!rawInput.trim()) {
    return { tagsString: "", tagCount: 0, charCount: 0, isOverLimit: false, tagsList: [] };
  }

  // Split by comma, hash, or newlines
  const tokens = rawInput
    .split(/[\n,#]+/)
    .map((t) => t.trim().replace(/^#+/, ""))
    .filter((t) => t.length > 0);

  const unique = Array.from(new Set(tokens));
  const tagsList: string[] = [];
  let currentLength = 0;

  for (const tag of unique) {
    const additional = tagsList.length === 0 ? tag.length : tag.length + 2; // comma + space
    if (currentLength + additional <= maxChars) {
      tagsList.push(tag);
      currentLength += additional;
    } else {
      break;
    }
  }

  const tagsString = tagsList.join(", ");
  return {
    tagsString,
    tagCount: tagsList.length,
    charCount: tagsString.length,
    isOverLimit: tagsString.length > maxChars,
    tagsList,
  };
}

export interface UtmParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export function buildUtmUrl(params: UtmParams): string {
  const { baseUrl, source, medium, campaign, content, term } = params;
  if (!baseUrl.trim()) return "";

  let urlStr = baseUrl.trim();
  if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
    urlStr = "https://" + urlStr;
  }

  try {
    const url = new URL(urlStr);
    if (source.trim()) url.searchParams.set("utm_source", source.trim());
    if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
    if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
    if (content?.trim()) url.searchParams.set("utm_content", content.trim());
    if (term?.trim()) url.searchParams.set("utm_term", term.trim());
    return url.toString();
  } catch {
    return urlStr;
  }
}
