/**
 * Counters shown on the site.
 *
 * Content pass 1 (Oct 2026) removed the scale counters from the homepage, About,
 * Publishers and Solutions pages (requests per day/month, SSP and partner counts,
 * fill rates, ROI and uplift percentages): the live pages contradicted each other
 * and the business would rather publish fewer numbers than ones it cannot defend.
 * Add a counter back only once its figure and wording are confirmed.
 */
export type Stat = { value: number; decimals?: number; prefix?: string; suffix: string; label: string; detail?: string };

/** VoiseTech.AI hero counters (source: /voisetechai/ animation script). Pending review. */
export const aiStats: Stat[] = [
  { value: 50, suffix: '+', label: 'Technologies mastered' },
  { value: 100, suffix: '%', label: 'Production-ready output' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Global infrastructure' },
  { value: 100, suffix: '+', label: 'LLM integrations' },
];

export const formatStat = (s: Stat) =>
  `${s.prefix ?? ''}${s.decimals ? s.value.toFixed(s.decimals) : s.value}${s.suffix}`;
