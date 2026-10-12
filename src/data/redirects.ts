/**
 * Permanent redirects for legacy WordPress URLs that have no page of their own.
 * Every content URL (pages, posts, case studies, events, tags) keeps its path
 * and needs no redirect. Sources are matched with and without trailing slash.
 */
export const REDIRECTS: Record<string, string> = {
  // Archive / index URLs (WordPress already redirected these)
  '/resources/': '/resources/blog/',
  '/case-study/': '/resources/case-studies/',
  '/event/': '/resources/events/',
  '/voise-product/': '/products/',
  '/category/uncategorised/': '/resources/blog/',
  '/voise_product_category/buyers/': '/ad-buyers-solutions/',
  '/voise_product_category/publishers/': '/ad-publishers-solutions/',
  '/products/buyers/': '/ad-buyers-solutions/',
  '/products/publishers/': '/ad-publishers-solutions/',
  '/gam-360/': '/google-ad-manager-solutions-services/',
  // Feeds and Yoast XML sitemaps
  '/feed/': '/rss.xml',
  '/sitemap_index.xml': '/sitemap-index.xml',
  '/post-sitemap.xml': '/sitemap-index.xml',
  '/page-sitemap.xml': '/sitemap-index.xml',
  '/cb_casestudypost-sitemap.xml': '/sitemap-index.xml',
  '/cb_eventpost-sitemap.xml': '/sitemap-index.xml',
  '/cb_voiseproductpost-sitemap.xml': '/sitemap-index.xml',
  '/category-sitemap.xml': '/sitemap-index.xml',
  '/post_tag-sitemap.xml': '/sitemap-index.xml',
  '/voise_product_category-sitemap.xml': '/sitemap-index.xml',
  // Empty WordPress draft whose SEO title was "Voise AI | Voise Tech" (see docs/REVIEW-ITEMS.md)
  '/abc-draft/': '/voisetechai/',
  // Redirects that exist on the live site (WordPress Redirection plugin / slug changes).
  // The full plugin list needs a WP admin export — see docs/REVIEW-ITEMS.md.
  '/home/': '/',
  '/about/': '/about-us/',
  '/contact/': '/contact-us/',
  '/blog/': '/resources/blog/',
  '/case-studies/': '/resources/case-studies/',
  '/events/': '/resources/events/',
  '/testimonials/': '/resources/testimonials/',
  '/voise-ssp/': '/supply-side-platform-advertising/',
  '/voise-pre-bid/': '/pre-bid/',
  '/voise-content-production/': '/content-production-solutions/',
  '/voise-creative-services/': '/creative-services/',
  '/voise-audienceiq/': '/audience-segmentation-tool/',
  '/voise-curation-auction-packages/': '/auction-platform/',
  // Live site sends these to stray image attachments; pointed at the product instead.
  '/voise-planning-tool/': '/advertising-planning-tool/',
  '/voise-multicultural-opportunity/': '/multicultural-advertising-agency/',
  '/voise-curation/': '/auction-platform/',
  // "Voise DSP" has no published page (live URL redirects to an image) — needs a decision.
  '/voise-dsp/': '/products/',
  // Items whose WordPress slug differs from their public permalink
  '/why-curation-as-a-service-is-the-future-of-effective-advertising/': '/curation-as-a-service/',
  '/connected-tv-ctv-advertisers/': '/the-2025-gold-rush-why-curated-marketplaces-are-your-brands-next-big-win/',
  '/case-study/kia-case-study-2/': '/case-study/boosting-kias-brand-visibility-with-high-impact-in-app-display-video-ads/',
};

export function redirectFor(pathname: string) {
  const withSlash = pathname.endsWith('/') || /\.\w+$/.test(pathname) ? pathname : `${pathname}/`;
  return REDIRECTS[pathname] ?? REDIRECTS[withSlash] ?? REDIRECTS[pathname.toLowerCase()];
}
