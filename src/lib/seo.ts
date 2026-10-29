import type { Metadata } from "next";

// One place for the canonical origin, share image and per-page metadata shape.
// Next replaces (not merges) a parent's `openGraph`/`twitter` when a page sets its own, and
// inherits the parent's `alternates.canonical` when a page sets none. Building every page's
// metadata here guarantees each route has its own canonical, title, description and image.

export const SITE_URL = "https://sabbir.nav.bd";
export const SITE_NAME = "THE SABBiR";
export const PERSON_NAME = "Md Sabbirul Islam Khan";

export const OG_IMAGE = {
  url: "/the-sabbir-og-1200x630.jpg",
  width: 1200,
  height: 630,
  alt: "Md Sabbirul Islam Khan — THE SABBiR professional portrait",
};

/** Absolute URL for a site path ("/notes" → "https://sabbir.nav.bd/notes"). */
export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  /** Shorter title for share cards when the document title is long. */
  socialTitle?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const shareTitle = socialTitle ?? title;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      locale: "en_US",
      type,
      ...(type === "article" ? { publishedTime, modifiedTime, authors: [PERSON_NAME] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      creator: "@thesabbirbd",
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** schema.org BreadcrumbList. The last crumb is the current page and may omit its URL. */
export function breadcrumbJsonLd(trail: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

/** Serialise JSON-LD for an inline <script>; escapes "<" so content can't close the tag. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** schema.org article-like entity for a content page (notes, journal, lab write-ups, projects). */
export function articleJsonLd({
  type,
  title,
  description,
  path,
  datePublished,
  dateModified,
  keywords,
}: {
  type: "TechArticle" | "BlogPosting" | "CreativeWork";
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
}) {
  const author = { "@type": "Person", name: PERSON_NAME, alternateName: SITE_NAME, url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    name: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl(OG_IMAGE.url),
    author,
    publisher: author,
    inLanguage: "en",
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
  };
}
