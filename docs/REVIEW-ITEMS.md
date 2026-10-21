# Items requiring business confirmation before launch

Everything below was found during the content audit of www.voisetech.com on 11 October 2026. Nothing has been invented. Where the live site was inconsistent or clearly broken, the redesign takes the conservative option described in each item, and each item needs a decision from VoiseTech.

Priority: **High** means visible or legal/compliance risk; **Medium** means visible but low risk; **Low** means housekeeping.

## Content pass 1: product accuracy (Oct 2026)

Feedback: make Voise AdServer the core technology story, position Video as the Voise Video SDK, show the two DOOH sides, keep Google MCM prominent, and publish fewer numbers rather than ones we cannot defend. Done on the homepage, Products, Voise AdServer, Publishers and Buyers pages, with claim clean-up site-wide. AdServer copy follows the 23 May 2026 architecture walkthrough. **Please confirm (Anushree / Mayur):**

| # | Item | What the site now says |
|---|---|---|
| P1 | **Live vs in development** | Live: OpenRTB 2.5/2.6 RTB ad units, demand partners + line items, reporting (hourly "today" view, reporting API per ad unit). Labelled *in development*: DOOH (CMS + Planning Tool) and Video SDK advanced formats. AI-assisted planning described as product direction. |
| P2 | **Voise Video SDK** | "VAST ad units, Google IMA and PAL integrations, multiple ad formats around publisher content, and player telemetry that feeds the same reporting." Confirm IMA/PAL are live. |
| P3 | **DOOH product names** | "a supply-side CMS for screen owners" and "a Planning Tool for agencies". Supply official names. |
| P4 | **Architecture** | Rust and Python services → Kafka → ClickHouse; MongoDB for configuration; Redis for serving and cache. Approved to publish. |
| P5 | **AdServer capabilities** | Pricing models (rev share, floor + margin, fixed), sellers.json / schain / IPD, deals pass-through, BCAT/BATTR and central lists, pre-bid + post-bid traffic quality, NURL/BURL/ADM tracking, SSAI, caps, role-based access. Written from the walkthrough spec: confirm each is live. |
| P6 | **Product relationships** | SSP, Pre-Bid and buyer products "are being brought onto the same engine". Pre-Bid runs "before Voise AdServer picks the winner". Confirm the wording. |
| P7 | **Numbers removed** | All scale counters (items 1–4 below), "~120 ms", "25+ SSPs", "30+ DSPs", "50%" planning claims, and named DSP/SSP/data-partner lists. Old tech stacks removed from every product page. Add a figure back only once confirmed. |
| P8 | **Still to review** | VoiseTech.AI counters ("100% production-ready", "99.9%", "100+ LLM integrations") and its stack list; About › Responsibility ("GDPR and CCPA compliance", "MRC-accredited verification vendors"); compliance lists and AI/ML claims on the individual SSP, Pre-Bid and buyer product pages. |

## Facts and figures

| # | Priority | Item | What the live site says | What the new site does |
|---|---|---|---|---|
| 1 | Done | **Request volume contradicts itself across pages** | Home: "60+ Billion Requests Daily". About: "60 Billion Requests per Month". Solutions and Publishers: "Over 500 billion per month" / "500B+ Ad Requests Processed Monthly". The About video thumbnail says "40+ Billion Impressions every month". | **Removed** in content pass 1. Re-add only a confirmed figure (`src/data/stats.ts`). |
| 2 | Done | **Partner / publisher / SSP counts differ** | Home: "200+ Partners". About: "200+ Global Premium Publishers". Publishers: "150+ Global Demand Partners". Home and About: "25+ SSPs and Exchanges". About video thumbnail: "180+ SSPs & Exchanges", "25+ Global CTV & DOOH publishers". SSP page: "30+ premium DSPs". | **Removed** in content pass 1. |
| 3 | Done | **ROI figure differs** | Home: "39.6% avg. ROI with SPO Activation". About video thumbnail: "ROI by 32% with SPO activation". | **Removed** in content pass 1. |
| 4 | Done | **Broken stat label on Publishers page** | Counter "24" labelled "Hourse" / "Global Premium Publishers" | **Removed** with the other Publishers counters. |
| 5 | Medium | **Samsung case study contains Kia's figures** | The Samsung "Metric Results" paragraph cites "viewability benchmark of 71.88%", "CTR of 0.21%" and an "auto category campaign", which are the Kia case study's numbers. The Samsung metrics list says CTR 0.74%. | Migrated as published. **Correct the paragraph** in `src/content/case-studies/samsungs-cross-screen-reach.md`. |
| 6 | Medium | **Swarovski VTR** | "VTR – 0.85 %"; every other case study reports VTR around 85–92%. | Migrated as published. Confirm whether this should be 85%. |
| 7 | Medium | **Post URL does not match its title** | `/the-2025-gold-rush-why-curated-marketplaces-are-your-brands-next-big-win/` serves a post titled "Why Connected TV (CTV) is a Game-Changer for Advertisers?" | URL preserved for SEO. Consider whether this was intentional. |
| 8 | Medium | **Google partnership wording** | "We Are a certified Google MCM Partner", "Certified Access to Google Supply", "As a Google Authorized Buyer…", "certified Google Ad Manager 360 services" | Kept verbatim. Confirm the current certification status and the exact programme names Google permits. |
| 9 | Medium | **Compliance claims** | "Fully GDPR, CCPA, and COPPA compliant" (Buyers), "GDPR, CCPA, and LGPD compliant", "TCF 2.2", "MRC-accredited IVT detection" (products), "IAB DEI-compliant" (Multicultural) | Kept verbatim. Confirm with legal/compliance. |
| 10 | Low | **"Since 2023"** (About) | Company history | Kept. There is no timeline content on the live site, so none was added. Supply milestones if a timeline is wanted. |

## Content and assets

| # | Priority | Item | Detail | Action |
|---|---|---|---|---|
| 11 | High | **Voise TV page** (`/voise-tv/`) | Indexed in the live sitemap but not linked anywhere. It is a consumer streaming page with pricing ($6.99–$19.99/month), "190+ countries", "50K+ titles", buttons linking to `#`, and **third-party film posters** (Avengers, Batman, Dune…) whose image paths 404 on the live site. It looks like an unfinished prototype. | **Not migrated** (URL returns 404). Decide: publish (with licensed artwork and real CTAs), redirect, or leave removed. |
| 12 | High | **About › "Our Certificates"** | Lorem Ipsum captions over stock "Certificate of Completion — Alice Taylor" images | **Removed.** Provide real certifications to add a section. Memberships (IAB, IAB UK) and trust partners (HUMAN, IAB Europe TCF, TAG Registered) are shown instead. |
| 13 | High | **"Download Brochure"** (every page) | Modal form missing ("Error: Contact form not found."); link `#.`; no brochure file exists in the media library | **Removed.** Provide a PDF if a brochure CTA is wanted. |
| 14 | Medium | **About › "Our Partners"** | Six copies of the same Dailyhunt logo | **Replaced** with the real 30-logo partner grid |
| 15 | Medium | **Product pages › "Other Products"** | "More than 100 Remote SIM Provisioning platforms implemented around the world." (template filler from another site) | **Removed** |
| 16 | Done | **Yuvraj Munot's LinkedIn link** | Pointed to Maayur Kulthe's profile | Fixed: now linkedin.com/in/yuvrajmunot83/ |
| 17 | Medium | **"Voise DSP"** | Appears in the mobile menu (draft post `?p=1151` returns 404), in case studies ("Voise DSP's precision targeting"), on product pages and on Login ("Our robust DSP") | No DSP page exists. `/voise-dsp/` redirects to `/products/`. Decide whether a DSP page should exist. |
| 18 | Medium | **Partner logo usage** | 30 partner, 16 client and 40 publisher logos appear as on the live site | Shown under the live headings ("Our Partners", "Our Clients", "Publishers"). Confirm each relationship still holds and that logo use is permitted. |
| 19 | Medium | **Vector brand assets** | No SVG logo or square favicon exists (the media library has `voisetechtxt.svg`, which is only "Voise" in an older typeface) | The header uses a crop of the 2182 px PNG. Favicons are upscaled from the 58 × 40 px mark. **Supply an SVG wordmark and favicon.** |
| 20 | Low | **Logo name corrections** | Brief listed "ABP News"; the artwork reads **"ABP Network"**. File `nexen.png` is **Nexxen**. | Named as shown in the artwork |
| 21 | Low | **About › "Responsibility in Action" › "Learn More"** | Linked to `#.` | Now "Read our privacy policy" → `/privacy-policy/`. Confirm or provide a better destination. |
| 22 | Low | **Cocktail Evening RSVP** | Event on 7 Aug 2026 has passed; the RSVP posted to a Google Apps Script | Page migrated with a "registration closed" note; the form was not rebuilt |
| 23 | Low | **All listed events are in the past** | Latest: AdWeek New York, 5–8 Oct 2026 | The events page shows "no upcoming events" with LinkedIn and contact links. Add upcoming events as Markdown files. |
| 24 | Low | **Blog links carry `utm_source=chatgpt.com`** | 11 posts link to external sources with this tracking parameter | Migrated as published. Consider an editorial clean-up. |
| 25 | Low | **Mad Meets event** | Slug `mad-meets-returns-sept-25`, but the date reads "1st July 2025 – 3rd July 2025" | Migrated as published. Confirm the date. |
| 26 | Low | **Contact form "Are you a" options** | Only "Publisher" and "Buyer", while the page invites partners too | Kept as on the live site. Consider adding "Partner / Other" (`src/lib/forms/definitions.ts`). |
| 27 | Low | **Product page tech intro** | Publisher product pages say "built to give **buyers** clarity, speed, and measurable outcomes" | Kept verbatim. Consider "publishers" on those pages. |
| 28 | Low | **New interface copy** | Section framing lines written for the redesign (see CONTENT-INVENTORY.md, "New content written for the redesign") | Review the wording |

## Legal, privacy and tracking

| # | Priority | Item | Detail |
|---|---|---|---|
| 29 | High | **No cookie consent** | The live site loads Google Tag Manager and GA4 without a consent banner. The new site preserves those tags (production only, configurable via `PUBLIC_GTM_ID` / `PUBLIC_GA4_ID`). Under UK GDPR / PECR, analytics cookies generally need prior consent. Add a consent management platform (with Google Consent Mode) or disable the tags until one exists. |
| 30 | High | **Privacy policy placeholder** | Governing law reads "…governed by the laws of **[ENGLAND AND WALES]**" (square-bracket template placeholder) |
| 31 | Medium | **Privacy policy scope** | The policy names a grievance officer (Lokesh Singh) and `privacy@voisetech.com`. Confirm both are current. |
| 32 | Medium | **reCAPTCHA** | The live site uses reCAPTCHA v3. Enabling it on the new site requires the secret key from the Google console (`RECAPTCHA_SECRET_KEY`) and adding the new hostname to the key. |
| 33 | Medium | **Form recipients and SMTP** | Live CF7 recipients could not be read without WP admin access. Default recipient is `business@voisetech.com`; set `CONTACT_TO` / `CAREERS_TO` / `GAM_TO` and the SMTP account before launch. |
| 34 | Medium | **Redirection plugin export** | The live site's Redirection plugin holds redirects that cannot be read without admin access. 17 were found by probing and mirrored. Export the full list from WP admin › Tools › Redirection and add any others to `src/data/redirects.ts`. |
| 35 | Low | **Contact details** | Address (Voise Tech Ltd, 4 Station Avenue, Coventry CV4 9HS, United Kingdom) and `business@voisetech.com` are consistent across the footer, contact page and privacy policy. Confirm they are current. |
