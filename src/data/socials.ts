export interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle: string;
  icon: "github" | "linkedin" | "facebook" | "gmail" | "instagram" | "x" | "maps";
  category: "primary" | "social" | "community";
  highlight?: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://linkedin.com/in/thesabbirbd",
    handle: "in/thesabbirbd",
    icon: "linkedin",
    category: "primary",
    highlight: true,
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/thesabbirbd",
    handle: "github/thesabbirbd",
    icon: "github",
    category: "primary",
    highlight: true,
  },
  {
    id: "gmail",
    name: "Personal Email",
    url: "mailto:iamthesabbir@gmail.com",
    handle: "iamthesabbir@gmail.com",
    icon: "gmail",
    category: "primary",
    highlight: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://facebook.com/iamthesabbir",
    handle: "fb/iamthesabbir",
    icon: "facebook",
    category: "social",
  },
  {
    id: "google-maps",
    name: "Google Local Guide",
    url: "https://www.google.com/maps/contrib/115922089427483699024?utm_source=mstt_0",
    handle: "Local Guide Contributor",
    icon: "maps",
    category: "community",
    highlight: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/iam_thesabbir",
    handle: "@iam_thesabbir",
    icon: "instagram",
    category: "social",
  },
  {
    id: "x",
    name: "X (Twitter)",
    url: "https://x.com/thesabbirbd",
    handle: "@thesabbirbd",
    icon: "x",
    category: "social",
  },
];
