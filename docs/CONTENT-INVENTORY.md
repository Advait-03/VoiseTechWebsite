# Content inventory and URL map

Audit date: 11 October 2026. Sources:

- the Yoast XML sitemaps (185 URLs)
- the WordPress REST API: posts, pages, case studies, events, testimonials, products, tags and media
- the rendered HTML of every page

**Result:** every URL in the live sitemaps resolves on the new site, either at the same path or through a 301. The one exception is `/voise-tv/`; see [REVIEW-ITEMS.md](REVIEW-ITEMS.md).

## Pages

All paths are unchanged.

| URL | Status | Notes |
|---|---|---|
| `/` | Migrated | Hero copy, product overviews, Google MCM section, stats, clients, case studies, testimonials, 30 partner logos, highlights |
| `/about-us/` | Migrated | Story, video (click-to-load YouTube), stats, values, vision and mission, global presence map, 3 leaders and 10 team members, responsibility. Placeholder certificates and duplicate logos removed. |
| `/products/` | Migrated | Publishers, Buyers and Partners blocks. New interactive ecosystem map. |
| `/ad-buyers-solutions/` | Migrated | All 5 buyer products, Google Authorized Buyers, compliance and brand safety. New buyer-journey diagram. |
| `/ad-publishers-solutions/` | Migrated | Platform highlights, 4 publisher products, GAM, formats and channels. New monetisation-flow diagram. |
| `/solutions/` | Migrated | Platform highlights, publisher and buyer overview |
| `/google-ad-manager-solutions-services/` | Migrated | Both partner sections, all 8 deliverables, enquiry form (all live fields) |
| `/careers/` | Migrated | All copy, values, unique points, application form (all live fields, file uploads) |
| `/contact-us/` | Migrated | Address, email, presence, contact form (all live fields) |
| `/login/` | Migrated | Links to `login.voisetech.com` publisher and advertiser portals (both verified 200) |
| `/privacy-policy/` | Migrated | Full text, all 22 sections. Not in the live sitemap; it now is. |
| `/sitemap/` | Rebuilt | HTML sitemap now lists every page, post, case study and event |
| `/thank-you/` | Migrated | Kept as the form-success page (`noindex`) |
| `/voisetechai/` | Migrated | All copy, stats and links to voisetech.ai |
| `/resources/blog/` | Migrated | All 62 posts; topic filters and "load more" (all posts present in HTML) |
| `/resources/events/` | Migrated | 20 events grouped by year, upcoming and past |
| `/resources/case-studies/` | Migrated | 20 case studies plus client logo wall |
| `/resources/testimonials/` | Migrated | 4 testimonials. Broken "Download Brochure" removed. |
| 9 product pages (`/voise-ad-server/`, `/supply-side-platform-advertising/`, `/pre-bid/`, `/content-production-solutions/`, `/auction-platform/`, `/multicultural-advertising-agency/`, `/advertising-planning-tool/`, `/audience-segmentation-tool/`, `/creative-services/`) | Migrated | Every section: tech stack, edge, features, integrations, use cases, compliance, "Why", closing CTA |
| 62 blog posts (`/{slug}/`) | Migrated | Full body, banner, tags, CTA, links. Two posts keep custom permalinks that differ from their WP slug. |
| 20 case studies (`/case-study/{slug}/`) | Migrated | Full body, metrics (structured), banner, publisher logos (all 40 identified and named) |
| 20 events (`/event/{slug}/`) | Migrated | Body, date, location, external links, photo galleries (200 photos). Countdown for upcoming events. |
| 49 tag archives (`/tag/{slug}/`) | Migrated | Generated from post tags |
| `/voise-tv/` | **Not migrated** | See review items |
| `/abc-draft/` | Redirected | Empty draft → `/voisetechai/` |

## Redirects (301)

Defined in `src/data/redirects.ts`. Query strings are preserved.

| From | To |
|---|---|
| `/resources/`, `/category/uncategorised/`, `/blog/` | `/resources/blog/` |
| `/case-study/`, `/case-studies/` | `/resources/case-studies/` |
| `/event/`, `/events/` | `/resources/events/` |
| `/testimonials/` | `/resources/testimonials/` |
| `/voise-product/` | `/products/` |
| `/voise_product_category/buyers/`, `/products/buyers/` | `/ad-buyers-solutions/` |
| `/voise_product_category/publishers/`, `/products/publishers/` | `/ad-publishers-solutions/` |
| `/gam-360/` | `/google-ad-manager-solutions-services/` |
| `/home/`, `/about/`, `/contact/` | `/`, `/about-us/`, `/contact-us/` |
| `/voise-ssp/`, `/voise-pre-bid/`, `/voise-content-production/`, `/voise-creative-services/`, `/voise-audienceiq/`, `/voise-curation-auction-packages/` | Matching product pages (as on the live site) |
| `/voise-planning-tool/`, `/voise-multicultural-opportunity/`, `/voise-curation/` | Matching product pages. On the live site these pointed at stray image attachments. |
| `/voise-dsp/` | `/products/` (no DSP page exists) |
| `/feed/` | `/rss.xml` |
| `/sitemap_index.xml` and the 8 Yoast sub-sitemaps | `/sitemap-index.xml` |
| `/why-curation-as-a-service-is-the-future-of-effective-advertising/`, `/connected-tv-ctv-advertisers/`, `/case-study/kia-case-study-2/` | Their public permalinks (WP slug ≠ permalink) |
| `/abc-draft/` | `/voisetechai/` |

## Assets

| Asset | Count | Treatment |
|---|---|---|
| Partner logos (homepage "Our Partners") | 30 | All included, original files. Names identified from artwork (the live site had alt text on only 19). |
| Client logos | 16 | All included (homepage, case-studies page) |
| Case-study publisher logos | 40 | All included and named |
| Testimonial logos | 4 | All included |
| Memberships / trust badges (IAB, IAB UK, IAB, HUMAN, IAB Europe TCF, TAG) | 6 | All included in the footer and on About |
| Team and leadership photos | 13 | All included |
| Product listing and device images | 13 | Used on solution pages and "Other products" |
| Page photography (Vision, Mission, careers values, GAM, etc.) | ~20 | Used where they support the story |
| Blog, case-study and event feature and banner images | ~200 | All included |
| Event gallery photos | 200 | All included, with lightbox |
| World map (`map_image.svg`) | 1 | Rendered to a 76 KB WebP. Office pin positions taken from the live markup. |
| VoiseTech logo | — | Header uses a crop of the authentic 2182 px logo (the live header used a 172 px raster) |
| About video | 1 | YouTube `-MQV1bk5KHI`, loaded only on click (privacy-enhanced domain) |
| Homepage background video (`bgvideo.mp4`) | 1 | Not used: decorative abstract loop, replaced by the animated stack diagram. File still served at its URL. |
| Christmas logo variants | 3 | Not used (seasonal) |

Every original image remains at its original `/wp-content/uploads/…` URL.

## Removed from the live site

These were removed because they are placeholder content or broken. Each is listed in REVIEW-ITEMS.md.

- About › "Our Certificates": five Lorem Ipsum captions over stock "Certificate of Completion — Alice Taylor" images
- About › "Our Partners": the same Dailyhunt logo repeated six times. Replaced by the real partner wall.
- "Download Brochure" modal on every page: its form was missing ("Error: Contact form not found.") and the link pointed to `#.`
- Product pages › "Other Products" blurb: "More than 100 Remote SIM Provisioning platforms implemented around the world."
- About › "Learn More" link to `#.` (now "Read our privacy policy")
- Product pages › "Your Edge" cards linked to `#`. They are now plain content.

## New content written for the redesign

These are short interface lines with no new factual claims. Please review the wording:

- **Buyers:** "One flow from planning to proof." and the journey stage titles. Each stage paraphrases that product's live copy.
- **Publishers:** "How an impression is monetised." and the stage descriptions (taken from verified product features: 25+ SSPs, ~120 ms, Direct > PMP > Open, 30+ DSPs).
- **Homepage diagram:** labels and captions. The diagram is marked "Illustrative".
- **Resources and listings:**
  - "Voise Blogs" lede: "Perspectives on programmatic advertising, CTV, curation and agentic AI."
  - Events lede and the "no upcoming events" note
  - Testimonials CTA: "Become our next success story."
- **Forms:**
  - privacy notes under each form
  - Careers application note
  - GAM form lede: "Tell us about your inventory and revenue…"
- **System pages:** 404 page copy.
