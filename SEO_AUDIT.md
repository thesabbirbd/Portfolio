# THE SABBiR — SEO & SEARCH DISCOVERY AUDIT

**Entity Moniker:** Md Sabbirul Islam Khan / THE SABBiR
**Primary URL:** https://sabbir.nav.bd/
**Date:** September 28, 2026

## 1. Technical SEO & Indexability
- [x] **HTTPS & Canonical**: Enforced HTTPS. Canonical set globally in Next.js metadata.
- [x] **Robots.txt**: Implemented (`/robots.txt`).
- [x] **Sitemap.xml**: Updated to include dedicated routes for `/about`, `/projects`, `/engineering-lab`, `/exploration`, `/experience`, and `/contact`.
- [x] **Next.js Metadata**: `metadataBase`, `authors`, `creator`, and `openGraph` properly configured in root `layout.tsx`.

## 2. Structured Data (JSON-LD)
- [x] **WebSite Schema**: Implemented in root `layout.tsx` (Name: THE SABBiR, Alternate: Md Sabbirul Islam Khan).
- [x] **Person Schema**: Implemented in root `layout.tsx` (Links to GitHub, LinkedIn, specifies Rajshahi, Bangladesh).

## 3. Brand & Image SEO
- [x] **Favicon & Apple Icon**: `favicon.ico` and `apple-icon.png` generated and placed in root `src/app`.
- [x] **Open Graph Image**: `the-sabbir-og-1200x630.jpg` supplied and mapped in layout metadata.
- [x] **Alt Text**: Contextual alt text used throughout the application (e.g. Hero portrait, UI components).

## 4. Page Architecture & Mapping
- **`/` (Home)**: Brand, Backend, DevOps, AI overview.
- **`/about`**: Personal identity, Rajshahi College, Management.
- **`/projects`**: Omnidesk BD, Systems Integration, Software architecture.
- **`/engineering-lab`**: Local AI, Linux, DevOps prototyping.
- **`/exploration`**: Google Maps, 360 photography, VR mapping.
- **`/experience`**: IT Ops, NOC support, Skill ecosystem.
- **`/contact`**: Professional transmission, inquiries.

## 5. AI Search Readiness
- Built on semantic HTML. No "AI SEO Hacks" or `llms.txt` injections.
- Emphasizes first-hand technical experience over keyword stuffing.

## 6. Remaining Manual Tasks
1. **Google Search Console**: Verify indexability and request indexing for the homepage and new nested routes (`/about`, `/projects`, etc.).
2. **Bing Webmaster**: Import GSC profile and submit sitemap.
3. **Social Profiles**: Update LinkedIn, GitHub, Facebook, X, Maps to definitively point back to `https://sabbir.nav.bd/`.
