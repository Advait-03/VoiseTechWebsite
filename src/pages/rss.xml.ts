import type { APIRoute } from 'astro';
import { allPosts } from '../lib/content';
import { SITE } from '../data/site';

/** Blog RSS feed (replaces WordPress /feed/, which redirects here). */
export const GET: APIRoute = async () => {
  const posts = await allPosts();
  const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);
  const items = posts
    .map((p) => {
      const url = `${SITE.url}/${p.id}/`;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.description || p.data.excerpt)}</description>${p.data.tags.map((t) => `<category>${esc(t.name)}</category>`).join('')}</item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Voise Blogs - Voise Tech</title>
<link>${SITE.url}/resources/blog/</link>
<atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
<description>Perspectives on programmatic advertising, CTV and agentic AI from Voise Tech.</description>
<language>en-gb</language>
<lastBuildDate>${(posts[0]?.data.date ?? new Date()).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
