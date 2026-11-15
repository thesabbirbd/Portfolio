/**
 * THE SABBiR OS — Embeddable Micro-SaaS Widget Registry
 * Defines configuration, defaults, iframe snippets, and responsive embed generators
 * for 8 micro-widgets that can be embedded on any external website or blog.
 */

export interface EmbedWidgetDefinition {
  slug: string;
  name: string;
  banglaName: string;
  description: string;
  defaultHeight: number;
  minHeight: number;
  studioHref: string;
  category: "Utilities" | "Finance" | "Education" | "Health";
  supportedThemes: ("dark" | "light" | "auto")[];
  supportedLangs: ("bn" | "en")[];
}

export const EMBED_WIDGETS: Record<string, EmbedWidgetDefinition> = {
  "bijoy-converter": {
    slug: "bijoy-converter",
    name: "Bijoy to Unicode Bangla Font Converter",
    banglaName: "বিজয় ↔ ইউনিকোড বাংলা কনভার্টার",
    description: "Bidirectional SutonnyMJ ANSI and Avro UTF-8 converter with instant copy.",
    defaultHeight: 520,
    minHeight: 400,
    studioHref: "/tools/bangla-converter",
    category: "Utilities",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "land-gold-converter": {
    slug: "land-gold-converter",
    name: "BD Land & BAJUS Gold Converter",
    banglaName: "জমি ও বিএজেউএস স্বর্ণ পরিমাপক",
    description: "Convert Decimal, Katha, Bigha, SqFt and Gold Vori, Ana, Ratti to Grams.",
    defaultHeight: 560,
    minHeight: 440,
    studioHref: "/tools/land-unit-converter",
    category: "Utilities",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "zakat-calculator": {
    slug: "zakat-calculator",
    name: "Family Budget & Authentic Zakat Calculator",
    banglaName: "পারিবারিক বাজেট ও নিসাব যাকাত হিসাব",
    description: "BAJUS Gold/Silver Nisab threshold and 2.5% net zakatable asset evaluation.",
    defaultHeight: 620,
    minHeight: 480,
    studioHref: "/tools/family-budget-zakat",
    category: "Finance",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "cgpa-calculator": {
    slug: "cgpa-calculator",
    name: "SSC/HSC GPA & University CGPA Calculator",
    banglaName: "এসএসসি/এইচএসসি জিপিএ ও সিজিপিএ",
    description: "4th-subject bonus GPA math and UGC 4.00 university semester CGPA target solver.",
    defaultHeight: 580,
    minHeight: 450,
    studioHref: "/tools/cgpa-calculator",
    category: "Education",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "remittance-calculator": {
    slug: "remittance-calculator",
    name: "USD Freelance Remittance & 2.5% Incentive",
    banglaName: "ডলার রেমিট্যান্স ও সরকারি প্রণোদনা",
    description: "Live USD to BDT benchmark rates plus 2.5% Bangladesh Bank cash incentive.",
    defaultHeight: 480,
    minHeight: 380,
    studioHref: "/tools/dollar-rate-matrix",
    category: "Finance",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "electricity-bill": {
    slug: "electricity-bill",
    name: "BD Electricity Bill & IPS Solar Sizer",
    banglaName: "বিদ্যুৎ বিল ও আইপিএস/সোলার সাইজার",
    description: "BERC LT-A domestic step tariffs and appliance wattage battery calculator.",
    defaultHeight: 600,
    minHeight: 480,
    studioHref: "/tools/electricity-solar-calculator",
    category: "Utilities",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "age-calculator": {
    slug: "age-calculator",
    name: "Exact Calendar Age & Govt Job BCS 32y Cutoff",
    banglaName: "সঠিক বয়স ও সরকারি চাকরির ৩২ বছর কাট-অফ",
    description: "Accurate age in Years/Months/Days with BCS 32-year job cutoff validator.",
    defaultHeight: 500,
    minHeight: 400,
    studioHref: "/tools/age-health-card",
    category: "Health",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "sanchaypatra-emi": {
    slug: "sanchaypatra-emi",
    name: "Sanchaypatra Net Profit & Bank Loan EMI",
    banglaName: "সঞ্চয়পত্র মুনাফা ও ব্যাংক লোন ইএমআই",
    description: "National Savings Certificate tiered net profit and monthly reducing EMI.",
    defaultHeight: 580,
    minHeight: 460,
    studioHref: "/tools/tax-sanchaypatra-emi",
    category: "Finance",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
  "id-card-stitcher": {
    slug: "id-card-stitcher",
    name: "NID & Dual-Side ID Card Smart Stitcher + Watermark",
    banglaName: "এনআইডি ও স্মার্ট কার্ড ২-পার্শ্ব A4 প্রিন্ট ও ওয়াটারমার্ক",
    description: "Align Front & Back of NID/Smart Card onto A4 photocopy sheet with safety watermark.",
    defaultHeight: 640,
    minHeight: 500,
    studioHref: "/tools/id-card-stitcher",
    category: "Utilities",
    supportedThemes: ["dark", "light", "auto"],
    supportedLangs: ["bn", "en"],
  },
};

export interface EmbedSnippetOptions {
  slug: string;
  theme?: "dark" | "light" | "auto";
  lang?: "bn" | "en";
  width?: string;
  height?: number;
  origin?: string;
}

export function generateIframeSnippet(options: EmbedSnippetOptions): string {
  const {
    slug,
    theme = "auto",
    lang = "bn",
    width = "100%",
    origin = "https://sabbir.nav.bd",
  } = options;

  const widget = EMBED_WIDGETS[slug];
  const h = options.height || widget?.defaultHeight || 520;
  const title = widget ? `${widget.name} | THE SABBiR` : "THE SABBiR OS Widget";
  const embedUrl = `${origin}/embed/${slug}?theme=${theme}&lang=${lang}`;
  const backlink = `${origin}${widget?.studioHref || `/tools/${slug}`}`;

  return `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${h}"
  style="border: 1px solid rgba(125,125,125,0.2); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); width: 100%; max-width: 100%;"
  title="${title}"
  loading="lazy"
  allow="clipboard-write"
></iframe>
<div style="text-align: right; font-size: 11px; margin-top: 6px; font-family: system-ui, sans-serif;">
  <a href="${backlink}" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: none; font-weight: 500;">
    ⚡ Powered by THE SABBiR OS
  </a>
</div>`;
}
