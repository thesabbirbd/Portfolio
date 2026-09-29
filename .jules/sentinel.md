## 2024-05-20 - [XSS Fix in LiquidSurface]
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in `src/components/lightswind/liquid-surface.tsx` due to `dangerouslySetInnerHTML={{ __html: heading }}` allowing un-sanitized user input.
**Learning:** External UI library components often assume inputs are sanitized before being passed. Ensure all components with `dangerouslySetInnerHTML` validate or sanitize input, even if they aren't currently exposed to user input directly.
**Prevention:** Use `DOMPurify.sanitize()` (or `isomorphic-dompurify` for Next.js) for any dynamically rendered HTML via `dangerouslySetInnerHTML`.
## 2026-09-29 - [Added Security Headers]
**Vulnerability:** Missing standard HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.), which could leave the app vulnerable to clickjacking or MIME-type sniffing.
**Learning:** Next.js applications can easily configure security headers globally in `next.config.ts`. A wildcard `source: "/:path*"` applies the headers to all routes.
**Prevention:** Include standard security headers in Next.js configuration by default on new projects.
