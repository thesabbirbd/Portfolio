# THE SABBiR — v4.0.1 · Phase 13 Report: SEO, sitemap & publishing

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS.** The sitemap contains only canonical, indexable routes, and every `lastmod` is a real content date or is absent. Each page has its own canonical URL, share card and image. `pnpm test` passes 156/156, including **23 new publishing tests**.

**Sitemap path:** `src/app/sitemap.ts` → **https://sabbir.nav.bd/sitemap.xml**. `robots.txt` points to it.

## Bugs found and fixed (with evidence from the production build)

| # | Problem | Impact | Fix |
|---|---|---|---|
| 1 | Root layout set `alternates.canonical: "https://sabbir.nav.bd"`. **`/notes` and `/journal` had no canonical of their own and inherited the home URL.** | Search engines were told these two indexes are duplicates of the home page. | The canonical was removed from the layout. Every page now builds its metadata through `pageMetadata()` (`src/lib/seo.ts`). A test fails if any `page.tsx` doesn't. |
| 2 | Pages without their own `openGraph` inherited **the home share card** (title and `og:url`). `/aiyaar` set its own `openGraph` but **lost the share image**, because Next replaces rather than merges. | Sharing `/notes`, `/projects`, a note and so on showed the home title or link, and `/aiyaar` showed no image. | `pageMetadata()` always emits the page's own title, description, `og:url`, site name, 1200×630 image and Twitter card. |
| 3 | `feed.xml` printed **`<pubDate>Invalid Date</pubDate>`** for "Off-Grid Solar & Custom UPS". Its frontmatter date was `"2024 - 2025-01-01"`. | Invalid RSS; feed readers mis-sort or drop the item. | Dates are parsed by a strict helper. The pubDate is omitted when a date is unknown, which is valid in RSS 2.0. Feed: 12 items, 0 invalid. |
| 4 | Four projects used **`"2025-01-01"` / `"2026-01-01"`** placeholder dates, shown as "Jan 1, 2025". | Precision that isn't true (a quiet fabrication). | The frontmatter now holds the year only (`"2025"`, `"2026"`). Custom UPS is `date: "2025"` with `dateStarted: "2024"`, which is what the original range said. Display never adds precision: "2025" stays "2025". |
| 5 | Sitemap: every URL carried a hard-coded `lastmod` of `2026-09-28`. `/notes`, `/journal` and `/resume` were missing. | Fake freshness signal; three real index pages not listed. | The sitemap was rewritten; see the next section. |
| 6 | `/api/search` was a **dynamic function** (ƒ) for data that only changes at build time. | A function runs on every request, which uses up Vercel Free invocations for nothing. | Now `dynamic = 'force-static'`. The build shows `○ /api/search`. |
| 7 | `content.ts` silently set a missing `date` to **"now"** (`new Date().toISOString()`). | Any undated file would appear freshly published on every build. | A missing date stays empty, and the schema test requires one. Unquoted YAML dates (which arrive as Date objects) are still accepted. |
| 8 | `toLocaleDateString()` without a time zone rendered `2026-09-07` as **Sep 6** in time zones west of UTC. | Wrong date for some visitors, and a server/client mismatch. | `formatContentDate()` formats in UTC. |

## Sitemap (production build, 23 URLs)

Rules:
- Only canonical, indexable routes. `/search` is `noindex, follow` and is left out, as are `/api/*` and the 404 page.
- **`lastmod` is real or absent:**
  - content entries use their frontmatter `updated` / `date`;
  - collection pages use their newest entry;
  - pages without a recorded edit date (home, about, aiyaar and so on) have **no** `lastmod`. A build-time date would claim a change that didn't happen. The test checks that every `lastmod` exists as a content date.

| URL | lastmod |
|---|---|
| `/`, `/aiyaar`, `/about`, `/experience`, `/resume`, `/exploration`, `/contact` | — (no recorded date) |
| `/projects` | 2026-09-18 |
| `/engineering-lab` | 2026-08-25 |
| `/notes` | 2026-09-28 |
| `/journal` | 2026-09-15 |
| 2 notes | 2026-09-28, 2026-09-25 |
| 2 journal entries | 2026-09-15, 2026-09-01 |
| 7 projects | 2026-09-18, 2026-09-07, 2026, 2025 ×4 |
| 1 lab write-up | 2026-08-25 |

## Structured data
- **Every `PageHeader` route** (`/about`, `/projects`, `/notes`, `/aiyaar` and others) emits a schema.org **BreadcrumbList** that matches the visible breadcrumb. The last item has no URL, as Google allows.
- **Content pages** emit a BreadcrumbList plus an article entity:
  - `TechArticle` for notes and lab write-ups;
  - `BlogPosting` for journal entries;
  - `CreativeWork` for projects.
  - Each has `headline`, `description`, `url`, `image`, `author`/`publisher` (Person: Md Sabbirul Islam Khan, alternateName THE SABBiR), `datePublished` and `dateModified` (only when valid), and `keywords`.
- The root Person/WebSite JSON-LD and the `/aiyaar` SoftwareApplication JSON-LD are unchanged.
- All JSON-LD is serialised with `<` escaped (`jsonLdString`), so content cannot break out of the script tag.
- Content articles use `og:type=article` with `article:published_time`, `modified_time` and `author`.

## Verified on the production build (`curl` of rendered HTML)

| Route | canonical | og:url | robots | BreadcrumbList |
|---|---|---|---|---|
| `/` | sabbir.nav.bd | same | index | — (no breadcrumb on home) |
| `/notes` | …/notes | same | index | ✓ |
| `/journal` | …/journal | same | index | ✓ |
| `/search` | …/search | same | **noindex, follow** | ✓ |
| `/aiyaar` | …/aiyaar | same | index | ✓ |
| `/notes/openwrt-nas` | …/notes/openwrt-nas | same | index | ✓ (+ TechArticle) |
| `/projects/custom-ups` | …/projects/custom-ups | same | index | ✓ (+ CreativeWork, "Started: 2024") |
| unknown route | — | — | noindex (Next default) | — |

## Content schema validation
`src/lib/seo-publishing.test.ts` (23 tests) runs against the real `content/` tree:
- Every file needs a title and a description of at least 40 characters.
- `date` must be a **quoted** valid date (YYYY, YYYY-MM, YYYY-MM-DD or ISO datetime).
  - Impossible dates such as 2025-02-31 are rejected.
  - `updated`, `dateStarted`, `dateCompleted` and changelog dates must be valid when present.
- `slug` must match the filename.
- `status` and `projectStatus` must be from the allowed sets.
- `tags` must be an array, and `githubUrl`/`demoUrl` must use https.
- The sitemap must use absolute production URLs with no duplicates; every entry must be a real route, and every published item must be listed.
- `pageMetadata` must produce a per-page canonical, share card and image; `noindex` must work; no page may lack it.
- Breadcrumb JSON-LD must be valid and escaped.
- Date display and RSS dates must never show more precision than the source, or "Invalid Date".

## Notes for the owner
- **Project dates now say only the year** where the repo had only a placeholder. If you know the real month or day, put it in the frontmatter (for example `date: "2025-03"`), and it will display at that precision.
- `next.config` and `robots.ts` are unchanged; `robots.txt` still blocks `/api/`.
- After deploying, resubmit `sitemap.xml` in Google Search Console and Bing Webmaster (the site already has a Bing `msvalidate` tag). That is an owner action.

## Gate
**PASS.** The sitemap lists only actual canonical, indexable routes, with no fake dates or claims.
