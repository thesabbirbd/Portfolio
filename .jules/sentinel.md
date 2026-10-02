## 2024-05-20 - [XSS Fix in LiquidSurface]
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in `src/components/lightswind/liquid-surface.tsx` due to `dangerouslySetInnerHTML={{ __html: heading }}` allowing un-sanitized user input.
**Learning:** External UI library components often assume inputs are sanitized before being passed. Ensure all components with `dangerouslySetInnerHTML` validate or sanitize input, even if they aren't currently exposed to user input directly.
**Prevention:** Use `DOMPurify.sanitize()` (or `isomorphic-dompurify` for Next.js) for any dynamically rendered HTML via `dangerouslySetInnerHTML`.
## 2026-09-29 - [Added Security Headers]
**Vulnerability:** Missing standard HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.), which could leave the app vulnerable to clickjacking or MIME-type sniffing.
**Learning:** Next.js applications can easily configure security headers globally in `next.config.ts`. A wildcard `source: "/:path*"` applies the headers to all routes.
**Prevention:** Include standard security headers in Next.js configuration by default on new projects.
## 2026-09-30 - [Safe Window Open Pattern]
**Vulnerability:** A missing `rel="noopener noreferrer"` attribute equivalent on external `window.open` calls (specifically in UI interaction handlers like dock/command menu) can potentially allow the newly opened window to access the originating window's object via `window.opener`. This is a known cross-origin vulnerability pattern (TabNabbing).
**Learning:** `window.open(url, '_blank')` must always be paired with `noopener,noreferrer` as the third argument to prevent the opened tab from having access to the original page's execution context.
**Prevention:** Always use `window.open(url, '_blank', 'noopener,noreferrer')` when opening untrusted or external links programmatically via JavaScript.
## 2026-10-02 - [Safe JSON-LD in Script Tags]
**Vulnerability:** Inserting `JSON.stringify(jsonLd)` inside `<script type="application/ld+json">` utilizing React's `dangerouslySetInnerHTML` directly allows any `</script>` tag embedded in string values to execute arbitrary scripts (XSS).
**Learning:** Using React's children API (`<script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`) removes `dangerouslySetInnerHTML` while securely applying Unicode escaping of `<` without regressions to Next.js SEO rendering.
**Prevention:** Never use `dangerouslySetInnerHTML` for standard string serialization like JSON. Always pass strings via React children and `.replace(/</g, '\\u003c')` `<` delimiters on `JSON.stringify()` outputs for `ld+json` inside script nodes.
