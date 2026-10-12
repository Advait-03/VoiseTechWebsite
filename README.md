# VoiseTech website

Rebuild of [www.voisetech.com](https://www.voisetech.com) (previously WordPress + Elementor) as a fast, accessible static site with a small Node server for forms.

- **Framework:** [Astro 7](https://astro.build). Pages are prerendered to HTML at build time. Only `/api/*` (forms) and the 404 page run on the server.
- **Server:** `@astrojs/node`, standalone mode. Requires Node.js ≥ 22.12.
- **Content:** Markdown files in `src/content/`, imported from WordPress, plus typed data in `src/data/`.
- **No client framework.** Each interaction is a few KB of plain TypeScript. Fonts are self-hosted (Inter, JetBrains Mono).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

In `astro dev`, form submissions are written to `./.submissions/` instead of being emailed. Nothing is sent anywhere.

Production build:

```bash
npm run build
npm run preview      # preview the production build locally
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` (client assets + server) |
| `npm run preview` | Preview the production build locally |
| `npm run import:wp` | Re-import blog posts, case studies and events from the live WordPress REST API (see *Content*). Add `-- --offline` to rebuild from `.wp-cache/` only. |
| `npm run assets:fetch` | Download any `/wp-content/uploads/…` file referenced in `src/` that is missing from `public/` (add `-- --prune` to delete unreferenced ones) |
| `npm run assets:optimize` | Generate responsive WebP variants into `public/_img/` and refresh `src/data/image-manifest.json` |

After adding or changing images, run `assets:fetch` and then `assets:optimize` before building.

## Configuration

Copy `.env.example` to `.env`. Server values are read at **runtime**. `PUBLIC_*` values are inlined at **build** time. Never commit `.env`.

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP account used to email form submissions |
| `MAIL_FROM` | Sender address (must be allowed by the SMTP account) |
| `CONTACT_TO`, `CAREERS_TO`, `GAM_TO` | Recipients per form (comma-separated). Default: `business@voisetech.com` |
| `FORM_DELIVERY` | `smtp` or `file`. Leave empty to auto-select (see below). |
| `PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_MIN_SCORE` | Optional reCAPTCHA v3 (the live site uses site key `6LdU0vor…0m0q`; the secret comes from the Google console) |
| `PUBLIC_GTM_ID`, `PUBLIC_GA4_ID` | Analytics (live IDs: `GTM-W2VGNH5K`, `G-ZVK4H8B2R3`). Loaded in production builds only. |
| `HOST`, `PORT` | Server bind address |
| `FORM_RATE_LIMIT` | Submissions per IP per form per 10 minutes (default 5) |
| `TRUST_PROXY` | `true` only behind a proxy that sets `X-Forwarded-For` |

### Forms

There are three forms, each defined once in `src/lib/forms/definitions.ts`. That definition is used both for rendering and for server-side validation:

- **Contact** (`/contact-us/`) posts to `POST /api/contact/`.
- **Careers** (`/careers/`) posts to `POST /api/careers/`. Cover letter and resume are PDF/DOC/DOCX up to 5 MB each.
- **GAM 360 enquiry** (`/google-ad-manager-solutions-services/`) posts to `POST /api/gam/`. The site/app list upload is optional.

How delivery is chosen:

1. **`smtp`:** used when `SMTP_HOST` is set. Sends an email with the submitter's address as Reply-To, plus any attachments.
2. **`file`:** writes to `./.submissions/`. This is the default in `astro dev`. It stores personal data, so only use it for local testing.
3. **No transport configured in production:** the API returns **503** with a "please email business@voisetech.com" message. Submissions are never silently dropped.

Protection:

- honeypot field and a minimum fill time
- per-IP rate limit
- optional reCAPTCHA v3
- uploads checked by extension, size and file signature (magic bytes)
- Astro's built-in cross-site POST check

After a successful submission the visitor is redirected to `/thank-you/`, as on the WordPress site, so existing conversion tracking keeps working. A `form_submit` event is also pushed to `dataLayer`.

The forms also work without JavaScript. On success the browser gets a 303 to `/thank-you/`; on error it gets a plain error page.

## Content

| What | Where |
|---|---|
| Blog posts (62) | `src/content/blog/*.md` → `/{slug}/` (root URLs preserved) |
| Case studies (20) | `src/content/case-studies/*.md` → `/case-study/{slug}/` |
| Events (20) | `src/content/events/*.md` → `/event/{slug}/` |
| Privacy policy | `src/content/legal/privacy-policy.md` |
| Product pages (9) | `src/data/products.json` → `/{slug}/` via `src/components/ProductPage.astro` |
| Company facts, nav, stats, logos, team, testimonials | `src/data/*.ts` |
| Redirects | `src/data/redirects.ts` (applied by `src/middleware.ts`) |

To **add a post**, create a Markdown file in `src/content/blog/`. The frontmatter is validated by `src/content.config.ts` (`title`, `description`, `date`, `image`, `tags`, …).

To **keep authoring in WordPress**, run `npm run import:wp`. It pulls new and updated posts, case studies and events, mirrors their images, and rewrites links. Entries with `manual: true` in their frontmatter are never overwritten. The importer names entries after their public permalink, not the REST slug.

## Images

Original uploads stay at their WordPress paths under `public/wp-content/uploads/`, so existing image URLs and Google Images entries keep working. Pages use the WebP variants in `public/_img/` through the `<Img>` component, which also sets width and height from the manifest to prevent layout shift.

## Deployment

Deployed on **Vercel** (`@astrojs/vercel` adapter). Pages are static; the form API, redirects and 404 run as serverless functions. Every push to `main` redeploys. Add the SMTP/recipient variables from `.env.example` in Vercel › Project › Settings › Environment Variables. Note: Vercel limits request bodies to 4.5 MB, so a Careers submission with two large files can be rejected; keep uploads small or move file uploads to direct storage if that matters.

Other notes:

- Put the app **behind a reverse proxy or CDN** (Nginx, Cloudflare, etc.) for TLS and **gzip/brotli compression**. The Node server does not compress.
- Cache headers:
  - `/_astro/*` and `/_img/*`: `Cache-Control: public, max-age=31536000, immutable`
  - `/wp-content/uploads/*`: long cache
  - HTML: short cache
- Security headers at the proxy: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. Add a CSP that allows `googletagmanager.com`, `google-analytics.com`, `www.google.com/recaptcha`, `www.gstatic.com` and `www.youtube-nocookie.com`.
- Set `TRUST_PROXY=true` when the proxy sets `X-Forwarded-For`.
- `dist/client/wp-content` holds about 150 MB of original uploads. They are kept for URL continuity, but can be served from object storage or a CDN instead.

## Project structure

```
src/
  components/   UI components (Header, Footer, HeroNetwork, ProductPage, Form, …)
  content/      Markdown content (blog, case-studies, events, legal)
  data/         Typed site data, products.json, redirects, image manifest
  layouts/      BaseLayout (head, analytics, header/footer)
  lib/          Content helpers and form server logic
  pages/        Routes (file-based); pages/api = form endpoints
  scripts/      Client scripts (motion system, forms)
  styles/       global.css design tokens and primitives
scripts/        Import, asset mirroring and image optimisation tooling
docs/           Content inventory, review items, test report
```

## Documentation

- [docs/CONTENT-INVENTORY.md](docs/CONTENT-INVENTORY.md): every legacy URL and where it lives now, plus what was migrated, changed or removed
- [docs/REVIEW-ITEMS.md](docs/REVIEW-ITEMS.md): facts and assets that need business confirmation before launch
- [docs/TEST-REPORT.md](docs/TEST-REPORT.md): functional, responsive, accessibility, performance and SEO test results
