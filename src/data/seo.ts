/**
 * SEO Keyword Mapping and Intent Architecture
 * This file serves as the master planning source for content optimization.
 * DO NOT render this entire file directly in the DOM.
 */

export const keywordArchitecture = {
  primaryBrand: [
    "Md Sabbirul Islam Khan",
    "THE SABBiR",
    "sabbir.nav.bd",
    "THE SABBiR portfolio",
    "Md Sabbirul Islam Khan portfolio"
  ],
  academicLocal: [
    "Rajshahi",
    "Bangladesh",
    "Rajshahi College",
    "Management student Bangladesh",
    "Technical student Rajshahi"
  ],
  professional: [
    "Backend Engineering",
    "DevOps",
    "Linux Systems",
    "NOC Support",
    "IT Support Specialist",
    "Networking",
    "Local AI",
    "Ollama",
    "Creative Technology"
  ],
  pageAssignments: {
    "/": {
      intent: "brand_primary",
      focusKeywords: ["Md Sabbirul Islam Khan", "THE SABBiR", "Backend Engineering", "DevOps", "AI"]
    },
    "/about": {
      intent: "identity_academic",
      focusKeywords: ["Md Sabbirul Islam Khan portfolio", "Rajshahi College", "Management student Bangladesh"]
    },
    "/projects": {
      intent: "engineering_portfolio",
      focusKeywords: ["Backend developer portfolio", "API architecture", "creative technology projects"]
    },
    "/engineering-lab": {
      intent: "technical_experiments",
      focusKeywords: ["Local LLM", "Ollama", "Linux server", "Docker development"]
    },
    "/exploration": {
      intent: "geospatial_multimedia",
      focusKeywords: ["Google Maps Local Guide", "360 photography Bangladesh", "Rajshahi"]
    },
    "/experience": {
      intent: "professional_history",
      focusKeywords: ["IT Support Specialist", "NOC Support", "network troubleshooting"]
    },
    "/contact": {
      intent: "professional_inquiry",
      focusKeywords: ["Contact THE SABBiR", "Md Sabbirul Islam Khan"]
    }
  }
};
