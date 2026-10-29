# THE SABBiR — v4.0.1 · Phase 2 Report: Links & content integrity

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS.** 0 link problems, 0 orphan routes, 23/23 interaction checks, and 9 content-integrity unit tests.

## Content fixes

### 1. Aiyaar title corrected
The brief requires **Chief Product Manager at Aiyaar (CPM)**. The site said "Chief Project Manager" in **19 places**: UI, terminal, command menu, footer, metadata, JSON-LD and keywords.

- **Single source of truth:** `src/data/aiyaar.ts`
  - `role` = "Chief Product Manager (CPM)"
  - `roleTitle` = "Chief Product Manager"
  - `roleShort` = "CPM"
- Everything reads from it:
  - the hero badge, Home featured section, About current-role card, and work history (`/experience`, `/resume`);
  - the IdentityDock profile, global terminal `whoami`, command menu and footer;
  - root and `/aiyaar` metadata, and JSON-LD `jobTitle`/`worksFor`.
- The previous duty line ("project planning, coordination and delivery") was written for the old title and is unverified, so it was **removed**. The role line now states only the title and what the product is. The `/aiyaar` "My role" text states the title and cites the product's own feature guide; no outcomes are claimed.

### 2. "Aiyaar Ltd" changed to "Aiyaar"
No repository source confirms the legal entity name; the brief and the feature guide say "Aiyaar". The verified domain `aiyaar.ltd` is unchanged.

### 3. Brand rules
- **Removed the parenthetical construction** "Md Sabbirul Islam Khan (THE SABBiR)" from the `/aiyaar` description. It now reads "Md Sabbirul Islam Khan, known as THE SABBiR, …".
- **Removed a CSS `uppercase`** that rendered "THE SABBiR" as "THE SABBIR" on `/about`.
- A code comment "requested by Sabbir" now reads "requested by the owner".
- **Rendered-text scan** of `/`, `/about`, `/aiyaar`, `/resume`, `/experience` and `/contact`: 0 incorrect variants. A high-resolution capture confirms the nav logo renders "THE SABBiR" with a lowercase i.

### 4. Social profiles
`src/data/socials.ts` already matched the canonical URLs. Root JSON-LD `sameAs` is now **derived from it**, which fixes the Instagram URL that was missing `www`.

## Making Aiyaar references clickable where they are meaningful
- **The `/experience` lede:** "Aiyaar" now links to `/aiyaar`.
- **Work history** (`/experience` and `/resume`): a new `detailsHref` adds "Details: Aiyaar →" (to `/aiyaar`). The organisation name keeps linking to the official site, so the case page and the official site each go to the right place.
- **IdentityDock profile:** "Aiyaar" links to `/aiyaar`.
- The remaining unlinked mentions are on `/aiyaar` itself (self-links would add nothing). They are listed in the inventory for review.

## Inventory & automated checks

**`scripts/qa/link-inventory.mjs`** (new) reads the hydrated DOM of 25 pages. Results are in `LINK_INVENTORY.md`:
- **1,024 links**, **0 problems**:
  - no empty, `#` or `javascript:` hrefs;
  - no nested anchors;
  - every `_blank` has `rel="noopener noreferrer"`;
  - every internal route returns 200 and every `#anchor` exists;
  - every file link (the CV PDF) returns 200;
  - no typeless form buttons.
- **0 orphans:** every sitemap route has inbound links, from 4 to 24 pages each.
- **17 external destinations**, all well-formed and verified repository URLs.

**`scripts/qa/interaction-audit.mjs`: 23/23**, including 2 new contact-form checks:
- an empty form is blocked by native validation (no fake success);
- a filled form shows the honest "Draft opened in your email app" state, with `mailto:iamthesabbir@gmail.com?subject=Inquiry%3A%20Collaboration&body=…`.

It also covers the command menu, global terminal, search, settings, dock, quick-view dialog, Lab filter, resume print, 404 and RSS.

**`src/data/content-integrity.test.ts`** (new, 9 tests, scans the real source tree):
- the CPM title everywhere, and no "Chief Project Manager" anywhere;
- no parenthetical person+brand construction;
- no standalone "Sabbir"/"SABBIR";
- canonical social URLs;
- journey evidence, work-history and project links resolve to real routes;
- command-menu, terminal and nav targets and their `#anchors` exist;
- no placeholder hrefs.

## "Visit Now" CTAs
The repository contains **no** "Visit Now" labels. The equivalent CTA, "Visit aiyaar.ltd" (Home featured section and `/aiyaar`), works and opens the official site.

## Gate
**PASS.** The link inventory and results are recorded.
