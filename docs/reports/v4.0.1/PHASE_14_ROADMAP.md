# THE SABBiR — v4.0.1 · Phase 14: Future feature roadmap (proposal only)

**Date:** 2026-10-29 · Nothing in this document has been built. It ranks candidate features so the owner can choose.

## How these are scored
- **Value:** does it show real, verifiable skill, or give visitors something useful?
- **Effort:** S is about 1 day, M is 2–5 days, L is more than a week.
- **Maintenance:** what it costs to keep it alive.
- **SEO:** chance of earning search traffic the site doesn't already get.
- **Vercel Free (Hobby):** the site is static-first today. Every feature below is designed to stay static or client-only. No database, no cron, no paid API. Hobby limits to verify on the dashboard:
  - bandwidth;
  - function invocations;
  - image-optimisation source images;
  - Hobby's non-commercial terms. The site mentions a commercial product (Aiyaar), so the owner should confirm this is fine.

## Ranked roadmap

| Rank | Feature | Value | Effort | Maintenance | SEO | Vercel Free impact |
|---|---|---|---|---|---|---|
| **1** | **Steady writing cadence + per-post share images**: one note or journal entry every 2–3 weeks from real lab work; static OG images generated at build with `next/og` | High: proof of ongoing work | S (images) + ongoing writing | Low (the writing is the work) | **High:** long-tail technical queries | None: build-time images, static pages |
| **2** | **Small browser tools from his own stack**: a CIDR/subnet calculator (NOC background), a cron-expression explainer, a Docker-compose → diagram viewer | High: interactive proof of networking and DevOps knowledge | M per tool | Low: pure client-side, no data | **High:** "subnet calculator", "cron explainer" searches | None: client-only, static route |
| **3** | **`/now` + changelog page**: dated, real updates (what he is learning or building this month), with the version shown in the footer | Medium: makes the site feel alive honestly | S | Low: one MDX file | Low–medium | None |
| **4** | **Bangla (`bn`) versions of key pages**: home, about, Aiyaar, and a few notes | High for the Bangladesh audience and Aiyaar's market | L: translation plus `hreflang` and routing | Medium: two languages to keep in sync | **High** in Bangla search, little competition | None (static), but the build and page count double |
| **5** | **Deeper Aiyaar case study**: a decision log and the product problems he owned as CPM, **only with facts the owner provides** | High for recruiters and clients | M | Low | Medium (brand plus product queries) | None |
| **6** | **Terminal mini-game / Linux quiz**: extend the existing terminal into a short "fix the server" CTF with real commands | Medium: memorable and on-brand | M | Low | Low | None: client-only |
| **7** | **Full-content RSS + JSON Feed** | Low–medium: readers and aggregators | S | None | Low | None (static) |
| **8** | **Video logs (vlogs)**: lab sessions embedded behind a click-to-load YouTube facade | Medium, if he will record regularly | S to embed; L to produce | High: video production | Medium (YouTube carries it) | None: hosted on YouTube, the facade keeps pages light |
| **9** | **Site search upgrade**: fuzzy search plus filters over the now-static `/api/search` index | Low–medium: there are only about 12 items today | S | Low | None | None (static JSON) |
| ✗ | **News aggregation / auto-posted news** | Low: not his work | M | High: feeds break | Negative: thin or duplicate content | Needs cron/functions; copyright risk |
| ✗ | **AI chatbot "ask THE SABBiR"** | Novelty | M | Medium | None | **Paid API keys plus function calls.** It could also invent claims about him, which the brief forbids. |

## Recommended next three
1. **Writing cadence with per-post share images.** It costs the least for the most SEO, and the infrastructure (feed, sitemap, schema, JSON-LD) is now correct.
2. **One client-side tool: the subnet/CIDR calculator.** It is the strongest "show, don't tell" for his networking background, and it is fully static.
3. **`/now` page.** It is cheap and honest, and it keeps the home page fresh without inventing news.

## Explicitly not recommended now
Anything that needs a database, scheduled jobs, paid AI APIs or user accounts. These break the static, Vercel-Free-friendly architecture and add operational work without proving more skill than the items above.
