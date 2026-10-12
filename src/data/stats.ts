/**
 * Statistics exactly as published on www.voisetech.com (values read from the
 * counter markup, since the live pages render them as "0" until animated).
 *
 * The live pages disagree with each other (e.g. 60B requests "daily" on the
 * homepage vs "per month" on About, 500B/month on Solutions). Each page keeps
 * its own published wording until the business confirms a single set - 
 * see docs/REVIEW-ITEMS.md.
 */
export type Stat = { value: number; decimals?: number; prefix?: string; suffix: string; label: string; detail?: string };

/** Homepage counters (source: / - "Smarter Advertising. Cleaner Supply." section). */
export const homeStats: Stat[] = [
  { value: 60, suffix: '+', label: 'Billion requests daily' },
  { value: 25, suffix: '+', label: 'SSPs and exchanges' },
  { value: 39.6, decimals: 1, suffix: '%', label: 'Avg. ROI with SPO activation' },
  { value: 200, suffix: '+', label: 'Partners' },
];

/** About page counters (source: /about-us/). */
export const aboutStats: Stat[] = [
  { value: 4, suffix: '', label: 'Global offices', detail: 'USA, UK, UAE, India' },
  { value: 25, suffix: '+', label: 'SSPs and exchanges' },
  { value: 60, suffix: '', label: 'Billion requests per month' },
  { value: 200, suffix: '+', label: 'Global premium publishers' },
];

/**
 * Publisher "Platform Highlights" (sources: /ad-publishers-solutions/ counters and
 * /solutions/ wording). The live publisher page labels its fourth counter
 * "24 Hourse - Global Premium Publishers", a template error; /solutions/ states
 * "Integration Time: Under 24 hours for most formats", which is used here.
 */
export const publisherStats: Stat[] = [
  { value: 150, suffix: '+', label: 'Global demand partners' },
  { value: 90, suffix: '%+', label: 'Fill rates across top geos' },
  { value: 500, suffix: 'B+', label: 'Ad requests processed monthly' },
  { value: 24, prefix: '<', suffix: 'h', label: 'Integration time for most formats' },
  { value: 35, suffix: '%', label: 'Average revenue uplift after onboarding' },
];

/** Solutions "Platform Highlights" (source: /solutions/). */
export const solutionStats: Stat[] = [
  { value: 150, suffix: '+', label: 'Demand access', detail: 'Global demand partners' },
  { value: 90, suffix: '%+', label: 'Fill rates', detail: 'Across top-tier geos' },
  { value: 35, suffix: '%+', label: 'Revenue uplift', detail: 'Average for publishers after onboarding' },
  { value: 500, suffix: 'B+', label: 'Ad requests processed', detail: 'Over 500 billion per month' },
  { value: 24, prefix: '<', suffix: 'h', label: 'Integration time', detail: 'Under 24 hours for most formats' },
];

/** VoiseTech.AI hero counters (source: /voisetechai/ animation script). */
export const aiStats: Stat[] = [
  { value: 50, suffix: '+', label: 'Technologies mastered' },
  { value: 100, suffix: '%', label: 'Production-ready output' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Global infrastructure' },
  { value: 100, suffix: '+', label: 'LLM integrations' },
];

export const formatStat = (s: Stat) =>
  `${s.prefix ?? ''}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix}`;
