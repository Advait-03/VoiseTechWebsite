# Test report

**Date:** 11–12 October 2026.

**Build:** the production build (`npm run build`, served by `node dist/server/entry.mjs`), with spot checks on `astro dev`.

**Tools:**
- headless Chromium (gstack `browse`, Playwright 1.62)
- axe-core 4.10
- `curl` and Node scripts for HTTP, link and SEO checks

**Not tested:** Firefox and Safari. See *Limitations*.

## Summary

| Area | Result |
|---|---|
| Routes | 178 static pages built. All 185 live sitemap URLs covered: 176 at the same path, 8 by 301; `/voise-tv/` excluded by decision (REVIEW-ITEMS #11). |
| Redirects | 41 of 41 return **301**, and every target returns **200**. Query strings preserved. |
| Internal links and assets | 1,945 unique internal URLs (`href`, `src`, `srcset`) across 178 pages: **0 broken** |
| Forms (server) | 15 scenarios, all behave as specified |
| Forms (browser) | Validation, error summary, success redirect: pass |
| Accessibility | axe-core WCAG 2.1 A/AA + best practice on 26 pages: **0 violations** (after fixes listed below) |
| Responsive | 320, 390, 768, 1024 and 1440 px: no horizontal page scroll (after fixes) |
| Performance | LCP 0.99 s (home, local), CLS 0.000, 6–11 KB JS and 27–43 KB CSS per page |
| SEO | 127 migrated pages: canonical correct on all; title and meta description identical to the live site on all but the 4 noted |
| Console | No JavaScript errors on any tested page |

## Functional testing

### Routes and HTTP

| Check | Result |
|---|---|
| Key pages (`/`, about, products, solutions, buyers, publishers, careers, contact, login, privacy, sitemap, thank-you, voisetechai, GAM 360, product, blog post, case study, event, tag, resources) | 200 `text/html` |
| `/rss.xml`, `/sitemap-index.xml`, `/robots.txt` | 200 |
| Trailing-slash URLs without the slash (`/about-us`) | 301 → `/about-us/` (as WordPress did) |
| Unknown URLs (`/nope/`, `/case-study/nope/`, `/voise-tv/`) | 404 with branded page |
| `GET /api/contact/` | 405 |
| Legacy URLs (archives, `/gam-360/`, `/feed/`, Yoast sitemaps, `/voise-ssp/`, `/about/`, `/abc-draft/`, slug ≠ permalink posts, …) | 301 to the correct page (41 of 41) |

### Forms (API, production server)

| # | Scenario | Expected | Result |
|---|---|---|---|
| 1 | Valid contact enquiry | 200, delivered | Pass. Written to outbox; URL normalised to `https://example.com/`; HTML escaped in the email body. |
| 2 | Empty / invalid contact fields | 422 with a message per field | Pass (name, email, phone, country, type) |
| 3 | Honeypot field filled | 200, **not** delivered | Pass |
| 4 | Submitted faster than 2.5 s | 200, **not** delivered | Pass |
| 5 | No-JS form post (valid) | 303 → `/thank-you/` | Pass |
| 6 | No-JS form post (invalid) | HTML error page | Pass |
| 7 | Cross-site browser post | 403 | Pass (Astro origin check) |
| 8 | Rate limit (6th request in 10 min, limit 5) | 429 | Pass |
| 9 | Careers with valid PDF cover letter and resume | 200, both attachments delivered | Pass (original filenames kept, sanitised) |
| 10 | Careers with fake `.pdf` (wrong signature) and `.txt` | 422 | Pass: "doesn't look like a valid PDF or Word document" / "Please upload a PDF, DOC or DOCX file" |
| 11 | Careers with a 5.3 MB file | 422 | Pass: "larger than 5 MB" |
| 12 | Careers without files | 422 | Pass (both required) |
| 13 | GAM enquiry with optional site list | 200, attachment delivered | Pass |
| 14 | Option values with hyphen instead of en dash | Accepted, stored as canonical option | Pass |
| 15 | Production with no SMTP and no `FORM_DELIVERY` | 503 with direct-email fallback | Pass (never silently dropped) |

**SMTP delivery was not tested.** No mail server credentials are available. The SMTP path uses nodemailer with the same message builder that the file-outbox tests exercised. Test it once credentials are configured (REVIEW-ITEMS #33).

### Forms (browser)

- **Empty submit:** an error summary appears and receives focus. It lists the 4 required fields with links to each; the fields get `aria-invalid` and inline messages.
- **Valid submit:** a loading state shows, then the browser redirects to `/thank-you/` and the submission is stored.
- **Field behaviour:** inline validation runs on blur and is live while correcting. File inputs show the chosen file name and size and reject wrong types and oversized files client-side.

### Interactive components

| Component | Check | Result |
|---|---|---|
| Header mega menu | Click / hover-intent opens; Enter opens; Tab moves into the panel; Escape closes and returns focus to the trigger; outside click closes | Pass |
| Mobile menu | Opens full-screen; page scroll locked; accordion groups; Escape closes and returns focus | Pass |
| Sticky header | Frosted after scroll; hides on scroll down, returns on scroll up; never hides while a menu is open | Pass |
| Product section nav | Sticky; active section tracked; stops before the closing CTA | Pass |
| Blog listing | 12 shown, "Load more" → 24; topic filter (CTV → 3) with `role="status"` announcement; without JS all 61 are present | Pass |
| Event gallery | Lightbox (`<dialog>`) opens; arrow keys navigate; Escape closes; focus returns to the thumbnail | Pass |
| Partner marquee | Pause button stops animation (`aria-pressed=true`); pauses on hover and focus; pauses offscreen; logo names in DOM for screen readers | Pass |
| Testimonials | Next/previous, dots, arrow keys; inactive slides `aria-hidden`; auto-advance stops on interaction | Pass |
| About video | Nothing loads from YouTube until click; then `youtube-nocookie.com` embed | Pass |
| Countdown | Rendered only for upcoming events; badge re-checks status in the browser | Pass (no upcoming events at test time) |
| Hero diagram | Animates only while visible and the tab is active; hover/focus on any node highlights its route and shows its description; nodes are links | Pass |

## Responsive testing

Viewports tested: **320 × 700, 390 × 844, 768 × 1024, 1024 × 768 and 1440 × 900**.

Full-page visual review at 1440 (all page templates) and 390 (home, product, contact). Programmatic overflow checks covered 12 representative pages at each width.

Issues found and fixed during testing:
- homepage marquee rows and testimonial slides caused horizontal scroll on mobile
- the VoiseTech.AI hero was wider than the screen on mobile
- the About "Precision. Power. Performance." triad overflowed at tablet width
- long breadcrumbs overflowed at 320 px
- the hero diagram's "Curated deals" label collided with its dot on phones
- all single-column mobile grids were changed to `minmax(0, 1fr)` to prevent content-driven overflow

## Accessibility

- **axe-core**, tags `wcag2a, wcag2aa, wcag21aa, best-practice`: **0 violations** on 26 pages. They were:
  - home, about, products, 9 product templates (sampled: ad server), buyers, publishers, solutions, contact, careers, GAM, login
  - the blog listing and a post
  - events, an event and the cocktail-evening event
  - case studies and a case study
  - testimonials, a tag page, voisetechai, privacy, sitemap, thank-you, 404

  Fixed along the way:
  - small grey metadata text failed contrast (raised `--ink-3` to `#69707d`, 4.6:1)
  - nested `<aside>` landmarks
- **Keyboard:** the skip link is the first Tab stop and is visible on focus. All menus, accordions, carousels, the lightbox and forms are operable by keyboard. Visible focus rings throughout.
- **Reduced motion** (emulated `prefers-reduced-motion: reduce`):
  - no content hidden
  - reveal animations off; counters show final values
  - hero diagram shows a static snapshot
  - marquee becomes a static grid; ticker and CTA lines stop
- **Without JavaScript:** all content is visible (reveal start states apply only once the motion script runs, with a 2.5 s safety fallback). Navigation links, forms (native POST), blog posts and galleries all work.
- **Semantics:**
  - one H1 per page; imported article headings normalised to start at H2
  - landmarks: header, nav, main, footer
  - form labels, `aria-describedby` for help and error text, error summary with `role="alert"`
  - descriptive alt text on content images; decorative images use `alt=""`
  - all 86 logos named

## Performance

Measured locally on the production server (uncompressed: the Node server does not gzip, so production should sit behind a compressing proxy or CDN).

| Page | HTML | JS | CSS | Fonts | Requests | DOMContentLoaded |
|---|---|---|---|---|---|---|
| Home | 127 KB | 11 KB | 43 KB | 113 KB | 9 + images | 419 ms (first load) |
| About | 85 KB | 6 KB | 32 KB | 113 KB | 9 | 100 ms |
| Product (Ad Server) | 67 KB | 6 KB | 39 KB | 113 KB | 15 | 110 ms |
| Blog listing | 132 KB | 6 KB | 27 KB | 113 KB | 30 | 102 ms |
| Blog post | 51 KB | 6 KB | 38 KB | 113 KB | 13 | 93 ms |

- **Home:** LCP 0.99 s (the H1); CLS **0.000**. Every image has intrinsic width and height from the manifest.
- **Images:** responsive WebP variants (1,369 generated) with `srcset`/`sizes`, lazy-loaded below the fold. 142 MB of originals is kept only for legacy URLs.
- **Fonts:** self-hosted, with the Latin subset preloaded and `font-display: swap`.
- **Motion:** decorative loops pause when offscreen or when the tab is hidden; animation uses `transform`, `opacity` and SVG attributes only.

## SEO

- 127 migrated pages were compared with the live HTML:
  - **canonical:** correct on all 127
  - **titles:** identical on 123
  - **meta descriptions:** identical on 123
- The 4 differences:
  - `/privacy-policy/`: the live page had no title; it now has "Privacy Policy | Voise Tech"
  - three listing pages: titles were restored to the live values after this check
  - the cocktail-evening description no longer says "Register for…" because the event is over
- No page is `noindex` except `/thank-you/` and 404 (as on the live site).
- **Sitemap:** `/sitemap-index.xml` is generated automatically and excludes thank-you and 404. `robots.txt` points to it, and the old Yoast sitemap URLs 301 to it.
- **Structured data (JSON-LD):**
  - every page: Organization, WebSite, WebPage and BreadcrumbList
  - blog posts: BlogPosting
  - case studies: Article
  - events: Event
  - product pages: Product
  - GAM page: Service
  - contact page: ContactPage
  - testimonials: Review
- **Open Graph and Twitter:** tags on every page. The default social image is a new 1200 × 630 card built from the authentic logo; the live site used a 58 × 40 favicon. Articles use their feature image.
- **RSS:** `/rss.xml`; `/feed/` redirects to it.

## Limitations

- **Browsers:** tested in Chromium only. The CSS uses widely supported features: `clamp`, `:has` (non-critical), `text-wrap` (progressive), `<dialog>`, and `details[name]` (exclusive accordion degrades to independent panels). Verify in Safari and Firefox before launch.
- **SMTP email and reCAPTCHA:** not exercised end to end (no credentials).
- **Analytics:** GTM/GA4 only load in production builds with the IDs set. Firing was not verified.
- **External links:** the 256 external URLs (mostly blog sources) were not checked.
