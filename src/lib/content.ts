import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type CaseStudy = CollectionEntry<'caseStudies'>;
export type Event = CollectionEntry<'events'>;

/** Card model shared by blog posts, events and case studies. */
export type ResourceItem = {
  kind: 'Blog' | 'Event' | 'Case study';
  title: string;
  href: string;
  image?: { src: string; width: number; height: number };
  date: Date;
  meta?: string;
  excerpt?: string;
};

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) => b.data.date.getTime() - a.data.date.getTime();

export const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatShortDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export async function allPosts() { return (await getCollection('blog')).sort(byDateDesc); }
export async function allCaseStudies() { return (await getCollection('caseStudies')).sort(byDateDesc); }

/** Events newest first by when they take place (falls back to publish date). */
export async function allEvents() {
  const when = (e: Event) => (e.data.startDate ?? e.data.date).getTime();
  return (await getCollection('events')).sort((a, b) => when(b) - when(a));
}

export function eventStatus(e: Event, now = new Date()) {
  const end = e.data.endDate ?? e.data.startDate;
  if (!end) return 'past' as const;
  const endOfDay = new Date(end.getTime() + 24 * 3600 * 1000);
  const start = e.data.startDate ?? end;
  if (now > endOfDay) return 'past' as const;
  if (now >= start) return 'live' as const;
  return 'upcoming' as const;
}

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));

export const postItem = (p: Post): ResourceItem => ({
  kind: 'Blog', title: p.data.title, href: `/${p.id}/`, image: p.data.image, date: p.data.date,
  meta: `${readingTime(p.body)} min read`, excerpt: p.data.excerpt,
});
export const eventItem = (e: Event): ResourceItem => ({
  kind: 'Event', title: e.data.title, href: `/event/${e.id}/`, image: e.data.image, date: e.data.startDate ?? e.data.date,
  meta: [e.data.dateText, e.data.location].filter(Boolean).join(' · '),
});
export const caseItem = (c: CaseStudy): ResourceItem => ({
  kind: 'Case study', title: c.data.title, href: `/case-study/${c.id}/`, image: c.data.image, date: c.data.date,
  meta: c.data.metrics.slice(0, 2).map((m) => `${m.label} ${m.value}`).join(' · '),
});

/** Latest posts and events together, as in the live homepage "Our Highlights" carousel. */
export async function latestHighlights(n: number) {
  const posts = (await allPosts()).map(postItem);
  const events = (await getCollection('events')).map((e) => ({ ...eventItem(e), date: e.data.date }));
  return [...posts, ...events].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, n);
}

export async function featuredCaseStudies(n = 3) { return (await allCaseStudies()).slice(0, n); }

/** Posts sharing the most tags with `post`, newest first. */
export async function relatedPosts(post: Post, n = 3) {
  const tags = new Set(post.data.tags.map((t) => t.slug));
  return (await allPosts())
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: p.data.tags.filter((t) => tags.has(t.slug)).length }))
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, n)
    .map((x) => x.p);
}

export async function allTags() {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const p of await allPosts()) for (const t of p.data.tags) {
    const cur = map.get(t.slug) ?? { ...t, count: 0 };
    cur.count++;
    map.set(t.slug, cur);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
